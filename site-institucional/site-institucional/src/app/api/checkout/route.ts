import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/auth";
import { getProductById, resolvePrice } from "@/lib/products";
import { paddle, isPaddleConfigured } from "@/lib/paddle";
import { isDatabaseConfigured } from "@/lib/db";
import { createPendingOrder, type OrderItem } from "@/lib/db/queries";
import { siteConfig } from "@/lib/site-config";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export const runtime = "nodejs";

/**
 * Cria a transacção de checkout na Paddle.
 *
 * Regra de ouro: o cliente envia apenas `{ productId, quantity, selection }`.
 * Nome, modo de faturação e — a parte que importa aqui — o **preço**, são
 * sempre recalculados no servidor a partir do catálogo com `resolvePrice()`,
 * nunca lidos de um valor que o pedido tenha trazido. Um produto configurável
 * (desenvolvimento web, IA) tem o preço final determinado pelas opções
 * escolhidas — é a escolha que confiamos, não o total que dela resultaria no
 * cliente. Isto impede que alguém intercepte o pedido e compre um site
 * institucional completo pelo preço da opção mais barata.
 *
 * A Paddle não tem um catálogo espelhado com os preços do configurador —
 * cada transacção usa "non-catalog items": preço e produto vão inline no
 * pedido, tal como aconteciam com o `price_data` do Stripe.
 */

const configSelectionSchema = z.union([
  z.object({
    kind: z.literal("features"),
    optionIds: z.array(z.string().min(1)).max(40),
  }),
  z.object({
    kind: z.literal("tier"),
    levelIndex: z.coerce.number().int().min(0).max(20),
  }),
]);

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1).max(20),
        selection: configSelectionSchema.optional(),
      })
    )
    .min(1)
    .max(20),
});

export async function POST(request: Request) {
  const locale = await getLocale();
  const t = getDictionary(locale);

  // Criar transacções na Paddle custa dinheiro e quota — limitamos antes de tudo.
  const limit = await rateLimit("checkout");
  if (!limit.ok) {
    return NextResponse.json(
      { error: await rateLimitMessage(limit.retryAfter) },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  if (!isPaddleConfigured()) {
    return NextResponse.json(
      { error: t.checkoutApi.paymentsNotConfigured },
      { status: 503 }
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: t.checkoutApi.invalidCart }, { status: 400 });
  }

  const resolved = parsed.data.items.flatMap((line) => {
    const product = getProductById(line.productId);
    if (!product || product.priceRange === null) return [];

    const resolution = resolvePrice(product, line.selection);
    if (!resolution.ok) return [];

    return [
      {
        product,
        quantity: line.quantity,
        price: resolution.price,
        summary: resolution.summary,
      },
    ];
  });

  if (resolved.length === 0) {
    return NextResponse.json(
      { error: t.checkoutApi.noItemsAvailable },
      { status: 400 }
    );
  }

  // A Paddle não mistura pagamentos únicos e subscrições na mesma transacção.
  const hasSubscription = resolved.some((line) => line.product.billing === "monthly");
  const hasOneTime = resolved.some((line) => line.product.billing === "one-time");
  if (hasSubscription && hasOneTime) {
    return NextResponse.json(
      { error: t.checkoutApi.mixedBillingError },
      { status: 400 }
    );
  }

  const session = await getSession();

  try {
    const transaction = await paddle().transactions.create({
      collectionMode: "automatic",
      currencyCode: siteConfig.currency,
      customData: {
        userId: session?.user?.id ?? "",
        productIds: resolved.map((line) => `${line.product.id}x${line.quantity}`).join(","),
      },
      items: resolved.map((line) => ({
        quantity: line.quantity,
        price: {
          description: lineDisplayName(line),
          unitPrice: {
            amount: String(line.price),
            currencyCode: siteConfig.currency,
          },
          ...(line.product.billing === "monthly"
            ? { billingCycle: { interval: "month" as const, frequency: 1 } }
            : {}),
          product: {
            name: lineDisplayName(line),
            description: line.product.summary,
            // Categorias como "professional-services" exigem aprovação extra
            // da Paddle por conta; "standard" é a única que vem sempre
            // aprovada, em sandbox e ao passar para live.
            taxCategory: "standard",
          },
        },
      })),
    });

    // Regista a encomenda como pendente antes de o cliente abrir o overlay de
    // checkout. Só o webhook a promove a "paga" — a página de sucesso não é
    // prova de pagamento.
    if (isDatabaseConfigured()) {
      const items: OrderItem[] = resolved.map((line) => ({
        productId: line.product.id,
        name: lineDisplayName(line),
        quantity: line.quantity,
        unitAmount: line.price,
        billing: line.product.billing,
      }));

      await createPendingOrder({
        userId: session?.user?.id ?? null,
        // Para quem inicia sessão sabemos o e-mail já aqui; um visitante
        // anónimo só o indica dentro do overlay da Paddle — o webhook vai
        // buscá-lo então ao cliente Paddle criado nesse momento.
        email: session?.user?.email ?? "",
        paymentSessionId: transaction.id,
        amountTotal: resolved.reduce((total, line) => total + line.price * line.quantity, 0),
        currency: siteConfig.currency.toLowerCase(),
        items,
      }).catch((error) => {
        // Não bloqueamos a compra por falha de escrita: o webhook volta a
        // tentar e a Paddle mantém o registo canónico da transação.
        console.error("[checkout] falha ao registar encomenda pendente:", error);
      });
    }

    return NextResponse.json({
      transactionId: transaction.id,
      customerEmail: session?.user?.email ?? null,
    });
  } catch (error) {
    console.error("[checkout] falha ao criar transacção Paddle:", error);
    return NextResponse.json(
      { error: t.checkoutApi.paymentInitFailed },
      { status: 500 }
    );
  }
}

/**
 * Nome da linha para a Paddle e para o histórico de encomendas: o produto,
 * seguido da configuração escolhida quando existe — ex.: "Site Institucional
 * — Até 6 páginas, Design 100% original".
 */
function lineDisplayName(line: { product: { name: string }; summary: readonly string[] }): string {
  return line.summary.length > 0
    ? `${line.product.name} — ${line.summary.join(", ")}`
    : line.product.name;
}

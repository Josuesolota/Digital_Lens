import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/auth";
import { getProductById, resolvePrice } from "@/lib/products";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { isDatabaseConfigured } from "@/lib/db";
import { createPendingOrder, type OrderItem } from "@/lib/db/queries";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Cria a sessão de checkout do Stripe.
 *
 * Regra de ouro: o cliente envia apenas `{ productId, quantity, selection }`.
 * Nome, modo de faturação e — a parte que importa aqui — o **preço**, são
 * sempre recalculados no servidor a partir do catálogo com `resolvePrice()`,
 * nunca lidos de um valor que o pedido tenha trazido. Um produto configurável
 * (desenvolvimento web, IA) tem o preço final determinado pelas opções
 * escolhidas — é a escolha que confiamos, não o total que dela resultaria no
 * cliente. Isto impede que alguém intercepte o pedido e compre um site
 * institucional completo pelo preço da opção mais barata.
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
  // Criar sessões no Stripe custa dinheiro e quota — limitamos antes de tudo.
  const limit = await rateLimit("checkout");
  if (!limit.ok) {
    return NextResponse.json(
      { error: rateLimitMessage(limit.retryAfter) },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Pagamentos ainda não estão configurados. Contacte-nos para concluir o pedido." },
      { status: 503 }
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Carrinho inválido." }, { status: 400 });
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
      { error: "Nenhum dos itens do carrinho está disponível para compra online." },
      { status: 400 }
    );
  }

  // O Stripe não mistura pagamentos únicos e subscrições na mesma sessão.
  const hasSubscription = resolved.some((line) => line.product.billing === "monthly");
  const hasOneTime = resolved.some((line) => line.product.billing === "one-time");
  if (hasSubscription && hasOneTime) {
    return NextResponse.json(
      {
        error:
          "Serviços mensais e pagamentos únicos têm de ser finalizados em compras separadas.",
      },
      { status: 400 }
    );
  }

  const session = await getSession();

  try {
    const checkout = await stripe().checkout.sessions.create({
      mode: hasSubscription ? "subscription" : "payment",
      locale: "pt",
      // Pré-preenche o e-mail de quem já tem sessão iniciada.
      customer_email: session?.user?.email ?? undefined,
      billing_address_collection: "required",
      allow_promotion_codes: true,
      line_items: resolved.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: siteConfig.currency.toLowerCase(),
          unit_amount: line.price,
          ...(line.product.billing === "monthly"
            ? { recurring: { interval: "month" as const } }
            : {}),
          product_data: {
            name: lineDisplayName(line),
            description: line.product.summary,
          },
        },
      })),
      metadata: {
        userId: session?.user?.id ?? "",
        productIds: resolved.map((line) => `${line.product.id}x${line.quantity}`).join(","),
      },
      success_url: absoluteUrl("/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}"),
      cancel_url: absoluteUrl("/carrinho?cancelado=1"),
    });

    if (!checkout.url) {
      throw new Error("O Stripe não devolveu um URL de checkout.");
    }

    // Regista a encomenda como pendente antes do redireccionamento. Só o
    // webhook a promove a "paga" — a página de sucesso não é prova de pagamento.
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
        email: session?.user?.email ?? checkout.customer_email ?? "",
        stripeSessionId: checkout.id,
        amountTotal: resolved.reduce((total, line) => total + line.price * line.quantity, 0),
        currency: siteConfig.currency.toLowerCase(),
        items,
      }).catch((error) => {
        // Não bloqueamos a compra por falha de escrita: o webhook volta a
        // tentar e o Stripe mantém o registo canónico da transação.
        console.error("[checkout] falha ao registar encomenda pendente:", error);
      });
    }

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("[checkout] falha ao criar sessão Stripe:", error);
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento. Tente novamente." },
      { status: 500 }
    );
  }
}

/**
 * Nome da linha para o Stripe e para o histórico de encomendas: o produto,
 * seguido da configuração escolhida quando existe — ex.: "Site Institucional
 * — Até 6 páginas, Design 100% original".
 */
function lineDisplayName(line: { product: { name: string }; summary: readonly string[] }): string {
  return line.summary.length > 0
    ? `${line.product.name} — ${line.summary.join(", ")}`
    : line.product.name;
}

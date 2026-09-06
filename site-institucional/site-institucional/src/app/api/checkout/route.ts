import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/auth";
import { getProductById } from "@/lib/products";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { isDatabaseConfigured } from "@/lib/db";
import { createPendingOrder, type OrderItem } from "@/lib/db/queries";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

/**
 * Cria a sessão de checkout do Stripe.
 *
 * Regra de ouro: o cliente envia apenas `{ productId, quantity }`. Nome, preço
 * e modo de faturação são lidos do catálogo no servidor — nunca do pedido —
 * para que ninguém possa comprar um site institucional por 1 cêntimo.
 */

const bodySchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1).max(20),
      })
    )
    .min(1)
    .max(20),
});

export async function POST(request: Request) {
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
    if (!product || product.price === null) return [];
    return [{ product, quantity: line.quantity, price: product.price }];
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
            name: line.product.name,
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
        name: line.product.name,
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

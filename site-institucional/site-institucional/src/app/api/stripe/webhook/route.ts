import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { isDatabaseConfigured } from "@/lib/db";
import {
  findOrderBySession,
  markOrderFailed,
  markOrderPaid,
} from "@/lib/db/queries";
import { sendOrderNotification, sendOrderReceipt } from "@/lib/email";

export const runtime = "nodejs";
// O corpo tem de chegar intacto para a verificação da assinatura — nada de cache.
export const dynamic = "force-dynamic";

/**
 * Webhook do Stripe — a única fonte de verdade sobre pagamentos.
 *
 * Configurar no dashboard do Stripe:
 *   URL      https://<dominio>/api/stripe/webhook
 *   Eventos  checkout.session.completed, checkout.session.async_payment_succeeded,
 *            checkout.session.async_payment_failed, checkout.session.expired
 *
 * Os métodos assíncronos (Multibanco) só confirmam no `async_payment_succeeded`,
 * por isso tratamos ambos — e ignoramos `completed` quando ainda está `unpaid`.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Assinatura em falta." }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("[stripe] assinatura inválida:", (error as Error).message);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        // Multibanco/transferência ficam "unpaid" no `completed` — esperamos
        // pelo evento assíncrono para não dar como paga uma referência emitida.
        if (session.payment_status === "unpaid") break;
        await fulfil(session);
        break;
      }

      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object;
        if (isDatabaseConfigured()) {
          await markOrderFailed(session.id);
        }
        break;
      }

      default:
        // Evento não relevante para o negócio — confirmamos a receção na mesma.
        break;
    }
  } catch (error) {
    // Devolver 500 faz o Stripe repetir a entrega, o que é o comportamento
    // desejado: as operações abaixo são idempotentes.
    console.error(`[stripe] falha a processar ${event.type}:`, error);
    return NextResponse.json({ error: "Erro no processamento." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/** Marca a encomenda como paga e dispara os e-mails de confirmação. */
async function fulfil(session: Stripe.Checkout.Session) {
  if (!isDatabaseConfigured()) {
    console.warn("[stripe] sem base de dados — pagamento não persistido:", session.id);
    return;
  }

  await markOrderPaid({
    stripeSessionId: session.id,
    paymentIntent:
      typeof session.payment_intent === "string" ? session.payment_intent : null,
    amountTotal: session.amount_total,
  });

  const order = await findOrderBySession(session.id);
  if (!order) return;

  const email = session.customer_details?.email ?? order.email;
  if (!email) return;

  // Os e-mails são acessórios: uma falha aqui não deve fazer o Stripe repetir
  // o evento (a encomenda já está paga e registada).
  await Promise.allSettled([
    sendOrderReceipt({
      email,
      orderId: order.id,
      amountTotal: order.amount_total,
      currency: order.currency,
      items: order.items,
    }),
    sendOrderNotification({
      email,
      orderId: order.id,
      amountTotal: order.amount_total,
      currency: order.currency,
      items: order.items,
    }),
  ]);
}

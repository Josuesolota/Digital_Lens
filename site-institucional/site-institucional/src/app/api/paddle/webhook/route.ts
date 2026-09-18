import { NextResponse } from "next/server";
import { EventName, type TransactionNotification } from "@paddle/paddle-node-sdk";
import { paddle, isPaddleConfigured } from "@/lib/paddle";
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
 * Webhook da Paddle — a única fonte de verdade sobre pagamentos.
 *
 * Configurar em Paddle > Developer Tools > Notifications:
 *   URL      https://<dominio>/api/paddle/webhook
 *   Eventos  transaction.paid, transaction.completed,
 *            transaction.payment_failed, transaction.canceled
 *
 * `transaction.paid` confirma a cobrança; tratamos também `transaction.completed`
 * pelo mesmo motivo do antigo `async_payment_succeeded` do Stripe — alguns
 * métodos só fecham a transacção um pouco depois de pagos. Ambos chamam
 * `fulfil()`, que é idempotente.
 */
export async function POST(request: Request) {
  if (!isPaddleConfigured() || !process.env.PADDLE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });
  }

  const signature = request.headers.get("paddle-signature");
  if (!signature) {
    return NextResponse.json({ error: "Assinatura em falta." }, { status: 400 });
  }

  const payload = await request.text();

  let event;
  try {
    event = await paddle().webhooks.unmarshal(
      payload,
      process.env.PADDLE_WEBHOOK_SECRET,
      signature
    );
  } catch (error) {
    console.error("[paddle] assinatura inválida:", (error as Error).message);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  try {
    switch (event.eventType) {
      case EventName.TransactionPaid:
      case EventName.TransactionCompleted:
        await fulfil(event.data);
        break;

      case EventName.TransactionPaymentFailed:
      case EventName.TransactionCanceled:
        if (isDatabaseConfigured()) {
          await markOrderFailed(event.data.id);
        }
        break;

      default:
        // Evento não relevante para o negócio — confirmamos a receção na mesma.
        break;
    }
  } catch (error) {
    // Devolver 500 faz a Paddle repetir a entrega, o que é o comportamento
    // desejado: as operações abaixo são idempotentes.
    console.error(`[paddle] falha a processar ${event.eventType}:`, error);
    return NextResponse.json({ error: "Erro no processamento." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/** Marca a encomenda como paga e dispara os e-mails de confirmação. */
async function fulfil(transaction: TransactionNotification) {
  if (!isDatabaseConfigured()) {
    console.warn("[paddle] sem base de dados — pagamento não persistido:", transaction.id);
    return;
  }

  const grandTotal = transaction.details?.totals?.grandTotal;

  await markOrderPaid({
    paymentSessionId: transaction.id,
    paymentReference: transaction.id,
    amountTotal: grandTotal ? Math.round(Number(grandTotal)) : null,
  });

  const order = await findOrderBySession(transaction.id);
  if (!order) return;

  // Um checkout anónimo só entrega o e-mail dentro do overlay da Paddle — não
  // o tínhamos ainda ao criar a encomenda pendente. A Paddle cria sempre um
  // cliente nesse momento, por isso vamos buscá-lo aqui quando falta.
  let email = order.email;
  if (!email && transaction.customerId) {
    try {
      const customer = await paddle().customers.get(transaction.customerId);
      email = customer.email;
    } catch (error) {
      console.error("[paddle] falha ao obter e-mail do cliente:", error);
    }
  }
  if (!email) return;

  // Os e-mails são acessórios: uma falha aqui não deve fazer a Paddle repetir
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

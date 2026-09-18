import "server-only";
import { sql } from "@/lib/db";

/**
 * Acesso a dados. Todas as consultas usam template tags do driver Neon, que
 * parametriza os valores automaticamente — nunca concatenar SQL à mão aqui.
 */

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitAmount: number;
  billing: "one-time" | "monthly";
};

export type OrderRecord = {
  id: string;
  email: string;
  status: "pending" | "paid" | "failed" | "refunded";
  amount_total: number;
  currency: string;
  items: OrderItem[];
  payment_session_id: string;
  created_at: string;
};

// ── Utilizadores ────────────────────────────────────────────────────────────

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const rows = (await sql()`
    select id, name, email, password_hash, created_at
    from users
    where lower(email) = lower(${email})
    limit 1
  `) as UserRecord[];
  return rows[0] ?? null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const rows = (await sql()`
    select id, name, email, password_hash, created_at
    from users
    where id = ${id}::uuid
    limit 1
  `) as UserRecord[];
  return rows[0] ?? null;
}

export async function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<UserRecord> {
  const rows = (await sql()`
    insert into users (name, email, password_hash)
    values (${input.name}, ${input.email.toLowerCase()}, ${input.passwordHash})
    returning id, name, email, password_hash, created_at
  `) as UserRecord[];
  return rows[0];
}

// ── Encomendas ──────────────────────────────────────────────────────────────

/**
 * Regista a encomenda ainda como `pending`, antes de o cliente ser redirigido
 * para o checkout. Só o webhook a promove a `paid` — nunca a página de
 * sucesso, que o utilizador pode abrir sem ter pago.
 */
export async function createPendingOrder(input: {
  userId: string | null;
  email: string;
  paymentSessionId: string;
  amountTotal: number;
  currency: string;
  items: OrderItem[];
}): Promise<void> {
  await sql()`
    insert into orders (user_id, email, payment_session_id, amount_total, currency, items)
    values (
      ${input.userId}::uuid,
      ${input.email},
      ${input.paymentSessionId},
      ${input.amountTotal},
      ${input.currency},
      ${JSON.stringify(input.items)}::jsonb
    )
    on conflict (payment_session_id) do nothing
  `;
}

/** Idempotente: o processador de pagamento pode reenviar o mesmo evento várias vezes. */
export async function markOrderPaid(input: {
  paymentSessionId: string;
  paymentReference: string | null;
  amountTotal: number | null;
}): Promise<void> {
  await sql()`
    update orders
       set status             = 'paid',
           payment_reference  = coalesce(${input.paymentReference}, payment_reference),
           amount_total       = coalesce(${input.amountTotal}, amount_total),
           updated_at         = now()
     where payment_session_id = ${input.paymentSessionId}
       and status <> 'paid'
  `;
}

export async function markOrderFailed(paymentSessionId: string): Promise<void> {
  await sql()`
    update orders
       set status = 'failed', updated_at = now()
     where payment_session_id = ${paymentSessionId}
       and status = 'pending'
  `;
}

export async function findOrdersByUser(userId: string): Promise<OrderRecord[]> {
  return (await sql()`
    select id, email, status, amount_total, currency, items, payment_session_id, created_at
    from orders
    where user_id = ${userId}::uuid
    order by created_at desc
    limit 100
  `) as OrderRecord[];
}

export async function findOrderBySession(
  paymentSessionId: string
): Promise<OrderRecord | null> {
  const rows = (await sql()`
    select id, email, status, amount_total, currency, items, payment_session_id, created_at
    from orders
    where payment_session_id = ${paymentSessionId}
    limit 1
  `) as OrderRecord[];
  return rows[0] ?? null;
}

// ── Contacto e newsletter ───────────────────────────────────────────────────

export async function saveContactMessage(input: {
  name: string;
  email: string;
  subject: string | null;
  message: string;
  source: string;
}): Promise<void> {
  await sql()`
    insert into contact_messages (name, email, subject, message, source)
    values (${input.name}, ${input.email}, ${input.subject}, ${input.message}, ${input.source})
  `;
}

export async function saveNewsletterSubscriber(input: {
  email: string;
  source: string;
}): Promise<void> {
  await sql()`
    insert into newsletter_subscribers (email, source)
    values (${input.email.toLowerCase()}, ${input.source})
    on conflict do nothing
  `;
}

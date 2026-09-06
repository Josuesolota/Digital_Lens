import { neon } from "@neondatabase/serverless";

/**
 * Cliente Postgres (Neon serverless driver — HTTP, sem pool a manter vivo,
 * o que o torna adequado a funções serverless).
 *
 * O cliente é criado de forma preguiçosa para que o `next build` e as páginas
 * puramente estáticas continuem a funcionar num ambiente sem `DATABASE_URL`.
 * Quem precisa da base de dados deve verificar `isDatabaseConfigured()` antes,
 * e degradar com elegância quando ela não existir.
 */

let client: ReturnType<typeof neon> | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function sql() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL não está definida. Configure a ligação Neon nas variáveis de ambiente."
    );
  }
  client ??= neon(process.env.DATABASE_URL);
  return client;
}

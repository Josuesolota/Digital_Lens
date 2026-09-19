import { neon } from "@neondatabase/serverless";

/**
 * Reutiliza a mesma base Neon do site principal (DATABASE_URL) — apenas uma
 * tabela nova e isolada, sem tocar em orders/users.
 */

let client: ReturnType<typeof neon> | null = null;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function sql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não está definida.");
  }
  client ??= neon(process.env.DATABASE_URL);
  return client;
}

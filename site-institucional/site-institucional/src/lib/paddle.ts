import "server-only";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";

/**
 * Cliente Paddle (server-side).
 *
 * Criado de forma preguiçosa para que o build não exija a chave secreta.
 * Nunca importar este módulo a partir de código cliente — `server-only`
 * transforma um import acidental em erro de compilação.
 *
 * `PADDLE_ENV=production` liga à conta real; qualquer outro valor (ou a sua
 * ausência) usa o sandbox — o mesmo default seguro que o Stripe tinha com as
 * chaves `sk_test_`.
 */

let client: Paddle | null = null;

export function isPaddleConfigured(): boolean {
  return Boolean(process.env.PADDLE_API_KEY);
}

export function paddleEnvironment(): Environment {
  return process.env.PADDLE_ENV === "production" ? Environment.production : Environment.sandbox;
}

export function paddle(): Paddle {
  if (!process.env.PADDLE_API_KEY) {
    throw new Error(
      "PADDLE_API_KEY não está definida. Configure as chaves da Paddle nas variáveis de ambiente."
    );
  }
  client ??= new Paddle(process.env.PADDLE_API_KEY, {
    environment: paddleEnvironment(),
  });
  return client;
}

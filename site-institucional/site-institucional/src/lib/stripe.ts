import "server-only";
import Stripe from "stripe";

/**
 * Cliente Stripe (server-side).
 *
 * Criado de forma preguiçosa para que o build não exija a chave secreta.
 * Nunca importar este módulo a partir de código cliente — `server-only`
 * transforma um import acidental em erro de compilação.
 */

let client: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY não está definida. Configure as chaves do Stripe nas variáveis de ambiente."
    );
  }
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY, {
    // Sem `apiVersion` explícita, o SDK usa a versão com que foi publicado —
    // é a escolha que evita divergências entre os tipos e o que a API devolve.
    typescript: true,
    appInfo: { name: "Digital Lens", url: "https://digitallens.vercel.app" },
  });
  return client;
}

import { NextResponse, type NextRequest } from "next/server";

/**
 * Content-Security-Policy com nonce por pedido.
 *
 * Convenção `proxy.ts` do Next.js 16 (substitui o antigo `middleware.ts`).
 *
 * Segue o padrão oficial da Next.js para o App Router: o nonce é propagado no
 * header `x-nonce`, lido pelo layout, e a própria Next.js aplica-o aos scripts
 * que injeta (hidratação, chunks). `strict-dynamic` permite que esses scripts
 * carreguem os seus próprios chunks sem termos de listar cada origem.
 *
 * https://nextjs.org/docs/app/guides/content-security-policy
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://js.stripe.com`,
    // Tailwind e os estilos inline dos gradientes por pilar exigem unsafe-inline
    // em style-src; não há forma de aplicar nonce a atributos `style`.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://*.stripe.com",
    "font-src 'self' data:",
    // O checkout é feito por redireccionamento, mas o Stripe.js contacta a API.
    "connect-src 'self' https://api.stripe.com",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    // PWA: o service worker e o manifest são servidos da própria origem.
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica a todas as rotas excepto:
     *  - ficheiros estáticos internos do Next
     *  - /api (respostas JSON não beneficiam de CSP; o webhook do Stripe precisa
     *    do corpo intacto e de latência mínima)
     *  - assets do PWA servidos de /public
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|icons/|sw.js|manifest.webmanifest|apple-touch-icon.png|og-image.png).*)",
  ],
};

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
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://cdn.paddle.com`,
    // Tailwind e os estilos inline dos gradientes por pilar exigem unsafe-inline
    // em style-src; não há forma de aplicar nonce a atributos `style`.
    "style-src 'self' 'unsafe-inline' https://cdn.paddle.com",
    // `cdn.sanity.io` serve as imagens dos artigos do blog.
    "img-src 'self' blob: data: https://*.paddle.com https://cdn.sanity.io",
    "font-src 'self' data:",
    // O checkout abre num overlay sobre a própria página — o Paddle.js
    // contacta a API da Paddle e carrega o iframe do checkout de um
    // subdomínio paddle.com (varia por região/ambiente, daí o wildcard).
    // O Studio da Sanity (/studio) fala com a API do projecto em tempo real,
    // incluindo por WebSocket.
    "connect-src 'self' https://*.paddle.com https://*.sanity.io wss://*.sanity.io",
    "frame-src https://*.paddle.com",
    // PWA: o service worker e o manifest são servidos da própria origem.
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
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
     *  - /api (respostas JSON não beneficiam de CSP; o webhook da Paddle precisa
     *    do corpo intacto e de latência mínima)
     *  - /studio (o Studio da Sanity usa o seu próprio carregador de módulos,
     *    que não sabe propagar o nosso nonce por pedido aos scripts que
     *    injecta — sob `strict-dynamic` ficariam todos bloqueados. O Studio já
     *    fica protegido pela autenticação da própria Sanity; os headers de
     *    segurança gerais em `next.config.ts` continuam a aplicar-se-lhe)
     *  - assets do PWA servidos de /public
     */
    "/((?!api/|studio|_next/static|_next/image|favicon.ico|icons/|sw.js|manifest.webmanifest|apple-touch-icon.png|og-image.png).*)",
  ],
};

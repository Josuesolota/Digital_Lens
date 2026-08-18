import { NextResponse, type NextRequest } from "next/server";

/**
 * Gera um nonce único por pedido e monta a CSP.
 * Padrão oficial recomendado pela Next.js para App Router:
 * https://nextjs.org/docs/app/guides/content-security-policy
 *
 * O nonce é propagado via header `x-nonce` para o layout (que o lê com
 * `headers()`) e a Next.js aplica-o automaticamente aos seus próprios
 * scripts injetados (hydration, chunks), sem trabalho manual adicional.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    // Aplica a todas as rotas exceto ficheiros estáticos internos do Next
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

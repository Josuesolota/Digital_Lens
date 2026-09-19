import { NextResponse, type NextRequest } from "next/server";

/**
 * Basic Auth para o painel de gestão (/admin) e a sua API. O formulário
 * público (/, /api/apply) fica sempre fora deste matcher — o site foi
 * deliberadamente publicado sem Vercel Authentication para que candidatos
 * consigam abri-lo sem login.
 *
 * Convenção `proxy.ts` do Next.js 16 (substitui o antigo `middleware.ts`).
 */
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export function proxy(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return new NextResponse("Painel de administração não configurado.", {
      status: 503,
    });
  }

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");
    const password = separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : decoded;
    if (password === expected) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Autenticação necessária.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Digital Lens Admin"' },
  });
}

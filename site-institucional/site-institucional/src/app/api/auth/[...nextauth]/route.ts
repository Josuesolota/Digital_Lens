import { handlers } from "@/auth";

// O provider de credenciais usa bcrypt (nativo do Node) — não pode correr no
// runtime edge.
export const runtime = "nodejs";

export const { GET, POST } = handlers;

import { NextResponse } from "next/server";
import { z } from "zod";
import { updateApplicationStatus, APPLICATION_STATUSES } from "@/lib/applications";

export const runtime = "nodejs";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const bodySchema = z.object({
  status: z.enum(APPLICATION_STATUSES),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 422 });
  }

  try {
    await updateApplicationStatus(id, parsed.data.status);
  } catch (error) {
    console.error("[admin] falha ao atualizar estado da candidatura:", error);
    return NextResponse.json({ error: "Não foi possível atualizar." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

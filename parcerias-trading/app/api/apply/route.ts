import { NextResponse } from "next/server";
import { applicationSchema } from "@/lib/validation";
import { sql, isDatabaseConfigured } from "@/lib/db";
import { sendApplicationNotification } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Dados inválidos." },
      { status: 422 }
    );
  }

  if (!isDatabaseConfigured()) {
    console.error("[apply] DATABASE_URL em falta — candidatura não gravada.");
    return NextResponse.json(
      { error: "Serviço temporariamente indisponível. Tente novamente mais tarde." },
      { status: 503 }
    );
  }

  const data = parsed.data;

  try {
    const db = sql();
    await db`
      insert into trading_partnership_applications (
        candidate_type, full_name, company_name, company_tax_id, email, phone,
        profile_type, profile_type_other, trading_experience,
        public_representative_commitment, representative_pitch,
        audience_channels, audience_proof_url, audience_track_record,
        proposed_split, additional_contribution, availability_commitment,
        message, truthful_declaration
      ) values (
        ${data.candidateType}, ${data.fullName}, ${data.companyName || null},
        ${data.companyTaxId || null}, ${data.email.toLowerCase()}, ${data.phone},
        ${data.profileType}, ${data.profileTypeOther || null}, ${data.tradingExperience},
        ${data.publicRepresentativeCommitment}, ${data.representativePitch},
        ${data.audienceChannels}, ${data.audienceProofUrl}, ${data.audienceTrackRecord || null},
        ${data.proposedSplit}, ${data.additionalContribution || null},
        ${data.availabilityCommitment}, ${data.message || null},
        ${data.truthfulDeclaration}
      )
    `;
  } catch (error) {
    console.error("[apply] falha ao gravar candidatura:", error);
    return NextResponse.json(
      { error: "Não foi possível registar a candidatura. Tente novamente." },
      { status: 500 }
    );
  }

  // Falha no e-mail nunca deve impedir a confirmação ao candidato — a
  // candidatura já está gravada na base de dados.
  await sendApplicationNotification({
    candidateType: data.candidateType,
    fullName: data.fullName,
    companyName: data.companyName || null,
    email: data.email,
    phone: data.phone,
    profileType:
      data.profileType === "outro" ? data.profileTypeOther || "outro" : data.profileType,
    tradingExperience: data.tradingExperience,
    representativePitch: data.representativePitch,
    audienceChannels: data.audienceChannels,
    audienceProofUrl: data.audienceProofUrl,
    proposedSplit: data.proposedSplit,
    message: data.message || null,
  });

  return NextResponse.json({ ok: true });
}

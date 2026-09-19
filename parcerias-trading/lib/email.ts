import { Resend } from "resend";

/**
 * Notificação interna quando chega uma candidatura. Degradação graciosa:
 * sem RESEND_API_KEY, a candidatura fica gravada na BD na mesma — só o
 * e-mail é ignorado (fica registado em log).
 */

let client: Resend | null = null;

function resend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

const FROM = process.env.EMAIL_FROM ?? "Digital Lens <onboarding@resend.dev>";
const INTERNAL_TO = process.env.EMAIL_TO ?? "geral@digitallens.ao";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string): string {
  return `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#d3dcec;"><strong style="color:#f4f7ff;">${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

export type ApplicationEmailInput = {
  candidateType: string;
  fullName: string;
  companyName?: string | null;
  email: string;
  phone: string;
  profileType: string;
  tradingExperience: string;
  representativePitch: string;
  audienceChannels: string;
  audienceProofUrl: string;
  proposedSplit: string;
  message?: string | null;
};

export async function sendApplicationNotification(
  input: ApplicationEmailInput
): Promise<{ ok: boolean; skipped?: boolean }> {
  const api = resend();
  if (!api) {
    console.warn("[email] RESEND_API_KEY em falta — notificação ignorada.");
    return { ok: false, skipped: true };
  }

  const html = `<!doctype html>
<html lang="pt">
  <body style="margin:0;padding:32px 16px;background:#06080f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#0e1422;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
      <tr><td style="height:4px;background:linear-gradient(90deg,#0f7a4a,#22c55e,#4d8dff);"></td></tr>
      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 20px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#6d7f9e;">
            Parcerias · Plataformas de Negociação Financeira
          </p>
          <h1 style="margin:0 0 20px;font-size:20px;line-height:1.3;color:#f4f7ff;font-weight:600;">
            Nova candidatura de parceria
          </h1>
          ${row("Tipo de candidato", input.candidateType)}
          ${row("Nome", input.fullName)}
          ${input.companyName ? row("Empresa", input.companyName) : ""}
          ${row("E-mail", input.email)}
          ${row("Telefone", input.phone)}
          ${row("Perfil", input.profileType)}
          ${row("Experiência em trading", input.tradingExperience)}
          ${row("Compromisso como representante/co-fundador", input.representativePitch)}
          ${row("Canais / audiência", input.audienceChannels)}
          ${row("Prova de audiência", input.audienceProofUrl)}
          ${row("Divisão de lucros proposta", input.proposedSplit)}
          ${input.message ? row("Mensagem", input.message) : ""}
        </td>
      </tr>
    </table>
  </body>
</html>`;

  try {
    const { error } = await api.emails.send({
      from: FROM,
      to: INTERNAL_TO,
      replyTo: input.email,
      subject: `Nova candidatura de parceria — ${input.fullName}`,
      html,
    });
    if (error) {
      console.error("[email] Resend devolveu erro:", error);
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    console.error("[email] falha no envio:", error);
    return { ok: false };
  }
}

import "server-only";
import { Resend } from "resend";
import { siteConfig, absoluteUrl } from "@/lib/site-config";
import { formatPrice } from "@/lib/products";

/**
 * Envio de e-mail transacional via Resend.
 *
 * Degradação graciosa por desenho: sem `RESEND_API_KEY` nada rebenta — a
 * mensagem fica registada no log do servidor e a operação de negócio (o
 * contacto, a encomenda) continua. Um formulário nunca deve falhar para o
 * cliente por causa do fornecedor de e-mail.
 */

let client: Resend | null = null;

function resend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

/** Remetente verificado no Resend. Tem de pertencer a um domínio validado. */
const FROM = process.env.EMAIL_FROM ?? `${siteConfig.name} <onboarding@resend.dev>`;
/** Caixa que recebe as notificações internas (contactos, novas encomendas). */
const INTERNAL_TO = process.env.EMAIL_TO ?? siteConfig.email;

type SendResult = { ok: boolean; skipped?: boolean; error?: string };

async function send(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  const api = resend();
  if (!api) {
    console.warn(
      `[email] RESEND_API_KEY em falta — envio ignorado: "${options.subject}"`
    );
    return { ok: false, skipped: true };
  }

  try {
    const { error } = await api.emails.send({
      from: FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    if (error) {
      console.error("[email] Resend devolveu erro:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (error) {
    console.error("[email] falha no envio:", error);
    return { ok: false, error: (error as Error).message };
  }
}

// ── Template base ───────────────────────────────────────────────────────────

/** Escapa conteúdo submetido por utilizadores antes de o injetar no HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Envolve o conteúdo na identidade visual da marca (dark, gradiente da lente). */
function layout(title: string, body: string): string {
  return `<!doctype html>
<html lang="pt">
  <body style="margin:0;padding:32px 16px;background:#06080f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#0e1422;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
      <tr>
        <td style="height:4px;background:linear-gradient(90deg,#4d8dff,#a855f7,#ef4fc4);"></td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <p style="margin:0 0 24px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#6d7f9e;">
            ${escapeHtml(siteConfig.name)}
          </p>
          <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;color:#f4f7ff;font-weight:600;">
            ${escapeHtml(title)}
          </h1>
          ${body}
        </td>
      </tr>
      <tr>
        <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.08);">
          <p style="margin:0;font-size:12px;color:#6d7f9e;">
            ${escapeHtml(siteConfig.name)} — ${escapeHtml(siteConfig.tagline)}<br />
            <a href="${siteConfig.url}" style="color:#9db0cf;text-decoration:none;">${siteConfig.url}</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

const P = `margin:0 0 14px;font-size:15px;line-height:1.65;color:#d3dcec;`;
const MUTED = `margin:0 0 14px;font-size:14px;line-height:1.6;color:#9db0cf;`;

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:10px;padding:12px 24px;border-radius:999px;background:linear-gradient(90deg,#2563eb,#a855f7);color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">${escapeHtml(label)}</a>`;
}

// ── Mensagens ───────────────────────────────────────────────────────────────

/** Notificação interna: chegou um novo pedido de contacto. */
export function sendContactNotification(input: {
  name: string;
  email: string;
  subject: string | null;
  message: string;
}): Promise<SendResult> {
  return send({
    to: INTERNAL_TO,
    replyTo: input.email,
    subject: `Novo contacto — ${input.name}`,
    html: layout(
      "Novo pedido de contacto",
      `<p style="${P}"><strong style="color:#f4f7ff;">Nome:</strong> ${escapeHtml(input.name)}</p>
       <p style="${P}"><strong style="color:#f4f7ff;">E-mail:</strong> ${escapeHtml(input.email)}</p>
       ${input.subject ? `<p style="${P}"><strong style="color:#f4f7ff;">Assunto:</strong> ${escapeHtml(input.subject)}</p>` : ""}
       <p style="${P}white-space:pre-wrap;border-left:2px solid #a855f7;padding-left:14px;">${escapeHtml(input.message)}</p>
       <p style="${MUTED}">Responda directamente a este e-mail para falar com o cliente.</p>`
    ),
  });
}

/** Acusa a receção ao cliente que preencheu o formulário. */
export function sendContactAcknowledgement(input: {
  name: string;
  email: string;
}): Promise<SendResult> {
  return send({
    to: input.email,
    subject: `Recebemos a sua mensagem — ${siteConfig.name}`,
    html: layout(
      `Obrigado, ${input.name.split(" ")[0]}.`,
      `<p style="${P}">Recebemos o seu pedido e vamos responder em até <strong style="color:#f4f7ff;">1 dia útil</strong>.</p>
       <p style="${MUTED}">Entretanto, pode explorar os nossos serviços e pacotes disponíveis.</p>
       ${button(absoluteUrl("/servicos"), "Ver serviços")}`
    ),
  });
}

/** Boas-vindas após criação de conta. */
export function sendWelcomeEmail(input: {
  name: string;
  email: string;
}): Promise<SendResult> {
  return send({
    to: input.email,
    subject: `Bem-vindo à ${siteConfig.name}`,
    html: layout(
      `Bem-vindo, ${input.name.split(" ")[0]}.`,
      `<p style="${P}">A sua conta está criada. A partir da área de cliente pode acompanhar encomendas, faturas e o estado de cada projeto.</p>
       ${button(absoluteUrl("/conta"), "Aceder à minha conta")}`
    ),
  });
}

/** Recibo enviado ao cliente após confirmação de pagamento pelo Stripe. */
export function sendOrderReceipt(input: {
  email: string;
  orderId: string;
  amountTotal: number;
  currency: string;
  items: { name: string; quantity: number; unitAmount: number }[];
}): Promise<SendResult> {
  const rows = input.items
    .map(
      (item) =>
        `<tr>
           <td style="padding:10px 0;font-size:14px;color:#d3dcec;border-bottom:1px solid rgba(255,255,255,0.07);">
             ${escapeHtml(item.name)} ${item.quantity > 1 ? `<span style="color:#6d7f9e;">× ${item.quantity}</span>` : ""}
           </td>
           <td align="right" style="padding:10px 0;font-size:14px;color:#f4f7ff;border-bottom:1px solid rgba(255,255,255,0.07);">
             ${formatPrice(item.unitAmount * item.quantity, input.currency.toUpperCase())}
           </td>
         </tr>`
    )
    .join("");

  return send({
    to: input.email,
    subject: `Pagamento confirmado — encomenda ${input.orderId.slice(0, 8).toUpperCase()}`,
    html: layout(
      "Pagamento confirmado",
      `<p style="${P}">Obrigado. Recebemos o seu pagamento e o projeto entra já em fila de arranque — entramos em contacto em até 1 dia útil para agendar o kick-off.</p>
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;">
         ${rows}
         <tr>
           <td style="padding:14px 0;font-size:15px;font-weight:600;color:#f4f7ff;">Total</td>
           <td align="right" style="padding:14px 0;font-size:15px;font-weight:600;color:#f4f7ff;">
             ${formatPrice(input.amountTotal, input.currency.toUpperCase())}
           </td>
         </tr>
       </table>
       ${button(absoluteUrl("/conta"), "Ver as minhas encomendas")}`
    ),
  });
}

/** Notificação interna de nova encomenda paga. */
export function sendOrderNotification(input: {
  email: string;
  orderId: string;
  amountTotal: number;
  currency: string;
  items: { name: string; quantity: number }[];
}): Promise<SendResult> {
  return send({
    to: INTERNAL_TO,
    subject: `💸 Nova encomenda paga — ${formatPrice(input.amountTotal, input.currency.toUpperCase())}`,
    html: layout(
      "Nova encomenda paga",
      `<p style="${P}"><strong style="color:#f4f7ff;">Cliente:</strong> ${escapeHtml(input.email)}</p>
       <p style="${P}"><strong style="color:#f4f7ff;">Encomenda:</strong> ${escapeHtml(input.orderId)}</p>
       <p style="${P}"><strong style="color:#f4f7ff;">Itens:</strong> ${escapeHtml(
         input.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")
       )}</p>`
    ),
  });
}

/** Confirmação de inscrição na lista de espera de cursos. */
export function sendNewsletterConfirmation(email: string): Promise<SendResult> {
  return send({
    to: email,
    subject: `Está na lista — ${siteConfig.name}`,
    html: layout(
      "Inscrição confirmada",
      `<p style="${P}">Vamos avisá-lo em primeira mão quando os cursos e infoprodutos da ${escapeHtml(siteConfig.name)} abrirem inscrições.</p>
       <p style="${MUTED}">Pode cancelar a subscrição a qualquer momento respondendo a este e-mail.</p>`
    ),
  });
}

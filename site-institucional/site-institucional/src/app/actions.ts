"use server";

import { z } from "zod";
import { isDatabaseConfigured } from "@/lib/db";
import { saveContactMessage, saveNewsletterSubscriber } from "@/lib/db/queries";
import {
  sendContactAcknowledgement,
  sendContactNotification,
  sendNewsletterConfirmation,
} from "@/lib/email";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

/**
 * Server Actions públicas (contacto e lista de espera).
 *
 * Estratégia de resiliência: a mensagem é primeiro persistida na base de dados
 * e só depois enviada por e-mail. Se o Resend falhar, o pedido do cliente não
 * se perde — fica em `contact_messages`.
 *
 * Ambas as acções são limitadas por IP (ver `src/lib/rate-limit.ts`). A
 * verificação acontece **antes** da validação: uma submissão inválida também
 * consome trabalho do servidor e também tem de contar.
 */

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Erros por campo, para marcar os inputs com `aria-invalid` */
  fieldErrors?: Partial<Record<"name" | "email" | "subject" | "message", string>>;
};

function buildContactSchema(t: ReturnType<typeof getDictionary>) {
  return z.object({
    name: z.string().trim().min(2, t.actions.nameRequired).max(120),
    email: z.string().trim().email(t.actions.emailInvalid).max(160),
    subject: z.string().trim().max(160).optional(),
    message: z.string().trim().min(10, t.actions.messageMin).max(4000, t.actions.messageMax),
  });
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const t = getDictionary(await getLocale());

  // Honeypot: campo escondido, invisível para humanos. Se vier preenchido é bot
  // — respondemos com sucesso falso para não lhe dar sinal de deteção.
  if (String(formData.get("website") ?? "").trim()) {
    return { status: "success", message: t.actions.messageSentShort };
  }

  const limit = await rateLimit("contact");
  if (!limit.ok) {
    return { status: "error", message: await rateLimitMessage(limit.retryAfter) };
  }

  const parsed = buildContactSchema(t).safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: ContactFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof NonNullable<ContactFormState["fieldErrors"]>;
      fieldErrors[field] ??= issue.message;
    }
    return {
      status: "error",
      message: t.actions.reviewFields,
      fieldErrors,
    };
  }

  const { name, email, subject, message } = parsed.data;

  if (isDatabaseConfigured()) {
    try {
      await saveContactMessage({
        name,
        email,
        subject: subject ?? null,
        message,
        source: "contacto",
      });
    } catch (error) {
      console.error("[contacto] falha ao gravar mensagem:", error);
    }
  }

  const [notification] = await Promise.all([
    sendContactNotification({ name, email, subject: subject ?? null, message }),
    sendContactAcknowledgement({ name, email }),
  ]);

  if (!notification.ok && !notification.skipped && !isDatabaseConfigured()) {
    // Sem persistência e sem e-mail, a mensagem perder-se-ia de facto.
    return {
      status: "error",
      message: t.actions.sendFailed(process.env.EMAIL_TO ?? "geral@digitallens.ao"),
    };
  }

  return {
    status: "success",
    message: t.actions.messageSentFull,
  };
}

// ── Lista de espera dos cursos ──────────────────────────────────────────────

export type NewsletterState = { status: "idle" | "success" | "error"; message?: string };

function buildNewsletterSchema(t: ReturnType<typeof getDictionary>) {
  return z.object({
    email: z.string().trim().email(t.actions.emailInvalid).max(160),
  });
}

export async function subscribeNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const t = getDictionary(await getLocale());

  if (String(formData.get("website") ?? "").trim()) {
    return { status: "success", message: t.actions.subscriptionRegisteredShort };
  }

  const limit = await rateLimit("newsletter");
  if (!limit.ok) {
    return { status: "error", message: await rateLimitMessage(limit.retryAfter) };
  }

  const parsed = buildNewsletterSchema(t).safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message };
  }

  if (isDatabaseConfigured()) {
    try {
      await saveNewsletterSubscriber({ email: parsed.data.email, source: "cursos" });
    } catch (error) {
      console.error("[newsletter] falha ao gravar subscritor:", error);
    }
  }

  await sendNewsletterConfirmation(parsed.data.email);

  return { status: "success", message: t.actions.subscriptionRegisteredFull };
}

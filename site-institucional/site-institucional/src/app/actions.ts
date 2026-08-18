"use server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

function sanitize(value: FormDataEntryValue | null): string {
  return (value ?? "").toString().trim().slice(0, 2000);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot — campo invisível para humanos, preenchido só por bots
  if (sanitize(formData.get("website"))) {
    return { status: "success" }; // finge sucesso, não alerta o bot
  }

  const name = sanitize(formData.get("name"));
  const email = sanitize(formData.get("email"));
  const message = sanitize(formData.get("message"));

  if (!name || name.length < 2) {
    return { status: "error", message: "Indique o seu nome." };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Indique um e-mail válido." };
  }
  if (!message || message.length < 10) {
    return {
      status: "error",
      message: "Descreva brevemente o seu projeto (mín. 10 caracteres).",
    };
  }

  // TODO (Fase 6 — integrações): enviar por e-mail (Resend) e/ou gravar em CRM.
  // Mantido server-side para nunca expor credenciais no cliente.
  console.log("[contacto] novo pedido:", { name, email, message });

  return {
    status: "success",
    message: "Mensagem enviada. A equipa Digital Lens responde em breve.",
  };
}

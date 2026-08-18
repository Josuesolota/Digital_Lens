"use client";

import { useActionState } from "react";
import { m } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { submitContactForm, type ContactFormState } from "@/app/actions";

const initialState: ContactFormState = { status: "idle" };

export function Contact() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState
  );

  return (
    <section id="contacto" className="py-24 bg-paper-100">
      <Container className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12">
        <SectionHeading
          eyebrow="Contacto"
          title="Vamos focar o seu próximo projeto."
          description="Conte-nos o essencial — respondemos em até 1 dia útil."
        />

        <m.form
          action={formAction}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-5 bg-paper-50 rounded-2xl border border-ink-900/8 p-8"
          noValidate
        >
          {/* Honeypot anti-spam — escondido de utilizadores reais */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field id="name" name="name" label="Nome" required />
            <Field id="email" name="email" label="E-mail" type="email" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm text-ink-900 font-medium">
              Conte-nos sobre o projeto
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              rows={5}
              className="rounded-xl border border-ink-900/15 px-4 py-3 text-sm text-ink-900 placeholder:text-neutral-600/50 focus:outline-none focus:border-signal-600 resize-none"
              placeholder="Precisamos de um site novo e de gestão de redes sociais..."
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="self-start rounded-full bg-signal-600 hover:bg-signal-400 disabled:opacity-60 transition-colors px-7 py-3 text-sm font-medium text-paper-50"
          >
            {pending ? "A enviar..." : "Enviar mensagem"}
          </button>

          {state.status === "success" && (
            <p className="flex items-center gap-2 text-sm text-emerald-700">
              <CheckCircle2 size={16} /> {state.message}
            </p>
          )}
          {state.status === "error" && (
            <p className="flex items-center gap-2 text-sm text-signal-600">
              <AlertCircle size={16} /> {state.message}
            </p>
          )}
        </m.form>
      </Container>
    </section>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-ink-900 font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="rounded-xl border border-ink-900/15 px-4 py-3 text-sm text-ink-900 placeholder:text-neutral-600/50 focus:outline-none focus:border-signal-600"
      />
    </div>
  );
}

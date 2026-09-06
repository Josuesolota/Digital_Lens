"use client";

import { useActionState } from "react";
import { m } from "framer-motion";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { submitContactForm, type ContactFormState } from "@/app/actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const initialState: ContactFormState = { status: "idle" };

type ContactFormProps = {
  /** Pré-preenche o assunto — usado pelos botões "Pedir orçamento" da loja */
  defaultSubject?: string;
  className?: string;
};

export function ContactForm({ defaultSubject, className }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState
  );

  if (state.status === "success") {
    return (
      <m.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        role="status"
        className={cn(
          "glass flex flex-col items-center gap-4 rounded-2xl p-10 text-center",
          className
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-400/10">
          <CheckCircle2 size={26} className="text-success-400" />
        </span>
        <h3 className="font-display text-xl font-semibold text-fog-50">
          Mensagem enviada
        </h3>
        <p className="max-w-sm text-sm text-fog-400">{state.message}</p>
      </m.div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className={cn("glass flex flex-col gap-5 rounded-2xl p-6 sm:p-8", className)}
    >
      {/* Honeypot: invisível para humanos, irresistível para bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          name="name"
          label="Nome"
          autoComplete="name"
          required
          error={state.fieldErrors?.name}
        />
        <Field
          id="email"
          name="email"
          type="email"
          label="E-mail"
          autoComplete="email"
          required
          error={state.fieldErrors?.email}
        />
      </div>

      <Field
        id="subject"
        name="subject"
        label="Assunto"
        defaultValue={defaultSubject}
        placeholder="Ex.: Site institucional para clínica"
        error={state.fieldErrors?.subject}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-fog-200">
          Conte-nos sobre o projeto
          <span aria-hidden className="ml-1 text-lens-magenta-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          aria-invalid={Boolean(state.fieldErrors?.message)}
          aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
          placeholder="Objetivo, prazo e orçamento aproximado ajudam-nos a responder com precisão."
          className={inputClasses(Boolean(state.fieldErrors?.message))}
        />
        {state.fieldErrors?.message && (
          <FieldError id="message-error">{state.fieldErrors.message}</FieldError>
        )}
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-danger-400/30 bg-danger-400/10 px-3.5 py-2.5 text-sm text-danger-400"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="mt-1 w-full sm:w-auto sm:self-start">
        {pending ? "A enviar…" : "Enviar mensagem"}
        {!pending && <Send size={15} />}
      </Button>

      <p className="text-xs leading-relaxed text-fog-600">
        Ao enviar, concorda que a Digital Lens use estes dados apenas para
        responder ao seu pedido.
      </p>
    </form>
  );
}

function inputClasses(hasError: boolean) {
  return cn(
    "w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-fog-50 transition-colors",
    "placeholder:text-fog-600 focus:outline-none",
    hasError
      ? "border-danger-400/60 focus:border-danger-400"
      : "border-white/[0.10] focus:border-lens-violet-400"
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
};

function Field({ id, label, required, error, type = "text", ...rest }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-fog-200">
        {label}
        {required && <span aria-hidden className="ml-1 text-lens-magenta-400">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClasses(Boolean(error))}
        {...rest}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="text-xs text-danger-400">
      {children}
    </p>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { LensMark } from "@/components/ui/LensMark";
import type { AuthFormState } from "@/app/auth-actions";
import { cn } from "@/lib/utils";

const initialState: AuthFormState = { status: "idle" };

type AuthFormProps = {
  mode: "login" | "register";
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  /** Para onde regressar depois de autenticar (apenas no modo login) */
  redirectTo?: string;
};

const COPY = {
  login: {
    title: "Entrar na sua conta",
    subtitle: "Acompanhe encomendas, faturas e o estado dos seus projetos.",
    submit: "Entrar",
    submitting: "A entrar…",
    footer: "Ainda não tem conta?",
    footerHref: "/registar",
    footerLabel: "Criar conta",
  },
  register: {
    title: "Criar conta",
    subtitle: "Leva menos de um minuto e dá-lhe acesso à área de cliente.",
    submit: "Criar conta",
    submitting: "A criar conta…",
    footer: "Já tem conta?",
    footerHref: "/entrar",
    footerLabel: "Entrar",
  },
} as const;

export function AuthForm({ mode, action, redirectTo }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const copy = COPY[mode];

  return (
    <GlassCard className="w-full max-w-md p-8">
      <div className="mb-7 flex flex-col items-center gap-3 text-center">
        <LensMark size={44} />
        <h1 className="font-display text-2xl font-semibold text-fog-50">
          {copy.title}
        </h1>
        <p className="text-sm text-fog-400">{copy.subtitle}</p>
      </div>

      <form action={formAction} noValidate className="flex flex-col gap-4">
        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

        {mode === "register" && (
          <Field
            id="name"
            name="name"
            label="Nome"
            autoComplete="name"
            required
            error={state.fieldErrors?.name}
          />
        )}

        <Field
          id="email"
          name="email"
          type="email"
          label="E-mail"
          autoComplete="email"
          required
          error={state.fieldErrors?.email}
        />

        <Field
          id="password"
          name="password"
          type="password"
          label="Palavra-passe"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
          required
          hint={mode === "register" ? "Mínimo 8 caracteres." : undefined}
          error={state.fieldErrors?.password}
        />

        {mode === "register" && (
          <Field
            id="confirm"
            name="confirm"
            type="password"
            label="Confirmar palavra-passe"
            autoComplete="new-password"
            required
            error={state.fieldErrors?.confirm}
          />
        )}

        {state.status === "error" && state.message && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-danger-400/30 bg-danger-400/10 px-3.5 py-2.5 text-sm text-danger-400"
          >
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {state.message}
          </p>
        )}

        <Button type="submit" disabled={pending} className="mt-1 w-full">
          {pending ? copy.submitting : copy.submit}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-fog-400">
        {copy.footer}{" "}
        <Link
          href={copy.footerHref}
          className="text-fog-50 underline underline-offset-4 transition-colors hover:text-lens-violet-400"
        >
          {copy.footerLabel}
        </Link>
      </p>
    </GlassCard>
  );
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  error?: string;
};

function Field({ id, label, required, error, hint, type = "text", ...rest }: FieldProps) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`]
    .filter(Boolean)
    .join(" ");

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
        aria-describedby={describedBy || undefined}
        className={cn(
          "w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-fog-50 transition-colors focus:outline-none",
          error
            ? "border-danger-400/60 focus:border-danger-400"
            : "border-white/[0.10] focus:border-lens-violet-400"
        )}
        {...rest}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-fog-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
}

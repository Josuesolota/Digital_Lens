"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { createUser, findUserByEmail } from "@/lib/db/queries";
import { sendWelcomeEmail } from "@/lib/email";
import { rateLimit, rateLimitMessage } from "@/lib/rate-limit";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

/**
 * Server Actions de autenticação.
 *
 * `signIn` do Auth.js lança um `redirect()` interno quando corre bem — por isso
 * o `NEXT_REDIRECT` tem de ser deixado propagar, e apenas os `AuthError` são
 * convertidos em mensagem para o utilizador.
 *
 * Ambas as acções são limitadas por IP. O login leva ainda um segundo balde
 * por e-mail: sem ele, um atacante num IP partilhado (rede empresarial, NAT
 * móvel) esgotaria o balde do IP e bloquearia utilizadores legítimos.
 */

export type AuthFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "password" | "confirm", string>>;
};

function buildRegisterSchema(t: ReturnType<typeof getDictionary>) {
  return z
    .object({
      name: z.string().trim().min(2, t.authActions.nameRequired).max(120),
      email: z.string().trim().email(t.authActions.emailInvalid).max(160),
      password: z.string().min(8, t.authActions.passwordMin).max(200),
      confirm: z.string(),
    })
    .refine((data) => data.password === data.confirm, {
      path: ["confirm"],
      message: t.authActions.passwordMismatch,
    });
}

function toFieldErrors(error: z.ZodError): AuthFormState["fieldErrors"] {
  const fieldErrors: AuthFormState["fieldErrors"] = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof NonNullable<AuthFormState["fieldErrors"]>;
    fieldErrors[field] ??= issue.message;
  }
  return fieldErrors;
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const t = getDictionary(await getLocale());
  if (!isDatabaseConfigured()) return { status: "error", message: t.authActions.dbOff };

  const parsed = buildRegisterSchema(t).safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: t.authActions.reviewFields,
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  const { name, email, password } = parsed.data;

  const limit = await rateLimit("register");
  if (!limit.ok) {
    return { status: "error", message: await rateLimitMessage(limit.retryAfter) };
  }

  try {
    if (await findUserByEmail(email)) {
      return {
        status: "error",
        message: t.authActions.accountExists,
        fieldErrors: { email: t.authActions.emailRegistered },
      };
    }

    // Custo 12: ~250ms por hash em hardware serverless típico — travão
    // suficiente contra força bruta sem prejudicar o registo.
    const passwordHash = await bcrypt.hash(password, 12);
    await createUser({ name, email, passwordHash });
  } catch (error) {
    console.error("[registo] falha ao criar conta:", error);
    return { status: "error", message: t.authActions.createAccountFailed };
  }

  // Falha de e-mail não invalida um registo bem-sucedido.
  void sendWelcomeEmail({ name, email });

  // Autentica e redirige — `signIn` lança NEXT_REDIRECT, que deve propagar.
  await signIn("credentials", { email, password, redirectTo: "/conta" });
  return { status: "idle" };
}

function buildLoginSchema(t: ReturnType<typeof getDictionary>) {
  return z.object({
    email: z.string().trim().email(t.authActions.emailInvalid),
    password: z.string().min(1, t.authActions.passwordRequired),
  });
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const t = getDictionary(await getLocale());
  if (!isDatabaseConfigured()) return { status: "error", message: t.authActions.dbOff };

  const parsed = buildLoginSchema(t).safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: t.authActions.reviewFields,
      fieldErrors: toFieldErrors(parsed.error),
    };
  }

  // Dois baldes: um por IP (trava varreduras) e outro por IP+e-mail (trava
  // força bruta contra uma conta concreta).
  for (const scope of [undefined, parsed.data.email]) {
    const limit = await rateLimit("login", scope);
    if (!limit.ok) {
      return { status: "error", message: await rateLimitMessage(limit.retryAfter) };
    }
  }

  const redirectTo = String(formData.get("redirectTo") || "/conta");

  try {
    await signIn("credentials", { ...parsed.data, redirectTo });
  } catch (error) {
    if (error instanceof AuthError) {
      // Mensagem deliberadamente genérica: não revela se o e-mail existe.
      return { status: "error", message: t.authActions.loginFailed };
    }
    throw error; // NEXT_REDIRECT e outros erros continuam a propagar
  }

  return { status: "idle" };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

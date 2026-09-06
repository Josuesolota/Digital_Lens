"use client";

import { useActionState } from "react";
import { m } from "framer-motion";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { subscribeNewsletter, type NewsletterState } from "@/app/actions";

const initialState: NewsletterState = { status: "idle" };

/** Temas confirmados para a primeira leva de cursos e infoprodutos. */
const UPCOMING_COURSES = [
  "Desenvolvimento Web",
  "Inteligência Artificial aplicada",
  "Produção de Conteúdo",
  "Oratória & Retórica",
  "Trading",
  "Ebooks",
];

/** Lista de espera para os cursos e infoprodutos. */
export function ComingSoon() {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    initialState
  );

  return (
    <section className="py-16 lg:py-20">
      <Container>
        <m.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-void-900 px-7 py-12 md:px-14 md:py-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lens-magenta-600/20 blur-[100px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-lens-blue-600/20 blur-[100px]"
          />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="flex max-w-lg flex-col gap-3">
              <span className="eyebrow flex items-center gap-2 text-lens-magenta-400">
                <GraduationCap size={15} />
                Em breve
              </span>
              <h2 className="text-balance font-display text-2xl font-semibold text-fog-50 md:text-3xl">
                Cursos e infoprodutos Digital Lens
              </h2>
              <p className="text-balance text-fog-400">
                Formações práticas e infoprodutos em seis áreas. Deixe o
                contacto e seja avisado em primeira mão.
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {UPCOMING_COURSES.map((course) => (
                  <li
                    key={course}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-fog-400"
                  >
                    {course}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full md:w-auto">
              {state.status === "success" ? (
                <p
                  role="status"
                  className="flex items-center gap-2 rounded-full border border-success-400/30 bg-success-400/10 px-5 py-3 text-sm text-success-400"
                >
                  <CheckCircle2 size={16} />
                  {state.message}
                </p>
              ) : (
                <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
                  {/* Honeypot anti-spam */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />
                  <label htmlFor="coming-soon-email" className="sr-only">
                    O seu e-mail
                  </label>
                  <input
                    id="coming-soon-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="o.seu@email.com"
                    aria-invalid={state.status === "error"}
                    className="min-w-0 rounded-full border border-white/[0.12] bg-white/[0.04] px-5 py-3 text-sm text-fog-50 placeholder:text-fog-600 focus:border-lens-violet-400 focus:outline-none sm:w-64"
                  />
                  <button
                    type="submit"
                    disabled={pending}
                    className="shrink-0 rounded-full bg-[linear-gradient(100deg,var(--color-lens-blue-500),var(--color-lens-violet-500),var(--color-lens-magenta-500))] px-6 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {pending ? "A inscrever…" : "Avisar-me"}
                  </button>
                </form>
              )}

              {state.status === "error" && (
                <p role="alert" className="mt-2 text-xs text-danger-400">
                  {state.message}
                </p>
              )}
            </div>
          </div>
        </m.div>
      </Container>
    </section>
  );
}

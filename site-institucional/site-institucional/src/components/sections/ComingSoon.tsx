"use client";

import { m } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function ComingSoon() {
  return (
    <section className="py-20">
      <Container>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-ink-900 px-8 py-14 md:px-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div className="flex flex-col gap-3 max-w-lg">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-signal-400">
              <GraduationCap size={16} />
              Em breve
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-paper-50 text-balance">
              Cursos e infoprodutos Digital Lens
            </h3>
            <p className="text-paper-50/70 text-balance">
              Estamos a preparar formações práticas em marketing, IA e
              produção de conteúdo. Deixe o seu contacto e seja avisado em
              primeira mão.
            </p>
          </div>

          <form className="flex w-full md:w-auto flex-col sm:flex-row gap-3">
            <label htmlFor="coming-soon-email" className="sr-only">
              O seu e-mail
            </label>
            <input
              id="coming-soon-email"
              type="email"
              required
              placeholder="o.seu@email.com"
              className="rounded-full bg-paper-50/10 border border-paper-50/20 px-5 py-3 text-sm text-paper-50 placeholder:text-paper-50/40 focus:outline-none focus:border-signal-400 min-w-0 sm:w-64"
            />
            <button
              type="submit"
              className="rounded-full bg-signal-600 hover:bg-signal-400 transition-colors px-6 py-3 text-sm font-medium text-paper-50 shrink-0"
            >
              Avisar-me
            </button>
          </form>
        </m.div>
      </Container>
    </section>
  );
}

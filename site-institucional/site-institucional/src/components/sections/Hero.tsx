"use client";

import { m, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { LensMark } from "@/components/ui/LensMark";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { SERVICE_PILLARS } from "@/lib/services";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.09, duration: 0.7, ease: EASE },
  }),
};

const STATS = [
  { value: "4", label: "áreas de especialidade" },
  { value: "22", label: "serviços no catálogo" },
  { value: "24h", label: "tempo médio de resposta" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-28">
      <AuroraBackground />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          {/* ── Coluna de texto ── */}
          <div className="flex flex-col items-start gap-6">
            <m.span
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="glass eyebrow flex items-center gap-2 rounded-full px-3.5 py-2 text-fog-200"
            >
              <Sparkles size={13} className="text-lens-magenta-400" />
              Agência Digital
            </m.span>

            <m.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.06] text-fog-50 sm:text-5xl lg:text-6xl"
            >
              Foco onde a sua marca{" "}
              <span className="text-gradient">precisa de estar.</span>
            </m.h1>

            <m.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-lg text-balance text-lg leading-relaxed text-fog-400"
            >
              Desenvolvimento web, inteligência artificial, marketing digital e
              locução profissional — da estratégia à execução, sob uma só lente.
            </m.p>

            <m.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap gap-3 pt-1"
            >
              <Button href="/contacto" size="lg">
                Iniciar projeto
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button href="/loja" variant="secondary" size="lg">
                Ver a loja
              </Button>
            </m.div>

            <m.dl
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-6 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/[0.08] pt-7"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-3xl font-semibold text-gradient">
                    {stat.value}
                  </dd>
                  <span className="max-w-[9rem] text-xs leading-snug text-fog-600">
                    {stat.label}
                  </span>
                </div>
              ))}
            </m.dl>
          </div>

          {/* ── Lente ── */}
          <m.div
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
            className="relative hidden justify-center lg:flex"
          >
            <div className="relative motion-safe:animate-float">
              <LensMark size={340} glow />

              {/* Anéis orbitais — reforçam a leitura "óptica/técnica" */}
              <div
                aria-hidden
                className="absolute inset-[-14%] rounded-full border border-white/[0.07]"
              />
              <div
                aria-hidden
                className="absolute inset-[-30%] rounded-full border border-dashed border-white/[0.05]"
              />
            </div>
          </m.div>
        </div>
      </Container>

      {/* ── Faixa de especialidades em movimento contínuo ── */}
      <div className="relative mt-16 overflow-hidden border-y border-white/[0.07] py-4">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(90deg,var(--color-void-950),transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(270deg,var(--color-void-950),transparent)]"
        />
        {/* Duplicamos a lista para que o loop de -50% seja imperceptível */}
        <div className="flex w-max motion-safe:animate-marquee">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex items-center"
              aria-hidden={copy === 1}
            >
              {SERVICE_PILLARS.flatMap((pillar) =>
                pillar.items.map((item) => (
                  <li
                    key={`${pillar.slug}-${item.title}`}
                    className="flex items-center whitespace-nowrap px-5 text-sm text-fog-600"
                  >
                    <span className="mr-5 h-1 w-1 rounded-full bg-lens-violet-400/60" />
                    {item.title}
                  </li>
                ))
              )}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

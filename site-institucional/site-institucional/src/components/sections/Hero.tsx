"use client";

import { m, type Variants } from "framer-motion";
import { ApertureMark } from "@/components/ui/ApertureMark";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.1, duration: 0.6, ease: EASE },
  }),
};

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-16 md:pt-24 pb-24">
      {/* Íris de fundo — abre lentamente ao carregar a página, ambiente, não distrai */}
      <m.div
        aria-hidden
        className="absolute -right-24 -top-24 text-ink-900/[0.05] md:text-ink-900/[0.06]"
        initial={{ opacity: 0, rotate: -8 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <ApertureMark size={520} interactive={false} autoOpen />
      </m.div>

      <Container className="relative flex flex-col items-start gap-6">
        <m.span
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-mono text-xs uppercase tracking-[0.2em] text-signal-600"
        >
          Agência Digital
        </m.span>

        <m.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-display text-5xl md:text-7xl font-semibold text-ink-900 max-w-3xl text-balance leading-[1.05]"
        >
          Foco onde a sua marca precisa de estar.
        </m.h1>

        <m.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-lg text-neutral-600 max-w-lg text-balance"
        >
          Marketing digital, desenvolvimento web, soluções com IA e produção
          multimédia — sob uma só lente, da estratégia à execução.
        </m.p>

        <m.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap gap-4 pt-2"
        >
          <Button href="#contacto" variant="primary">
            Iniciar projeto
          </Button>
          <Button href="#servicos" variant="secondary">
            Ver serviços
          </Button>
        </m.div>
      </Container>
    </section>
  );
}

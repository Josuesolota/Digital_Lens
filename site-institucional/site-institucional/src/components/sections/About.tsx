"use client";

import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    title: "Diagnóstico",
    description:
      "Uma sessão para perceber o negócio, o público e o que está mesmo a travar o crescimento. Sem proposta antes de haver diagnóstico.",
  },
  {
    title: "Desenho",
    description:
      "Estratégia, arquitetura e protótipo com âmbito e prazos fechados por escrito. Aprova antes de começarmos a construir.",
  },
  {
    title: "Execução",
    description:
      "Entregas semanais visíveis num ambiente de pré-produção — acompanha o progresso sem esperar pelo fim.",
  },
  {
    title: "Medição",
    description:
      "Analítica configurada desde o primeiro dia e relatório com o que funcionou, o que não funcionou e o passo seguinte.",
  },
];

export function About() {
  return (
    <section id="metodo" className="relative py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-void opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent)]"
      />

      <Container className="relative grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <SectionHeading
          eyebrow="Como trabalhamos"
          title={
            <>
              Clareza antes de{" "}
              <span className="text-gradient">execução.</span>
            </>
          }
          description="Um método em quatro tempos que elimina surpresas — para si e para nós."
        />

        <ol className="flex flex-col">
          {STEPS.map((step, index) => (
            <m.li
              key={step.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group flex gap-6 border-b border-white/[0.07] py-7 last:border-0 last:pb-0 first:pt-0"
            >
              <span className="shrink-0 font-mono text-sm text-lens-violet-400/70 transition-colors group-hover:text-lens-magenta-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-lg font-semibold text-fog-50">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-fog-400">
                  {step.description}
                </p>
              </div>
            </m.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

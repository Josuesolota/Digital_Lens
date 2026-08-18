"use client";

import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const DIFERENCIAIS = [
  {
    title: "Um só ponto de contacto",
    description:
      "Estratégia, criação e desenvolvimento sob a mesma equipa — sem perdas na tradução entre fornecedores.",
  },
  {
    title: "Decisões orientadas por dados",
    description:
      "Cada campanha e cada linha de código tem um objetivo mensurável por trás.",
  },
  {
    title: "IA aplicada, não modismo",
    description:
      "Usamos automação onde ela poupa tempo e dinheiro real ao seu negócio.",
  },
];

export function About() {
  return (
    <section id="sobre" className="py-24">
      <Container className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20">
        <SectionHeading
          eyebrow="Porquê a Digital Lens"
          title="Cada projeto passa pela mesma lente: clareza antes de execução."
        />

        <div className="flex flex-col gap-8">
          {DIFERENCIAIS.map((item, i) => (
            <m.div
              key={item.title}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-5 pb-8 border-b border-ink-900/10 last:border-0 last:pb-0"
            >
              <span className="font-display text-2xl text-signal-600/70 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-lg font-semibold text-ink-900">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600">{item.description}</p>
              </div>
            </m.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

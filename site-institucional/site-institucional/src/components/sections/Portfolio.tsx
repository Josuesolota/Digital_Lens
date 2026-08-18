"use client";

import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ApertureMark } from "@/components/ui/ApertureMark";

// Placeholder — substituir por cases reais assim que estiverem disponíveis
const PROJECTS = [
  { name: "Projeto em breve", category: "Branding & Web" },
  { name: "Projeto em breve", category: "Marketing Digital" },
  { name: "Projeto em breve", category: "Produção Multimédia" },
  { name: "Projeto em breve", category: "Soluções com IA" },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="py-24 bg-paper-100">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Trabalhos"
          title="Portfólio em construção."
          description="Os primeiros cases da Digital Lens vão aparecer aqui."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PROJECTS.map((project, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative aspect-[4/3] rounded-2xl bg-ink-900 overflow-hidden flex flex-col justify-end p-6"
            >
              <ApertureMark
                size={140}
                interactive={false}
                className="absolute right-4 top-4 text-paper-50/[0.08] transition-transform duration-700 group-hover:rotate-45"
              />
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-signal-400">
                {project.category}
              </span>
              <span className="font-display text-xl text-paper-50/90">
                {project.name}
              </span>
            </m.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

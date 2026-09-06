"use client";

import { m } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LensMark } from "@/components/ui/LensMark";

/**
 * Vitrine de trabalhos.
 *
 * COMO ADICIONAR UM CASE REAL: substituir uma entrada de `PROJECTS` por
 * `{ name, category, result, href }` e trocar o placeholder da lente por
 * `<OptimizedImage>` com a captura do projeto.
 */
const PROJECTS = [
  { name: "Case em preparação", category: "Desenvolvimento Web", result: "Em breve" },
  { name: "Case em preparação", category: "Inteligência Artificial", result: "Em breve" },
  { name: "Case em preparação", category: "Marketing Digital", result: "Em breve" },
  { name: "Case em preparação", category: "Locução & Narração", result: "Em breve" },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="relative py-24 lg:py-32">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Trabalhos"
          title="Portfólio em construção."
          description="Os primeiros cases da Digital Lens aparecem aqui — com métricas, não apenas capturas de ecrã."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <m.article
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.08] bg-void-900 p-6"
            >
              {/* Placeholder: a lente da marca, esbatida, até haver imagem real */}
              <div
                aria-hidden
                className="absolute -right-8 -top-8 opacity-[0.07] transition-all duration-700 group-hover:scale-110 group-hover:opacity-[0.14]"
              >
                <LensMark size={190} />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.16),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />

              <div className="relative flex flex-col gap-1.5">
                <span className="eyebrow text-lens-magenta-400">
                  {project.category}
                </span>
                <h3 className="font-display text-xl text-fog-50">{project.name}</h3>
                <span className="font-mono text-xs text-fog-600">{project.result}</span>
              </div>
            </m.article>
          ))}
        </div>
      </Container>
    </section>
  );
}

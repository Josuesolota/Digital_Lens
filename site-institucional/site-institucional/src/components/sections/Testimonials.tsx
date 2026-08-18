"use client";

import { m } from "framer-motion";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";

// Placeholder — substituir por depoimentos reais de clientes
const TESTIMONIALS = [
  {
    quote:
      "A equipa organizou em semanas o que outras agências não resolveram em meses.",
    name: "Cliente Digital Lens",
    role: "Setor a definir",
  },
  {
    quote:
      "Finalmente uma agência que entende de marketing e de código ao mesmo tempo.",
    name: "Cliente Digital Lens",
    role: "Setor a definir",
  },
];

export function Testimonials() {
  return (
    <section className="py-24">
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <m.figure
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-ink-900/8 p-8 flex flex-col gap-6"
          >
            <Quote className="text-signal-600/40" size={28} />
            <blockquote className="font-display text-xl text-ink-900 text-balance leading-snug">
              “{t.quote}”
            </blockquote>
            <figcaption className="text-sm text-neutral-600">
              {t.name} — {t.role}
            </figcaption>
          </m.figure>
        ))}
      </Container>
    </section>
  );
}

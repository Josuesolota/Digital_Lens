"use client";

import { m } from "framer-motion";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Placeholder — substituir por depoimentos reais assinados por clientes. */
export function Testimonials() {
  const { dictionary: t } = useLocale();

  return (
    <section className="py-20 lg:py-24">
      <Container className="grid gap-5 md:grid-cols-2">
        {t.testimonials.items.map((testimonial, index) => (
          <m.div
            key={index}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: 0.5, delay: index * 0.09 }}
          >
            <GlassCard className="flex h-full flex-col gap-6 p-8">
              <Quote size={26} className="text-lens-violet-400/50" />
              <blockquote className="text-balance font-display text-lg leading-snug text-fog-50">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-auto text-sm text-fog-600">
                {testimonial.name} — {testimonial.role}
              </figcaption>
            </GlassCard>
          </m.div>
        ))}
      </Container>
    </section>
  );
}

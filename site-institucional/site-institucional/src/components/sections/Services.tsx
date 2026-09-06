"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { SERVICE_PILLARS } from "@/lib/services";

/**
 * Os quatro pilares na homepage. Cada cartão lista os serviços concretos e
 * liga à página dedicada do pilar.
 */
export function Services() {
  return (
    <section id="servicos" className="relative py-24 lg:py-32">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="O que fazemos"
          title={
            <>
              Quatro especialidades,{" "}
              <span className="text-gradient">uma só direção.</span>
            </>
          }
          description="Cada área funciona isolada — mas ganha nitidez quando combinada com as outras."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {SERVICE_PILLARS.map((pillar, index) => (
            <m.div
              key={pillar.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
            >
              <GlassCard interactive className="group h-full p-7 lg:p-8">
                <Link
                  href={`/servicos/${pillar.slug}`}
                  className="flex h-full flex-col gap-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${pillar.gradient[0]}, ${pillar.gradient[1]})`,
                        boxShadow: `0 12px 32px -12px ${pillar.gradient[1]}`,
                      }}
                    >
                      <pillar.icon size={22} strokeWidth={1.75} className="text-white" />
                    </span>
                    <ArrowUpRight
                      size={19}
                      className="text-fog-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fog-50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl font-semibold text-fog-50">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-fog-400">
                      {pillar.tagline}
                    </p>
                  </div>

                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {pillar.items.map((item) => (
                      <li
                        key={item.title}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-fog-400 transition-colors group-hover:border-white/[0.14]"
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </Link>
              </GlassCard>
            </m.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

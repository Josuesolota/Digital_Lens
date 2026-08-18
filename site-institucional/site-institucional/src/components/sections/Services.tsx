"use client";

import { m } from "framer-motion";
import {
  Megaphone,
  Code2,
  BrainCircuit,
  Clapperboard,
  Mic2,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const SERVICES: Service[] = [
  {
    icon: Megaphone,
    title: "Marketing Digital",
    description:
      "Estratégia, gestão de campanhas e conteúdo orientado a resultados mensuráveis.",
  },
  {
    icon: Code2,
    title: "Desenvolvimento Web",
    description:
      "Sites e plataformas rápidas, seguras e construídas para converter.",
  },
  {
    icon: BrainCircuit,
    title: "Soluções com IA",
    description:
      "Automação, agentes e integrações que tornam processos mais inteligentes.",
  },
  {
    icon: Clapperboard,
    title: "Produção Multimédia",
    description:
      "Vídeo, fotografia e edição para dar corpo visual à sua marca.",
  },
  {
    icon: Mic2,
    title: "Locução",
    description:
      "Voz profissional para publicidade, vídeo institucional e conteúdo áudio.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="py-24 bg-paper-100">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="O que fazemos"
          title="Cinco especialidades, uma só direção."
          description="Cada serviço funciona isolado — mas ganha nitidez quando combinado."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((service, i) => (
            <m.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative rounded-2xl bg-paper-50 border border-ink-900/8 p-7 flex flex-col gap-4 transition-shadow duration-300 hover:shadow-[0_20px_40px_-24px_rgba(15,27,45,0.25)]"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900/5 text-ink-700 grayscale opacity-70 blur-[1px]
                           transition-all duration-500 ease-out
                           group-hover:grayscale-0 group-hover:opacity-100 group-hover:blur-0 group-hover:bg-signal-600 group-hover:text-paper-50 group-hover:scale-110"
              >
                <service.icon size={22} strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink-900">
                {service.title}
              </h3>
              <p className="text-sm text-neutral-600 text-balance">
                {service.description}
              </p>
            </m.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

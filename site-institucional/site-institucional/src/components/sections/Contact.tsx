import { Clock, Mail, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/lib/site-config";

const HIGHLIGHTS = [
  { icon: Clock, text: "Resposta em até 1 dia útil" },
  { icon: MessageSquare, text: "Diagnóstico inicial sem custo" },
  { icon: Mail, text: siteConfig.email },
];

export function Contact({ defaultSubject }: { defaultSubject?: string }) {
  return (
    <section id="contacto" className="relative py-24 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(168,85,247,0.4),transparent)]"
      />

      <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Contacto"
            title={
              <>
                Vamos focar o seu{" "}
                <span className="text-gradient">próximo projeto.</span>
              </>
            }
            description="Conte-nos o essencial — objetivo, prazo e orçamento aproximado. Respondemos com um plano, não com um catálogo."
          />

          <ul className="flex flex-col gap-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item.text} className="flex items-center gap-3 text-sm text-fog-400">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
                  <item.icon size={14} className="text-lens-violet-400" />
                </span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>

        <ContactForm defaultSubject={defaultSubject} />
      </Container>
    </section>
  );
}

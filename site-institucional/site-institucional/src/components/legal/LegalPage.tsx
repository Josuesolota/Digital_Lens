import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import type { ReactNode } from "react";

/**
 * Layout partilhado pelas páginas legais (Termos, Privacidade, Reembolsos):
 * mesmo cabeçalho do resto do site, corpo em coluna estreita para leitura
 * confortável de texto longo.
 */
export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  children,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="relative overflow-hidden pb-10 pt-16 sm:pt-20">
        <AuroraBackground />
        <Container className="relative">
          <SectionHeading as="h1" eyebrow={eyebrow} title={title} />
          <p className="mt-4 text-center text-xs text-fog-600 sm:text-left">{updatedAt}</p>
        </Container>
      </section>

      <section className="pb-24 lg:pb-32">
        <Container className="max-w-3xl">
          <div className="flex flex-col gap-6 text-sm leading-relaxed text-fog-300 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-fog-50 [&_li]:ml-5 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-fog-50 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}

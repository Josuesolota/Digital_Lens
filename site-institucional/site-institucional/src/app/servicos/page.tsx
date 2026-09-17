import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { Button } from "@/components/ui/Button";
import { SERVICE_PILLARS } from "@/lib/services";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizePillars } from "@/lib/i18n/localize";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.pages.servicesIndex.title,
    description: t.pages.servicesIndex.metaDescription,
    alternates: { canonical: "/servicos" },
  };
}

export default async function ServicosPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const pillars = localizePillars(SERVICE_PILLARS, locale);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-16 sm:pt-20">
        <AuroraBackground />
        <Container className="relative">
          <SectionHeading
            as="h1"
            eyebrow={t.pages.servicesIndex.eyebrow}
            title={
              <>
                {t.pages.servicesIndex.titleStart}{" "}
                <span className="text-gradient">{t.pages.servicesIndex.titleHighlight}</span>
              </>
            }
            description={t.pages.servicesIndex.description}
          />
        </Container>
      </section>

      <section className="pb-24 lg:pb-32">
        <Container className="flex flex-col gap-16">
          {pillars.map((pillar) => (
            <article key={pillar.slug} id={pillar.slug} className="scroll-mt-28">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${pillar.gradient[0]}, ${pillar.gradient[1]})`,
                      boxShadow: `0 12px 32px -12px ${pillar.gradient[1]}`,
                    }}
                  >
                    <pillar.icon size={22} strokeWidth={1.75} className="text-white" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-fog-50">
                      {pillar.title}
                    </h2>
                    <p className="mt-1 text-sm text-fog-400">{pillar.tagline}</p>
                  </div>
                </div>

                <Link
                  href={`/servicos/${pillar.slug}`}
                  className="group flex items-center gap-1.5 text-sm text-fog-400 transition-colors hover:text-fog-50"
                >
                  {t.pages.servicesIndex.viewDetail}
                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pillar.items.map((item) => (
                  <GlassCard key={item.title} interactive className="flex flex-col gap-2 p-5">
                    <div className="flex items-start gap-2">
                      <Check size={14} className="mt-1 shrink-0 text-lens-cyan-400" />
                      <h3 className="font-medium text-fog-50">{item.title}</h3>
                    </div>
                    <p className="pl-6 text-sm leading-relaxed text-fog-400">
                      {item.description}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </article>
          ))}

          <div className="glass flex flex-col items-center gap-5 rounded-3xl p-10 text-center">
            <h2 className="max-w-md text-balance font-display text-2xl font-semibold text-fog-50">
              {t.pages.servicesIndex.notFoundTitle}
            </h2>
            <p className="max-w-md text-sm text-fog-400">
              {t.pages.servicesIndex.notFoundDescription}
            </p>
            <Button href="/contacto" size="lg">
              {t.pages.servicesIndex.talkToUs}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

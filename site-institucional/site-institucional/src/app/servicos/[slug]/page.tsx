import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/store/ProductCard";
import { getPillar, SERVICE_SLUGS } from "@/lib/services";
import { getProductsByPillar } from "@/lib/products";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

type PageProps = { params: Promise<{ slug: string }> };

/** Pré-renderiza as quatro páginas de pilar no build. */
export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) return {};

  return {
    title: pillar.title,
    description: pillar.description,
    alternates: { canonical: `/servicos/${pillar.slug}` },
    openGraph: {
      title: `${pillar.title} — Digital Lens`,
      description: pillar.description,
      url: absoluteUrl(`/servicos/${pillar.slug}`),
    },
  };
}

export default async function ServicoPage({ params }: PageProps) {
  const { slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) notFound();

  const products = getProductsByPillar(pillar.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: pillar.title,
    description: pillar.description,
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: siteConfig.address.country,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: pillar.title,
      itemListElement: pillar.items.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item.title, description: item.description },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden pb-14 pt-10 sm:pt-14">
        <AuroraBackground />
        <Container className="relative flex flex-col gap-6">
          <Link
            href="/servicos"
            className="group flex w-fit items-center gap-2 text-sm text-fog-400 transition-colors hover:text-fog-50"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            Todos os serviços
          </Link>

          <div className="flex items-center gap-4">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${pillar.gradient[0]}, ${pillar.gradient[1]})`,
                boxShadow: `0 16px 40px -14px ${pillar.gradient[1]}`,
              }}
            >
              <pillar.icon size={26} strokeWidth={1.75} className="text-white" />
            </span>
            <h1 className="text-balance font-display text-3xl font-semibold leading-tight text-fog-50 sm:text-4xl lg:text-5xl">
              {pillar.title}
            </h1>
          </div>

          <p className="max-w-2xl text-balance text-lg leading-relaxed text-fog-400">
            {pillar.description}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button href={`/contacto?servico=${pillar.slug}`} size="lg">
              Pedir proposta
            </Button>
            {products.length > 0 && (
              <Button href="/loja" variant="secondary" size="lg">
                Ver pacotes
              </Button>
            )}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container className="grid gap-10 lg:grid-cols-[1.4fr_0.85fr] lg:gap-16">
          <div>
            <h2 className="eyebrow mb-6 text-lens-violet-400">O que inclui</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {pillar.items.map((item) => (
                <GlassCard key={item.title} className="flex flex-col gap-2 p-5">
                  <h3 className="font-medium text-fog-50">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-fog-400">
                    {item.description}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>

          <aside>
            <h2 className="eyebrow mb-6 text-lens-violet-400">O que recebe</h2>
            <GlassCard className="flex flex-col gap-3.5 p-6">
              {pillar.deliverables.map((deliverable) => (
                <p key={deliverable} className="flex items-start gap-2.5 text-sm text-fog-200">
                  <Check size={15} className="mt-0.5 shrink-0 text-lens-cyan-400" />
                  {deliverable}
                </p>
              ))}
            </GlassCard>
          </aside>
        </Container>
      </section>

      {products.length > 0 && (
        <section className="py-14 pb-24">
          <Container className="flex flex-col gap-8">
            <h2 className="font-display text-2xl font-semibold text-fog-50">
              Pacotes de {pillar.title.toLowerCase()}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

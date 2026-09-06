import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarClock, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { Button } from "@/components/ui/Button";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ProductCard } from "@/components/store/ProductCard";
import {
  formatKwanzaEquivalent,
  formatPrice,
  getProduct,
  getProductsByPillar,
  pillarTitle,
  PRODUCT_SLUGS,
} from "@/lib/products";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/loja/${product.slug}` },
    openGraph: {
      title: `${product.name} — Digital Lens`,
      description: product.summary,
      url: absoluteUrl(`/loja/${product.slug}`),
    },
  };
}

export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = getProductsByPillar(product.pillar)
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(product.price !== null && {
      offers: {
        "@type": "Offer",
        price: (product.price / 100).toFixed(2),
        priceCurrency: siteConfig.currency,
        availability: "https://schema.org/InStock",
        url: absoluteUrl(`/loja/${product.slug}`),
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden pb-16 pt-10 sm:pt-14">
        <AuroraBackground />

        <Container className="relative">
          <Link
            href="/loja"
            className="group mb-8 flex w-fit items-center gap-2 text-sm text-fog-400 transition-colors hover:text-fog-50"
          >
            <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
            Voltar à loja
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.9fr] lg:gap-14">
            <div className="flex flex-col gap-6">
              <Link
                href={`/servicos/${product.pillar}`}
                className="eyebrow w-fit text-lens-violet-400 transition-colors hover:text-lens-magenta-400"
              >
                {pillarTitle(product.pillar)}
              </Link>

              <h1 className="text-balance font-display text-3xl font-semibold leading-tight text-fog-50 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <p className="max-w-2xl text-balance text-lg leading-relaxed text-fog-400">
                {product.description}
              </p>

              <div className="mt-2">
                <h2 className="eyebrow mb-4 text-fog-600">O que está incluído</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-fog-200"
                    >
                      <Check size={15} className="mt-0.5 shrink-0 text-lens-cyan-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Painel de compra ── */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <GlassCard className="flex flex-col gap-5 p-7">
                {product.price === null ? (
                  <>
                    <div className="flex flex-col gap-1">
                      <span className="eyebrow text-fog-600">Investimento</span>
                      <span className="font-display text-2xl font-semibold text-fog-50">
                        Sob orçamento
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-fog-400">
                      O âmbito destes projetos varia muito. Conte-nos o que precisa
                      e enviamos uma proposta com preço e prazo fechados.
                    </p>
                    <Button href={`/contacto?servico=${product.slug}`} className="w-full">
                      Pedir orçamento
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1">
                      <span className="eyebrow text-fog-600">Investimento</span>
                      <span className="flex items-baseline gap-1.5">
                        <span className="font-display text-4xl font-semibold text-gradient">
                          {formatPrice(product.price)}
                        </span>
                        {product.billing === "monthly" && (
                          <span className="text-sm text-fog-600">/ mês</span>
                        )}
                      </span>
                      <span className="font-mono text-xs text-fog-600">
                        / {formatKwanzaEquivalent(product.price)}
                        {product.billing === "monthly" && " / mês"}
                      </span>
                      <span className="text-xs text-fog-600">
                        IVA à taxa legal em vigor, calculado no checkout.
                      </span>
                    </div>

                    <AddToCartButton productId={product.id} />

                    <p className="flex items-center gap-2 text-xs text-fog-400">
                      <CalendarClock size={14} className="text-lens-violet-400" />
                      Entrega típica em {product.deliveryDays} dias úteis
                    </p>
                  </>
                )}

                <div className="border-t border-white/[0.08] pt-5">
                  <p className="text-xs leading-relaxed text-fog-600">
                    Precisa de algo diferente?{" "}
                    <Link
                      href="/contacto"
                      className="text-fog-200 underline underline-offset-2 transition-colors hover:text-fog-50"
                    >
                      Fale connosco
                    </Link>{" "}
                    e ajustamos o âmbito.
                  </p>
                </div>
              </GlassCard>
            </aside>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="pb-24">
          <Container className="flex flex-col gap-8">
            <h2 className="font-display text-xl font-semibold text-fog-50">
              Também em {pillarTitle(product.pillar).toLowerCase()}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  index={index}
                  showFeatures={false}
                />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductPurchasePanel } from "@/components/store/ProductPurchasePanel";
import {
  getProduct,
  getProductsByPillar,
  PRODUCT_SLUGS,
} from "@/lib/products";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizeProduct, localizeProducts, localizedPillarTitle } from "@/lib/i18n/localize";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawProduct = getProduct(slug);
  if (!rawProduct) return {};
  const product = localizeProduct(rawProduct, await getLocale());

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
  const rawProduct = getProduct(slug);
  if (!rawProduct) notFound();

  const locale = await getLocale();
  const t = getDictionary(locale);
  const product = localizeProduct(rawProduct, locale);
  const related = localizeProducts(
    getProductsByPillar(product.pillar).filter((item) => item.id !== product.id).slice(0, 3),
    locale
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(product.priceRange && {
      offers:
        product.priceRange.min === product.priceRange.max
          ? {
              "@type": "Offer",
              price: (product.priceRange.min / 100).toFixed(2),
              priceCurrency: siteConfig.currency,
              availability: "https://schema.org/InStock",
              url: absoluteUrl(`/loja/${product.slug}`),
            }
          : {
              "@type": "AggregateOffer",
              lowPrice: (product.priceRange.min / 100).toFixed(2),
              highPrice: (product.priceRange.max / 100).toFixed(2),
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
            {t.pages.productDetail.backToStore}
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.9fr] lg:gap-14">
            <div className="flex flex-col gap-6">
              <Link
                href={`/servicos/${product.pillar}`}
                className="eyebrow w-fit text-lens-violet-400 transition-colors hover:text-lens-magenta-400"
              >
                {localizedPillarTitle(product.pillar, locale)}
              </Link>

              <h1 className="text-balance font-display text-3xl font-semibold leading-tight text-fog-50 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              <p className="max-w-2xl text-balance text-lg leading-relaxed text-fog-400">
                {product.description}
              </p>

              <div className="mt-2">
                <h2 className="eyebrow mb-4 text-fog-600">{t.pages.productDetail.whatIncluded}</h2>
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
                {product.priceRange === null ? (
                  <>
                    <div className="flex flex-col gap-1">
                      <span className="eyebrow text-fog-600">{t.pages.productDetail.investment}</span>
                      <span className="font-display text-2xl font-semibold text-fog-50">
                        {t.pages.productDetail.onBudget}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-fog-400">
                      {t.pages.productDetail.budgetDescription}
                    </p>
                    <Button href={`/contacto?servico=${product.slug}`} className="w-full">
                      {t.pages.productDetail.requestQuote}
                    </Button>
                  </>
                ) : (
                  <ProductPurchasePanel product={product} />
                )}

                <div className="border-t border-hairline-1 pt-5">
                  <p className="text-xs leading-relaxed text-fog-600">
                    {t.pages.productDetail.needSomethingDifferent}{" "}
                    <Link
                      href="/contacto"
                      className="text-fog-200 underline underline-offset-2 transition-colors hover:text-fog-50"
                    >
                      {t.pages.productDetail.talkToUsLink}
                    </Link>{" "}
                    {t.pages.productDetail.adjustScopeSuffix}
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
              {t.pages.productDetail.alsoIn(localizedPillarTitle(product.pillar, locale).toLowerCase())}
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

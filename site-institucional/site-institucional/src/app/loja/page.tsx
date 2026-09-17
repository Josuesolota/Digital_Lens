import type { Metadata } from "next";
import { ShieldCheck, Truck, Undo2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ProductCard } from "@/components/store/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { SERVICE_PILLARS } from "@/lib/services";
import { absoluteUrl } from "@/lib/site-config";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizePillars, localizeProducts } from "@/lib/i18n/localize";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.pages.store.title,
    description: t.pages.store.metaDescription,
    alternates: { canonical: "/loja" },
  };
}

const GUARANTEE_ICONS = [ShieldCheck, Truck, Undo2];

export default async function LojaPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const pillars = localizePillars(SERVICE_PILLARS, locale);
  const products = localizeProducts(PRODUCTS, locale);
  const GUARANTEES = t.pages.store.guarantees.map((item, index) => ({
    icon: GUARANTEE_ICONS[index],
    title: item.title,
    text: item.text,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Loja Digital Lens",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/loja/${product.slug}`),
      name: product.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden pb-14 pt-16 sm:pt-20">
        <AuroraBackground />
        <Container className="relative flex flex-col gap-10">
          <SectionHeading
            as="h1"
            eyebrow={t.pages.store.eyebrow}
            title={
              <>
                {t.pages.store.titleStart}{" "}
                <span className="text-gradient">{t.pages.store.titleHighlight}</span>
              </>
            }
            description={t.pages.store.description}
          />

          <ul className="grid gap-4 sm:grid-cols-3">
            {GUARANTEES.map((item) => (
              <li
                key={item.title}
                className="glass flex flex-col gap-1.5 rounded-xl p-4"
              >
                <item.icon size={17} className="text-lens-cyan-400" />
                <span className="text-sm font-medium text-fog-50">{item.title}</span>
                <span className="text-xs leading-relaxed text-fog-600">{item.text}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-24 lg:pb-32">
        <Container className="flex flex-col gap-14">
          {pillars.map((pillar) => {
            const pillarProducts = products.filter((product) => product.pillar === pillar.slug);
            if (pillarProducts.length === 0) return null;

            return (
              <div key={pillar.slug} id={pillar.slug} className="scroll-mt-28">
                <div className="mb-6 flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${pillar.gradient[0]}, ${pillar.gradient[1]})`,
                    }}
                  >
                    <pillar.icon size={17} strokeWidth={1.75} className="text-white" />
                  </span>
                  <h2 className="font-display text-xl font-semibold text-fog-50">
                    {pillar.title}
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {pillarProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      showFeatures={false}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </Container>
      </section>
    </>
  );
}

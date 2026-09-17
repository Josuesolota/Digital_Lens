import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/store/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizeProducts } from "@/lib/i18n/localize";

export async function StorePreview() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  /** Os pacotes em destaque na homepage — o resto vive em /loja. */
  const featured = localizeProducts(
    PRODUCTS.filter((product) => product.featured),
    locale
  );

  return (
    <section id="loja" className="relative py-24 lg:py-32">
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={t.storePreview.eyebrow}
            title={
              <>
                {t.storePreview.titleStart}{" "}
                <span className="text-gradient">{t.storePreview.titleHighlight}</span>
              </>
            }
            description={t.storePreview.description}
          />
          <Link
            href="/loja"
            className="group flex shrink-0 self-center items-center gap-2 text-sm text-fog-200 transition-colors hover:text-fog-50 sm:self-auto"
          >
            {t.storePreview.viewFullCatalog}
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}

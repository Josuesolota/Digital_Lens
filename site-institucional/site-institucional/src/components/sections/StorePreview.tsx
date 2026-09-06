import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/store/ProductCard";
import { PRODUCTS } from "@/lib/products";

/** Os pacotes em destaque na homepage — o resto vive em /loja. */
const FEATURED = PRODUCTS.filter((product) => product.featured);

export function StorePreview() {
  return (
    <section id="loja" className="relative py-24 lg:py-32">
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Loja"
            title={
              <>
                Pacotes prontos a{" "}
                <span className="text-gradient">contratar hoje.</span>
              </>
            }
            description="Âmbito fechado, preço transparente e prazo definido. Sem reuniões para saber quanto custa."
          />
          <Link
            href="/loja"
            className="group flex shrink-0 items-center gap-2 text-sm text-fog-200 transition-colors hover:text-fog-50"
          >
            Ver catálogo completo
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}

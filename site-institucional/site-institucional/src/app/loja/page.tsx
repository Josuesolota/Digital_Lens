import type { Metadata } from "next";
import { ShieldCheck, Truck, Undo2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { ProductCard } from "@/components/store/ProductCard";
import { PRODUCTS } from "@/lib/products";
import { SERVICE_PILLARS } from "@/lib/services";
import { absoluteUrl } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Loja",
  description:
    "Pacotes de desenvolvimento web, IA, marketing digital e locução com âmbito fechado, preço transparente e prazo definido.",
  alternates: { canonical: "/loja" },
};

const GUARANTEES = [
  { icon: ShieldCheck, title: "Pagamento seguro", text: "Processado pela Stripe. Nunca guardamos dados do cartão." },
  { icon: Truck, title: "Arranque em 48h", text: "Kick-off agendado até dois dias úteis após a confirmação." },
  { icon: Undo2, title: "Âmbito fechado", text: "Preço e entregáveis definidos por escrito antes de começar." },
];

export default function LojaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Loja Digital Lens",
    itemListElement: PRODUCTS.map((product, index) => ({
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
            eyebrow="Loja"
            title={
              <>
                Serviços com preço,{" "}
                <span className="text-gradient">sem reuniões para o saber.</span>
              </>
            }
            description="Escolha o pacote, pague online e comece esta semana. Projetos maiores continuam a ter orçamento à medida."
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
          {SERVICE_PILLARS.map((pillar) => {
            const products = PRODUCTS.filter((product) => product.pillar === pillar.slug);
            if (products.length === 0) return null;

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
                  {products.map((product, index) => (
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

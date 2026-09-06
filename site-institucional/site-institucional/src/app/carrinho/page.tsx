import { Suspense } from "react";
import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Reveja os serviços seleccionados antes de finalizar a compra.",
  robots: { index: false, follow: false },
};

export default function CarrinhoPage() {
  return (
    <section className="py-16 lg:py-20">
      <Container className="flex flex-col gap-10">
        <h1 className="font-display text-3xl font-semibold text-fog-50 sm:text-4xl">
          Carrinho
        </h1>
        {/* `CartView` lê `?cancelado=1` com `useSearchParams`, que exige um
            limite de Suspense para não desligar a pré-renderização da página. */}
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white/[0.03]" />}>
          <CartView />
        </Suspense>
      </Container>
    </section>
  );
}

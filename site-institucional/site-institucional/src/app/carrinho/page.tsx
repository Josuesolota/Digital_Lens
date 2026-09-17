import { Suspense } from "react";
import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { Container } from "@/components/ui/Container";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.pages.cartPage.title,
    description: t.pages.cartPage.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function CarrinhoPage() {
  const t = getDictionary(await getLocale());

  return (
    <section className="py-16 lg:py-20">
      <Container className="flex flex-col gap-10">
        <h1 className="font-display text-3xl font-semibold text-fog-50 sm:text-4xl">
          {t.pages.cartPage.heading}
        </h1>
        {/* `CartView` lê `?cancelado=1` com `useSearchParams`, que exige um
            limite de Suspense para não desligar a pré-renderização da página. */}
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-surface-1" />}>
          <CartView />
        </Suspense>
      </Container>
    </section>
  );
}

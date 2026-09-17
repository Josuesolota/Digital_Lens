"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/locale";

/**
 * Providers do cliente.
 *
 * `LazyMotion` carrega só o subconjunto `domAnimation` do Framer Motion (~15kb
 * em vez de ~35kb). O modo `strict` obriga a usar `m.*` em vez de `motion.*`
 * em todo o projeto — é o que impede alguém de reintroduzir o bundle completo
 * por distração.
 */
export function Providers({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      <LocaleProvider initialLocale={initialLocale}>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </LocaleProvider>
    </LazyMotion>
  );
}

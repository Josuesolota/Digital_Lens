"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/CartDrawer";

/**
 * Providers do cliente.
 *
 * `LazyMotion` carrega só o subconjunto `domAnimation` do Framer Motion (~15kb
 * em vez de ~35kb). O modo `strict` obriga a usar `m.*` em vez de `motion.*`
 * em todo o projeto — é o que impede alguém de reintroduzir o bundle completo
 * por distração.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </LazyMotion>
  );
}

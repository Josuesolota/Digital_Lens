"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Carrega apenas o subconjunto "domAnimation" das features do Framer Motion
 * (~15kb) em vez do pacote completo (~35kb+). `strict` obriga o uso de `m.*`
 * em vez de `motion.*` em toda a app, garantindo que ninguém reintroduz o
 * bundle completo por engano.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

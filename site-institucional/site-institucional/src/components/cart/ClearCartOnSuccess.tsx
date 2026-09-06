"use client";

import { useEffect } from "react";
import { cartStore } from "@/lib/cart-store";

/**
 * Esvazia o carrinho ao chegar à página de sucesso do checkout.
 *
 * Actua directamente sobre o store externo (não sobre estado do React), que é
 * exactamente o tipo de sincronização com um sistema externo — aqui, o
 * `localStorage` — para que os efeitos existem.
 */
export function ClearCartOnSuccess() {
  useEffect(() => {
    cartStore.dispatch({ type: "clear" });
  }, []);

  return null;
}

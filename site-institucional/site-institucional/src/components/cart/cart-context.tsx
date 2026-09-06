"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getProductById, type Product } from "@/lib/products";
import { cartStore, hydrationStore } from "@/lib/cart-store";

/**
 * Contexto do carrinho.
 *
 * O estado das linhas vive no store externo (`@/lib/cart-store`); aqui apenas
 * o lemos com `useSyncExternalStore` e resolvemos cada linha contra o catálogo.
 * Só o estado de UI (gaveta aberta/fechada) é `useState`.
 */

export type CartLine = { product: Product & { price: number }; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  /** Total das linhas mensais, apresentado à parte do pagamento único */
  monthlySubtotal: number;
  oneTimeSubtotal: number;
  /** `false` até a hidratação ler o localStorage — evita um flash de "vazio" */
  ready: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const stored = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );
  const ready = useSyncExternalStore(
    hydrationStore.subscribe,
    hydrationStore.getSnapshot,
    hydrationStore.getServerSnapshot
  );

  const [isOpen, setIsOpen] = useState(false);

  const lines = useMemo<CartLine[]>(
    () =>
      stored.flatMap((line) => {
        const product = getProductById(line.productId);
        // Produtos sob orçamento (price === null) nunca entram no carrinho.
        if (!product || product.price === null) return [];
        return [
          { product: product as Product & { price: number }, quantity: line.quantity },
        ];
      }),
    [stored]
  );

  const value = useMemo<CartContextValue>(() => {
    const oneTimeSubtotal = lines
      .filter((line) => line.product.billing === "one-time")
      .reduce((total, line) => total + line.product.price * line.quantity, 0);
    const monthlySubtotal = lines
      .filter((line) => line.product.billing === "monthly")
      .reduce((total, line) => total + line.product.price * line.quantity, 0);

    return {
      lines,
      count: lines.reduce((total, line) => total + line.quantity, 0),
      subtotal: oneTimeSubtotal + monthlySubtotal,
      oneTimeSubtotal,
      monthlySubtotal,
      ready,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add: (productId, quantity = 1) => {
        cartStore.dispatch({ type: "add", productId, quantity });
        setIsOpen(true);
      },
      setQuantity: (productId, quantity) =>
        cartStore.dispatch({ type: "setQuantity", productId, quantity }),
      remove: (productId) => cartStore.dispatch({ type: "remove", productId }),
      clear: () => cartStore.dispatch({ type: "clear" }),
    };
  }, [lines, ready, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart tem de ser usado dentro de <CartProvider>.");
  }
  return context;
}

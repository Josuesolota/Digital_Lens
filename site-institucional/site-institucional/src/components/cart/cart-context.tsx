"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getProductById, resolvePrice, type ConfigSelection, type Product } from "@/lib/products";
import { cartStore, hydrationStore, lineKey } from "@/lib/cart-store";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { localizeProduct } from "@/lib/i18n/localize";

/**
 * Contexto do carrinho.
 *
 * O estado das linhas vive no store externo (`@/lib/cart-store`); aqui
 * resolvemos cada linha contra o catálogo com `resolvePrice`, que devolve o
 * preço final e um resumo legível da configuração escolhida. Só o estado de
 * UI (gaveta aberta/fechada) é `useState`.
 */

export type CartLine = {
  product: Product;
  quantity: number;
  selection?: ConfigSelection;
  /** Preço unitário já resolvido a partir da configuração escolhida (cêntimos) */
  unitPrice: number;
  /** Etiquetas legíveis da configuração, ex.: ["Até 6 páginas", "Design 100% original"] */
  summary: readonly string[];
};

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
  add: (productId: string, quantity: number, selection?: ConfigSelection) => void;
  setQuantity: (productId: string, selection: ConfigSelection | undefined, quantity: number) => void;
  remove: (productId: string, selection?: ConfigSelection) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
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

  // Localizar o produto ANTES de resolver o preço: `resolvePrice` lê os
  // rótulos das opções escolhidas directamente do configurador do produto
  // recebido, por isso `summary` (ex.: "Até 6 páginas, Design original")
  // já sai no idioma certo sem tocar em `resolvePrice`.
  const lines = useMemo<CartLine[]>(
    () =>
      stored.flatMap((line) => {
        const product = getProductById(line.productId);
        if (!product) return [];
        const localizedProduct = localizeProduct(product, locale);
        const resolution = resolvePrice(localizedProduct, line.selection);
        // Selecção inválida (catálogo mudou entretanto, dados corrompidos) ou
        // produto sob orçamento: a linha não sobrevive à leitura do carrinho.
        if (!resolution.ok) return [];
        return [
          {
            product: localizedProduct,
            quantity: line.quantity,
            selection: line.selection,
            unitPrice: resolution.price,
            summary: resolution.summary,
          },
        ];
      }),
    [stored, locale]
  );

  const value = useMemo<CartContextValue>(() => {
    const oneTimeSubtotal = lines
      .filter((line) => line.product.billing === "one-time")
      .reduce((total, line) => total + line.unitPrice * line.quantity, 0);
    const monthlySubtotal = lines
      .filter((line) => line.product.billing === "monthly")
      .reduce((total, line) => total + line.unitPrice * line.quantity, 0);

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
      add: (productId, quantity, selection) => {
        cartStore.dispatch({ type: "add", productId, quantity, selection });
        setIsOpen(true);
      },
      setQuantity: (productId, selection, quantity) =>
        cartStore.dispatch({ type: "setQuantity", productId, selection, quantity }),
      remove: (productId, selection) => cartStore.dispatch({ type: "remove", productId, selection }),
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

/** Chave estável para usar como `key` de lista ao iterar `lines`. */
export function cartLineKey(line: CartLine): string {
  return lineKey(line.product.id, line.selection);
}

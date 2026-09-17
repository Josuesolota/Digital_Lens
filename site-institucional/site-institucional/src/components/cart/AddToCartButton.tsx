"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/cart-context";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { ConfigSelection } from "@/lib/products";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  productId: string;
  /** Quantidade a adicionar (ou, em produtos "por hora"/"por pack", o número de unidades) */
  quantity?: number;
  /** Configuração escolhida — ausente para produtos de preço fixo (um só nível) */
  selection?: ConfigSelection;
  /** Desactiva o botão, ex.: enquanto a escolha do configurador é inválida/incompleta */
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
};

export function AddToCartButton({
  productId,
  quantity = 1,
  selection,
  disabled = false,
  className,
  size = "md",
  label,
}: AddToCartButtonProps) {
  const { add } = useCart();
  const { dictionary: t } = useLocale();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // Cancela a confirmação pendente se o componente sair antes do tempo
  // (navegar para outra página com o "Adicionado" ainda a contar).
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <Button
      type="button"
      size={size}
      disabled={disabled}
      className={cn("w-full", className)}
      onClick={() => {
        add(productId, quantity, selection);
        setAdded(true);
        // Confirmação efémera: o estado real vive no badge do carrinho.
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setAdded(false), 1600);
      }}
      aria-live="polite"
    >
      {added ? <Check size={16} /> : <Plus size={16} />}
      {added ? t.addToCart.added : (label ?? t.addToCart.add)}
    </Button>
  );
}

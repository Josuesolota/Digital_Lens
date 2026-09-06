"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  productId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
};

export function AddToCartButton({
  productId,
  className,
  size = "md",
  label = "Adicionar ao carrinho",
}: AddToCartButtonProps) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // Cancela a confirmação pendente se o componente sair antes do tempo
  // (navegar para outra página com o "Adicionado" ainda a contar).
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <Button
      type="button"
      size={size}
      className={cn("w-full", className)}
      onClick={() => {
        add(productId);
        setAdded(true);
        // Confirmação efémera: o estado real vive no badge do carrinho.
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setAdded(false), 1600);
      }}
      aria-live="polite"
    >
      {added ? <Check size={16} /> : <Plus size={16} />}
      {added ? "Adicionado" : label}
    </Button>
  );
}

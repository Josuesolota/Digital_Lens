"use client";

import { useCallback, useState } from "react";
import { type CartLine } from "@/components/cart/cart-context";
import { openPaddleCheckout } from "@/lib/paddle-client";

type CheckoutResponse = {
  transactionId?: string;
  customerEmail?: string | null;
  error?: string;
};

/**
 * Fluxo de checkout partilhado pela gaveta e pela página do carrinho: cria a
 * transacção em `/api/checkout` e abre o overlay da Paddle sobre a própria
 * página — ao contrário do Stripe Checkout, não há redireccionamento.
 */
export function useCheckout(messages: { paymentError: string; networkError: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const checkout = useCallback(
    async (lines: readonly CartLine[]) => {
      setError(null);
      setPending(true);
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: lines.map((line) => ({
              productId: line.product.id,
              quantity: line.quantity,
              selection: line.selection,
            })),
          }),
        });

        const data: CheckoutResponse = await response.json();
        if (!response.ok || !data.transactionId) {
          setError(data.error ?? messages.paymentError);
          return;
        }

        await openPaddleCheckout({
          transactionId: data.transactionId,
          email: data.customerEmail,
          successUrl: `${window.location.origin}/checkout/sucesso?session_id=${data.transactionId}`,
        });
      } catch {
        setError(messages.networkError);
      } finally {
        setPending(false);
      }
    },
    [messages.paymentError, messages.networkError]
  );

  return { checkout, error, pending };
}

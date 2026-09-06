"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/products";

/** Gaveta lateral do carrinho, aberta a partir do ícone da navbar. */
export function CartDrawer() {
  const { isOpen, close, lines, remove, setQuantity, oneTimeSubtotal, monthlySubtotal } =
    useCart();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Trava o scroll da página enquanto a gaveta está aberta (sincronização com
  // o DOM, não com estado do React — é para isto que os efeitos servem).
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Escape fecha a gaveta (padrão de diálogo modal do WAI-ARIA).
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  async function checkout() {
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
          })),
        }),
      });

      const data: { url?: string; error?: string } = await response.json();
      if (!response.ok || !data.url) {
        setError(data.error ?? "Não foi possível iniciar o pagamento.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Falha de rede. Verifique a ligação e tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="absolute inset-0 bg-void-950/80 backdrop-blur-sm"
            onClick={close}
            aria-label="Fechar carrinho"
          />

          <m.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho de compras"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10 bg-void-900"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
          >
            <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <h2 className="font-display text-lg font-semibold text-fog-50">
                Carrinho
              </h2>
              <button
                onClick={close}
                className="rounded-full p-2 text-fog-400 transition-colors hover:bg-white/5 hover:text-fog-50"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBag size={36} className="text-fog-600" strokeWidth={1.25} />
                <p className="text-sm text-fog-400">
                  O seu carrinho está vazio.
                </p>
                <Button href="/loja" variant="secondary" size="sm" onClick={close}>
                  Ver a loja
                </Button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-white/[0.07] overflow-y-auto px-6">
                  {lines.map(({ product, quantity }) => (
                    <li key={product.id} className="flex gap-4 py-5">
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/loja/${product.slug}`}
                          onClick={close}
                          className="font-medium text-fog-50 transition-colors hover:text-lens-violet-400"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 font-mono text-xs text-fog-600">
                          {formatPrice(product.price)}
                          {product.billing === "monthly" && " / mês"}
                        </p>

                        <div className="mt-3 flex items-center gap-1">
                          <QuantityButton
                            label={`Diminuir quantidade de ${product.name}`}
                            onClick={() => setQuantity(product.id, quantity - 1)}
                          >
                            <Minus size={13} />
                          </QuantityButton>
                          <span className="w-9 text-center font-mono text-sm text-fog-200">
                            {quantity}
                          </span>
                          <QuantityButton
                            label={`Aumentar quantidade de ${product.name}`}
                            onClick={() => setQuantity(product.id, quantity + 1)}
                          >
                            <Plus size={13} />
                          </QuantityButton>
                          <button
                            onClick={() => remove(product.id)}
                            className="ml-2 rounded-md p-1.5 text-fog-600 transition-colors hover:text-danger-400"
                            aria-label={`Remover ${product.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <span className="shrink-0 font-mono text-sm text-fog-50">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <footer className="border-t border-white/10 px-6 py-5">
                  {oneTimeSubtotal > 0 && (
                    <Row label="Pagamento único" value={formatPrice(oneTimeSubtotal)} />
                  )}
                  {monthlySubtotal > 0 && (
                    <Row
                      label="Subscrição mensal"
                      value={`${formatPrice(monthlySubtotal)} / mês`}
                    />
                  )}
                  <p className="mt-2 text-xs text-fog-600">
                    IVA calculado no checkout, quando aplicável.
                  </p>

                  {error && (
                    <p
                      role="alert"
                      className="mt-4 rounded-lg border border-danger-400/30 bg-danger-400/10 px-3 py-2 text-xs text-danger-400"
                    >
                      {error}
                    </p>
                  )}

                  <Button
                    type="button"
                    onClick={checkout}
                    disabled={pending}
                    className="mt-4 w-full"
                  >
                    {pending ? "A abrir pagamento…" : "Finalizar compra"}
                  </Button>
                  <Link
                    href="/carrinho"
                    onClick={close}
                    className="mt-3 block text-center text-xs text-fog-400 transition-colors hover:text-fog-50"
                  >
                    Ver carrinho completo
                  </Link>
                </footer>
              </>
            )}
          </m.aside>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function QuantityButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-md border border-white/10 p-1.5 text-fog-200 transition-colors hover:border-white/25 hover:text-fog-50"
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-sm text-fog-400">{label}</span>
      <span className="font-mono text-base font-semibold text-fog-50">{value}</span>
    </div>
  );
}

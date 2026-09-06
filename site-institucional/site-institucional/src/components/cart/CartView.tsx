"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { formatPrice, pillarTitle } from "@/lib/products";

/** Página completa do carrinho — a alternativa "larga" à gaveta lateral. */
export function CartView() {
  const {
    lines,
    ready,
    remove,
    setQuantity,
    oneTimeSubtotal,
    monthlySubtotal,
  } = useCart();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelado") === "1";

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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

  // Evita mostrar "carrinho vazio" antes de ler o localStorage.
  if (!ready) {
    return <div className="h-40 animate-pulse rounded-2xl bg-white/[0.03]" />;
  }

  if (lines.length === 0) {
    return (
      <GlassCard className="flex flex-col items-center gap-5 p-14 text-center">
        <ShoppingBag size={40} className="text-fog-600" strokeWidth={1.25} />
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-xl font-semibold text-fog-50">
            O seu carrinho está vazio
          </h2>
          <p className="text-sm text-fog-400">
            Explore os pacotes disponíveis e comece o seu projeto hoje.
          </p>
        </div>
        <Button href="/loja">Ver a loja</Button>
      </GlassCard>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_0.85fr]">
      <div className="flex flex-col gap-4">
        {cancelled && (
          <p
            role="status"
            className="rounded-xl border border-white/[0.10] bg-white/[0.03] px-4 py-3 text-sm text-fog-400"
          >
            Pagamento cancelado. Os itens continuam guardados no seu carrinho.
          </p>
        )}

        {lines.map(({ product, quantity }) => (
          <GlassCard
            key={product.id}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <span className="eyebrow text-fog-600">
                {pillarTitle(product.pillar)}
              </span>
              <Link
                href={`/loja/${product.slug}`}
                className="mt-1.5 block font-display text-lg font-medium text-fog-50 transition-colors hover:text-lens-violet-400"
              >
                {product.name}
              </Link>
              <p className="mt-1 font-mono text-xs text-fog-600">
                {formatPrice(product.price)}
                {product.billing === "monthly" && " / mês"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
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
              </div>

              <span className="w-24 text-right font-mono text-sm text-fog-50">
                {formatPrice(product.price * quantity)}
              </span>

              <button
                onClick={() => remove(product.id)}
                className="rounded-md p-2 text-fog-600 transition-colors hover:text-danger-400"
                aria-label={`Remover ${product.name}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <GlassCard className="flex flex-col gap-4 p-6">
          <h2 className="font-display text-lg font-semibold text-fog-50">Resumo</h2>

          {oneTimeSubtotal > 0 && (
            <Row label="Pagamento único" value={formatPrice(oneTimeSubtotal)} />
          )}
          {monthlySubtotal > 0 && (
            <Row
              label="Subscrição mensal"
              value={`${formatPrice(monthlySubtotal)} / mês`}
            />
          )}

          <p className="text-xs leading-relaxed text-fog-600">
            IVA calculado no checkout. Serviços mensais e pagamentos únicos são
            finalizados em compras separadas.
          </p>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-danger-400/30 bg-danger-400/10 px-3 py-2 text-xs text-danger-400"
            >
              {error}
            </p>
          )}

          <Button type="button" onClick={checkout} disabled={pending} className="w-full">
            {pending ? "A abrir pagamento…" : "Finalizar compra"}
          </Button>
          <Link
            href="/loja"
            className="text-center text-xs text-fog-400 transition-colors hover:text-fog-50"
          >
            Continuar a comprar
          </Link>
        </GlassCard>
      </aside>
    </div>
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
    <div className="flex items-baseline justify-between border-b border-white/[0.07] pb-3">
      <span className="text-sm text-fog-400">{label}</span>
      <span className="font-mono text-base font-semibold text-fog-50">{value}</span>
    </div>
  );
}

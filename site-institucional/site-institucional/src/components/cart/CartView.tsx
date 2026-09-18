"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { cartLineKey, useCart, type CartLine } from "@/components/cart/cart-context";
import { useCheckout } from "@/components/cart/use-checkout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatPrice } from "@/lib/products";
import { localizedPillarTitle } from "@/lib/i18n/localize";

/** Página completa do carrinho — a alternativa "larga" à gaveta lateral. */
export function CartView() {
  const { dictionary: t } = useLocale();
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

  const { checkout, error, pending } = useCheckout({
    paymentError: t.cart.paymentError,
    networkError: t.cart.networkError,
  });

  // Evita mostrar "carrinho vazio" antes de ler o localStorage.
  if (!ready) {
    return <div className="h-40 animate-pulse rounded-2xl bg-surface-1" />;
  }

  if (lines.length === 0) {
    return (
      <GlassCard className="flex flex-col items-center gap-5 p-14 text-center">
        <ShoppingBag size={40} className="text-fog-600" strokeWidth={1.25} />
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-xl font-semibold text-fog-50">
            {t.cart.emptyHeading}
          </h2>
          <p className="text-sm text-fog-400">{t.cart.emptyDescription}</p>
        </div>
        <Button href="/loja">{t.cart.viewStore}</Button>
      </GlassCard>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_0.85fr]">
      <div className="flex flex-col gap-4">
        {cancelled && (
          <p
            role="status"
            className="rounded-xl border border-hairline-2 bg-surface-1 px-4 py-3 text-sm text-fog-400"
          >
            {t.cart.cancelledNotice}
          </p>
        )}

        {lines.map((line) => (
          <CartLineCard
            key={cartLineKey(line)}
            line={line}
            onRemove={() => remove(line.product.id, line.selection)}
            onDecrease={() => setQuantity(line.product.id, line.selection, line.quantity - 1)}
            onIncrease={() => setQuantity(line.product.id, line.selection, line.quantity + 1)}
          />
        ))}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <GlassCard className="flex flex-col gap-4 p-6">
          <h2 className="font-display text-lg font-semibold text-fog-50">{t.cart.summary}</h2>

          {oneTimeSubtotal > 0 && (
            <Row label={t.cart.oneTime} value={formatPrice(oneTimeSubtotal)} />
          )}
          {monthlySubtotal > 0 && (
            <Row
              label={t.cart.monthly}
              value={`${formatPrice(monthlySubtotal)} ${t.cart.perMonth}`}
            />
          )}

          <p className="text-xs leading-relaxed text-fog-600">{t.cart.vatNoteFull}</p>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-danger-400/30 bg-danger-400/10 px-3 py-2 text-xs text-danger-400"
            >
              {error}
            </p>
          )}

          <Button type="button" onClick={() => checkout(lines)} disabled={pending} className="w-full">
            {pending ? t.cart.openingPayment : t.cart.checkout}
          </Button>
          <Link
            href="/loja"
            className="text-center text-xs text-fog-400 transition-colors hover:text-fog-50"
          >
            {t.cart.continueShopping}
          </Link>
        </GlassCard>
      </aside>
    </div>
  );
}

function CartLineCard({
  line,
  onRemove,
  onDecrease,
  onIncrease,
}: {
  line: CartLine;
  onRemove: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const { locale, dictionary: t } = useLocale();
  const { product, quantity, unitPrice, summary } = line;

  return (
    <GlassCard className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <span className="eyebrow text-fog-600">{localizedPillarTitle(product.pillar, locale)}</span>
        <Link
          href={`/loja/${product.slug}`}
          className="mt-1.5 block font-display text-lg font-medium text-fog-50 transition-colors hover:text-lens-violet-400"
        >
          {product.name}
        </Link>
        {summary.length > 0 && (
          <p className="mt-1 text-xs text-fog-400">{summary.join(", ")}</p>
        )}
        <p className="mt-1 font-mono text-xs text-fog-600">
          {formatPrice(unitPrice)}
          {product.billing === "monthly" && ` ${t.cart.perMonth}`}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <QuantityButton label={t.cart.decreaseQty(product.name)} onClick={onDecrease}>
            <Minus size={13} />
          </QuantityButton>
          <span className="w-9 text-center font-mono text-sm text-fog-200">{quantity}</span>
          <QuantityButton label={t.cart.increaseQty(product.name)} onClick={onIncrease}>
            <Plus size={13} />
          </QuantityButton>
        </div>

        <span className="w-24 text-right font-mono text-sm text-fog-50">
          {formatPrice(unitPrice * quantity)}
        </span>

        <button
          onClick={onRemove}
          className="rounded-md p-2 text-fog-600 transition-colors hover:text-danger-400"
          aria-label={t.cart.remove(product.name)}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </GlassCard>
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
      className="rounded-md border border-hairline-2 p-1.5 text-fog-200 transition-colors hover:border-hairline-3 hover:text-fog-50"
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-hairline-1 pb-3">
      <span className="text-sm text-fog-400">{label}</span>
      <span className="font-mono text-base font-semibold text-fog-50">{value}</span>
    </div>
  );
}

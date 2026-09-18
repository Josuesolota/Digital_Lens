"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { cartLineKey, useCart, type CartLine } from "@/components/cart/cart-context";
import { useCheckout } from "@/components/cart/use-checkout";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatPrice } from "@/lib/products";

/** Gaveta lateral do carrinho, aberta a partir do ícone da navbar. */
export function CartDrawer() {
  const { dictionary: t } = useLocale();
  const { isOpen, close, lines, remove, setQuantity, oneTimeSubtotal, monthlySubtotal } =
    useCart();
  const { checkout, error, pending } = useCheckout({
    paymentError: t.cart.paymentError,
    networkError: t.cart.networkError,
  });

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
            aria-label={t.cart.closeCart}
          />

          <m.aside
            role="dialog"
            aria-modal="true"
            aria-label={t.cart.cartAriaLabel}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-hairline-2 bg-void-900"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
          >
            <header className="flex items-center justify-between border-b border-hairline-2 px-6 py-5">
              <h2 className="font-display text-lg font-semibold text-fog-50">
                {t.cart.title}
              </h2>
              <button
                onClick={close}
                className="rounded-full p-2 text-fog-400 transition-colors hover:bg-surface-2 hover:text-fog-50"
                aria-label={t.cart.close}
              >
                <X size={18} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBag size={36} className="text-fog-600" strokeWidth={1.25} />
                <p className="text-sm text-fog-400">{t.cart.empty}</p>
                <Button href="/loja" variant="secondary" size="sm" onClick={close}>
                  {t.cart.viewStore}
                </Button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-hairline-1 overflow-y-auto px-6">
                  {lines.map((line) => (
                    <CartLineItem
                      key={cartLineKey(line)}
                      line={line}
                      onNavigate={close}
                      onRemove={() => remove(line.product.id, line.selection)}
                      onDecrease={() =>
                        setQuantity(line.product.id, line.selection, line.quantity - 1)
                      }
                      onIncrease={() =>
                        setQuantity(line.product.id, line.selection, line.quantity + 1)
                      }
                    />
                  ))}
                </ul>

                <footer className="border-t border-hairline-2 px-6 py-5">
                  {oneTimeSubtotal > 0 && (
                    <Row label={t.cart.oneTime} value={formatPrice(oneTimeSubtotal)} />
                  )}
                  {monthlySubtotal > 0 && (
                    <Row
                      label={t.cart.monthly}
                      value={`${formatPrice(monthlySubtotal)} ${t.cart.perMonth}`}
                    />
                  )}
                  <p className="mt-2 text-xs text-fog-600">{t.cart.vatNote}</p>

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
                    onClick={() => checkout(lines)}
                    disabled={pending}
                    className="mt-4 w-full"
                  >
                    {pending ? t.cart.openingPayment : t.cart.checkout}
                  </Button>
                  <Link
                    href="/carrinho"
                    onClick={close}
                    className="mt-3 block text-center text-xs text-fog-400 transition-colors hover:text-fog-50"
                  >
                    {t.cart.viewFullCart}
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

function CartLineItem({
  line,
  onNavigate,
  onRemove,
  onDecrease,
  onIncrease,
}: {
  line: CartLine;
  onNavigate: () => void;
  onRemove: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const { dictionary: t } = useLocale();
  const { product, quantity, unitPrice, summary } = line;

  return (
    <li className="flex gap-4 py-5">
      <div className="min-w-0 flex-1">
        <Link
          href={`/loja/${product.slug}`}
          onClick={onNavigate}
          className="font-medium text-fog-50 transition-colors hover:text-lens-violet-400"
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

        <div className="mt-3 flex items-center gap-1">
          <QuantityButton label={t.cart.decreaseQty(product.name)} onClick={onDecrease}>
            <Minus size={13} />
          </QuantityButton>
          <span className="w-9 text-center font-mono text-sm text-fog-200">{quantity}</span>
          <QuantityButton label={t.cart.increaseQty(product.name)} onClick={onIncrease}>
            <Plus size={13} />
          </QuantityButton>
          <button
            onClick={onRemove}
            className="ml-2 rounded-md p-1.5 text-fog-600 transition-colors hover:text-danger-400"
            aria-label={t.cart.remove(product.name)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <span className="shrink-0 font-mono text-sm text-fog-50">
        {formatPrice(unitPrice * quantity)}
      </span>
    </li>
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
    <div className="flex items-baseline justify-between py-1">
      <span className="text-sm text-fog-400">{label}</span>
      <span className="font-mono text-base font-semibold text-fog-50">{value}</span>
    </div>
  );
}

"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function CartButton({ className }: { className?: string }) {
  const { count, open, ready } = useCart();
  const { dictionary: t } = useLocale();

  return (
    <button
      type="button"
      onClick={open}
      className={`relative rounded-full p-2.5 text-fog-200 transition-colors hover:bg-surface-2 hover:text-fog-50 ${className ?? ""}`}
      aria-label={count > 0 ? t.cart.cartWithCount(count) : t.cart.cartEmptyAria}
    >
      <ShoppingBag size={19} strokeWidth={1.75} />
      {ready && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-lens-magenta-500 px-1 font-mono text-[10px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

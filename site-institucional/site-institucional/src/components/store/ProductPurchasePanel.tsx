"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Check, Minus, Plus } from "lucide-react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import {
  defaultSelection,
  formatKwanzaEquivalent,
  formatPrice,
  formatPriceRange,
  resolvePrice,
  type ConfigSelection,
  type Product,
} from "@/lib/products";
import { cn } from "@/lib/utils";

const MAX_QUANTITY = 20;

/**
 * Painel de compra interactivo: o cliente escolhe o âmbito e os extras (ou o
 * nível de complexidade), o preço ajusta-se em tempo real dentro da faixa do
 * produto, e só então adiciona ao carrinho.
 *
 * O preço mostrado aqui é só para orientação visual — o `/api/checkout`
 * nunca confia nele, recalcula sempre a partir de `product.id` + a escolha
 * enviada, exactamente com a mesma função `resolvePrice`.
 *
 * Só é montado quando `product.priceRange` e `product.configurator` não são
 * `null` — produtos sob orçamento usam outro ramo na página do produto.
 */
export function ProductPurchasePanel({ product }: { product: Product }) {
  const configurator = product.configurator;
  const priceRange = product.priceRange;

  const [selection, setSelection] = useState<ConfigSelection | undefined>(
    configurator ? defaultSelection(configurator) : undefined
  );
  const [quantity, setQuantity] = useState(1);

  const resolution = useMemo(
    () => resolvePrice(product, selection),
    [product, selection]
  );

  if (!configurator || !priceRange) return null;

  const unitPrice = resolution.ok ? resolution.price : priceRange.min;
  const totalPrice = unitPrice * quantity;
  const quantityLabel =
    configurator.kind === "tier" ? (configurator.quantityLabel ?? "unidades") : "unidades";

  function selectSingleOption(groupOptionIds: readonly string[], optionId: string) {
    setSelection((current) => {
      if (!current || current.kind !== "features") return current;
      const withoutGroup = current.optionIds.filter((id) => !groupOptionIds.includes(id));
      return { kind: "features", optionIds: [...withoutGroup, optionId] };
    });
  }

  function toggleMultiOption(optionId: string) {
    setSelection((current) => {
      if (!current || current.kind !== "features") return current;
      const has = current.optionIds.includes(optionId);
      return {
        kind: "features",
        optionIds: has
          ? current.optionIds.filter((id) => id !== optionId)
          : [...current.optionIds, optionId],
      };
    });
  }

  function selectTierLevel(levelIndex: number) {
    setSelection({ kind: "tier", levelIndex });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <span className="eyebrow text-fog-600">Investimento</span>
        <span className="flex items-baseline gap-1.5">
          <span className="font-display text-4xl font-semibold text-gradient">
            {formatPrice(totalPrice)}
          </span>
          {product.billing === "monthly" && (
            <span className="text-sm text-fog-600">/ mês</span>
          )}
        </span>
        <span className="font-mono text-xs text-fog-600">
          / {formatKwanzaEquivalent(totalPrice)}
          {product.billing === "monthly" && " / mês"}
        </span>
        <span className="text-xs text-fog-600">
          {priceRange.min !== priceRange.max && `Faixa: ${formatPriceRange(priceRange)}. `}
          IVA à taxa legal em vigor, calculado no checkout.
        </span>
      </div>

      {configurator.kind === "features" ? (
        <div className="flex flex-col gap-5 border-y border-white/[0.08] py-5">
          {configurator.groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-2.5">
              <span className="eyebrow text-fog-600">{group.title}</span>
              <div className="flex flex-wrap gap-2">
                {group.options.map((option) => {
                  const selected =
                    selection?.kind === "features" && selection.optionIds.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        group.type === "single"
                          ? selectSingleOption(
                              group.options.map((o) => o.id),
                              option.id
                            )
                          : toggleMultiOption(option.id)
                      }
                      aria-pressed={selected}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                        selected
                          ? "border-lens-violet-400/60 bg-lens-violet-500/15 text-fog-50"
                          : "border-white/[0.10] bg-white/[0.03] text-fog-400 hover:border-white/20 hover:text-fog-200"
                      )}
                    >
                      {selected && <Check size={12} className="text-lens-cyan-400" />}
                      {option.label}
                      {option.priceDelta > 0 && (
                        <span className="text-[10px] text-fog-600">
                          +{formatPrice(option.priceDelta)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : configurator.levels.length > 1 ? (
        <div className="flex flex-col gap-2 border-y border-white/[0.08] py-5">
          <span className="eyebrow text-fog-600">Nível</span>
          {configurator.levels.map((level, index) => {
            const selected = selection?.kind === "tier" && selection.levelIndex === index;
            return (
              <button
                key={level.label}
                type="button"
                onClick={() => selectTierLevel(index)}
                aria-pressed={selected}
                className={cn(
                  "flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors",
                  selected
                    ? "border-lens-violet-400/60 bg-lens-violet-500/10"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
                )}
              >
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-fog-50">
                    {selected && <Check size={13} className="shrink-0 text-lens-cyan-400" />}
                    {level.label}
                  </span>
                  <span className="text-xs text-fog-400">{level.description}</span>
                </span>
                <span className="shrink-0 font-mono text-sm text-fog-200">
                  {formatPrice(level.price)}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <span className="text-sm text-fog-400">Quantidade ({quantityLabel})</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Diminuir quantidade"
            className="rounded-md border border-white/10 p-1.5 text-fog-200 transition-colors hover:border-white/25 hover:text-fog-50"
          >
            <Minus size={13} />
          </button>
          <span className="w-9 text-center font-mono text-sm text-fog-200">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
            aria-label="Aumentar quantidade"
            className="rounded-md border border-white/10 p-1.5 text-fog-200 transition-colors hover:border-white/25 hover:text-fog-50"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      <AddToCartButton
        productId={product.id}
        quantity={quantity}
        selection={selection}
        disabled={!resolution.ok}
      />

      <p className="flex items-center gap-2 text-xs text-fog-400">
        <CalendarClock size={14} className="text-lens-violet-400" />
        Entrega típica em {product.deliveryDays} dias úteis
      </p>
    </div>
  );
}

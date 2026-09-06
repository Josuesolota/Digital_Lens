"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatPrice, pillarTitle, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  index?: number;
  /** Mostra as 3 primeiras características — desligar em grelhas compactas */
  showFeatures?: boolean;
};

export function ProductCard({
  product,
  index = 0,
  showFeatures = true,
}: ProductCardProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.06 }}
      className="h-full"
    >
      <GlassCard
        interactive
        className={cn(
          "group flex h-full flex-col p-6",
          product.featured && "ring-1 ring-lens-violet-500/40"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          {/* `truncate` impede que um pilar de nome longo passe a duas linhas
              e empurre o badge — os cartões da grelha ficariam desalinhados. */}
          <span className="eyebrow min-w-0 truncate text-fog-600">
            {pillarTitle(product.pillar)}
          </span>
          {product.featured && (
            <span className="shrink-0 rounded-full bg-lens-violet-500/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-lens-violet-400">
              Popular
            </span>
          )}
        </div>

        <Link href={`/loja/${product.slug}`} className="mt-3 flex items-start gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight text-fog-50 transition-colors group-hover:text-lens-violet-400">
            {product.name}
          </h3>
          <ArrowUpRight
            size={16}
            className="mt-1 shrink-0 text-fog-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fog-50"
          />
        </Link>

        <p className="mb-6 mt-2 text-sm leading-relaxed text-fog-400">{product.summary}</p>

        {showFeatures && (
          <ul className="mt-5 flex flex-col gap-2">
            {product.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-xs text-fog-400">
                <Check size={13} className="mt-0.5 shrink-0 text-lens-cyan-400" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-baseline gap-1.5 border-t border-white/[0.07] pt-5">
          {product.price === null ? (
            <span className="font-display text-xl font-semibold text-fog-50">
              Sob orçamento
            </span>
          ) : (
            <>
              <span className="text-xs text-fog-600">desde</span>
              <span className="font-display text-2xl font-semibold text-gradient">
                {formatPrice(product.price)}
              </span>
              {product.billing === "monthly" && (
                <span className="text-xs text-fog-600">/ mês</span>
              )}
            </>
          )}
        </div>

        <div className="mt-4">
          {product.price === null ? (
            <Button
              href={`/contacto?servico=${product.slug}`}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              Pedir orçamento
            </Button>
          ) : (
            <AddToCartButton productId={product.id} size="sm" />
          )}
        </div>
      </GlassCard>
    </m.div>
  );
}

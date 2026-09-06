import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  /** Acende o contorno em gradiente no hover */
  interactive?: boolean;
};

/**
 * Superfície-base da interface: painel de vidro sobre o void.
 * O contorno em gradiente é desenhado num pseudo-elemento com máscara
 * (`ring-lens-after`), técnica que permite bordas em gradiente sem pintar o
 * interior do cartão.
 */
export function GlassCard({
  className,
  interactive = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass relative rounded-2xl transition-all duration-500",
        interactive &&
          "hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-[0_28px_70px_-32px_rgba(124,58,237,0.6)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

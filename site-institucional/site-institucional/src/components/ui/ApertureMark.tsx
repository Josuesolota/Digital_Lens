"use client";

import { m, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type ApertureMarkProps = {
  size?: number;
  className?: string;
  /** "closed" no repouso, abre em hover/inView — usado no logo */
  interactive?: boolean;
  /** anima a abertura automaticamente ao entrar em viewport — usado no Hero */
  autoOpen?: boolean;
};

const BLADE_COUNT = 6;

/**
 * Marca de uma íris de câmara com 6 lâminas.
 * Referência directa ao nome "Digital Lens" — não é um ícone genérico,
 * é o elemento único pelo qual a página deve ser lembrada.
 */
export function ApertureMark({
  size = 40,
  className,
  interactive = true,
  autoOpen = false,
}: ApertureMarkProps) {
  const bladeVariants: Variants = {
    closed: { rotate: 0, scaleY: 1 },
    open: { rotate: 26, scaleY: 0.72 },
  };

  return (
    <m.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={cn("overflow-visible", className)}
      initial="closed"
      whileHover={interactive ? "open" : undefined}
      animate={autoOpen ? "open" : undefined}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <circle
        cx="50"
        cy="50"
        r="47"
        className="fill-none stroke-current opacity-20"
        strokeWidth="1.5"
      />
      <g>
        {Array.from({ length: BLADE_COUNT }).map((_, i) => (
          <m.path
            key={i}
            d="M50 50 L50 4 A46 46 0 0 1 88.8 27 Z"
            className="fill-current"
            style={{
              transformOrigin: "50px 50px",
              transformBox: "fill-box",
            }}
            transform={`rotate(${(360 / BLADE_COUNT) * i} 50 50)`}
            variants={bladeVariants}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              delay: i * 0.02,
            }}
          />
        ))}
      </g>
    </m.svg>
  );
}

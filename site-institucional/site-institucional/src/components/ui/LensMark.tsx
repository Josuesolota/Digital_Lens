"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

type LensMarkProps = {
  size?: number;
  className?: string;
  /** Halo pulsante à volta da lente — usar apenas uma vez por vista */
  glow?: boolean;
};

/**
 * A marca: a lente vectorizada.
 *
 * Reproduz o símbolo da Digital Lens — aro cromado, vidro em gradiente
 * azul → violeta → magenta e reflexo especular no topo. Em SVG mantém-se nítida
 * em qualquer tamanho e herda o tema, ao contrário do PNG de origem (que fica
 * reservado para os ícones do PWA e para a imagem de partilha social).
 *
 * Os `id` dos gradientes vêm de `useId()` porque a página rende várias lentes
 * ao mesmo tempo — ids fixos fariam a segunda instância herdar os defs da
 * primeira.
 */
export function LensMark({ size = 40, className, glow = false }: LensMarkProps) {
  const uid = useId().replace(/:/g, "");
  const chrome = `chrome-${uid}`;
  const glass = `glass-${uid}`;
  const shine = `shine-${uid}`;
  const inner = `inner-${uid}`;

  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-lens-violet-500/40 blur-2xl motion-safe:animate-pulse-ring"
        />
      )}
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        role="img"
        aria-label="Digital Lens"
        className="relative"
      >
        <defs>
          {/* Aro metálico: claro em cima, escuro em baixo — sugere volume */}
          <linearGradient id={chrome} x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="#f6f9ff" />
            <stop offset="26%" stopColor="#9aa6ba" />
            <stop offset="50%" stopColor="#2b3242" />
            <stop offset="74%" stopColor="#b7c2d3" />
            <stop offset="100%" stopColor="#4a5468" />
          </linearGradient>

          {/* Vidro: azul no topo, magenta na base — o gradiente da marca */}
          <radialGradient id={glass} cx="0.42" cy="0.3" r="0.92">
            <stop offset="0%" stopColor="#6aa8ff" />
            <stop offset="34%" stopColor="#2563eb" />
            <stop offset="64%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#d426c4" />
          </radialGradient>

          {/* Reflexo especular no quadrante superior */}
          <linearGradient id={shine} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Anel interior escuro entre o aro e o vidro */}
          <linearGradient id={inner} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0b0f1a" />
            <stop offset="100%" stopColor="#232c3d" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="49" fill={`url(#${chrome})`} />
        <circle cx="50" cy="50" r="41" fill={`url(#${inner})`} />
        <circle cx="50" cy="50" r="35.5" fill={`url(#${glass})`} />
        {/* Elipse do reflexo, ligeiramente acima do centro */}
        <ellipse cx="50" cy="33" rx="24" ry="14" fill={`url(#${shine})`} />
      </svg>
    </span>
  );
}

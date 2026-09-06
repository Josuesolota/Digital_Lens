import { cn } from "@/lib/utils";

/**
 * Fundo ambiente: grelha técnica + três manchas de luz nas cores da lente.
 *
 * Puramente decorativo (`aria-hidden`) e sem JavaScript — só CSS. As manchas
 * usam `animate-aurora`, que a media query `prefers-reduced-motion` do
 * `globals.css` desliga automaticamente.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="grid-void absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_35%,transparent_100%)]" />

      <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-lens-blue-600/25 blur-[120px] motion-safe:animate-aurora" />
      <div
        className="absolute -top-24 right-[8%] h-[28rem] w-[28rem] rounded-full bg-lens-violet-600/25 blur-[110px] motion-safe:animate-aurora"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute top-40 left-[4%] h-[24rem] w-[24rem] rounded-full bg-lens-magenta-600/20 blur-[110px] motion-safe:animate-aurora"
        style={{ animationDelay: "-12s" }}
      />

      {/* Esbate tudo para o void na base, para a secção seguinte não cortar */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,var(--color-void-950))]" />
    </div>
  );
}

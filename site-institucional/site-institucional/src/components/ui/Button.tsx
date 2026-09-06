import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium tracking-wide " +
  "transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-lens-violet-400";

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3",
  lg: "px-8 py-4 text-base",
};

const variants = {
  /** Acção principal — carrega o gradiente da lente */
  primary:
    "bg-[linear-gradient(100deg,var(--color-lens-blue-500),var(--color-lens-violet-500)_55%,var(--color-lens-magenta-500))] " +
    "bg-[length:200%_100%] bg-left text-white shadow-[0_10px_40px_-12px_rgba(124,58,237,0.75)] " +
    "hover:bg-right hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-12px_rgba(212,38,196,0.7)] active:translate-y-0",
  /** Acção secundária — vidro com contorno subtil */
  secondary:
    "glass text-fog-50 hover:border-white/20 hover:bg-white/[0.07] hover:-translate-y-0.5 active:translate-y-0",
  /** Terciária — sem caixa */
  ghost: "text-fog-400 hover:text-fog-50",
  /** Destrutiva/neutra sobre fundos claros invertidos */
  outline:
    "border border-white/15 text-fog-200 hover:border-lens-violet-400/60 hover:text-fog-50",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type Shared = { variant?: Variant; size?: Size; className?: string };

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> &
  Shared & { href?: undefined };

type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> &
  Shared & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const classes = cn(base, sizes[size], variants[variant], className);

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    // Âncoras e links externos não passam pelo router do Next.
    const isInternal = href.startsWith("/");
    if (!isInternal) {
      return <a {...anchorProps} href={href} className={classes} />;
    }
    return <Link {...anchorProps} href={href} className={classes} />;
  }

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={classes}
    />
  );
}

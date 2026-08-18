import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-signal-600 text-paper-50 hover:bg-signal-400 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_8px_24px_-8px_rgba(179,39,45,0.6)]",
  secondary:
    "border border-ink-900/20 text-ink-900 hover:border-ink-900 hover:bg-ink-900 hover:text-paper-50",
  ghost: "text-ink-900 hover:text-signal-600",
};

type Variant = keyof typeof variants;

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  variant?: Variant;
};

type ButtonAsLink = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", className, ...rest } = props;

  if ("href" in rest && rest.href) {
    return (
      <Link
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        href={rest.href}
        className={cn(base, variants[variant], className)}
      />
    );
  }

  return (
    <button
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={cn(base, variants[variant], className)}
    />
  );
}

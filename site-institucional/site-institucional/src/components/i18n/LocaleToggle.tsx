"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export function LocaleToggle({ className }: { className?: string }) {
  const { locale, dictionary, setLocale } = useLocale();
  const isEn = locale === "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(isEn ? "pt" : "en")}
      aria-label={isEn ? dictionary.locale.switchToPt : dictionary.locale.switchToEn}
      className={cn(
        "flex h-9 min-w-9 items-center justify-center rounded-full px-2 font-mono text-xs font-semibold text-fog-200 transition-colors hover:bg-surface-2 hover:text-fog-50",
        className
      )}
    >
      {isEn ? "EN" : "PT"}
    </button>
  );
}

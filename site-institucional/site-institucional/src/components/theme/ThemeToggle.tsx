"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/use-theme";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { dictionary: t } = useLocale();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? t.theme.activateDark : t.theme.activateLight}
      aria-pressed={isLight}
      className={cn(
        "relative rounded-full p-2.5 text-fog-200 transition-colors hover:bg-surface-2 hover:text-fog-50",
        className
      )}
    >
      {/* As duas versões coexistem no DOM e alternam por opacidade/rotação —
          evita um salto de layout ao trocar o ícone. */}
      <Sun
        size={19}
        strokeWidth={1.75}
        className={cn(
          "transition-all duration-300",
          isLight ? "rotate-0 opacity-100" : "absolute inset-2.5 -rotate-90 opacity-0"
        )}
      />
      <Moon
        size={19}
        strokeWidth={1.75}
        className={cn(
          "transition-all duration-300",
          isLight ? "absolute inset-2.5 rotate-90 opacity-0" : "rotate-0 opacity-100"
        )}
      />
    </button>
  );
}

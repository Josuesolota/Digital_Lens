"use client";

import { useSyncExternalStore } from "react";
import { themeStore, type Theme } from "@/lib/theme-store";

/** Tema activo + função para o trocar. Nunca lança — funciona sem JS de arranque graças ao script inline em `<head>`. */
export function useTheme(): { theme: Theme; toggleTheme: () => void } {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );

  return { theme, toggleTheme: themeStore.toggle };
}

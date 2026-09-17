/**
 * Store externo do tema (claro/escuro) — mesmo padrão do carrinho
 * (`cart-store.ts`): vive fora do React, consumido com `useSyncExternalStore`,
 * persistido em `localStorage`.
 *
 * A troca em si (que cor cada token passa a ter) é toda feita em CSS —
 * `globals.css` redefine `--color-void-*`/`--color-fog-*`/etc. sob
 * `[data-theme="light"]`. Este módulo só decide QUAL tema está activo e
 * aplica o atributo `data-theme` no `<html>`.
 *
 * Sem flash no primeiro carregamento: um script inline no `<head>`
 * (`src/components/theme/theme-init-script.ts`, corrido antes da hidratação)
 * já aplica o atributo a partir do `localStorage` no primeiro paint — este
 * store só assume esse estado quando é montado, nunca o contradiz.
 */

export type Theme = "dark" | "light";

const STORAGE_KEY = "dl.theme";
const DEFAULT_THEME: Theme = "dark"; // dark-first por decisão de marca

let theme: Theme = DEFAULT_THEME;
let hydrated = false;
const listeners = new Set<() => void>();

function readStorage(): Theme {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "light" ? "light" : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function applyToDocument(next: Theme) {
  // O script inline já pode ter aplicado isto antes da hidratação — reescrever
  // com o mesmo valor é inofensivo, e garante que ficam sempre em sincronia.
  if (next === "dark") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}

function hydrate() {
  if (hydrated) return;
  hydrated = true;
  theme = readStorage();
}

function emit() {
  for (const listener of listeners) listener();
}

export const themeStore = {
  subscribe(listener: () => void) {
    hydrate();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): Theme {
    hydrate();
    return theme;
  },

  /** No servidor: sempre "dark" — é o que `globals.css` assume sem `data-theme`. */
  getServerSnapshot(): Theme {
    return DEFAULT_THEME;
  },

  set(next: Theme) {
    hydrate();
    if (next === theme) return;
    theme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sem persistência: a escolha vale só para esta visita.
    }
    applyToDocument(next);
    emit();
  },

  toggle() {
    themeStore.set(theme === "dark" ? "light" : "dark");
  },
};

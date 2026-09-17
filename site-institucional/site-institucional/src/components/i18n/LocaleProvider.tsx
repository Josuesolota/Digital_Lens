"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionary";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/locale";

/**
 * Ao contrário do tema (só CSS, puramente do lado do cliente), o idioma
 * também determina o texto que os Server Components produzem — o catálogo de
 * serviços/produtos é traduzido no servidor a partir do cookie. Por isso o
 * valor inicial vem sempre do servidor (`getLocale()` em `layout.tsx`), nunca
 * de `localStorage`: garante que o primeiro parágrafo dos Client Components
 * bate certo com o que o servidor já enviou, sem flash de um idioma para o
 * outro no primeiro render.
 *
 * `setLocale` faz três coisas: actualiza o estado do contexto (Client
 * Components re-renderizam já no idioma novo), grava o cookie (para o próximo
 * pedido) e pede um `router.refresh()` (para os Server Components — páginas
 * de serviço/produto, metadata — voltarem a renderizar com o cookie novo, sem
 * recarregar a página toda).
 */

type LocaleContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (next: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState((current) => {
        if (current === next) return current;
        try {
          document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
        } catch {
          // Sem cookies (modo privado estrito): a escolha vale só para esta visita.
        }
        router.refresh();
        return next;
      });
    },
    [router]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dictionary: getDictionary(locale), setLocale }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale tem de ser usado dentro de <LocaleProvider>.");
  }
  return context;
}

import type { Locale } from "@/lib/i18n/locale";

/** Data de publicação por extenso, no idioma activo: "18 de setembro de 2026". */
export function formatPostDate(dateISO: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "pt-PT", {
    dateStyle: "long",
  }).format(new Date(dateISO));
}

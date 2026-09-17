/**
 * Idioma activo do site — português (default) ou inglês.
 *
 * Guardado em cookie (não `localStorage`) porque, ao contrário do tema, o
 * idioma também tem de estar disponível em Server Components (páginas de
 * serviço/produto que traduzem o catálogo antes de enviar HTML ao cliente).
 * `localStorage` só existe no browser; um cookie viaja com o pedido.
 */
export type Locale = "pt" | "en";

export const LOCALE_COOKIE = "dl.locale";
export const DEFAULT_LOCALE: Locale = "pt";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "pt" || value === "en";
}

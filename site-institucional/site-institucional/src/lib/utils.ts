import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes condicionais e resolve conflitos entre utilitários Tailwind.
 *
 * O `twMerge` não é acessório: os componentes definem classes-base (ex.: o
 * `Button` traz `inline-flex`) e quem os usa passa modificadores (`hidden
 * lg:inline-flex`). Só com `clsx`, ambas ficam no atributo e o vencedor passa a
 * depender da ordem em que o Tailwind gera o CSS — foi assim que o botão
 * "Iniciar projeto" apareceu em mobile apesar de marcado como `hidden`.
 * O `twMerge` garante que a última classe do mesmo grupo ganha, sempre.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

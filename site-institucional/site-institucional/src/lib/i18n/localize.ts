import { SERVICE_PILLARS, type ServicePillar } from "@/lib/services";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/locale";
import { SERVICE_PILLARS_EN } from "@/lib/i18n/services-en";
import { PRODUCTS_EN } from "@/lib/i18n/products-en";

/**
 * Funde a tradução EN por cima do pilar/produto original em vez de manter um
 * segundo catálogo completo: preços, ids, slugs, gradientes e a lógica de
 * `resolvePrice()` nunca duplicam, só o texto muda. Em `pt` (ou quando falta
 * uma tradução) devolve o objecto original sem alterações.
 */

export function localizePillar(pillar: ServicePillar, locale: Locale): ServicePillar {
  if (locale === "pt") return pillar;
  const t = SERVICE_PILLARS_EN[pillar.slug];
  if (!t) return pillar;

  return {
    ...pillar,
    title: t.title,
    tagline: t.tagline,
    description: t.description,
    items: pillar.items.map((item, index) => ({
      ...item,
      title: t.items[index]?.title ?? item.title,
      description: t.items[index]?.description ?? item.description,
    })),
    deliverables: pillar.deliverables.map((deliverable, index) => t.deliverables[index] ?? deliverable),
  };
}

export function localizeProduct(product: Product, locale: Locale): Product {
  if (locale === "pt") return product;
  const t = PRODUCTS_EN[product.id];
  if (!t) return product;

  const configurator = product.configurator;
  const localizedConfigurator =
    configurator?.kind === "features"
      ? {
          ...configurator,
          groups: configurator.groups.map((group) => {
            const groupT = t.groups?.[group.id];
            return {
              ...group,
              title: groupT?.title ?? group.title,
              options: group.options.map((option) => ({
                ...option,
                label: groupT?.options[option.id] ?? option.label,
              })),
            };
          }),
        }
      : configurator?.kind === "tier"
        ? {
            ...configurator,
            quantityLabel: t.quantityLabel ?? configurator.quantityLabel,
            levels: configurator.levels.map((level, index) => ({
              ...level,
              label: t.levels?.[index]?.label ?? level.label,
              description: t.levels?.[index]?.description ?? level.description,
            })),
          }
        : configurator;

  return {
    ...product,
    name: t.name,
    summary: t.summary,
    description: t.description,
    features: product.features.map((feature, index) => t.features[index] ?? feature),
    configurator: localizedConfigurator,
  };
}

export function localizePillars(pillars: readonly ServicePillar[], locale: Locale): ServicePillar[] {
  return pillars.map((pillar) => localizePillar(pillar, locale));
}

/** Equivalente localizado de `pillarTitle()` (em `@/lib/products`), sem criar um ciclo de imports. */
export function localizedPillarTitle(pillarSlug: string, locale: Locale): string {
  const pillar = SERVICE_PILLARS.find((candidate) => candidate.slug === pillarSlug);
  if (!pillar) return locale === "en" ? "Services" : "Serviços";
  return localizePillar(pillar, locale).title;
}

export function localizeProducts(products: readonly Product[], locale: Locale): Product[] {
  return products.map((product) => localizeProduct(product, locale));
}

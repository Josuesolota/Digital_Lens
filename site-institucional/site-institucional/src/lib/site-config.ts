/**
 * Fonte única de verdade dos dados institucionais.
 * Usado em: metadata/SEO, JSON-LD, sitemap, robots.txt, footer, emails
 * transacionais e manifest do PWA. Alterar aqui reflecte em todo o lado.
 */
export const siteConfig = {
  name: "Digital Lens",
  legalName: "Digital Lens",
  shortName: "Digital Lens",
  /**
   * Domínio canónico. Em produção a Vercel expõe `NEXT_PUBLIC_SITE_URL`;
   * o fallback mantém o build reprodutível localmente.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://digitallens.vercel.app",
  tagline: "Sob uma só lente.",
  description:
    "Agência digital: desenvolvimento web, inteligência artificial, marketing digital e locução profissional — da estratégia à execução, sob uma só lente.",
  locale: "pt_PT",
  language: "pt-PT",
  currency: "EUR",
  email: "geral@digitallens.pt",
  phone: "+351 000 000 000",
  address: {
    locality: "Lisboa",
    country: "PT",
  },
  sameAs: [
    // Adicionar os perfis reais assim que existirem — alimentam o JSON-LD.
    // "https://www.instagram.com/digitallens",
    // "https://www.linkedin.com/company/digitallens",
  ] as string[],
} as const;

export type SiteConfig = typeof siteConfig;

/** Constrói um URL absoluto a partir de um caminho relativo. */
export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

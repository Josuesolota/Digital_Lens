// Centraliza os dados institucionais para não os repetir em metadata,
// dados estruturados, sitemap e robots.txt.
// IMPORTANTE: substituir `url` pelo domínio final antes do deploy — é usado
// no metadataBase, no sitemap, no robots.txt e no JSON-LD.
export const siteConfig = {
  name: "Digital Lens",
  legalName: "Digital Lens",
  url:" https://digitallens.vercel.app/",
  description:
    "Agência digital: marketing digital, desenvolvimento web, soluções com IA, produção multimédia e locução — sob uma só lente.",
  locale: "pt_PT",
  email: "geral@digitallens.pt",
  sameAs: [
    // Adicionar aqui os perfis sociais reais (Instagram, LinkedIn, etc.)
    // "https://www.instagram.com/digitallens",
    // "https://www.linkedin.com/company/digitallens",
  ],
};

import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site-config";
import { SERVICE_SLUGS } from "@/lib/services";
import { PRODUCT_SLUGS } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/servicos"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/loja"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/contacto"), changeFrequency: "yearly", priority: 0.7 },
    { url: absoluteUrl("/entrar"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/registar"), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...SERVICE_SLUGS.map((slug) => ({
      url: absoluteUrl(`/servicos/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...PRODUCT_SLUGS.map((slug) => ({
      url: absoluteUrl(`/loja/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ].map((entry) => ({ ...entry, lastModified: now }));
}

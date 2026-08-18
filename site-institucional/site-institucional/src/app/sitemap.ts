import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    // Ao criar páginas dedicadas (ex.: /servicos, /portfolio, /cursos),
    // adicionar aqui cada uma com a sua própria prioridade/frequência.
  ];
}

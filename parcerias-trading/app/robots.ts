import type { MetadataRoute } from "next";

// Página de candidatura B2B, não indexável e deliberadamente fora de
// qualquer sitemap/navegação — ver nota em app/layout.tsx.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}

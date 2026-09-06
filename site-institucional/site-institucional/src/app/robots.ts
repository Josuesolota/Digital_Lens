import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Áreas privadas ou sem valor para indexação.
      disallow: ["/api/", "/conta", "/checkout/", "/carrinho"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

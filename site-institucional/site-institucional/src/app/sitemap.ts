import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site-config";
import { SERVICE_SLUGS } from "@/lib/services";
import { PRODUCT_SLUGS } from "@/lib/products";
import { getAllPosts } from "@/lib/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getAllPosts().catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/servicos"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/loja"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.8 },
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
  ]
    .map((entry) => ({ ...entry, lastModified: now }))
    .concat(
      posts.map((post) => ({
        url: absoluteUrl(`/blog/${post.slug}`),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        lastModified: new Date(post.publishedAt),
      }))
    );
}

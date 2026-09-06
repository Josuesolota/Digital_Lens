import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * Manifest do PWA (servido em /manifest.webmanifest pelo App Router).
 *
 * Os ícones são gerados a partir do símbolo da marca por
 * `scripts/generate-icons.mjs`. O par `any` + `maskable` é obrigatório: o
 * Android recorta o ícone à forma do sistema e sem uma variante maskable a
 * lente ficaria cortada.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Agência Digital`,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    id: "/",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#06080f",
    theme_color: "#06080f",
    lang: siteConfig.language,
    dir: "ltr",
    categories: ["business", "productivity", "shopping"],
    icons: [
      { src: "/icons/icon-96.png", sizes: "96x96", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-256.png", sizes: "256x256", type: "image/png", purpose: "any" },
      { src: "/icons/icon-384.png", sizes: "384x384", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      { name: "Serviços", url: "/servicos" },
      { name: "Loja", url: "/loja" },
      { name: "Contacto", url: "/contacto" },
    ],
  };
}

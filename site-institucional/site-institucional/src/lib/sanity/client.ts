import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Cliente de leitura do blog. O dataset é público — não precisa de token — e
 * usa o CDN da Sanity (`useCdn: true`), que serve conteúdo publicado com
 * cache global. `perspective: "published"` garante que rascunhos nunca
 * aparecem no site, mesmo que alguém os veja a meio de uma edição no Studio.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

const builder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: Image) {
  return builder.image(source);
}

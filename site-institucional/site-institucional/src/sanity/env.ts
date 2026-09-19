/**
 * Identificadores públicos do projecto Sanity — não são segredos: qualquer
 * pessoa pode vê-los no HTML da página (é assim que o cliente Sanity no
 * browser sabe a que projecto/dataset ligar-se). O dataset é público, por
 * isso nem sequer é preciso um token de leitura para ler artigos publicados.
 */

export const apiVersion = "2026-01-01";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "e1yra593";

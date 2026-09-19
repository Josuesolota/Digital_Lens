"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

/**
 * O próprio `sanity.config.ts` arrasta consigo toda a árvore de dependências
 * do Studio (schema, structureTool, etc.), que não é compatível com o grafo
 * de Server Components — alguns pacotes de que depende (ex.: `swr`) nem
 * sequer exportam o mesmo código sob a condição "react-server". Isolar isto
 * num ficheiro `"use client"` garante que essa árvore nunca é processada como
 * Server Component, mesmo que `page.tsx`, que a importa, tenha de o ser (para
 * poder exportar `metadata`).
 */
export function StudioClient() {
  return <NextStudio config={config} />;
}

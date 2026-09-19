import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { projectId, dataset } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";

/**
 * Configuração do Studio, embutido em `/studio` dentro do próprio Next.js
 * (ver `src/app/studio/[[...tool]]/page.tsx`). O login é feito com a conta
 * Sanity de quem edita — não depende da autenticação do site.
 */
export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool()],
});

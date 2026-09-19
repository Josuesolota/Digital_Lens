import { StudioClient } from "./StudioClient";

// A CSP deste site usa um nonce novo a cada pedido (ver `proxy.ts`). Uma
// página estática (o exemplo oficial da Sanity usa `force-static`) ficaria
// com um nonce desactualizado em cache assim que o middleware gerasse outro
// — os scripts do Studio, carregados dinamicamente, seriam todos bloqueados
// pela CSP. `force-dynamic` garante que o HTML é sempre gerado com o nonce
// do próprio pedido.
export const dynamic = "force-dynamic";

// O Studio é uma app cliente completa — nada aqui é indexável nem interessa
// aos motores de busca.
export const metadata = { robots: { index: false, follow: false } };

export default function StudioPage() {
  return <StudioClient />;
}

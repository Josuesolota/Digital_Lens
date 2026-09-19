"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";

/**
 * O Studio da Sanity (`/studio`) é uma aplicação à parte, de ecrã inteiro —
 * não faz sentido dentro da moldura do site (navbar, rodapé, avisos de PWA).
 * É a única rota que foge a esta moldura comum.
 *
 * `navbar`/`footer` chegam já renderizados pelo layout (Server Components) em
 * vez de serem importados aqui: um ficheiro `"use client"` não pode importar
 * um Server Component directamente e instanciá-lo — arrastaria toda a árvore
 * de dependências desse componente (incluindo módulos `server-only`) para o
 * bundle do cliente. Recebê-los como `ReactNode` evita isso.
 */
export function SiteChrome({
  navbar,
  footer,
  children,
}: {
  navbar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) {
    return <>{children}</>;
  }

  return (
    <>
      {navbar}
      <main className="flex-1">{children}</main>
      {footer}
      <InstallPrompt />
      <ServiceWorkerRegistration />
    </>
  );
}

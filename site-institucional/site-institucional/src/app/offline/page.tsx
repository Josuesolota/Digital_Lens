import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Sem ligação",
  robots: { index: false, follow: false },
};

/** Página servida pelo service worker quando não há rede. */
export default function OfflinePage() {
  return (
    <section className="flex min-h-[70vh] items-center py-20">
      <Container className="flex justify-center">
        <GlassCard className="flex max-w-md flex-col items-center gap-6 p-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.05]">
            <WifiOff size={28} className="text-fog-400" />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-2xl font-semibold text-fog-50">
              Está sem ligação
            </h1>
            <p className="text-balance text-sm leading-relaxed text-fog-400">
              Não conseguimos chegar ao servidor. As páginas que já visitou
              continuam disponíveis; assim que a ligação voltar, tudo se
              actualiza sozinho.
            </p>
          </div>
          <Button href="/">Voltar ao início</Button>
        </GlassCard>
      </Container>
    </section>
  );
}

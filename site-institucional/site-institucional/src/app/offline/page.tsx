import type { Metadata } from "next";
import { WifiOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.pages.offlinePage.title,
    robots: { index: false, follow: false },
  };
}

/** Página servida pelo service worker quando não há rede. */
export default async function OfflinePage() {
  const t = getDictionary(await getLocale());

  return (
    <section className="flex min-h-[70vh] items-center py-20">
      <Container className="flex justify-center">
        <GlassCard className="flex max-w-md flex-col items-center gap-6 p-12 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-2">
            <WifiOff size={28} className="text-fog-400" />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-2xl font-semibold text-fog-50">
              {t.pages.offlinePage.heading}
            </h1>
            <p className="text-balance text-sm leading-relaxed text-fog-400">
              {t.pages.offlinePage.description}
            </p>
          </div>
          <Button href="/">{t.pages.offlinePage.backHome}</Button>
        </GlassCard>
      </Container>
    </section>
  );
}

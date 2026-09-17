import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LensMark } from "@/components/ui/LensMark";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export default async function NotFound() {
  const t = getDictionary(await getLocale());

  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden py-20">
      <AuroraBackground />
      <Container className="relative flex flex-col items-center gap-7 text-center">
        <LensMark size={72} glow />
        <div className="flex flex-col gap-3">
          <p className="eyebrow text-lens-magenta-400">{t.pages.notFound.badge}</p>
          <h1 className="text-balance font-display text-3xl font-semibold text-fog-50 sm:text-4xl">
            {t.pages.notFound.title}
          </h1>
          <p className="max-w-md text-balance text-fog-400">{t.pages.notFound.description}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">{t.pages.notFound.backHome}</Button>
          <Button href="/servicos" variant="secondary">
            {t.pages.notFound.viewServices}
          </Button>
        </div>
        <Link
          href="/contacto"
          className="text-sm text-fog-600 underline underline-offset-4 transition-colors hover:text-fog-200"
        >
          {t.pages.notFound.needHelp}
        </Link>
      </Container>
    </section>
  );
}

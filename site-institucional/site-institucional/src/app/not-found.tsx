import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LensMark } from "@/components/ui/LensMark";
import { AuroraBackground } from "@/components/ui/AuroraBackground";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden py-20">
      <AuroraBackground />
      <Container className="relative flex flex-col items-center gap-7 text-center">
        <LensMark size={72} glow />
        <div className="flex flex-col gap-3">
          <p className="eyebrow text-lens-magenta-400">Erro 404</p>
          <h1 className="text-balance font-display text-3xl font-semibold text-fog-50 sm:text-4xl">
            Esta página saiu de foco.
          </h1>
          <p className="max-w-md text-balance text-fog-400">
            O endereço que procura não existe ou foi movido. Volte ao início ou
            explore os nossos serviços.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">Voltar ao início</Button>
          <Button href="/servicos" variant="secondary">
            Ver serviços
          </Button>
        </div>
        <Link
          href="/contacto"
          className="text-sm text-fog-600 underline underline-offset-4 transition-colors hover:text-fog-200"
        >
          Precisa de ajuda? Fale connosco
        </Link>
      </Container>
    </section>
  );
}

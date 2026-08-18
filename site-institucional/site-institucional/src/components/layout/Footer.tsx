import Link from "next/link";
import { ApertureMark } from "@/components/ui/ApertureMark";
import { Container } from "@/components/ui/Container";

const COLUMNS = [
  {
    title: "Serviços",
    links: [
      "Marketing Digital",
      "Desenvolvimento Web",
      "Soluções com IA",
      "Produção Multimédia",
      "Locução",
    ],
  },
  {
    title: "Agência",
    links: ["Sobre", "Portfólio", "Contacto"],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink-900 text-paper-50/80 mt-auto">
      <Container className="py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 flex flex-col gap-4">
          <Link href="#top" className="flex items-center gap-2.5 text-paper-50">
            <ApertureMark size={26} interactive={false} />
            <span className="font-display text-lg font-semibold">
              Digital Lens
            </span>
          </Link>
          <p className="text-sm max-w-xs">
            Marketing, desenvolvimento web, IA e produção multimédia — sob uma
            só lente.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-paper-50/50">
              {col.title}
            </span>
            {col.links.map((link) => (
              <span key={link} className="text-sm">
                {link}
              </span>
            ))}
          </div>
        ))}
      </Container>

      <Container className="py-6 border-t border-paper-50/10 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-paper-50/50">
        <span>© {new Date().getFullYear()} Digital Lens. Todos os direitos reservados.</span>
        <span>Feito com foco, em Portugal.</span>
      </Container>
    </footer>
  );
}

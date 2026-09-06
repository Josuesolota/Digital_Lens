import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { LensMark } from "@/components/ui/LensMark";
import { Container } from "@/components/ui/Container";
import { SERVICE_PILLARS } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";

const AGENCY_LINKS = [
  { href: "/servicos", label: "Todos os serviços" },
  { href: "/loja", label: "Loja" },
  { href: "/#portfolio", label: "Portfólio" },
  { href: "/contacto", label: "Contacto" },
];

const ACCOUNT_LINKS = [
  { href: "/entrar", label: "Entrar" },
  { href: "/registar", label: "Criar conta" },
  { href: "/conta", label: "As minhas encomendas" },
  { href: "/carrinho", label: "Carrinho" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/[0.08] bg-void-900">
      {/* Halo discreto que ecoa o gradiente da lente */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-lens-violet-600/15 blur-[110px]"
      />

      <Container className="relative grid grid-cols-2 gap-10 py-16 md:grid-cols-4 lg:gap-12">
        <div className="col-span-2 flex flex-col gap-5">
          <Link href="/" className="flex items-center gap-2.5">
            <LensMark size={32} />
            <span className="font-display text-lg font-semibold text-fog-50">
              Digital Lens
            </span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-fog-400">
            Desenvolvimento web, inteligência artificial, marketing digital e
            locução profissional — sob uma só lente.
          </p>
          <div className="flex flex-col gap-2 text-sm text-fog-400">
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 transition-colors hover:text-fog-50"
            >
              <Mail size={15} strokeWidth={1.75} />
              {siteConfig.email}
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={15} strokeWidth={1.75} />
              {siteConfig.address.locality}, Angola
            </span>
          </div>
        </div>

        <FooterColumn title="Serviços">
          {SERVICE_PILLARS.map((pillar) => (
            <FooterLink key={pillar.slug} href={`/servicos/${pillar.slug}`}>
              {pillar.title}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Agência">
          {AGENCY_LINKS.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Conta" className="col-span-2 md:col-span-4 md:hidden">
          {ACCOUNT_LINKS.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </FooterColumn>
      </Container>

      <Container className="relative flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] py-6 text-xs text-fog-600 md:flex-row">
        <span>
          © {new Date().getFullYear()} {siteConfig.legalName}. Todos os direitos
          reservados.
        </span>
        <div className="flex items-center gap-5">
          {ACCOUNT_LINKS.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden transition-colors hover:text-fog-200 md:inline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3.5 ${className ?? ""}`}>
      <span className="eyebrow text-fog-600">{title}</span>
      {children}
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-fog-400 transition-colors hover:text-fog-50"
    >
      {children}
    </Link>
  );
}

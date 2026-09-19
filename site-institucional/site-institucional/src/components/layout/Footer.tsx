import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { LensMark } from "@/components/ui/LensMark";
import { Container } from "@/components/ui/Container";
import { SERVICE_PILLARS } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizePillars } from "@/lib/i18n/localize";

export async function Footer() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const pillars = localizePillars(SERVICE_PILLARS, locale);

  const AGENCY_LINKS = [
    { href: "/servicos", label: t.footer.allServices },
    { href: "/loja", label: t.footer.store },
    { href: "/blog", label: t.footer.blog },
    { href: "/#portfolio", label: t.footer.portfolio },
    { href: "/contacto", label: t.footer.contact },
  ];

  const ACCOUNT_LINKS = [
    { href: "/entrar", label: t.footer.login },
    { href: "/registar", label: t.footer.createAccount },
    { href: "/conta", label: t.footer.myOrders },
    { href: "/carrinho", label: t.footer.cart },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-hairline-1 bg-void-900">
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
            {t.footer.tagline}
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
              {t.footer.localityCountry(siteConfig.address.locality)}
            </span>
          </div>
        </div>

        <FooterColumn title={t.footer.servicesColumn}>
          {pillars.map((pillar) => (
            <FooterLink key={pillar.slug} href={`/servicos/${pillar.slug}`}>
              {pillar.title}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title={t.footer.agencyColumn}>
          {AGENCY_LINKS.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title={t.footer.accountColumn} className="col-span-2 md:col-span-4 md:hidden">
          {ACCOUNT_LINKS.map((link) => (
            <FooterLink key={link.href} href={link.href}>
              {link.label}
            </FooterLink>
          ))}
        </FooterColumn>
      </Container>

      <Container className="relative flex flex-col items-center justify-between gap-3 border-t border-hairline-1 py-6 text-xs text-fog-600 md:flex-row">
        <span>{t.footer.rights(new Date().getFullYear(), siteConfig.legalName)}</span>
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

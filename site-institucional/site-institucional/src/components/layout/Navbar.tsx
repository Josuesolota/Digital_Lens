"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { ChevronDown, LogIn, Menu, User, X } from "lucide-react";
import { LensMark } from "@/components/ui/LensMark";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CartButton } from "@/components/cart/CartButton";
import { SERVICE_PILLARS } from "@/lib/services";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/servicos", label: "Serviços", hasMenu: true },
  { href: "/loja", label: "Loja", hasMenu: false },
  { href: "/#portfolio", label: "Portfólio", hasMenu: false },
  { href: "/contacto", label: "Contacto", hasMenu: false },
];

type NavbarProps = {
  /** Nome do utilizador autenticado, ou `null` para visitante */
  userName: string | null;
};

export function Navbar({ userName }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  /*
   * Os menus fecham-se ao navegar. Em vez de um efeito que chama setState
   * quando o `pathname` muda (re-render em cascata), guardamos a rota em que
   * cada menu foi aberto: assim que a rota muda, a comparação passa a falsa e
   * o menu fecha na mesma renderização.
   */
  const [mobileOpenAt, setMobileOpenAt] = useState<string | null>(null);
  const [servicesOpenAt, setServicesOpenAt] = useState<string | null>(null);
  const mobileOpen = mobileOpenAt === pathname;
  const servicesOpen = servicesOpenAt === pathname;

  const openMobile = () => setMobileOpenAt(pathname);
  const closeMobile = () => setMobileOpenAt(null);
  const setServicesOpen = (open: boolean) =>
    setServicesOpenAt(open ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava o scroll da página com o menu mobile aberto.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  // Escape fecha o menu de serviços (WAI-ARIA disclosure pattern).
  useEffect(() => {
    if (!servicesOpen) return;
    const onKey = (event: KeyboardEvent) => {
      // `setServicesOpenAt` (o setter do useState) é estável entre renders;
      // o wrapper `setServicesOpen` não é, e obrigaria a um useCallback.
      if (event.key === "Escape") setServicesOpenAt(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [servicesOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.08] bg-void-950/80 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <Container className="flex items-center justify-between gap-4 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label={`Digital Lens — página inicial`}
        >
          <LensMark size={30} />
          <span className="whitespace-nowrap font-display text-[17px] font-semibold tracking-tight text-fog-50">
            Digital Lens
          </span>
        </Link>

        {/* ── Navegação desktop ── */}
        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) =>
            link.hasMenu ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link
                  href={link.href}
                  aria-expanded={servicesOpen}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors",
                    isActive(link.href)
                      ? "text-fog-50"
                      : "text-fog-400 hover:text-fog-50"
                  )}
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-300",
                      servicesOpen && "rotate-180"
                    )}
                  />
                </Link>

                <AnimatePresence>
                  {servicesOpen && (
                    <m.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="glass absolute left-1/2 top-full w-[30rem] -translate-x-1/2 rounded-2xl p-2 shadow-[0_28px_70px_-24px_rgba(0,0,0,0.85)]"
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {SERVICE_PILLARS.map((pillar) => (
                          <Link
                            key={pillar.slug}
                            href={`/servicos/${pillar.slug}`}
                            className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.06]"
                          >
                            <span
                              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                              style={{
                                background: `linear-gradient(135deg, ${pillar.gradient[0]}, ${pillar.gradient[1]})`,
                              }}
                            >
                              <pillar.icon size={17} strokeWidth={1.75} className="text-white" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-fog-50">
                                {pillar.title}
                              </span>
                              <span className="mt-0.5 block text-xs leading-snug text-fog-600">
                                {pillar.tagline}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm transition-colors",
                  isActive(link.href) ? "text-fog-50" : "text-fog-400 hover:text-fog-50"
                )}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-1">
          <CartButton />

          <Link
            href={userName ? "/conta" : "/entrar"}
            className="hidden rounded-full p-2.5 text-fog-200 transition-colors hover:bg-white/5 hover:text-fog-50 sm:block"
            aria-label={userName ? `Conta de ${userName}` : "Entrar na sua conta"}
          >
            {userName ? <User size={19} strokeWidth={1.75} /> : <LogIn size={19} strokeWidth={1.75} />}
          </Link>

          <Button href="/contacto" size="sm" className="ml-1.5 hidden lg:inline-flex">
            Iniciar projeto
          </Button>

          <button
            onClick={openMobile}
            className="rounded-full p-2.5 text-fog-200 transition-colors hover:bg-white/5 lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={21} />
          </button>
        </div>
      </Container>

      {/* ── Menu mobile ── */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] overflow-y-auto bg-void-950 lg:hidden"
          >
            <Container className="flex items-center justify-between py-3.5">
              <Link href="/" className="flex items-center gap-2.5">
                <LensMark size={30} />
                <span className="whitespace-nowrap font-display text-[17px] font-semibold text-fog-50">
                  Digital Lens
                </span>
              </Link>
              <button
                onClick={closeMobile}
                className="rounded-full p-2.5 text-fog-200"
                aria-label="Fechar menu"
              >
                <X size={21} />
              </button>
            </Container>

            <m.nav
              className="flex flex-col gap-8 px-5 pb-16 pt-6 sm:px-6"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
            >
              <m.div variants={itemVariants} className="flex flex-col gap-2">
                <span className="eyebrow mb-1 text-fog-600">Serviços</span>
                {SERVICE_PILLARS.map((pillar) => (
                  <Link
                    key={pillar.slug}
                    href={`/servicos/${pillar.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${pillar.gradient[0]}, ${pillar.gradient[1]})`,
                      }}
                    >
                      <pillar.icon size={17} strokeWidth={1.75} className="text-white" />
                    </span>
                    <span className="text-[15px] font-medium text-fog-50">
                      {pillar.title}
                    </span>
                  </Link>
                ))}
              </m.div>

              <m.div variants={itemVariants} className="flex flex-col">
                {[
                  { href: "/loja", label: "Loja" },
                  { href: "/#portfolio", label: "Portfólio" },
                  { href: "/contacto", label: "Contacto" },
                  { href: userName ? "/conta" : "/entrar", label: userName ? "A minha conta" : "Entrar" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="border-b border-white/[0.07] py-4 font-display text-2xl font-medium text-fog-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </m.div>

              <m.div variants={itemVariants}>
                <Button href="/contacto" className="w-full" size="lg">
                  Iniciar projeto
                </Button>
              </m.div>
            </m.nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ApertureMark } from "@/components/ui/ApertureMark";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#servicos", label: "Serviços" },
  { href: "#sobre", label: "Sobre" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava o scroll do body quando o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-paper-50/80 backdrop-blur-md border-b border-ink-900/10"
          : "bg-transparent"
      )}
    >
      <Container className="flex items-center justify-between py-4">
        <Link
          href="#top"
          className="flex items-center gap-2.5 text-ink-900"
          aria-label="Digital Lens — página inicial"
        >
          <ApertureMark size={28} />
          <span className="font-display text-lg font-semibold tracking-tight">
            Digital Lens
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-900/80 hover:text-signal-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="#contacto" variant="primary" className="text-xs px-5 py-2.5">
            Iniciar projeto
          </Button>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 -mr-2 text-ink-900"
          aria-label="Abrir menu"
          aria-expanded={open}
        >
          <Menu size={24} />
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink-900 md:hidden"
          >
            <Container className="flex items-center justify-between py-4">
              <Link
                href="#top"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 text-paper-50"
              >
                <ApertureMark size={28} className="text-paper-50" />
                <span className="font-display text-lg font-semibold">
                  Digital Lens
                </span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 text-paper-50"
                aria-label="Fechar menu"
              >
                <X size={24} />
              </button>
            </Container>

            <m.nav
              className="flex flex-col gap-1 px-6 pt-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {LINKS.map((link) => (
                <m.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="font-display text-3xl font-medium text-paper-50 py-3 border-b border-paper-50/10"
                >
                  {link.label}
                </m.a>
              ))}
              <m.div
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="pt-8"
              >
                <Button
                  href="#contacto"
                  variant="primary"
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
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

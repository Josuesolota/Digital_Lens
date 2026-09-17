"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { SERVICE_PILLARS } from "@/lib/services";
import { localizePillars } from "@/lib/i18n/localize";
import { cn } from "@/lib/utils";

/**
 * Os quatro pilares na homepage, num carrossel horizontal com scroll-snap.
 * Cada cartão liga à página dedicada do pilar.
 *
 * Sem biblioteca de carrossel: `overflow-x-auto` + `scroll-snap-type` fazem o
 * trabalho pesado nativamente (gestos, teclado, scroll do rato incluídos); as
 * setas e os pontos só chamam `scrollTo` sobre esse mesmo contentor. O estado
 * activo é lido do próprio scroll, nunca imposto — não há como o carrossel e
 * os pontos dessincronizarem.
 *
 * Em ecrãs largos, quase todos os cartões cabem ao mesmo tempo — sobra pouco
 * espaço para deslocar (largura do scroll menos a da janela visível). Um
 * `IntersectionObserver` a decidir "qual cartão está mais visível" fica
 * ambíguo nesse caso, com vários cartões empatados a 100% visíveis: por isso
 * o estado lê-se directamente da posição do scroll — os extremos (início/fim)
 * vêm da comparação com `scrollWidth`, sempre inequívoca, e o ponto activo
 * (para os pontos, só visíveis em mobile onde cabe um cartão de cada vez) do
 * cartão cujo `offsetLeft` está mais perto do `scrollLeft` actual.
 */
/** Intervalo entre avanços automáticos e por quanto tempo uma interacção manual o suspende. */
const AUTOPLAY_INTERVAL_MS = 4500;
const AUTOPLAY_RESUME_DELAY_MS = 6000;

export function Services() {
  const { locale, dictionary: t } = useLocale();
  const pillars = localizePillars(SERVICE_PILLARS, locale);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const resumeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function update() {
      if (!track) return;
      // O padding do próprio contentor (`px-*`) faz o scroll-snap descansar
      // num `scrollLeft` igual a esse padding quando o primeiro cartão está
      // alinhado — não em 0. Comparar contra 0 nunca seria verdadeiro. Só é
      // relevante a partir do `sm`, onde os cartões continuam alinhados ao
      // início (`snap-start`) — em mobile o cartão fica centrado
      // (`snap-center`), por isso as setas (só visíveis a partir do `sm`)
      // não dependem desta conta.
      const start = cardRefs.current[0]?.offsetLeft ?? 0;
      const max = track.scrollWidth - track.clientWidth;
      setAtStart(track.scrollLeft <= start + 1);
      setAtEnd(track.scrollLeft >= max - 1);

      // O índice activo (para os pontos, só visíveis em mobile) é sempre o
      // cartão cujo centro está mais próximo do centro do ecrã visível — uma
      // conta relativa, por isso funciona da mesma forma com `snap-center`
      // (o deslocamento constante da centragem cancela-se na comparação).
      const viewportCenter = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let nearestDistance = Infinity;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = index;
        }
      });
      setActiveIndex(nearest);
    }

    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Só reproduz automaticamente com a secção visível — poupa trabalho fora do
  // ecrã e evita saltos de scroll que o visitante nunca chega a ver.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  function pauseAutoplay() {
    setPaused(true);
    window.clearTimeout(resumeTimer.current);
  }

  /** Pausa por uma interacção pontual (arrasto, clique numa seta/ponto) — retoma sozinho passado um tempo. */
  function pauseAutoplayTemporarily() {
    setPaused(true);
    window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), AUTOPLAY_RESUME_DELAY_MS);
  }

  function resumeAutoplay() {
    setPaused(false);
    window.clearTimeout(resumeTimer.current);
  }

  useEffect(() => () => window.clearTimeout(resumeTimer.current), []);

  // Avanço automático: reproduz sozinho, sem depender de o visitante arrastar
  // o carrossel. Pára com `prefers-reduced-motion`, com o separador fora do
  // ecrã, com o separador da aba escondido, ou enquanto alguém interage
  // (arrasto, seta, ponto) — e retoma sozinho depois de uma pausa.
  useEffect(() => {
    if (!inView || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.visibilityState === "hidden") return;

    const id = window.setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= max - 1) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByOne(1);
      }
    }, AUTOPLAY_INTERVAL_MS);

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") window.clearInterval(id);
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [inView, paused]);

  function scrollToIndex(index: number) {
    const card = cardRefs.current[index];
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  /*
   * As setas avançam por um deslocamento relativo (`scrollBy`), não por
   * alinhar um cartão ao início (`scrollIntoView`). Em ecrãs onde vários
   * cartões cabem ao mesmo tempo, alinhar um cartão do meio ao início pede
   * uma posição que excede o scroll disponível — o browser fica preso na
   * mesma posição (o máximo), e "anterior" deixa de fazer nada assim que se
   * chega perto do fim. Um deslocamento relativo não tem esse problema: fica
   * sempre dentro de [0, máximo], em qualquer direcção.
   */
  function scrollByOne(direction: -1 | 1) {
    const track = trackRef.current;
    const [first, second] = cardRefs.current;
    if (!track) return;
    const step = first && second ? second.offsetLeft - first.offsetLeft : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <section
      id="servicos"
      className="relative py-24 lg:py-32"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-center gap-6 sm:justify-between">
          <SectionHeading
            eyebrow={t.servicesSection.eyebrow}
            title={
              <>
                {t.servicesSection.titleStart}{" "}
                <span className="text-gradient">{t.servicesSection.titleHighlight}</span>
              </>
            }
            description={t.servicesSection.description}
          />

          {/* Setas — escondidas em ecrãs pequenos, onde o gesto de arrastar já é natural */}
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <CarouselArrow
              direction="prev"
              label={t.servicesSection.prev}
              disabled={atStart}
              onClick={() => {
                pauseAutoplayTemporarily();
                scrollByOne(-1);
              }}
            />
            <CarouselArrow
              direction="next"
              label={t.servicesSection.next}
              disabled={atEnd}
              onClick={() => {
                pauseAutoplayTemporarily();
                scrollByOne(1);
              }}
            />
          </div>
        </div>

        <div
          ref={trackRef}
          onPointerDown={pauseAutoplayTemporarily}
          className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[9%] pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
        >
          {pillars.map((pillar, index) => (
            <m.div
              key={pillar.slug}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
              className="w-[82%] shrink-0 snap-center sm:w-[340px] sm:snap-start lg:w-[300px]"
            >
              <GlassCard interactive className="group h-full p-7 lg:p-8">
                <Link
                  href={`/servicos/${pillar.slug}`}
                  className="flex h-full flex-col gap-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${pillar.gradient[0]}, ${pillar.gradient[1]})`,
                        boxShadow: `0 12px 32px -12px ${pillar.gradient[1]}`,
                      }}
                    >
                      <pillar.icon size={22} strokeWidth={1.75} className="text-white" />
                    </span>
                    <ArrowUpRight
                      size={19}
                      className="text-fog-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fog-50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl font-semibold text-fog-50">
                      {pillar.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-fog-400">
                      {pillar.tagline}
                    </p>
                  </div>

                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {pillar.items.map((item) => (
                      <li
                        key={item.title}
                        className="rounded-full border border-hairline-1 bg-surface-1 px-2.5 py-1 text-[11px] text-fog-400 transition-colors group-hover:border-hairline-2"
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </Link>
              </GlassCard>
            </m.div>
          ))}
        </div>

        {/* Pontos — únicos em todos os breakpoints, dão o estado actual mesmo em ecrãs onde as setas ficam escondidas */}
        <div className="flex items-center justify-center gap-2 sm:hidden">
          {pillars.map((pillar, index) => (
            <button
              key={pillar.slug}
              type="button"
              onClick={() => {
                pauseAutoplayTemporarily();
                scrollToIndex(index);
              }}
              aria-label={t.servicesSection.goTo(pillar.title)}
              aria-current={index === activeIndex}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === activeIndex
                  ? "w-6 bg-[linear-gradient(100deg,var(--color-lens-blue-400),var(--color-lens-magenta-400))]"
                  : "w-1.5 bg-hairline-3"
              )}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function CarouselArrow({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-2 text-fog-200 transition-colors hover:border-hairline-3 hover:text-fog-50 disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon size={16} />
    </button>
  );
}

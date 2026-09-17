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
export function Services() {
  const { locale, dictionary: t } = useLocale();
  const pillars = localizePillars(SERVICE_PILLARS, locale);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function update() {
      if (!track) return;
      // O padding do próprio contentor (`px-*`) faz o scroll-snap descansar
      // num `scrollLeft` igual a esse padding quando o primeiro cartão está
      // alinhado — não em 0. Comparar contra 0 nunca seria verdadeiro.
      const start = cardRefs.current[0]?.offsetLeft ?? 0;
      const max = track.scrollWidth - track.clientWidth;
      const isAtStart = track.scrollLeft <= start + 1;
      const isAtEnd = track.scrollLeft >= max - 1;
      setAtStart(isAtStart);
      setAtEnd(isAtEnd);

      if (isAtStart) {
        setActiveIndex(0);
        return;
      }
      if (isAtEnd) {
        setActiveIndex(SERVICE_PILLARS.length - 1);
        return;
      }
      let nearest = 0;
      let nearestDistance = Infinity;
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const distance = Math.abs(card.offsetLeft - track.scrollLeft);
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
    <section id="servicos" className="relative py-24 lg:py-32">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
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
              onClick={() => scrollByOne(-1)}
            />
            <CarouselArrow
              direction="next"
              label={t.servicesSection.next}
              disabled={atEnd}
              onClick={() => scrollByOne(1)}
            />
          </div>
        </div>

        <div
          ref={trackRef}
          className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
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
              className="w-[82%] shrink-0 snap-start sm:w-[340px] lg:w-[300px]"
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
              onClick={() => scrollToIndex(index)}
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

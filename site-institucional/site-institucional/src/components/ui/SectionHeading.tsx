import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Nível do heading — `h1` só na página onde é o título principal */
  as?: "h1" | "h2";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  // Em ecrãs estreitos, uma coluna de texto à esquerda fica com um "buraco"
  // de espaço em branco à direita — por omissão centra-se em mobile e volta
  // ao alinhamento à esquerda a partir do `sm`, onde a largura já sobra para
  // a leitura em coluna fazer sentido. `align="center"` mantém-se centrado
  // em todos os tamanhos, para quem precisa mesmo disso (ex.: estados vazios).
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 text-center",
        !centered && "sm:items-start sm:text-left",
        className
      )}
    >
      <span className="eyebrow flex items-center gap-2.5 text-lens-violet-400">
        <span
          aria-hidden
          className="h-px w-8 bg-[linear-gradient(90deg,transparent,var(--color-lens-violet-400))]"
        />
        {eyebrow}
      </span>
      <Heading
        className={cn(
          "font-display font-semibold text-fog-50 text-balance leading-[1.1]",
          Heading === "h1"
            ? "text-4xl sm:text-5xl lg:text-6xl max-w-4xl"
            : "text-3xl sm:text-4xl max-w-2xl"
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "text-fog-400 text-balance leading-relaxed",
            centered ? "max-w-xl" : "max-w-lg"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

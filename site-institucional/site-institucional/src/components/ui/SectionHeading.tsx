import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-signal-600">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink-900 text-balance max-w-xl">
        {title}
      </h2>
      {description && (
        <p className="text-neutral-600 max-w-md text-balance">
          {description}
        </p>
      )}
    </div>
  );
}

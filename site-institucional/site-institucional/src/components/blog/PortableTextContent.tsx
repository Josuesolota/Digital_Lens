import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { urlForImage } from "@/lib/sanity/client";

/**
 * Estilos do corpo do artigo aplicados aqui, bloco a bloco — não há plugin de
 * tipografia no Tailwind deste projecto, e o corpo do blog é a única
 * superfície que precisa deste nível de detalhe (títulos, citações, listas).
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-relaxed text-fog-300">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 font-display text-2xl font-semibold text-fog-50">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-display text-xl font-semibold text-fog-50">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-lens-violet-400 pl-5 text-lg italic leading-relaxed text-fog-200">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-fog-50">{children}</strong>,
    link: ({ value, children }) => {
      const href = (value as { href?: string })?.href ?? "#";
      const isInternal = href.startsWith("/");
      return (
        <Link
          href={href}
          className="text-lens-violet-400 underline underline-offset-2 transition-colors hover:text-lens-violet-300"
          {...(!isInternal && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const alt = (value as { alt?: string })?.alt ?? "";
      return (
        <span className="relative my-2 block aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={urlForImage(value).width(1280).fit("max").url()}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-cover"
          />
        </span>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-fog-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-5 text-base leading-relaxed text-fog-300">
        {children}
      </ol>
    ),
  },
};

export function PortableTextContent({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="flex flex-col gap-5">
      <PortableText value={value} components={components} />
    </div>
  );
}

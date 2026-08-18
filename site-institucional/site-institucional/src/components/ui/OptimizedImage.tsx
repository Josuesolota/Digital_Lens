import Image, { type ImageProps } from "next/image";

type OptimizedImageProps = ImageProps & {
  /** Marcar true apenas para a imagem mais acima da dobra (ex.: Hero) */
  priority?: boolean;
};

/**
 * Uso: <OptimizedImage src="/fotos/equipa.jpg" alt="Equipa Digital Lens" fill sizes="..." />
 * - Sem `priority`: lazy-load automático (comportamento padrão do next/image)
 * - Com `priority`: pré-carrega — usar só na imagem principal do Hero, se existir
 * - Servido sempre em AVIF/WebP conforme configurado em next.config.ts
 */
export function OptimizedImage({
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  ...props
}: OptimizedImageProps) {
  return (
    <Image alt={alt} priority={priority} sizes={sizes} loading={priority ? undefined : "lazy"} {...props} />
  );
}

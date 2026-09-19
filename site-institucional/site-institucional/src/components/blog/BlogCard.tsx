import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { urlForImage } from "@/lib/sanity/client";
import { formatPostDate } from "@/lib/sanity/format";
import type { PostSummary } from "@/lib/sanity/queries";
import type { Locale } from "@/lib/i18n/locale";

const CATEGORY_COLOR: Record<string, string> = {
  violet: "bg-lens-violet-500/15 text-lens-violet-400",
  cyan: "bg-lens-cyan-500/15 text-lens-cyan-400",
  magenta: "bg-lens-magenta-500/15 text-lens-magenta-400",
  blue: "bg-lens-blue-500/15 text-lens-blue-400",
};

export function BlogCard({
  post,
  locale,
  readMoreLabel,
}: {
  post: PostSummary;
  locale: Locale;
  readMoreLabel: string;
}) {
  const imageUrl = urlForImage(post.coverImage).width(640).height(400).fit("crop").url();

  return (
    <GlassCard interactive className="group flex h-full flex-col overflow-hidden p-0">
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-center gap-2 text-xs text-fog-600">
            {post.category && (
              <span
                className={`rounded-full px-2 py-0.5 font-mono uppercase tracking-wider ${
                  CATEGORY_COLOR[post.category.color ?? "violet"]
                }`}
              >
                {post.category.title}
              </span>
            )}
            <span>{formatPostDate(post.publishedAt, locale)}</span>
          </div>

          <h3 className="font-display text-lg font-semibold leading-tight text-fog-50 transition-colors group-hover:text-lens-violet-400">
            {post.title}
          </h3>

          <p className="line-clamp-3 text-sm leading-relaxed text-fog-400">{post.excerpt}</p>

          <span className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-medium text-fog-200">
            {readMoreLabel}
            <ArrowUpRight
              size={15}
              className="transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </Link>
    </GlassCard>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PortableTextContent } from "@/components/blog/PortableTextContent";
import { getPostBySlug } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/client";
import { formatPostDate } from "@/lib/sanity/format";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

type PageProps = { params: Promise<{ slug: string }> };

// Sem `generateStaticParams`: os artigos são geridos na Sanity, não no
// código, por isso o build não deve depender de a API estar acessível nesse
// momento. Cada página gera-se (e fica em cache, ver `revalidate` nas
// queries) no primeiro pedido — o comportamento para quem visita é igual.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const description = post.seoDescription ?? post.excerpt;
  const imageUrl = urlForImage(post.coverImage).width(1200).height(630).fit("crop").url();

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.publishedAt,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.coverImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, locale] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getLocale(),
  ]);
  if (!post) notFound();

  const t = getDictionary(locale);
  const imageUrl = urlForImage(post.coverImage).width(1600).fit("max").url();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription ?? post.excerpt,
    image: urlForImage(post.coverImage).width(1200).height(630).fit("crop").url(),
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };

  return (
    <article className="pb-24 pt-12 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="group mb-8 inline-flex items-center gap-1.5 text-sm text-fog-400 transition-colors hover:text-fog-50"
        >
          <ArrowLeft
            size={15}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          {t.pages.blogPost.backToBlog}
        </Link>

        <div className="flex items-center gap-2 text-xs text-fog-600">
          {post.category && (
            <span className="rounded-full bg-lens-violet-500/15 px-2 py-0.5 font-mono uppercase tracking-wider text-lens-violet-400">
              {post.category.title}
            </span>
          )}
          <span>{formatPostDate(post.publishedAt, locale)}</span>
        </div>

        <h1 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-fog-50 sm:text-4xl">
          {post.title}
        </h1>

        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-3xl">
          <Image
            src={imageUrl}
            alt={post.coverImage.alt}
            fill
            priority
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-10">
          <PortableTextContent value={post.body} />
        </div>
      </Container>
    </article>
  );
}

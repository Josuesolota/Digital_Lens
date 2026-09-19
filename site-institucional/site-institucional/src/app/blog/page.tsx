import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { BlogCard } from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/sanity/queries";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.pages.blog.title,
    description: t.pages.blog.metaDescription,
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  // Uma falha a contactar a Sanity não deve derrubar a página — mostra o
  // mesmo estado vazio de "ainda sem artigos" em vez de um erro 500.
  const posts = await getAllPosts().catch(() => []);

  return (
    <>
      <section className="relative overflow-hidden pb-14 pt-16 sm:pt-20">
        <AuroraBackground />
        <Container className="relative">
          <SectionHeading
            as="h1"
            eyebrow={t.pages.blog.eyebrow}
            title={
              <>
                {t.pages.blog.titleStart}{" "}
                <span className="text-gradient">{t.pages.blog.titleHighlight}</span>
              </>
            }
            description={t.pages.blog.description}
          />
        </Container>
      </section>

      <section className="pb-24 lg:pb-32">
        <Container>
          {posts.length === 0 ? (
            <div className="glass flex flex-col items-center gap-4 rounded-3xl p-14 text-center">
              <Newspaper size={36} className="text-fog-600" strokeWidth={1.25} />
              <div className="flex flex-col gap-1.5">
                <h2 className="font-display text-xl font-semibold text-fog-50">
                  {t.pages.blog.emptyTitle}
                </h2>
                <p className="text-sm text-fog-400">{t.pages.blog.emptyDescription}</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard
                  key={post._id}
                  post={post}
                  locale={locale}
                  readMoreLabel={t.pages.blog.readMore}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

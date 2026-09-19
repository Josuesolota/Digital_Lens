import "server-only";
import type { Image } from "sanity";
import type { PortableTextBlock } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";

export type PostCategory = {
  title: string;
  slug: string;
  color: string | null;
};

export type PostSummary = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: Image & { alt: string };
  publishedAt: string;
  category: PostCategory | null;
};

export type PostDetail = PostSummary & {
  body: PortableTextBlock[];
  seoDescription: string | null;
};

/** Campos comuns à lista e ao artigo — mantém as duas queries em sincronia. */
const summaryFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  "category": category->{ title, "slug": slug.current, color }
`;

export async function getAllPosts(): Promise<PostSummary[]> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) { ${summaryFields} }`,
    {},
    { next: { revalidate: 60 } }
  );
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  return sanityClient.fetch(
    /* groq */ `*[_type == "post" && slug.current == $slug][0] { ${summaryFields}, body, seoDescription }`,
    { slug },
    { next: { revalidate: 60 } }
  );
}

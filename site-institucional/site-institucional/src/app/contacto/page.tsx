import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { getProduct } from "@/lib/products";
import { getPillar } from "@/lib/services";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localizeProduct, localizePillar } from "@/lib/i18n/localize";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.pages.contactPage.title,
    description: t.pages.contactPage.metaDescription,
    alternates: { canonical: "/contacto" },
  };
}

type PageProps = { searchParams: Promise<{ servico?: string }> };

export default async function ContactoPage({ searchParams }: PageProps) {
  const { servico } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);

  // O parâmetro `?servico=` vem dos botões "Pedir orçamento". Só aceitamos
  // slugs que existam no catálogo — nunca ecoamos texto arbitrário no formulário.
  const rawProduct = servico ? getProduct(servico) : undefined;
  const rawPillar = servico ? getPillar(servico) : undefined;
  const subject = rawProduct
    ? localizeProduct(rawProduct, locale).name
    : rawPillar
      ? localizePillar(rawPillar, locale).title
      : undefined;

  return (
    <Contact defaultSubject={subject ? `${t.pages.contactPage.requestPrefix}${subject}` : undefined} />
  );
}

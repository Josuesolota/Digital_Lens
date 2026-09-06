import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { getProduct } from "@/lib/products";
import { getPillar } from "@/lib/services";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Conte-nos o seu projeto. Respondemos em até 1 dia útil com um plano concreto.",
  alternates: { canonical: "/contacto" },
};

type PageProps = { searchParams: Promise<{ servico?: string }> };

export default async function ContactoPage({ searchParams }: PageProps) {
  const { servico } = await searchParams;

  // O parâmetro `?servico=` vem dos botões "Pedir orçamento". Só aceitamos
  // slugs que existam no catálogo — nunca ecoamos texto arbitrário no formulário.
  const subject = servico
    ? (getProduct(servico)?.name ?? getPillar(servico)?.title)
    : undefined;

  return <Contact defaultSubject={subject ? `Pedido: ${subject}` : undefined} />;
}

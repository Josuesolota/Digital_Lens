import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/auth";
import { registerAction } from "@/app/auth-actions";
import { AuthForm } from "@/components/forms/AuthForm";
import { Container } from "@/components/ui/Container";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return {
    title: t.pages.register.title,
    description: t.pages.register.metaDescription,
    alternates: { canonical: "/registar" },
  };
}

export default async function RegistarPage() {
  if (await getSession()) redirect("/conta");

  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden py-16">
      <AuroraBackground />
      <Container className="relative flex justify-center">
        <AuthForm mode="register" action={registerAction} />
      </Container>
    </section>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/auth";
import { registerAction } from "@/app/auth-actions";
import { AuthForm } from "@/components/forms/AuthForm";
import { Container } from "@/components/ui/Container";
import { AuroraBackground } from "@/components/ui/AuroraBackground";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie a sua conta Digital Lens e acompanhe os seus projetos.",
  alternates: { canonical: "/registar" },
};

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

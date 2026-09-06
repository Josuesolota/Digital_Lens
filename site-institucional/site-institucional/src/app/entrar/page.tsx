import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/auth";
import { loginAction } from "@/app/auth-actions";
import { AuthForm } from "@/components/forms/AuthForm";
import { Container } from "@/components/ui/Container";
import { AuroraBackground } from "@/components/ui/AuroraBackground";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Aceda à sua área de cliente Digital Lens.",
  alternates: { canonical: "/entrar" },
};

type PageProps = { searchParams: Promise<{ redirectTo?: string }> };

export default async function EntrarPage({ searchParams }: PageProps) {
  if (await getSession()) redirect("/conta");

  const { redirectTo } = await searchParams;
  // Só aceitamos caminhos internos — impede redireccionamento aberto para
  // domínios externos através do parâmetro de query.
  const safeRedirect =
    redirectTo?.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/conta";

  return (
    <section className="relative flex min-h-[75vh] items-center overflow-hidden py-16">
      <AuroraBackground />
      <Container className="relative flex justify-center">
        <AuthForm mode="login" action={loginAction} redirectTo={safeRedirect} />
      </Container>
    </section>
  );
}

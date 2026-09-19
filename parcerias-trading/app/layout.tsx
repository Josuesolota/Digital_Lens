import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parceria — Plataformas de Negociação Financeira | Digital Lens",
  description:
    "Candidatura a parceria para o desenvolvimento de uma plataforma de negociação financeira em conjunto com a Digital Lens.",
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}

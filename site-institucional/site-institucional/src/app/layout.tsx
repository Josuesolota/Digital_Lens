import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { getSession } from "@/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/providers";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { siteConfig, absoluteUrl } from "@/lib/site-config";
import "./globals.css";

/**
 * Tipografia — trio geométrico/técnico, coerente com a leitura futurista:
 *   Space Grotesk  títulos (geométrica com carácter, sem ser fria)
 *   Inter          corpo (legibilidade em ecrã, altura-x generosa)
 *   JetBrains Mono rótulos, preços e dados
 * `next/font` faz self-host no build: zero pedidos ao Google em produção.
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Agência Digital`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "agência digital",
    "desenvolvimento web",
    "criação de sites",
    "loja online",
    "inteligência artificial",
    "agentes de IA",
    "chatbot",
    "marketing digital",
    "tráfego pago",
    "locução profissional",
    "narração de audiobooks",
    "clonagem de voz",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.legalName,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Agência Digital`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: `${siteConfig.name} — Agência Digital` },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Agência Digital`,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
  // Metadados de PWA: manifest + comportamento em iOS (que ignora o manifest).
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#06080f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // A app instalada deve ocupar a área do notch/ilha dinâmica.
  viewportFit: "cover",
};

/** JSON-LD Organization — ajuda os motores de busca a identificar a entidade. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": absoluteUrl("/#organization"),
  name: siteConfig.legalName,
  url: siteConfig.url,
  description: siteConfig.description,
  email: siteConfig.email,
  image: absoluteUrl("/og-image.png"),
  logo: absoluteUrl("/icons/icon-512.png"),
  areaServed: siteConfig.address.country,
  address: {
    "@type": "PostalAddress",
    addressLocality: siteConfig.address.locality,
    addressCountry: siteConfig.address.country,
  },
  sameAs: siteConfig.sameAs,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // O nonce é gerado por pedido no middleware e consumido pela CSP.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const session = await getSession();

  return (
    <html
      lang={siteConfig.language}
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/*
          As animações de entrada partem de `opacity: 0` e só o Framer Motion as
          revela. Sem JavaScript esse passo nunca acontece e secções inteiras
          ficariam invisíveis — este fallback garante que o conteúdo aparece na
          mesma. Só é aplicado quando o browser não executa scripts.
        */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col bg-void-950 text-fog-50 antialiased">
        <Providers>
          <Navbar userName={session?.user?.name ?? null} />
          <main className="flex-1">{children}</main>
          <Footer />
          <InstallPrompt />
          <ServiceWorkerRegistration />
        </Providers>
      </body>
    </html>
  );
}

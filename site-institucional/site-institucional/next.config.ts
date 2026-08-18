import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove o header "X-Powered-By: Next.js" — menos superfície de fingerprinting
  poweredByHeader: false,

  // Compressão gzip/brotli das respostas
  compress: true,

  images: {
    // AVIF primeiro (mais leve), WebP como fallback — aplicado automaticamente
    // por next/image assim que forem adicionadas imagens reais ao projeto.
    formats: ["image/avif", "image/webp"],
    // Adicionar aqui os domínios de onde as imagens (CMS, Cloudinary, etc.)
    // vierem a ser servidas, ex.:
    // remotePatterns: [{ protocol: "https", hostname: "cdn.exemplo.com" }],
  },

  async headers() {
    return [
      {
        // Cache agressivo para assets estáticos versionados pelo Next
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Headers de segurança básicos em todas as rotas.
        // Content-Security-Policy fica no middleware.ts (precisa de nonce dinâmico por pedido).
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HSTS: força HTTPS no browser por 2 anos, incl. subdomínios.
          // Seguro por defeito na Vercel (HTTPS automático); manter explícito
          // é boa prática caso o domínio migre de host no futuro.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

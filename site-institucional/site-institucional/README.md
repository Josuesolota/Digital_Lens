# Site Institucional

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Estrutura

- `src/app` — rotas (App Router), layout raiz, metadata SEO
- `src/components/layout` — Navbar, Footer
- `src/components/sections` — Hero, Serviços, Sobre, Depoimentos, CTA, Contato
- `src/components/ui` — botões, cards e primitivos reutilizáveis
- `src/lib` — utilitários (validação, helpers)

## Design tokens

Definidos em `src/app/globals.css` (bloco `@theme`):

- `ink-900` `#0f1b2d` — azul-tinta profundo (texto/fundos escuros)
- `ink-700` `#1e3a5f` — azul principal da marca
- `ink-500` `#4a7fa7` — azul claro (acentos)
- `signal-600` `#b3272d` — vermelho-sinal (CTAs)
- `signal-400` `#e0555c` — vermelho claro (hover)
- `paper-50` `#f7f5f1` — fundo padrão

Tipografia: Fraunces (display) + Inter (corpo) + IBM Plex Mono (utilitária), via `next/font/google` — self-hosted automaticamente no build, sem custo de performance nem tracking externo.

## Deploy

Conectar este repositório à Vercel → deploy automático a cada push. Build: `npm run build`, sem configuração adicional necessária.

## Performance (Fase 4)

- **LazyMotion** (`src/components/motion-provider.tsx`): carrega apenas o subconjunto `domAnimation` do Framer Motion (~15kb) em vez do pacote completo. Modo `strict` — usar sempre `m.*`, nunca `motion.*` diretamente.
- **Code-splitting**: secções abaixo da dobra (Portfólio, Depoimentos, Em Breve, Contacto) carregadas via `next/dynamic` em `src/app/page.tsx` — chunks próprios, não entram no bundle inicial.
- **Imagens**: `src/components/ui/OptimizedImage.tsx` envolve `next/image` com lazy-load por padrão e `sizes` responsivo; `next.config.ts` já força AVIF/WebP. Usar sempre este componente (nunca `<img>`) quando forem adicionadas fotos reais.
- **Cache**: assets estáticos do Next (`/_next/static/*`) com `Cache-Control: immutable` por 1 ano.
- **Fontes**: `next/font` faz self-host automático no build — zero pedidos a `fonts.googleapis.com` em produção, sem bloqueio de render.

**Nota:** o `next build` completo (que gera o relatório de bundle) requer acesso a `fonts.googleapis.com` — indisponível no sandbox usado para desenvolver isto, mas padrão na Vercel. Corra `npm run build` no seu ambiente para confirmar os tamanhos finais dos chunks, e o Lighthouse (Chrome DevTools) sobre o deploy de preview para validar as métricas (meta: 90+ em Performance/Acessibilidade/SEO).

## Segurança e SEO (Fase 5)

- **`src/middleware.ts`** — gera um nonce único por pedido e define a `Content-Security-Policy` (script-src restrito a `self` + nonce + `strict-dynamic`; `frame-ancestors 'none'`; `object-src 'none'`). Segue o padrão oficial da Next.js para App Router.
- **`next.config.ts`** — headers adicionais: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e `Strict-Transport-Security` (HSTS, 2 anos).
- **Formulário de contacto** (`src/app/actions.ts`) — validação e sanitização no servidor + honeypot anti-spam. **Antes de produção real**, adicionar rate limiting (ex.: Vercel Firewall ou Upstash Ratelimit) — um limitador em memória não sobrevive a funções serverless e daria falsa sensação de proteção.
- **SEO técnico** — `src/app/robots.ts` e `src/app/sitemap.ts` (convenções nativas do Next, geram `/robots.txt` e `/sitemap.xml` automaticamente); metadata completa com Open Graph e Twitter Card em `layout.tsx`.
- **Dados estruturados** — JSON-LD `Organization` injetado no `<head>` (nome, descrição, contacto, redes sociais).
- **`src/lib/site-config.ts`** — centraliza nome/URL/descrição da empresa. **Atualizar o `url` com o domínio real antes do deploy** — é usado no `metadataBase`, no sitemap, no robots.txt e no JSON-LD.
- **Imagem Open Graph** — falta adicionar `/public/og-image.png` (1200×630px) para as pré-visualizações em redes sociais funcionarem corretamente.

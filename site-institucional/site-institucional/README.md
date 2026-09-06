# Digital Lens — Site institucional, vitrine e loja

Site da agência Digital Lens: apresentação institucional, portfólio, catálogo
de serviços e loja com pagamento online, empacotado como PWA instalável.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Framer Motion · NextAuth v5 · Neon (PostgreSQL) · Stripe · Resend

---

## Arrancar localmente

```bash
npm install
cp .env.example .env.local   # preencher as chaves que quiser activar
npm run dev
```

Abrir <http://localhost:3000>.

O site arranca **sem nenhuma variável de ambiente**: as páginas institucionais,
o catálogo de serviços e a vitrine da loja funcionam sempre. Cada bloco do
`.env.example` activa uma funcionalidade adicional (contas, pagamentos, e-mail).

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build de produção |
| `npm run lint` | ESLint (regras `next/core-web-vitals` + TypeScript) |
| `npm run icons` | Regenera os ícones do PWA a partir de `brand/logo-source.png` |

---

## Estrutura

```
src/
  app/
    page.tsx                    homepage
    servicos/                   catálogo por pilar + página de cada pilar
    loja/                       catálogo da loja + página de cada produto
    carrinho/                   carrinho completo
    checkout/sucesso/           retorno do Stripe
    conta/                      área de cliente (protegida)
    entrar/ registar/           autenticação
    contacto/                   formulário de contacto
    offline/                    página servida pelo service worker sem rede
    api/
      auth/[...nextauth]/       handlers do Auth.js
      checkout/                 cria a sessão de pagamento Stripe
      stripe/webhook/           confirma pagamentos (fonte de verdade)
    actions.ts                  Server Actions públicas (contacto, newsletter)
    auth-actions.ts             Server Actions de registo/login/logout
    manifest.ts                 manifest do PWA
  components/
    layout/                     Navbar, Footer
    sections/                   secções da homepage
    ui/                         primitivos (Button, GlassCard, LensMark, …)
    cart/                       carrinho (contexto, gaveta, botões)
    store/                      cartão de produto
    forms/                      formulários de contacto e autenticação
    pwa/                        registo do service worker e prompt de instalação
  lib/
    site-config.ts              dados institucionais (fonte única)
    services.ts                 os 4 pilares e os 22 serviços
    products.ts                 catálogo e preços da loja
    cart-store.ts               store externo do carrinho (localStorage)
    rate-limit.ts               rate limiting persistido em Postgres
    db/                         cliente Neon, consultas e schema.sql
    email.ts                    e-mails transacionais (Resend)
    stripe.ts                   cliente Stripe
  auth.ts                       configuração do NextAuth v5
  proxy.ts                      CSP com nonce por pedido (Next.js 16)
scripts/generate-icons.mjs      gera ícones e imagem Open Graph
brand/logo-source.png           símbolo da marca em alta resolução
```

---

## Identidade visual

A paleta é derivada do símbolo da marca — o vidro da lente passa de azul a
violeta e magenta sobre um aro cromado, assente num fundo quase preto. Os
tokens estão em `src/app/globals.css` (bloco `@theme`):

| Família | Uso |
| --- | --- |
| `void-950 … void-700` | fundos (o preto-azulado onde a lente assenta) |
| `lens-blue-*` `lens-violet-*` `lens-magenta-*` | acções, acentos, gradientes |
| `chrome-*` | o aro metálico — bordas e superfícies elevadas |
| `fog-50 … fog-600` | tipografia sobre o void |

O site é **dark-first por decisão de marca**: a lente só ganha presença sobre
o void.

Utilitários próprios: `.glass` (painel de vidro), `.text-gradient`,
`.grid-void` (grelha técnica de fundo), `.eyebrow` (rótulo monospace).

**Tipografia:** Space Grotesk (títulos), Inter (corpo), JetBrains Mono
(rótulos e preços) — self-hosted no build por `next/font`.

---

## PWA

- `src/app/manifest.ts` → servido em `/manifest.webmanifest`
- `public/sw.js` → service worker: network-first na navegação (com fallback
  para `/offline`), cache-first nos assets versionados, e passagem directa em
  `/api`, `/checkout` e `/conta`
- `src/components/pwa/` → registo do worker (só em produção) e faixa de
  instalação a partir do evento `beforeinstallprompt`

### Regenerar os ícones

Os ícones (`any` + `maskable`), o favicon multi-resolução e a imagem Open Graph
são gerados a partir de `brand/logo-source.png`:

```bash
npm run icons
```

Para trocar o símbolo da marca, substituir esse ficheiro e ajustar a constante
`CROP` em `scripts/generate-icons.mjs` para enquadrar a nova lente.

---

## Integrações

### Base de dados (Neon)

1. Criar um projeto em <https://console.neon.tech> e copiar a *connection
   string* (pooled) para `DATABASE_URL`.
2. Aplicar o esquema — o script é idempotente:

   ```bash
   psql "$DATABASE_URL" -f src/lib/db/schema.sql
   ```

Tabelas: `users`, `orders`, `contact_messages`, `newsletter_subscribers`.

### Autenticação (NextAuth v5)

Provider de credenciais (e-mail + palavra-passe), sessão em JWT, hashing com
bcrypt a custo 12. Gerar o segredo:

```bash
npx auth secret     # ou: openssl rand -base64 32
```

As rotas `/entrar`, `/registar` e `/conta` requerem `AUTH_SECRET` **e**
`DATABASE_URL`. Sem elas, `getSession()` devolve `null` e o resto do site
continua a funcionar normalmente.

### Pagamentos (Stripe)

O checkout funciona por **redireccionamento** para o Stripe Checkout. O
carrinho envia apenas `{ productId, quantity }`; nome, preço e modo de
faturação são lidos do catálogo **no servidor** — nunca do pedido.

Configurar o webhook em Developers → Webhooks:

- **URL:** `https://<dominio>/api/stripe/webhook`
- **Eventos:** `checkout.session.completed`,
  `checkout.session.async_payment_succeeded`,
  `checkout.session.async_payment_failed`, `checkout.session.expired`

Em desenvolvimento:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

> **Regra:** só o webhook marca uma encomenda como paga. A página
> `/checkout/sucesso` é informativa — qualquer pessoa pode abri-la.
> Métodos assíncronos (Multibanco) chegam como `completed` mas com
> `payment_status: "unpaid"`; a confirmação real vem no
> `async_payment_succeeded`.

Pagamentos únicos e subscrições mensais não podem ser misturados na mesma
sessão do Stripe — o carrinho avisa e obriga a compras separadas.

### E-mail (Resend)

Envia: notificação interna de contacto, acuso de receção ao cliente,
boas-vindas no registo, recibo de encomenda e notificação interna de venda.

O envio **degrada com elegância**: sem `RESEND_API_KEY` nada rebenta — a
mensagem fica registada no log e, quando há base de dados, persistida em
`contact_messages`. Um formulário nunca deve falhar para o cliente por causa
do fornecedor de e-mail.

O domínio de `EMAIL_FROM` tem de estar verificado no Resend.

---

## Conteúdo — onde editar

| O quê | Onde |
| --- | --- |
| Nome, e-mail, morada, redes sociais | `src/lib/site-config.ts` |
| Pilares e serviços | `src/lib/services.ts` |
| Produtos e preços da loja | `src/lib/products.ts` |
| Cases do portfólio | `src/components/sections/Portfolio.tsx` |
| Depoimentos | `src/components/sections/Testimonials.tsx` |

Adicionar um serviço ou produto a estes ficheiros propaga-o automaticamente
para a navegação, o sitemap, o JSON-LD e as páginas de detalhe.

---

## Segurança

- **CSP com nonce por pedido** (`src/proxy.ts`) — `script-src` restrito a
  `self` + nonce + `strict-dynamic`; `frame-ancestors 'none'`;
  `object-src 'none'`. Origens do Stripe explicitamente autorizadas.
- **Headers** (`next.config.ts`) — `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` e HSTS (2 anos).
- **Formulários** — validação com Zod no servidor + honeypot anti-spam.
- **Preços** — recalculados no servidor a partir do catálogo em código.
- **Webhook** — assinatura verificada com `STRIPE_WEBHOOK_SECRET`; operações
  idempotentes, porque o Stripe reenvia eventos.
- **Redireccionamento** — o parâmetro `?redirectTo=` só aceita caminhos
  internos (bloqueia *open redirect*).
- **Palavras-passe** — bcrypt custo 12; login com tempo de resposta constante
  para não revelar que e-mails existem.

### Rate limiting

Implementado em `src/lib/rate-limit.ts`, com o contador **persistido em
Postgres** (tabela `rate_limits`). Em serverless cada invocação pode correr numa
instância diferente, pelo que um contador em memória protegeria apenas contra o
atacante distraído — o estado tem de viver fora do processo.

| Acção | Limite | Janela |
| --- | --- | --- |
| Formulário de contacto | 5 | 1 hora |
| Lista de espera | 5 | 1 hora |
| Criação de conta | 5 | 1 hora |
| Início de sessão | 10 | 15 minutos |
| Checkout | 20 | 1 hora |

Notas de desenho:

- **Janela fixa**, não deslizante — no pior caso permite até 2× o limite na
  fronteira entre janelas. Para formulários e autenticação é um compromisso
  aceitável e custa uma única query; uma janela deslizante obrigaria a guardar
  cada evento.
- **UPSERT atómico** — o Postgres serializa as escritas sobre a mesma chave
  primária, pelo que pedidos concorrentes nunca lêem o mesmo valor antes de
  incrementar.
- **O login tem dois baldes**: por IP e por IP+e-mail. Sem o segundo, um
  atacante num IP partilhado (NAT móvel, rede empresarial) esgotaria o balde do
  IP e bloquearia utilizadores legítimos.
- **Falha aberta** — se a base de dados estiver indisponível, os pedidos passam.
  Bloquear todos os formulários do site durante uma falha da base de dados
  causaria mais prejuízo do que o abuso que evitaria.
- **Identificação do cliente** por `x-vercel-forwarded-for` (definido pela
  plataforma) com recurso a `x-forwarded-for`. Fora de um proxy, todos os
  pedidos partilham o balde `anon` — restritivo de mais localmente, nunca
  permissivo de mais em produção.
- As linhas expiradas são apagadas oportunisticamente em ~2% das verificações,
  o que dispensa um cron só para isso.

> Sem `DATABASE_URL` o limitador cai para um contador em memória, apenas para
> desenvolvimento local. Não é protecção de produção — e o código diz isso.

---

## Desempenho

- **LazyMotion** (`src/components/providers.tsx`) — carrega só o subconjunto
  `domAnimation` do Framer Motion (~15 kB em vez de ~35 kB). Modo `strict`:
  usar sempre `m.*`, nunca `motion.*`.
- **Code-splitting** — secções abaixo da dobra carregadas via `next/dynamic`.
- **Carrinho** — `useSyncExternalStore` sobre um store próprio, sem efeito de
  hidratação e com sincronização entre separadores.
- **Imagens** — usar sempre `src/components/ui/OptimizedImage.tsx`
  (`next/image` com lazy-load e `sizes` responsivo); AVIF/WebP automáticos.
- **Fontes** — self-host no build, zero pedidos ao Google em produção.

> **Nota sobre renderização:** todas as rotas são servidas dinamicamente. É a
> consequência assumida da CSP com nonce por pedido — o layout lê `headers()`,
> o que impede a pré-renderização estática. É o compromisso recomendado pela
> própria Next.js para CSP estrita.

### Acessibilidade

Foco visível em todos os elementos interactivos, `aria-invalid` e
`aria-describedby` nos formulários, `role="alert"` nas mensagens de erro,
diálogos com `Escape` e bloqueio de scroll, e `prefers-reduced-motion`
respeitado. As animações de entrada têm fallback `<noscript>` — sem
JavaScript o conteúdo aparece na mesma.

---

## Deploy (Vercel)

1. Importar o repositório na Vercel.
2. **Root Directory:** `site-institucional/site-institucional`
3. Configurar as variáveis de ambiente do `.env.example`.
4. Depois do primeiro deploy, criar o webhook do Stripe apontado ao domínio
   final e copiar o `STRIPE_WEBHOOK_SECRET`.

Build: `npm run build`. Sem configuração adicional.

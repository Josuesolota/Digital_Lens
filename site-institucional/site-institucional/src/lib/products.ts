/**
 * Catálogo da loja.
 *
 * Os preços vivem aqui, em cêntimos, e são enviados para o Stripe como
 * `price_data` inline no momento do checkout. Vantagem: não é preciso manter
 * um catálogo espelhado no dashboard do Stripe — esta lista é a única verdade.
 *
 * `price: null` marca serviços sob orçamento: não entram no carrinho, levam o
 * visitante ao formulário de contacto com o serviço pré-seleccionado.
 */

import { SERVICE_PILLARS } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";

export type Billing = "one-time" | "monthly";

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Slug do pilar de serviço a que pertence */
  pillar: string;
  summary: string;
  description: string;
  /** Em cêntimos (EUR). `null` = sob orçamento. */
  price: number | null;
  billing: Billing;
  /** Prazo típico de entrega, em dias úteis */
  deliveryDays: number;
  features: readonly string[];
  /** Destaca o cartão na grelha da loja */
  featured?: boolean;
};

export const PRODUCTS: readonly Product[] = [
  // ── Desenvolvimento Web ───────────────────────────────────────────────
  {
    id: "web-landing",
    slug: "landing-page-essencial",
    name: "Landing Page Essencial",
    pillar: "desenvolvimento-web",
    summary: "Uma página, um objectivo: converter visitantes em contactos.",
    description:
      "Página única de alta conversão, com copy orientada a benefícios, formulário integrado e analítica configurada. Ideal para lançamentos, campanhas pagas e validação de ofertas.",
    price: 49000,
    billing: "one-time",
    deliveryDays: 7,
    features: [
      "Design exclusivo e responsivo",
      "Formulário de contacto ligado ao seu e-mail",
      "SEO técnico e Open Graph",
      "Analítica e eventos de conversão",
      "Deploy e domínio configurados",
    ],
  },
  {
    id: "web-institucional",
    slug: "site-institucional",
    name: "Site Institucional",
    pillar: "desenvolvimento-web",
    summary: "A presença oficial da sua marca, construída para durar.",
    description:
      "Até seis páginas com estrutura editável, blog opcional e desempenho no topo do Lighthouse. Entregue com código-fonte e documentação para a sua equipa manter.",
    price: 129000,
    billing: "one-time",
    deliveryDays: 21,
    features: [
      "Até 6 páginas + blog",
      "Gestão de conteúdo autónoma",
      "Acessibilidade WCAG AA",
      "Dados estruturados e sitemap",
      "Código-fonte documentado",
    ],
    featured: true,
  },
  {
    id: "web-loja",
    slug: "loja-virtual",
    name: "Loja Virtual",
    pillar: "desenvolvimento-web",
    summary: "E-commerce completo, do catálogo à fatura.",
    description:
      "Loja com catálogo, carrinho, checkout com cartão e Multibanco/MB Way, gestão de encomendas e integração de expedição. Preparada para escalar sem reescrever.",
    price: 249000,
    billing: "one-time",
    deliveryDays: 35,
    features: [
      "Catálogo e gestão de stock",
      "Pagamentos Stripe (cartão, MB Way, Multibanco)",
      "Contas de cliente e histórico de encomendas",
      "E-mails transacionais automáticos",
      "Painel de administração",
    ],
  },
  {
    id: "web-trading",
    slug: "plataforma-negociacao-financeira",
    name: "Plataforma de Negociação Financeira",
    pillar: "desenvolvimento-web",
    summary: "Dashboards de trading com dados em tempo real.",
    description:
      "Plataformas ligadas a APIs de corretoras — incluindo a Deriv — com gráficos em tempo real, gestão de risco, histórico de operações e automação de estratégias. Âmbito definido caso a caso.",
    price: null,
    billing: "one-time",
    deliveryDays: 60,
    features: [
      "Integração com API de corretora (ex.: Deriv)",
      "Gráficos e cotações em tempo real",
      "Motor de estratégias automatizadas",
      "Gestão de risco e limites por conta",
      "Auditoria e registo de operações",
    ],
  },

  // ── Inteligência Artificial ───────────────────────────────────────────
  {
    id: "ia-chatbot",
    slug: "chatbot-atendimento-ia",
    name: "Chatbot de Atendimento com IA",
    pillar: "inteligencia-artificial",
    summary: "Atendimento 24/7 treinado no conhecimento da sua empresa.",
    description:
      "Assistente que responde a clientes no site e no WhatsApp com base na sua documentação real, encaminha para humano quando não sabe e regista todas as conversas.",
    price: 89000,
    billing: "one-time",
    deliveryDays: 14,
    features: [
      "Treino sobre os seus documentos",
      "Widget no site + WhatsApp",
      "Escalonamento para atendimento humano",
      "Histórico e análise de conversas",
      "30 dias de afinação incluídos",
    ],
    featured: true,
  },
  {
    id: "ia-automacao",
    slug: "automacao-de-processos",
    name: "Automação de Processos",
    pillar: "inteligencia-artificial",
    summary: "Elimine o trabalho manual que consome a sua equipa.",
    description:
      "Mapeamos um processo repetitivo do seu negócio e automatizamo-lo de ponta a ponta, ligando as ferramentas que já usa. Inclui painel de acompanhamento e plano de contingência.",
    price: 69000,
    billing: "one-time",
    deliveryDays: 14,
    features: [
      "Mapeamento e desenho do fluxo",
      "Integração com as suas ferramentas",
      "Painel de execuções e alertas",
      "Documentação e formação",
    ],
  },
  {
    id: "ia-conteudo",
    slug: "producao-de-conteudo-com-ia",
    name: "Produção de Conteúdo com IA",
    pillar: "inteligencia-artificial",
    summary: "Conteúdo à escala, com a sua voz de marca.",
    description:
      "Pacote mensal de produção assistida por IA: artigos, legendas para redes sociais e descrições de produto — sempre revistos por editor humano antes de publicar.",
    price: 39000,
    billing: "monthly",
    deliveryDays: 5,
    features: [
      "8 artigos optimizados para pesquisa",
      "20 legendas para redes sociais",
      "Guia de voz de marca",
      "Revisão editorial humana",
    ],
  },
  {
    id: "ia-agente",
    slug: "agente-de-ia-a-medida",
    name: "Agente de IA à Medida",
    pillar: "inteligencia-artificial",
    summary: "Um agente que executa, não apenas responde.",
    description:
      "Agentes autónomos que consultam os seus dados, decidem e executam ações nos seus sistemas dentro de limites definidos. Âmbito e integrações desenhados em conjunto.",
    price: null,
    billing: "one-time",
    deliveryDays: 30,
    features: [
      "Acesso controlado aos seus sistemas",
      "Limites e aprovação humana configuráveis",
      "Registo auditável de cada ação",
      "Monitorização de custo por execução",
    ],
  },

  // ── Marketing Digital ─────────────────────────────────────────────────
  {
    id: "mkt-trafego",
    slug: "gestao-de-trafego-pago",
    name: "Gestão de Tráfego Pago",
    pillar: "marketing-digital",
    summary: "Meta, Google e TikTok Ads geridos com foco no custo por aquisição.",
    description:
      "Gestão mensal das suas campanhas pagas: estrutura de contas, testes contínuos de criativo e público, e relatório quinzenal com o que mudou e porquê. O investimento em anúncios é pago diretamente às plataformas.",
    price: 59000,
    billing: "monthly",
    deliveryDays: 5,
    features: [
      "Meta Ads, Google Ads e TikTok Ads",
      "Configuração de pixels e conversões",
      "Testes A/B contínuos",
      "Relatório quinzenal comentado",
      "Reunião mensal de estratégia",
    ],
    featured: true,
  },
  {
    id: "mkt-criativos",
    slug: "pack-criativos-de-marketing",
    name: "Pack de Criativos de Marketing",
    pillar: "marketing-digital",
    summary: "Dez peças prontas a testar, em formatos nativos.",
    description:
      "Conjunto de dez criativos (estáticos e animados) versionados para teste sistemático, entregues nos formatos e rácios de cada rede social.",
    price: 29000,
    billing: "one-time",
    deliveryDays: 10,
    features: [
      "10 peças em 3 rácios cada",
      "Versões estáticas e animadas",
      "Ficheiros editáveis incluídos",
      "Duas rondas de revisão",
    ],
  },
  {
    id: "mkt-spot",
    slug: "spot-publicitario",
    name: "Spot Publicitário",
    pillar: "marketing-digital",
    summary: "Trinta segundos, do guião à masterização.",
    description:
      "Spot para rádio ou digital com guião, locução profissional, sonoplastia e masterização. Entregue nos formatos exigidos pelas estações e plataformas.",
    price: 19000,
    billing: "one-time",
    deliveryDays: 7,
    features: [
      "Guião e direção criativa",
      "Locução profissional incluída",
      "Sonoplastia e música licenciada",
      "Masterização para rádio e digital",
    ],
  },
  {
    id: "mkt-video",
    slug: "video-promocional",
    name: "Vídeo Promocional",
    pillar: "marketing-digital",
    summary: "Feito para prender nos primeiros três segundos.",
    description:
      "Vídeo curto para redes sociais e campanhas, com guião, edição, legendas queimadas e versões verticais e horizontais.",
    price: 45000,
    billing: "one-time",
    deliveryDays: 12,
    features: [
      "Até 60 segundos",
      "Versões 9:16, 1:1 e 16:9",
      "Legendas incorporadas",
      "Locução ou música à escolha",
    ],
  },

  // ── Locução & Narração ────────────────────────────────────────────────
  {
    id: "voz-institucional",
    slug: "locucao-institucional",
    name: "Locução Institucional",
    pillar: "locucao-narracao",
    summary: "Narração corporativa até três minutos, masterizada.",
    description:
      "Locução para vídeo institucional, apresentação ou campanha, gravada em estúdio com direção de leitura e entregue pronta a montar.",
    price: 12000,
    billing: "one-time",
    deliveryDays: 3,
    features: [
      "Até 3 minutos de áudio final",
      "Português europeu ou do Brasil",
      "WAV e MP3 masterizados",
      "Duas rondas de revisão",
    ],
  },
  {
    id: "voz-audiobook",
    slug: "narracao-de-audiobook",
    name: "Narração de Audiobook",
    pillar: "locucao-narracao",
    summary: "Preço por hora de áudio final, com revisão incluída.",
    description:
      "Gravação de obras completas com direção de leitura, revisão de erros e entrega nos formatos exigidos pelas plataformas de distribuição.",
    price: 24000,
    billing: "one-time",
    deliveryDays: 15,
    features: [
      "Por hora de áudio final",
      "Direção de leitura e revisão",
      "Formatos das principais plataformas",
      "Correções pontuais sem custo",
    ],
  },
  {
    id: "voz-elearning",
    slug: "pack-e-learning",
    name: "Pack E-learning",
    pillar: "locucao-narracao",
    summary: "Narração modular para cursos online, até 30 minutos.",
    description:
      "Locução dividida por módulos, com marcações de tempo para sincronizar com slides e legendas. Pensado para cursos e formação interna.",
    price: 48000,
    billing: "one-time",
    deliveryDays: 10,
    features: [
      "Até 30 minutos de áudio final",
      "Ficheiros separados por módulo",
      "Marcações de tempo para sincronização",
      "Guião de legendas incluído",
    ],
  },
  {
    id: "voz-clonagem",
    slug: "clonagem-de-voz",
    name: "Clonagem de Voz",
    pillar: "locucao-narracao",
    summary: "A sua voz, disponível para produzir à escala.",
    description:
      "Réplica autorizada da sua voz para gerar conteúdo em volume, com consentimento formal, registo de utilizações e possibilidade de revogação a qualquer momento.",
    price: 35000,
    billing: "one-time",
    deliveryDays: 14,
    features: [
      "Sessão de captura em estúdio",
      "Consentimento e licença por escrito",
      "Registo auditável de utilizações",
      "Revogação a pedido",
    ],
  },
] as const;

/** Produtos com preço fechado — os únicos que entram no carrinho. */
export const PURCHASABLE_PRODUCTS = PRODUCTS.filter(
  (product): product is Product & { price: number } => product.price !== null
);

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function getProductsByPillar(pillar: string): Product[] {
  return PRODUCTS.filter((product) => product.pillar === pillar);
}

export const PRODUCT_SLUGS = PRODUCTS.map((product) => product.slug);

/** Nome legível do pilar a que o produto pertence. */
export function pillarTitle(pillarSlug: string): string {
  return (
    SERVICE_PILLARS.find((pillar) => pillar.slug === pillarSlug)?.title ??
    "Serviços"
  );
}

/** Formata cêntimos como moeda: 129000 → "1 290,00 €". */
export function formatPrice(cents: number, currency: string = siteConfig.currency): string {
  return new Intl.NumberFormat(siteConfig.language, {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/**
 * Câmbio de referência para o preço equivalente em Kwanzas mostrado ao lado do
 * preço em euros. A Digital Lens fatura sempre em EUR via Stripe (a conta
 * ainda não tem AOA activado como moeda de apresentação) — este valor é
 * puramente informativo, para o cliente em Angola ter uma ordem de grandeza
 * sem ter de converter de cabeça.
 *
 * Cotação de referência, média de mercado a 06/09/2026: 1 EUR ≈ 1065 AOA.
 * Não há atualização automática — rever este número quando o câmbio se
 * afastar muito do valor real.
 */
const EUR_TO_AOA_RATE = 1065;

/** Desconto aplicado ao câmbio de mercado no preço em Kwanzas exibido. */
const KWANZA_LOCAL_DISCOUNT = 0.6;

/** Preço em Kwanzas a 60% do câmbio de mercado do dia: 129000 → "823 770 Kz". */
export function formatKwanzaEquivalent(cents: number): string {
  const eur = cents / 100;
  const marketValueAoa = eur * EUR_TO_AOA_RATE;
  const localValueAoa = marketValueAoa * KWANZA_LOCAL_DISCOUNT;

  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(localValueAoa);
}

/**
 * Catálogo da loja.
 *
 * Cada produto vendável tem uma faixa de preço (`priceRange`) e um
 * `configurator` que determina, a partir das escolhas do cliente, onde dentro
 * dessa faixa cai o preço final:
 *
 *  - `kind: "features"` — desenvolvimento web e IA. O cliente escolhe âmbito
 *    (grupos "single", ex.: número de páginas) e extras (grupos "multi",
 *    ex.: multilingue). O preço soma o `basePrice` aos deltas escolhidos.
 *  - `kind: "tier"` — os restantes serviços. O cliente escolhe um nível de
 *    complexidade de uma lista ordenada; o preço é o desse nível. Um único
 *    nível (`levels.length === 1`) representa um preço fixo, sem escolha.
 *
 * `resolvePrice()` é a única função que transforma uma escolha em preço, e
 * corre tanto no cliente (para mostrar o preço em tempo real) como no
 * servidor (`/api/checkout`, que nunca confia no preço que o cliente envia —
 * só nas escolhas, recalculando sempre a partir daqui). Os preços vivem em
 * cêntimos e são enviados para a Paddle como item "non-catalog" (preço e
 * produto inline no pedido) — não há um catálogo espelhado no painel da
 * Paddle, este ficheiro é a única verdade.
 *
 * `priceRange: null` marca serviços sob orçamento: não entram no carrinho,
 * levam o visitante ao formulário de contacto com o serviço pré-seleccionado.
 */

import { SERVICE_PILLARS } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";

export type Billing = "one-time" | "monthly";

export type PriceRange = { min: number; max: number };

/** Uma opção dentro de um grupo do configurador por funcionalidades. */
export type ConfiguratorOption = {
  id: string;
  label: string;
  /** Acréscimo em cêntimos sobre o preço base do produto */
  priceDelta: number;
};

export type ConfiguratorGroup = {
  id: string;
  title: string;
  /** "single" = escolher exactamente uma opção (ex.: âmbito); "multi" = qualquer combinação de extras */
  type: "single" | "multi";
  options: readonly ConfiguratorOption[];
};

/** Configurador por funcionalidades — desenvolvimento web e inteligência artificial. */
export type FeatureConfigurator = {
  kind: "features";
  /** Preço com a opção mais barata de cada grupo "single" e nenhum extra */
  basePrice: number;
  groups: readonly ConfiguratorGroup[];
};

export type TierLevel = {
  label: string;
  description: string;
  /** Em cêntimos */
  price: number;
};

/** Configurador por nível de complexidade — um só nível é, na prática, um preço fixo. */
export type TierConfigurator = {
  kind: "tier";
  levels: readonly TierLevel[];
  /** Rótulo do stepper de quantidade quando não é "unidades" (ex.: "horas") */
  quantityLabel?: string;
};

export type Configurator = FeatureConfigurator | TierConfigurator;

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Slug do pilar de serviço a que pertence */
  pillar: string;
  summary: string;
  description: string;
  /** `null` = sob orçamento, sem configurador nem carrinho */
  priceRange: PriceRange | null;
  billing: Billing;
  /** Prazo típico de entrega, em dias úteis */
  deliveryDays: number;
  features: readonly string[];
  configurator: Configurator | null;
  /** Destaca o cartão na grelha da loja */
  featured?: boolean;
};

// ── Escolha do cliente e cálculo do preço ───────────────────────────────────

export type ConfigSelection =
  | { kind: "features"; optionIds: readonly string[] }
  | { kind: "tier"; levelIndex: number };

export type PriceResolution =
  | { ok: true; price: number; summary: readonly string[] }
  | { ok: false };

/**
 * Calcula o preço final a partir do produto e da escolha do cliente.
 *
 * Determinística e sem efeitos secundários de propósito: é chamada tanto no
 * cliente (mostrar o preço a ajustar-se em tempo real) como no servidor
 * (validar o que a Paddle vai cobrar). Uma escolha inválida ou incompleta
 * devolve `{ ok: false }` em vez de arriscar um preço a menos — quem chama
 * decide o que fazer (desactivar o botão, ignorar a linha do carrinho).
 */
export function resolvePrice(
  product: Product,
  selection: ConfigSelection | undefined
): PriceResolution {
  const configurator = product.configurator;
  if (!configurator) return { ok: false };

  if (configurator.kind === "tier") {
    if (configurator.levels.length === 1) {
      // Preço fixo: não há escolha a validar.
      const [level] = configurator.levels;
      return { ok: true, price: level.price, summary: [] };
    }
    if (!selection || selection.kind !== "tier") return { ok: false };
    const level = configurator.levels[selection.levelIndex];
    if (!level) return { ok: false };
    return { ok: true, price: level.price, summary: [level.label] };
  }

  // configurator.kind === "features"
  if (!selection || selection.kind !== "features") return { ok: false };

  let price = configurator.basePrice;
  const summary: string[] = [];

  for (const group of configurator.groups) {
    const selected = group.options.filter((option) =>
      selection.optionIds.includes(option.id)
    );

    if (group.type === "single") {
      // Cada grupo "single" tem de ter exactamente uma opção escolhida.
      if (selected.length !== 1) return { ok: false };
      price += selected[0].priceDelta;
      summary.push(selected[0].label);
    } else {
      for (const option of selected) {
        price += option.priceDelta;
        summary.push(option.label);
      }
    }
  }

  return { ok: true, price, summary };
}

/**
 * Escolha inicial do configurador: a opção mais barata de cada grupo
 * "single", sem extras — reproduz exactamente `configurator.basePrice` /
 * `priceRange.min`. É com esta escolha que o painel de compra abre.
 */
export function defaultSelection(configurator: Configurator): ConfigSelection {
  if (configurator.kind === "tier") return { kind: "tier", levelIndex: 0 };

  const optionIds = configurator.groups
    .filter((group) => group.type === "single")
    .map((group) => group.options[0].id);

  return { kind: "features", optionIds };
}

// ── Catálogo ─────────────────────────────────────────────────────────────

export const PRODUCTS: readonly Product[] = [
  // ── Desenvolvimento Web ───────────────────────────────────────────────
  {
    id: "web-landing",
    slug: "landing-page-essencial",
    name: "Landing Page Essencial",
    pillar: "desenvolvimento-web",
    summary: "Uma página, um objectivo: converter visitantes em contactos.",
    description:
      "Página de alta conversão, com copy orientada a benefícios, formulário integrado e analítica configurada. Escolha o âmbito e os extras — o preço ajusta-se em tempo real.",
    priceRange: { min: 8000, max: 80000 },
    billing: "one-time",
    deliveryDays: 7,
    features: [
      "Formulário de contacto ligado ao seu e-mail",
      "SEO técnico e Open Graph",
      "Analítica e eventos de conversão",
      "Deploy e domínio configurados",
    ],
    configurator: {
      kind: "features",
      basePrice: 8000,
      groups: [
        {
          id: "ambito",
          title: "Âmbito",
          type: "single",
          options: [
            { id: "1-pagina", label: "1 página", priceDelta: 0 },
            { id: "ate-3-paginas", label: "Até 3 páginas", priceDelta: 8000 },
            { id: "multi-seccao", label: "Multi-secção (5+ blocos)", priceDelta: 15000 },
          ],
        },
        {
          id: "design",
          title: "Design",
          type: "single",
          options: [
            { id: "template", label: "Template adaptado à marca", priceDelta: 0 },
            { id: "original", label: "Design 100% original", priceDelta: 12000 },
          ],
        },
        {
          id: "extras",
          title: "Extras",
          type: "multi",
          options: [
            { id: "crm", label: "Formulário avançado com CRM", priceDelta: 5000 },
            { id: "animacoes", label: "Animações e microinterações", priceDelta: 6000 },
            { id: "copywriting", label: "Copywriting profissional", priceDelta: 6000 },
            { id: "seo", label: "SEO avançado + dados estruturados", priceDelta: 4000 },
            { id: "multilingue", label: "Versão multilingue", priceDelta: 7000 },
            { id: "ab-testing", label: "Testes A/B", priceDelta: 8000 },
            { id: "expresso", label: "Prazo expresso (< 72h)", priceDelta: 9000 },
          ],
        },
      ],
    },
  },
  {
    id: "web-institucional",
    slug: "site-institucional",
    name: "Site Institucional",
    pillar: "desenvolvimento-web",
    summary: "A presença oficial da sua marca, construída para durar.",
    description:
      "Estrutura editável e desempenho no topo do Lighthouse. Escolha o número de páginas e os extras — o preço ajusta-se em tempo real ao âmbito real do projeto.",
    priceRange: { min: 18000, max: 180000 },
    billing: "one-time",
    deliveryDays: 21,
    features: [
      "Gestão de conteúdo autónoma",
      "Acessibilidade WCAG AA",
      "Dados estruturados e sitemap",
      "Código-fonte documentado",
    ],
    featured: true,
    configurator: {
      kind: "features",
      basePrice: 18000,
      groups: [
        {
          id: "paginas",
          title: "Número de páginas",
          type: "single",
          options: [
            { id: "ate-3", label: "Até 3 páginas", priceDelta: 0 },
            { id: "ate-6", label: "Até 6 páginas", priceDelta: 30000 },
            { id: "ate-12", label: "Até 12 páginas", priceDelta: 60000 },
          ],
        },
        {
          id: "design",
          title: "Design",
          type: "single",
          options: [
            { id: "template", label: "Template adaptado à marca", priceDelta: 0 },
            { id: "original", label: "Design 100% original", priceDelta: 25000 },
          ],
        },
        {
          id: "extras",
          title: "Extras",
          type: "multi",
          options: [
            { id: "blog", label: "Blog / Notícias", priceDelta: 10000 },
            { id: "multilingue", label: "Versão multilingue", priceDelta: 15000 },
            { id: "catalogo", label: "Catálogo simples (sem pagamento)", priceDelta: 14000 },
            { id: "seo", label: "SEO técnico avançado", priceDelta: 8000 },
            { id: "crm", label: "Integração CRM / Newsletter", priceDelta: 7000 },
            { id: "cms", label: "Gestão de conteúdo avançada (CMS)", priceDelta: 13000 },
            { id: "expresso", label: "Prazo expresso", priceDelta: 10000 },
          ],
        },
      ],
    },
  },
  {
    id: "web-loja",
    slug: "loja-virtual",
    name: "Loja Virtual",
    pillar: "desenvolvimento-web",
    summary: "E-commerce completo, do catálogo à fatura.",
    description:
      "Loja com catálogo, carrinho e checkout seguro. Escolha a dimensão do catálogo e os extras — o preço ajusta-se em tempo real ao que a loja precisa mesmo.",
    priceRange: { min: 32000, max: 320000 },
    billing: "one-time",
    deliveryDays: 35,
    features: [
      "Pagamentos por cartão, PayPal, Apple Pay e Google Pay",
      "Contas de cliente e histórico de encomendas",
      "E-mails transacionais automáticos",
      "Painel de administração",
    ],
    configurator: {
      kind: "features",
      basePrice: 32000,
      groups: [
        {
          id: "catalogo",
          title: "Dimensão do catálogo",
          type: "single",
          options: [
            { id: "ate-20", label: "Até 20 produtos", priceDelta: 0 },
            { id: "ate-100", label: "Até 100 produtos", priceDelta: 50000 },
            { id: "ilimitado", label: "Catálogo ilimitado", priceDelta: 100000 },
          ],
        },
        {
          id: "design",
          title: "Design",
          type: "single",
          options: [
            { id: "template", label: "Template de loja adaptado", priceDelta: 0 },
            { id: "original", label: "Design 100% original", priceDelta: 40000 },
          ],
        },
        {
          id: "extras",
          title: "Extras",
          type: "multi",
          options: [
            { id: "pagamentos", label: "Métodos de pagamento adicionais", priceDelta: 15000 },
            { id: "stock", label: "Gestão de stock avançada", priceDelta: 20000 },
            { id: "logistica", label: "Integração logística/transportadoras", priceDelta: 25000 },
            { id: "multilingue", label: "Multilingue e multi-moeda", priceDelta: 25000 },
            { id: "fidelizacao", label: "Cupões e fidelização", priceDelta: 15000 },
            { id: "marketplace", label: "Marketplace multi-vendedor", priceDelta: 35000 },
            { id: "expresso", label: "Prazo expresso", priceDelta: 13000 },
          ],
        },
      ],
    },
  },
  // ── Inteligência Artificial ───────────────────────────────────────────
  {
    id: "ia-chatbot",
    slug: "chatbot-atendimento-ia",
    name: "Chatbot de Atendimento com IA",
    pillar: "inteligencia-artificial",
    summary: "Atendimento 24/7 treinado no conhecimento da sua empresa.",
    description:
      "Assistente que responde a clientes com base na sua documentação real. Escolha os canais e a inteligência — o preço ajusta-se em tempo real.",
    priceRange: { min: 6500, max: 65000 },
    billing: "one-time",
    deliveryDays: 14,
    features: [
      "Escalonamento para atendimento humano",
      "Histórico e análise de conversas",
      "30 dias de afinação incluídos",
    ],
    featured: true,
    configurator: {
      kind: "features",
      basePrice: 6500,
      groups: [
        {
          id: "canais",
          title: "Canais",
          type: "single",
          options: [
            { id: "site", label: "Apenas site (widget)", priceDelta: 0 },
            { id: "site-whatsapp", label: "Site + WhatsApp", priceDelta: 15000 },
            {
              id: "site-whatsapp-social",
              label: "Site + WhatsApp + Instagram/Messenger",
              priceDelta: 25000,
            },
          ],
        },
        {
          id: "inteligencia",
          title: "Inteligência",
          type: "single",
          options: [
            { id: "guiao", label: "Respostas baseadas em guião fixo", priceDelta: 0 },
            {
              id: "rag",
              label: "Treino sobre os seus documentos (RAG)",
              priceDelta: 12000,
            },
          ],
        },
        {
          id: "extras",
          title: "Extras",
          type: "multi",
          options: [
            { id: "escalonamento", label: "Escalonamento para atendimento humano", priceDelta: 4000 },
            { id: "multilingue", label: "Multilingue", priceDelta: 5000 },
            { id: "crm", label: "Integração CRM/ERP", priceDelta: 5000 },
            { id: "analitica", label: "Analítica avançada de conversas", priceDelta: 3500 },
            { id: "voz", label: "Voz/áudio (respostas faladas)", priceDelta: 4000 },
          ],
        },
      ],
    },
  },
  {
    id: "ia-chatbot-manutencao",
    slug: "manutencao-chatbot-ia",
    name: "Manutenção Mensal — Chatbot de Atendimento com IA",
    pillar: "inteligencia-artificial",
    summary: "Afinação contínua do chatbot e monitorização de conversas.",
    description:
      "Plano mensal de manutenção do chatbot: revisão de conversas, afinação do treino e monitorização de disponibilidade.",
    priceRange: { min: 1400, max: 1400 },
    billing: "monthly",
    deliveryDays: 1,
    features: ["Revisão mensal de conversas", "Afinação contínua do treino", "Monitorização de disponibilidade"],
    configurator: {
      kind: "tier",
      levels: [
        {
          label: "Mensalidade",
          description: "Revisão de conversas, afinação do treino e monitorização.",
          price: 1400,
        },
      ],
    },
  },
  {
    id: "ia-automacao",
    slug: "automacao-de-processos",
    name: "Automação de Processos",
    pillar: "inteligencia-artificial",
    summary: "Elimine o trabalho manual que consome a sua equipa.",
    description:
      "Mapeamos um processo repetitivo do seu negócio e automatizamo-lo de ponta a ponta, ligando as ferramentas que já usa. Inclui painel de acompanhamento e plano de contingência.",
    priceRange: { min: 69000, max: 69000 },
    billing: "one-time",
    deliveryDays: 14,
    features: [
      "Mapeamento e desenho do fluxo",
      "Integração com as suas ferramentas",
      "Painel de execuções e alertas",
      "Documentação e formação",
    ],
    configurator: {
      kind: "tier",
      levels: [
        {
          label: "Pacote único",
          description: "Mapeamento, integração, painel de execuções e formação da equipa.",
          price: 69000,
        },
      ],
    },
  },
  {
    id: "ia-agente",
    slug: "agente-de-ia-a-medida",
    name: "Agente de IA à Medida",
    pillar: "inteligencia-artificial",
    summary: "Um agente que executa, não apenas responde.",
    description:
      "Agentes autónomos que consultam os seus dados, decidem e executam ações nos seus sistemas dentro de limites definidos. Âmbito e integrações desenhados em conjunto — sempre por orçamento, dada a variedade de sistemas envolvidos.",
    priceRange: null,
    billing: "one-time",
    deliveryDays: 30,
    features: [
      "Acesso controlado aos seus sistemas",
      "Limites e aprovação humana configuráveis",
      "Registo auditável de cada ação",
      "Monitorização de custo por execução",
    ],
    configurator: null,
  },

  // ── Marketing Digital ─────────────────────────────────────────────────
  {
    id: "mkt-trafego",
    slug: "gestao-de-trafego-pago",
    name: "Gestão de Tráfego Pago",
    pillar: "marketing-digital",
    summary: "Meta, Google e TikTok Ads geridos com foco no custo por aquisição.",
    description:
      "Gestão mensal das suas campanhas pagas, com relatório quinzenal do que mudou e porquê. O investimento em anúncios é pago diretamente às plataformas — escolha o nível de gestão.",
    priceRange: { min: 7500, max: 75000 },
    billing: "monthly",
    deliveryDays: 5,
    features: [
      "Configuração de pixels e conversões",
      "Testes A/B contínuos",
      "Reunião mensal de estratégia",
    ],
    featured: true,
    configurator: {
      kind: "tier",
      levels: [
        {
          label: "Arranque",
          description: "1 plataforma, orçamento gerido até 500 €/mês.",
          price: 7500,
        },
        {
          label: "Base",
          description: "1 a 2 plataformas, orçamento gerido até 1 500 €/mês.",
          price: 18000,
        },
        {
          label: "Crescimento",
          description: "2 a 3 plataformas, orçamento gerido até 4 000 €/mês.",
          price: 35000,
        },
        {
          label: "Escala",
          description: "3 plataformas + criativos incluídos, orçamento gerido até 10 000 €/mês.",
          price: 55000,
        },
        {
          label: "Performance Avançada",
          description: "Todas as plataformas, testes contínuos e relatórios semanais.",
          price: 75000,
        },
      ],
    },
  },
  {
    id: "mkt-criativos",
    slug: "pack-criativos-de-marketing",
    name: "Pack de Criativos de Marketing",
    pillar: "marketing-digital",
    summary: "Peças prontas a testar, em formatos nativos.",
    description:
      "Criativos estáticos e animados versionados para teste sistemático, entregues nos formatos e rácios de cada rede social. Escolha o tamanho do pack.",
    priceRange: { min: 2000, max: 20000 },
    billing: "one-time",
    deliveryDays: 10,
    features: [
      "Versões estáticas e animadas",
      "Ficheiros editáveis incluídos",
      "Duas rondas de revisão",
    ],
    configurator: {
      kind: "tier",
      quantityLabel: "packs",
      levels: [
        { label: "Pack Mini", description: "5 peças estáticas.", price: 2000 },
        { label: "Pack Standard", description: "10 peças estáticas.", price: 7000 },
        { label: "Pack Plus", description: "10 peças estáticas + 3 animadas.", price: 12000 },
        {
          label: "Pack Pro",
          description: "20 peças, estáticas e animadas.",
          price: 16500,
        },
        {
          label: "Pack Premium",
          description: "30 peças + ficheiros editáveis originais.",
          price: 20000,
        },
      ],
    },
  },
  {
    id: "mkt-spot",
    slug: "spot-publicitario",
    name: "Spot Publicitário",
    pillar: "marketing-digital",
    summary: "Do guião à masterização.",
    description:
      "Spot para rádio ou digital com guião, locução profissional e masterização, nos formatos exigidos pelas estações e plataformas. Escolha a duração e a produção.",
    priceRange: { min: 1200, max: 12000 },
    billing: "one-time",
    deliveryDays: 7,
    features: [
      "Guião e direção criativa",
      "Locução profissional incluída",
      "Masterização para rádio e digital",
    ],
    configurator: {
      kind: "tier",
      levels: [
        { label: "Essencial", description: "Até 15 segundos, guião simples.", price: 1200 },
        { label: "Standard", description: "Até 30 segundos.", price: 3500 },
        {
          label: "Com sonoplastia",
          description: "Até 30 segundos, com sonoplastia e música licenciada.",
          price: 6000,
        },
        {
          label: "Produção completa",
          description: "Até 60 segundos, produção completa.",
          price: 9000,
        },
        {
          label: "Campanha",
          description: "3 variações + masterização premium.",
          price: 12000,
        },
      ],
    },
  },
  {
    id: "mkt-video",
    slug: "video-promocional",
    name: "Vídeo Promocional",
    pillar: "marketing-digital",
    summary: "Feito para prender nos primeiros três segundos.",
    description:
      "Vídeo para redes sociais e campanhas, com guião, edição e legendas queimadas. Escolha a duração e o nível de produção.",
    priceRange: { min: 3500, max: 35000 },
    billing: "one-time",
    deliveryDays: 12,
    features: [
      "Versões 9:16, 1:1 e 16:9",
      "Legendas incorporadas",
      "Locução ou música à escolha",
    ],
    configurator: {
      kind: "tier",
      levels: [
        { label: "Essencial", description: "Até 15 segundos, edição simples.", price: 3500 },
        { label: "Básico", description: "Até 30 segundos, motion básico.", price: 12000 },
        {
          label: "Standard",
          description: "Até 60 segundos, edição completa.",
          price: 20000,
        },
        {
          label: "Avançado",
          description: "Até 90 segundos, com animações e legendas.",
          price: 27000,
        },
        {
          label: "Premium",
          description: "Multi-formato (9:16, 1:1, 16:9) + revisões ilimitadas.",
          price: 35000,
        },
      ],
    },
  },

  // ── Locução & Narração ────────────────────────────────────────────────
  {
    id: "voz-institucional",
    slug: "locucao-institucional",
    name: "Locução Institucional",
    pillar: "locucao-narracao",
    summary: "Narração corporativa, masterizada.",
    description:
      "Locução para vídeo institucional, apresentação ou campanha, gravada em estúdio e entregue pronta a montar. Escolha a duração do áudio final.",
    priceRange: { min: 700, max: 7000 },
    billing: "one-time",
    deliveryDays: 3,
    features: [
      "Português europeu ou do Brasil",
      "WAV e MP3 masterizados",
      "Duas rondas de revisão",
    ],
    configurator: {
      kind: "tier",
      levels: [
        { label: "Até 30 segundos", description: "Locução curta, uma só tomada.", price: 700 },
        { label: "Até 1 minuto", description: "Ideal para spots e chamadas.", price: 1800 },
        { label: "Até 3 minutos", description: "Vídeo institucional ou apresentação.", price: 3200 },
        { label: "Até 5 minutos", description: "Conteúdo mais longo, com pausas dirigidas.", price: 5000 },
        {
          label: "Até 10 minutos",
          description: "Com direção de voz dedicada.",
          price: 7000,
        },
      ],
    },
  },
  {
    id: "voz-audiobook",
    slug: "narracao-de-audiobook",
    name: "Narração de Audiobook",
    pillar: "locucao-narracao",
    summary: "Preço por hora de áudio final, com revisão incluída.",
    description:
      "Gravação de obras completas com direção de leitura e entrega nos formatos exigidos pelas plataformas. Escolha o tipo de voz — o preço é por hora de áudio final.",
    priceRange: { min: 1500, max: 15000 },
    billing: "one-time",
    deliveryDays: 15,
    features: [
      "Direção de leitura e revisão",
      "Formatos das principais plataformas",
      "Correções pontuais sem custo",
    ],
    configurator: {
      kind: "tier",
      quantityLabel: "horas",
      levels: [
        { label: "Voz Standard", description: "Leitura direta, sem direção adicional.", price: 1500 },
        {
          label: "Voz Standard + Direção",
          description: "Leitura com direção de tom e ritmo.",
          price: 4000,
        },
        {
          label: "Voz Caracterizada",
          description: "Múltiplos personagens, vozes distintas.",
          price: 8000,
        },
        {
          label: "Voz Premium",
          description: "Voz premium + masterização avançada.",
          price: 12000,
        },
        {
          label: "Clonagem de Voz",
          description: "Clonagem da voz do autor ou narrador escolhido.",
          price: 15000,
        },
      ],
    },
  },
  {
    id: "voz-elearning",
    slug: "pack-e-learning",
    name: "Pack E-learning",
    pillar: "locucao-narracao",
    summary: "Narração modular para cursos online, até 30 minutos.",
    description:
      "Locução dividida por módulos, com marcações de tempo para sincronizar com slides e legendas. Pensado para cursos e formação interna.",
    priceRange: { min: 48000, max: 48000 },
    billing: "one-time",
    deliveryDays: 10,
    features: [
      "Até 30 minutos de áudio final",
      "Ficheiros separados por módulo",
      "Marcações de tempo para sincronização",
      "Guião de legendas incluído",
    ],
    configurator: {
      kind: "tier",
      levels: [
        {
          label: "Pacote único",
          description: "Até 30 minutos, narração modular com marcações de tempo.",
          price: 48000,
        },
      ],
    },
  },
  {
    id: "voz-clonagem",
    slug: "clonagem-de-voz",
    name: "Clonagem de Voz",
    pillar: "locucao-narracao",
    summary: "A sua voz, disponível para produzir à escala.",
    description:
      "Réplica autorizada da sua voz para gerar conteúdo em volume, com consentimento formal e registo de utilizações.",
    priceRange: { min: 35000, max: 35000 },
    billing: "one-time",
    deliveryDays: 14,
    features: [
      "Sessão de captura em estúdio",
      "Consentimento e licença por escrito",
      "Registo auditável de utilizações",
      "Revogação a pedido",
    ],
    configurator: {
      kind: "tier",
      levels: [
        {
          label: "Pacote único",
          description: "Sessão de captura, licença e registo de utilizações.",
          price: 35000,
        },
      ],
    },
  },
] as const;

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

// ── Formatação de preços ────────────────────────────────────────────────

/** Formata cêntimos como moeda: 129000 → "1 290,00 €". */
export function formatPrice(cents: number, currency: string = siteConfig.currency): string {
  return new Intl.NumberFormat(siteConfig.language, {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** Formata uma faixa: min===max devolve um só valor, senão "80 € – 800 €". */
export function formatPriceRange(range: PriceRange): string {
  if (range.min === range.max) return formatPrice(range.min);
  return `${formatPrice(range.min)} – ${formatPrice(range.max)}`;
}

/**
 * Câmbio de referência para o preço equivalente em Kwanzas mostrado ao lado do
 * preço em euros. A Digital Lens fatura sempre em EUR via Paddle (o AOA não
 * está entre as moedas de apresentação suportadas) — este valor é puramente
 * informativo, para o cliente em Angola ter uma ordem de grandeza sem ter de
 * converter de cabeça.
 *
 * Cotação de referência, média de mercado a 06/09/2026: 1 EUR ≈ 1065 AOA.
 * Não há atualização automática — rever este número quando o câmbio se
 * afastar muito do valor real.
 */
const EUR_TO_AOA_RATE = 1065;

/** Desconto aplicado ao câmbio de mercado no preço em Kwanzas exibido. */
const KWANZA_LOCAL_DISCOUNT = 0.6;

function toKwanza(cents: number): number {
  const eur = cents / 100;
  return eur * EUR_TO_AOA_RATE * KWANZA_LOCAL_DISCOUNT;
}

/** Preço em Kwanzas a 60% do câmbio de mercado do dia: 129000 → "823 770 Kz". */
export function formatKwanzaEquivalent(cents: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(toKwanza(cents));
}

/** Faixa em Kwanzas: min===max devolve um só valor, senão "51 120 – 511 200 Kz". */
export function formatKwanzaRange(range: PriceRange): string {
  if (range.min === range.max) return formatKwanzaEquivalent(range.min);
  return `${formatKwanzaEquivalent(range.min)} – ${formatKwanzaEquivalent(range.max)}`;
}

import {
  Code2,
  BrainCircuit,
  Megaphone,
  Mic2,
  type LucideIcon,
} from "lucide-react";

/**
 * Catálogo institucional de serviços.
 *
 * Quatro pilares, cada um com os serviços concretos vendidos. É esta estrutura
 * que alimenta a homepage, as páginas `/servicos` e `/servicos/[slug]`, o
 * sitemap, o JSON-LD e o menu de navegação — não duplicar as listas noutro sítio.
 */

export type ServiceItem = {
  title: string;
  description: string;
};

export type ServicePillar = {
  slug: string;
  title: string;
  /** Frase curta usada em cards e no menu */
  tagline: string;
  /** Parágrafo de abertura da página dedicada */
  description: string;
  icon: LucideIcon;
  /** Par de cores (from → to) do gradiente da lente atribuído ao pilar */
  gradient: readonly [string, string];
  items: readonly ServiceItem[];
  /** O que o cliente recebe no fim — usado na página dedicada */
  deliverables: readonly string[];
};

export const SERVICE_PILLARS: readonly ServicePillar[] = [
  {
    slug: "desenvolvimento-web",
    title: "Desenvolvimento Web",
    tagline: "Interfaces rápidas, seguras e feitas para converter.",
    description:
      "Construímos produtos web sobre stacks modernas — Next.js, TypeScript e infraestrutura serverless — com foco em velocidade de carregamento, acessibilidade e taxa de conversão. Do primeiro wireframe ao deploy contínuo.",
    icon: Code2,
    gradient: ["#2563eb", "#4d8dff"],
    items: [
      {
        title: "Landing pages",
        description:
          "Páginas de alta conversão para campanhas e lançamentos, com testes A/B e analítica desde o primeiro dia.",
      },
      {
        title: "Sites institucionais",
        description:
          "A presença oficial da sua marca: estrutura clara, SEO técnico sólido e gestão de conteúdo autónoma.",
      },
      {
        title: "Lojas virtuais",
        description:
          "E-commerce completo com catálogo, carrinho, pagamentos, faturação e integração logística.",
      },
      {
        title: "Plataformas de negociação financeira",
        description:
          "Dashboards de trading, gráficos em tempo real e integração com APIs de corretoras — incluindo a Deriv.",
      },
      {
        title: "Blogs",
        description:
          "Motores editoriais optimizados para pesquisa orgânica, com fluxo de publicação simples para a sua equipa.",
      },
      {
        title: "Sites de notícias",
        description:
          "Arquitetura preparada para volume: cache em camadas, feeds, categorias e leitura instantânea em mobile.",
      },
    ],
    deliverables: [
      "Design responsivo e acessível (WCAG AA)",
      "Código-fonte entregue e documentado",
      "SEO técnico, sitemap e dados estruturados",
      "Deploy, domínio e monitorização configurados",
    ],
  },
  {
    slug: "inteligencia-artificial",
    title: "Inteligência Artificial",
    tagline: "Automação que devolve horas à sua equipa.",
    description:
      "Aplicamos IA onde ela gera retorno mensurável: processos repetitivos automatizados, conteúdo produzido à escala e agentes que executam tarefas reais em vez de apenas responderem a perguntas.",
    icon: BrainCircuit,
    gradient: ["#6d28d9", "#a855f7"],
    items: [
      {
        title: "Automação de tarefas",
        description:
          "Fluxos que ligam as suas ferramentas e eliminam trabalho manual repetitivo, com registo e supervisão humana.",
      },
      {
        title: "Produção de conteúdo com IA",
        description:
          "Artigos, legendas, descrições e criativos gerados à escala — sempre revistos e alinhados com a sua voz de marca.",
      },
      {
        title: "Agentes de IA",
        description:
          "Agentes autónomos que consultam dados, decidem e executam ações nos seus sistemas com limites definidos.",
      },
      {
        title: "Assistentes de IA",
        description:
          "Copilotos internos treinados na documentação da empresa, para acelerar equipas de vendas, suporte e operações.",
      },
      {
        title: "Chatbots de atendimento com IA",
        description:
          "Atendimento 24/7 em site, WhatsApp e redes sociais, com escalonamento para humano quando faz sentido.",
      },
    ],
    deliverables: [
      "Mapeamento dos processos e do retorno esperado",
      "Integração com as ferramentas que já usa",
      "Painel de monitorização e custos por execução",
      "Formação da equipa e manual de operação",
    ],
  },
  {
    slug: "marketing-digital",
    title: "Marketing Digital",
    tagline: "Campanhas medidas ao cêntimo, não à sensação.",
    description:
      "Estratégia, criação e gestão de campanhas com atribuição clara: cada euro investido tem origem, percurso e resultado rastreáveis. Criativos produzidos em casa, sem depender de terceiros.",
    icon: Megaphone,
    gradient: ["#b31fa6", "#ef4fc4"],
    items: [
      {
        title: "Campanhas de Marketing",
        description:
          "Do posicionamento ao calendário de execução, com metas, orçamento e indicadores definidos à partida.",
      },
      {
        title: "Tráfego pago",
        description:
          "Gestão de Meta Ads, Google Ads e TikTok Ads com otimização contínua de custo por aquisição.",
      },
      {
        title: "Spots publicitários",
        description:
          "Peças para rádio e digital, do guião à masterização — com locução profissional incluída.",
      },
      {
        title: "Vídeos promocionais",
        description:
          "Vídeos curtos para redes sociais e campanhas, pensados para os primeiros três segundos.",
      },
      {
        title: "Criativos de marketing",
        description:
          "Bibliotecas de anúncios estáticos e animados, versionados para testes sistemáticos.",
      },
    ],
    deliverables: [
      "Plano de campanha com metas e orçamento",
      "Pixels, eventos e conversões configurados",
      "Relatório de desempenho quinzenal",
      "Banco de criativos em formatos nativos de cada rede",
    ],
  },
  {
    slug: "locucao-narracao",
    title: "Locução & Narração",
    tagline: "A voz certa para cada mensagem.",
    description:
      "Locução profissional em português europeu e do Brasil, gravada em estúdio e entregue masterizada. Para quando o volume exige, clonagem de voz autorizada com controlo total sobre o uso.",
    icon: Mic2,
    gradient: ["#1d4ed8", "#d426c4"],
    items: [
      {
        title: "Vídeos institucionais",
        description:
          "Narração corporativa com tom, ritmo e pronúncia alinhados à identidade da marca.",
      },
      {
        title: "Narração de audiobooks",
        description:
          "Gravação de obras completas com direção de leitura, revisão e entrega nos formatos das plataformas.",
      },
      {
        title: "Treinamento",
        description:
          "Locução para conteúdos de formação interna, manuais em áudio e onboarding de equipas.",
      },
      {
        title: "Clonagem de voz",
        description:
          "Réplica autorizada da sua voz para produzir conteúdo à escala, com consentimento e uso auditável.",
      },
      {
        title: "E-learning (cursos online)",
        description:
          "Narração modular para cursos, sincronizada com slides e legendas em múltiplos idiomas.",
      },
      {
        title: "Locução radiofónica",
        description:
          "Spots, vinhetas e chamadas com a energia e a cadência próprias da rádio.",
      },
    ],
    deliverables: [
      "Áudio masterizado em WAV e MP3",
      "Duas rondas de revisão incluídas",
      "Licença de utilização definida por escrito",
      "Entrega com marcações de tempo para sincronização",
    ],
  },
] as const;

/** Procura um pilar pelo seu slug de URL. */
export function getPillar(slug: string): ServicePillar | undefined {
  return SERVICE_PILLARS.find((pillar) => pillar.slug === slug);
}

/** Todos os slugs — usado em `generateStaticParams` e no sitemap. */
export const SERVICE_SLUGS = SERVICE_PILLARS.map((pillar) => pillar.slug);

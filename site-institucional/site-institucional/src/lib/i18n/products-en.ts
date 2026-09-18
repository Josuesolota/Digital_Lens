/**
 * Traduções EN do catálogo de produtos — mapeadas por `id`, nunca duplicando
 * `PRODUCTS` por inteiro. `localizeProduct()` (em `localize.ts`) funde isto
 * por cima do produto original; preços, ids, slugs e `priceDelta` nunca
 * mudam entre idiomas — só rótulos e texto.
 *
 * `groups`/`options` são chaveados pelos mesmos `id` do configurador em
 * `src/lib/products.ts`. `levels` (configurador por nível) segue a mesma
 * ordem e comprimento do original — fundido por índice.
 */

export type ProductTranslation = {
  name: string;
  summary: string;
  description: string;
  features: readonly string[];
  groups?: Record<string, { title: string; options: Record<string, string> }>;
  levels?: readonly { label: string; description: string }[];
  quantityLabel?: string;
};

export const PRODUCTS_EN: Record<string, ProductTranslation> = {
  // ── Web Development ─────────────────────────────────────────────────
  "web-landing": {
    name: "Essential Landing Page",
    summary: "One page, one goal: turn visitors into leads.",
    description:
      "High-conversion page with benefit-driven copy, integrated form and configured analytics. Choose the scope and extras — the price adjusts in real time.",
    features: [
      "Contact form linked to your email",
      "Technical SEO and Open Graph",
      "Analytics and conversion events",
      "Deployment and domain configured",
    ],
    groups: {
      ambito: {
        title: "Scope",
        options: {
          "1-pagina": "1 page",
          "ate-3-paginas": "Up to 3 pages",
          "multi-seccao": "Multi-section (5+ blocks)",
        },
      },
      design: {
        title: "Design",
        options: {
          template: "Template adapted to your brand",
          original: "100% original design",
        },
      },
      extras: {
        title: "Extras",
        options: {
          crm: "Advanced form with CRM",
          animacoes: "Animations and microinteractions",
          copywriting: "Professional copywriting",
          seo: "Advanced SEO + structured data",
          multilingue: "Multilingual version",
          "ab-testing": "A/B testing",
          expresso: "Express turnaround (< 72h)",
        },
      },
    },
  },
  "web-institucional": {
    name: "Institutional Website",
    summary: "Your brand's official presence, built to last.",
    description:
      "Editable structure and top-of-Lighthouse performance. Choose the number of pages and extras — the price adjusts in real time to the project's actual scope.",
    features: [
      "Autonomous content management",
      "WCAG AA accessibility",
      "Structured data and sitemap",
      "Documented source code",
    ],
    groups: {
      paginas: {
        title: "Number of pages",
        options: {
          "ate-3": "Up to 3 pages",
          "ate-6": "Up to 6 pages",
          "ate-12": "Up to 12 pages",
        },
      },
      design: {
        title: "Design",
        options: {
          template: "Template adapted to your brand",
          original: "100% original design",
        },
      },
      extras: {
        title: "Extras",
        options: {
          blog: "Blog / News",
          multilingue: "Multilingual version",
          catalogo: "Simple catalog (no payment)",
          seo: "Advanced technical SEO",
          crm: "CRM / Newsletter integration",
          cms: "Advanced content management (CMS)",
          expresso: "Express turnaround",
        },
      },
    },
  },
  "web-loja": {
    name: "Online Store",
    summary: "Complete e-commerce, from catalog to invoice.",
    description:
      "Store with catalog, cart and secure checkout. Choose the catalog size and extras — the price adjusts in real time to what the store actually needs.",
    features: [
      "Card, PayPal, Apple Pay and Google Pay payments",
      "Customer accounts and order history",
      "Automatic transactional emails",
      "Admin panel",
    ],
    groups: {
      catalogo: {
        title: "Catalog size",
        options: {
          "ate-20": "Up to 20 products",
          "ate-100": "Up to 100 products",
          ilimitado: "Unlimited catalog",
        },
      },
      design: {
        title: "Design",
        options: {
          template: "Adapted store template",
          original: "100% original design",
        },
      },
      extras: {
        title: "Extras",
        options: {
          pagamentos: "Additional payment methods",
          stock: "Advanced inventory management",
          logistica: "Logistics/carrier integration",
          multilingue: "Multilingual and multi-currency",
          fidelizacao: "Coupons and loyalty",
          marketplace: "Multi-vendor marketplace",
          expresso: "Express turnaround",
        },
      },
    },
  },
  "web-trading": {
    name: "Financial Trading Platform",
    summary: "Trading dashboards with real-time data.",
    description:
      "Platforms connected to broker APIs — including Deriv — with real-time charts and strategy automation. Choose the integration complexity; projects above the top of the range always go through a custom quote.",
    features: [
      "Broker API integration (e.g., Deriv)",
      "Real-time charts and quotes",
      "Risk management and per-account limits",
    ],
    groups: {
      integracao: {
        title: "Integrated brokers",
        options: {
          uma: "1 broker (e.g., Deriv)",
          multiplas: "Multiple brokers",
        },
      },
      automacao: {
        title: "Strategy automation",
        options: {
          nenhuma: "No automation (view only)",
          basica: "Basic automation (simple rules)",
          avancada: "Advanced strategy engine",
        },
      },
      extras: {
        title: "Extras",
        options: {
          risco: "Risk management and per-account limits",
          auditoria: "Audit trail and operation logging",
          alertas: "Real-time alerts (push/SMS)",
          multiutilizador: "Multi-user panel with permissions",
          backtesting: "Historical backtesting",
          expresso: "Express turnaround",
        },
      },
    },
  },
  "web-trading-manutencao": {
    name: "Monthly Maintenance — Financial Platform",
    summary: "Monitoring, updates and ongoing support for the platform.",
    description:
      "Monthly maintenance plan for the trading platform: uptime monitoring, security updates and priority support.",
    features: ["24/7 uptime monitoring", "Security updates", "Priority support"],
    levels: [
      { label: "Basic", description: "Monitoring and security updates." },
      {
        label: "Advanced",
        description: "Basic + priority support and monthly performance report.",
      },
    ],
  },

  // ── Artificial Intelligence ───────────────────────────────────────────
  "ia-chatbot": {
    name: "AI Customer Service Chatbot",
    summary: "24/7 support trained on your company's knowledge.",
    description:
      "An assistant that responds to customers based on your real documentation. Choose the channels and intelligence level — the price adjusts in real time.",
    features: [
      "Escalation to human support",
      "Conversation history and analytics",
      "30 days of fine-tuning included",
    ],
    groups: {
      canais: {
        title: "Channels",
        options: {
          site: "Website only (widget)",
          "site-whatsapp": "Website + WhatsApp",
          "site-whatsapp-social": "Website + WhatsApp + Instagram/Messenger",
        },
      },
      inteligencia: {
        title: "Intelligence",
        options: {
          guiao: "Fixed-script responses",
          rag: "Trained on your documents (RAG)",
        },
      },
      extras: {
        title: "Extras",
        options: {
          escalonamento: "Escalation to human support",
          multilingue: "Multilingual",
          crm: "CRM/ERP integration",
          analitica: "Advanced conversation analytics",
          voz: "Voice/audio (spoken responses)",
        },
      },
    },
  },
  "ia-chatbot-manutencao": {
    name: "Monthly Maintenance — AI Customer Service Chatbot",
    summary: "Ongoing chatbot fine-tuning and conversation monitoring.",
    description:
      "Monthly chatbot maintenance plan: conversation review, training fine-tuning and availability monitoring.",
    features: ["Monthly conversation review", "Ongoing training fine-tuning", "Availability monitoring"],
    levels: [
      {
        label: "Monthly fee",
        description: "Conversation review, training fine-tuning and monitoring.",
      },
    ],
  },
  "ia-automacao": {
    name: "Process Automation",
    summary: "Eliminate the manual work draining your team.",
    description:
      "We map a repetitive process in your business and automate it end-to-end, connecting the tools you already use. Includes a monitoring dashboard and a contingency plan.",
    features: [
      "Process mapping and flow design",
      "Integration with your tools",
      "Execution dashboard and alerts",
      "Documentation and training",
    ],
    levels: [
      {
        label: "Single package",
        description: "Mapping, integration, execution dashboard and team training.",
      },
    ],
  },
  "ia-conteudo": {
    name: "AI Content Production",
    summary: "Content at scale, in your brand voice.",
    description:
      "Monthly AI-assisted production package, always reviewed by a human editor before publishing. Choose the monthly volume and extras.",
    features: ["Always reviewed by a human editor", "Brand voice guide", "Monthly editorial calendar"],
    groups: {
      volume: {
        title: "Monthly volume",
        options: {
          "4-artigos": "4 articles/month",
          "8-artigos": "8 articles/month",
          "16-artigos": "16 articles/month",
          "30-artigos": "30 articles/month (daily production)",
        },
      },
      extras: {
        title: "Extras",
        options: {
          legendas: "Social media captions",
          descricoes: "Product descriptions (up to 50)",
          revisao: "Premium editorial review",
          idiomas: "Additional languages (PT-BR, EN)",
          "voz-marca": "Custom brand voice guide",
        },
      },
    },
  },
  "ia-agente": {
    name: "Custom AI Agent",
    summary: "An agent that acts, not just answers.",
    description:
      "Autonomous agents that query your data, decide and take action within your systems, inside defined limits. Scope and integrations designed together — always by custom quote, given the range of systems involved.",
    features: [
      "Controlled access to your systems",
      "Configurable limits and human approval",
      "Auditable log of every action",
      "Cost-per-run monitoring",
    ],
  },

  // ── Digital Marketing ─────────────────────────────────────────────────
  "mkt-trafego": {
    name: "Paid Traffic Management",
    summary: "Meta, Google and TikTok Ads managed with a focus on cost per acquisition.",
    description:
      "Monthly management of your paid campaigns, with a biweekly report on what changed and why. Ad spend is paid directly to the platforms — choose your management tier.",
    features: ["Pixel and conversion setup", "Continuous A/B testing", "Monthly strategy meeting"],
    levels: [
      { label: "Starter", description: "1 platform, budget managed up to €500/month." },
      { label: "Base", description: "1 to 2 platforms, budget managed up to €1,500/month." },
      { label: "Growth", description: "2 to 3 platforms, budget managed up to €4,000/month." },
      {
        label: "Scale",
        description: "3 platforms + creatives included, budget managed up to €10,000/month.",
      },
      {
        label: "Advanced Performance",
        description: "All platforms, continuous testing and weekly reports.",
      },
    ],
  },
  "mkt-criativos": {
    name: "Marketing Creatives Pack",
    summary: "Pieces ready to test, in native formats.",
    description:
      "Static and animated creatives versioned for systematic testing, delivered in each social network's formats and ratios. Choose the pack size.",
    features: ["Static and animated versions", "Editable files included", "Two rounds of revisions"],
    quantityLabel: "packs",
    levels: [
      { label: "Mini Pack", description: "5 static pieces." },
      { label: "Standard Pack", description: "10 static pieces." },
      { label: "Plus Pack", description: "10 static pieces + 3 animated." },
      { label: "Pro Pack", description: "20 pieces, static and animated." },
      { label: "Premium Pack", description: "30 pieces + original editable files." },
    ],
  },
  "mkt-spot": {
    name: "Advertising Spot",
    summary: "From script to mastering.",
    description:
      "Radio or digital spot with script, professional voiceover and mastering, in the formats required by stations and platforms. Choose the length and production level.",
    features: ["Script and creative direction", "Professional voiceover included", "Mastering for radio and digital"],
    levels: [
      { label: "Essential", description: "Up to 15 seconds, simple script." },
      { label: "Standard", description: "Up to 30 seconds." },
      {
        label: "With sound design",
        description: "Up to 30 seconds, with sound design and licensed music.",
      },
      { label: "Full production", description: "Up to 60 seconds, full production." },
      { label: "Campaign", description: "3 variations + premium mastering." },
    ],
  },
  "mkt-video": {
    name: "Promotional Video",
    summary: "Built to hook in the first three seconds.",
    description:
      "Video for social media and campaigns, with script, editing and burned-in subtitles. Choose the length and production level.",
    features: ["9:16, 1:1 and 16:9 versions", "Embedded subtitles", "Voiceover or music of your choice"],
    levels: [
      { label: "Essential", description: "Up to 15 seconds, simple editing." },
      { label: "Basic", description: "Up to 30 seconds, basic motion." },
      { label: "Standard", description: "Up to 60 seconds, full editing." },
      { label: "Advanced", description: "Up to 90 seconds, with animations and subtitles." },
      {
        label: "Premium",
        description: "Multi-format (9:16, 1:1, 16:9) + unlimited revisions.",
      },
    ],
  },

  // ── Voiceover & Narration ────────────────────────────────────────────
  "voz-institucional": {
    name: "Institutional Voiceover",
    summary: "Corporate narration, mastered.",
    description:
      "Voiceover for institutional video, presentation or campaign, recorded in studio and delivered ready to edit in. Choose the length of the final audio.",
    features: ["European or Brazilian Portuguese", "Mastered WAV and MP3", "Two rounds of revisions"],
    levels: [
      { label: "Up to 30 seconds", description: "Short voiceover, single take." },
      { label: "Up to 1 minute", description: "Ideal for spots and calls." },
      { label: "Up to 3 minutes", description: "Institutional video or presentation." },
      { label: "Up to 5 minutes", description: "Longer content, with directed pauses." },
      { label: "Up to 10 minutes", description: "With dedicated voice direction." },
    ],
  },
  "voz-audiobook": {
    name: "Audiobook Narration",
    summary: "Priced per hour of final audio, revisions included.",
    description:
      "Full-length recordings with reading direction and delivery in the formats required by platforms. Choose the voice type — the price is per hour of final audio.",
    features: ["Reading direction and review", "Major platform formats", "Minor corrections at no cost"],
    quantityLabel: "hours",
    levels: [
      { label: "Standard Voice", description: "Direct reading, no additional direction." },
      { label: "Standard Voice + Direction", description: "Reading with tone and pacing direction." },
      { label: "Character Voice", description: "Multiple characters, distinct voices." },
      { label: "Premium Voice", description: "Premium voice + advanced mastering." },
      { label: "Voice Cloning", description: "Cloning of the author's or chosen narrator's voice." },
    ],
  },
  "voz-elearning": {
    name: "E-learning Pack",
    summary: "Modular narration for online courses, up to 30 minutes.",
    description:
      "Voiceover split by module, with timestamps to sync with slides and subtitles. Designed for courses and internal training.",
    features: [
      "Up to 30 minutes of final audio",
      "Separate files per module",
      "Timestamps for synchronization",
      "Subtitle script included",
    ],
    levels: [
      {
        label: "Single package",
        description: "Up to 30 minutes, modular narration with timestamps.",
      },
    ],
  },
  "voz-clonagem": {
    name: "Voice Cloning",
    summary: "Your voice, available to produce at scale.",
    description:
      "Authorized replica of your voice to generate content at volume, with formal consent and usage logging.",
    features: [
      "Studio capture session",
      "Written consent and license",
      "Auditable usage log",
      "Revocation on request",
    ],
    levels: [
      {
        label: "Single package",
        description: "Capture session, license and usage log.",
      },
    ],
  },
};

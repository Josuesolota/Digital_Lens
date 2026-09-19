/**
 * Traduções EN do catálogo de serviços — mapeadas por `slug` do pilar, nunca
 * duplicando `SERVICE_PILLARS` por inteiro. `localizePillar()` (em
 * `localize.ts`) funde isto por cima do pilar original; os campos não-texto
 * (slug, icon, gradient) nunca mudam entre idiomas.
 *
 * `items` e `deliverables` têm de manter a mesma ordem e comprimento que o
 * original em `src/lib/services.ts` — são fundidos por índice.
 */

export type ServicePillarTranslation = {
  title: string;
  tagline: string;
  description: string;
  items: readonly { title: string; description: string }[];
  deliverables: readonly string[];
};

export const SERVICE_PILLARS_EN: Record<string, ServicePillarTranslation> = {
  "desenvolvimento-web": {
    title: "Web Development",
    tagline: "Fast, secure interfaces built to convert.",
    description:
      "We build web products on modern stacks — Next.js, TypeScript and serverless infrastructure — focused on load speed, accessibility and conversion rate. From the first wireframe to continuous deployment.",
    items: [
      {
        title: "Landing pages",
        description:
          "High-conversion pages for campaigns and launches, with A/B testing and analytics from day one.",
      },
      {
        title: "Institutional websites",
        description:
          "Your brand's official presence: clear structure, solid technical SEO, and autonomous content management.",
      },
      {
        title: "Online stores",
        description:
          "Complete e-commerce with catalog, cart, payments, invoicing and logistics integration.",
      },
      {
        title: "Blogs",
        description:
          "Editorial engines optimized for organic search, with a simple publishing flow for your team.",
      },
      {
        title: "News sites",
        description:
          "Architecture built for volume: layered caching, feeds, categories and instant mobile reading.",
      },
    ],
    deliverables: [
      "Responsive, accessible design (WCAG AA)",
      "Source code delivered and documented",
      "Technical SEO, sitemap and structured data",
      "Deployment, domain and monitoring configured",
    ],
  },
  "inteligencia-artificial": {
    title: "Artificial Intelligence",
    tagline: "Automation that gives your team back its time.",
    description:
      "We apply AI where it generates measurable returns: repetitive processes automated, content produced at scale, and agents that carry out real tasks instead of just answering questions.",
    items: [
      {
        title: "Task automation",
        description:
          "Flows that connect your tools and eliminate repetitive manual work, with logging and human oversight.",
      },
      {
        title: "AI agents",
        description:
          "Autonomous agents that query your data, decide and take action within your systems, inside defined limits.",
      },
      {
        title: "AI assistants",
        description:
          "Internal copilots trained on your company's documentation, to speed up sales, support and operations teams.",
      },
      {
        title: "AI customer service chatbots",
        description:
          "24/7 support on your site, WhatsApp and social media, escalating to a human when it makes sense.",
      },
    ],
    deliverables: [
      "Mapping of processes and expected return",
      "Integration with the tools you already use",
      "Monitoring dashboard and cost per run",
      "Team training and operations manual",
    ],
  },
  "marketing-digital": {
    title: "Digital Marketing",
    tagline: "Campaigns measured to the cent, not by feel.",
    description:
      "Strategy, creative production and campaign management with clear attribution: every euro invested has a traceable source, path and result. Creatives produced in-house, without relying on third parties.",
    items: [
      {
        title: "Marketing campaigns",
        description:
          "From positioning to execution calendar, with goals, budget and metrics defined from the start.",
      },
      {
        title: "Paid traffic",
        description: "Management of Meta Ads, Google Ads and TikTok Ads with continuous cost-per-acquisition optimization.",
      },
      {
        title: "Advertising spots",
        description: "Pieces for radio and digital, from script to mastering — with professional voiceover included.",
      },
      {
        title: "Promotional videos",
        description: "Short videos for social media and campaigns, built for the first three seconds.",
      },
      {
        title: "Marketing creatives",
        description: "Libraries of static and animated ads, versioned for systematic testing.",
      },
    ],
    deliverables: [
      "Campaign plan with goals and budget",
      "Pixels, events and conversions configured",
      "Biweekly performance report",
      "Creative bank in each network's native formats",
    ],
  },
  "locucao-narracao": {
    title: "Voiceover & Narration",
    tagline: "The right voice for every message.",
    description:
      "Professional voiceover in European and Brazilian Portuguese, recorded in studio and delivered mastered. When volume demands it, authorized voice cloning with full control over usage.",
    items: [
      {
        title: "Corporate videos",
        description: "Corporate narration with tone, pace and pronunciation aligned to your brand identity.",
      },
      {
        title: "Audiobook narration",
        description:
          "Full-length recordings with reading direction, review and delivery in each platform's required formats.",
      },
      {
        title: "Training",
        description: "Voiceover for internal training content, audio manuals and team onboarding.",
      },
      {
        title: "Voice cloning",
        description: "Authorized replica of your voice to produce content at scale, with consent and auditable use.",
      },
      {
        title: "E-learning (online courses)",
        description: "Modular narration for courses, synchronized with slides and subtitles in multiple languages.",
      },
      {
        title: "Radio voiceover",
        description: "Spots, jingles and calls with radio's own energy and cadence.",
      },
    ],
    deliverables: [
      "Mastered audio in WAV and MP3",
      "Two rounds of revisions included",
      "Usage license defined in writing",
      "Delivery with timestamps for synchronization",
    ],
  },
};

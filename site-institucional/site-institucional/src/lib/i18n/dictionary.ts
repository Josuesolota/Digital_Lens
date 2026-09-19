import type { Locale } from "@/lib/i18n/locale";

/**
 * Dicionário de toda a interface (não o catálogo — esse vive em
 * `services-en.ts` / `products-en.ts`, mapeado por id/slug em vez de duplicado
 * na íntegra). `pt` define a forma; `en` é forçado a bater certo por
 * `satisfies`, para nunca faltar uma chave silenciosamente.
 *
 * Textos com partes dinâmicas (nome de produto, contagem, prazo) são funções,
 * não strings — evita gambiarra de concatenação nos componentes e mantém a
 * ordem das palavras correcta em cada idioma.
 */

const pt = {
  nav: {
    services: "Serviços",
    store: "Loja",
    blog: "Blog",
    portfolio: "Portfólio",
    contact: "Contacto",
    homeAriaLabel: "Digital Lens — página inicial",
    accountAria: (name: string) => `Conta de ${name}`,
    loginAria: "Entrar na sua conta",
    startProject: "Iniciar projeto",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    servicesEyebrow: "Serviços",
    myAccount: "A minha conta",
    login: "Entrar",
  },
  footer: {
    allServices: "Todos os serviços",
    store: "Loja",
    blog: "Blog",
    portfolio: "Portfólio",
    contact: "Contacto",
    login: "Entrar",
    createAccount: "Criar conta",
    myOrders: "As minhas encomendas",
    cart: "Carrinho",
    terms: "Termos de Serviço",
    privacy: "Privacidade",
    refunds: "Reembolsos",
    tagline:
      "Desenvolvimento web, inteligência artificial, marketing digital e locução profissional — sob uma só lente.",
    localityCountry: (locality: string) => `${locality}, Angola`,
    servicesColumn: "Serviços",
    agencyColumn: "Agência",
    accountColumn: "Conta",
    rights: (year: number, legalName: string) =>
      `© ${year} ${legalName}. Todos os direitos reservados.`,
  },
  hero: {
    badge: "Agência Digital",
    statAreas: "áreas de especialidade",
    statServices: "serviços no catálogo",
    statResponse: "tempo médio de resposta",
    titleStart: "Foco onde a sua marca",
    titleHighlight: "precisa de estar.",
    description:
      "Desenvolvimento web, inteligência artificial, marketing digital e locução profissional — da estratégia à execução, sob uma só lente.",
    startProject: "Vamos conversar",
    viewStore: "Ver a loja",
  },
  servicesSection: {
    eyebrow: "O que fazemos",
    titleStart: "Quatro especialidades,",
    titleHighlight: "uma só direção.",
    description:
      "Cada área funciona isolada — mas ganha nitidez quando combinada com as outras.",
    goTo: (title: string) => `Ir para ${title}`,
    prev: "Especialidade anterior",
    next: "Especialidade seguinte",
  },
  about: {
    eyebrow: "Como trabalhamos",
    titleStart: "Clareza antes de",
    titleHighlight: "execução.",
    description: "Um método em quatro tempos que elimina surpresas — para si e para nós.",
    steps: [
      {
        title: "Diagnóstico",
        description:
          "Uma sessão para perceber o negócio, o público e o que está mesmo a travar o crescimento. Sem proposta antes de haver diagnóstico.",
      },
      {
        title: "Desenho",
        description:
          "Estratégia, arquitetura e protótipo com âmbito e prazos fechados por escrito. Aprova antes de começarmos a construir.",
      },
      {
        title: "Execução",
        description:
          "Entregas semanais visíveis num ambiente de pré-produção — acompanha o progresso sem esperar pelo fim.",
      },
      {
        title: "Medição",
        description:
          "Analítica configurada desde o primeiro dia e relatório com o que funcionou, o que não funcionou e o passo seguinte.",
      },
    ],
  },
  portfolio: {
    eyebrow: "Trabalhos",
    title: "Portfólio em construção.",
    description:
      "Os primeiros cases da Digital Lens aparecem aqui — com métricas, não apenas capturas de ecrã.",
    caseInPrep: "Case em preparação",
    comingSoon: "Em breve",
    categories: {
      web: "Desenvolvimento Web",
      ai: "Inteligência Artificial",
      marketing: "Marketing Digital",
      voice: "Locução & Narração",
    },
  },
  comingSoon: {
    eyebrow: "Em breve",
    title: "Cursos e infoprodutos Digital Lens",
    description:
      "Formações práticas e infoprodutos em seis áreas. Deixe o contacto e seja avisado em primeira mão.",
    courses: [
      "Desenvolvimento Web",
      "Inteligência Artificial aplicada",
      "Produção de Conteúdo",
      "Oratória & Retórica",
      "Marketing Digital",
      "Ebooks",
    ],
    emailLabel: "O seu e-mail",
    emailPlaceholder: "o.seu@email.com",
    submitting: "A inscrever…",
    submit: "Avisar-me",
  },
  contactSection: {
    highlightResponse: "Resposta em até 1 dia útil",
    highlightDiagnosis: "Diagnóstico inicial sem custo",
    eyebrow: "Contacto",
    titleStart: "Vamos focar o seu",
    titleHighlight: "próximo projeto.",
    description:
      "Conte-nos o essencial — objetivo, prazo e orçamento aproximado. Respondemos com um plano, não com um catálogo.",
  },
  storePreview: {
    eyebrow: "Loja",
    titleStart: "Pacotes prontos a",
    titleHighlight: "contratar hoje.",
    description:
      "Âmbito fechado, preço transparente e prazo definido. Sem reuniões para saber quanto custa.",
    viewFullCatalog: "Ver catálogo completo",
  },
  testimonials: {
    items: [
      {
        quote:
          "A equipa organizou em semanas o que outras agências não resolveram em meses.",
        name: "Cliente Digital Lens",
        role: "Retalho & Comércio",
      },
      {
        quote: "Finalmente uma agência que domina marketing e código ao mesmo tempo.",
        name: "Cliente Digital Lens",
        role: "Serviços Financeiros",
      },
    ],
  },
  cart: {
    title: "Carrinho",
    close: "Fechar",
    closeCart: "Fechar carrinho",
    cartAriaLabel: "Carrinho de compras",
    empty: "O seu carrinho está vazio.",
    emptyHeading: "O seu carrinho está vazio",
    emptyDescription: "Explore os pacotes disponíveis e comece o seu projeto hoje.",
    viewStore: "Ver a loja",
    oneTime: "Pagamento único",
    monthly: "Subscrição mensal",
    perMonth: "/ mês",
    vatNote: "IVA calculado no checkout, quando aplicável.",
    vatNoteFull:
      "IVA calculado no checkout. Serviços mensais e pagamentos únicos são finalizados em compras separadas.",
    openingPayment: "A abrir pagamento…",
    checkout: "Finalizar compra",
    viewFullCart: "Ver carrinho completo",
    continueShopping: "Continuar a comprar",
    decreaseQty: (name: string) => `Diminuir quantidade de ${name}`,
    increaseQty: (name: string) => `Aumentar quantidade de ${name}`,
    remove: (name: string) => `Remover ${name}`,
    paymentError: "Não foi possível iniciar o pagamento.",
    networkError: "Falha de rede. Verifique a ligação e tente novamente.",
    cartWithCount: (count: number) => `Carrinho com ${count} ${count === 1 ? "item" : "itens"}`,
    cartEmptyAria: "Carrinho vazio",
    summary: "Resumo",
    cancelledNotice: "Pagamento cancelado. Os itens continuam guardados no seu carrinho.",
  },
  product: {
    popular: "Popular",
    onBudget: "Sob orçamento",
    from: "desde",
    perMonth: "/ mês",
    requestQuote: "Pedir orçamento",
    viewDetails: "Ver detalhes",
    configurePrice: "Configurar preço",
  },
  purchasePanel: {
    investment: "Investimento",
    perMonth: "/ mês",
    range: (range: string) => `Faixa: ${range}. `,
    vatNote: "IVA à taxa legal em vigor, calculado no checkout.",
    level: "Nível",
    quantity: (label: string) => `Quantidade (${label})`,
    decreaseQty: "Diminuir quantidade",
    increaseQty: "Aumentar quantidade",
    deliveryTime: (days: number) => `Entrega típica em ${days} dias úteis`,
    units: "unidades",
  },
  addToCart: {
    add: "Adicionar ao carrinho",
    added: "Adicionado",
  },
  auth: {
    login: {
      title: "Entrar na sua conta",
      subtitle: "Acompanhe encomendas, faturas e o estado dos seus projetos.",
      submit: "Entrar",
      submitting: "A entrar…",
      footer: "Ainda não tem conta?",
      footerLabel: "Criar conta",
    },
    register: {
      title: "Criar conta",
      subtitle: "Leva menos de um minuto e dá-lhe acesso à área de cliente.",
      submit: "Criar conta",
      submitting: "A criar conta…",
      footer: "Já tem conta?",
      footerLabel: "Entrar",
    },
    nameLabel: "Nome",
    emailLabel: "E-mail",
    passwordLabel: "Palavra-passe",
    passwordHint: "Mínimo 8 caracteres.",
    confirmPasswordLabel: "Confirmar palavra-passe",
  },
  contactForm: {
    messageSent: "Mensagem enviada",
    nameLabel: "Nome",
    emailLabel: "E-mail",
    subjectLabel: "Assunto",
    subjectPlaceholder: "Ex.: Site institucional para clínica",
    projectLabel: "Conte-nos sobre o projeto",
    projectPlaceholder:
      "Objetivo, prazo e orçamento aproximado ajudam-nos a responder com precisão.",
    sending: "A enviar…",
    send: "Enviar mensagem",
    privacyNote:
      "Ao enviar, concorda que a Digital Lens use estes dados apenas para responder ao seu pedido.",
  },
  theme: {
    activateDark: "Ativar tema escuro",
    activateLight: "Ativar tema claro",
  },
  locale: {
    switchToEn: "Mudar para inglês",
    switchToPt: "Mudar para português",
  },
  install: {
    ariaLabel: "Instalar a aplicação Digital Lens",
    heading: "Instalar Digital Lens",
    description: "Acesso rápido, ecrã inteiro e funciona offline.",
    install: "Instalar",
    dismiss: "Agora não",
  },
  pages: {
    servicesIndex: {
      title: "Serviços",
      metaDescription:
        "Desenvolvimento web, inteligência artificial, marketing digital e locução profissional. Conheça todos os serviços da Digital Lens.",
      eyebrow: "Serviços",
      titleStart: "Tudo o que a sua marca precisa,",
      titleHighlight: "sob uma só lente.",
      description:
        "Quatro áreas de especialidade e vinte e dois serviços concretos. Escolha um ponto de partida — nós tratamos das ligações.",
      viewDetail: "Ver detalhe",
      notFoundTitle: "Não encontrou exactamente o que procura?",
      notFoundDescription:
        "A maioria dos projetos combina mais do que uma área. Descreva o que precisa e desenhamos o âmbito consigo.",
      talkToUs: "Falar connosco",
    },
    serviceDetail: {
      allServices: "Todos os serviços",
      requestProposal: "Pedir proposta",
      viewPackages: "Ver pacotes",
      whatIncludes: "O que inclui",
      whatYouGet: "O que recebe",
      packagesOf: (title: string) => `Pacotes de ${title}`,
    },
    store: {
      title: "Loja",
      metaDescription:
        "Pacotes de desenvolvimento web, IA, marketing digital e locução com âmbito fechado, preço transparente e prazo definido.",
      eyebrow: "Loja",
      titleStart: "Serviços com preço,",
      titleHighlight: "sem reuniões para o saber.",
      description:
        "Escolha o pacote, pague online e comece esta semana. Projetos maiores continuam a ter orçamento à medida.",
      guarantees: [
        {
          title: "Pagamento seguro",
          text: "Processado pela Paddle. Nunca guardamos dados do cartão.",
        },
        {
          title: "Arranque em 48h",
          text: "Kick-off agendado até dois dias úteis após a confirmação.",
        },
        {
          title: "Âmbito fechado",
          text: "Preço e entregáveis definidos por escrito antes de começar.",
        },
      ],
    },
    productDetail: {
      backToStore: "Voltar à loja",
      whatIncluded: "O que está incluído",
      investment: "Investimento",
      onBudget: "Sob orçamento",
      budgetDescription:
        "O âmbito destes projetos varia muito. Conte-nos o que precisa e enviamos uma proposta com preço e prazo fechados.",
      requestQuote: "Pedir orçamento",
      needSomethingDifferent: "Precisa de algo diferente?",
      talkToUsLink: "Fale connosco",
      adjustScopeSuffix: "e ajustamos o âmbito.",
      alsoIn: (pillar: string) => `Também em ${pillar}`,
    },
    contactPage: {
      title: "Contacto",
      metaDescription: "Conte-nos o seu projeto. Respondemos em até 1 dia útil com um plano concreto.",
      requestPrefix: "Pedido: ",
    },
    blog: {
      title: "Blog",
      metaDescription:
        "Artigos sobre desenvolvimento web, inteligência artificial, marketing digital e locução — pela Digital Lens.",
      eyebrow: "Blog",
      titleStart: "Ideias e",
      titleHighlight: "aprendizagens.",
      description: "Notas práticas sobre os temas que trabalhamos todos os dias — sem enrolação.",
      emptyTitle: "Ainda não há artigos publicados",
      emptyDescription: "Estamos a preparar os primeiros artigos. Volte em breve.",
      readMore: "Ler artigo",
    },
    blogPost: {
      backToBlog: "Voltar ao blog",
    },
    cartPage: {
      title: "Carrinho",
      metaDescription: "Reveja os serviços seleccionados antes de finalizar a compra.",
      heading: "Carrinho",
    },
    checkoutSuccess: {
      title: "Pagamento concluído",
      heading: "Pagamento recebido",
      description:
        "Obrigado pela confiança. Vai receber o recibo por e-mail e a nossa equipa entra em contacto em até 1 dia útil para agendar o arranque.",
      order: (id: string) => `Encomenda ${id}`,
      total: "Total",
      receiptNote: "O recibo chega em minutos. Verifique também a pasta de spam.",
      myOrders: "As minhas encomendas",
      backHome: "Voltar ao início",
    },
    offlinePage: {
      title: "Sem ligação",
      heading: "Está sem ligação",
      description:
        "Não conseguimos chegar ao servidor. As páginas que já visitou continuam disponíveis; assim que a ligação voltar, tudo se actualiza sozinho.",
      backHome: "Voltar ao início",
    },
    account: {
      title: "A minha conta",
      statusPending: "Aguarda pagamento",
      statusPaid: "Pago",
      statusFailed: "Falhou",
      statusRefunded: "Reembolsado",
      areaLabel: "Área de cliente",
      hello: (name: string) => `Olá, ${name}.`,
      logout: "Terminar sessão",
      orders: "Encomendas",
      noOrders: "Ainda não há encomendas",
      noOrdersDescription: "Quando contratar um serviço, ele aparece aqui com o respetivo estado.",
      viewStore: "Ver a loja",
      needHelp: "Precisa de alterar algo numa encomenda ou pedir uma fatura?",
      talkToUs: "Falar connosco",
      dateLocale: "pt-AO",
      defaultCustomer: "cliente",
    },
    login: {
      title: "Entrar",
      metaDescription: "Aceda à sua área de cliente Digital Lens.",
    },
    register: {
      title: "Criar conta",
      metaDescription: "Crie a sua conta Digital Lens e acompanhe os seus projetos.",
    },
    notFound: {
      badge: "Erro 404",
      title: "Esta página saiu de foco.",
      description:
        "O endereço que procura não existe ou foi movido. Volte ao início ou explore os nossos serviços.",
      backHome: "Voltar ao início",
      viewServices: "Ver serviços",
      needHelp: "Precisa de ajuda? Fale connosco",
    },
  },
  actions: {
    messageSentShort: "Mensagem enviada.",
    nameRequired: "Indique o seu nome.",
    emailInvalid: "Indique um e-mail válido.",
    messageMin: "Descreva brevemente o seu projeto (mín. 10 caracteres).",
    messageMax: "A mensagem é demasiado longa (máx. 4000 caracteres).",
    reviewFields: "Reveja os campos assinalados.",
    sendFailed: (email: string) => `Não foi possível enviar. Escreva-nos directamente para ${email}.`,
    messageSentFull: "Mensagem enviada. A equipa Digital Lens responde em até 1 dia útil.",
    subscriptionRegisteredShort: "Inscrição registada.",
    subscriptionRegisteredFull: "Inscrição registada. Avisamos em primeira mão.",
  },
  authActions: {
    dbOff:
      "As contas de cliente ainda não estão activas neste ambiente. Contacte-nos e tratamos do seu pedido directamente.",
    nameRequired: "Indique o seu nome.",
    emailInvalid: "Indique um e-mail válido.",
    passwordMin: "A palavra-passe precisa de pelo menos 8 caracteres.",
    passwordMismatch: "As palavras-passe não coincidem.",
    reviewFields: "Reveja os campos assinalados.",
    accountExists: "Já existe uma conta com este e-mail.",
    emailRegistered: "E-mail já registado.",
    createAccountFailed: "Não foi possível criar a conta. Tente novamente.",
    passwordRequired: "Indique a palavra-passe.",
    loginFailed: "E-mail ou palavra-passe incorrectos.",
  },
  checkoutApi: {
    paymentsNotConfigured: "Pagamentos ainda não estão configurados. Contacte-nos para concluir o pedido.",
    invalidCart: "Carrinho inválido.",
    noItemsAvailable: "Nenhum dos itens do carrinho está disponível para compra online.",
    mixedBillingError: "Serviços mensais e pagamentos únicos têm de ser finalizados em compras separadas.",
    paymentInitFailed: "Não foi possível iniciar o pagamento. Tente novamente.",
  },
  rateLimit: {
    tooManySeconds: "Demasiados pedidos. Aguarde alguns segundos e tente novamente.",
    tooManyMinutes: (n: number) =>
      `Demasiados pedidos. Tente novamente dentro de ${n} ${n === 1 ? "minuto" : "minutos"}.`,
    tooManyHours: (n: number) =>
      `Demasiados pedidos. Tente novamente dentro de ${n} ${n === 1 ? "hora" : "horas"}.`,
  },
};

const en = {
  nav: {
    services: "Services",
    store: "Store",
    blog: "Blog",
    portfolio: "Portfolio",
    contact: "Contact",
    homeAriaLabel: "Digital Lens — homepage",
    accountAria: (name: string) => `${name}'s account`,
    loginAria: "Sign in to your account",
    startProject: "Start a project",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    servicesEyebrow: "Services",
    myAccount: "My account",
    login: "Sign in",
  },
  footer: {
    allServices: "All services",
    store: "Store",
    blog: "Blog",
    portfolio: "Portfolio",
    contact: "Contact",
    login: "Sign in",
    createAccount: "Create account",
    myOrders: "My orders",
    cart: "Cart",
    terms: "Terms of Service",
    privacy: "Privacy",
    refunds: "Refunds",
    tagline:
      "Web development, artificial intelligence, digital marketing and professional voiceover — under one lens.",
    localityCountry: (locality: string) => `${locality}, Angola`,
    servicesColumn: "Services",
    agencyColumn: "Agency",
    accountColumn: "Account",
    rights: (year: number, legalName: string) => `© ${year} ${legalName}. All rights reserved.`,
  },
  hero: {
    badge: "Digital Agency",
    statAreas: "areas of expertise",
    statServices: "services in the catalog",
    statResponse: "average response time",
    titleStart: "Focus where your brand",
    titleHighlight: "needs to be.",
    description:
      "Web development, artificial intelligence, digital marketing and professional voiceover — from strategy to execution, under one lens.",
    startProject: "Let's talk",
    viewStore: "Browse the store",
  },
  servicesSection: {
    eyebrow: "What we do",
    titleStart: "Four specialties,",
    titleHighlight: "one direction.",
    description: "Each area stands on its own — but sharpens when combined with the others.",
    goTo: (title: string) => `Go to ${title}`,
    prev: "Previous specialty",
    next: "Next specialty",
  },
  about: {
    eyebrow: "How we work",
    titleStart: "Clarity before",
    titleHighlight: "execution.",
    description: "A four-step method that removes surprises — for you and for us.",
    steps: [
      {
        title: "Diagnosis",
        description:
          "A session to understand the business, the audience and what's really holding growth back. No proposal before there's a diagnosis.",
      },
      {
        title: "Design",
        description:
          "Strategy, architecture and prototype with scope and deadlines locked in writing. You approve before we start building.",
      },
      {
        title: "Execution",
        description:
          "Visible weekly deliveries in a staging environment — track progress without waiting for the finish line.",
      },
      {
        title: "Measurement",
        description:
          "Analytics set up from day one, with a report on what worked, what didn't, and the next step.",
      },
    ],
  },
  portfolio: {
    eyebrow: "Work",
    title: "Portfolio under construction.",
    description: "Digital Lens's first cases will appear here — with metrics, not just screenshots.",
    caseInPrep: "Case in preparation",
    comingSoon: "Coming soon",
    categories: {
      web: "Web Development",
      ai: "Artificial Intelligence",
      marketing: "Digital Marketing",
      voice: "Voiceover & Narration",
    },
  },
  comingSoon: {
    eyebrow: "Coming soon",
    title: "Digital Lens courses and info-products",
    description:
      "Hands-on training and info-products across six areas. Leave your contact and be the first to know.",
    courses: [
      "Web Development",
      "Applied Artificial Intelligence",
      "Content Production",
      "Public Speaking & Rhetoric",
      "Digital Marketing",
      "Ebooks",
    ],
    emailLabel: "Your email",
    emailPlaceholder: "you@email.com",
    submitting: "Signing up…",
    submit: "Notify me",
  },
  contactSection: {
    highlightResponse: "Response within 1 business day",
    highlightDiagnosis: "Free initial assessment",
    eyebrow: "Contact",
    titleStart: "Let's focus on your",
    titleHighlight: "next project.",
    description:
      "Tell us the essentials — goal, timeline and rough budget. We reply with a plan, not a catalog.",
  },
  storePreview: {
    eyebrow: "Store",
    titleStart: "Packages ready to",
    titleHighlight: "hire today.",
    description: "Fixed scope, transparent pricing and a defined timeline. No meetings needed to know the cost.",
    viewFullCatalog: "View full catalog",
  },
  testimonials: {
    items: [
      {
        quote: "The team organized in weeks what other agencies hadn't solved in months.",
        name: "Digital Lens client",
        role: "Retail & Commerce",
      },
      {
        quote: "Finally an agency that masters marketing and code at the same time.",
        name: "Digital Lens client",
        role: "Financial Services",
      },
    ],
  },
  cart: {
    title: "Cart",
    close: "Close",
    closeCart: "Close cart",
    cartAriaLabel: "Shopping cart",
    empty: "Your cart is empty.",
    emptyHeading: "Your cart is empty",
    emptyDescription: "Explore the available packages and start your project today.",
    viewStore: "Browse the store",
    oneTime: "One-time payment",
    monthly: "Monthly subscription",
    perMonth: "/ month",
    vatNote: "VAT calculated at checkout, when applicable.",
    vatNoteFull:
      "VAT calculated at checkout. Monthly services and one-time payments are finalized in separate purchases.",
    openingPayment: "Opening payment…",
    checkout: "Checkout",
    viewFullCart: "View full cart",
    continueShopping: "Continue shopping",
    decreaseQty: (name: string) => `Decrease quantity of ${name}`,
    increaseQty: (name: string) => `Increase quantity of ${name}`,
    remove: (name: string) => `Remove ${name}`,
    paymentError: "We couldn't start the payment.",
    networkError: "Network error. Check your connection and try again.",
    cartWithCount: (count: number) => `Cart with ${count} ${count === 1 ? "item" : "items"}`,
    cartEmptyAria: "Empty cart",
    summary: "Summary",
    cancelledNotice: "Payment cancelled. Your items are still saved in your cart.",
  },
  product: {
    popular: "Popular",
    onBudget: "Custom quote",
    from: "from",
    perMonth: "/ month",
    requestQuote: "Request a quote",
    viewDetails: "View details",
    configurePrice: "Configure price",
  },
  purchasePanel: {
    investment: "Investment",
    perMonth: "/ month",
    range: (range: string) => `Range: ${range}. `,
    vatNote: "VAT at the legal rate in force, calculated at checkout.",
    level: "Level",
    quantity: (label: string) => `Quantity (${label})`,
    decreaseQty: "Decrease quantity",
    increaseQty: "Increase quantity",
    deliveryTime: (days: number) => `Typical delivery in ${days} business days`,
    units: "units",
  },
  addToCart: {
    add: "Add to cart",
    added: "Added",
  },
  auth: {
    login: {
      title: "Sign in to your account",
      subtitle: "Track orders, invoices and the status of your projects.",
      submit: "Sign in",
      submitting: "Signing in…",
      footer: "Don't have an account yet?",
      footerLabel: "Create account",
    },
    register: {
      title: "Create account",
      subtitle: "Takes less than a minute and gives you access to your client area.",
      submit: "Create account",
      submitting: "Creating account…",
      footer: "Already have an account?",
      footerLabel: "Sign in",
    },
    nameLabel: "Name",
    emailLabel: "Email",
    passwordLabel: "Password",
    passwordHint: "Minimum 8 characters.",
    confirmPasswordLabel: "Confirm password",
  },
  contactForm: {
    messageSent: "Message sent",
    nameLabel: "Name",
    emailLabel: "Email",
    subjectLabel: "Subject",
    subjectPlaceholder: "E.g.: Institutional site for a clinic",
    projectLabel: "Tell us about your project",
    projectPlaceholder: "Goal, timeline and rough budget help us reply precisely.",
    sending: "Sending…",
    send: "Send message",
    privacyNote: "By submitting, you agree that Digital Lens uses this data only to respond to your request.",
  },
  theme: {
    activateDark: "Switch to dark theme",
    activateLight: "Switch to light theme",
  },
  locale: {
    switchToEn: "Switch to English",
    switchToPt: "Switch to Portuguese",
  },
  install: {
    ariaLabel: "Install the Digital Lens app",
    heading: "Install Digital Lens",
    description: "Quick access, full screen, and works offline.",
    install: "Install",
    dismiss: "Not now",
  },
  pages: {
    servicesIndex: {
      title: "Services",
      metaDescription:
        "Web development, artificial intelligence, digital marketing and professional voiceover. Explore all of Digital Lens's services.",
      eyebrow: "Services",
      titleStart: "Everything your brand needs,",
      titleHighlight: "under one lens.",
      description:
        "Four areas of expertise and twenty-two concrete services. Pick a starting point — we handle the connections.",
      viewDetail: "View detail",
      notFoundTitle: "Didn't find exactly what you're looking for?",
      notFoundDescription:
        "Most projects combine more than one area. Describe what you need and we'll scope it together.",
      talkToUs: "Talk to us",
    },
    serviceDetail: {
      allServices: "All services",
      requestProposal: "Request a proposal",
      viewPackages: "View packages",
      whatIncludes: "What's included",
      whatYouGet: "What you get",
      packagesOf: (title: string) => `${title} packages`,
    },
    store: {
      title: "Store",
      metaDescription:
        "Web development, AI, digital marketing and voiceover packages with fixed scope, transparent pricing and a defined timeline.",
      eyebrow: "Store",
      titleStart: "Priced services,",
      titleHighlight: "no meetings needed to find out.",
      description:
        "Choose a package, pay online and start this week. Larger projects still get a custom quote.",
      guarantees: [
        {
          title: "Secure payment",
          text: "Processed by Paddle. We never store card data.",
        },
        {
          title: "Kick-off in 48h",
          text: "Kick-off scheduled within two business days after confirmation.",
        },
        {
          title: "Fixed scope",
          text: "Price and deliverables defined in writing before we start.",
        },
      ],
    },
    productDetail: {
      backToStore: "Back to store",
      whatIncluded: "What's included",
      investment: "Investment",
      onBudget: "Custom quote",
      budgetDescription:
        "The scope of these projects varies widely. Tell us what you need and we'll send a proposal with a fixed price and timeline.",
      requestQuote: "Request a quote",
      needSomethingDifferent: "Need something different?",
      talkToUsLink: "Talk to us",
      adjustScopeSuffix: "and we'll adjust the scope.",
      alsoIn: (pillar: string) => `Also in ${pillar}`,
    },
    contactPage: {
      title: "Contact",
      metaDescription: "Tell us about your project. We reply within 1 business day with a concrete plan.",
      requestPrefix: "Request: ",
    },
    blog: {
      title: "Blog",
      metaDescription:
        "Articles on web development, artificial intelligence, digital marketing and voiceover — by Digital Lens.",
      eyebrow: "Blog",
      titleStart: "Ideas and",
      titleHighlight: "lessons learned.",
      description: "Practical notes on the topics we work on every day — no fluff.",
      emptyTitle: "No articles published yet",
      emptyDescription: "We're working on the first articles. Check back soon.",
      readMore: "Read article",
    },
    blogPost: {
      backToBlog: "Back to blog",
    },
    cartPage: {
      title: "Cart",
      metaDescription: "Review the selected services before completing your purchase.",
      heading: "Cart",
    },
    checkoutSuccess: {
      title: "Payment completed",
      heading: "Payment received",
      description:
        "Thank you for your trust. You'll receive the receipt by email, and our team will reach out within 1 business day to schedule kick-off.",
      order: (id: string) => `Order ${id}`,
      total: "Total",
      receiptNote: "The receipt arrives within minutes. Please also check your spam folder.",
      myOrders: "My orders",
      backHome: "Back to homepage",
    },
    offlinePage: {
      title: "No connection",
      heading: "You're offline",
      description:
        "We couldn't reach the server. Pages you've already visited are still available; everything updates automatically once your connection is back.",
      backHome: "Back to homepage",
    },
    account: {
      title: "My account",
      statusPending: "Awaiting payment",
      statusPaid: "Paid",
      statusFailed: "Failed",
      statusRefunded: "Refunded",
      areaLabel: "Client area",
      hello: (name: string) => `Hi, ${name}.`,
      logout: "Sign out",
      orders: "Orders",
      noOrders: "No orders yet",
      noOrdersDescription: "When you hire a service, it shows up here with its status.",
      viewStore: "Browse the store",
      needHelp: "Need to change something on an order or request an invoice?",
      talkToUs: "Talk to us",
      dateLocale: "en-GB",
      defaultCustomer: "customer",
    },
    login: {
      title: "Sign in",
      metaDescription: "Access your Digital Lens client area.",
    },
    register: {
      title: "Create account",
      metaDescription: "Create your Digital Lens account and track your projects.",
    },
    notFound: {
      badge: "Error 404",
      title: "This page lost focus.",
      description:
        "The address you're looking for doesn't exist or was moved. Go back home or explore our services.",
      backHome: "Back to homepage",
      viewServices: "View services",
      needHelp: "Need help? Talk to us",
    },
  },
  actions: {
    messageSentShort: "Message sent.",
    nameRequired: "Please enter your name.",
    emailInvalid: "Please enter a valid email.",
    messageMin: "Briefly describe your project (min. 10 characters).",
    messageMax: "The message is too long (max. 4000 characters).",
    reviewFields: "Please review the highlighted fields.",
    sendFailed: (email: string) => `We couldn't send it. Please email us directly at ${email}.`,
    messageSentFull: "Message sent. The Digital Lens team replies within 1 business day.",
    subscriptionRegisteredShort: "Subscription registered.",
    subscriptionRegisteredFull: "Subscription registered. We'll notify you first.",
  },
  authActions: {
    dbOff:
      "Client accounts aren't active in this environment yet. Contact us and we'll handle your request directly.",
    nameRequired: "Please enter your name.",
    emailInvalid: "Please enter a valid email.",
    passwordMin: "The password needs at least 8 characters.",
    passwordMismatch: "The passwords don't match.",
    reviewFields: "Please review the highlighted fields.",
    accountExists: "An account with this email already exists.",
    emailRegistered: "Email already registered.",
    createAccountFailed: "We couldn't create the account. Please try again.",
    passwordRequired: "Please enter your password.",
    loginFailed: "Incorrect email or password.",
  },
  checkoutApi: {
    paymentsNotConfigured: "Payments aren't configured yet. Contact us to complete your order.",
    invalidCart: "Invalid cart.",
    noItemsAvailable: "None of the items in your cart are available for online purchase.",
    mixedBillingError: "Monthly services and one-time payments must be checked out separately.",
    paymentInitFailed: "We couldn't start the payment. Please try again.",
  },
  rateLimit: {
    tooManySeconds: "Too many requests. Wait a few seconds and try again.",
    tooManyMinutes: (n: number) => `Too many requests. Try again in ${n} ${n === 1 ? "minute" : "minutes"}.`,
    tooManyHours: (n: number) => `Too many requests. Try again in ${n} ${n === 1 ? "hour" : "hours"}.`,
  },
} satisfies typeof pt;

const dictionary = { pt, en };

export type Dictionary = typeof pt;

export function getDictionary(locale: Locale): Dictionary {
  return dictionary[locale];
}

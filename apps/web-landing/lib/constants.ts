import type { NavItem, Feature, Module, FAQItem, Step, BeforeAfterItem, CredibilityItem } from '@/types'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Para produtores', href: '#para-produtores' },
  { label: 'Para lojistas', href: '#para-lojistas' },
  { label: 'Módulos', href: '#modulos' },
  { label: 'Credibilidade', href: '#credibilidade' },
  { label: 'FAQ', href: '#faq' },
]

export const CREDIBILITY_ITEMS: CredibilityItem[] = [
  { icon: '📊', text: 'Cotação digital com comparação clara de propostas' },
  { icon: '📱', text: 'Fluxo omnichannel com app, WhatsApp e e-mail' },
  { icon: '🔒', text: 'KYC, compliance e trilha operacional' },
  { icon: '🌱', text: 'Base preparada para crédito rural e ESG' },
  { icon: '🤝', text: 'Experiência para produtor e painel para lojista' },
]

export const HOW_IT_WORKS_STEPS: Step[] = [
  {
    number: '01',
    icon: '📋',
    title: 'Produtor abre cotação',
    description:
      'Em poucos passos pelo app mobile, o produtor descreve o que precisa e a plataforma distribui para lojistas qualificados da região.',
  },
  {
    number: '02',
    icon: '💬',
    title: 'Lojistas enviam propostas',
    description:
      'Os fornecedores recebem a cotação no painel web e respondem com preço, prazo e condições de forma organizada.',
  },
  {
    number: '03',
    icon: '⚖️',
    title: 'Produtor compara e escolhe',
    description:
      'Todas as propostas chegam lado a lado para comparação clara. Sem ligação, sem improviso.',
  },
  {
    number: '04',
    icon: '✅',
    title: 'Pagamento e acompanhamento',
    description:
      'Pagamento integrado e acompanhamento do pedido em tempo real, tudo no mesmo ambiente.',
  },
]

export const FARMER_FEATURES: Feature[] = [
  {
    icon: '📱',
    title: 'Cotações pelo app',
    description: 'Abra cotações em poucos passos e receba propostas organizadas no celular.',
  },
  {
    icon: '📊',
    title: 'Comparação transparente',
    description: 'Compare preço, prazo e condições com clareza. Menos improviso, mais controle.',
  },
  {
    icon: '📦',
    title: 'Histórico centralizado',
    description: 'Acompanhe pedidos, entregas e recorrência de compra em um só ambiente.',
  },
  {
    icon: '🌱',
    title: 'Preparado para o futuro',
    description:
      'Crédito rural, alertas IoT e ESG score chegam como extensão natural do seu perfil.',
  },
]

export const RETAILER_FEATURES: Feature[] = [
  {
    icon: '🎯',
    title: 'Cotações qualificadas',
    description:
      'Receba cotações segmentadas por produto, região e período sem esforço comercial extra.',
  },
  {
    icon: '⚡',
    title: 'Propostas ágeis',
    description: 'Envie propostas com velocidade e organização direto pelo painel web.',
  },
  {
    icon: '📈',
    title: 'Dashboard de performance',
    description: 'Acompanhe conversão, desempenho comercial e oportunidades em tempo real.',
  },
  {
    icon: '💼',
    title: 'Modelo pay-per-sale',
    description: 'Sem mensalidade no MVP. Você paga quando vende. Foco total em resultado.',
  },
]

export const MODULES: Module[] = [
  {
    icon: '🛒',
    title: 'Marketplace & Cotação',
    description:
      'Fluxo digital completo de cotação, proposta, pagamento e acompanhamento para o agronegócio.',
    status: 'active',
    tag: 'Disponível',
  },
  {
    icon: '💰',
    title: 'Crédito Rural Integrado',
    description:
      'Financiamento agrícola conectado ao histórico de compras, com integração Open Finance.',
    status: 'coming-soon',
    tag: 'Em breve',
  },
  {
    icon: '📡',
    title: 'IoT & Inteligência de Campo',
    description:
      'Sensores, alertas inteligentes e dados de campo integrados à jornada de compra.',
    status: 'coming-soon',
    tag: 'Roadmap',
  },
  {
    icon: '🌿',
    title: 'ESG & Mercado de Carbono',
    description:
      'ESG score, rastreabilidade ambiental e acesso ao mercado de crédito de carbono.',
    status: 'coming-soon',
    tag: 'Roadmap',
  },
]

export const BEFORE_AFTER: BeforeAfterItem[] = [
  {
    before: 'Cotação no WhatsApp, sem rastreabilidade',
    after: 'Fluxo digital organizado com histórico completo',
  },
  {
    before: 'Preço solto sem comparação estruturada',
    after: 'Propostas comparáveis com critérios claros',
  },
  {
    before: 'Operação reativa e manual',
    after: 'Decisão orientada por dados e padrões',
  },
  {
    before: 'Processos isolados por ferramenta',
    after: 'Ecossistema integrado em uma plataforma',
  },
]

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'O que é a iFarm?',
    answer:
      'A iFarm é uma plataforma digital para o agronegócio brasileiro que conecta produtores rurais a lojistas e fornecedores de insumos, implementos, máquinas e serviços em um fluxo de cotação, compra e pagamento integrado.',
  },
  {
    question: 'Como funciona a cotação de insumos na iFarm?',
    answer:
      'O produtor abre uma cotação pelo app em poucos passos. Os lojistas cadastrados recebem a solicitação e enviam suas propostas pelo painel web. O produtor compara todas as propostas lado a lado e escolhe a melhor opção.',
  },
  {
    question: 'A iFarm é para produtores rurais ou para lojistas?',
    answer:
      'Para os dois. O produtor usa o app mobile para cotar, comparar e comprar. O lojista ou fornecedor usa o painel web para receber cotações, enviar propostas e acompanhar sua performance comercial.',
  },
  {
    question: 'A iFarm já possui crédito rural integrado?',
    answer:
      'O módulo de crédito rural está no roadmap da plataforma. A iFarm foi desenhada para que o histórico de compras do produtor sirva como base para acesso a linhas de financiamento agrícola digital no futuro.',
  },
  {
    question: 'Como o painel web ajuda fornecedores e lojistas?',
    answer:
      'O painel web centraliza as cotações recebidas, permite envio ágil de propostas, mostra métricas de conversão e performance comercial, e facilita o relacionamento recorrente com clientes.',
  },
  {
    question: 'A iFarm terá integração com IoT e ESG?',
    answer:
      'Sim. O roadmap da plataforma inclui integração com sensores de campo para alertas inteligentes (IoT) e módulo de ESG com score ambiental e acesso ao mercado de carbono.',
  },
  {
    question: 'Como a iFarm trata segurança e compliance?',
    answer:
      'A plataforma foi construída com KYC, conformidade com a LGPD, trilha operacional auditável e criptografia de dados sensíveis. A base técnica está preparada para Open Finance, crédito rural e compliance setorial.',
  },
]

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'pt' | 'en' | 'es'

export const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
]

const translations = {
  pt: {
    nav: {
      marketplace: 'Marketplace',
      howItWorks: 'Como Funciona',
      producers: 'Produtores',
      suppliers: 'Fornecedores',
      pricing: 'Preços',
    },
    header: { getStarted: 'Começar' },
    hero: {
      badge: 'Ecossistema Digital Agro',
      title1: 'A plataforma que conecta o',
      titleHighlight: 'agro certo',
      title2: 'na hora certa.',
      subtitle:
        'A iFarm une produtores rurais e fornecedores em um fluxo digital de cotação, comparação de propostas e pagamento.',
      cta1: 'Começar Agora',
      cta2: 'Ver Demonstração',
      dashboardLabel: 'iFarm Dashboard — Live Insights',
      marketVolumeLabel: 'Market Volume',
      marketVolumeValue: 'R$ 2.4M',
      marketVolumeSub: 'Volume de Propostas hoje',
      activeQuoteLabel: 'Cotação Ativa',
      activeQuoteName: 'Fertilizantes NPK',
    },
    howItWorks: {
      title: 'Como Funciona',
      subtitle:
        'Otimizamos cada etapa do processo de compra e venda de insumos agrícolas através de um fluxo linear e eficiente.',
      step1Title: '1. Cotação Inteligente',
      step1Desc:
        'Produtores emitem demandas específicas. O sistema notifica fornecedores qualificados em tempo real, eliminando intermediários desnecessários e acelerando o processo inicial.',
      step2Title: '2. Comparação de Propostas',
      step2Desc:
        'Visualize preços, prazos de entrega e condições de crédito em um dashboard comparativo intuitivo. Tome decisões baseadas em dados consolidados em uma única tela.',
      step3Title: '3. Pagamento e Liquidação',
      step3Desc:
        'Finalize a transação com segurança através de múltiplos métodos de pagamento e custódia digital, garantindo que o valor só seja liberado após a confirmação de recebimento.',
    },
    modules: {
      title: 'Módulos do Ecossistema',
      marketplaceTitle: 'Marketplace',
      marketplaceDesc:
        'O maior catálogo de insumos, sementes e maquinário com preços competitivos e integração direta com fornecedores locais.',
      marketplaceCta: 'Explorar Catálogo',
      esgTitle: 'Módulo ESG',
      esgDesc:
        'Rastreabilidade completa e certificação de práticas sustentáveis para valorizar sua produção e atrair novos investidores.',
      creditTitle: 'Crédito & Finanças',
      creditDesc:
        'Acesse linhas de crédito rural customizadas e antecipação de recebíveis com as melhores taxas do mercado agro.',
      creditCta: 'Ver Opções de Crédito',
      iotTitle: 'iFarm IoT',
      iotDesc:
        'Monitoramento de sensores e clima em tempo real direto no app, permitindo ações preventivas em sua lavoura.',
      iotHumidity: 'Umidade',
      iotSoilTemp: 'Temp. Solo',
    },
    benefits: {
      title: 'Benefícios para o Ecossistema',
      subtitle: 'Uma solução completa para todos os elos da cadeia produtiva.',
      producersTitle: 'Para Produtores',
      suppliersTitle: 'Para Fornecedores',
      prod1Title: 'Melhor Preço Garantido',
      prod1Desc:
        'Acesso a múltiplos fornecedores aumenta exponencialmente o seu poder de negociação e economia.',
      prod2Title: 'Gestão Centralizada',
      prod2Desc:
        'Histórico de compras, notas fiscais e performance de produtos em um único dashboard unificado.',
      prod3Title: 'Crédito Facilitado',
      prod3Desc:
        'Parceiros financeiros integrados oferecendo custeio da safra com aprovação digital e rápida.',
      sup1Title: 'Novos Mercados',
      sup1Desc:
        'Expanda seu alcance geográfico sem aumentar a equipe de vendas, atingindo produtores em novas regiões.',
      sup2Title: 'Redução de Inadimplência',
      sup2Desc:
        'Ferramentas avançadas de análise de crédito e sistemas de garantia de recebimento integrados.',
      sup3Title: 'Inteligência de Mercado',
      sup3Desc:
        'Dados analíticos precisos sobre demandas, preços praticados e tendências regionais em tempo real.',
    },
    faq: {
      title: 'Perguntas Frequentes',
      items: [
        {
          question: 'Como a iFarm garante a segurança das transações?',
          answer:
            'Utilizamos protocolos bancários de criptografia e um sistema de custódia onde o pagamento só é liberado após a confirmação de recebimento da mercadoria pelo produtor através da plataforma.',
        },
        {
          question: 'Quais os custos para o produtor rural?',
          answer:
            'A plataforma é gratuita para o produtor pesquisar e solicitar cotações. Cobramos uma pequena taxa administrativa apenas em transações finalizadas com sucesso, já inclusa na proposta final.',
        },
        {
          question: 'A iFarm atende quais regiões?',
          answer:
            'Atuamos em todo o território nacional, com forte presença no Centro-Oeste e Sudeste, conectando produtores a hubs logísticos estratégicos e fornecedores locais de confiança.',
        },
        {
          question: 'Posso integrar meus sensores IoT existentes?',
          answer:
            'Sim, nossa API permite a integração com os principais fabricantes de hardware do mercado, consolidando todos os seus dados de telemetria em nossa interface de gestão.',
        },
      ],
    },
    cta: {
      title: 'Entre agora na nova camada digital do agronegócio',
      subtitle:
        'Milhares de produtores e fornecedores já estão transformando sua maneira de fazer negócios com eficiência e transparência.',
      cta1: 'Criar Minha Conta',
      cta2: 'Falar com Consultor',
    },
    footer: {
      tagline:
        'A revolução digital no campo. Conectando oportunidades, cultivando resultados com inteligência e transparência.',
      colPlatform: 'Plataforma',
      colInstitutional: 'Institucional',
      linkMarketplace: 'Marketplace',
      linkEsg: 'Módulo ESG',
      linkPricing: 'Preços',
      linkSupport: 'Suporte',
      linkAbout: 'Sobre Nós',
      linkPrivacy: 'Política de Privacidade',
      linkTerms: 'Termos de Serviço',
      linkContact: 'Contato',
      copyright: '© 2024 iFarm Ecosystem. Todos os direitos reservados.',
    },
  },
  en: {
    nav: {
      marketplace: 'Marketplace',
      howItWorks: 'How It Works',
      producers: 'Producers',
      suppliers: 'Suppliers',
      pricing: 'Pricing',
    },
    header: { getStarted: 'Get Started' },
    hero: {
      badge: 'Digital Agro Ecosystem',
      title1: 'The platform that connects the',
      titleHighlight: 'right agro',
      title2: 'at the right time.',
      subtitle:
        'iFarm brings rural producers and suppliers together in a digital flow of quotes, proposal comparison and payment.',
      cta1: 'Get Started',
      cta2: 'Watch Demo',
      dashboardLabel: 'iFarm Dashboard — Live Insights',
      marketVolumeLabel: 'Market Volume',
      marketVolumeValue: 'R$ 2.4M',
      marketVolumeSub: "Today's Proposal Volume",
      activeQuoteLabel: 'Active Quote',
      activeQuoteName: 'NPK Fertilizers',
    },
    howItWorks: {
      title: 'How It Works',
      subtitle:
        'We optimize every step of the agricultural input buying and selling process through a linear and efficient flow.',
      step1Title: '1. Smart Quoting',
      step1Desc:
        'Producers submit specific demands. The system notifies qualified suppliers in real time, eliminating unnecessary middlemen and speeding up the initial process.',
      step2Title: '2. Proposal Comparison',
      step2Desc:
        'View prices, delivery timelines and credit terms in an intuitive comparative dashboard. Make data-driven decisions consolidated on a single screen.',
      step3Title: '3. Payment & Settlement',
      step3Desc:
        'Complete the transaction securely through multiple payment methods and digital escrow, ensuring funds are only released after the buyer confirms receipt.',
    },
    modules: {
      title: 'Ecosystem Modules',
      marketplaceTitle: 'Marketplace',
      marketplaceDesc:
        'The largest catalogue of inputs, seeds and machinery with competitive prices and direct integration with local suppliers.',
      marketplaceCta: 'Explore Catalogue',
      esgTitle: 'ESG Module',
      esgDesc:
        'Full traceability and certification of sustainable practices to increase the value of your production and attract new investors.',
      creditTitle: 'Credit & Finance',
      creditDesc:
        'Access customised rural credit lines and receivables advance with the best rates in the agro market.',
      creditCta: 'View Credit Options',
      iotTitle: 'iFarm IoT',
      iotDesc:
        'Real-time sensor and weather monitoring directly in the app, enabling preventive action in your fields.',
      iotHumidity: 'Humidity',
      iotSoilTemp: 'Soil Temp.',
    },
    benefits: {
      title: 'Ecosystem Benefits',
      subtitle: 'A complete solution for every link in the production chain.',
      producersTitle: 'For Producers',
      suppliersTitle: 'For Suppliers',
      prod1Title: 'Best Price Guaranteed',
      prod1Desc:
        'Access to multiple suppliers exponentially increases your bargaining power and cost savings.',
      prod2Title: 'Centralised Management',
      prod2Desc: 'Purchase history, invoices and product performance in a single unified dashboard.',
      prod3Title: 'Easy Credit',
      prod3Desc:
        'Integrated financial partners offering crop financing with fast digital approval.',
      sup1Title: 'New Markets',
      sup1Desc:
        'Expand your geographic reach without growing your sales team, reaching producers in new regions.',
      sup2Title: 'Reduced Default Risk',
      sup2Desc: 'Advanced credit analysis tools and integrated payment guarantee systems.',
      sup3Title: 'Market Intelligence',
      sup3Desc:
        'Precise analytical data on demand, market prices and regional trends in real time.',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          question: 'How does iFarm ensure transaction security?',
          answer:
            'We use bank-grade encryption protocols and an escrow system where payment is only released after the producer confirms receipt of the goods through the platform.',
        },
        {
          question: 'What are the costs for a rural producer?',
          answer:
            'The platform is free for producers to search and request quotes. We charge a small administrative fee only on successfully completed transactions, already included in the final proposal.',
        },
        {
          question: 'Which regions does iFarm serve?',
          answer:
            'We operate across the entire national territory, with a strong presence in the Centre-West and South-East, connecting producers to strategic logistics hubs and trusted local suppliers.',
        },
        {
          question: 'Can I integrate my existing IoT sensors?',
          answer:
            'Yes, our API allows integration with the leading hardware manufacturers on the market, consolidating all your telemetry data in our management interface.',
        },
      ],
    },
    cta: {
      title: 'Join the new digital layer of agribusiness now',
      subtitle:
        'Thousands of producers and suppliers are already transforming the way they do business with efficiency and transparency.',
      cta1: 'Create My Account',
      cta2: 'Talk to a Consultant',
    },
    footer: {
      tagline:
        'The digital revolution in the field. Connecting opportunities, cultivating results with intelligence and transparency.',
      colPlatform: 'Platform',
      colInstitutional: 'Company',
      linkMarketplace: 'Marketplace',
      linkEsg: 'ESG Module',
      linkPricing: 'Pricing',
      linkSupport: 'Support',
      linkAbout: 'About Us',
      linkPrivacy: 'Privacy Policy',
      linkTerms: 'Terms of Service',
      linkContact: 'Contact',
      copyright: '© 2024 iFarm Ecosystem. All rights reserved.',
    },
  },
  es: {
    nav: {
      marketplace: 'Marketplace',
      howItWorks: 'Cómo Funciona',
      producers: 'Productores',
      suppliers: 'Proveedores',
      pricing: 'Precios',
    },
    header: { getStarted: 'Comenzar' },
    hero: {
      badge: 'Ecosistema Digital Agro',
      title1: 'La plataforma que conecta el',
      titleHighlight: 'agro correcto',
      title2: 'en el momento correcto.',
      subtitle:
        'iFarm une productores rurales y proveedores en un flujo digital de cotización, comparación de propuestas y pago.',
      cta1: 'Comenzar Ahora',
      cta2: 'Ver Demostración',
      dashboardLabel: 'iFarm Dashboard — Live Insights',
      marketVolumeLabel: 'Market Volume',
      marketVolumeValue: 'R$ 2.4M',
      marketVolumeSub: 'Volumen de Propuestas hoy',
      activeQuoteLabel: 'Cotización Activa',
      activeQuoteName: 'Fertilizantes NPK',
    },
    howItWorks: {
      title: 'Cómo Funciona',
      subtitle:
        'Optimizamos cada etapa del proceso de compra y venta de insumos agrícolas a través de un flujo lineal y eficiente.',
      step1Title: '1. Cotización Inteligente',
      step1Desc:
        'Los productores emiten demandas específicas. El sistema notifica a proveedores calificados en tiempo real, eliminando intermediarios innecesarios y acelerando el proceso inicial.',
      step2Title: '2. Comparación de Propuestas',
      step2Desc:
        'Visualice precios, plazos de entrega y condiciones de crédito en un dashboard comparativo intuitivo. Tome decisiones basadas en datos consolidados en una sola pantalla.',
      step3Title: '3. Pago y Liquidación',
      step3Desc:
        'Finalice la transacción con seguridad a través de múltiples métodos de pago y custodia digital, garantizando que el valor solo se libere tras la confirmación de recepción.',
    },
    modules: {
      title: 'Módulos del Ecosistema',
      marketplaceTitle: 'Marketplace',
      marketplaceDesc:
        'El mayor catálogo de insumos, semillas y maquinaria con precios competitivos e integración directa con proveedores locales.',
      marketplaceCta: 'Explorar Catálogo',
      esgTitle: 'Módulo ESG',
      esgDesc:
        'Trazabilidad completa y certificación de prácticas sostenibles para valorizar su producción y atraer nuevos inversores.',
      creditTitle: 'Crédito & Finanzas',
      creditDesc:
        'Acceda a líneas de crédito rural personalizadas y anticipación de cobros con las mejores tasas del mercado agro.',
      creditCta: 'Ver Opciones de Crédito',
      iotTitle: 'iFarm IoT',
      iotDesc:
        'Monitoreo de sensores y clima en tiempo real directamente en la app, permitiendo acciones preventivas en su cultivo.',
      iotHumidity: 'Humedad',
      iotSoilTemp: 'Temp. Suelo',
    },
    benefits: {
      title: 'Beneficios para el Ecosistema',
      subtitle: 'Una solución completa para todos los eslabones de la cadena productiva.',
      producersTitle: 'Para Productores',
      suppliersTitle: 'Para Proveedores',
      prod1Title: 'Mejor Precio Garantizado',
      prod1Desc:
        'El acceso a múltiples proveedores aumenta exponencialmente su poder de negociación y ahorro.',
      prod2Title: 'Gestión Centralizada',
      prod2Desc:
        'Historial de compras, facturas y rendimiento de productos en un único dashboard unificado.',
      prod3Title: 'Crédito Facilitado',
      prod3Desc:
        'Socios financieros integrados que ofrecen financiación de cosecha con aprobación digital rápida.',
      sup1Title: 'Nuevos Mercados',
      sup1Desc:
        'Amplíe su alcance geográfico sin aumentar el equipo de ventas, llegando a productores en nuevas regiones.',
      sup2Title: 'Reducción de Morosidad',
      sup2Desc:
        'Herramientas avanzadas de análisis de crédito y sistemas de garantía de cobro integrados.',
      sup3Title: 'Inteligencia de Mercado',
      sup3Desc:
        'Datos analíticos precisos sobre demandas, precios practicados y tendencias regionales en tiempo real.',
    },
    faq: {
      title: 'Preguntas Frecuentes',
      items: [
        {
          question: '¿Cómo garantiza iFarm la seguridad de las transacciones?',
          answer:
            'Utilizamos protocolos bancarios de cifrado y un sistema de custodia donde el pago solo se libera tras la confirmación de recepción de la mercancía por parte del productor a través de la plataforma.',
        },
        {
          question: '¿Cuáles son los costos para el productor rural?',
          answer:
            'La plataforma es gratuita para que el productor busque y solicite cotizaciones. Cobramos una pequeña tarifa administrativa solo en transacciones finalizadas con éxito, ya incluida en la propuesta final.',
        },
        {
          question: '¿A qué regiones atiende iFarm?',
          answer:
            'Operamos en todo el territorio nacional, con fuerte presencia en el Centro-Oeste y Sudeste, conectando productores con hubs logísticos estratégicos y proveedores locales de confianza.',
        },
        {
          question: '¿Puedo integrar mis sensores IoT existentes?',
          answer:
            'Sí, nuestra API permite la integración con los principales fabricantes de hardware del mercado, consolidando todos sus datos de telemetría en nuestra interfaz de gestión.',
        },
      ],
    },
    cta: {
      title: 'Únase ahora a la nueva capa digital del agronegocio',
      subtitle:
        'Miles de productores y proveedores ya están transformando su forma de hacer negocios con eficiencia y transparencia.',
      cta1: 'Crear Mi Cuenta',
      cta2: 'Hablar con Consultor',
    },
    footer: {
      tagline:
        'La revolución digital en el campo. Conectando oportunidades, cultivando resultados con inteligencia y transparencia.',
      colPlatform: 'Plataforma',
      colInstitutional: 'Institucional',
      linkMarketplace: 'Marketplace',
      linkEsg: 'Módulo ESG',
      linkPricing: 'Precios',
      linkSupport: 'Soporte',
      linkAbout: 'Sobre Nosotros',
      linkPrivacy: 'Política de Privacidad',
      linkTerms: 'Términos de Servicio',
      linkContact: 'Contacto',
      copyright: '© 2024 iFarm Ecosystem. Todos los derechos reservados.',
    },
  },
}

export type Translations = (typeof translations)['pt']

// Cast translations to a record so any language key returns the shared Translations shape
const typedTranslations = translations as Record<Language, Translations>

interface LanguageContextValue {
  lang: Language
  setLang: (l: Language) => void
  tr: Translations
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'pt',
  setLang: () => {},
  tr: translations.pt,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('pt')

  useEffect(() => {
    const stored = localStorage.getItem('ifarm-lang') as Language | null
    if (stored === 'pt' || stored === 'en' || stored === 'es') {
      setLangState(stored)
    }
  }, [])

  const setLang = (l: Language) => {
    setLangState(l)
    localStorage.setItem('ifarm-lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, tr: typedTranslations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

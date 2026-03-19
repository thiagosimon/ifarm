const TRUST_PILLARS = [
  {
    icon: '🔐',
    title: 'KYC e Compliance',
    description:
      'Verificação de identidade, validação de CNPJ/CPF e conformidade regulatória desde o onboarding.',
  },
  {
    icon: '🛡️',
    title: 'LGPD & Privacidade',
    description:
      'Dados sensíveis criptografados com AES-256-GCM. Histórico de consentimento e direitos dos titulares garantidos.',
  },
  {
    icon: '📋',
    title: 'Trilha Operacional',
    description:
      'Auditoria completa de cada cotação, proposta, aprovação e pagamento. Rastreabilidade total.',
  },
  {
    icon: '🏦',
    title: 'Open Finance Ready',
    description:
      'Arquitetura preparada para integração com Open Finance e financiamento agrícola digital.',
  },
]

export default function TrustSection() {
  return (
    <section
      id="credibilidade"
      className="bg-ifarm-primary section-padding"
      aria-labelledby="trust-title"
    >
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold text-ifarm-primary-fixed/80 uppercase tracking-widest mb-3">
            Credibilidade e segurança
          </span>
          <h2
            id="trust-title"
            className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
          >
            Construída para o agronegócio sério.
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Cada camada da plataforma foi desenhada com segurança, compliance e preparação
            para o mercado financeiro agrícola.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col gap-4 p-6 rounded-card-lg"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div className="w-12 h-12 rounded-card bg-white/10 flex items-center justify-center text-2xl">
                <span role="img" aria-hidden="true">
                  {pillar.icon}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-pill"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <span className="w-2 h-2 rounded-full bg-ifarm-primary-fixed animate-pulse" />
            <span className="text-sm text-white/80">
              Infraestrutura com Keycloak, RabbitMQ, Redis e PostgreSQL — pronta para escala.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

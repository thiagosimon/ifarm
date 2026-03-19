import Button from '@/components/ui/Button'
import { RETAILER_FEATURES } from '@/lib/constants'

function WebPanelMockup() {
  return (
    <div className="flex justify-center items-center py-8">
      {/* Browser frame */}
      <div className="w-full max-w-md">
        <div className="rounded-card-lg overflow-hidden shadow-ambient-strong border border-ifarm-outline-variant/20">
          {/* Browser chrome */}
          <div className="bg-ifarm-surface-high px-4 py-2.5 flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-ifarm-error/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-ifarm-secondary-container/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-ifarm-primary-fixed" />
            </div>
            <div className="flex-1 mx-4 h-6 bg-white rounded-pill px-3 flex items-center">
              <span className="text-[10px] text-ifarm-on-surface-variant">painel.ifarm.com.br</span>
            </div>
          </div>

          {/* App content */}
          <div className="bg-white">
            {/* Top bar */}
            <div className="bg-ifarm-secondary px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-white/70 text-[10px]">Painel do Fornecedor</p>
                <p className="text-white font-bold text-sm">AgroMais Distribuidora</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/80 text-xs">Online</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-px bg-ifarm-surface-container">
              {[
                { label: 'Cotações', value: '12', sub: 'novas hoje', color: '#795900' },
                { label: 'Propostas', value: '8', sub: 'enviadas', color: '#005129' },
                { label: 'Pedidos', value: 'R$ 48k', sub: 'este mês', color: '#005129' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white px-3 py-3 text-center">
                  <p className="text-xs text-ifarm-on-surface-variant">{stat.label}</p>
                  <p className="text-lg font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-[9px] text-ifarm-on-surface-variant">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Quote list */}
            <div className="p-3">
              <p className="text-xs font-bold text-ifarm-on-surface mb-2">
                Cotações pendentes
              </p>
              <div className="space-y-2">
                {[
                  { id: '#1248', produto: 'Fertilizantes NPK', local: 'Ribeirão Preto, SP', urgente: true },
                  { id: '#1249', produto: 'Defensivos Soja', local: 'Uberaba, MG', urgente: false },
                  { id: '#1250', produto: 'Sementes Milho', local: 'Sorriso, MT', urgente: false },
                ].map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center gap-3 p-2.5 rounded-card hover:bg-ifarm-surface-low transition-colors"
                    style={{ border: '1px solid #ECEEF0' }}
                  >
                    <div
                      className="w-1.5 h-8 rounded-pill flex-shrink-0"
                      style={{ background: quote.urgente ? '#FFC641' : '#BFC9BE' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-ifarm-secondary">{quote.id}</span>
                        {quote.urgente && (
                          <span className="text-[8px] font-bold text-ifarm-secondary bg-ifarm-secondary-container/30 px-1.5 py-0.5 rounded-pill">
                            URGENTE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-ifarm-on-surface truncate">{quote.produto}</p>
                      <p className="text-[9px] text-ifarm-on-surface-variant">{quote.local}</p>
                    </div>
                    <div className="flex-shrink-0 px-2 py-1 bg-ifarm-secondary text-white rounded-pill text-[9px] font-bold">
                      Enviar
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Glow */}
        <div
          className="absolute inset-0 -z-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(255,198,65,0.12) 0%, transparent 70%)' }}
        />
      </div>
    </div>
  )
}

export default function ForRetailersSection() {
  return (
    <section
      id="para-lojistas"
      className="bg-ifarm-surface-low section-padding"
      aria-labelledby="retailers-title"
    >
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual - left on desktop */}
          <div className="order-2 lg:order-1">
            <WebPanelMockup />
          </div>

          {/* Content - right on desktop */}
          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <div>
              <span className="inline-block text-xs font-bold text-ifarm-secondary uppercase tracking-widest mb-3">
                Para lojistas e fornecedores
              </span>
              <h2
                id="retailers-title"
                className="text-3xl sm:text-4xl font-extrabold text-ifarm-on-surface mb-4"
              >
                Venda mais com{' '}
                <span className="text-ifarm-secondary">menos esforço comercial.</span>
              </h2>
              <p className="text-lg text-ifarm-on-surface-variant leading-relaxed">
                A iFarm leva cotações qualificadas diretamente para o seu painel. Você responde
                com agilidade, acompanha performance e cresce no canal digital sem precisar
                prospectar.
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-4" role="list">
              {RETAILER_FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-card bg-ifarm-secondary-container/30 flex items-center justify-center">
                    <span className="text-lg" role="img" aria-hidden="true">
                      {feature.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ifarm-on-surface text-base">{feature.title}</h3>
                    <p className="text-sm text-ifarm-on-surface-variant mt-0.5">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div>
              <Button variant="secondary" size="lg" href="#lead-form">
                Quero vender na iFarm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

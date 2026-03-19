import Button from '@/components/ui/Button'
import { FARMER_FEATURES } from '@/lib/constants'

function MobileAppMockup() {
  return (
    <div className="flex justify-center items-center py-8">
      {/* Phone frame */}
      <div className="relative">
        <div
          className="w-64 rounded-[2.5rem] bg-ifarm-on-surface p-2 shadow-ambient-strong"
          style={{ aspectRatio: '9/19' }}
        >
          {/* Screen */}
          <div className="w-full h-full rounded-[2rem] bg-ifarm-surface overflow-hidden flex flex-col">
            {/* Status bar */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-[10px] font-semibold text-ifarm-on-surface">9:41</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-ifarm-on-surface">●●●</span>
              </div>
            </div>

            {/* App header */}
            <div className="bg-ifarm-primary px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-white/60 text-[9px]">Olá, João</p>
                <p className="text-white text-xs font-bold">Minhas Cotações</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-xs">JF</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
              {/* Active quote card */}
              <div className="bg-white rounded-card p-3 shadow-card">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-bold text-ifarm-primary">Aberta</span>
                  <span className="text-[9px] text-ifarm-on-surface-variant">#1247</span>
                </div>
                <p className="text-[11px] font-semibold text-ifarm-on-surface">Insumos safra 2025</p>
                <p className="text-[9px] text-ifarm-on-surface-variant mt-1">3 propostas recebidas</p>
                <div className="mt-2 h-1 bg-ifarm-surface-container rounded-pill overflow-hidden">
                  <div className="h-full w-3/4 bg-ifarm-primary rounded-pill" />
                </div>
              </div>

              {/* Comparison card */}
              <div className="bg-white rounded-card p-3 shadow-card">
                <p className="text-[9px] font-bold text-ifarm-secondary mb-2">Comparar propostas</p>
                <div className="space-y-1.5">
                  {['AgroMais', 'Campo Agro', 'Sul Rural'].map((name, i) => (
                    <div key={name} className="flex items-center gap-2">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: i === 0 ? '#005129' : '#BFC9BE',
                        }}
                      />
                      <span className="text-[9px] text-ifarm-on-surface flex-1">{name}</span>
                      <span className="text-[9px] font-semibold text-ifarm-on-surface">
                        {i === 0 ? 'R$ 4.820' : i === 1 ? 'R$ 5.100' : 'R$ 5.340'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order tracking */}
              <div className="bg-ifarm-primary-fixed rounded-card p-3">
                <p className="text-[9px] font-bold text-ifarm-primary mb-1">Em entrega</p>
                <p className="text-[10px] text-ifarm-on-surface">#PD-0882 · AgroMais</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className="flex-1 h-1 rounded-pill"
                      style={{ background: s <= 3 ? '#005129' : '#BFC9BE' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom nav */}
            <div className="bg-white border-t border-ifarm-outline-variant/20 px-4 py-2 flex items-center justify-around">
              {['🏠', '📋', '📦', '👤'].map((icon, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span className="text-sm">{icon}</span>
                  {i === 0 && (
                    <div className="w-1 h-1 rounded-full bg-ifarm-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative glow */}
        <div
          className="absolute inset-0 -z-10 blur-2xl"
          style={{ background: 'radial-gradient(ellipse, rgba(0,81,41,0.15) 0%, transparent 70%)' }}
        />
      </div>
    </div>
  )
}

export default function ForFarmersSection() {
  return (
    <section
      id="para-produtores"
      className="bg-white section-padding"
      aria-labelledby="farmers-title"
    >
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="inline-block text-xs font-bold text-ifarm-primary uppercase tracking-widest mb-3">
                Para produtores rurais
              </span>
              <h2
                id="farmers-title"
                className="text-3xl sm:text-4xl font-extrabold text-ifarm-on-surface mb-4"
              >
                Compre insumos com mais{' '}
                <span className="text-ifarm-primary">inteligência e controle.</span>
              </h2>
              <p className="text-lg text-ifarm-on-surface-variant leading-relaxed">
                Chega de cotação no WhatsApp sem rastreabilidade. Com a iFarm, você compara
                propostas, acompanha pedidos e constrói um histórico de compras que trabalha
                para você.
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-4" role="list">
              {FARMER_FEATURES.map((feature) => (
                <li key={feature.title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-card bg-ifarm-primary-fixed flex items-center justify-center">
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
              <Button variant="primary" size="lg" href="#lead-form">
                Quero entrar como produtor
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div>
            <MobileAppMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

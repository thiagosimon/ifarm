'use client'

import { useLanguage } from '@/lib/i18n'

export default function ModulesSection() {
  const { tr } = useLanguage()
  const m = tr.modules

  return (
    <section id="modulos" className="py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white tracking-tight">{m.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto md:h-[700px]">
          {/* Marketplace */}
          <div className="bg-gradient-to-br from-primary-container/40 to-emerald-950 rounded-3xl p-10 border border-white/5 relative overflow-hidden group flex flex-col justify-between">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">
                  shopping_cart
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{m.marketplaceTitle}</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">{m.marketplaceDesc}</p>
            </div>
            <div className="relative z-10 mt-8">
              <button className="px-6 py-3 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition-colors">
                {m.marketplaceCta}
              </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[240px] text-white/5 group-hover:scale-110 transition-transform">
              inventory_2
            </span>
          </div>

          {/* Módulo ESG — sem imagem */}
          <div className="bg-surface-container-high rounded-3xl p-10 border border-outline-variant relative overflow-hidden group flex flex-col justify-between">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">eco</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{m.esgTitle}</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">{m.esgDesc}</p>
            </div>
            {/* decorative background icon */}
            <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[240px] text-primary/5 group-hover:scale-110 transition-transform">
              park
            </span>
          </div>

          {/* Crédito & Finanças */}
          <div className="bg-secondary-container/20 rounded-3xl p-10 border border-secondary/20 relative overflow-hidden group flex flex-col justify-between">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-2xl">payments</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{m.creditTitle}</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed">{m.creditDesc}</p>
            </div>
            <div className="flex items-center gap-2 text-secondary font-bold group-hover:translate-x-2 transition-transform cursor-pointer">
              {m.creditCta} <span className="material-symbols-outlined">arrow_forward</span>
            </div>
            <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* iFarm IoT */}
          <div className="bg-surface-container border border-outline-variant rounded-3xl p-10 relative overflow-hidden group flex flex-col">
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-white text-2xl">sensors</span>
                </div>
                <h3 className="text-3xl font-bold text-white italic mb-4">{m.iotTitle}</h3>
                <p className="text-on-surface-variant text-lg leading-relaxed">{m.iotDesc}</p>
              </div>
              <div className="animate-pulse flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full border border-primary/30 shrink-0">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-[10px] text-primary font-bold uppercase">Live</span>
              </div>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-4">
              <div className="bg-surface-container-high p-4 rounded-xl border border-white/5">
                <div className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">
                  {m.iotHumidity}
                </div>
                <div className="text-xl font-bold text-white">68%</div>
              </div>
              <div className="bg-surface-container-high p-4 rounded-xl border border-white/5">
                <div className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">
                  {m.iotSoilTemp}
                </div>
                <div className="text-xl font-bold text-white">24.5°C</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

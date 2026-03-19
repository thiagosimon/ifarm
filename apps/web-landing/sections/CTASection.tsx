'use client'

import { useLanguage } from '@/lib/i18n'

export default function CTASection() {
  const { tr } = useLanguage()
  const c = tr.cta

  return (
    <section id="cta" className="py-32 px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          alt="Agro Landscape"
          className="w-full h-full object-cover opacity-30 grayscale"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtkwKOJxOEInUcygZCEGJP8-oO2-Zum1Xaemssn09bNy0BbNjclrZl0_6xFfnAAlWg3gKkAt3TWcTtxoRdLCX8JPlN-J_juGPJHRbcs-tO2p075jcDH1wCBjTy7dbVfi6w_34fjnHT207Aj8as-fvqJJLsfZlROs0jLGmlQPdZXPQg9MIG-VzAfVTa7dBVDViP9e-oeOXbZyP4vZrrXOJa7lSWhENB1LjyWm9MLzri5cymIoXScGwE5ExLzdwR-OmJ6Ssu-cu9jRES"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">{c.title}</h2>
        <p className="text-xl text-on-surface-variant">{c.subtitle}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-10 py-5 bg-primary text-on-primary font-bold rounded-2xl text-lg hover:scale-105 transition-all shadow-xl shadow-primary/10">
            {c.cta1}
          </button>
          <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl text-lg hover:bg-white/20 transition-all">
            {c.cta2}
          </button>
        </div>
      </div>
    </section>
  )
}

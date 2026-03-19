'use client'

import { useLanguage } from '@/lib/i18n'

export default function Footer() {
  const { tr } = useLanguage()
  const f = tr.footer

  return (
    <footer className="bg-slate-950 pt-16 pb-8 border-t border-emerald-900/30">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 font-inter text-sm">
        <div className="space-y-6">
          <div className="text-2xl font-black text-white italic">iFarm</div>
          <p className="text-slate-500 max-w-xs leading-relaxed text-base">{f.tagline}</p>
          <div className="flex gap-6">
            <span className="material-symbols-outlined text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors">
              public
            </span>
            <span className="material-symbols-outlined text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors">
              alternate_email
            </span>
            <span className="material-symbols-outlined text-slate-500 hover:text-emerald-400 cursor-pointer transition-colors">
              thumb_up
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-emerald-400 font-bold text-base mb-2">{f.colPlatform}</span>
            <a href="#modulos" className="text-slate-500 hover:text-emerald-300 transition-colors">
              {f.linkMarketplace}
            </a>
            <a href="#modulos" className="text-slate-500 hover:text-emerald-300 transition-colors">
              {f.linkEsg}
            </a>
            <a href="#cta" className="text-slate-500 hover:text-emerald-300 transition-colors">
              {f.linkPricing}
            </a>
            <a href="#faq" className="text-slate-500 hover:text-emerald-300 transition-colors">
              {f.linkSupport}
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-emerald-400 font-bold text-base mb-2">
              {f.colInstitutional}
            </span>
            <a href="#" className="text-slate-500 hover:text-emerald-300 transition-colors">
              {f.linkAbout}
            </a>
            <a href="#" className="text-slate-500 hover:text-emerald-300 transition-colors">
              {f.linkPrivacy}
            </a>
            <a href="#" className="text-slate-500 hover:text-emerald-300 transition-colors">
              {f.linkTerms}
            </a>
            <a href="#" className="text-slate-500 hover:text-emerald-300 transition-colors">
              {f.linkContact}
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-white/5 text-center text-slate-500 text-xs">
        {f.copyright}
      </div>
    </footer>
  )
}

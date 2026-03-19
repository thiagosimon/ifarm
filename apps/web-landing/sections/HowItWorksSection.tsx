'use client'

import { useLanguage } from '@/lib/i18n'

export default function HowItWorksSection() {
  const { tr } = useLanguage()
  const h = tr.howItWorks

  return (
    <section id="como-funciona" className="py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-4xl mx-auto">
        <div className="text-left mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">{h.title}</h2>
          <p className="text-on-surface-variant text-lg">{h.subtitle}</p>
        </div>

        <div className="space-y-12">
          {/* Step 1 */}
          <div className="step-block relative flex gap-8 items-start group">
            <div className="step-line relative z-10">
              <div className="w-16 h-16 bg-surface-container border border-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-primary-container transition-colors duration-300">
                <span className="material-symbols-outlined text-primary group-hover:text-on-primary-container text-3xl">
                  request_quote
                </span>
              </div>
            </div>
            <div className="flex-1 pb-12">
              <h3 className="text-2xl font-bold text-white mb-3">{h.step1Title}</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                {h.step1Desc}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="step-block relative flex gap-8 items-start group">
            <div className="step-line relative z-10">
              <div className="w-16 h-16 bg-surface-container border border-secondary/20 rounded-2xl flex items-center justify-center group-hover:bg-secondary-container transition-colors duration-300">
                <span className="material-symbols-outlined text-secondary group-hover:text-on-secondary-container text-3xl">
                  compare_arrows
                </span>
              </div>
            </div>
            <div className="flex-1 pb-12">
              <h3 className="text-2xl font-bold text-white mb-3">{h.step2Title}</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                {h.step2Desc}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="step-block relative flex gap-8 items-start group">
            <div className="step-line relative z-10">
              <div className="w-16 h-16 bg-surface-container border border-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-primary-container transition-colors duration-300">
                <span className="material-symbols-outlined text-primary group-hover:text-on-primary-container text-3xl">
                  account_balance_wallet
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3">{h.step3Title}</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                {h.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

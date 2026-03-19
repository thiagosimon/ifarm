'use client'

import { useLanguage } from '@/lib/i18n'

// Supplier image: B2B agro supplier — person reviewing products/orders in commercial context
const SUPPLIER_IMAGE =
  'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80'

export default function BenefitsSection() {
  const { tr } = useLanguage()
  const b = tr.benefits

  return (
    <section id="beneficios" className="py-24 px-8 bg-surface-dim border-y border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white tracking-tight">{b.title}</h2>
          <p className="text-on-surface-variant mt-4">{b.subtitle}</p>
        </div>

        <div className="space-y-20">
          {/* Para Produtores */}
          <div className="space-y-12">
            <div className="flex items-center gap-4 pb-6 border-b border-primary/20">
              <span className="material-symbols-outlined text-primary text-4xl">agriculture</span>
              <h2 className="text-3xl font-bold text-white italic">{b.producersTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="rounded-3xl overflow-hidden h-64 border border-white/10 shadow-2xl">
                <img
                  alt="Farmer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy9od33eqS9JxCUIiMg_e-ca4EZrA49VHqKsMv_8TYkYaXOo4LqxFqNLvR7m3xep-57mnK_PGGwGpBBE1OpzXgyxM08jHMqkySHoxRZ5b2my6g1mQGIFnDLtztvMVOi4kOgw4z99ZEyliJ1of4oMkSYD1OGVqHqMeWhO-XNlbzet9Db5tKq5Upj3zdaZPNVAxTFoZL6RCx3FOXqzueQk0WONSUCprbeyuWgEHRg4D8gdk6YLHNF6_NgLcbPJx1jS04vT2hE4MqiRvn"
                />
              </div>
              <ul className="space-y-6">
                <li className="flex gap-4 p-5 rounded-2xl bg-surface-container border border-white/5">
                  <span className="material-symbols-outlined text-primary font-bold shrink-0">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-lg">{b.prod1Title}</h4>
                    <p className="text-on-surface-variant leading-relaxed">{b.prod1Desc}</p>
                  </div>
                </li>
                <li className="flex gap-4 p-5 rounded-2xl bg-surface-container border border-white/5">
                  <span className="material-symbols-outlined text-primary font-bold shrink-0">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-lg">{b.prod2Title}</h4>
                    <p className="text-on-surface-variant leading-relaxed">{b.prod2Desc}</p>
                  </div>
                </li>
                <li className="flex gap-4 p-5 rounded-2xl bg-surface-container border border-white/5">
                  <span className="material-symbols-outlined text-primary font-bold shrink-0">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-lg">{b.prod3Title}</h4>
                    <p className="text-on-surface-variant leading-relaxed">{b.prod3Desc}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Para Fornecedores */}
          <div className="space-y-12">
            <div className="flex items-center gap-4 pb-6 border-b border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-4xl">storefront</span>
              <h2 className="text-3xl font-bold text-white italic">{b.suppliersTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <ul className="space-y-6 order-2 md:order-1">
                <li className="flex gap-4 p-5 rounded-2xl bg-surface-container border border-white/5">
                  <span className="material-symbols-outlined text-secondary font-bold shrink-0">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-lg">{b.sup1Title}</h4>
                    <p className="text-on-surface-variant leading-relaxed">{b.sup1Desc}</p>
                  </div>
                </li>
                <li className="flex gap-4 p-5 rounded-2xl bg-surface-container border border-white/5">
                  <span className="material-symbols-outlined text-secondary font-bold shrink-0">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-lg">{b.sup2Title}</h4>
                    <p className="text-on-surface-variant leading-relaxed">{b.sup2Desc}</p>
                  </div>
                </li>
                <li className="flex gap-4 p-5 rounded-2xl bg-surface-container border border-white/5">
                  <span className="material-symbols-outlined text-secondary font-bold shrink-0">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-lg">{b.sup3Title}</h4>
                    <p className="text-on-surface-variant leading-relaxed">{b.sup3Desc}</p>
                  </div>
                </li>
              </ul>
              <div className="rounded-3xl overflow-hidden h-64 border border-white/10 shadow-2xl order-1 md:order-2">
                <img
                  alt="Agro supplier managing inventory"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  src={SUPPLIER_IMAGE}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

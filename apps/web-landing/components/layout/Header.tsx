'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage, LANGUAGES, type Language } from '@/lib/i18n'

function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = LANGUAGES.find((l) => l.code === lang)!

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (code: Language) => {
    setLang(code)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-medium transition-all duration-200"
        aria-label="Select language"
        aria-expanded={open}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="tracking-wide">{current.label}</span>
        <span
          className={`material-symbols-outlined text-sm text-white/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ fontSize: '16px' }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 rounded-xl overflow-hidden shadow-2xl border border-white/10 z-50"
          style={{ background: 'rgba(13, 20, 21, 0.95)', backdropFilter: 'blur(16px)' }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                l.code === lang
                  ? 'bg-primary/20 text-primary'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.label}</span>
              {l.code === lang && (
                <span className="material-symbols-outlined ml-auto text-primary" style={{ fontSize: '16px' }}>
                  check
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const { tr } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: tr.nav.marketplace, href: '#modulos' },
    { label: tr.nav.howItWorks, href: '#como-funciona' },
    { label: tr.nav.producers, href: '#beneficios' },
    { label: tr.nav.suppliers, href: '#beneficios' },
    { label: tr.nav.pricing, href: '#cta' },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileOpen(false)
    const target = document.querySelector(href)
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 72
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-emerald-950/40 backdrop-blur-md border-b border-white/10 shadow-2xl">
      <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto font-inter tracking-tight">
        {/* Logo */}
        <div className="text-2xl font-black text-white italic">iFarm</div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item, i) => (
            <a
              key={item.href + i}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-slate-300 hover:text-white hover:bg-white/10 transition-all px-2 py-1 rounded-lg text-sm"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right: language + CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button className="hidden sm:block bg-primary-container text-on-primary-container px-5 py-2 rounded-lg font-bold hover:scale-105 transition-all duration-300 text-sm whitespace-nowrap">
            {tr.header.getStarted}
          </button>
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-8 py-6 flex flex-col gap-3"
          style={{ background: 'rgba(11, 15, 16, 0.97)', backdropFilter: 'blur(12px)' }}
        >
          {navItems.map((item, i) => (
            <a
              key={item.href + i}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-slate-300 hover:text-white transition-colors py-2 text-base font-medium"
            >
              {item.label}
            </a>
          ))}
          <button className="mt-2 bg-primary-container text-on-primary-container px-5 py-3 rounded-lg font-bold text-sm w-full">
            {tr.header.getStarted}
          </button>
        </div>
      )}
    </header>
  )
}

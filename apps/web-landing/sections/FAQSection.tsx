'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`bg-surface-container rounded-2xl p-6 border border-white/5 transition-all h-fit ${open ? 'ring-1 ring-primary/40' : ''}`}
    >
      <button
        className="flex justify-between items-center w-full cursor-pointer text-left font-bold text-white text-lg"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="pr-4">{question}</span>
        <ChevronDown
          size={20}
          className={`text-primary transition-transform duration-300 shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="mt-4 text-on-surface-variant leading-relaxed text-base">{answer}</p>
      )}
    </div>
  )
}

export default function FAQSection() {
  const { tr } = useLanguage()

  return (
    <section id="faq" className="py-24 px-8 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-white tracking-tight">
          {tr.faq.title}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tr.faq.items.map((item) => (
            <FAQItem key={item.question} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}

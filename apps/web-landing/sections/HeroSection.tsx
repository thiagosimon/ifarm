'use client'

import { PlayCircle, TrendingUp, Wheat } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export default function HeroSection() {
  const { tr } = useLanguage()
  const h = tr.hero

  return (
    <section className="relative min-h-[850px] flex items-center overflow-hidden px-8 pt-20">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <img
          alt="Modern professional farmer"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKMtYP2ZK6nJrtL0Dj9PJkjwPZhs37Rje5FnqRQZttUS24RRbomuTuU5axjIO9D_85FR357u3BW8_w7nCWLEpgKaX6jca-51-ur2ZLn-23UTmuo9SI22837_zQpkqxlRZsn1QLedSD70K00Hcu30YGCnTWH5Cp5_OFa0McvYtpUciwow0OWoccjRY4ssjIXeIh82MpPq_dQgHxhBBvejjEArWOII_cLrq-6wySxCGg1ZUp4_K-h2iN_jD3D7OWntE39bw-ihnlN7xT"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-col lg:flex-row gap-16 items-center">
        {/* Left: text */}
        <div className="flex-1 space-y-8 text-left">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-container/30 border border-primary/20 text-primary font-semibold text-sm tracking-wide uppercase">
            {h.badge}
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tighter">
            {h.title1} <span className="text-primary italic">{h.titleHighlight}</span> {h.title2}
          </h1>
          <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed">{h.subtitle}</p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-8 py-4 bg-primary text-on-primary font-bold rounded-xl hover:shadow-[0_0_20px_rgba(137,216,158,0.4)] transition-all">
              {h.cta1}
            </button>
            <button className="px-8 py-4 bg-surface-container border border-outline/30 text-white font-bold rounded-xl hover:bg-surface-container-highest transition-all flex items-center gap-2">
              <PlayCircle size={18} /> {h.cta2}
            </button>
          </div>
        </div>

        {/* Right: dashboard mockup */}
        <div className="flex-[1.2] hidden lg:block w-full">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="glass-card p-4 rounded-3xl relative z-10 shadow-2xl overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-surface-container-lowest/80 rounded-2xl p-2 mb-2 flex items-center gap-2 border border-white/5">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-error" />
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="text-[10px] text-on-surface-variant font-mono uppercase tracking-widest">
                  {h.dashboardLabel}
                </div>
              </div>

              {/* Dashboard image */}
              <img
                alt="Dashboard Panel"
                className="rounded-xl w-full h-[520px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcsoxZyNzU32w8uM7-1FuamZw5natBLnjc3aor0akpGGxP2nnIieyljmGeRVV1laHotn8B7bCILjv-0kib5nhZl1i3nuRwIC1ZvXy0_AdIhG4zvLjnSC40PWL4ulJmJo3XQGbTz0s3C145NWlT-oyfAQks4MJgM1wNxv36KdZqju67PcJf6wkyAoABzwbS_2JTjY70N2TwjQ_FMFxxLeUKy6rGXN2VjBwUS6HG1HKtUxdX9QNUwC-sN9S7oZpVhKe8jinop1mMJ4st"
              />

              {/* Market volume floating card */}
              <div className="absolute bottom-10 left-10 glass-card p-6 rounded-2xl shadow-2xl max-w-[240px] border-primary/20 bg-surface-container/90">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <TrendingUp size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {h.marketVolumeLabel}
                  </span>
                </div>
                <div className="text-primary font-black text-3xl">{h.marketVolumeValue}</div>
                <div className="text-[10px] text-on-surface-variant uppercase mt-1">
                  {h.marketVolumeSub}
                </div>
              </div>

              {/* Active quote floating card */}
              <div className="absolute top-20 right-10 glass-card p-4 rounded-2xl shadow-2xl border-white/10 bg-surface-container/90 backdrop-blur-xl">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Wheat size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-on-surface-variant font-bold uppercase">
                      {h.activeQuoteLabel}
                    </div>
                    <div className="text-white text-sm font-semibold">{h.activeQuoteName}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

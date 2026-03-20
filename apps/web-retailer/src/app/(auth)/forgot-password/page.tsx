'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Leaf, Mail, ShieldCheck, Globe, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const t = useTranslations('forgotPassword');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [identifier, setIdentifier] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate API call — wire to backend reset endpoint when available
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex items-center justify-center p-4 bg-agro-overlay relative">
      <main className="w-full max-w-[440px] z-10">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Leaf className="h-8 w-8 text-on-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            iFarm <span className="text-primary">Lojista</span>
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm font-medium">
            Portal de Gestão Agro B2B
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-xl shadow-2xl">
          {sent ? (
            /* Success state */
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-black text-on-surface">{t('successTitle')}</h2>
              <p className="text-sm text-on-surface-variant">{t('successMessage')}</p>
              <a href="/login" className="w-full mt-4">
                <Button className="w-full py-4 text-sm font-bold uppercase tracking-wider" size="lg">
                  {t('successAction')}
                </Button>
              </a>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-6">
                <h2 className="text-xl font-black text-on-surface">{t('title')}</h2>
                <p className="mt-1 text-sm text-on-surface-variant">{t('subtitle')}</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1"
                    htmlFor="identifier"
                  >
                    {t('emailLabel')}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                      id="identifier"
                      name="identifier"
                      placeholder={t('emailPlaceholder')}
                      required
                      type="text"
                      autoComplete="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20"
                  size="lg"
                  loading={loading}
                >
                  {t('submit')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <a
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('backToLogin')}
                </a>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="flex justify-center space-x-6 mt-6">
            <div className="flex items-center text-[10px] text-on-surface-variant/40 uppercase tracking-tighter">
              <ShieldCheck className="h-4 w-4 mr-1" />
              Ambiente Seguro
            </div>
            <div className="flex items-center text-[10px] text-on-surface-variant/40 uppercase tracking-tighter">
              <Globe className="h-4 w-4 mr-1" />
              Portal B2B v2.4
            </div>
          </div>
        </footer>
      </main>

      {/* Decorative background glow */}
      <div className="fixed top-0 right-0 -z-0 opacity-20 pointer-events-none">
        <svg fill="none" height="600" viewBox="0 0 600 600" width="600">
          <circle cx="450" cy="150" fill="url(#grad1)" r="300" />
          <defs>
            <radialGradient
              cx="0"
              cy="0"
              gradientTransform="translate(450 150) rotate(90) scale(300)"
              gradientUnits="userSpaceOnUse"
              id="grad1"
              r="1"
            >
              <stop stopColor="#89d89e" />
              <stop offset="1" stopColor="#1A6B3C" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

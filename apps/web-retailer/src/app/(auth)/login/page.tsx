'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Leaf, User, Lock, Eye, EyeOff, ShieldCheck, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const t = useTranslations('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleKeycloakLogin() {
    setLoading(true);
    await signIn('keycloak', { callbackUrl: '/dashboard' });
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
            iFarm <span className="text-primary">{t('brandSuffix')}</span>
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm font-medium">
            {t('subtitle')}
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 rounded-xl shadow-2xl">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleKeycloakLogin();
            }}
          >
            {/* Identifier field */}
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1"
                htmlFor="identifier"
              >
                {t('identifierLabel')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                  id="identifier"
                  name="identifier"
                  placeholder={t('identifierPlaceholder')}
                  required
                  type="text"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label
                  className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant"
                  htmlFor="password"
                >
                  {t('passwordLabel')}
                </label>
                <a
                  className="text-xs font-semibold text-primary hover:brightness-125 transition-colors"
                  href="#"
                >
                  {t('forgotPassword')}
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  className="block w-full pl-11 pr-12 py-3.5 bg-surface-container-low border border-outline-variant text-on-surface rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline-variant"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                />
                <button
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-on-surface"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label
                className="ml-2 block text-sm text-on-surface-variant"
                htmlFor="remember-me"
              >
                {t('rememberDevice')}
              </label>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full py-4 text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20"
              size="lg"
              loading={loading}
            >
              {t('submit')}
            </Button>
          </form>

          {/* Register link */}
          <div className="mt-8 pt-8 border-t border-outline-variant/30 text-center">
            <p className="text-sm text-on-surface-variant">
              {t('noAccount')}{' '}
              <a
                className="font-bold text-secondary hover:brightness-125 transition-colors ml-1"
                href="#"
              >
                {t('createAccount')}
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-on-surface-variant/60 font-medium">
            © {new Date().getFullYear()} iFarm. {t('footerRights')}
            <br />
            {t('needHelp')}{' '}
            <a
              className="text-on-surface-variant hover:text-white underline decoration-primary underline-offset-4 ml-1"
              href="#"
            >
              {t('contactSupport')}
            </a>
          </p>
          <div className="flex justify-center space-x-6 mt-6">
            <div className="flex items-center text-[10px] text-on-surface-variant/40 uppercase tracking-tighter">
              <ShieldCheck className="h-4 w-4 mr-1" />
              {t('secureEnvironment')}
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

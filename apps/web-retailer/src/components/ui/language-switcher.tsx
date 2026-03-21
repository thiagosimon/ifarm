'use client';

import { useRef, useState, useEffect, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LOCALES = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'PT', full: 'Português (BR)' },
  { code: 'en', flag: '🇺🇸', label: 'EN', full: 'English' },
  { code: 'es', flag: '🇪🇸', label: 'ES', full: 'Español' },
] as const;

export type SupportedLocale = (typeof LOCALES)[number]['code'];

function setLocaleCookie(locale: SupportedLocale) {
  document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

interface LanguageSwitcherProps {
  /** compact = flag + 2-letter code (topbar); full = full name (settings) */
  variant?: 'compact' | 'full';
  className?: string;
}

export function LanguageSwitcher({ variant = 'compact', className }: LanguageSwitcherProps) {
  const currentLocale = useLocale() as SupportedLocale;
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === currentLocale) ?? LOCALES[0];

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSelect(code: SupportedLocale) {
    if (code === currentLocale) { setOpen(false); return; }
    setOpen(false);
    startTransition(() => {
      setLocaleCookie(code);
      window.location.reload();
    });
  }

  if (variant === 'full') {
    return (
      <select
        value={currentLocale}
        onChange={(e) => handleSelect(e.target.value as SupportedLocale)}
        className={cn(
          'w-full sm:w-64 rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary',
          className,
        )}
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.full}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className={cn('relative', className)} ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-outline-variant/40 bg-surface-container px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container-high transition-colors"
        aria-label="Selecionar idioma"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="tracking-wide">{current.label}</span>
        <ChevronDown
          size={14}
          className={cn('text-on-surface-variant transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-outline-variant bg-surface-container shadow-2xl z-50"
        >
          {LOCALES.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === currentLocale}
              onClick={() => handleSelect(l.code)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
                l.code === currentLocale
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
              )}
            >
              <span className="text-base">{l.flag}</span>
              <span>{l.full}</span>
              {l.code === currentLocale && <Check size={14} className="ml-auto text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

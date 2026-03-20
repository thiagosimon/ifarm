'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight, Home } from 'lucide-react';

const routeKeys: Record<string, string> = {
  dashboard: 'nav.dashboard',
  quotations: 'nav.quotations',
  orders: 'nav.orders',
  catalog: 'nav.catalog',
  financial: 'nav.financial',
  profile: 'nav.profile',
  kyc: 'nav.kyc',
  reviews: 'nav.reviews',
  team: 'nav.team',
  customers: 'nav.customers',
  messages: 'nav.messages',
  reports: 'nav.reports',
  shipping: 'nav.shipping',
  invoices: 'nav.invoices',
  notifications: 'nav.notifications',
  settings: 'nav.settings',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations();

  if (!pathname) return null;

  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-on-surface-variant">
      <Link
        href="/dashboard"
        className="flex items-center gap-1 hover:text-on-surface transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const key = routeKeys[segment];
        const label = key ? t(key) : segment;
        const isLast = index === segments.length - 1;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="h-3.5 w-3.5" />
            {isLast ? (
              <span className="font-medium text-on-surface">{label}</span>
            ) : (
              <Link
                href={href}
                className="hover:text-on-surface transition-colors"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Package,
  DollarSign,
  User,
  ShieldCheck,
  Star,
  Users,
  UserPlus,
  MessageSquare,
  BarChart3,
  Truck,
  FileBarChart,
  Bell,
  Settings,
  Leaf,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: '',
    items: [
      { name: 'nav.dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'nav.commercial',
    items: [
      { name: 'nav.quotations', href: '/quotations', icon: FileText },
      { name: 'nav.orders', href: '/orders', icon: ShoppingCart },
      { name: 'nav.catalog', href: '/catalog', icon: Package },
    ],
  },
  {
    label: 'nav.financial',
    items: [
      { name: 'nav.financial', href: '/financial', icon: DollarSign },
      { name: 'nav.invoices', href: '/invoices', icon: FileBarChart },
    ],
  },
  {
    label: 'nav.relationships',
    items: [
      { name: 'nav.customers', href: '/customers', icon: UserPlus },
      { name: 'nav.reviews', href: '/reviews', icon: Star },
      { name: 'nav.messages', href: '/messages', icon: MessageSquare },
    ],
  },
  {
    label: 'nav.management',
    items: [
      { name: 'nav.team', href: '/team', icon: Users },
      { name: 'nav.reports', href: '/reports', icon: BarChart3 },
      { name: 'nav.shipping', href: '/shipping', icon: Truck },
    ],
  },
  {
    label: 'nav.account',
    items: [
      { name: 'nav.profile', href: '/profile', icon: User },
      { name: 'nav.kyc', href: '/kyc', icon: ShieldCheck },
      { name: 'nav.notifications', href: '/notifications', icon: Bell },
      { name: 'nav.settings', href: '/settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-surface-container-lowest shadow-xl flex flex-col z-50">
      {/* Brand */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="h-5 w-5 text-on-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-primary tracking-tight">iFarm B2B</h1>
            <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
              Portal do Lojista
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-thin">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            {group.label && (
              <>
                <div className="h-px bg-outline-variant/30 my-2 mx-4" />
                <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                  {t(group.label)}
                </p>
              </>
            )}
            {group.items.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200',
                    isActive
                      ? 'bg-primary-container/20 text-primary border-r-4 border-primary font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/30'
                  )}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-primary')} />
                  <span>{t(item.name)}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-outline-variant/30">
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-lg bg-surface-container/50 hover:bg-surface-container transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-xs">
            AC
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-semibold text-on-surface truncate">AgroComercial Silva</p>
            <p className="text-[9px] text-on-surface-variant truncate uppercase">Admin Dashboard</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}

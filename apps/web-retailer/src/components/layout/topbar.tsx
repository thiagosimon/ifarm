'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, User, LogOut, Settings, ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nova cotação recebida',
    message: 'Cotação #1234 de Fazenda Boa Vista aguardando proposta.',
    read: false,
    createdAt: '2026-03-18T10:30:00Z',
  },
  {
    id: '2',
    title: 'Pedido confirmado',
    message: 'Pedido #5678 foi confirmado pelo produtor.',
    read: false,
    createdAt: '2026-03-18T09:15:00Z',
  },
  {
    id: '3',
    title: 'Pagamento liberado',
    message: 'Repasse de R$ 4.500,00 liberado para sua conta.',
    read: true,
    createdAt: '2026-03-17T16:00:00Z',
  },
];

export function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant/50 bg-background/80 backdrop-blur-md px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
          <input
            type="text"
            placeholder={t('topbar.search')}
            className="w-full rounded-lg border border-outline-variant bg-surface-container py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <Bell className="h-5 w-5 text-on-surface-variant" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-on-secondary border-2 border-background">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-outline-variant bg-surface-container shadow-2xl">
              <div className="border-b border-outline-variant/50 p-3">
                <h3 className="text-sm font-semibold text-on-surface">{t('topbar.notifications')}</h3>
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'border-b border-outline-variant/30 p-3 last:border-0 hover:bg-surface-container-high/50 cursor-pointer transition-colors',
                      !notification.read && 'bg-primary-container/10'
                    )}
                  >
                    <p className="text-sm font-medium text-on-surface">{notification.title}</p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-outline-variant/50 p-2">
                <Link
                  href="/notifications"
                  className="block w-full rounded-md p-1.5 text-center text-xs font-medium text-primary hover:bg-surface-container-high transition-colors"
                >
                  {t('topbar.viewAllNotifications')}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-surface-container-high transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-on-surface">Lojista iFarm</p>
              <p className="text-xs text-on-surface-variant">lojista@ifarm.com.br</p>
            </div>
            <ChevronDown className="h-4 w-4 text-on-surface-variant" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-outline-variant bg-surface-container shadow-2xl">
              <div className="p-1">
                <Link
                  href="/settings"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  {t('nav.settings')}
                </Link>
                <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-error hover:bg-error-container/20 transition-colors">
                  <LogOut className="h-4 w-4" />
                  {t('topbar.logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

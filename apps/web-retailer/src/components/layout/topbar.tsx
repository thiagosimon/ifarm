'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    title: 'Nova cotacao recebida',
    message: 'Cotacao #1234 de Fazenda Boa Vista aguardando proposta.',
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
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-sm text-muted-foreground">
          Painel do Lojista
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-border bg-white shadow-lg">
              <div className="border-b border-border p-3">
                <h3 className="text-sm font-semibold">Notificacoes</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'border-b border-border p-3 last:border-0 hover:bg-muted/50 cursor-pointer',
                      !notification.read && 'bg-primary-50/50'
                    )}
                  >
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-2">
                <button className="w-full rounded-md p-1.5 text-center text-xs font-medium text-primary-500 hover:bg-muted">
                  Ver todas as notificacoes
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
              <User className="h-4 w-4 text-primary-600" />
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium">Lojista iFarm</p>
              <p className="text-xs text-muted-foreground">lojista@ifarm.com.br</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-border bg-white shadow-lg">
              <div className="p-1">
                <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors">
                  <Settings className="h-4 w-4" />
                  Configuracoes
                </button>
                <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive-500 hover:bg-destructive-50 transition-colors">
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bell, FileText, ShoppingCart, DollarSign, AlertTriangle, Check, X, CheckCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'quotes' | 'orders' | 'financial';

interface Notification {
  id: string;
  type: 'newQuote' | 'acceptedProposal' | 'paymentConfirmed' | 'inventoryAlert' | 'orderDispatched';
  title: string;
  description: string;
  time: string;
  read: boolean;
  group: 'today' | 'yesterday' | 'older';
}

const NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'newQuote', title: 'Nova cotação recebida', description: 'Fazenda Santa Maria solicitou cotação de 500 sacas de soja', time: '10 min', read: false, group: 'today' },
  { id: '2', type: 'paymentConfirmed', title: 'Pagamento confirmado', description: 'Pagamento de R$ 45.000,00 via PIX — Pedido #1847', time: '32 min', read: false, group: 'today' },
  { id: '3', type: 'orderDispatched', title: 'Pedido despachado', description: 'Pedido #1842 saiu para entrega — Transportadora LogExpress', time: '1h', read: false, group: 'today' },
  { id: '4', type: 'inventoryAlert', title: 'Alerta de estoque', description: 'Fertilizante NPK 10-10-10 abaixo do estoque mínimo (15 unidades)', time: '2h', read: true, group: 'today' },
  { id: '5', type: 'acceptedProposal', title: 'Proposta aceita', description: 'Cooperativa Verde aceitou sua proposta — Cotação #COT-2024-156', time: '5h', read: true, group: 'today' },
  { id: '6', type: 'newQuote', title: 'Nova cotação recebida', description: 'Sítio Boa Vista solicitou cotação de 200 sacas de milho', time: 'ontem 15:30', read: true, group: 'yesterday' },
  { id: '7', type: 'paymentConfirmed', title: 'Pagamento confirmado', description: 'Pagamento de R$ 12.500,00 via boleto — Pedido #1839', time: 'ontem 11:20', read: true, group: 'yesterday' },
  { id: '8', type: 'orderDispatched', title: 'Pedido entregue', description: 'Pedido #1835 entregue com sucesso — Assinatura confirmada', time: 'ontem 09:00', read: true, group: 'yesterday' },
];

const TYPE_ICON: Record<Notification['type'], React.ElementType> = {
  newQuote: FileText,
  acceptedProposal: Check,
  paymentConfirmed: DollarSign,
  inventoryAlert: AlertTriangle,
  orderDispatched: ShoppingCart,
};

const TYPE_COLOR: Record<Notification['type'], string> = {
  newQuote: 'bg-primary/20 text-primary',
  acceptedProposal: 'bg-emerald-500/20 text-emerald-400',
  paymentConfirmed: 'bg-secondary/20 text-secondary',
  inventoryAlert: 'bg-red-500/20 text-red-400',
  orderDispatched: 'bg-blue-500/20 text-blue-400',
};

const TYPE_FILTER: Record<Notification['type'], FilterType> = {
  newQuote: 'quotes',
  acceptedProposal: 'quotes',
  paymentConfirmed: 'financial',
  inventoryAlert: 'financial',
  orderDispatched: 'orders',
};

export default function NotificationsPage() {
  const t = useTranslations('notifications');
  const tc = useTranslations('common');
  const [filter, setFilter] = useState<FilterType>('all');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const filtered = filter === 'all' ? notifications : notifications.filter(n => TYPE_FILTER[n.type] === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const todayItems = filtered.filter(n => n.group === 'today');
  const yesterdayItems = filtered.filter(n => n.group === 'yesterday');

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('tabs.all') },
    { key: 'quotes', label: t('tabs.quotes') },
    { key: 'orders', label: t('tabs.orders') },
    { key: 'financial', label: t('tabs.financial') },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-on-surface-variant mt-1">
              {unreadCount} {tc('new').toLowerCase()}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead} className="gap-2">
          <CheckCheck className="h-4 w-4" />
          {t('markAllRead')}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              filter === f.key
                ? 'bg-primary text-on-primary'
                : 'bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Today */}
      {todayItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">{t('today')}</h3>
          <div className="space-y-2">
            {todayItems.map(n => {
              const Icon = TYPE_ICON[n.type];
              return (
                <Card key={n.id} className={cn('glass-card transition-all', !n.read && 'border-l-4 border-l-primary')}>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', TYPE_COLOR[n.type])}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn('text-sm', !n.read ? 'font-semibold text-on-surface' : 'text-on-surface-variant')}>{n.title}</p>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                      </div>
                      <p className="text-sm text-on-surface-variant mt-0.5 truncate">{n.description}</p>
                      <p className="text-xs text-on-surface-variant/60 mt-1">{n.time}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {!n.read && (
                        <Button variant="ghost" size="sm" onClick={() => markRead(n.id)} className="h-8 w-8 p-0">
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => dismiss(n.id)} className="h-8 w-8 p-0 text-on-surface-variant hover:text-red-400">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Yesterday */}
      {yesterdayItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">{t('yesterday')}</h3>
          <div className="space-y-2">
            {yesterdayItems.map(n => {
              const Icon = TYPE_ICON[n.type];
              return (
                <Card key={n.id} className="glass-card transition-all">
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', TYPE_COLOR[n.type])}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-on-surface-variant">{n.title}</p>
                      <p className="text-sm text-on-surface-variant/80 mt-0.5 truncate">{n.description}</p>
                      <p className="text-xs text-on-surface-variant/60 mt-1">{n.time}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => dismiss(n.id)} className="h-8 w-8 p-0 text-on-surface-variant hover:text-red-400 shrink-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="h-12 w-12 text-on-surface-variant/40 mb-4" />
            <p className="text-on-surface-variant">{tc('noResults')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Truck, Package, MapPin, Clock, CheckCircle2, ArrowRight,
  Search, Weight, CalendarClock, ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { cn } from '@/lib/utils';

type ShippingStatus = 'pending' | 'inTransit' | 'delivered';
type Tab = 'all' | ShippingStatus;

interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingCode: string;
  origin: string;
  destination: string;
  weight: string;
  estimatedDelivery: string;
  status: ShippingStatus;
  lastUpdate: string;
}

const STATUS_CONFIG: Record<ShippingStatus, { icon: React.ElementType; color: string; badgeClass: string }> = {
  pending: { icon: Clock, color: 'text-secondary', badgeClass: 'bg-secondary/20 text-secondary border-secondary/30' },
  inTransit: { icon: Truck, color: 'text-blue-400', badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  delivered: { icon: CheckCircle2, color: 'text-emerald-400', badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
};

const SHIPMENTS: Shipment[] = [
  { id: 'SH001', orderId: 'PED-2024-0042', carrier: 'Patrus Transportes', trackingCode: 'PTR20240118001', origin: 'Ribeirão Preto, SP', destination: 'Uberlândia, MG', weight: '12.500 kg', estimatedDelivery: '2024-01-25', status: 'inTransit', lastUpdate: 'Em trânsito - Franca, SP' },
  { id: 'SH002', orderId: 'PED-2024-0039', carrier: 'JSL Logística', trackingCode: 'JSL20240115002', origin: 'Campinas, SP', destination: 'Goiânia, GO', weight: '8.200 kg', estimatedDelivery: '2024-01-23', status: 'inTransit', lastUpdate: 'Saiu para entrega' },
  { id: 'SH003', orderId: 'PED-2024-0045', carrier: 'Transporte Rodominas', trackingCode: '', origin: 'Uberaba, MG', destination: 'Maringá, PR', weight: '5.800 kg', estimatedDelivery: '2024-01-28', status: 'pending', lastUpdate: 'Aguardando coleta' },
  { id: 'SH004', orderId: 'PED-2024-0037', carrier: 'Patrus Transportes', trackingCode: 'PTR20240110003', origin: 'Ribeirão Preto, SP', destination: 'São José do Rio Preto, SP', weight: '3.400 kg', estimatedDelivery: '2024-01-15', status: 'delivered', lastUpdate: 'Entregue - 15/01/2024 às 10:30' },
  { id: 'SH005', orderId: 'PED-2024-0035', carrier: 'Braspress', trackingCode: 'BRP20240108004', origin: 'Sorocaba, SP', destination: 'Campinas, SP', weight: '1.200 kg', estimatedDelivery: '2024-01-12', status: 'delivered', lastUpdate: 'Entregue - 12/01/2024 às 14:15' },
];

export default function ShippingPage() {
  const t = useTranslations('shipping');
  const tc = useTranslations('common');
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');

  const filtered = SHIPMENTS
    .filter(s => tab === 'all' || s.status === tab)
    .filter(s =>
      s.orderId.toLowerCase().includes(search.toLowerCase()) ||
      s.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      s.carrier.toLowerCase().includes(search.toLowerCase())
    );

  const count = (status: ShippingStatus) => SHIPMENTS.filter(s => s.status === status).length;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div>
        <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
        <p className="text-sm text-on-surface-variant mt-1">{t('subtitle')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {(['pending', 'inTransit', 'delivered'] as ShippingStatus[]).map(status => {
          const { icon: Icon, color } = STATUS_CONFIG[status];
          return (
            <Card key={status} className="glass-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant/50', color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-on-surface">{count(status)}</p>
                  <p className="text-xs text-on-surface-variant">{t(`tabs.${status}`)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {(['all', 'pending', 'inTransit', 'delivered'] as Tab[]).map(t2 => (
            <Button
              key={t2}
              variant={tab === t2 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTab(t2)}
            >
              {t2 === 'all' ? tc('all') : t(`tabs.${t2}`)}
              {t2 !== 'all' && <span className="ml-1 text-xs opacity-70">({count(t2 as ShippingStatus)})</span>}
            </Button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <Input
            placeholder={tc('search') + '...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="space-y-3">
        {filtered.map(shipment => {
          const { icon: StatusIcon, badgeClass } = STATUS_CONFIG[shipment.status];
          return (
            <Card key={shipment.id} className="glass-card hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Left: Order + Tracking */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={badgeClass}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {t(`tabs.${shipment.status}`)}
                      </Badge>
                      <span className="text-sm font-medium text-on-surface">{shipment.orderId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Truck className="h-4 w-4 shrink-0" />
                      <span>{t('carrier')}: {shipment.carrier}</span>
                    </div>
                    {shipment.trackingCode && (
                      <div className="flex items-center gap-2 text-sm text-on-surface-variant mt-1">
                        <Package className="h-4 w-4 shrink-0" />
                        <span>{t('trackingCode')}: <code className="text-primary">{shipment.trackingCode}</code></span>
                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Center: Route */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="whitespace-nowrap">{shipment.origin}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-on-surface-variant/40 shrink-0" />
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <MapPin className="h-4 w-4 text-secondary shrink-0" />
                      <span className="whitespace-nowrap">{shipment.destination}</span>
                    </div>
                  </div>

                  {/* Right: Details */}
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant shrink-0">
                    <div className="flex items-center gap-1">
                      <Weight className="h-4 w-4" />
                      <span>{shipment.weight}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarClock className="h-4 w-4" />
                      <span>{new Date(shipment.estimatedDelivery).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant/60 mt-3 border-t border-outline-variant/20 pt-2">
                  {shipment.lastUpdate}
                </p>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="glass-card">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Truck className="h-12 w-12 text-on-surface-variant/40 mb-4" />
              <p className="text-on-surface-variant">{tc('noResults')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

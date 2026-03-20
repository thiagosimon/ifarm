'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Users, UserPlus, Search, Mail, Phone, MapPin, ShoppingBag,
  DollarSign, MoreVertical, ArrowUpDown, TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { cn, formatCurrency } from '@/lib/utils';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  lastOrder: string;
  totalSpent: number;
  orders: number;
  status: 'active' | 'inactive';
}

const CUSTOMERS: Customer[] = [
  { id: '1', name: 'Fazenda Santa Clara', email: 'contato@santaclara.agr.br', phone: '(16) 99123-4567', city: 'Ribeirão Preto', state: 'SP', lastOrder: '2024-01-18', totalSpent: 245800, orders: 12, status: 'active' },
  { id: '2', name: 'Agropecuária Três Rios', email: 'compras@tresrios.com.br', phone: '(34) 98876-5432', city: 'Uberlândia', state: 'MG', lastOrder: '2024-01-15', totalSpent: 189500, orders: 8, status: 'active' },
  { id: '3', name: 'Cooperativa do Cerrado', email: 'adm@coopcerrado.coop.br', phone: '(62) 3555-7890', city: 'Goiânia', state: 'GO', lastOrder: '2024-01-10', totalSpent: 312400, orders: 15, status: 'active' },
  { id: '4', name: 'Sítio Bela Vista', email: 'belavista@email.com', phone: '(19) 99765-4321', city: 'Campinas', state: 'SP', lastOrder: '2024-01-08', totalSpent: 78900, orders: 4, status: 'active' },
  { id: '5', name: 'Granja Esperança', email: 'granja@esperanca.com.br', phone: '(44) 98234-5678', city: 'Maringá', state: 'PR', lastOrder: '2023-12-20', totalSpent: 52300, orders: 3, status: 'inactive' },
  { id: '6', name: 'Haras Monte Alegre', email: 'haras@montealegre.com', phone: '(15) 99888-1234', city: 'Sorocaba', state: 'SP', lastOrder: '2023-11-05', totalSpent: 34200, orders: 2, status: 'inactive' },
];

const KPIs = [
  { key: 'totalCustomers', value: '156', icon: Users, color: 'text-primary' },
  { key: 'activeCustomers', value: '142', icon: TrendingUp, color: 'text-emerald-400' },
  { key: 'newThisMonth', value: '8', icon: UserPlus, color: 'text-blue-400' },
  { key: 'avgTicket', value: formatCurrency(18450), icon: DollarSign, color: 'text-secondary' },
];

export default function CustomersPage() {
  const t = useTranslations('customers');
  const tc = useTranslations('common');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filtered = CUSTOMERS
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{t('subtitle')}</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          {t('addCustomer')}
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        {KPIs.map(kpi => (
          <Card key={kpi.key} className="glass-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant/50', kpi.color)}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface">{kpi.value}</p>
                <p className="text-xs text-on-surface-variant">{t(kpi.key)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <Input
            placeholder={t('search') + '...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? tc('all') : t(`status.${f}`)}
            </Button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <Card className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  <button className="flex items-center gap-1 hover:text-on-surface">
                    {t('fields.name')} <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider hidden md:table-cell">{t('fields.city')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">{t('fields.lastOrder')}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-on-surface-variant uppercase tracking-wider">{t('fields.totalSpent')}</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">{t('fields.orders')}</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-surface-variant/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-xs">
                        {customer.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-on-surface truncate">{customer.name}</p>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {customer.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-on-surface-variant flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {customer.city}/{customer.state}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-on-surface-variant hidden lg:table-cell">
                    {new Date(customer.lastOrder).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-on-surface">{formatCurrency(customer.totalSpent)}</span>
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span className="flex items-center justify-center gap-1 text-sm text-on-surface-variant">
                      <ShoppingBag className="h-3 w-3" /> {customer.orders}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={customer.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {t(`status.${customer.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-on-surface-variant/40 mb-4" />
            <p className="text-on-surface-variant">{tc('noResults')}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

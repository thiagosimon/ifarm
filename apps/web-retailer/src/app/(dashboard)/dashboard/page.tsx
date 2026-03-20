'use client';

import React from 'react';
import {
  FileText,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  ShoppingCart,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { useTranslations } from 'next-intl';
import { formatCurrency, formatDate } from '@/lib/utils';

// ---------- Mock Data ----------

const kpis = [
  { key: 'quotations', value: '142', change: '+12%', trend: 'up' as const, icon: FileText, span: 1 },
  { key: 'conversion', value: '18.4%', change: '-2%', trend: 'down' as const, icon: TrendingUp, span: 1 },
  { key: 'inProgress', value: '28', change: '+5', trend: 'up' as const, icon: ShoppingCart, span: 1 },
  { key: 'revenue', value: 'R$ 84.2k', change: '+23%', trend: 'up' as const, icon: DollarSign, span: 1 },
  { key: 'avgTicket', value: 'R$ 2.450', change: '+8%', trend: 'up' as const, icon: Clock, span: 1 },
  { key: 'rating', value: '4.8', change: '+0.2', trend: 'up' as const, icon: Star, span: 1 },
];

const salesByDay = [
  { day: 'Seg', value: 4200 },
  { day: 'Ter', value: 6800 },
  { day: 'Qua', value: 5100 },
  { day: 'Qui', value: 8900, active: true },
  { day: 'Sex', value: 7200 },
  { day: 'Sab', value: 3100 },
  { day: 'Dom', value: 1800 },
];

const topProducts = [
  { name: 'NPK 04-14-08 — Yara', units: 340, price: 'R$ 2.890', img: '🌱' },
  { name: 'Glifosato 480g/L — Nortox', units: 280, price: 'R$ 1.450', img: '🧪' },
  { name: 'Semente Soja TMG 7063', units: 220, price: 'R$ 3.200', img: '🌿' },
  { name: 'MAP Purificado — Mosaic', units: 180, price: 'R$ 4.100', img: '💎' },
  { name: 'KCl Granulado — ICL', units: 150, price: 'R$ 2.350', img: '🔶' },
];

interface Quotation {
  id: string;
  number: string;
  farmer: string;
  location: string;
  product: string;
  total: number;
  urgency: 'urgent' | 'normal' | 'low';
  status: 'pending' | 'responded' | 'accepted' | 'expired';
  createdAt: string;
}

const recentQuotations: Quotation[] = [
  { id: '1', number: 'COT-2026-001234', farmer: 'Fazenda Boa Vista', location: 'Uberlândia, MG', product: 'Fertilizantes NPK', total: 15800, urgency: 'urgent', status: 'pending', createdAt: '2026-03-18T10:30:00Z' },
  { id: '2', number: 'COT-2026-001233', farmer: 'Sítio São José', location: 'Ribeirão Preto, SP', product: 'Sementes Soja', total: 28500, urgency: 'normal', status: 'pending', createdAt: '2026-03-18T09:45:00Z' },
  { id: '3', number: 'COT-2026-001232', farmer: 'Faz. Esperança', location: 'Rondonópolis, MT', product: 'Defensivos', total: 42000, urgency: 'normal', status: 'responded', createdAt: '2026-03-18T08:15:00Z' },
  { id: '4', number: 'COT-2026-001231', farmer: 'Agrop. Sol Nascente', location: 'Cascavel, PR', product: 'Fertilizantes', total: 19200, urgency: 'low', status: 'accepted', createdAt: '2026-03-17T16:30:00Z' },
  { id: '5', number: 'COT-2026-001230', farmer: 'Fazenda Sta. Maria', location: 'Sorriso, MT', product: 'Sementes', total: 56700, urgency: 'normal', status: 'expired', createdAt: '2026-03-17T14:00:00Z' },
];

const urgencyMap: Record<string, { label: string; className: string }> = {
  urgent: { label: 'URGENTE', className: 'bg-error-container/20 text-error text-[10px] font-bold px-2 py-0.5 rounded-full' },
  normal: { label: 'NORMAL', className: 'bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded-full' },
  low: { label: 'BAIXA', className: 'bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full' },
};

const statusMap: Record<string, { label: string; variant: 'pending' | 'active' | 'expired' | 'success' }> = {
  pending: { label: 'Pendente', variant: 'pending' },
  responded: { label: 'Respondida', variant: 'active' },
  accepted: { label: 'Aceita', variant: 'success' },
  expired: { label: 'Expirada', variant: 'expired' },
};

// ---------- Custom Tooltip ----------

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-outline-variant/30 bg-surface-container-highest px-3 py-2 text-xs shadow-lg">
      <p className="font-bold text-on-surface">{label}</p>
      <p className="text-primary">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

// ---------- Component ----------

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs />
          <h2 className="mt-2 text-2xl font-black text-on-surface">{t('executiveSummary')}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 border-outline-variant/30 text-on-surface-variant">
            <Calendar className="h-4 w-4" />
            {t('last30days')}
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            {t('exportReport')}
          </Button>
        </div>
      </div>

      {/* KPI Bento Grid — 6 columns */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.key}
            className="group rounded-xl border border-outline-variant/30 bg-surface-container-low p-5 shadow-subtle-green transition-colors hover:border-primary/50"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 p-2">
                <kpi.icon className="h-4 w-4 text-primary" />
              </div>
              <span
                className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  kpi.trend === 'up'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-error/10 text-error'
                }`}
              >
                {kpi.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {kpi.change}
              </span>
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t(`kpi.${kpi.key}`)}
            </p>
            <p className="mt-1 text-2xl font-black text-on-surface">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row — 2/3 + 1/3 */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sales by Day Bar Chart */}
        <div className="col-span-2 rounded-xl border border-outline-variant/30 bg-surface-container-low p-6 shadow-subtle-green">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                {t('salesByDay')}
              </h3>
              <p className="mt-1 text-xs text-on-surface-variant/70">{t('currentWeek')}</p>
            </div>
            <span className="text-xl font-black text-on-surface">R$ 37.100</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesByDay} barSize={40}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#bfc9be', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis hide />
                <Tooltip content={<ChartTooltip />} cursor={false} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {salesByDay.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={entry.active ? '#89d89e' : 'rgba(137,216,158,0.1)'}
                      style={entry.active ? { filter: 'drop-shadow(0 0 8px rgba(137,216,158,0.4))' } : undefined}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products List */}
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6 shadow-subtle-green">
          <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-on-surface-variant">
            {t('topProducts')}
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container text-lg">
                  {product.img}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-on-surface">{product.name}</p>
                  <p className="text-xs text-on-surface-variant">{product.units} {t('unitsSold')}</p>
                </div>
                <span className="text-sm font-bold text-primary">{product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Quotations Table */}
      <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low shadow-subtle-green">
        <div className="flex items-center justify-between border-b border-outline-variant/20 p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
            {t('recentQuotations')}
          </h3>
          <Button variant="outline" size="sm" className="border-outline-variant/30 text-on-surface-variant" asChild>
            <a href="/quotations">{t('viewAll')}</a>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-outline-variant/20 bg-surface-container-highest/30">
              <TableHead className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('table.number')}</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('table.farmer')}</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('table.product')}</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('table.value')}</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('table.urgency')}</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('table.status')}</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('table.date')}</TableHead>
              <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-on-surface-variant">{t('table.action')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentQuotations.map((q) => {
              const status = statusMap[q.status];
              const urgency = urgencyMap[q.urgency];
              return (
                <TableRow key={q.id} className="border-outline-variant/10 transition-colors hover:bg-primary/5">
                  <TableCell className="font-mono text-sm font-semibold text-primary">{q.number}</TableCell>
                  <TableCell>
                    <p className="font-semibold text-on-surface">{q.farmer}</p>
                    <p className="text-xs text-on-surface-variant">{q.location}</p>
                  </TableCell>
                  <TableCell className="text-on-surface">{q.product}</TableCell>
                  <TableCell className="font-semibold text-on-surface">{formatCurrency(q.total)}</TableCell>
                  <TableCell>
                    <span className={urgency.className}>{urgency.label}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-on-surface-variant">{formatDate(q.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    {q.status === 'pending' && (
                      <Button size="sm">{t('respond')}</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

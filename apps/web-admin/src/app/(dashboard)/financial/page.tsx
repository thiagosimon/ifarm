'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Download, RefreshCw, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

const gmvData = [
  { date: '01 Out', gmv: 380000 },
  { date: '07 Out', gmv: 420000 },
  { date: '14 Out', gmv: 520000 },
  { date: '21 Out', gmv: 480000 },
  { date: '28 Out', gmv: 610000 },
  { date: '31 Out', gmv: 641366 },
];

const commissionTiers = [
  { tier: 'Platina', value: 242000, percent: 85 },
  { tier: 'Ouro', value: 180000, percent: 65 },
  { tier: 'Prata', value: 115000, percent: 45 },
  { tier: 'Bronze', value: 68000, percent: 30 },
  { tier: 'Básico', value: 36000, percent: 15 },
];

const payouts = [
  { id: '#PAY-001', farmer: 'João Oliveira', amount: 45200, status: 'Pago', date: '15 Out 2023' },
  { id: '#PAY-002', farmer: 'Maria Silva', amount: 28600, status: 'Pendente', date: '16 Out 2023' },
  { id: '#PAY-003', farmer: 'Fazenda Progresso', amount: 82100, status: 'Pago', date: '17 Out 2023' },
  { id: '#PAY-004', farmer: 'Carlos Vieira', amount: 12400, status: 'Holdback', date: '18 Out 2023' },
  { id: '#PAY-005', farmer: 'Agro Grãos SA', amount: 35800, status: 'Pago', date: '19 Out 2023' },
];

const payoutStatus: Record<string, string> = {
  Pago: 'bg-[#005229]/50 text-[#a4f5b8]',
  Pendente: 'bg-[#5c4300]/50 text-[#ffdea0]',
  Holdback: 'bg-[#93000a]/50 text-[#ffb4ab]',
};

export default function FinancialPage() {
  const [chartPeriod, setChartPeriod] = React.useState<'Diário' | 'Semanal'>('Diário');

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#f6be39] mb-2 block">
            Gestão de Ativos
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Financeiro</h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-[#181c1d] rounded-xl px-4 py-2 border border-border/10">
            <div className="flex flex-col pr-4 border-r border-border/20">
              <span className="text-[9px] font-bold uppercase text-muted-foreground">De</span>
              <span className="text-sm font-semibold">01/10/2023</span>
            </div>
            <div className="flex flex-col pl-4">
              <span className="text-[9px] font-bold uppercase text-muted-foreground">Até</span>
              <span className="text-sm font-semibold">31/10/2023</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#272B2C] hover:bg-[#313536] text-foreground font-semibold text-sm transition-all border border-border/10">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-br from-[#a4f5b8] to-[#89D89E] text-[#00391b] font-bold text-sm agro-shadow hover:opacity-90 transition-all">
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'GMV Total',
            value: 'R$ 12.847.320',
            meta: '+12.5% vs mês anterior',
            color: 'text-foreground',
            metaColor: 'text-[#a4f5b8]',
            border: 'border-[#89D89E]/30',
            icon: TrendingUp,
            iconColor: 'text-[#a4f5b8]/5',
          },
          {
            label: 'Comissões',
            value: 'R$ 641.366',
            meta: 'Margem de 4.9% média',
            color: 'text-[#f6be39]',
            metaColor: 'text-[#f6be39]',
            border: 'border-[#f6be39]/30',
            icon: TrendingUp,
            iconColor: 'text-[#f6be39]/5',
          },
          {
            label: 'Payouts Processados',
            value: 'R$ 11.203.954',
            meta: 'Atualizado há 14m',
            color: 'text-foreground',
            metaColor: 'text-muted-foreground',
            border: 'border-[#a4f5b8]/30',
            icon: CheckCircle,
            iconColor: 'text-[#a4f5b8]/5',
          },
          {
            label: 'Payouts Pendentes',
            value: 'R$ 287.420',
            meta: '12 transações em espera',
            color: 'text-[#ffb4ab]',
            metaColor: 'text-[#ffb4ab]',
            border: 'border-[#ffb4ab]/30',
            icon: AlertTriangle,
            iconColor: 'text-[#ffb4ab]/5',
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={cn('glass-card p-6 rounded-xl border-l-2 relative overflow-hidden group', card.border)}>
              <Icon className={cn('absolute top-2 right-2 h-16 w-16', card.iconColor)} />
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">
                {card.label}
              </p>
              <h3 className={cn('text-2xl font-light', card.color)}>
                <span className="font-bold">{card.value}</span>
              </h3>
              <div className={cn('mt-4 flex items-center gap-2 text-[11px] font-semibold', card.metaColor)}>
                <TrendingUp className="h-3 w-3" />
                {card.meta}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* GMV Chart */}
        <div className="lg:col-span-8 glass-card p-8 rounded-xl border border-border/5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#a4f5b8] rounded-full" />
              <h4 className="text-lg font-bold">GMV por Período</h4>
            </div>
            <div className="flex gap-2">
              {(['Diário', 'Semanal'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setChartPeriod(p)}
                  className={cn(
                    'px-3 py-1 text-[10px] font-bold rounded-full uppercase transition-colors',
                    chartPeriod === p
                      ? 'bg-[#a4f5b8]/10 text-[#a4f5b8]'
                      : 'text-muted-foreground hover:bg-[#272B2C]'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmvData}>
                <defs>
                  <linearGradient id="gmvFinancialGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a4f5b8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#a4f5b8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(137,216,158,0.05)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#899389', fontSize: 9, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={false} axisLine={false} tickLine={false} width={0} />
                <Tooltip
                  contentStyle={{
                    background: '#1c2021',
                    border: '1px solid rgba(137,216,158,0.1)',
                    borderRadius: '8px',
                    color: '#e0e3e4',
                  }}
                  formatter={(value: unknown) => [
                    formatCurrency(typeof value === 'number' ? value : Number(value) || 0),
                    'GMV',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="gmv"
                  stroke="#a4f5b8"
                  fill="url(#gmvFinancialGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commission Tiers */}
        <div className="lg:col-span-4 glass-card p-8 rounded-xl border border-border/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-[#f6be39] rounded-full" />
            <h4 className="text-lg font-bold">Comissões por Tier</h4>
          </div>
          <div className="space-y-6">
            {commissionTiers.map((tier) => (
              <div key={tier.tier} className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase">
                  <span className="text-foreground">{tier.tier}</span>
                  <span className="text-[#f6be39]">
                    R$ {(tier.value / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="w-full bg-[#0b0f10] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#f6be39] rounded-full transition-all duration-500"
                    style={{ width: `${tier.percent}%`, opacity: 0.4 + (tier.percent / 100) * 0.6 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="rounded-2xl overflow-hidden border border-border/10 agro-shadow">
        <div className="p-8 border-b border-border/10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#1c2021]">
          <div>
            <h3 className="text-xl font-semibold">Histórico de Payouts</h3>
            <p className="text-sm text-muted-foreground font-light mt-1">
              Transferências para produtores rurais após holdback
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-[#272B2C] text-muted-foreground text-sm font-semibold hover:bg-[#313536] transition-colors flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pendentes
            </button>
          </div>
        </div>
        <table className="w-full text-left border-collapse bg-[#181c1d]">
          <thead>
            <tr className="border-b border-border/10">
              {['ID Payout', 'Farmer', 'Valor', 'Status', 'Data'].map((h, i) => (
                <th
                  key={h}
                  className={cn(
                    'px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground',
                    i === 2 && 'text-right'
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/5">
            {payouts.map((payout) => (
              <tr key={payout.id} className="hover:bg-[#272B2C]/30 transition-colors">
                <td className="px-8 py-4 font-mono text-xs text-[#a4f5b8] font-semibold">{payout.id}</td>
                <td className="px-8 py-4 text-sm font-medium">{payout.farmer}</td>
                <td className="px-8 py-4 text-right font-bold text-[#f6be39]">
                  {formatCurrency(payout.amount)}
                </td>
                <td className="px-8 py-4">
                  <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase', payoutStatus[payout.status])}>
                    {payout.status}
                  </span>
                </td>
                <td className="px-8 py-4 text-sm text-muted-foreground">{payout.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

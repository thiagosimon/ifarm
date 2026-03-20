'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  FileText,
  Truck,
  CheckCircle,
  AlertTriangle,
  Wallet,
  RefreshCw,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

type Period = '7d' | '30d' | '90d' | '365d';

const gmvData = [
  { month: 'Set', gmv: 8400000, receita: 420000 },
  { month: 'Out', gmv: 9200000, receita: 460000 },
  { month: 'Nov', gmv: 10100000, receita: 505000 },
  { month: 'Dez', gmv: 11500000, receita: 575000 },
  { month: 'Jan', gmv: 10800000, receita: 540000 },
  { month: 'Fev', gmv: 11900000, receita: 595000 },
  { month: 'Mar', gmv: 12847320, receita: 641366 },
];

const ordersData = [
  { day: 'Seg', pedidos: 28, cancelados: 6 },
  { day: 'Ter', pedidos: 34, cancelados: 4 },
  { day: 'Qua', pedidos: 24, cancelados: 10 },
  { day: 'Qui', pedidos: 38, cancelados: 2 },
  { day: 'Sex', pedidos: 32, cancelados: 6 },
  { day: 'Sab', pedidos: 16, cancelados: 2 },
  { day: 'Dom', pedidos: 12, cancelados: 1 },
];

const userDistribution = [
  { name: 'Farmers', value: 1248, color: '#a4f5b8' },
  { name: 'Retailers', value: 942, color: '#f6be39' },
  { name: 'KYC Pend.', value: 415, color: '#5c4300' },
  { name: 'Suspensos', value: 242, color: 'rgba(255,180,171,0.3)' },
];

const recentActivity = [
  {
    id: 1,
    title: 'KYC aprovado',
    description: 'Fazenda Santa Helena • ID #8231',
    time: '2m atrás',
    color: 'text-[#a4f5b8]',
    bg: 'bg-[#a4f5b8]/10',
    icon: CheckCircle,
  },
  {
    id: 2,
    title: 'Novo pedido',
    description: 'Lote de Soja Transgênica • R$ 45.200',
    time: '15m atrás',
    color: 'text-[#f6be39]',
    bg: 'bg-[#f6be39]/10',
    icon: ShoppingCart,
  },
  {
    id: 3,
    title: 'Disputa aberta',
    description: 'Qualidade divergente • Pedido #0942',
    time: '1h atrás',
    color: 'text-[#ffb4ab]',
    bg: 'bg-[#ffb4ab]/10',
    icon: AlertTriangle,
  },
  {
    id: 4,
    title: 'Pagamento liberado',
    description: 'Holdback vencido • R$ 12.400',
    time: '2h atrás',
    color: 'text-[#a4f5b8]',
    bg: 'bg-[#a4f5b8]/10',
    icon: Wallet,
  },
  {
    id: 5,
    title: 'Novo usuário',
    description: 'Agro Grãos SA cadastrada',
    time: '3h atrás',
    color: 'text-[#f6be39]',
    bg: 'bg-[#f6be39]/10',
    icon: Users,
  },
];

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  valueColor?: string;
  borderColor?: string;
}

function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  iconColor,
  iconBg,
  valueColor,
  borderColor,
}: MetricCardProps) {
  const isPositive = trend > 0;
  return (
    <div
      className={cn(
        'glass-card agro-shadow rounded-xl p-6 flex flex-col justify-between',
        borderColor && `border-l-2 ${borderColor}`
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn('p-2 rounded-lg', iconBg)}>
          <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
        <span
          className={cn(
            'flex items-center text-xs font-bold px-2 py-0.5 rounded-full',
            isPositive
              ? 'text-[#a4f5b8] bg-[#a4f5b8]/10'
              : 'text-[#ffb4ab] bg-[#ffb4ab]/10'
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          {Math.abs(trend)}%
        </span>
      </div>
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground mb-1">
          {title}
        </p>
        <h3 className={cn('text-2xl font-light tracking-tighter', valueColor || 'text-foreground')}>
          {value}
        </h3>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [period, setPeriod] = React.useState<Period>('30d');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Visão geral do ecossistema iFarm</p>
        </div>
        <div className="flex items-center gap-4 bg-[#181c1d] p-1.5 rounded-xl agro-shadow">
          <div className="flex gap-1">
            {(['7d', '30d', '90d', '365d'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors',
                  period === p
                    ? 'bg-[#a4f5b8] text-[#00391b] shadow-lg'
                    : 'text-muted-foreground hover:text-[#a4f5b8]'
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-border/30" />
          <button className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#89d89e] hover:bg-[#a4f5b8]/5 rounded-lg transition-all">
            <RefreshCw className="h-3 w-3" />
            Atualizar
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="GMV Total"
          value="R$ 12.847.320"
          trend={12}
          icon={DollarSign}
          iconColor="text-[#a4f5b8]"
          iconBg="bg-[#a4f5b8]/10"
          borderColor="border-[#a4f5b8]"
        />
        <MetricCard
          title="Usuários Ativos"
          value="2.847"
          trend={8}
          icon={Users}
          iconColor="text-[#a4f5b8]"
          iconBg="bg-[#a4f5b8]/10"
        />
        <MetricCard
          title="Cotações Abertas"
          value="156"
          trend={-4}
          icon={FileText}
          iconColor="text-[#f6be39]"
          iconBg="bg-[#f6be39]/10"
        />
        <MetricCard
          title="Em Andamento"
          value="89"
          trend={21}
          icon={Truck}
          iconColor="text-[#a4f5b8]"
          iconBg="bg-[#a4f5b8]/10"
        />
        <MetricCard
          title="Receita Período"
          value="R$ 641.366"
          trend={15}
          icon={Wallet}
          iconColor="text-[#f6be39]"
          iconBg="bg-[#f6be39]/10"
          valueColor="text-[#f6be39]"
          borderColor="border-[#f6be39]"
        />
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* GMV & Revenue Area Chart */}
        <div className="lg:col-span-6 glass-card agro-shadow rounded-xl p-8 flex flex-col h-[400px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-[#f6be39] rounded-full" />
            <div>
              <h4 className="text-lg font-semibold text-foreground">GMV &amp; Receita</h4>
              <p className="text-xs text-muted-foreground">Comparativo mensal (Set - Mar)</p>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={gmvData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="gmvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a4f5b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a4f5b8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="receitaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f6be39" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f6be39" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(137,216,158,0.05)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#899389', fontSize: 10, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: '#1c2021',
                    border: '1px solid rgba(137,216,158,0.1)',
                    borderRadius: '8px',
                    color: '#e0e3e4',
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'gmv' ? 'GMV' : 'Receita',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="gmv"
                  stroke="#a4f5b8"
                  fill="url(#gmvGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="#f6be39"
                  fill="url(#receitaGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Orders Bar Chart */}
        <div className="lg:col-span-4 glass-card agro-shadow rounded-xl p-8 flex flex-col h-[400px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-[#a4f5b8] rounded-full" />
            <div>
              <h4 className="text-lg font-semibold text-foreground">Pedidos por Semana</h4>
              <p className="text-xs text-muted-foreground">Concluídos vs Cancelados</p>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(137,216,158,0.05)" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#899389', fontSize: 9, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: '#1c2021',
                    border: '1px solid rgba(137,216,158,0.1)',
                    borderRadius: '8px',
                    color: '#e0e3e4',
                  }}
                />
                <Bar dataKey="pedidos" fill="rgba(164,245,184,0.6)" radius={[3, 3, 0, 0]} name="Pedidos" />
                <Bar dataKey="cancelados" fill="rgba(255,180,171,0.4)" radius={[3, 3, 0, 0]} name="Cancelados" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-6 text-[10px] font-bold uppercase tracking-widest justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#a4f5b8]" />
              Pedidos
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ffb4ab] opacity-50" />
              Cancelados
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Row */}
      <section className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* User Distribution Donut */}
        <div className="lg:col-span-4 glass-card agro-shadow rounded-xl p-8">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-lg font-semibold text-foreground">Distribuição de Usuários</h4>
          </div>
          <div className="relative h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1c2021',
                    border: '1px solid rgba(137,216,158,0.1)',
                    borderRadius: '8px',
                    color: '#e0e3e4',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-light tracking-tighter">2.8k</span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                Total
              </span>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {userDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-muted-foreground">
                    {item.name}
                  </p>
                  <p className="text-sm font-semibold">
                    {item.value.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-6 glass-card agro-shadow rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-semibold text-foreground">Atividade Recente</h4>
            <button className="text-xs font-bold uppercase tracking-widest text-[#a4f5b8] hover:underline">
              Ver tudo
            </button>
          </div>
          <div className="space-y-6">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center justify-between group transition-all">
                  <div className="flex items-center gap-4">
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', activity.bg)}>
                      <Icon className={cn('h-5 w-5', activity.color)} />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold">{activity.title}</h5>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground/40 whitespace-nowrap ml-4">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

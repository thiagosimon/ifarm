'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DollarSign,
  Users,
  FileText,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { formatCurrency, formatCompactNumber } from '@/lib/utils';
import { fetchAdminDashboard } from '@/lib/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardMetrics {
  totalGmv: number;
  gmvChange: number;
  activeUsers: number;
  activeUsersChange: number;
  openQuotations: number;
  quotationsChange: number;
  ordersInProgress: number;
  ordersChange: number;
  periodRevenue: number;
  revenueChange: number;
}

const defaultMetrics: DashboardMetrics = {
  totalGmv: 2847500,
  gmvChange: 12.5,
  activeUsers: 1243,
  activeUsersChange: 8.3,
  openQuotations: 87,
  quotationsChange: -3.2,
  ordersInProgress: 156,
  ordersChange: 15.7,
  periodRevenue: 142375,
  revenueChange: 10.2,
};

const gmvChartData = [
  { month: 'Set', gmv: 1800000, revenue: 90000 },
  { month: 'Out', gmv: 2100000, revenue: 105000 },
  { month: 'Nov', gmv: 1950000, revenue: 97500 },
  { month: 'Dez', gmv: 2400000, revenue: 120000 },
  { month: 'Jan', gmv: 2650000, revenue: 132500 },
  { month: 'Fev', gmv: 2847500, revenue: 142375 },
];

const ordersChartData = [
  { day: 'Seg', pedidos: 42, cancelados: 3 },
  { day: 'Ter', pedidos: 38, cancelados: 2 },
  { day: 'Qua', pedidos: 55, cancelados: 5 },
  { day: 'Qui', pedidos: 47, cancelados: 1 },
  { day: 'Sex', pedidos: 62, cancelados: 4 },
  { day: 'Sab', pedidos: 28, cancelados: 2 },
  { day: 'Dom', pedidos: 15, cancelados: 0 },
];

const userDistributionData = [
  { name: 'Farmers Ativos', value: 645, color: '#22c55e' },
  { name: 'Retailers Ativos', value: 398, color: '#3b82f6' },
  { name: 'KYC Pendente', value: 120, color: '#f59e0b' },
  { name: 'Suspensos', value: 80, color: '#ef4444' },
];

const recentActivity = [
  { id: 1, type: 'kyc', message: 'Novo KYC submetido - Fazenda Bela Vista', time: '5 min' },
  { id: 2, type: 'order', message: 'Pedido #2847 confirmado - R$ 12.500,00', time: '12 min' },
  { id: 3, type: 'dispute', message: 'Disputa aberta - Pedido #2831', time: '25 min' },
  { id: 4, type: 'user', message: 'Novo retailer cadastrado - Supermercado Alvorada', time: '38 min' },
  { id: 5, type: 'payment', message: 'Payout processado - R$ 45.200,00', time: '1h' },
  { id: 6, type: 'kyc', message: 'KYC aprovado - Sitio Boa Esperanca', time: '1h 15min' },
];

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  format = 'number',
}: {
  title: string;
  value: number;
  change: number;
  icon: React.ElementType;
  format?: 'currency' | 'number';
}) {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {format === 'currency' ? formatCurrency(value) : formatCompactNumber(value)}
            </p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}
                {change}%
              </span>
              <span className="text-xs text-muted-foreground">vs periodo anterior</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = React.useState('30d');
  const [metrics, setMetrics] = React.useState<DashboardMetrics>(defaultMetrics);
  const [loading, setLoading] = React.useState(false);

  const loadDashboard = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminDashboard({ from: period });
      if (data) setMetrics(data);
    } catch {
      // Use default metrics on error
    } finally {
      setLoading(false);
    }
  }, [period]);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visao geral da plataforma iFarm</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Ultimos 7 dias</SelectItem>
              <SelectItem value="30d">Ultimos 30 dias</SelectItem>
              <SelectItem value="90d">Ultimos 90 dias</SelectItem>
              <SelectItem value="365d">Ultimo ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={loadDashboard} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="GMV Total"
          value={metrics.totalGmv}
          change={metrics.gmvChange}
          icon={DollarSign}
          format="currency"
        />
        <MetricCard
          title="Usuarios Ativos"
          value={metrics.activeUsers}
          change={metrics.activeUsersChange}
          icon={Users}
        />
        <MetricCard
          title="Cotacoes Abertas"
          value={metrics.openQuotations}
          change={metrics.quotationsChange}
          icon={FileText}
        />
        <MetricCard
          title="Pedidos em Andamento"
          value={metrics.ordersInProgress}
          change={metrics.ordersChange}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Receita do Periodo"
          value={metrics.periodRevenue}
          change={metrics.revenueChange}
          icon={TrendingUp}
          format="currency"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* GMV Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolucao do GMV e Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gmvChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name === 'gmv' ? 'GMV' : 'Receita',
                    ]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gmv"
                    stackId="1"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pedidos da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="pedidos" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cancelados" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuicao de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {userDistributionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      activity.type === 'kyc'
                        ? 'bg-blue-100 text-blue-600'
                        : activity.type === 'order'
                          ? 'bg-green-100 text-green-600'
                          : activity.type === 'dispute'
                            ? 'bg-red-100 text-red-600'
                            : activity.type === 'user'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time} atras</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

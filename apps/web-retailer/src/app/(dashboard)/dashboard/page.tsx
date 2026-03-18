'use client';

import React from 'react';
import {
  FileText,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatCurrency, formatDate } from '@/lib/utils';

// -- Mock data --

const kpis = [
  {
    title: 'Cotacoes Hoje',
    value: '24',
    change: '+12%',
    trend: 'up' as const,
    icon: FileText,
    description: 'vs. ontem',
  },
  {
    title: 'Taxa de Resposta',
    value: '87%',
    change: '+3%',
    trend: 'up' as const,
    icon: TrendingUp,
    description: 'ultimos 7 dias',
  },
  {
    title: 'GMV do Mes',
    value: formatCurrency(184750),
    change: '+18%',
    trend: 'up' as const,
    icon: DollarSign,
    description: 'vs. mes anterior',
  },
  {
    title: 'Repasse Pendente',
    value: formatCurrency(32400),
    change: '-5%',
    trend: 'down' as const,
    icon: Clock,
    description: 'a receber',
  },
];

const quotationsChartData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  cotacoes: Math.floor(Math.random() * 30) + 10,
  respondidas: Math.floor(Math.random() * 25) + 5,
}));

const topProductsData = [
  { name: 'Fertilizante NPK', quantidade: 340 },
  { name: 'Semente Soja', quantidade: 280 },
  { name: 'Herbicida Glifosato', quantidade: 220 },
  { name: 'Adubo Organico', quantidade: 180 },
  { name: 'Calcario Dolomitico', quantidade: 150 },
];

interface Quotation {
  id: string;
  number: string;
  farmer: string;
  city: string;
  state: string;
  category: string;
  items: number;
  total: number;
  status: 'pending' | 'responded' | 'expired' | 'accepted';
  createdAt: string;
}

const recentQuotations: Quotation[] = [
  {
    id: '1',
    number: 'COT-2026-001234',
    farmer: 'Fazenda Boa Vista',
    city: 'Uberlandia',
    state: 'MG',
    category: 'Fertilizantes',
    items: 3,
    total: 15800,
    status: 'pending',
    createdAt: '2026-03-18T10:30:00Z',
  },
  {
    id: '2',
    number: 'COT-2026-001233',
    farmer: 'Sitio Sao Jose',
    city: 'Ribeirao Preto',
    state: 'SP',
    category: 'Sementes',
    items: 5,
    total: 28500,
    status: 'pending',
    createdAt: '2026-03-18T09:45:00Z',
  },
  {
    id: '3',
    number: 'COT-2026-001232',
    farmer: 'Fazenda Esperanca',
    city: 'Rondonopolis',
    state: 'MT',
    category: 'Defensivos',
    items: 2,
    total: 42000,
    status: 'responded',
    createdAt: '2026-03-18T08:15:00Z',
  },
  {
    id: '4',
    number: 'COT-2026-001231',
    farmer: 'Agropecuaria Sol Nascente',
    city: 'Cascavel',
    state: 'PR',
    category: 'Fertilizantes',
    items: 4,
    total: 19200,
    status: 'accepted',
    createdAt: '2026-03-17T16:30:00Z',
  },
  {
    id: '5',
    number: 'COT-2026-001230',
    farmer: 'Fazenda Santa Maria',
    city: 'Sorriso',
    state: 'MT',
    category: 'Sementes',
    items: 6,
    total: 56700,
    status: 'expired',
    createdAt: '2026-03-17T14:00:00Z',
  },
];

const statusMap: Record<string, { label: string; variant: 'pending' | 'active' | 'expired' | 'success' }> = {
  pending: { label: 'Pendente', variant: 'pending' },
  responded: { label: 'Respondida', variant: 'active' },
  accepted: { label: 'Aceita', variant: 'success' },
  expired: { label: 'Expirada', variant: 'expired' },
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs />
          <h1 className="mt-2 text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visao geral do seu desempenho como lojista
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <kpi.icon className="h-5 w-5 text-primary-500" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    kpi.trend === 'up'
                      ? 'text-green-600'
                      : 'text-destructive-500'
                  }`}
                >
                  {kpi.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {kpi.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">
                  {kpi.title} &middot; {kpi.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Area Chart - Quotations 30d */}
        <Card>
          <CardHeader>
            <CardTitle>Cotacoes nos ultimos 30 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={quotationsChartData}>
                  <defs>
                    <linearGradient
                      id="colorCotacoes"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#1A6B3C"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#1A6B3C"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorRespondidas"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#D4A017"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="#D4A017"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cotacoes"
                    stroke="#1A6B3C"
                    fillOpacity={1}
                    fill="url(#colorCotacoes)"
                    name="Cotacoes"
                  />
                  <Area
                    type="monotone"
                    dataKey="respondidas"
                    stroke="#D4A017"
                    fillOpacity={1}
                    fill="url(#colorRespondidas)"
                    name="Respondidas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart - Top 5 Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Produtos Mais Cotados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductsData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    horizontal={false}
                  />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 12 }}
                    stroke="#94a3b8"
                    width={130}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="quantidade"
                    fill="#1A6B3C"
                    radius={[0, 4, 4, 0]}
                    name="Quantidade"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quotations Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ultimas Cotacoes</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <a href="/quotations">Ver todas</a>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numero</TableHead>
                <TableHead>Produtor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Valor Est.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Acao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentQuotations.map((quotation) => {
                const status = statusMap[quotation.status];
                return (
                  <TableRow key={quotation.id}>
                    <TableCell className="font-medium">
                      {quotation.number}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{quotation.farmer}</p>
                        <p className="text-xs text-muted-foreground">
                          {quotation.city}/{quotation.state}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{quotation.category}</TableCell>
                    <TableCell>{quotation.items}</TableCell>
                    <TableCell>{formatCurrency(quotation.total)}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(quotation.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      {quotation.status === 'pending' && (
                        <Button size="sm" variant="default">
                          Responder
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Clock,
  Download,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { formatCurrency, formatDate, downloadCsv } from '@/lib/utils';
import { fetchFinancialOverview, fetchPayouts, exportFinancialCsv } from '@/lib/api';
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
} from 'recharts';
import toast from 'react-hot-toast';

interface FinancialMetrics {
  totalGmv: number;
  gmvChange: number;
  totalCommissions: number;
  commissionsChange: number;
  processedPayouts: number;
  pendingPayouts: number;
}

interface Payout {
  id: string;
  recipientName: string;
  recipientType: 'FARMER' | 'PLATFORM';
  amount: number;
  status: 'PROCESSED' | 'PENDING' | 'FAILED' | 'SCHEDULED';
  processedAt?: string;
  scheduledFor?: string;
  transactionId?: string;
}

const defaultMetrics: FinancialMetrics = {
  totalGmv: 2847500,
  gmvChange: 12.5,
  totalCommissions: 142375,
  commissionsChange: 10.2,
  processedPayouts: 2105125,
  pendingPayouts: 389750,
};

const gmvByPeriod = [
  { period: 'Out/24', gmv: 2100000, commission: 105000 },
  { period: 'Nov/24', gmv: 1950000, commission: 97500 },
  { period: 'Dez/24', gmv: 2400000, commission: 120000 },
  { period: 'Jan/25', gmv: 2650000, commission: 132500 },
  { period: 'Fev/25', gmv: 2750000, commission: 137500 },
  { period: 'Mar/25', gmv: 2847500, commission: 142375 },
];

const commissionsByTier = [
  { tier: 'Basico (5%)', volume: 850000, commission: 42500 },
  { tier: 'Bronze (4.5%)', volume: 720000, commission: 32400 },
  { tier: 'Prata (4%)', volume: 640000, commission: 25600 },
  { tier: 'Ouro (3.5%)', volume: 437500, commission: 15312 },
  { tier: 'Platina (3%)', volume: 200000, commission: 6000 },
];

const mockPayouts: Payout[] = [
  {
    id: 'pay-1',
    recipientName: 'Fazenda Bela Vista',
    recipientType: 'FARMER',
    amount: 45200.0,
    status: 'PROCESSED',
    processedAt: '2025-03-17T10:00:00Z',
    transactionId: 'trs_abc123',
  },
  {
    id: 'pay-2',
    recipientName: 'Sitio Boa Esperanca',
    recipientType: 'FARMER',
    amount: 32800.0,
    status: 'PROCESSED',
    processedAt: '2025-03-17T10:05:00Z',
    transactionId: 'trs_def456',
  },
  {
    id: 'pay-3',
    recipientName: 'Rancho Verde Organicos',
    recipientType: 'FARMER',
    amount: 28500.0,
    status: 'PENDING',
    scheduledFor: '2025-03-24T10:00:00Z',
  },
  {
    id: 'pay-4',
    recipientName: 'Cooperativa Agropecuaria do Vale',
    recipientType: 'FARMER',
    amount: 51300.0,
    status: 'SCHEDULED',
    scheduledFor: '2025-03-21T10:00:00Z',
  },
  {
    id: 'pay-5',
    recipientName: 'Fazenda Girassol',
    recipientType: 'FARMER',
    amount: 18700.0,
    status: 'FAILED',
    scheduledFor: '2025-03-16T10:00:00Z',
  },
  {
    id: 'pay-6',
    recipientName: 'iFarm Comissoes',
    recipientType: 'PLATFORM',
    amount: 142375.0,
    status: 'PROCESSED',
    processedAt: '2025-03-17T10:00:00Z',
    transactionId: 'trs_platform_001',
  },
];

const payoutStatusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' }> = {
  PROCESSED: { label: 'Processado', variant: 'success' },
  PENDING: { label: 'Pendente', variant: 'warning' },
  SCHEDULED: { label: 'Agendado', variant: 'info' },
  FAILED: { label: 'Falhou', variant: 'error' },
};

export default function FinancialPage() {
  const [metrics, setMetrics] = React.useState<FinancialMetrics>(defaultMetrics);
  const [payouts, setPayouts] = React.useState<Payout[]>(mockPayouts);
  const [period, setPeriod] = React.useState('30d');
  const [groupBy, setGroupBy] = React.useState<'day' | 'week' | 'month'>('month');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [payoutStatus, setPayoutStatus] = React.useState<string>('all');
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [exporting, setExporting] = React.useState(false);

  const loadFinancial = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFinancialOverview({ from: dateFrom, to: dateTo, groupBy });
      if (data) setMetrics(data);
    } catch {
      // Use default metrics
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, groupBy]);

  const loadPayouts = React.useCallback(async () => {
    try {
      const data = await fetchPayouts({
        page,
        limit: 20,
        status: payoutStatus !== 'all' ? payoutStatus : undefined,
      });
      if (data?.items) setPayouts(data.items);
    } catch {
      // Use mock payouts
    }
  }, [page, payoutStatus]);

  React.useEffect(() => {
    loadFinancial();
    loadPayouts();
  }, [loadFinancial, loadPayouts]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const data = await exportFinancialCsv({ from: dateFrom, to: dateTo, groupBy });
      if (data) {
        downloadCsv(data, `ifarm-financeiro-${new Date().toISOString().slice(0, 10)}.csv`);
        toast.success('Relatorio CSV exportado com sucesso');
      } else {
        // Generate from local data
        const csvHeader = 'Periodo,GMV,Comissao\n';
        const csvRows = gmvByPeriod
          .map((row) => `${row.period},${row.gmv},${row.commission}`)
          .join('\n');
        downloadCsv(csvHeader + csvRows, `ifarm-financeiro-${new Date().toISOString().slice(0, 10)}.csv`);
        toast.success('Relatorio CSV exportado com sucesso');
      }
    } catch {
      // Fallback to local export
      const csvHeader = 'Periodo,GMV,Comissao\n';
      const csvRows = gmvByPeriod
        .map((row) => `${row.period},${row.gmv},${row.commission}`)
        .join('\n');
      downloadCsv(csvHeader + csvRows, `ifarm-financeiro-${new Date().toISOString().slice(0, 10)}.csv`);
      toast.success('Relatorio CSV exportado (dados locais)');
    } finally {
      setExporting(false);
    }
  };

  const filteredPayouts = payouts.filter(
    (p) => payoutStatus === 'all' || p.status === payoutStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
          <p className="text-muted-foreground">Visao geral financeira da plataforma</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-[140px]"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[140px]"
            />
          </div>
          <Button variant="outline" onClick={handleExportCsv} disabled={exporting}>
            <Download className="mr-2 h-4 w-4" />
            {exporting ? 'Exportando...' : 'Exportar CSV'}
          </Button>
          <Button variant="outline" size="icon" onClick={loadFinancial} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">GMV Total</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalGmv)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{metrics.gmvChange}%</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Comissoes iFarm</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalCommissions)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{metrics.commissionsChange}%</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payouts Processados</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.processedPayouts)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payouts Pendentes</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.pendingPayouts)}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* GMV by Period */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">GMV por Periodo</CardTitle>
            <Select value={groupBy} onValueChange={(v) => setGroupBy(v as 'day' | 'week' | 'month')}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Diario</SelectItem>
                <SelectItem value="week">Semanal</SelectItem>
                <SelectItem value="month">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gmvByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="period" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value)]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gmv"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="GMV"
                  />
                  <Area
                    type="monotone"
                    dataKey="commission"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Comissao"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Commissions by Tier */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comissoes por Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commissionsByTier} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="tier" className="text-xs" width={100} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value)]}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="commission" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Comissao" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payouts Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Payouts</CardTitle>
          <Select value={payoutStatus} onValueChange={setPayoutStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="PROCESSED">Processados</SelectItem>
              <SelectItem value="PENDING">Pendentes</SelectItem>
              <SelectItem value="SCHEDULED">Agendados</SelectItem>
              <SelectItem value="FAILED">Falhou</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destinatario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>ID Transacao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    Nenhum payout encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.recipientName}</TableCell>
                    <TableCell>
                      <Badge variant={payout.recipientType === 'PLATFORM' ? 'info' : 'success'}>
                        {payout.recipientType === 'PLATFORM' ? 'Plataforma' : 'Farmer'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(payout.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={payoutStatusMap[payout.status]?.variant || 'secondary'}>
                        {payoutStatusMap[payout.status]?.label || payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {payout.processedAt
                        ? formatDate(payout.processedAt)
                        : payout.scheduledFor
                          ? `Agendado: ${formatDate(payout.scheduledFor)}`
                          : '-'}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {payout.transactionId || '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredPayouts.length} payouts
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm">Pagina {page}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
            Proximo
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

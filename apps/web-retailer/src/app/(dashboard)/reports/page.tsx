'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  BarChart3, FileText, Download, Calendar, TrendingUp, DollarSign, Users,
  PackageSearch, ChevronDown, Clock, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { cn, formatCurrency } from '@/lib/utils';

type ReportType = 'sales' | 'products' | 'customers' | 'financial';
type Period = 'week' | 'month' | 'quarter' | 'year';

interface Report {
  id: string;
  type: ReportType;
  name: string;
  generatedAt: string;
  period: string;
  fileSize: string;
  status: 'ready' | 'generating';
}

const TYPE_ICON: Record<ReportType, React.ElementType> = {
  sales: TrendingUp,
  products: PackageSearch,
  customers: Users,
  financial: DollarSign,
};

const TYPE_COLOR: Record<ReportType, string> = {
  sales: 'text-primary bg-primary/20',
  products: 'text-blue-400 bg-blue-500/20',
  customers: 'text-secondary bg-secondary/20',
  financial: 'text-emerald-400 bg-emerald-500/20',
};

const RECENT_REPORTS: Report[] = [
  { id: '1', type: 'sales', name: 'Vendas Mensal - Janeiro 2024', generatedAt: '2024-01-20 14:30', period: 'Janeiro 2024', fileSize: '2.4 MB', status: 'ready' },
  { id: '2', type: 'financial', name: 'Financeiro Q4 2023', generatedAt: '2024-01-15 09:00', period: 'Out-Dez 2023', fileSize: '4.1 MB', status: 'ready' },
  { id: '3', type: 'products', name: 'Produtos Mais Vendidos - 2023', generatedAt: '2024-01-10 16:45', period: 'Ano 2023', fileSize: '1.8 MB', status: 'ready' },
  { id: '4', type: 'customers', name: 'Análise de Clientes - Janeiro 2024', generatedAt: '2024-01-20 15:00', period: 'Janeiro 2024', fileSize: '', status: 'generating' },
  { id: '5', type: 'sales', name: 'Vendas Semanal - Sem 03/2024', generatedAt: '2024-01-19 08:00', period: '15-19 Jan 2024', fileSize: '890 KB', status: 'ready' },
];

const QUICK_STATS = [
  { label: 'Receita no Período', value: formatCurrency(487200), change: '+12.5%', up: true },
  { label: 'Pedidos Concluídos', value: '284', change: '+8.3%', up: true },
  { label: 'Ticket Médio', value: formatCurrency(1715), change: '-2.1%', up: false },
  { label: 'Novos Clientes', value: '23', change: '+15.0%', up: true },
];

export default function ReportsPage() {
  const t = useTranslations('reports');
  const tc = useTranslations('common');
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');

  const filteredReports = RECENT_REPORTS.filter(r =>
    selectedType === 'all' || r.type === selectedType
  );

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div>
        <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
        <p className="text-sm text-on-surface-variant mt-1">{t('subtitle')}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {QUICK_STATS.map(stat => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-4">
              <p className="text-xs text-on-surface-variant mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className={cn('text-xs mt-1 font-medium', stat.up ? 'text-emerald-400' : 'text-red-400')}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generate Report */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-on-surface flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {t('generate')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(['sales', 'products', 'customers', 'financial'] as ReportType[]).map(type => {
              const Icon = TYPE_ICON[type];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary/50',
                    selectedType === type
                      ? 'border-primary bg-primary/10'
                      : 'border-outline-variant/30 bg-surface-variant/10'
                  )}
                >
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-full', TYPE_COLOR[type])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-sm text-on-surface">{t(`types.${type}`)}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Calendar className="h-4 w-4" />
              {t('period.label') || 'Período'}:
            </div>
            {(['week', 'month', 'quarter', 'year'] as Period[]).map(p => (
              <Button
                key={p}
                variant={selectedPeriod === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(p)}
              >
                {t(`period.${p}`)}
              </Button>
            ))}
            <div className="flex-1" />
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              {t('generate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-on-surface flex items-center gap-2">
            <Clock className="h-5 w-5 text-on-surface-variant" />
            Relatórios Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredReports.map(report => {
            const Icon = TYPE_ICON[report.type];
            return (
              <div key={report.id} className="flex items-center gap-4 rounded-lg border border-outline-variant/30 p-4 hover:bg-surface-variant/20 transition-colors">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', TYPE_COLOR[report.type])}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-on-surface">{report.name}</p>
                  <p className="text-xs text-on-surface-variant">{report.period} • {report.generatedAt}</p>
                </div>
                {report.status === 'ready' ? (
                  <>
                    <span className="text-xs text-on-surface-variant hidden sm:block">{report.fileSize}</span>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 gap-1 hidden sm:flex">
                      <CheckCircle2 className="h-3 w-3" />
                      Pronto
                    </Badge>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Download className="h-3 w-3" />
                      {t('download')}
                    </Button>
                  </>
                ) : (
                  <Badge variant="outline" className="text-secondary border-secondary/30 gap-1 animate-pulse">
                    <Clock className="h-3 w-3" />
                    Gerando...
                  </Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

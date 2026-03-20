'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  FileText, Plus, Search, Download, Eye, AlertCircle,
  CheckCircle2, XCircle, Clock, Hash, Calendar, DollarSign, Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { cn, formatCurrency } from '@/lib/utils';

type InvoiceStatus = 'pending' | 'issued' | 'cancelled';
type Tab = 'all' | InvoiceStatus;

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customer: string;
  issueDate: string;
  totalValue: number;
  status: InvoiceStatus;
  accessKey?: string;
}

const STATUS_CONFIG: Record<InvoiceStatus, { icon: React.ElementType; color: string; badgeClass: string }> = {
  pending: { icon: Clock, color: 'text-secondary', badgeClass: 'bg-secondary/20 text-secondary border-secondary/30' },
  issued: { icon: CheckCircle2, color: 'text-emerald-400', badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  cancelled: { icon: XCircle, color: 'text-red-400', badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const INVOICES: Invoice[] = [
  { id: '1', invoiceNumber: 'NF-e 000.123.456', orderId: 'PED-2024-0042', customer: 'Fazenda Santa Clara', issueDate: '2024-01-18', totalValue: 45800, status: 'issued', accessKey: '3524 0112 3456 7890 1234 5678 9012 3456 7890 1234 56' },
  { id: '2', invoiceNumber: 'NF-e 000.123.457', orderId: 'PED-2024-0039', customer: 'Agropecuária Três Rios', issueDate: '2024-01-15', totalValue: 32500, status: 'issued', accessKey: '3524 0112 3456 7890 1234 5678 9012 3456 7890 1234 57' },
  { id: '3', invoiceNumber: '—', orderId: 'PED-2024-0045', customer: 'Cooperativa do Cerrado', issueDate: '', totalValue: 28900, status: 'pending' },
  { id: '4', invoiceNumber: 'NF-e 000.123.455', orderId: 'PED-2024-0037', customer: 'Sítio Bela Vista', issueDate: '2024-01-10', totalValue: 18700, status: 'issued', accessKey: '3524 0112 3456 7890 1234 5678 9012 3456 7890 1234 55' },
  { id: '5', invoiceNumber: 'NF-e 000.123.452', orderId: 'PED-2024-0030', customer: 'Granja Esperança', issueDate: '2024-01-05', totalValue: 12300, status: 'cancelled' },
  { id: '6', invoiceNumber: '—', orderId: 'PED-2024-0048', customer: 'Haras Monte Alegre', issueDate: '', totalValue: 8900, status: 'pending' },
];

export default function InvoicesPage() {
  const t = useTranslations('invoices');
  const tc = useTranslations('common');
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');

  const filtered = INVOICES
    .filter(inv => tab === 'all' || inv.status === tab)
    .filter(inv =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.orderId.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase())
    );

  const count = (status: InvoiceStatus) => INVOICES.filter(i => i.status === status).length;
  const totalIssued = INVOICES.filter(i => i.status === 'issued').reduce((sum, i) => sum + i.totalValue, 0);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{t('subtitle')}</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t('emit')}
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant/50 text-on-surface-variant">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{INVOICES.length}</p>
              <p className="text-xs text-on-surface-variant">Total NF-e</p>
            </div>
          </CardContent>
        </Card>
        {(['issued', 'pending', 'cancelled'] as InvoiceStatus[]).map(status => {
          const { icon: Icon, color } = STATUS_CONFIG[status];
          return (
            <Card key={status} className="glass-card">
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant/50', color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-on-surface">{count(status)}</p>
                  <p className="text-xs text-on-surface-variant">{t(`status.${status}`)}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {(['all', 'pending', 'issued', 'cancelled'] as Tab[]).map(t2 => (
            <Button
              key={t2}
              variant={tab === t2 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTab(t2)}
            >
              {t2 === 'all' ? tc('all') : t(`status.${t2}`)}
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

      {/* Invoice Table */}
      <Card className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">{t('invoiceNumber')}</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase hidden md:table-cell">Pedido</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase hidden lg:table-cell">Cliente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase hidden sm:table-cell">{t('issueDate')}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-on-surface-variant uppercase">{t('totalValue')}</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-on-surface-variant uppercase">Status</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filtered.map(invoice => {
                const { badgeClass } = STATUS_CONFIG[invoice.status];
                return (
                  <tr key={invoice.id} className="hover:bg-surface-variant/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-on-surface flex items-center gap-1">
                        <Hash className="h-3 w-3 text-on-surface-variant" />
                        {invoice.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-primary hidden md:table-cell">{invoice.orderId}</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant hidden lg:table-cell">{invoice.customer}</td>
                    <td className="px-4 py-3 text-sm text-on-surface-variant hidden sm:table-cell">
                      {invoice.issueDate ? (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(invoice.issueDate).toLocaleDateString('pt-BR')}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-on-surface">{formatCurrency(invoice.totalValue)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="outline" className={cn('text-xs', badgeClass)}>
                        {t(`status.${invoice.status}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Visualizar">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {invoice.status === 'issued' && (
                          <>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="XML">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="PDF">
                              <FileText className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-on-surface-variant/40 mb-4" />
            <p className="text-on-surface-variant">{tc('noResults')}</p>
          </div>
        )}
      </Card>
    </div>
  );
}

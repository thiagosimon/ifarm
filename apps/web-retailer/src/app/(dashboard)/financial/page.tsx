'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
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

// -- Types --

type PayoutStatus = 'paid' | 'scheduled' | 'processing' | 'held';

interface Payout {
  id: string;
  reference: string;
  orderNumber: string;
  farmer: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: PayoutStatus;
  scheduledDate: string;
  paidDate: string | null;
}

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  payouts: Payout[];
}

// -- Mock data --

const mockPayouts: Payout[] = [
  {
    id: '1',
    reference: 'PAY-2026-000451',
    orderNumber: 'PED-2026-000887',
    farmer: 'Fazenda Tres Irmaos',
    amount: 64000,
    fee: 1920,
    netAmount: 62080,
    status: 'paid',
    scheduledDate: '2026-03-14T00:00:00Z',
    paidDate: '2026-03-14T10:30:00Z',
  },
  {
    id: '2',
    reference: 'PAY-2026-000452',
    orderNumber: 'PED-2026-000886',
    farmer: 'Fazenda Santa Maria',
    amount: 412000,
    fee: 12360,
    netAmount: 399640,
    status: 'paid',
    scheduledDate: '2026-03-15T00:00:00Z',
    paidDate: '2026-03-15T11:00:00Z',
  },
  {
    id: '3',
    reference: 'PAY-2026-000453',
    orderNumber: 'PED-2026-000889',
    farmer: 'Fazenda Esperanca',
    amount: 356000,
    fee: 10680,
    netAmount: 345320,
    status: 'processing',
    scheduledDate: '2026-03-18T00:00:00Z',
    paidDate: null,
  },
  {
    id: '4',
    reference: 'PAY-2026-000454',
    orderNumber: 'PED-2026-000888',
    farmer: 'Agropecuaria Sol Nascente',
    amount: 19200,
    fee: 576,
    netAmount: 18624,
    status: 'scheduled',
    scheduledDate: '2026-03-20T00:00:00Z',
    paidDate: null,
  },
  {
    id: '5',
    reference: 'PAY-2026-000455',
    orderNumber: 'PED-2026-000891',
    farmer: 'Fazenda Boa Vista',
    amount: 142500,
    fee: 4275,
    netAmount: 138225,
    status: 'scheduled',
    scheduledDate: '2026-03-25T00:00:00Z',
    paidDate: null,
  },
  {
    id: '6',
    reference: 'PAY-2026-000456',
    orderNumber: 'PED-2026-000890',
    farmer: 'Sitio Sao Jose',
    amount: 98000,
    fee: 2940,
    netAmount: 95060,
    status: 'scheduled',
    scheduledDate: '2026-03-28T00:00:00Z',
    paidDate: null,
  },
  {
    id: '7',
    reference: 'PAY-2026-000457',
    orderNumber: 'PED-2026-000885',
    farmer: 'Fazenda Progresso',
    amount: 78000,
    fee: 2340,
    netAmount: 75660,
    status: 'held',
    scheduledDate: '2026-04-05T00:00:00Z',
    paidDate: null,
  },
];

const statusConfig: Record<PayoutStatus, { label: string; variant: 'success' | 'pending' | 'active' | 'warning' }> = {
  paid: { label: 'Pago', variant: 'success' },
  scheduled: { label: 'Agendado', variant: 'pending' },
  processing: { label: 'Processando', variant: 'active' },
  held: { label: 'Retido', variant: 'warning' },
};

const months = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function generateCalendarDays(year: number, month: number, payouts: Payout[]): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: CalendarDay[] = [];

  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay - i,
      month: month - 1,
      year,
      isCurrentMonth: false,
      payouts: [],
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dayPayouts = payouts.filter((p) => {
      const pd = new Date(p.scheduledDate);
      return pd.getFullYear() === year && pd.getMonth() === month && pd.getDate() === d;
    });
    days.push({
      date: d,
      month,
      year,
      isCurrentMonth: true,
      payouts: dayPayouts,
    });
  }

  // Next month padding
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: i,
      month: month + 1,
      year,
      isCurrentMonth: false,
      payouts: [],
    });
  }

  return days;
}

function exportCSV(payouts: Payout[]) {
  const header = 'Referencia,Pedido,Produtor,Valor Bruto,Taxa,Valor Liquido,Status,Data Agendada,Data Pagamento\n';
  const rows = payouts
    .map(
      (p) =>
        `${p.reference},${p.orderNumber},${p.farmer},${(p.amount / 100).toFixed(2)},${(p.fee / 100).toFixed(2)},${(p.netAmount / 100).toFixed(2)},${statusConfig[p.status].label},${formatDate(p.scheduledDate)},${p.paidDate ? formatDate(p.paidDate) : '-'}`
    )
    .join('\n');

  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `repasses-ifarm-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function FinancialPage() {
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(2); // March (0-indexed)

  const totalPaid = mockPayouts
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.netAmount, 0);
  const totalScheduled = mockPayouts
    .filter((p) => p.status === 'scheduled' || p.status === 'processing')
    .reduce((sum, p) => sum + p.netAmount, 0);
  const totalHeld = mockPayouts
    .filter((p) => p.status === 'held')
    .reduce((sum, p) => sum + p.netAmount, 0);
  const totalFees = mockPayouts.reduce((sum, p) => sum + p.fee, 0);

  const holdbackDays = 18; // days until holdback release

  const calendarDays = generateCalendarDays(calendarYear, calendarMonth, mockPayouts);

  function prevMonth() {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  }

  function nextMonth() {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Breadcrumbs />
          <h1 className="mt-2 text-2xl font-bold text-foreground">
            Financeiro
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe repasses, taxas e previsao de pagamentos
          </p>
        </div>
        <Button variant="outline" onClick={() => exportCSV(mockPayouts)}>
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Pago</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(totalPaid / 100)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Agendado</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(totalScheduled / 100)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <AlertCircle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Em Holdback</p>
                <p className="text-xl font-bold text-amber-600">
                  {formatCurrency(totalHeld / 100)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Taxas do Mes</p>
                <p className="text-xl font-bold text-muted-foreground">
                  {formatCurrency(totalFees / 100)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdback Card */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              {formatCurrency(totalHeld / 100)} em holdback
            </p>
            <p className="text-xs text-amber-700">
              Liberacao prevista em {holdbackDays} dias. Valores retidos referentes a pedidos com disputa em andamento.
            </p>
          </div>
          <Badge variant="warning">Retido</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Payout Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Historico de Repasses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPayouts.map((payout) => {
                const config = statusConfig[payout.status];
                return (
                  <div
                    key={payout.id}
                    className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div
                      className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                        payout.status === 'paid'
                          ? 'bg-green-100'
                          : payout.status === 'processing'
                          ? 'bg-blue-100'
                          : payout.status === 'held'
                          ? 'bg-amber-100'
                          : 'bg-muted'
                      }`}
                    >
                      {payout.status === 'paid' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : payout.status === 'processing' ? (
                        <ArrowUpRight className="h-4 w-4 text-blue-600" />
                      ) : payout.status === 'held' ? (
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {payout.reference}
                        </p>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {payout.orderNumber} &middot; {payout.farmer}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs">
                        <span>
                          Bruto: {formatCurrency(payout.amount / 100)}
                        </span>
                        <span className="text-muted-foreground">
                          Taxa: {formatCurrency(payout.fee / 100)}
                        </span>
                        <span className="font-semibold text-primary-600">
                          Liquido: {formatCurrency(payout.netAmount / 100)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {payout.paidDate
                          ? `Pago em ${formatDate(payout.paidDate)}`
                          : `Previsto para ${formatDate(payout.scheduledDate)}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendario de Repasses
            </CardTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[140px] text-center text-sm font-medium">
                {months[calendarMonth]} {calendarYear}
              </span>
              <button
                onClick={nextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Weekday headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(
                (day) => (
                  <div
                    key={day}
                    className="py-1 text-center text-xs font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                const isToday =
                  day.isCurrentMonth &&
                  day.date === 18 &&
                  calendarMonth === 2 &&
                  calendarYear === 2026;
                const hasPayouts = day.payouts.length > 0;
                const totalDayAmount = day.payouts.reduce(
                  (sum, p) => sum + p.netAmount,
                  0
                );

                return (
                  <div
                    key={idx}
                    className={`relative flex min-h-[60px] flex-col rounded-md border p-1 text-xs ${
                      !day.isCurrentMonth
                        ? 'border-transparent bg-muted/30 text-muted-foreground/50'
                        : isToday
                        ? 'border-primary-500 bg-primary-50'
                        : hasPayouts
                        ? 'border-border bg-white'
                        : 'border-transparent bg-white'
                    }`}
                  >
                    <span
                      className={`text-right text-[11px] ${
                        isToday ? 'font-bold text-primary-600' : ''
                      }`}
                    >
                      {day.date}
                    </span>
                    {hasPayouts && (
                      <div className="mt-auto">
                        <div className="rounded bg-green-100 px-1 py-0.5 text-center text-[10px] font-medium text-green-700">
                          {formatCurrency(totalDayAmount / 100)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                Pago
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Agendado
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Retido
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Detalhamento de Repasses</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCSV(mockPayouts)}
          >
            <Download className="mr-1 h-3 w-3" />
            CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referencia</TableHead>
                <TableHead>Pedido</TableHead>
                <TableHead>Produtor</TableHead>
                <TableHead>Valor Bruto</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Valor Liquido</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Prevista</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayouts.map((payout) => {
                const config = statusConfig[payout.status];
                return (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">
                      {payout.reference}
                    </TableCell>
                    <TableCell>{payout.orderNumber}</TableCell>
                    <TableCell>{payout.farmer}</TableCell>
                    <TableCell>{formatCurrency(payout.amount / 100)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatCurrency(payout.fee / 100)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(payout.netAmount / 100)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(payout.scheduledDate)}
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

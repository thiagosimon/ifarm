'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
  XCircle,
  FileText,
  User,
  Store,
  Calendar,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface PageProps {
  params: { id: string };
}

const orderData = {
  id: '1',
  orderNumber: '#IF-20934',
  status: 'Concluído',
  farmer: { name: 'João Silva', company: 'Fazenda Sol Nascente', cnpj: '45.123.789/0001-90' },
  retailer: { name: 'Agropecuária São Bento', cnpj: '12.456.789/0001-10' },
  createdAt: '2024-05-12',
  value: 12450,
  commission: 622.5,
  items: [
    { name: 'Soja Transgênica Granel', ncm: '1201.10.00', quantity: 50, unit: 'ton', unitPrice: 200, total: 10000 },
    { name: 'Soja Convencional', ncm: '1201.90.00', quantity: 12, unit: 'ton', unitPrice: 204.17, total: 2450 },
  ],
  timeline: [
    { status: 'Pedido Criado', date: '2024-05-12 08:00', done: true },
    { status: 'Pagamento Confirmado', date: '2024-05-12 10:30', done: true },
    { status: 'Em Preparo', date: '2024-05-13 09:00', done: true },
    { status: 'Enviado', date: '2024-05-14 14:00', done: true },
    { status: 'Entregue', date: '2024-05-15 11:00', done: true },
    { status: 'Concluído', date: '2024-05-16 09:00', done: true },
  ],
};

const statusConfig: Record<string, string> = {
  Concluído: 'bg-[#005229]/50 text-[#a4f5b8]',
  Pendente: 'bg-[#5c4300]/50 text-[#ffdea0]',
  Cancelado: 'bg-[#93000a] text-[#ffb4ab]',
  'Em Preparo': 'bg-[#272B2C] text-muted-foreground',
  Enviado: 'bg-[#a4f5b8]/10 text-[#a4f5b8]',
  Pago: 'bg-[#005229]/30 text-[#89d89e]',
};

export default function OrderDetailPage({ params }: PageProps) {
  return (
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/orders"
        className="flex items-center gap-2 text-muted-foreground hover:text-[#a4f5b8] transition-colors text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Pedidos
      </Link>

      {/* Header Card */}
      <div className="glass-card agro-shadow rounded-xl p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a4f5b8]">
                Operações de Mercado
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
              Pedido {orderData.orderNumber}
            </h1>
            <div className="flex items-center gap-3">
              <span className={cn('px-3 py-1 rounded-full text-[10px] font-extrabold uppercase', statusConfig[orderData.status])}>
                {orderData.status}
              </span>
              <span className="text-muted-foreground text-sm">
                Criado em {formatDate(orderData.createdAt)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
              Valor Total
            </p>
            <p className="text-4xl font-light tracking-tighter text-[#f6be39]">
              {formatCurrency(orderData.value)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Comissão iFarm: {formatCurrency(orderData.commission)}
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Parties */}
          <div className="glass-card agro-shadow rounded-xl p-6">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-widest text-muted-foreground">
              Partes Envolvidas
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                  Farmer (Produtor)
                </p>
                <div className="flex items-center gap-3 p-3 bg-[#1c2021] rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#a4f5b8]/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-[#a4f5b8]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{orderData.farmer.name}</p>
                    <p className="text-xs text-muted-foreground">{orderData.farmer.company}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                  Retailer (Comprador)
                </p>
                <div className="flex items-center gap-3 p-3 bg-[#1c2021] rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#f6be39]/10 flex items-center justify-center">
                    <Store className="h-4 w-4 text-[#f6be39]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{orderData.retailer.name}</p>
                    <p className="text-xs text-muted-foreground">{orderData.retailer.cnpj}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="glass-card agro-shadow rounded-xl p-6">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-widest text-muted-foreground">
              Ações
            </h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 rounded-lg bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20 text-sm font-semibold hover:bg-[#ffb4ab]/20 transition-colors flex items-center justify-center gap-2">
                <XCircle className="h-4 w-4" />
                Cancelar Pedido
              </button>
              <button className="w-full px-4 py-2.5 rounded-lg bg-[#272B2C] text-muted-foreground text-sm font-semibold hover:bg-[#313536] transition-colors flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Abrir Disputa
              </button>
              <button className="w-full px-4 py-2.5 rounded-lg bg-[#272B2C] text-muted-foreground text-sm font-semibold hover:bg-[#313536] transition-colors flex items-center justify-center gap-2">
                <FileText className="h-4 w-4" />
                Gerar NF-e
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column - Items */}
        <div className="space-y-6">
          <div className="glass-card agro-shadow rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border/10">
              <h3 className="font-semibold">Itens do Pedido</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#181c1d]/50">
                  <th className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Item</th>
                  <th className="px-4 py-3 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {orderData.items.map((item) => (
                  <tr key={item.name}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">NCM: {item.ncm} • {item.quantity} {item.unit}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-[#f6be39]">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border/20">
                  <td className="px-4 py-3 text-sm font-extrabold uppercase tracking-wide">Total</td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-[#f6be39]">
                    {formatCurrency(orderData.value)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div>
          <div className="glass-card agro-shadow rounded-xl p-6">
            <h3 className="font-semibold mb-6">Timeline do Pedido</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-border/20">
              {orderData.timeline.map((step, idx) => (
                <div key={step.status} className="relative flex items-start gap-3">
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full flex-shrink-0 -ml-2 z-10 border-2',
                      step.done
                        ? 'bg-[#a4f5b8] border-[#a4f5b8]'
                        : 'bg-[#1c2021] border-border'
                    )}
                  />
                  <div>
                    <p className={cn('text-sm font-semibold', step.done ? 'text-foreground' : 'text-muted-foreground')}>
                      {step.status}
                    </p>
                    {step.done && (
                      <p className="text-xs text-muted-foreground">{step.date}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

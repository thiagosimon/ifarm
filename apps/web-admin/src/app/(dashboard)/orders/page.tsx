'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Eye, Download, Filter, RefreshCw, ShoppingCart } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface Order {
  id: string;
  orderNumber: string;
  farmer: { name: string; company: string; initials: string };
  retailer: string;
  status: 'Concluído' | 'Pendente' | 'Cancelado' | 'Em Preparo' | 'Enviado' | 'Pago';
  value: number;
  date: string;
}

const orders: Order[] = [
  {
    id: '1',
    orderNumber: '#IF-20934',
    farmer: { name: 'João Silva', company: 'Fazenda Sol Nascente', initials: 'JS' },
    retailer: 'Agropecuária São Bento',
    status: 'Concluído',
    value: 12450,
    date: '12 Mai, 2024',
  },
  {
    id: '2',
    orderNumber: '#IF-20935',
    farmer: { name: 'Maria Oliveira', company: 'Sítio das Palmeiras', initials: 'MO' },
    retailer: 'Mercado Central Frutti',
    status: 'Pendente',
    value: 5120.5,
    date: '13 Mai, 2024',
  },
  {
    id: '3',
    orderNumber: '#IF-20936',
    farmer: { name: 'Ricardo Costa', company: 'Fazenda Rio Doce', initials: 'RC' },
    retailer: 'Distribuidora Minas',
    status: 'Cancelado',
    value: 8900,
    date: '14 Mai, 2024',
  },
  {
    id: '4',
    orderNumber: '#IF-20937',
    farmer: { name: 'Ana Ferreira', company: 'Agro Cerrado', initials: 'AF' },
    retailer: 'Cooagro Ltda.',
    status: 'Em Preparo',
    value: 22300,
    date: '14 Mai, 2024',
  },
  {
    id: '5',
    orderNumber: '#IF-20938',
    farmer: { name: 'Carlos Pereira', company: 'Fazenda Boa Vista', initials: 'CP' },
    retailer: 'AgroFertil S.A.',
    status: 'Enviado',
    value: 18750,
    date: '15 Mai, 2024',
  },
  {
    id: '6',
    orderNumber: '#IF-20939',
    farmer: { name: 'Luiz Santos', company: 'Terra Firme', initials: 'LS' },
    retailer: 'Distribuidora Sul',
    status: 'Pago',
    value: 9800,
    date: '15 Mai, 2024',
  },
];

const statusConfig: Record<string, string> = {
  Concluído: 'bg-[#005229]/50 text-[#a4f5b8]',
  Pendente: 'bg-[#5c4300]/50 text-[#ffdea0]',
  Cancelado: 'bg-[#93000a] text-[#ffb4ab]',
  'Em Preparo': 'bg-[#272B2C] text-muted-foreground',
  Enviado: 'bg-[#a4f5b8]/10 text-[#a4f5b8]',
  Pago: 'bg-[#005229]/30 text-[#89d89e]',
};

export default function OrdersPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('Todos');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.farmer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.retailer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Todos' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#a4f5b8]/70 mb-2 block">
            Operações de Mercado
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Gestão de Pedidos</h1>
          <p className="text-muted-foreground font-light mt-1">
            Monitore e gerencie o fluxo logístico e financeiro da plataforma.
          </p>
        </div>
        <button className="bg-[#a4f5b8] hover:opacity-90 text-[#00391b] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all agro-shadow">
          <Download className="h-5 w-5" />
          Exportar Relatório
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-xl p-6 agro-shadow border border-border/10">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Busca Geral
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pedido, produtor..."
                className="w-full bg-[#0b0f10] border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-[#a4f5b8] text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0b0f10] border-none rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#a4f5b8] text-foreground outline-none appearance-none"
            >
              <option>Todos</option>
              <option>Pendente</option>
              <option>Pago</option>
              <option>Em Preparo</option>
              <option>Enviado</option>
              <option>Concluído</option>
              <option>Cancelado</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Período De</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full bg-[#0b0f10] border-none rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#a4f5b8] text-foreground outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Período Até</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full bg-[#0b0f10] border-none rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-[#a4f5b8] text-foreground outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-[#272B2C] hover:bg-[#313536] text-foreground p-2.5 rounded-lg transition-colors flex-1 flex items-center justify-center gap-2 text-sm font-semibold">
              <Filter className="h-4 w-4" />
              Filtrar
            </button>
            <button className="bg-[#272B2C] hover:bg-[#313536] text-foreground p-2.5 rounded-lg transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#272B2C] rounded-xl overflow-hidden agro-shadow border border-border/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#313536]/50">
              {['ID Pedido', 'Produtor (Farmer)', 'Comprador (Retailer)', 'Status', 'Valor (R$)', 'Data', 'Ações'].map(
                (h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border/10',
                      i === 3 && '',
                      i === 4 && 'text-right',
                      i === 6 && 'text-center'
                    )}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/5">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-[#313536]/30 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-[#a4f5b8] font-bold">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0b0f10] flex items-center justify-center text-[#a4f5b8] text-xs font-bold">
                      {order.farmer.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{order.farmer.name}</div>
                      <div className="text-[10px] text-muted-foreground">{order.farmer.company}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{order.retailer}</td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase',
                      statusConfig[order.status]
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-[#f6be39]">
                  {formatCurrency(order.value).replace('R$\u00a0', '')}
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">{order.date}</td>
                <td className="px-6 py-4 text-center">
                  <Link href={`/orders/${order.id}`}>
                    <button className="text-muted-foreground hover:text-[#a4f5b8] transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">Nenhum pedido encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

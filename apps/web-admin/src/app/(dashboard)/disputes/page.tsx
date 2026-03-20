'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Download, Filter, AlertTriangle, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface Dispute {
  id: string;
  orderNumber: string;
  farmer: string;
  retailer: string;
  reason: string;
  status: 'Em Análise' | 'Aberta' | 'Resolvida' | 'Fechada';
  value: number;
  slaDays: number;
}

const disputes: Dispute[] = [
  {
    id: '1',
    orderNumber: '#IF-9921',
    farmer: 'João P. Silveira',
    retailer: 'AgroFertil S.A.',
    reason: 'Divergência na classificação de grãos (soja)',
    status: 'Em Análise',
    value: 45200,
    slaDays: 0,
  },
  {
    id: '2',
    orderNumber: '#IF-9844',
    farmer: 'Fazenda Sol Nascente',
    retailer: 'Cooagro Ltda.',
    reason: 'Atraso na entrega de insumos químicos',
    status: 'Aberta',
    value: 12850,
    slaDays: 2,
  },
  {
    id: '3',
    orderNumber: '#IF-9812',
    farmer: 'Carlos Sementes',
    retailer: 'Distribuidora Minas',
    reason: 'Qualidade do produto divergente do laudado',
    status: 'Aberta',
    value: 8400,
    slaDays: 4,
  },
  {
    id: '4',
    orderNumber: '#IF-9790',
    farmer: 'Fazenda Progresso',
    retailer: 'Mercado Central',
    reason: 'Quantidade entregue menor que contratada',
    status: 'Em Análise',
    value: 22100,
    slaDays: 1,
  },
  {
    id: '5',
    orderNumber: '#IF-9750',
    farmer: 'Agro Grãos SA',
    retailer: 'AgroFertil S.A.',
    reason: 'Problema na documentação fiscal',
    status: 'Resolvida',
    value: 6700,
    slaDays: 7,
  },
  {
    id: '6',
    orderNumber: '#IF-9710',
    farmer: 'Ricardo Batista',
    retailer: 'Cooagro Ltda.',
    reason: 'Divergência de preço no contrato',
    status: 'Resolvida',
    value: 3900,
    slaDays: 5,
  },
];

const statusConfig: Record<string, { label: string; classes: string }> = {
  'Em Análise': { label: 'Em Análise', classes: 'bg-[#5c4300]/20 text-[#f6be39] border border-[#f6be39]/20' },
  Aberta: { label: 'Aberta', classes: 'bg-[#005229]/20 text-[#a4f5b8] border border-[#a4f5b8]/20' },
  Resolvida: { label: 'Resolvida', classes: 'bg-[#272B2C] text-muted-foreground border border-border/20' },
  Fechada: { label: 'Fechada', classes: 'bg-[#272B2C] text-muted-foreground border border-border/20' },
};

const slaConfig = (days: number) => {
  if (days === 0) return 'bg-[#93000a] text-[#ffb4ab]';
  if (days <= 2) return 'bg-[#5c4300]/30 text-[#f6be39]';
  return 'bg-[#272B2C] text-muted-foreground';
};

type TabFilter = 'Todos' | 'Aberta' | 'Em Análise' | 'Resolvida';

export default function DisputesPage() {
  const [activeTab, setActiveTab] = React.useState<TabFilter>('Todos');

  const filtered = disputes.filter((d) => activeTab === 'Todos' || d.status === activeTab);

  const stats = {
    abertas: disputes.filter((d) => d.status === 'Aberta').length,
    emAnalise: disputes.filter((d) => d.status === 'Em Análise').length,
    resolvidas: disputes.filter((d) => d.status === 'Resolvida').length,
    valorTotal: disputes.reduce((acc, d) => acc + d.value, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-baseline gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Disputas</h1>
        <span className="text-[#f6be39] font-light text-xl tracking-wide">— SLA 7 dias úteis</span>
      </div>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#272B2C] p-6 rounded-xl agro-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#a4f5b8]" />
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Abertas</p>
          <h3 className="text-4xl font-light text-[#a4f5b8]">{stats.abertas}</h3>
          <AlertTriangle className="absolute right-4 bottom-4 h-12 w-12 text-[#a4f5b8]/10 group-hover:scale-110 transition-transform" />
        </div>
        <div className="bg-[#272B2C] p-6 rounded-xl agro-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#f6be39]" />
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Em Análise</p>
          <h3 className="text-4xl font-light text-[#f6be39]">{stats.emAnalise}</h3>
          <Clock className="absolute right-4 bottom-4 h-12 w-12 text-[#f6be39]/10 group-hover:scale-110 transition-transform" />
        </div>
        <div className="bg-[#272B2C] p-6 rounded-xl agro-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-muted-foreground" />
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Resolvidas</p>
          <h3 className="text-4xl font-light text-muted-foreground">{stats.resolvidas}</h3>
          <CheckCircle className="absolute right-4 bottom-4 h-12 w-12 text-muted-foreground/10 group-hover:scale-110 transition-transform" />
        </div>
        <div className="bg-[#272B2C] p-6 rounded-xl agro-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#ffdea0]" />
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Valor em Disputa</p>
          <h3 className="text-3xl font-light text-[#ffdea0]">{formatCurrency(stats.valorTotal)}</h3>
          <DollarSign className="absolute right-4 bottom-4 h-12 w-12 text-[#ffdea0]/10 group-hover:scale-110 transition-transform" />
        </div>
      </section>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#181c1d] p-2 rounded-xl">
        <div className="flex items-center gap-2 p-1">
          {(['Todos', 'Aberta', 'Em Análise', 'Resolvida'] as TabFilter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors',
                activeTab === tab
                  ? 'bg-[#272B2C] text-[#a4f5b8]'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 pr-4">
          <div className="h-8 w-px bg-border/20 hidden md:block" />
          <button className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground">
            <Filter className="h-4 w-4" />
            Filtros Avançados
          </button>
          <button className="flex items-center gap-2 text-[#a4f5b8] text-sm font-medium hover:opacity-80">
            <Download className="h-4 w-4" />
            Exportar Dados
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl agro-shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/10">
              {['Pedido (#ID)', 'Farmer', 'Retailer', 'Motivo', 'Status', 'Valor (R$)', 'SLA', 'Ações'].map(
                (h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'p-6 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground',
                      i === 6 && 'text-center',
                      i === 7 && 'text-right'
                    )}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/5">
            {filtered.map((dispute) => (
              <tr key={dispute.id} className="hover:bg-[#313536]/50 transition-colors group">
                <td className="p-6 font-mono text-xs text-[#a4f5b8]">{dispute.orderNumber}</td>
                <td className="p-6 font-medium text-sm">{dispute.farmer}</td>
                <td className="p-6 font-medium text-sm">{dispute.retailer}</td>
                <td className="p-6 text-sm text-muted-foreground max-w-[180px] truncate">{dispute.reason}</td>
                <td className="p-6">
                  <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase', statusConfig[dispute.status].classes)}>
                    {statusConfig[dispute.status].label}
                  </span>
                </td>
                <td className="p-6 font-semibold text-sm">{formatCurrency(dispute.value)}</td>
                <td className="p-6 text-center">
                  <span className={cn('px-3 py-1 rounded text-[10px] font-bold inline-block min-w-[60px]', slaConfig(dispute.slaDays))}>
                    {dispute.slaDays === 0 ? '0 dias' : `${dispute.slaDays} dias`}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <Link href={`/disputes/${dispute.id}`}>
                    <button className="bg-[#272B2C] p-2 rounded-lg text-[#a4f5b8] hover:bg-[#a4f5b8] hover:text-[#00391b] transition-all">
                      <Eye className="h-4 w-4" />
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

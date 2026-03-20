'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Shield,
  MapPin,
  Mail,
  Calendar,
  FileText,
  Ban,
  Building2,
  ShoppingCart,
} from 'lucide-react';
import { cn, formatDate, formatCurrency } from '@/lib/utils';

interface PageProps {
  params: { id: string };
}

const retailerData = {
  id: '1',
  name: 'AgroFertil S.A.',
  company: 'AgroFertil Comércio e Distribuição S.A.',
  email: 'compras@agrofertil.com.br',
  phone: '+55 11 3333-4444',
  cnpj: '12.456.789/0001-10',
  region: 'São Paulo, SP',
  state: 'SP',
  status: 'Ativo',
  kycStatus: 'approved',
  segment: 'Insumos Agrícolas',
  createdAt: '2023-09-15',
  lastActivity: '2024-03-14',
  totalOrders: 127,
  totalSpend: 1842000,
  activeQuotes: 8,
};

export default function RetailerDetailPage({ params }: PageProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'kyc' | 'orders'>('overview');

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/users/retailers"
          className="flex items-center gap-2 text-muted-foreground hover:text-[#a4f5b8] transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Retailers
        </Link>

        <div className="glass-card agro-shadow rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[#f6be39]/10 flex items-center justify-center text-[#f6be39] text-2xl font-extrabold">
                {retailerData.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">{retailerData.name}</h1>
                  <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-[#a4f5b8]/20 text-[#a4f5b8] border border-[#a4f5b8]/20">
                    {retailerData.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#f6be39]/20 text-[#f6be39]">
                    {retailerData.segment}
                  </span>
                </div>
                <p className="text-muted-foreground font-light">{retailerData.company}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {retailerData.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {retailerData.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Desde {formatDate(retailerData.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button className="px-4 py-2 rounded-lg bg-[#a4f5b8]/10 text-[#a4f5b8] border border-[#a4f5b8]/20 text-sm font-semibold hover:bg-[#a4f5b8]/20 transition-colors flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Aprovar KYC
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20 text-sm font-semibold hover:bg-[#ffb4ab]/20 transition-colors flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Rejeitar KYC
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#272B2C] text-muted-foreground text-sm font-semibold hover:bg-[#313536] transition-colors flex items-center gap-2">
                <Ban className="h-4 w-4" />
                Suspender
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-[#1c2021] rounded-xl p-4 border border-border/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Total de Pedidos</p>
              <p className="text-2xl font-light tracking-tighter">{retailerData.totalOrders}</p>
            </div>
            <div className="bg-[#1c2021] rounded-xl p-4 border border-border/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Total Gasto</p>
              <p className="text-2xl font-light tracking-tighter text-[#f6be39]">{formatCurrency(retailerData.totalSpend)}</p>
            </div>
            <div className="bg-[#1c2021] rounded-xl p-4 border border-border/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">Cotações Ativas</p>
              <p className="text-2xl font-light tracking-tighter text-[#a4f5b8]">{retailerData.activeQuotes}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-[#181c1d] rounded-xl w-fit">
        {(['overview', 'kyc', 'orders'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-6 py-2 rounded-lg text-sm font-semibold transition-all capitalize',
              activeTab === tab ? 'bg-[#272B2C] text-[#a4f5b8]' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'overview' ? 'Visão Geral' : tab === 'kyc' ? 'KYC' : 'Pedidos'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="glass-card agro-shadow rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#f6be39]" />
            Dados da Empresa
          </h3>
          <dl className="space-y-3">
            {[
              { label: 'CNPJ', value: retailerData.cnpj },
              { label: 'Razão Social', value: retailerData.company },
              { label: 'Email', value: retailerData.email },
              { label: 'Telefone', value: retailerData.phone },
              { label: 'Região', value: retailerData.region },
              { label: 'Segmento', value: retailerData.segment },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/10 last:border-0">
                <dt className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">{item.label}</dt>
                <dd className="text-sm font-medium text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="glass-card agro-shadow rounded-xl p-8 text-center text-muted-foreground">
          <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Histórico de pedidos em desenvolvimento</p>
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="glass-card agro-shadow rounded-xl p-8">
          <div className="flex items-center gap-3 p-4 bg-[#a4f5b8]/10 rounded-xl border border-[#a4f5b8]/20 mb-6">
            <Shield className="h-8 w-8 text-[#a4f5b8]" />
            <div>
              <p className="font-semibold text-[#a4f5b8]">KYC Aprovado</p>
              <p className="text-xs text-muted-foreground">Verificação concluída</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

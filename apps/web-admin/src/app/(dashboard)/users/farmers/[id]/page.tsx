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
  Phone,
  Calendar,
  FileText,
  AlertTriangle,
  Ban,
  RefreshCw,
  Building2,
} from 'lucide-react';
import { cn, formatDate, formatCurrency } from '@/lib/utils';

interface PageProps {
  params: { id: string };
}

const farmerData = {
  id: '1',
  name: 'João Oliveira',
  company: 'Fazenda Santa Helena',
  email: 'joao.oliveira@agro.com.br',
  phone: '+55 65 99999-1234',
  cnpj: '45.123.789/0001-90',
  region: 'Sorriso, MT',
  state: 'MT',
  status: 'Ativo',
  kycStatus: 'approved',
  createdAt: '2023-10-12',
  lastActivity: '2024-03-15',
  totalOrders: 34,
  totalGmv: 485200,
  pendingPayouts: 12400,
};

const kycDocuments = [
  { name: 'Cartão CNPJ', size: '2.4 MB', type: 'PDF', status: 'verified', date: '2023-10-14' },
  { name: 'Contrato Social', size: '1.8 MB', type: 'PDF', status: 'verified', date: '2023-10-14' },
  { name: 'Comprovante Residência', size: '0.8 MB', type: 'PDF', status: 'verified', date: '2023-10-14' },
];

const activityTimeline = [
  { id: 1, type: 'kyc', title: 'KYC aprovado', desc: 'Verificação de identidade concluída', time: '2023-10-16', color: 'text-[#a4f5b8]', bg: 'bg-[#a4f5b8]/10' },
  { id: 2, type: 'order', title: 'Pedido criado', desc: 'Lote de Soja #IF-20934 — R$ 45.200', time: '2024-01-10', color: 'text-[#f6be39]', bg: 'bg-[#f6be39]/10' },
  { id: 3, type: 'payment', title: 'Pagamento liberado', desc: 'Holdback R$ 12.400 liberado', time: '2024-02-05', color: 'text-[#a4f5b8]', bg: 'bg-[#a4f5b8]/10' },
  { id: 4, type: 'order', title: 'Pedido concluído', desc: 'Lote de Milho #IF-21100 — R$ 28.600', time: '2024-03-01', color: 'text-[#f6be39]', bg: 'bg-[#f6be39]/10' },
];

export default function FarmerDetailPage({ params }: PageProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'kyc' | 'orders' | 'timeline'>('overview');

  return (
    <div className="space-y-8">
      {/* Back button + Header */}
      <div>
        <Link
          href="/users/farmers"
          className="flex items-center gap-2 text-muted-foreground hover:text-[#a4f5b8] transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Farmers
        </Link>

        <div className="glass-card agro-shadow rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[#a4f5b8]/10 flex items-center justify-center text-[#a4f5b8] text-2xl font-extrabold">
                {farmerData.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">{farmerData.name}</h1>
                  <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-[#a4f5b8]/20 text-[#a4f5b8] border border-[#a4f5b8]/20">
                    {farmerData.status}
                  </span>
                </div>
                <p className="text-muted-foreground font-light">{farmerData.company}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {farmerData.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {farmerData.region}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Desde {formatDate(farmerData.createdAt)}
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

          {/* Metric pills */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-[#1c2021] rounded-xl p-4 border border-border/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                Total de Pedidos
              </p>
              <p className="text-2xl font-light tracking-tighter">{farmerData.totalOrders}</p>
            </div>
            <div className="bg-[#1c2021] rounded-xl p-4 border border-border/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                GMV Total
              </p>
              <p className="text-2xl font-light tracking-tighter text-[#a4f5b8]">
                {formatCurrency(farmerData.totalGmv)}
              </p>
            </div>
            <div className="bg-[#1c2021] rounded-xl p-4 border border-border/10">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                Holdback Pendente
              </p>
              <p className="text-2xl font-light tracking-tighter text-[#f6be39]">
                {formatCurrency(farmerData.pendingPayouts)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#181c1d] rounded-xl w-fit">
        {(['overview', 'kyc', 'orders', 'timeline'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-6 py-2 rounded-lg text-sm font-semibold transition-all capitalize',
              activeTab === tab
                ? 'bg-[#272B2C] text-[#a4f5b8]'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'overview' ? 'Visão Geral' : tab === 'kyc' ? 'KYC' : tab === 'orders' ? 'Pedidos' : 'Histórico'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card agro-shadow rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#a4f5b8]" />
              Dados da Empresa
            </h3>
            <dl className="space-y-3">
              {[
                { label: 'CNPJ', value: farmerData.cnpj },
                { label: 'Razão Social', value: farmerData.company },
                { label: 'Email', value: farmerData.email },
                { label: 'Telefone', value: farmerData.phone },
                { label: 'Região', value: farmerData.region },
                { label: 'Estado', value: farmerData.state },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-border/10 last:border-0">
                  <dt className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="text-sm font-medium text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="glass-card agro-shadow rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#a4f5b8]" />
              Status KYC
            </h3>
            <div className="flex items-center gap-3 p-4 bg-[#a4f5b8]/10 rounded-xl border border-[#a4f5b8]/20 mb-6">
              <CheckCircle className="h-8 w-8 text-[#a4f5b8]" fill="currentColor" />
              <div>
                <p className="font-semibold text-[#a4f5b8]">KYC Aprovado</p>
                <p className="text-xs text-muted-foreground">Verificação concluída em {formatDate('2023-10-16')}</p>
              </div>
            </div>
            <div className="space-y-3">
              {kycDocuments.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-3 bg-[#1c2021] rounded-lg border border-border/10">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <CheckCircle className="h-4 w-4 text-[#a4f5b8]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="glass-card agro-shadow rounded-xl p-8">
          <h3 className="font-semibold mb-8">Histórico de Atividades</h3>
          <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-border/20">
            {activityTimeline.map((event) => (
              <div key={event.id} className="relative flex items-start gap-4">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 -ml-4 z-10', event.bg)}>
                  <div className={cn('w-2 h-2 rounded-full', event.color.replace('text-', 'bg-'))} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{event.title}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(event.time)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="glass-card agro-shadow rounded-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold">Documentação KYC</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-[#ffb4ab]/10 text-[#ffb4ab] text-sm font-semibold hover:bg-[#ffb4ab]/20 transition-colors">
                Rejeitar
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#a4f5b8] text-[#00391b] text-sm font-bold hover:bg-[#a4f5b8]/90 transition-colors">
                Aprovar
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kycDocuments.map((doc) => (
              <div key={doc.name} className="bg-[#1c2021] rounded-xl p-6 border border-border/10">
                <FileText className="h-10 w-10 text-muted-foreground/40 mb-4" />
                <p className="font-semibold mb-1">{doc.name}</p>
                <p className="text-xs text-muted-foreground mb-3">{doc.type} • {doc.size}</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#a4f5b8]" />
                  <span className="text-xs text-[#a4f5b8] font-semibold">Verificado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="glass-card agro-shadow rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border/10">
            <h3 className="font-semibold">Histórico de Pedidos</h3>
          </div>
          <div className="p-8 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Nenhum pedido registrado</p>
          </div>
        </div>
      )}
    </div>
  );
}

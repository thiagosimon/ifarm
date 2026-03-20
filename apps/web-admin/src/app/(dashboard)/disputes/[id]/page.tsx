'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Store,
  MessageSquare,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface PageProps {
  params: { id: string };
}

const disputeData = {
  id: '1',
  orderNumber: '#IF-9921',
  status: 'Em Análise',
  reason: 'Divergência na classificação de grãos (soja)',
  description:
    'O retailer alega que a carga de soja entregue foi classificada como Tipo 2, porém o contrato especifica Tipo 1. Laudo de classificação da EMBRAPA diverge do apresentado pelo farmer.',
  farmer: { name: 'João P. Silveira', company: 'Fazenda Boa Vista', email: 'joao@fazendaboavista.com.br' },
  retailer: { name: 'AgroFertil S.A.', email: 'compras@agrofertil.com.br' },
  value: 45200,
  openedAt: '2024-05-12',
  slaDeadline: '2024-05-19',
  slaDays: 0,
  messages: [
    { author: 'Sistema', text: 'Disputa aberta automaticamente', time: '12/05 08:00', isSystem: true },
    { author: 'AgroFertil S.A.', text: 'A classificação da soja está incorreta. Solicitamos análise do laudo técnico.', time: '12/05 09:30', isSystem: false },
    { author: 'João P. Silveira', text: 'Disponibilizo laudo de terceiros que confirma classificação Tipo 1.', time: '12/05 14:00', isSystem: false },
    { author: 'Admin iFarm', text: 'Análise em andamento. Aguardando laudos de ambas as partes.', time: '13/05 10:00', isSystem: true },
  ],
};

export default function DisputeDetailPage({ params }: PageProps) {
  const [resolution, setResolution] = React.useState('');
  const [message, setMessage] = React.useState('');

  return (
    <div className="space-y-8">
      <Link
        href="/disputes"
        className="flex items-center gap-2 text-muted-foreground hover:text-[#a4f5b8] transition-colors text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Disputas
      </Link>

      {/* Header */}
      <div className="glass-card agro-shadow rounded-xl p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Disputa {disputeData.orderNumber}
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#5c4300]/20 text-[#f6be39] border border-[#f6be39]/20">
                {disputeData.status}
              </span>
            </div>
            <p className="text-muted-foreground mb-4">{disputeData.reason}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Aberta em {formatDate(disputeData.openedAt)}</span>
              <span className="text-[#ffb4ab] font-semibold flex items-center gap-1">
                <Clock className="h-3 w-3" />
                SLA: 0 dias restantes
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
              Valor em Disputa
            </p>
            <p className="text-4xl font-light tracking-tighter text-[#f6be39]">
              {formatCurrency(disputeData.value)}
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Actions + Parties */}
        <div className="space-y-6">
          {/* Resolution */}
          <div className="glass-card agro-shadow rounded-xl p-6">
            <h3 className="font-semibold mb-4">Resolução</h3>
            <div className="space-y-3 mb-4">
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
                placeholder="Descreva a resolução da disputa..."
                className="w-full bg-[#0b0f10] border border-border/20 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none focus:ring-1 focus:ring-[#a4f5b8]"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2.5 rounded-lg bg-[#a4f5b8] text-[#00391b] text-sm font-bold hover:bg-[#a4f5b8]/90 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Resolver — Farmer
              </button>
              <button className="flex-1 px-4 py-2.5 rounded-lg bg-[#f6be39] text-[#402d00] text-sm font-bold hover:bg-[#f6be39]/90 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Resolver — Retailer
              </button>
            </div>
            <button className="w-full mt-2 px-4 py-2.5 rounded-lg bg-[#ffb4ab]/10 text-[#ffb4ab] border border-[#ffb4ab]/20 text-sm font-semibold hover:bg-[#ffb4ab]/20 transition-colors flex items-center justify-center gap-2">
              <XCircle className="h-4 w-4" />
              Fechar Sem Resolução
            </button>
          </div>

          {/* Parties */}
          <div className="glass-card agro-shadow rounded-xl p-6">
            <h3 className="font-semibold mb-4">Partes Envolvidas</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">Farmer</p>
                <div className="flex items-center gap-3 p-3 bg-[#1c2021] rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#a4f5b8]/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-[#a4f5b8]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{disputeData.farmer.name}</p>
                    <p className="text-xs text-muted-foreground">{disputeData.farmer.company}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">Retailer</p>
                <div className="flex items-center gap-3 p-3 bg-[#1c2021] rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#f6be39]/10 flex items-center justify-center">
                    <Store className="h-4 w-4 text-[#f6be39]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{disputeData.retailer.name}</p>
                    <p className="text-xs text-muted-foreground">{disputeData.retailer.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Description */}
        <div className="space-y-6">
          <div className="glass-card agro-shadow rounded-xl p-6">
            <h3 className="font-semibold mb-4">Descrição da Disputa</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{disputeData.description}</p>
          </div>

          <div className="glass-card agro-shadow rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Documentos Anexados
            </h3>
            <div className="space-y-2">
              {['Laudo EMBRAPA', 'Contrato Original', 'Nota Fiscal'].map((doc) => (
                <div key={doc} className="flex items-center justify-between p-3 bg-[#1c2021] rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{doc}</span>
                  </div>
                  <button className="text-[#a4f5b8] text-xs font-semibold hover:underline">Ver</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <div>
          <div className="glass-card agro-shadow rounded-xl overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-border/10">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#a4f5b8]" />
                Mensagens
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {disputeData.messages.map((msg, idx) => (
                <div key={idx} className={cn('flex', msg.isSystem && 'justify-center')}>
                  {msg.isSystem ? (
                    <div className="bg-[#1c2021] px-4 py-2 rounded-full text-xs text-muted-foreground">
                      <span className="font-semibold">{msg.author}:</span> {msg.text}
                    </div>
                  ) : (
                    <div className="max-w-[80%]">
                      <p className="text-[10px] font-bold text-muted-foreground mb-1">{msg.author} • {msg.time}</p>
                      <div className="bg-[#1c2021] rounded-xl p-3 text-sm">{msg.text}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 bg-[#1c2021] border border-border/20 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-[#a4f5b8]"
                />
                <button className="px-4 py-2 bg-[#a4f5b8] text-[#00391b] rounded-lg text-sm font-bold hover:bg-[#a4f5b8]/90 transition-colors">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

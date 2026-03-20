'use client';

import React from 'react';
import {
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  FileText,
  Shield,
  Clock,
  AlertCircle,
  X,
  FileCheck,
  Home,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatDateTime, getInitials } from '@/lib/utils';

interface KycEntry {
  id: string;
  number: string;
  name: string;
  email: string;
  type: 'Farmer' | 'Retailer';
  cnpj: string;
  submittedAt: string;
  waitDays: number;
  waitLabel: string;
  waitUrgency: 'critical' | 'warning' | 'ok';
  docs: string[];
}

const kycQueue: KycEntry[] = [
  {
    id: '1',
    number: '4201',
    name: 'João Fazendeiro Silva',
    email: 'joao.silva@agropoint.com',
    type: 'Farmer',
    cnpj: '12.345.678/0001-90',
    submittedAt: '12/10/2023 14:20',
    waitDays: 12,
    waitLabel: '12 dias',
    waitUrgency: 'critical',
    docs: ['cnpj', 'badge'],
  },
  {
    id: '2',
    number: '4205',
    name: 'AgroVarejo Matogrosso',
    email: 'contato@agrovarejo.com.br',
    type: 'Retailer',
    cnpj: '98.765.432/0001-11',
    submittedAt: '22/10/2023 09:15',
    waitDays: 2,
    waitLabel: '2 dias',
    waitUrgency: 'warning',
    docs: ['cnpj', 'contract', 'location'],
  },
  {
    id: '3',
    number: '4209',
    name: 'Carlos Sementes',
    email: 'carlos@sementes.com',
    type: 'Farmer',
    cnpj: '34.567.890/0001-22',
    submittedAt: '24/10/2023 16:45',
    waitDays: 0,
    waitLabel: '4 horas',
    waitUrgency: 'ok',
    docs: ['cnpj', 'badge'],
  },
  {
    id: '4',
    number: '4212',
    name: 'Fazenda Esperança',
    email: 'admin@fazendaesperanca.com',
    type: 'Farmer',
    cnpj: '56.789.012/0001-33',
    submittedAt: '24/10/2023 10:30',
    waitDays: 1,
    waitLabel: '1 dia',
    waitUrgency: 'warning',
    docs: ['cnpj', 'badge', 'home'],
  },
  {
    id: '5',
    number: '4218',
    name: 'SuperAgro Distribuidora',
    email: 'contato@superagro.com.br',
    type: 'Retailer',
    cnpj: '78.901.234/0001-44',
    submittedAt: '23/10/2023 08:00',
    waitDays: 3,
    waitLabel: '3 dias',
    waitUrgency: 'warning',
    docs: ['cnpj', 'contract'],
  },
];

const docIcons: Record<string, { icon: React.ElementType; label: string }> = {
  cnpj: { icon: FileText, label: 'CNPJ' },
  badge: { icon: CreditCard, label: 'RG/CNH' },
  contract: { icon: FileCheck, label: 'Contrato' },
  location: { icon: Home, label: 'Endereço' },
  home: { icon: Home, label: 'Comprovante' },
};

const kycDocuments = [
  { id: 'cnpj', name: 'Cartão CNPJ', size: 'PDF • 2.4 MB', icon: FileText },
  { id: 'badge', name: 'Documento Social', size: 'JPG • 1.1 MB', icon: CreditCard },
  { id: 'home', name: 'Comprovante Residência', size: 'PDF • 0.8 MB', icon: Home },
];

export default function KycQueuePage() {
  const [selectedEntry, setSelectedEntry] = React.useState<KycEntry | null>(null);
  const [selectedDoc, setSelectedDoc] = React.useState(0);
  const [rejectReason, setRejectReason] = React.useState('');
  const [showRejectModal, setShowRejectModal] = React.useState(false);

  const urgencyConfig = {
    critical: {
      color: 'text-[#ffb4ab]',
      dot: 'bg-[#ffb4ab] animate-pulse',
    },
    warning: {
      color: 'text-[#f6be39]',
      dot: 'bg-[#f6be39]',
    },
    ok: {
      color: 'text-[#a4f5b8]',
      dot: 'bg-[#a4f5b8]',
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-4">
            Fila KYC
            <span className="bg-[#89D89E]/20 text-[#a4f5b8] text-sm font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
              {kycQueue.length} pendentes
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 font-light">
            Gerenciamento de validação e verificação de identidade dos parceiros iFarm.
          </p>
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2 bg-[#272B2C] hover:bg-[#313536] text-[#a4f5b8] font-semibold rounded-lg"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar Fila
        </Button>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card agro-shadow p-8 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#a4f5b8]" />
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-4">
            Na Fila
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-light text-foreground tracking-tighter">14</span>
            <span className="text-[#89D89E] text-sm font-semibold tracking-tight">
              Verificações pendentes
            </span>
          </div>
        </div>
        <div className="glass-card agro-shadow p-8 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#f6be39]" />
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-4">
            Documentos Totais
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-light text-foreground tracking-tighter">38</span>
            <span className="text-[#f6be39] text-sm font-semibold tracking-tight">
              Arquivos analisados hoje
            </span>
          </div>
        </div>
        <div className="glass-card agro-shadow p-8 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#ffb4ab]" />
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-4">
            Mais Antigo
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-light text-foreground tracking-tighter">12</span>
            <span className="text-[#ffb4ab] text-sm font-semibold tracking-tight">
              Dias em espera crítica
            </span>
          </div>
        </div>
      </div>

      {/* Verification Table */}
      <div className="glass-card rounded-xl overflow-hidden agro-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#181c1d]/50">
              {['#', 'Usuário', 'Tipo', 'CNPJ', 'Enviado em', 'Tempo de Espera', 'Docs', 'Ações'].map(
                (h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'px-6 py-5 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground border-b border-border/10',
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
            {kycQueue.map((entry) => {
              const urgency = urgencyConfig[entry.waitUrgency];
              return (
                <tr
                  key={entry.id}
                  className="hover:bg-[#313536]/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                    {entry.number}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#272B2C] flex items-center justify-center text-[#a4f5b8] font-bold text-xs">
                        {getInitials(entry.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">{entry.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold border uppercase',
                        entry.type === 'Farmer'
                          ? 'border-[#89D89E]/20 text-[#89D89E] bg-[#89D89E]/5'
                          : 'border-[#f6be39]/20 text-[#f6be39] bg-[#f6be39]/5'
                      )}
                    >
                      {entry.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-foreground">{entry.cnpj}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{entry.submittedAt}</td>
                  <td className="px-6 py-4">
                    <span className={cn('flex items-center gap-1.5 text-xs font-bold', urgency.color)}>
                      <span className={cn('w-2 h-2 rounded-full', urgency.dot)} />
                      {entry.waitLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      {entry.docs.map((doc) => {
                        const DocIcon = docIcons[doc]?.icon || FileText;
                        return (
                          <DocIcon
                            key={doc}
                            className="h-4 w-4 text-muted-foreground"
                            title={docIcons[doc]?.label}
                          />
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedEntry(entry)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#272B2C] text-foreground hover:bg-[#313536] transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#a4f5b8]/10 text-[#a4f5b8] hover:bg-[#a4f5b8] hover:text-[#00391b] transition-colors"
                        title="Aprovar"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#ffb4ab]/10 text-[#ffb4ab] hover:bg-[#ffb4ab] hover:text-[#690005] transition-colors"
                        title="Rejeitar"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Document Viewer Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-12">
          <div className="w-full h-full max-w-7xl glass-card rounded-2xl agro-shadow flex flex-col overflow-hidden border border-border/10">
            {/* Modal Header */}
            <div className="px-8 py-6 flex justify-between items-center border-b border-border/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#89D89E]/10 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-[#89D89E]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{selectedEntry.name}</h2>
                  <p className="text-xs text-muted-foreground font-light uppercase tracking-widest">
                    Protocolo #{selectedEntry.number}-KYC-2023
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  Reportar Erro
                </Button>
                <Button
                  size="sm"
                  className="bg-[#ffb4ab]/10 text-[#ffb4ab] hover:bg-[#ffb4ab] hover:text-[#690005] border-0"
                >
                  Rejeitar Documentos
                </Button>
                <Button
                  size="sm"
                  className="bg-[#a4f5b8] text-[#00391b] hover:bg-[#a4f5b8]/90"
                >
                  Aprovar KYC
                </Button>
                <div className="h-8 w-px bg-border/20 mx-2" />
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-2 hover:bg-[#272B2C] rounded-full text-muted-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Panel */}
              <div className="w-80 bg-[#181c1d]/50 border-r border-border/10 flex flex-col">
                <div className="p-6">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-4">
                    Arquivos Enviados
                  </p>
                  <ul className="space-y-2">
                    {kycDocuments.map((doc, idx) => {
                      const DocIcon = doc.icon;
                      return (
                        <li key={doc.id}>
                          <button
                            onClick={() => setSelectedDoc(idx)}
                            className={cn(
                              'w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all',
                              selectedDoc === idx
                                ? 'bg-[#272B2C] border-l-4 border-[#a4f5b8]'
                                : 'hover:bg-[#272B2C]'
                            )}
                          >
                            <DocIcon
                              className={cn(
                                'h-5 w-5',
                                selectedDoc === idx ? 'text-[#a4f5b8]' : 'text-muted-foreground'
                              )}
                            />
                            <div>
                              <p
                                className={cn(
                                  'text-sm font-semibold',
                                  selectedDoc === idx ? 'text-foreground' : 'text-muted-foreground'
                                )}
                              >
                                {doc.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground">{doc.size}</p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Right Panel - Document Preview */}
              <div className="flex-1 p-8 flex flex-col items-center justify-center bg-[#0b0f10]/40">
                <div className="w-full max-w-2xl h-full bg-[#1c2021] rounded-xl border border-border/10 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="text-muted-foreground font-light">
                      {kycDocuments[selectedDoc]?.name}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Pré-visualização do documento
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

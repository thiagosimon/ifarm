'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  Eye,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Plus,
  Filter,
  Store,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

interface Retailer {
  id: string;
  name: string;
  email: string;
  cnpj: string;
  region: string;
  status: 'Ativo' | 'Pendente' | 'Suspenso';
  kycStatus: 'approved' | 'pending' | 'rejected' | 'docs_sent';
  createdAt: string;
  initials: string;
  initialsColor: string;
  segment: string;
}

const retailers: Retailer[] = [
  {
    id: '1',
    name: 'AgroFertil S.A.',
    email: 'compras@agrofertil.com.br',
    cnpj: '12.456.789/0001-10',
    region: 'São Paulo, SP',
    status: 'Ativo',
    kycStatus: 'approved',
    createdAt: '2023-09-15',
    initials: 'AF',
    initialsColor: 'text-[#a4f5b8] bg-[#a4f5b8]/10',
    segment: 'Insumos Agrícolas',
  },
  {
    id: '2',
    name: 'Cooagro Ltda.',
    email: 'diretoria@cooagro.com.br',
    cnpj: '34.567.890/0001-55',
    region: 'Goiânia, GO',
    status: 'Ativo',
    kycStatus: 'approved',
    createdAt: '2023-10-20',
    initials: 'CL',
    initialsColor: 'text-[#f6be39] bg-[#f6be39]/10',
    segment: 'Cooperativa',
  },
  {
    id: '3',
    name: 'Distribuidora Minas',
    email: 'admin@distminas.com.br',
    cnpj: '56.789.012/0001-77',
    region: 'Belo Horizonte, MG',
    status: 'Pendente',
    kycStatus: 'docs_sent',
    createdAt: '2023-11-10',
    initials: 'DM',
    initialsColor: 'text-[#f6be39] bg-[#f6be39]/10',
    segment: 'Distribuição',
  },
  {
    id: '4',
    name: 'Mercado Central Frutti',
    email: 'contato@mcfrutti.com.br',
    cnpj: '78.901.234/0001-99',
    region: 'Curitiba, PR',
    status: 'Ativo',
    kycStatus: 'approved',
    createdAt: '2023-08-05',
    initials: 'MC',
    initialsColor: 'text-[#a4f5b8] bg-[#a4f5b8]/10',
    segment: 'Varejo Alimentar',
  },
  {
    id: '5',
    name: 'SuperAgro Nordeste',
    email: 'admin@superagrone.com.br',
    cnpj: '90.123.456/0001-11',
    region: 'Recife, PE',
    status: 'Suspenso',
    kycStatus: 'rejected',
    createdAt: '2023-07-20',
    initials: 'SN',
    initialsColor: 'text-[#ffb4ab] bg-[#ffb4ab]/10',
    segment: 'Varejo Agro',
  },
];

const statusConfig = {
  Ativo: 'bg-[#a4f5b8]/20 text-[#a4f5b8] border border-[#a4f5b8]/20',
  Pendente: 'bg-[#f6be39]/20 text-[#f6be39] border border-[#f6be39]/20',
  Suspenso: 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/20',
};

const kycConfig = {
  approved: { icon: CheckCircle, color: 'text-[#a4f5b8]' },
  pending: { icon: Clock, color: 'text-[#f6be39]' },
  rejected: { icon: XCircle, color: 'text-[#ffb4ab]' },
  docs_sent: { icon: FileText, color: 'text-[#f6be39]' },
};

export default function RetailersPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('Todos');

  const filtered = retailers.filter((r) => {
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.cnpj.includes(search);
    const matchStatus = statusFilter === 'Todos' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#f6be39] mb-2 block">
            Marketplace Admin
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Gestão de Retailers</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Controle e verificação da base de compradores da plataforma.
          </p>
        </div>
        <button className="bg-gradient-to-br from-[#f6be39] to-[#c59300] text-[#402d00] px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 agro-shadow hover:scale-[1.02] active:scale-95 transition-all">
          <Plus className="h-4 w-4" />
          Novo Retailer
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-12 gap-6 items-end p-6 glass-card rounded-xl agro-shadow">
        <div className="col-span-5">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2">
            Pesquisa
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nome, email ou CNPJ..."
              className="w-full bg-[#272B2C] border-none rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-[#a4f5b8] text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>
        <div className="col-span-3">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2">
            Status da Conta
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#272B2C] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#a4f5b8] text-foreground outline-none appearance-none"
          >
            <option>Todos</option>
            <option>Ativo</option>
            <option>Suspenso</option>
            <option>Pendente</option>
          </select>
        </div>
        <div className="col-span-3">
          <label className="block text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest mb-2">
            Status KYC
          </label>
          <select
            className="w-full bg-[#272B2C] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#a4f5b8] text-foreground outline-none appearance-none"
          >
            <option>Todos</option>
            <option>Não Iniciado</option>
            <option>Docs Enviados</option>
            <option>Aprovado</option>
            <option>Rejeitado</option>
          </select>
        </div>
        <div className="col-span-1">
          <button className="w-full h-[44px] bg-[#313536] rounded-lg flex items-center justify-center text-foreground hover:bg-[#363a3b] transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#272B2C] rounded-xl overflow-hidden agro-shadow border border-border/10">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#181c1d]/50">
              {['Nome + Email', 'CNPJ', 'Segmento', 'Região', 'Status', 'KYC', 'Cadastro', 'Ações'].map(
                (h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'px-6 py-5 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest',
                      i === 5 && 'text-center',
                      i === 7 && 'text-right'
                    )}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {filtered.map((retailer) => {
              const KycIcon = kycConfig[retailer.kycStatus].icon;
              return (
                <tr key={retailer.id} className="hover:bg-[#313536]/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs', retailer.initialsColor)}>
                        {retailer.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{retailer.name}</p>
                        <p className="text-xs text-muted-foreground">{retailer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-muted-foreground">{retailer.cnpj}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#1c2021] text-muted-foreground uppercase">
                      {retailer.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{retailer.region}</td>
                  <td className="px-6 py-4">
                    <span className={cn('px-2 py-1 rounded text-[10px] font-bold uppercase', statusConfig[retailer.status])}>
                      {retailer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <KycIcon className={cn('h-5 w-5 mx-auto', kycConfig[retailer.kycStatus].color)} />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(retailer.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/users/retailers/${retailer.id}`}>
                        <button className="p-2 hover:bg-[#363a3b] rounded-lg transition-colors text-muted-foreground hover:text-[#a4f5b8]">
                          <Eye className="h-4 w-4" />
                        </button>
                      </Link>
                      <button className="p-2 hover:bg-[#363a3b] rounded-lg transition-colors text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Store className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">Nenhum retailer encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

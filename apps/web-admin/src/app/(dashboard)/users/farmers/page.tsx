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
} from 'lucide-react';
import { cn, getInitials, formatDate } from '@/lib/utils';

interface Farmer {
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
}

const farmers: Farmer[] = [
  {
    id: '1',
    name: 'João Oliveira',
    email: 'joao.oliveira@agro.com.br',
    cnpj: '45.123.789/0001-90',
    region: 'Sorriso, MT',
    status: 'Ativo',
    kycStatus: 'approved',
    createdAt: '2023-10-12',
    initials: 'JO',
    initialsColor: 'text-[#a4f5b8] bg-[#a4f5b8]/10',
  },
  {
    id: '2',
    name: 'Maria Silva',
    email: 'maria.silva@fazenda.com',
    cnpj: '12.987.654/0001-22',
    region: 'Cristalina, GO',
    status: 'Pendente',
    kycStatus: 'pending',
    createdAt: '2023-11-05',
    initials: 'MS',
    initialsColor: 'text-[#f6be39] bg-[#f6be39]/10',
  },
  {
    id: '3',
    name: 'Ricardo Batista',
    email: 'ricardo@batistagraos.com',
    cnpj: '08.456.123/0001-11',
    region: 'Londrina, PR',
    status: 'Suspenso',
    kycStatus: 'rejected',
    createdAt: '2023-09-18',
    initials: 'RB',
    initialsColor: 'text-[#ffb4ab] bg-[#ffb4ab]/10',
  },
  {
    id: '4',
    name: 'Fazenda Progresso',
    email: 'admin@progresso.com.br',
    cnpj: '33.111.222/0001-33',
    region: 'Uberlândia, MG',
    status: 'Ativo',
    kycStatus: 'approved',
    createdAt: '2023-11-22',
    initials: 'FP',
    initialsColor: 'text-[#a4f5b8] bg-[#a4f5b8]/10',
  },
  {
    id: '5',
    name: 'Agro Grãos SA',
    email: 'contato@agrobraos.com',
    cnpj: '21.000.444/0001-05',
    region: 'Luís Eduardo Magalhães, BA',
    status: 'Pendente',
    kycStatus: 'docs_sent',
    createdAt: '2023-12-01',
    initials: 'AG',
    initialsColor: 'text-[#f6be39] bg-[#f6be39]/10',
  },
  {
    id: '6',
    name: 'Carlos Vieira',
    email: 'cvieira@agro.bio',
    cnpj: '19.222.333/0001-88',
    region: 'Sinop, MT',
    status: 'Ativo',
    kycStatus: 'approved',
    createdAt: '2023-12-10',
    initials: 'CV',
    initialsColor: 'text-[#a4f5b8] bg-[#a4f5b8]/10',
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

export default function FarmersPage() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('Todos');
  const [kycFilter, setKycFilter] = React.useState('Todos');

  const filtered = farmers.filter((f) => {
    const matchSearch =
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.cnpj.includes(search);
    const matchStatus = statusFilter === 'Todos' || f.status === statusFilter;
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
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Gestão de Farmers</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Controle e verificação da base de produtores rurais.
          </p>
        </div>
        <button className="bg-gradient-to-br from-[#a4f5b8] to-[#89D89E] text-[#00391b] px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 agro-shadow hover:scale-[1.02] active:scale-95 transition-all">
          <Plus className="h-4 w-4" />
          Novo Farmer
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
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
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
              {['Nome + Email', 'CNPJ', 'Região', 'Status', 'KYC', 'Cadastro', 'Ações'].map(
                (h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'px-6 py-5 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest',
                      i === 4 && 'text-center',
                      i === 6 && 'text-right'
                    )}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/10">
            {filtered.map((farmer) => {
              const KycIcon = kycConfig[farmer.kycStatus].icon;
              return (
                <tr key={farmer.id} className="hover:bg-[#313536]/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs',
                          farmer.initialsColor
                        )}
                      >
                        {farmer.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{farmer.name}</p>
                        <p className="text-xs text-muted-foreground">{farmer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                    {farmer.cnpj}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{farmer.region}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-[10px] font-bold uppercase',
                        statusConfig[farmer.status]
                      )}
                    >
                      {farmer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <KycIcon
                      className={cn('h-5 w-5 mx-auto', kycConfig[farmer.kycStatus].color)}
                      fill="currentColor"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(farmer.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/users/farmers/${farmer.id}`}>
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
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="font-medium">Nenhum farmer encontrado</p>
            <p className="text-sm mt-1">Tente ajustar os filtros de pesquisa</p>
          </div>
        )}
      </div>
    </div>
  );
}

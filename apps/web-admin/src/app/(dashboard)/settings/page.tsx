'use client';

import React from 'react';
import { Edit, Save, X } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

const commissionTiers = [
  { tier: 'Semente', rate: '12.5%', minGmv: 'R$ 0,00', maxGmv: 'R$ 50.000,00' },
  { tier: 'Crescimento', rate: '10.0%', minGmv: 'R$ 50.000,01', maxGmv: 'R$ 250.000,00' },
  { tier: 'Colheita', rate: '8.5%', minGmv: 'R$ 250.000,01', maxGmv: 'R$ 1.000.000,00' },
  { tier: 'Latifúndio', rate: '6.0%', minGmv: 'R$ 1.000.000,01', maxGmv: 'Ilimitado' },
];

const enabledStates = ['SP', 'MG', 'PR', 'RS', 'GO', 'MT', 'MS', 'SC', 'RJ', 'ES', 'BA', 'TO'];
const allStates = [
  'SP', 'MG', 'PR', 'RS', 'GO', 'MT', 'MS', 'SC', 'RJ', 'ES', 'BA', 'TO',
  'AM', 'AC', 'PA', 'RO', 'RR', 'AP', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'DF',
];

const operationalParams = [
  { label: 'Holdback (dias úteis)', value: '7', key: 'holdback' },
  { label: 'Taxa de Serviço Padrão (%)', value: '5.0', key: 'serviceFee' },
  { label: 'Limite de Cotações Simultâneas', value: '10', key: 'quoteLimit' },
  { label: 'SLA Disputas (dias úteis)', value: '7', key: 'disputeSla' },
  { label: 'Valor Mínimo de Pedido (R$)', value: '1.000,00', key: 'minOrder' },
  { label: 'Comissão Máxima (%)', value: '15.0', key: 'maxCommission' },
];

export default function SettingsPage() {
  const [editingTier, setEditingTier] = React.useState<string | null>(null);
  const [activeStates, setActiveStates] = React.useState<Set<string>>(new Set(enabledStates));
  const [params, setParams] = React.useState<Record<string, string>>(
    Object.fromEntries(operationalParams.map((p) => [p.key, p.value]))
  );
  const [editingParam, setEditingParam] = React.useState<string | null>(null);

  const toggleState = (state: string) => {
    setActiveStates((prev) => {
      const next = new Set(prev);
      if (next.has(state)) {
        next.delete(state);
      } else {
        next.add(state);
      }
      return next;
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <span className="h-[2px] w-8 bg-[#f6be39]" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#f6be39]">
            Preferências do Sistema
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
          Configurações
        </h1>
        <p className="text-muted-foreground font-light max-w-2xl leading-relaxed">
          Gerencie os parâmetros operacionais da plataforma iFarm, desde as taxas de
          comissionamento até a infraestrutura regional.
        </p>
      </header>

      {/* Commission Tiers */}
      <section className="glass-card agro-shadow rounded-xl overflow-hidden">
        <div className="p-6 border-l-[3px] border-[#f6be39] flex items-center justify-between bg-[#272B2C]/50">
          <h2 className="text-xl font-semibold text-foreground">Tiers de Comissão</h2>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground opacity-60">
            Global Marketplace
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0b0f10]/50 border-b border-border/10">
                {['Tier', 'Taxa %', 'GMV Mínimo', 'GMV Máximo', 'Ação'].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      'px-6 py-4 text-[11px] font-extrabold uppercase tracking-tighter text-muted-foreground',
                      i === 4 && 'text-right'
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {commissionTiers.map((tier) => (
                <tr key={tier.tier} className="hover:bg-[#272B2C]/30 transition-colors">
                  <td className="px-6 py-5 font-semibold text-[#a4f5b8]">{tier.tier}</td>
                  <td className="px-6 py-5">{tier.rate}</td>
                  <td className="px-6 py-5 text-muted-foreground">{tier.minGmv}</td>
                  <td className="px-6 py-5 text-muted-foreground">{tier.maxGmv}</td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => setEditingTier(editingTier === tier.tier ? null : tier.tier)}
                      className="p-2 hover:bg-[#272B2C] rounded-lg transition-colors text-muted-foreground hover:text-[#a4f5b8]"
                    >
                      {editingTier === tier.tier ? (
                        <Save className="h-4 w-4" />
                      ) : (
                        <Edit className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Enabled Regions */}
      <section className="glass-card agro-shadow rounded-xl p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#a4f5b8] animate-pulse" />
              <h2 className="text-xl font-semibold text-foreground">Regiões Habilitadas</h2>
            </div>
            <p className="text-muted-foreground text-sm font-light">
              Status geográfico da operação iFarm Brasil.
            </p>
          </div>
          <div className="px-4 py-2 bg-[#0b0f10] rounded-lg border border-border/10">
            <span className="text-[#a4f5b8] font-bold">{activeStates.size}</span>
            <span className="text-muted-foreground text-[11px] font-extrabold uppercase tracking-tight ml-1">
              de 27 Estados habilitados
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-3">
          {allStates.map((state) => {
            const isActive = activeStates.has(state);
            return (
              <button
                key={state}
                onClick={() => toggleState(state)}
                className={cn(
                  'flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all',
                  isActive
                    ? 'bg-[#005229]/50 border-[#a4f5b8]/20 hover:bg-[#005229]/70'
                    : 'bg-[#0b0f10] border-border/10 hover:bg-[#1c2021] opacity-40'
                )}
              >
                <span
                  className={cn(
                    'text-[11px] font-extrabold',
                    isActive ? 'text-[#a4f5b8]' : 'text-muted-foreground'
                  )}
                >
                  {state}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Operational Parameters */}
      <section className="glass-card agro-shadow rounded-xl p-8">
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-2">Parâmetros Operacionais</h2>
          <p className="text-muted-foreground text-sm font-light">
            Configurações financeiras e operacionais globais da plataforma.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {operationalParams.map((param) => (
            <div key={param.key} className="flex items-center justify-between p-4 bg-[#1c2021] rounded-xl border border-border/10">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1">
                  {param.label}
                </p>
                {editingParam === param.key ? (
                  <input
                    value={params[param.key]}
                    onChange={(e) => setParams((prev) => ({ ...prev, [param.key]: e.target.value }))}
                    className="bg-[#0b0f10] border border-[#a4f5b8]/20 rounded px-2 py-1 text-sm text-foreground outline-none focus:ring-1 focus:ring-[#a4f5b8] w-32"
                    autoFocus
                  />
                ) : (
                  <p className="text-lg font-semibold text-[#a4f5b8]">{params[param.key]}</p>
                )}
              </div>
              <div className="flex gap-1">
                {editingParam === param.key ? (
                  <>
                    <button
                      onClick={() => setEditingParam(null)}
                      className="p-2 hover:bg-[#272B2C] rounded-lg transition-colors text-[#a4f5b8]"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingParam(null)}
                      className="p-2 hover:bg-[#272B2C] rounded-lg transition-colors text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingParam(param.key)}
                    className="p-2 hover:bg-[#272B2C] rounded-lg transition-colors text-muted-foreground hover:text-[#a4f5b8]"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button className="px-6 py-2.5 rounded-lg bg-[#272B2C] text-muted-foreground text-sm font-semibold hover:bg-[#313536] transition-colors">
            Cancelar
          </button>
          <button className="px-6 py-2.5 rounded-lg bg-[#a4f5b8] text-[#00391b] text-sm font-bold hover:bg-[#a4f5b8]/90 transition-colors flex items-center gap-2">
            <Save className="h-4 w-4" />
            Salvar Configurações
          </button>
        </div>
      </section>
    </div>
  );
}

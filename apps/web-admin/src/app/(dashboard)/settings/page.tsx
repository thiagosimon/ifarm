'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Settings as SettingsIcon,
  Percent,
  MapPin,
  Flag,
  Save,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Globe,
  Server,
} from 'lucide-react';
import { formatPercentage } from '@/lib/utils';
import {
  fetchCommissionTiers,
  updateCommissionTier,
  fetchEnabledRegions,
  updateEnabledRegions,
  fetchSystemConfig,
  updateSystemConfig,
  type CommissionTier,
} from '@/lib/api';
import toast from 'react-hot-toast';

const mockTiers: CommissionTier[] = [
  { tierId: 'basic', name: 'Basico', rate: 5.0, minGmv: 0, maxGmv: 50000 },
  { tierId: 'bronze', name: 'Bronze', rate: 4.5, minGmv: 50001, maxGmv: 150000 },
  { tierId: 'silver', name: 'Prata', rate: 4.0, minGmv: 150001, maxGmv: 500000 },
  { tierId: 'gold', name: 'Ouro', rate: 3.5, minGmv: 500001, maxGmv: 1000000 },
  { tierId: 'platinum', name: 'Platina', rate: 3.0, minGmv: 1000001 },
];

const allRegions = [
  { code: 'SP', name: 'Sao Paulo' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PR', name: 'Parana' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'BA', name: 'Bahia' },
  { code: 'GO', name: 'Goias' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'CE', name: 'Ceara' },
  { code: 'PA', name: 'Para' },
  { code: 'MA', name: 'Maranhao' },
  { code: 'ES', name: 'Espirito Santo' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'TO', name: 'Tocantins' },
  { code: 'RO', name: 'Rondonia' },
];

const mockEnabledRegions = ['SP', 'RJ', 'MG', 'PR', 'RS', 'SC', 'GO', 'MT', 'MS', 'BA'];

const mockConfig = {
  holdbackDays: 7,
  maxOrderAmount: 500000,
  minOrderAmount: 50,
  kycSlaBusinessDays: 5,
  disputeSlaBusinessDays: 10,
  payoutFrequency: 'weekly',
  maintenanceMode: false,
};

export default function SettingsPage() {
  const [tiers, setTiers] = React.useState<CommissionTier[]>(mockTiers);
  const [enabledRegions, setEnabledRegions] = React.useState<string[]>(mockEnabledRegions);
  const [config, setConfig] = React.useState(mockConfig);
  const [loading, setLoading] = React.useState(false);

  // Edit tier modal
  const [editTierOpen, setEditTierOpen] = React.useState(false);
  const [editingTier, setEditingTier] = React.useState<CommissionTier | null>(null);
  const [editRate, setEditRate] = React.useState('');
  const [editMinGmv, setEditMinGmv] = React.useState('');
  const [editMaxGmv, setEditMaxGmv] = React.useState('');

  const [savingTier, setSavingTier] = React.useState(false);
  const [savingRegions, setSavingRegions] = React.useState(false);
  const [savingConfig, setSavingConfig] = React.useState(false);

  const loadSettings = React.useCallback(async () => {
    setLoading(true);
    try {
      const [tiersData, regionsData, configData] = await Promise.allSettled([
        fetchCommissionTiers(),
        fetchEnabledRegions(),
        fetchSystemConfig(),
      ]);
      if (tiersData.status === 'fulfilled' && tiersData.value?.tiers) {
        setTiers(tiersData.value.tiers);
      }
      if (regionsData.status === 'fulfilled' && regionsData.value?.regions) {
        setEnabledRegions(regionsData.value.regions);
      }
      if (configData.status === 'fulfilled' && configData.value) {
        setConfig(configData.value);
      }
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const openEditTier = (tier: CommissionTier) => {
    setEditingTier(tier);
    setEditRate(tier.rate.toString());
    setEditMinGmv(tier.minGmv?.toString() || '');
    setEditMaxGmv(tier.maxGmv?.toString() || '');
    setEditTierOpen(true);
  };

  const handleSaveTier = async () => {
    if (!editingTier) return;
    setSavingTier(true);
    try {
      await updateCommissionTier(editingTier.tierId, {
        rate: parseFloat(editRate),
        minGmv: editMinGmv ? parseInt(editMinGmv) : undefined,
        maxGmv: editMaxGmv ? parseInt(editMaxGmv) : undefined,
      });
      setTiers((prev) =>
        prev.map((t) =>
          t.tierId === editingTier.tierId
            ? {
                ...t,
                rate: parseFloat(editRate),
                minGmv: editMinGmv ? parseInt(editMinGmv) : t.minGmv,
                maxGmv: editMaxGmv ? parseInt(editMaxGmv) : t.maxGmv,
              }
            : t
        )
      );
      toast.success(`Tier ${editingTier.name} atualizado`);
      setEditTierOpen(false);
    } catch {
      toast.error('Erro ao atualizar tier');
    } finally {
      setSavingTier(false);
    }
  };

  const toggleRegion = (regionCode: string) => {
    setEnabledRegions((prev) =>
      prev.includes(regionCode)
        ? prev.filter((r) => r !== regionCode)
        : [...prev, regionCode]
    );
  };

  const handleSaveRegions = async () => {
    setSavingRegions(true);
    try {
      await updateEnabledRegions(enabledRegions);
      toast.success('Regioes atualizadas com sucesso');
    } catch {
      toast.error('Erro ao salvar regioes');
    } finally {
      setSavingRegions(false);
    }
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      await updateSystemConfig(config);
      toast.success('Configuracoes do sistema atualizadas');
    } catch {
      toast.error('Erro ao salvar configuracoes');
    } finally {
      setSavingConfig(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuracoes</h1>
          <p className="text-muted-foreground">Gerenciar parametros do sistema</p>
        </div>
        <Button variant="outline" size="icon" onClick={loadSettings} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Commission Tiers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Taxas de Comissao por Tier</CardTitle>
                <CardDescription>
                  Comissao iFarm sobre valor total da NF (RFN-001). Aplicada via split no Pagar.me.
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tier</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>GMV Minimo</TableHead>
                <TableHead>GMV Maximo</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.map((tier) => (
                <TableRow key={tier.tierId}>
                  <TableCell className="font-medium">{tier.name}</TableCell>
                  <TableCell>
                    <Badge variant="info">{tier.rate}%</Badge>
                  </TableCell>
                  <TableCell>
                    {tier.minGmv !== undefined
                      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tier.minGmv)
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {tier.maxGmv !== undefined
                      ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tier.maxGmv)
                      : 'Sem limite'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="xs" onClick={() => openEditTier(tier)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Enabled Regions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Regioes Habilitadas</CardTitle>
                <CardDescription>
                  Estados onde a plataforma opera. Ative/desative conforme expansao.
                </CardDescription>
              </div>
            </div>
            <Button onClick={handleSaveRegions} disabled={savingRegions} loading={savingRegions}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Regioes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {allRegions.map((region) => {
              const isEnabled = enabledRegions.includes(region.code);
              return (
                <button
                  key={region.code}
                  onClick={() => toggleRegion(region.code)}
                  className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors ${
                    isEnabled
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <div className="text-left">
                    <p className="font-medium">{region.code}</p>
                    <p className="text-xs">{region.name}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {enabledRegions.length} de {allRegions.length} estados habilitados
          </p>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Configuracoes do Sistema</CardTitle>
                <CardDescription>
                  Parametros operacionais da plataforma
                </CardDescription>
              </div>
            </div>
            <Button onClick={handleSaveConfig} disabled={savingConfig} loading={savingConfig}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Configuracoes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Holdback (dias uteis)</label>
              <Input
                type="number"
                value={config.holdbackDays}
                onChange={(e) => setConfig({ ...config, holdbackDays: parseInt(e.target.value) || 7 })}
              />
              <p className="mt-1 text-xs text-muted-foreground">RFN-002: Periodo antes do payout</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Valor Maximo por Pedido (R$)</label>
              <Input
                type="number"
                value={config.maxOrderAmount}
                onChange={(e) => setConfig({ ...config, maxOrderAmount: parseInt(e.target.value) || 500000 })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Valor Minimo por Pedido (R$)</label>
              <Input
                type="number"
                value={config.minOrderAmount}
                onChange={(e) => setConfig({ ...config, minOrderAmount: parseInt(e.target.value) || 50 })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">SLA KYC (dias uteis)</label>
              <Input
                type="number"
                value={config.kycSlaBusinessDays}
                onChange={(e) => setConfig({ ...config, kycSlaBusinessDays: parseInt(e.target.value) || 5 })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">SLA Disputas (dias uteis)</label>
              <Input
                type="number"
                value={config.disputeSlaBusinessDays}
                onChange={(e) => setConfig({ ...config, disputeSlaBusinessDays: parseInt(e.target.value) || 10 })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Frequencia de Payout</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={config.payoutFrequency}
                onChange={(e) => setConfig({ ...config, payoutFrequency: e.target.value })}
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
                <option value="biweekly">Quinzenal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="mt-6 flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div>
              <p className="font-medium text-yellow-800">Modo Manutencao</p>
              <p className="text-sm text-yellow-700">
                Quando ativo, a plataforma exibe uma mensagem de manutencao para todos os usuarios.
              </p>
            </div>
            <button
              onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.maintenanceMode ? 'bg-yellow-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags Link */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Flag className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium">Feature Flags</p>
              <p className="text-sm text-muted-foreground">
                Gerenciar feature flags no painel de configuracao remota
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => window.open('/settings/feature-flags', '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir Painel
          </Button>
        </CardContent>
      </Card>

      {/* Edit Tier Modal */}
      <Dialog open={editTierOpen} onOpenChange={setEditTierOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tier: {editingTier?.name}</DialogTitle>
            <DialogDescription>
              Altere a taxa de comissao e faixas de GMV para este tier.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Taxa de Comissao (%)</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={editRate}
                onChange={(e) => setEditRate(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">GMV Minimo (R$)</label>
              <Input
                type="number"
                min="0"
                value={editMinGmv}
                onChange={(e) => setEditMinGmv(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">GMV Maximo (R$)</label>
              <Input
                type="number"
                min="0"
                value={editMaxGmv}
                onChange={(e) => setEditMaxGmv(e.target.value)}
                placeholder="Deixe vazio para sem limite"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTierOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTier} disabled={savingTier || !editRate} loading={savingTier}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  Clock,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Scale,
  Timer,
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime, calculateBusinessDaysRemaining } from '@/lib/utils';
import { fetchDisputes, resolveDispute, type DisputeResolution } from '@/lib/api';
import toast from 'react-hot-toast';

interface Dispute {
  id: string;
  orderId: string;
  orderNumber: string;
  farmerName: string;
  retailerName: string;
  reason: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  totalAmount: number;
  createdAt: string;
  slaDeadline: string;
  resolution?: {
    type: DisputeResolution;
    reason: string;
    partialAmount?: number;
    resolvedAt: string;
    resolvedBy: string;
  };
}

const mockDisputes: Dispute[] = [
  {
    id: 'dsp-1',
    orderId: 'ord-4',
    orderNumber: '#2844',
    farmerName: 'Fazenda Girassol',
    retailerName: 'Sabores do Campo',
    reason: 'Produtos entregues com qualidade abaixo do esperado. Tomates com sinais de apodrecimento e alface murcha.',
    status: 'OPEN',
    totalAmount: 6300.0,
    createdAt: '2025-03-10T08:00:00Z',
    slaDeadline: '2025-03-24T08:00:00Z',
  },
  {
    id: 'dsp-2',
    orderId: 'ord-10',
    orderNumber: '#2835',
    farmerName: 'Rancho Verde Organicos',
    retailerName: 'Mercado Natural',
    reason: 'Quantidade entregue divergente do pedido. Faltaram 3 caixas de morangos e 2 de mirtilo.',
    status: 'OPEN',
    totalAmount: 4200.0,
    createdAt: '2025-03-12T14:30:00Z',
    slaDeadline: '2025-03-26T14:30:00Z',
  },
  {
    id: 'dsp-3',
    orderId: 'ord-15',
    orderNumber: '#2828',
    farmerName: 'Sitio Boa Esperanca',
    retailerName: 'Supermercado Alvorada',
    reason: 'Embalagem danificada durante transporte. Varios produtos amassados.',
    status: 'IN_REVIEW',
    totalAmount: 8100.0,
    createdAt: '2025-03-08T10:00:00Z',
    slaDeadline: '2025-03-22T10:00:00Z',
  },
  {
    id: 'dsp-4',
    orderId: 'ord-20',
    orderNumber: '#2820',
    farmerName: 'Fazenda Bela Vista',
    retailerName: 'Hortifruti Fresco',
    reason: 'Entrega com 4 dias de atraso, produtos perderam validade.',
    status: 'RESOLVED',
    totalAmount: 11500.0,
    createdAt: '2025-03-01T09:00:00Z',
    slaDeadline: '2025-03-15T09:00:00Z',
    resolution: {
      type: 'FARMER_WINS',
      reason: 'Retailer confirma que transportadora atrasou. Reembolso total ao retailer.',
      resolvedAt: '2025-03-10T16:00:00Z',
      resolvedBy: 'Admin Joao',
    },
  },
  {
    id: 'dsp-5',
    orderId: 'ord-22',
    orderNumber: '#2818',
    farmerName: 'Cooperativa Agropecuaria do Vale',
    retailerName: 'Terra Boa Distribuidora',
    reason: 'Produtos nao correspondem a descricao. Laranjas eram de variedade diferente.',
    status: 'RESOLVED',
    totalAmount: 5600.0,
    createdAt: '2025-02-25T11:00:00Z',
    slaDeadline: '2025-03-11T11:00:00Z',
    resolution: {
      type: 'PARTIAL_REFUND',
      reason: 'Variedade diferente porem aceitavel. Reembolso parcial de 30%.',
      partialAmount: 1680.0,
      resolvedAt: '2025-03-05T14:00:00Z',
      resolvedBy: 'Admin Maria',
    },
  },
];

export default function DisputesPage() {
  const [disputes, setDisputes] = React.useState<Dispute[]>(mockDisputes);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  // Resolution modal
  const [resolveOpen, setResolveOpen] = React.useState(false);
  const [resolveTarget, setResolveTarget] = React.useState<Dispute | null>(null);
  const [resolutionType, setResolutionType] = React.useState<DisputeResolution | ''>('');
  const [resolutionReason, setResolutionReason] = React.useState('');
  const [partialAmount, setPartialAmount] = React.useState('');
  const [resolveLoading, setResolveLoading] = React.useState(false);

  // Detail modal
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailDispute, setDetailDispute] = React.useState<Dispute | null>(null);

  const loadDisputes = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchDisputes({
        page,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      if (data?.items) setDisputes(data.items);
    } catch {
      // Use mock data on error
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  React.useEffect(() => {
    loadDisputes();
  }, [loadDisputes]);

  const filtered = disputes.filter((d) => {
    return statusFilter === 'all' || d.status === statusFilter;
  });

  const openResolveModal = (dispute: Dispute) => {
    setResolveTarget(dispute);
    setResolutionType('');
    setResolutionReason('');
    setPartialAmount('');
    setResolveOpen(true);
  };

  const handleResolve = async () => {
    if (!resolveTarget || !resolutionType) return;
    setResolveLoading(true);
    try {
      await resolveDispute(resolveTarget.id, resolutionType as DisputeResolution, {
        reason: resolutionReason,
        partialAmount: resolutionType === 'PARTIAL_REFUND' ? parseFloat(partialAmount) : undefined,
      });

      const resolutionLabels: Record<string, string> = {
        FARMER_WINS: 'Reembolso total concedido ao retailer',
        RETAILER_WINS: 'Disputa encerrada a favor do lojista',
        PARTIAL_REFUND: `Reembolso parcial de ${formatCurrency(parseFloat(partialAmount) || 0)} concedido`,
      };

      toast.success(resolutionLabels[resolutionType] || 'Disputa resolvida');
      loadDisputes();
    } catch {
      toast.error('Erro ao resolver disputa');
    } finally {
      setResolveLoading(false);
      setResolveOpen(false);
      setResolveTarget(null);
    }
  };

  const getSlaBadge = (dispute: Dispute) => {
    if (dispute.status === 'RESOLVED') {
      return <Badge variant="success">Resolvida</Badge>;
    }
    const daysLeft = calculateBusinessDaysRemaining(dispute.slaDeadline);
    if (daysLeft <= 0) {
      return <Badge variant="error">SLA Estourado</Badge>;
    }
    if (daysLeft <= 2) {
      return (
        <Badge variant="error">
          <Timer className="mr-1 h-3 w-3" />
          {daysLeft}d uteis
        </Badge>
      );
    }
    return (
      <Badge variant="warning">
        <Timer className="mr-1 h-3 w-3" />
        {daysLeft}d uteis
      </Badge>
    );
  };

  const disputeStatusMap: Record<string, { label: string; variant: 'warning' | 'info' | 'success' }> = {
    OPEN: { label: 'Aberta', variant: 'warning' },
    IN_REVIEW: { label: 'Em Analise', variant: 'info' },
    RESOLVED: { label: 'Resolvida', variant: 'success' },
  };

  const openCount = disputes.filter((d) => d.status !== 'RESOLVED').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Disputas</h1>
          <p className="text-muted-foreground">Gerenciar disputas de pedidos com SLA de 10 dias uteis</p>
        </div>
        <div className="flex items-center gap-3">
          {openCount > 0 && (
            <Badge variant="error" className="text-sm">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {openCount} abertas
            </Badge>
          )}
          <Button variant="outline" size="icon" onClick={loadDisputes} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Abertas</p>
              <p className="text-2xl font-bold">
                {disputes.filter((d) => d.status === 'OPEN').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Em Analise</p>
              <p className="text-2xl font-bold">
                {disputes.filter((d) => d.status === 'IN_REVIEW').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolvidas</p>
              <p className="text-2xl font-bold">
                {disputes.filter((d) => d.status === 'RESOLVED').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Scale className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor em Disputa</p>
              <p className="text-2xl font-bold">
                {formatCurrency(
                  disputes.filter((d) => d.status !== 'RESOLVED').reduce((a, d) => a + d.totalAmount, 0)
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="OPEN">Abertas</SelectItem>
            <SelectItem value="IN_REVIEW">Em Analise</SelectItem>
            <SelectItem value="RESOLVED">Resolvidas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Retailer</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    Nenhuma disputa encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((dispute) => (
                  <TableRow key={dispute.id}>
                    <TableCell className="font-mono font-medium">{dispute.orderNumber}</TableCell>
                    <TableCell className="text-sm">{dispute.farmerName}</TableCell>
                    <TableCell className="text-sm">{dispute.retailerName}</TableCell>
                    <TableCell>
                      <p className="max-w-[200px] truncate text-sm" title={dispute.reason}>
                        {dispute.reason}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={disputeStatusMap[dispute.status]?.variant || 'secondary'}>
                        {disputeStatusMap[dispute.status]?.label || dispute.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(dispute.totalAmount)}
                    </TableCell>
                    <TableCell>{getSlaBadge(dispute)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setDetailDispute(dispute);
                            setDetailOpen(true);
                          }}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {dispute.status !== 'RESOLVED' && (
                          <Button
                            size="xs"
                            onClick={() => openResolveModal(dispute)}
                          >
                            Resolver
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filtered.length} disputas
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm">Pagina {page}</span>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>
            Proximo
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Resolution Modal */}
      <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Resolver Disputa - {resolveTarget?.orderNumber}</DialogTitle>
            <DialogDescription>
              Selecione a resolucao e informe os detalhes da decisao.
            </DialogDescription>
          </DialogHeader>

          {resolveTarget && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                <p className="mb-2 font-medium">Motivo da Disputa:</p>
                <p className="text-muted-foreground">{resolveTarget.reason}</p>
                <div className="mt-2 flex items-center gap-4">
                  <span>Valor: <strong>{formatCurrency(resolveTarget.totalAmount)}</strong></span>
                  <span>SLA: {getSlaBadge(resolveTarget)}</span>
                </div>
              </div>

              {/* Resolution type buttons */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Decisao:</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setResolutionType('FARMER_WINS')}
                    className={`rounded-lg border p-3 text-center text-sm transition-colors ${
                      resolutionType === 'FARMER_WINS'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <CheckCircle className="mx-auto mb-1 h-5 w-5" />
                    Farmer tem razao
                    <p className="mt-1 text-xs text-muted-foreground">Reembolso total</p>
                  </button>
                  <button
                    onClick={() => setResolutionType('RETAILER_WINS')}
                    className={`rounded-lg border p-3 text-center text-sm transition-colors ${
                      resolutionType === 'RETAILER_WINS'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <CheckCircle className="mx-auto mb-1 h-5 w-5" />
                    Lojista tem razao
                    <p className="mt-1 text-xs text-muted-foreground">Encerrar disputa</p>
                  </button>
                  <button
                    onClick={() => setResolutionType('PARTIAL_REFUND')}
                    className={`rounded-lg border p-3 text-center text-sm transition-colors ${
                      resolutionType === 'PARTIAL_REFUND'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Scale className="mx-auto mb-1 h-5 w-5" />
                    Parcial
                    <p className="mt-1 text-xs text-muted-foreground">Reembolso parcial</p>
                  </button>
                </div>
              </div>

              {/* Partial amount input */}
              {resolutionType === 'PARTIAL_REFUND' && (
                <div>
                  <label className="mb-1 block text-sm font-medium">Valor do reembolso parcial</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={resolveTarget.totalAmount}
                    placeholder="0.00"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Maximo: {formatCurrency(resolveTarget.totalAmount)}
                  </p>
                </div>
              )}

              {/* Reason */}
              <Textarea
                placeholder="Detalhes da decisao (obrigatorio)..."
                value={resolutionReason}
                onChange={(e) => setResolutionReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleResolve}
              disabled={
                !resolutionType ||
                !resolutionReason.trim() ||
                (resolutionType === 'PARTIAL_REFUND' && (!partialAmount || parseFloat(partialAmount) <= 0)) ||
                resolveLoading
              }
              loading={resolveLoading}
            >
              Confirmar Resolucao
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Disputa - {detailDispute?.orderNumber}</DialogTitle>
          </DialogHeader>
          {detailDispute && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Farmer</p>
                  <p className="font-medium">{detailDispute.farmerName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Retailer</p>
                  <p className="font-medium">{detailDispute.retailerName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Valor do Pedido</p>
                  <p className="font-medium">{formatCurrency(detailDispute.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={disputeStatusMap[detailDispute.status]?.variant}>
                    {disputeStatusMap[detailDispute.status]?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Aberta em</p>
                  <p className="font-medium">{formatDateTime(detailDispute.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">SLA</p>
                  {getSlaBadge(detailDispute)}
                </div>
              </div>

              <div>
                <p className="mb-1 text-xs text-muted-foreground">Motivo</p>
                <p className="rounded-lg border bg-muted/50 p-3 text-sm">{detailDispute.reason}</p>
              </div>

              {detailDispute.resolution && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="mb-2 text-sm font-medium text-green-800">Resolucao</p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Tipo: </span>
                      <Badge variant="success">
                        {detailDispute.resolution.type === 'FARMER_WINS'
                          ? 'Farmer tem razao'
                          : detailDispute.resolution.type === 'RETAILER_WINS'
                            ? 'Lojista tem razao'
                            : 'Reembolso Parcial'}
                      </Badge>
                    </p>
                    {detailDispute.resolution.partialAmount && (
                      <p>
                        <span className="text-muted-foreground">Valor reembolsado: </span>
                        <strong>{formatCurrency(detailDispute.resolution.partialAmount)}</strong>
                      </p>
                    )}
                    <p>
                      <span className="text-muted-foreground">Motivo: </span>
                      {detailDispute.resolution.reason}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Resolvido por: </span>
                      {detailDispute.resolution.resolvedBy} em{' '}
                      {formatDateTime(detailDispute.resolution.resolvedAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

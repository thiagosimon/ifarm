'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Search,
  Eye,
  ShieldCheck,
  ShieldX,
  Ban,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
  fetchRetailers,
  approveRetailerKyc,
  rejectRetailerKyc,
  suspendRetailer,
  reactivateRetailer,
  getKycDocumentUrl,
} from '@/lib/api';
import toast from 'react-hot-toast';

interface Retailer {
  id: string;
  businessName: string;
  tradeName: string;
  email: string;
  businessRegistrationId: string;
  phone: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  kycStatus: 'NOT_STARTED' | 'DOCUMENTS_SUBMITTED' | 'APPROVED' | 'REJECTED';
  region: string;
  createdAt: string;
  kycDocuments?: { key: string; type: string; uploadedAt: string }[];
}

const kycStatusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'secondary' | 'info' }> = {
  NOT_STARTED: { label: 'Nao Iniciado', variant: 'secondary' },
  DOCUMENTS_SUBMITTED: { label: 'Docs Enviados', variant: 'warning' },
  APPROVED: { label: 'Aprovado', variant: 'success' },
  REJECTED: { label: 'Rejeitado', variant: 'error' },
};

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'secondary' }> = {
  ACTIVE: { label: 'Ativo', variant: 'success' },
  SUSPENDED: { label: 'Suspenso', variant: 'error' },
  PENDING: { label: 'Pendente', variant: 'warning' },
};

const mockRetailers: Retailer[] = [
  {
    id: '1',
    businessName: 'Supermercado Alvorada LTDA',
    tradeName: 'Supermercado Alvorada',
    email: 'compras@alvorada.com.br',
    businessRegistrationId: '23.456.789/0001-01',
    phone: '(11) 3333-0001',
    status: 'ACTIVE',
    kycStatus: 'APPROVED',
    region: 'SP',
    createdAt: '2025-01-10T09:00:00Z',
    kycDocuments: [
      { key: 'cnpj-card', type: 'CNPJ', uploadedAt: '2025-01-11T10:00:00Z' },
      { key: 'contract-social', type: 'Contrato Social', uploadedAt: '2025-01-11T10:05:00Z' },
    ],
  },
  {
    id: '2',
    businessName: 'Hortifruti Fresco SA',
    tradeName: 'Hortifruti Fresco',
    email: 'contato@hortifrutifresco.com',
    businessRegistrationId: '34.567.890/0001-12',
    phone: '(21) 4444-0002',
    status: 'ACTIVE',
    kycStatus: 'DOCUMENTS_SUBMITTED',
    region: 'RJ',
    createdAt: '2025-02-05T11:00:00Z',
    kycDocuments: [
      { key: 'cnpj-card', type: 'CNPJ', uploadedAt: '2025-02-06T09:00:00Z' },
    ],
  },
  {
    id: '3',
    businessName: 'Restaurante Sabores do Campo LTDA',
    tradeName: 'Sabores do Campo',
    email: 'chef@saboresdocampo.com',
    businessRegistrationId: '45.678.901/0001-23',
    phone: '(31) 5555-0003',
    status: 'SUSPENDED',
    kycStatus: 'REJECTED',
    region: 'MG',
    createdAt: '2025-02-28T15:00:00Z',
  },
  {
    id: '4',
    businessName: 'Distribuidora Terra Boa ME',
    tradeName: 'Terra Boa Distribuidora',
    email: 'vendas@terraboa.com',
    businessRegistrationId: '56.789.012/0001-34',
    phone: '(41) 6666-0004',
    status: 'PENDING',
    kycStatus: 'NOT_STARTED',
    region: 'PR',
    createdAt: '2025-03-12T13:00:00Z',
  },
  {
    id: '5',
    businessName: 'Mercado Natural Organicos LTDA',
    tradeName: 'Mercado Natural',
    email: 'adm@mercadonatural.com',
    businessRegistrationId: '67.890.123/0001-45',
    phone: '(51) 7777-0005',
    status: 'ACTIVE',
    kycStatus: 'APPROVED',
    region: 'RS',
    createdAt: '2025-01-20T10:00:00Z',
  },
];

export default function RetailersPage() {
  const [retailers, setRetailers] = React.useState<Retailer[]>(mockRetailers);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [kycFilter, setKycFilter] = React.useState<string>('all');
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const [selectedRetailer, setSelectedRetailer] = React.useState<Retailer | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const [kycAction, setKycAction] = React.useState<'approve' | 'reject' | null>(null);
  const [kycRetailer, setKycRetailer] = React.useState<Retailer | null>(null);
  const [kycReason, setKycReason] = React.useState('');

  const [suspendModalOpen, setSuspendModalOpen] = React.useState(false);
  const [suspendTarget, setSuspendTarget] = React.useState<Retailer | null>(null);
  const [suspendReason, setSuspendReason] = React.useState('');

  const loadRetailers = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRetailers({
        page,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        kycStatus: kycFilter !== 'all' ? kycFilter : undefined,
        search: search || undefined,
      });
      if (data?.items) setRetailers(data.items);
    } catch {
      // Use mock data on error
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, kycFilter, search]);

  React.useEffect(() => {
    loadRetailers();
  }, [loadRetailers]);

  const filtered = retailers.filter((r) => {
    const matchSearch =
      !search ||
      r.tradeName.toLowerCase().includes(search.toLowerCase()) ||
      r.businessName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.businessRegistrationId.includes(search);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchKyc = kycFilter === 'all' || r.kycStatus === kycFilter;
    return matchSearch && matchStatus && matchKyc;
  });

  const handleKycAction = async () => {
    if (!kycRetailer) return;
    try {
      if (kycAction === 'approve') {
        await approveRetailerKyc(kycRetailer.id);
        toast.success(`KYC de ${kycRetailer.tradeName} aprovado com sucesso`);
      } else {
        await rejectRetailerKyc(kycRetailer.id, kycReason);
        toast.success(`KYC de ${kycRetailer.tradeName} rejeitado`);
      }
    } catch {
      toast.error('Erro ao processar acao de KYC');
    } finally {
      setKycAction(null);
      setKycRetailer(null);
      setKycReason('');
      loadRetailers();
    }
  };

  const handleSuspend = async () => {
    if (!suspendTarget) return;
    try {
      await suspendRetailer(suspendTarget.id, suspendReason);
      toast.success(`Conta de ${suspendTarget.tradeName} suspensa`);
    } catch {
      toast.error('Erro ao suspender conta');
    } finally {
      setSuspendModalOpen(false);
      setSuspendTarget(null);
      setSuspendReason('');
      loadRetailers();
    }
  };

  const handleReactivate = async (retailer: Retailer) => {
    try {
      await reactivateRetailer(retailer.id);
      toast.success(`Conta de ${retailer.tradeName} reativada`);
      loadRetailers();
    } catch {
      toast.error('Erro ao reativar conta');
    }
  };

  const handleViewDocument = async (userId: string, documentKey: string) => {
    try {
      const data = await getKycDocumentUrl(userId, documentKey);
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch {
      toast.error('Erro ao obter URL do documento');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Retailers</h1>
        <p className="text-muted-foreground">Gerenciar lojistas e estabelecimentos cadastrados</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome fantasia, razao social, email ou CNPJ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="ACTIVE">Ativo</SelectItem>
                <SelectItem value="SUSPENDED">Suspenso</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={kycFilter} onValueChange={setKycFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="KYC Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos KYC</SelectItem>
                <SelectItem value="NOT_STARTED">Nao Iniciado</SelectItem>
                <SelectItem value="DOCUMENTS_SUBMITTED">Docs Enviados</SelectItem>
                <SelectItem value="APPROVED">Aprovado</SelectItem>
                <SelectItem value="REJECTED">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome Fantasia</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Regiao</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    Nenhum retailer encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((retailer) => (
                  <TableRow key={retailer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{retailer.tradeName}</p>
                        <p className="text-xs text-muted-foreground">{retailer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{retailer.businessRegistrationId}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{retailer.region}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[retailer.status]?.variant || 'secondary'}>
                        {statusMap[retailer.status]?.label || retailer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={kycStatusMap[retailer.kycStatus]?.variant || 'secondary'}>
                        {kycStatusMap[retailer.kycStatus]?.label || retailer.kycStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(retailer.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setSelectedRetailer(retailer);
                            setDetailOpen(true);
                          }}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {retailer.kycStatus === 'DOCUMENTS_SUBMITTED' && (
                          <>
                            <Button
                              variant="ghost"
                              size="xs"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => {
                                setKycRetailer(retailer);
                                setKycAction('approve');
                              }}
                              title="Aprovar KYC"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setKycRetailer(retailer);
                                setKycAction('reject');
                              }}
                              title="Rejeitar KYC"
                            >
                              <ShieldX className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {retailer.status === 'ACTIVE' && (
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setSuspendTarget(retailer);
                              setSuspendModalOpen(true);
                            }}
                            title="Suspender conta"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                        {retailer.status === 'SUSPENDED' && (
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleReactivate(retailer)}
                            title="Reativar conta"
                          >
                            <RotateCw className="h-4 w-4" />
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
          Mostrando {filtered.length} de {retailers.length} retailers
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

      {/* Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Retailer</DialogTitle>
            <DialogDescription>Informacoes completas do estabelecimento</DialogDescription>
          </DialogHeader>
          {selectedRetailer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Nome Fantasia</p>
                  <p className="font-medium">{selectedRetailer.tradeName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Razao Social</p>
                  <p className="font-medium">{selectedRetailer.businessName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedRetailer.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CNPJ</p>
                  <p className="font-medium">{selectedRetailer.businessRegistrationId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="font-medium">{selectedRetailer.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Regiao</p>
                  <Badge variant="outline">{selectedRetailer.region}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={statusMap[selectedRetailer.status]?.variant}>
                    {statusMap[selectedRetailer.status]?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">KYC</p>
                  <Badge variant={kycStatusMap[selectedRetailer.kycStatus]?.variant}>
                    {kycStatusMap[selectedRetailer.kycStatus]?.label}
                  </Badge>
                </div>
              </div>

              {selectedRetailer.kycDocuments && selectedRetailer.kycDocuments.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium">Documentos KYC</p>
                  <div className="space-y-2">
                    {selectedRetailer.kycDocuments.map((doc) => (
                      <div key={doc.key} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.type}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(doc.uploadedAt)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleViewDocument(selectedRetailer.id, doc.key)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* KYC Action Modal */}
      <Dialog open={!!kycAction} onOpenChange={() => { setKycAction(null); setKycReason(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {kycAction === 'approve' ? 'Aprovar KYC' : 'Rejeitar KYC'}
            </DialogTitle>
            <DialogDescription>
              {kycAction === 'approve'
                ? `Confirmar aprovacao do KYC de ${kycRetailer?.tradeName}?`
                : `Informe o motivo da rejeicao do KYC de ${kycRetailer?.tradeName}.`}
            </DialogDescription>
          </DialogHeader>
          {kycAction === 'reject' && (
            <Textarea
              placeholder="Motivo da rejeicao..."
              value={kycReason}
              onChange={(e) => setKycReason(e.target.value)}
              rows={3}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setKycAction(null); setKycReason(''); }}>
              Cancelar
            </Button>
            <Button
              variant={kycAction === 'approve' ? 'default' : 'destructive'}
              onClick={handleKycAction}
              disabled={kycAction === 'reject' && !kycReason.trim()}
            >
              {kycAction === 'approve' ? 'Aprovar' : 'Rejeitar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Modal */}
      <Dialog open={suspendModalOpen} onOpenChange={setSuspendModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspender Conta</DialogTitle>
            <DialogDescription>
              Informe o motivo para suspender a conta de {suspendTarget?.tradeName}.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Motivo da suspensao..."
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleSuspend}
              disabled={!suspendReason.trim()}
            >
              Suspender
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  fetchFarmers,
  approveFarmerKyc,
  rejectFarmerKyc,
  suspendFarmer,
  reactivateFarmer,
  getKycDocumentUrl,
} from '@/lib/api';
import toast from 'react-hot-toast';

interface Farmer {
  id: string;
  name: string;
  email: string;
  federalTaxId: string;
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

const mockFarmers: Farmer[] = [
  {
    id: '1',
    name: 'Fazenda Bela Vista',
    email: 'contato@belavista.agro',
    federalTaxId: '12.345.678/0001-90',
    phone: '(11) 99999-0001',
    status: 'ACTIVE',
    kycStatus: 'APPROVED',
    region: 'SP',
    createdAt: '2025-01-15T10:00:00Z',
    kycDocuments: [
      { key: 'cnpj-card', type: 'CNPJ', uploadedAt: '2025-01-16T10:00:00Z' },
      { key: 'property-deed', type: 'Escritura', uploadedAt: '2025-01-16T10:05:00Z' },
    ],
  },
  {
    id: '2',
    name: 'Sitio Boa Esperanca',
    email: 'sitio@boaesperanca.com',
    federalTaxId: '98.765.432/0001-10',
    phone: '(19) 98888-0002',
    status: 'ACTIVE',
    kycStatus: 'DOCUMENTS_SUBMITTED',
    region: 'MG',
    createdAt: '2025-02-20T14:30:00Z',
    kycDocuments: [
      { key: 'cnpj-card', type: 'CNPJ', uploadedAt: '2025-02-21T09:00:00Z' },
    ],
  },
  {
    id: '3',
    name: 'Fazenda Girassol',
    email: 'admin@girassol.agro',
    federalTaxId: '11.222.333/0001-44',
    phone: '(31) 97777-0003',
    status: 'SUSPENDED',
    kycStatus: 'REJECTED',
    region: 'GO',
    createdAt: '2025-03-01T08:00:00Z',
  },
  {
    id: '4',
    name: 'Agro Nordeste LTDA',
    email: 'financeiro@agronordeste.com',
    federalTaxId: '44.555.666/0001-77',
    phone: '(85) 96666-0004',
    status: 'PENDING',
    kycStatus: 'NOT_STARTED',
    region: 'CE',
    createdAt: '2025-03-10T16:00:00Z',
  },
  {
    id: '5',
    name: 'Rancho Verde Organicos',
    email: 'contato@ranchoverde.bio',
    federalTaxId: '55.666.777/0001-88',
    phone: '(21) 95555-0005',
    status: 'ACTIVE',
    kycStatus: 'APPROVED',
    region: 'RJ',
    createdAt: '2025-01-05T12:00:00Z',
  },
];

export default function FarmersPage() {
  const [farmers, setFarmers] = React.useState<Farmer[]>(mockFarmers);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [kycFilter, setKycFilter] = React.useState<string>('all');
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  // Detail modal
  const [selectedFarmer, setSelectedFarmer] = React.useState<Farmer | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  // KYC action modal
  const [kycAction, setKycAction] = React.useState<'approve' | 'reject' | null>(null);
  const [kycFarmer, setKycFarmer] = React.useState<Farmer | null>(null);
  const [kycReason, setKycReason] = React.useState('');

  // Suspend modal
  const [suspendModalOpen, setSuspendModalOpen] = React.useState(false);
  const [suspendTarget, setSuspendTarget] = React.useState<Farmer | null>(null);
  const [suspendReason, setSuspendReason] = React.useState('');

  const loadFarmers = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFarmers({
        page,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        kycStatus: kycFilter !== 'all' ? kycFilter : undefined,
        search: search || undefined,
      });
      if (data?.items) setFarmers(data.items);
    } catch {
      // Use mock data on error
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, kycFilter, search]);

  React.useEffect(() => {
    loadFarmers();
  }, [loadFarmers]);

  const filtered = farmers.filter((f) => {
    const matchSearch =
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      f.federalTaxId.includes(search);
    const matchStatus = statusFilter === 'all' || f.status === statusFilter;
    const matchKyc = kycFilter === 'all' || f.kycStatus === kycFilter;
    return matchSearch && matchStatus && matchKyc;
  });

  const handleKycAction = async () => {
    if (!kycFarmer) return;
    try {
      if (kycAction === 'approve') {
        await approveFarmerKyc(kycFarmer.id);
        toast.success(`KYC de ${kycFarmer.name} aprovado com sucesso`);
      } else {
        await rejectFarmerKyc(kycFarmer.id, kycReason);
        toast.success(`KYC de ${kycFarmer.name} rejeitado`);
      }
    } catch {
      toast.error('Erro ao processar acao de KYC');
    } finally {
      setKycAction(null);
      setKycFarmer(null);
      setKycReason('');
      loadFarmers();
    }
  };

  const handleSuspend = async () => {
    if (!suspendTarget) return;
    try {
      await suspendFarmer(suspendTarget.id, suspendReason);
      toast.success(`Conta de ${suspendTarget.name} suspensa`);
    } catch {
      toast.error('Erro ao suspender conta');
    } finally {
      setSuspendModalOpen(false);
      setSuspendTarget(null);
      setSuspendReason('');
      loadFarmers();
    }
  };

  const handleReactivate = async (farmer: Farmer) => {
    try {
      await reactivateFarmer(farmer.id);
      toast.success(`Conta de ${farmer.name} reativada`);
      loadFarmers();
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
        <h1 className="text-3xl font-bold tracking-tight">Farmers</h1>
        <p className="text-muted-foreground">Gerenciar produtores rurais cadastrados na plataforma</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou CNPJ..."
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
                <TableHead>Nome</TableHead>
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
                    Nenhum farmer encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((farmer) => (
                  <TableRow key={farmer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{farmer.name}</p>
                        <p className="text-xs text-muted-foreground">{farmer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{farmer.federalTaxId}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{farmer.region}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[farmer.status]?.variant || 'secondary'}>
                        {statusMap[farmer.status]?.label || farmer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={kycStatusMap[farmer.kycStatus]?.variant || 'secondary'}>
                        {kycStatusMap[farmer.kycStatus]?.label || farmer.kycStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(farmer.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setSelectedFarmer(farmer);
                            setDetailOpen(true);
                          }}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {farmer.kycStatus === 'DOCUMENTS_SUBMITTED' && (
                          <>
                            <Button
                              variant="ghost"
                              size="xs"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => {
                                setKycFarmer(farmer);
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
                                setKycFarmer(farmer);
                                setKycAction('reject');
                              }}
                              title="Rejeitar KYC"
                            >
                              <ShieldX className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {farmer.status === 'ACTIVE' && (
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setSuspendTarget(farmer);
                              setSuspendModalOpen(true);
                            }}
                            title="Suspender conta"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                        {farmer.status === 'SUSPENDED' && (
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleReactivate(farmer)}
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
          Mostrando {filtered.length} de {farmers.length} farmers
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
            <DialogTitle>Detalhes do Farmer</DialogTitle>
            <DialogDescription>Informacoes completas do produtor</DialogDescription>
          </DialogHeader>
          {selectedFarmer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Nome</p>
                  <p className="font-medium">{selectedFarmer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedFarmer.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CNPJ</p>
                  <p className="font-medium">{selectedFarmer.federalTaxId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="font-medium">{selectedFarmer.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Regiao</p>
                  <Badge variant="outline">{selectedFarmer.region}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cadastro</p>
                  <p className="font-medium">{formatDate(selectedFarmer.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={statusMap[selectedFarmer.status]?.variant}>
                    {statusMap[selectedFarmer.status]?.label}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">KYC</p>
                  <Badge variant={kycStatusMap[selectedFarmer.kycStatus]?.variant}>
                    {kycStatusMap[selectedFarmer.kycStatus]?.label}
                  </Badge>
                </div>
              </div>

              {/* KYC Documents */}
              {selectedFarmer.kycDocuments && selectedFarmer.kycDocuments.length > 0 && (
                <div>
                  <p className="mb-2 text-sm font-medium">Documentos KYC</p>
                  <div className="space-y-2">
                    {selectedFarmer.kycDocuments.map((doc) => (
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
                          onClick={() => handleViewDocument(selectedFarmer.id, doc.key)}
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
                ? `Confirmar aprovacao do KYC de ${kycFarmer?.name}?`
                : `Informe o motivo da rejeicao do KYC de ${kycFarmer?.name}.`}
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
              Informe o motivo para suspender a conta de {suspendTarget?.name}.
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

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import {
  ShieldCheck,
  ShieldX,
  Clock,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import { fetchKycQueue, getKycDocumentUrl, approveFarmerKyc, rejectFarmerKyc } from '@/lib/api';
import toast from 'react-hot-toast';

interface KycQueueItem {
  id: string;
  userId: string;
  userName: string;
  userType: 'FARMER' | 'RETAILER';
  email: string;
  federalTaxId: string;
  submittedAt: string;
  waitingTime: string;
  documents: {
    key: string;
    type: string;
    fileName: string;
    mimeType: string;
    uploadedAt: string;
  }[];
}

const mockQueue: KycQueueItem[] = [
  {
    id: 'kyc-1',
    userId: 'user-101',
    userName: 'Sitio Boa Esperanca',
    userType: 'FARMER',
    email: 'sitio@boaesperanca.com',
    federalTaxId: '98.765.432/0001-10',
    submittedAt: '2025-03-10T09:30:00Z',
    waitingTime: '8 dias',
    documents: [
      { key: 'doc-1', type: 'CNPJ', fileName: 'cnpj_card.pdf', mimeType: 'application/pdf', uploadedAt: '2025-03-10T09:30:00Z' },
      { key: 'doc-2', type: 'Inscricao Estadual', fileName: 'ie_cert.pdf', mimeType: 'application/pdf', uploadedAt: '2025-03-10T09:32:00Z' },
      { key: 'doc-3', type: 'Documento Pessoal', fileName: 'rg_frente.jpg', mimeType: 'image/jpeg', uploadedAt: '2025-03-10T09:33:00Z' },
    ],
  },
  {
    id: 'kyc-2',
    userId: 'user-102',
    userName: 'Hortifruti Fresco',
    userType: 'RETAILER',
    email: 'contato@hortifrutifresco.com',
    federalTaxId: '34.567.890/0001-12',
    submittedAt: '2025-03-12T14:00:00Z',
    waitingTime: '6 dias',
    documents: [
      { key: 'doc-4', type: 'CNPJ', fileName: 'cnpj.pdf', mimeType: 'application/pdf', uploadedAt: '2025-03-12T14:00:00Z' },
      { key: 'doc-5', type: 'Contrato Social', fileName: 'contrato_social.pdf', mimeType: 'application/pdf', uploadedAt: '2025-03-12T14:02:00Z' },
    ],
  },
  {
    id: 'kyc-3',
    userId: 'user-103',
    userName: 'Fazenda Tres Irmaos',
    userType: 'FARMER',
    email: 'admin@tresirmaos.agro',
    federalTaxId: '77.888.999/0001-55',
    submittedAt: '2025-03-14T08:15:00Z',
    waitingTime: '4 dias',
    documents: [
      { key: 'doc-6', type: 'CNPJ', fileName: 'cnpj_card.jpg', mimeType: 'image/jpeg', uploadedAt: '2025-03-14T08:15:00Z' },
      { key: 'doc-7', type: 'CAR', fileName: 'car_certificado.pdf', mimeType: 'application/pdf', uploadedAt: '2025-03-14T08:17:00Z' },
    ],
  },
  {
    id: 'kyc-4',
    userId: 'user-104',
    userName: 'Mercado Municipal Central LTDA',
    userType: 'RETAILER',
    email: 'compras@mercadocentral.com',
    federalTaxId: '88.999.000/0001-66',
    submittedAt: '2025-03-16T11:45:00Z',
    waitingTime: '2 dias',
    documents: [
      { key: 'doc-8', type: 'CNPJ', fileName: 'cnpj.pdf', mimeType: 'application/pdf', uploadedAt: '2025-03-16T11:45:00Z' },
    ],
  },
  {
    id: 'kyc-5',
    userId: 'user-105',
    userName: 'Cooperativa Agropecuaria do Vale',
    userType: 'FARMER',
    email: 'secretaria@coopvale.coop',
    federalTaxId: '99.000.111/0001-77',
    submittedAt: '2025-03-17T16:20:00Z',
    waitingTime: '1 dia',
    documents: [
      { key: 'doc-9', type: 'CNPJ', fileName: 'cnpj_cooperativa.pdf', mimeType: 'application/pdf', uploadedAt: '2025-03-17T16:20:00Z' },
      { key: 'doc-10', type: 'Ata de Assembleia', fileName: 'ata_assembleia.pdf', mimeType: 'application/pdf', uploadedAt: '2025-03-17T16:22:00Z' },
      { key: 'doc-11', type: 'Documento Pessoal', fileName: 'identidade_presidente.jpg', mimeType: 'image/jpeg', uploadedAt: '2025-03-17T16:25:00Z' },
    ],
  },
];

export default function KycQueuePage() {
  const [queue, setQueue] = React.useState<KycQueueItem[]>(mockQueue);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  // Action modal
  const [actionType, setActionType] = React.useState<'approve' | 'reject' | null>(null);
  const [actionItem, setActionItem] = React.useState<KycQueueItem | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [actionLoading, setActionLoading] = React.useState(false);

  // Document viewer
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerItem, setViewerItem] = React.useState<KycQueueItem | null>(null);
  const [documentUrl, setDocumentUrl] = React.useState<string | null>(null);
  const [activeDocIndex, setActiveDocIndex] = React.useState(0);

  const loadQueue = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchKycQueue({ page, limit: 20 });
      if (data?.items) setQueue(data.items);
    } catch {
      // Use mock data on error
    } finally {
      setLoading(false);
    }
  }, [page]);

  React.useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const handleAction = async () => {
    if (!actionItem) return;
    setActionLoading(true);
    try {
      if (actionType === 'approve') {
        await approveFarmerKyc(actionItem.userId);
        toast.success(`KYC de ${actionItem.userName} aprovado com sucesso`);
      } else {
        await rejectFarmerKyc(actionItem.userId, rejectionReason);
        toast.success(`KYC de ${actionItem.userName} rejeitado`);
      }
      // Remove from queue locally
      setQueue((prev) => prev.filter((item) => item.id !== actionItem.id));
    } catch {
      toast.error('Erro ao processar acao de KYC');
    } finally {
      setActionLoading(false);
      setActionType(null);
      setActionItem(null);
      setRejectionReason('');
    }
  };

  const openDocumentViewer = async (item: KycQueueItem, docIndex: number = 0) => {
    setViewerItem(item);
    setActiveDocIndex(docIndex);
    setViewerOpen(true);

    try {
      const data = await getKycDocumentUrl(item.userId, item.documents[docIndex].key);
      if (data?.url) {
        setDocumentUrl(data.url);
      }
    } catch {
      // Use a placeholder URL for demo
      setDocumentUrl(null);
    }
  };

  const switchDocument = async (index: number) => {
    if (!viewerItem) return;
    setActiveDocIndex(index);
    setDocumentUrl(null);

    try {
      const data = await getKycDocumentUrl(viewerItem.userId, viewerItem.documents[index].key);
      if (data?.url) {
        setDocumentUrl(data.url);
      }
    } catch {
      setDocumentUrl(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fila KYC</h1>
          <p className="text-muted-foreground">
            Documentos aguardando revisao (FIFO - primeiro a enviar, primeiro a ser analisado)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="warning" className="text-sm">
            {queue.length} pendentes
          </Badge>
          <Button variant="outline" size="icon" onClick={loadQueue} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Na Fila</p>
              <p className="text-2xl font-bold">{queue.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Documentos Totais</p>
              <p className="text-2xl font-bold">
                {queue.reduce((acc, item) => acc + item.documents.length, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <Clock className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mais Antigo</p>
              <p className="text-2xl font-bold">{queue[0]?.waitingTime || '-'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead>Tempo de Espera</TableHead>
                <TableHead>Docs</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <ShieldCheck className="mx-auto mb-3 h-12 w-12 text-green-500" />
                    <p className="text-lg font-medium">Fila vazia</p>
                    <p className="text-sm text-muted-foreground">
                      Todos os KYCs foram processados
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                queue.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.userName}</p>
                        <p className="text-xs text-muted-foreground">{item.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.userType === 'FARMER' ? 'success' : 'info'}>
                        {item.userType === 'FARMER' ? 'Farmer' : 'Retailer'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{item.federalTaxId}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(item.submittedAt)}</TableCell>
                    <TableCell>
                      <Badge variant={parseInt(item.waitingTime) > 5 ? 'error' : 'warning'}>
                        {item.waitingTime}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {item.documents.map((doc, docIdx) => (
                          <button
                            key={doc.key}
                            onClick={() => openDocumentViewer(item, docIdx)}
                            className="flex h-8 w-8 items-center justify-center rounded border bg-muted/50 transition-colors hover:bg-muted"
                            title={doc.type}
                          >
                            {doc.mimeType.startsWith('image/') ? (
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => openDocumentViewer(item)}
                          title="Ver documentos"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="xs"
                          className="bg-green-600 text-white hover:bg-green-700"
                          onClick={() => {
                            setActionItem(item);
                            setActionType('approve');
                          }}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="destructive"
                          size="xs"
                          onClick={() => {
                            setActionItem(item);
                            setActionType('reject');
                          }}
                        >
                          Rejeitar
                        </Button>
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
      {queue.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {queue.length} itens na fila
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
      )}

      {/* Action Modal (Approve/Reject) */}
      <Dialog
        open={!!actionType}
        onOpenChange={() => {
          setActionType(null);
          setActionItem(null);
          setRejectionReason('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Aprovar KYC' : 'Rejeitar KYC'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? `Confirmar aprovacao do KYC de "${actionItem?.userName}"? O usuario sera notificado e podera operar na plataforma.`
                : `Informe o motivo da rejeicao do KYC de "${actionItem?.userName}". O usuario sera notificado e podera reenviar os documentos.`}
            </DialogDescription>
          </DialogHeader>

          {actionItem && (
            <div className="rounded-lg border bg-muted/50 p-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Usuario: </span>
                  <span className="font-medium">{actionItem.userName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo: </span>
                  <Badge variant={actionItem.userType === 'FARMER' ? 'success' : 'info'} className="ml-1">
                    {actionItem.userType}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">CNPJ: </span>
                  <span className="font-medium">{actionItem.federalTaxId}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Docs: </span>
                  <span className="font-medium">{actionItem.documents.length}</span>
                </div>
              </div>
            </div>
          )}

          {actionType === 'reject' && (
            <Textarea
              placeholder="Motivo da rejeicao (obrigatorio)... Ex: Documento ilegivel, CNPJ divergente, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionType(null);
                setActionItem(null);
                setRejectionReason('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant={actionType === 'approve' ? 'default' : 'destructive'}
              onClick={handleAction}
              disabled={actionLoading || (actionType === 'reject' && !rejectionReason.trim())}
              loading={actionLoading}
            >
              {actionType === 'approve' ? 'Confirmar Aprovacao' : 'Confirmar Rejeicao'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Documentos KYC - {viewerItem?.userName}</DialogTitle>
            <DialogDescription>
              Visualize os documentos enviados pelo usuario
            </DialogDescription>
          </DialogHeader>

          {viewerItem && (
            <div className="space-y-4">
              {/* Document tabs */}
              <div className="flex gap-2 overflow-x-auto">
                {viewerItem.documents.map((doc, idx) => (
                  <button
                    key={doc.key}
                    onClick={() => switchDocument(idx)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      activeDocIndex === idx
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {doc.mimeType.startsWith('image/') ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    {doc.type}
                  </button>
                ))}
              </div>

              {/* Document preview area */}
              <div className="flex min-h-[400px] items-center justify-center rounded-lg border bg-muted/30">
                {documentUrl ? (
                  viewerItem.documents[activeDocIndex]?.mimeType.startsWith('image/') ? (
                    <img
                      src={documentUrl}
                      alt={viewerItem.documents[activeDocIndex]?.type}
                      className="max-h-[500px] max-w-full rounded object-contain"
                    />
                  ) : (
                    <iframe
                      src={documentUrl}
                      className="h-[500px] w-full rounded"
                      title={viewerItem.documents[activeDocIndex]?.type}
                    />
                  )
                ) : (
                  <div className="text-center">
                    <FileText className="mx-auto mb-3 h-16 w-16 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Carregando documento...
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {viewerItem.documents[activeDocIndex]?.fileName}
                    </p>
                  </div>
                )}
              </div>

              {/* Document info */}
              <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3 text-sm">
                <div className="flex items-center gap-4">
                  <span>
                    <span className="text-muted-foreground">Arquivo: </span>
                    {viewerItem.documents[activeDocIndex]?.fileName}
                  </span>
                  <span>
                    <span className="text-muted-foreground">Enviado: </span>
                    {formatDateTime(viewerItem.documents[activeDocIndex]?.uploadedAt)}
                  </span>
                </div>
                {documentUrl && (
                  <Button variant="ghost" size="xs" onClick={() => window.open(documentUrl, '_blank')}>
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Abrir original
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

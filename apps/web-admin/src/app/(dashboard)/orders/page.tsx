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
  XCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { fetchOrders, cancelOrder, fetchOrderTimeline } from '@/lib/api';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  farmerName: string;
  retailerName: string;
  status: string;
  totalAmount: number;
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TimelineEvent {
  id: string;
  action: string;
  description: string;
  actor: string;
  timestamp: string;
}

const orderStatusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'secondary' | 'info' | 'pending' }> = {
  PENDING_PAYMENT: { label: 'Pagamento Pendente', variant: 'pending' },
  PAYMENT_CONFIRMED: { label: 'Pago', variant: 'info' },
  PROCESSING: { label: 'Em Preparo', variant: 'warning' },
  SHIPPED: { label: 'Enviado', variant: 'info' },
  DELIVERED: { label: 'Entregue', variant: 'success' },
  COMPLETED: { label: 'Concluido', variant: 'success' },
  CANCELLED: { label: 'Cancelado', variant: 'error' },
  DISPUTED: { label: 'Disputado', variant: 'error' },
  REFUNDED: { label: 'Reembolsado', variant: 'secondary' },
};

const mockOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: '#2847',
    farmerName: 'Fazenda Bela Vista',
    retailerName: 'Supermercado Alvorada',
    status: 'DELIVERED',
    totalAmount: 12500.0,
    itemsCount: 8,
    createdAt: '2025-03-15T10:30:00Z',
    updatedAt: '2025-03-17T14:00:00Z',
  },
  {
    id: 'ord-2',
    orderNumber: '#2846',
    farmerName: 'Sitio Boa Esperanca',
    retailerName: 'Hortifruti Fresco',
    status: 'SHIPPED',
    totalAmount: 8750.5,
    itemsCount: 5,
    createdAt: '2025-03-14T08:00:00Z',
    updatedAt: '2025-03-16T09:30:00Z',
  },
  {
    id: 'ord-3',
    orderNumber: '#2845',
    farmerName: 'Rancho Verde Organicos',
    retailerName: 'Mercado Natural',
    status: 'PROCESSING',
    totalAmount: 15200.0,
    itemsCount: 12,
    createdAt: '2025-03-13T16:45:00Z',
    updatedAt: '2025-03-14T10:00:00Z',
  },
  {
    id: 'ord-4',
    orderNumber: '#2844',
    farmerName: 'Fazenda Girassol',
    retailerName: 'Sabores do Campo',
    status: 'DISPUTED',
    totalAmount: 6300.0,
    itemsCount: 4,
    createdAt: '2025-03-10T11:00:00Z',
    updatedAt: '2025-03-16T08:00:00Z',
  },
  {
    id: 'ord-5',
    orderNumber: '#2843',
    farmerName: 'Cooperativa Agropecuaria do Vale',
    retailerName: 'Terra Boa Distribuidora',
    status: 'PENDING_PAYMENT',
    totalAmount: 22100.0,
    itemsCount: 15,
    createdAt: '2025-03-17T09:00:00Z',
    updatedAt: '2025-03-17T09:00:00Z',
  },
  {
    id: 'ord-6',
    orderNumber: '#2842',
    farmerName: 'Fazenda Bela Vista',
    retailerName: 'Restaurante Sabores do Campo',
    status: 'COMPLETED',
    totalAmount: 9800.0,
    itemsCount: 6,
    createdAt: '2025-03-05T14:00:00Z',
    updatedAt: '2025-03-12T16:00:00Z',
  },
  {
    id: 'ord-7',
    orderNumber: '#2841',
    farmerName: 'Sitio Boa Esperanca',
    retailerName: 'Supermercado Alvorada',
    status: 'CANCELLED',
    totalAmount: 3400.0,
    itemsCount: 3,
    createdAt: '2025-03-04T10:00:00Z',
    updatedAt: '2025-03-05T08:00:00Z',
  },
  {
    id: 'ord-8',
    orderNumber: '#2840',
    farmerName: 'Rancho Verde Organicos',
    retailerName: 'Hortifruti Fresco',
    status: 'PAYMENT_CONFIRMED',
    totalAmount: 18500.0,
    itemsCount: 10,
    createdAt: '2025-03-17T15:00:00Z',
    updatedAt: '2025-03-17T15:30:00Z',
  },
];

const mockTimeline: TimelineEvent[] = [
  { id: 't1', action: 'ORDER_CREATED', description: 'Pedido criado', actor: 'Sistema', timestamp: '2025-03-15T10:30:00Z' },
  { id: 't2', action: 'PAYMENT_RECEIVED', description: 'Pagamento confirmado via Pagar.me', actor: 'Sistema', timestamp: '2025-03-15T10:32:00Z' },
  { id: 't3', action: 'ORDER_ACCEPTED', description: 'Pedido aceito pelo farmer', actor: 'Fazenda Bela Vista', timestamp: '2025-03-15T11:00:00Z' },
  { id: 't4', action: 'SHIPMENT_CREATED', description: 'Remessa criada - NF emitida', actor: 'Fazenda Bela Vista', timestamp: '2025-03-16T08:00:00Z' },
  { id: 't5', action: 'DELIVERED', description: 'Entrega confirmada', actor: 'Supermercado Alvorada', timestamp: '2025-03-17T14:00:00Z' },
];

export default function OrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>(mockOrders);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  // Cancel modal
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [cancelTarget, setCancelTarget] = React.useState<Order | null>(null);
  const [cancelReason, setCancelReason] = React.useState('');
  const [cancelLoading, setCancelLoading] = React.useState(false);

  // Timeline modal
  const [timelineOpen, setTimelineOpen] = React.useState(false);
  const [timelineOrder, setTimelineOrder] = React.useState<Order | null>(null);
  const [timeline, setTimeline] = React.useState<TimelineEvent[]>([]);

  const loadOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchOrders({
        page,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        search: search || undefined,
      });
      if (data?.items) setOrders(data.items);
    } catch {
      // Use mock data on error
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, dateFrom, dateTo, search]);

  React.useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      o.retailerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelLoading(true);
    try {
      await cancelOrder(cancelTarget.id, cancelReason);
      toast.success(`Pedido ${cancelTarget.orderNumber} cancelado. Reembolso sera processado.`);
      loadOrders();
    } catch {
      toast.error('Erro ao cancelar pedido');
    } finally {
      setCancelLoading(false);
      setCancelModalOpen(false);
      setCancelTarget(null);
      setCancelReason('');
    }
  };

  const openTimeline = async (order: Order) => {
    setTimelineOrder(order);
    setTimelineOpen(true);
    try {
      const data = await fetchOrderTimeline(order.id);
      if (data?.events) setTimeline(data.events);
      else setTimeline(mockTimeline);
    } catch {
      setTimeline(mockTimeline);
    }
  };

  const getStatusIcon = (action: string) => {
    switch (action) {
      case 'ORDER_CREATED':
        return <Package className="h-4 w-4" />;
      case 'PAYMENT_RECEIVED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ORDER_ACCEPTED':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'SHIPMENT_CREATED':
        return <Truck className="h-4 w-4 text-purple-600" />;
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const canCancel = (status: string) =>
    ['PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'PROCESSING'].includes(status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-muted-foreground">Visualizar e gerenciar todos os pedidos da plataforma</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por numero, farmer ou retailer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Pagamento Pendente</SelectItem>
                <SelectItem value="PAYMENT_CONFIRMED">Pago</SelectItem>
                <SelectItem value="PROCESSING">Em Preparo</SelectItem>
                <SelectItem value="SHIPPED">Enviado</SelectItem>
                <SelectItem value="DELIVERED">Entregue</SelectItem>
                <SelectItem value="COMPLETED">Concluido</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
                <SelectItem value="DISPUTED">Disputado</SelectItem>
                <SelectItem value="REFUNDED">Reembolsado</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                placeholder="De"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-[150px]"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="date"
                placeholder="Ate"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-[150px]"
              />
            </div>
            <Button variant="outline" size="icon" onClick={loadOrders} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Retailer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    Nenhum pedido encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">{order.orderNumber}</TableCell>
                    <TableCell className="text-sm">{order.farmerName}</TableCell>
                    <TableCell className="text-sm">{order.retailerName}</TableCell>
                    <TableCell>
                      <Badge variant={orderStatusMap[order.status]?.variant || 'secondary'}>
                        {orderStatusMap[order.status]?.label || order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell>{order.itemsCount}</TableCell>
                    <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => openTimeline(order)}
                          title="Ver timeline"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {canCancel(order.status) && (
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setCancelTarget(order);
                              setCancelModalOpen(true);
                            }}
                            title="Cancelar pedido"
                          >
                            <XCircle className="h-4 w-4" />
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
          Mostrando {filtered.length} de {orders.length} pedidos
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

      {/* Cancel Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Pedido</DialogTitle>
            <DialogDescription>
              Esta acao ira cancelar o pedido {cancelTarget?.orderNumber} e disparar o reembolso automatico ao retailer.
            </DialogDescription>
          </DialogHeader>
          {cancelTarget && (
            <div className="rounded-lg border bg-muted/50 p-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Pedido: </span>
                  <span className="font-medium">{cancelTarget.orderNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor: </span>
                  <span className="font-medium">{formatCurrency(cancelTarget.totalAmount)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Farmer: </span>
                  <span className="font-medium">{cancelTarget.farmerName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Retailer: </span>
                  <span className="font-medium">{cancelTarget.retailerName}</span>
                </div>
              </div>
            </div>
          )}
          <Textarea
            placeholder="Motivo do cancelamento (obrigatorio)..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={!cancelReason.trim() || cancelLoading}
              loading={cancelLoading}
            >
              Confirmar Cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Timeline Modal */}
      <Dialog open={timelineOpen} onOpenChange={setTimelineOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Timeline - Pedido {timelineOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Historico completo de eventos do pedido
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-0">
            {timeline.map((event, index) => (
              <div key={event.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                    {getStatusIcon(event.action)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="my-1 h-8 w-px bg-border" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.actor} - {formatDateTime(event.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

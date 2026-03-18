'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Hash,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { formatCurrency } from '@/lib/utils';

// -- Tracking schema --

const trackingSchema = z.object({
  trackingCode: z
    .string({ required_error: 'Codigo de rastreio obrigatorio' })
    .min(5, 'Codigo de rastreio deve ter pelo menos 5 caracteres')
    .max(50, 'Codigo de rastreio muito longo'),
});

type TrackingFormData = z.infer<typeof trackingSchema>;

// -- Types --

type OrderStatus = 'preparing' | 'shipped' | 'delivered' | 'disputed';

interface OrderItem {
  name: string;
  quantity: number;
  unit: string;
}

interface Order {
  id: string;
  orderNumber: string;
  farmer: string;
  city: string;
  state: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

// -- Mock data --

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'PED-2026-000891',
    farmer: 'Fazenda Boa Vista',
    city: 'Uberlandia',
    state: 'MG',
    items: [
      { name: 'Fertilizante NPK 20-05-20', quantity: 50, unit: 'ton' },
      { name: 'Ureia Granulada', quantity: 30, unit: 'ton' },
    ],
    total: 142500,
    status: 'preparing',
    createdAt: '2026-03-16T10:00:00Z',
    updatedAt: '2026-03-16T10:00:00Z',
  },
  {
    id: '2',
    orderNumber: 'PED-2026-000890',
    farmer: 'Sitio Sao Jose',
    city: 'Ribeirao Preto',
    state: 'SP',
    items: [
      { name: 'Semente Soja TMG 2381', quantity: 200, unit: 'sc' },
    ],
    total: 98000,
    status: 'preparing',
    createdAt: '2026-03-15T14:30:00Z',
    updatedAt: '2026-03-15T14:30:00Z',
  },
  {
    id: '3',
    orderNumber: 'PED-2026-000889',
    farmer: 'Fazenda Esperanca',
    city: 'Rondonopolis',
    state: 'MT',
    items: [
      { name: 'Herbicida Glifosato 480g/L', quantity: 500, unit: 'L' },
      { name: 'Inseticida Imidacloprid', quantity: 200, unit: 'L' },
    ],
    total: 356000,
    status: 'shipped',
    trackingCode: 'BR1234567890',
    createdAt: '2026-03-14T09:00:00Z',
    updatedAt: '2026-03-16T11:00:00Z',
  },
  {
    id: '4',
    orderNumber: 'PED-2026-000888',
    farmer: 'Agropecuaria Sol Nascente',
    city: 'Cascavel',
    state: 'PR',
    items: [
      { name: 'Calcario Dolomitico PRNT 85%', quantity: 100, unit: 'ton' },
    ],
    total: 19200,
    status: 'shipped',
    trackingCode: 'BR9876543210',
    createdAt: '2026-03-13T16:00:00Z',
    updatedAt: '2026-03-15T08:00:00Z',
  },
  {
    id: '5',
    orderNumber: 'PED-2026-000887',
    farmer: 'Fazenda Tres Irmaos',
    city: 'Dourados',
    state: 'MS',
    items: [
      { name: 'Adubo Organico', quantity: 80, unit: 'ton' },
    ],
    total: 64000,
    status: 'delivered',
    trackingCode: 'BR5555666677',
    createdAt: '2026-03-10T10:00:00Z',
    updatedAt: '2026-03-14T15:00:00Z',
  },
  {
    id: '6',
    orderNumber: 'PED-2026-000886',
    farmer: 'Fazenda Santa Maria',
    city: 'Sorriso',
    state: 'MT',
    items: [
      { name: 'Semente Soja Intacta 2', quantity: 400, unit: 'sc' },
    ],
    total: 412000,
    status: 'delivered',
    trackingCode: 'BR1111222233',
    createdAt: '2026-03-08T09:00:00Z',
    updatedAt: '2026-03-13T10:00:00Z',
  },
  {
    id: '7',
    orderNumber: 'PED-2026-000885',
    farmer: 'Fazenda Progresso',
    city: 'Lucas do Rio Verde',
    state: 'MT',
    items: [
      { name: 'Fungicida Azoxistrobina', quantity: 300, unit: 'L' },
    ],
    total: 78000,
    status: 'disputed',
    trackingCode: 'BR4444555566',
    createdAt: '2026-03-05T11:00:00Z',
    updatedAt: '2026-03-12T16:00:00Z',
  },
];

const columns: { status: OrderStatus; label: string; icon: React.ElementType; color: string }[] = [
  { status: 'preparing', label: 'Em Preparo', icon: Package, color: 'text-amber-500' },
  { status: 'shipped', label: 'Enviado', icon: Truck, color: 'text-indigo-500' },
  { status: 'delivered', label: 'Entregue', icon: CheckCircle2, color: 'text-teal-500' },
  { status: 'disputed', label: 'Disputado', icon: AlertTriangle, color: 'text-red-500' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrackingFormData>({
    resolver: zodResolver(trackingSchema),
  });

  function openTrackingDialog(order: Order) {
    setSelectedOrder(order);
    reset({ trackingCode: '' });
    setTrackingDialogOpen(true);
  }

  async function onSubmitTracking(data: TrackingFormData) {
    if (!selectedOrder) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, status: 'shipped' as OrderStatus, trackingCode: data.trackingCode, updatedAt: new Date().toISOString() }
          : o
      )
    );
    setSubmitting(false);
    setTrackingDialogOpen(false);
    setSelectedOrder(null);
  }

  function getOrdersByStatus(status: OrderStatus) {
    return orders.filter((o) => o.status === status);
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs />
        <h1 className="mt-2 text-2xl font-bold text-foreground">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe e gerencie todos os seus pedidos em andamento
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map((col) => {
          const count = getOrdersByStatus(col.status).length;
          const total = getOrdersByStatus(col.status).reduce(
            (sum, o) => sum + o.total,
            0
          );
          return (
            <Card key={col.status}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted`}>
                  <col.icon className={`h-5 w-5 ${col.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {col.label}
                  </p>
                  <p className="text-lg font-bold">
                    {count} <span className="text-xs font-normal text-muted-foreground">({formatCurrency(total / 100)})</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map((col) => {
          const columnOrders = getOrdersByStatus(col.status);
          return (
            <div key={col.status} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <col.icon className={`h-4 w-4 ${col.color}`} />
                <span className="text-sm font-semibold">{col.label}</span>
                <Badge variant="outline" className="ml-auto">
                  {columnOrders.length}
                </Badge>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {columnOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="cursor-pointer transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs font-semibold text-primary-600">
                          <Hash className="h-3 w-3" />
                          {order.orderNumber}
                        </span>
                        <Badge
                          variant={
                            col.status === 'preparing'
                              ? 'preparing'
                              : col.status === 'shipped'
                              ? 'shipped'
                              : col.status === 'delivered'
                              ? 'delivered'
                              : 'disputed'
                          }
                        >
                          {col.label}
                        </Badge>
                      </div>

                      <p className="text-sm font-medium">{order.farmer}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {order.city}/{order.state}
                      </p>

                      <div className="mt-2 space-y-0.5">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">
                            {item.quantity} {item.unit} - {item.name}
                          </p>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                        <span className="text-sm font-bold text-foreground">
                          {formatCurrency(order.total / 100)}
                        </span>

                        {order.status === 'preparing' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => openTrackingDialog(order)}
                          >
                            Marcar Enviado
                          </Button>
                        )}

                        {order.trackingCode && (
                          <span className="text-xs text-muted-foreground">
                            {order.trackingCode}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnOrders.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                    <p className="text-xs text-muted-foreground">
                      Nenhum pedido
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tracking Code Dialog */}
      <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
        <DialogContent onClose={() => setTrackingDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>Marcar como Enviado</DialogTitle>
            <DialogDescription>
              Pedido {selectedOrder?.orderNumber} - {selectedOrder?.farmer}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitTracking)}>
            <div className="my-4">
              <Input
                label="Codigo de Rastreio"
                placeholder="Ex: BR1234567890"
                {...register('trackingCode')}
                error={errors.trackingCode?.message}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Informe o codigo de rastreio da transportadora para que o
                produtor possa acompanhar a entrega.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setTrackingDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={submitting}>
                Confirmar Envio
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

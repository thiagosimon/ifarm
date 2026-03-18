'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
} from '@/components/ui/sheet';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { formatCurrency, formatDate } from '@/lib/utils';

// -- Zod validation schema for proposal --

const proposalItemSchema = z.object({
  productName: z.string(),
  quantity: z.number(),
  unit: z.string(),
  unitPrice: z
    .number({ required_error: 'Preco unitario obrigatorio' })
    .min(0.01, 'Preco deve ser maior que zero'),
});

const proposalSchema = z.object({
  items: z
    .array(proposalItemSchema)
    .min(1, 'Pelo menos um item deve ter preco'),
  deliveryDays: z
    .number({ required_error: 'Prazo de entrega obrigatorio' })
    .int('Prazo deve ser um numero inteiro')
    .min(1, 'Prazo minimo de 1 dia')
    .max(90, 'Prazo maximo de 90 dias'),
  freightCost: z
    .number({ required_error: 'Valor do frete obrigatorio' })
    .min(0, 'Frete nao pode ser negativo'),
  paymentMethods: z
    .array(z.string())
    .min(1, 'Selecione ao menos uma forma de pagamento'),
  notes: z.string().max(500, 'Observacoes devem ter no maximo 500 caracteres').optional(),
});

type ProposalFormData = z.infer<typeof proposalSchema>;

// -- Types --

interface QuotationItem {
  productName: string;
  quantity: number;
  unit: string;
}

interface Quotation {
  id: string;
  number: string;
  farmer: string;
  city: string;
  state: string;
  category: string;
  items: QuotationItem[];
  estimatedTotal: number;
  status: 'pending' | 'responded' | 'expired' | 'accepted' | 'rejected';
  createdAt: string;
  expiresAt: string;
}

// -- Mock data --

const mockQuotations: Quotation[] = [
  {
    id: '1',
    number: 'COT-2026-001234',
    farmer: 'Fazenda Boa Vista',
    city: 'Uberlandia',
    state: 'MG',
    category: 'Fertilizantes',
    items: [
      { productName: 'Fertilizante NPK 20-05-20', quantity: 50, unit: 'ton' },
      { productName: 'Ureia Granulada', quantity: 30, unit: 'ton' },
      { productName: 'MAP Granulado', quantity: 20, unit: 'ton' },
    ],
    estimatedTotal: 158000,
    status: 'pending',
    createdAt: '2026-03-18T10:30:00Z',
    expiresAt: '2026-03-20T10:30:00Z',
  },
  {
    id: '2',
    number: 'COT-2026-001233',
    farmer: 'Sitio Sao Jose',
    city: 'Ribeirao Preto',
    state: 'SP',
    category: 'Sementes',
    items: [
      { productName: 'Semente Soja TMG 2381', quantity: 200, unit: 'sc' },
      { productName: 'Semente Milho AG 9025', quantity: 100, unit: 'sc' },
    ],
    estimatedTotal: 285000,
    status: 'pending',
    createdAt: '2026-03-18T09:45:00Z',
    expiresAt: '2026-03-20T09:45:00Z',
  },
  {
    id: '3',
    number: 'COT-2026-001232',
    farmer: 'Fazenda Esperanca',
    city: 'Rondonopolis',
    state: 'MT',
    category: 'Defensivos',
    items: [
      { productName: 'Herbicida Glifosato 480g/L', quantity: 500, unit: 'L' },
      { productName: 'Inseticida Imidacloprid', quantity: 200, unit: 'L' },
    ],
    estimatedTotal: 420000,
    status: 'responded',
    createdAt: '2026-03-18T08:15:00Z',
    expiresAt: '2026-03-20T08:15:00Z',
  },
  {
    id: '4',
    number: 'COT-2026-001231',
    farmer: 'Agropecuaria Sol Nascente',
    city: 'Cascavel',
    state: 'PR',
    category: 'Fertilizantes',
    items: [
      { productName: 'Calcario Dolomitico PRNT 85%', quantity: 100, unit: 'ton' },
    ],
    estimatedTotal: 19200,
    status: 'accepted',
    createdAt: '2026-03-17T16:30:00Z',
    expiresAt: '2026-03-19T16:30:00Z',
  },
  {
    id: '5',
    number: 'COT-2026-001230',
    farmer: 'Fazenda Santa Maria',
    city: 'Sorriso',
    state: 'MT',
    category: 'Sementes',
    items: [
      { productName: 'Semente Soja Intacta 2', quantity: 400, unit: 'sc' },
    ],
    estimatedTotal: 567000,
    status: 'expired',
    createdAt: '2026-03-17T14:00:00Z',
    expiresAt: '2026-03-18T14:00:00Z',
  },
  {
    id: '6',
    number: 'COT-2026-001229',
    farmer: 'Fazenda Tres Irmaos',
    city: 'Dourados',
    state: 'MS',
    category: 'Defensivos',
    items: [
      { productName: 'Fungicida Azoxistrobina', quantity: 300, unit: 'L' },
    ],
    estimatedTotal: 78000,
    status: 'rejected',
    createdAt: '2026-03-16T11:00:00Z',
    expiresAt: '2026-03-18T11:00:00Z',
  },
];

const statusOptions = [
  { value: '', label: 'Todos os Status' },
  { value: 'pending', label: 'Pendente' },
  { value: 'responded', label: 'Respondida' },
  { value: 'accepted', label: 'Aceita' },
  { value: 'expired', label: 'Expirada' },
  { value: 'rejected', label: 'Rejeitada' },
];

const categoryOptions = [
  { value: '', label: 'Todas as Categorias' },
  { value: 'Fertilizantes', label: 'Fertilizantes' },
  { value: 'Sementes', label: 'Sementes' },
  { value: 'Defensivos', label: 'Defensivos' },
  { value: 'Corretivos', label: 'Corretivos' },
];

const stateOptions = [
  { value: '', label: 'Todos os Estados' },
  { value: 'SP', label: 'Sao Paulo' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'PR', label: 'Parana' },
  { value: 'GO', label: 'Goias' },
  { value: 'BA', label: 'Bahia' },
  { value: 'RS', label: 'Rio Grande do Sul' },
];

const paymentMethodOptions = [
  'Boleto 30 dias',
  'Boleto 60 dias',
  'Boleto 90 dias',
  'PIX',
  'Cartao de credito',
  'Barter (troca)',
];

const statusVariantMap: Record<string, 'pending' | 'active' | 'expired' | 'success' | 'destructive'> = {
  pending: 'pending',
  responded: 'active',
  accepted: 'success',
  expired: 'expired',
  rejected: 'destructive',
};

const statusLabelMap: Record<string, string> = {
  pending: 'Pendente',
  responded: 'Respondida',
  accepted: 'Aceita',
  expired: 'Expirada',
  rejected: 'Rejeitada',
};

export default function QuotationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      items: [],
      deliveryDays: 7,
      freightCost: 0,
      paymentMethods: [],
      notes: '',
    },
  });

  const filteredQuotations = mockQuotations.filter((q) => {
    if (search && !q.number.toLowerCase().includes(search.toLowerCase()) && !q.farmer.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter && q.status !== statusFilter) return false;
    if (categoryFilter && q.category !== categoryFilter) return false;
    if (stateFilter && q.state !== stateFilter) return false;
    return true;
  });

  function openProposalSheet(quotation: Quotation) {
    setSelectedQuotation(quotation);
    setSelectedPaymentMethods([]);
    reset({
      items: quotation.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: 0,
      })),
      deliveryDays: 7,
      freightCost: 0,
      paymentMethods: [],
      notes: '',
    });
    setSheetOpen(true);
  }

  function togglePaymentMethod(method: string) {
    setSelectedPaymentMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  }

  async function onSubmitProposal(data: ProposalFormData) {
    setSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Proposal submitted:', { ...data, paymentMethods: selectedPaymentMethods, quotationId: selectedQuotation?.id });
    setSubmitting(false);
    setSheetOpen(false);
    setSelectedQuotation(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs />
        <h1 className="mt-2 text-2xl font-bold text-foreground">Cotacoes</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie as cotacoes recebidas e envie propostas aos produtores
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por numero ou produtor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-10 w-full rounded-md border border-border bg-white pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
              />
            </div>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Status"
            />
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder="Categoria"
            />
            <Select
              options={stateOptions}
              value={stateFilter}
              onChange={setStateFilter}
              placeholder="Estado"
            />
            {(statusFilter || categoryFilter || stateFilter || search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('');
                  setCategoryFilter('');
                  setStateFilter('');
                }}
              >
                <X className="mr-1 h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Chip Badges */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.filter((s) => s.value).map((status) => {
          const count = mockQuotations.filter((q) => q.status === status.value).length;
          const isActive = statusFilter === status.value;
          return (
            <button
              key={status.value}
              onClick={() => setStatusFilter(isActive ? '' : status.value)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-border'
              }`}
            >
              {status.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-border text-muted-foreground'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredQuotations.length} cotacao(oes) encontrada(s)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numero</TableHead>
                <TableHead>Produtor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Valor Est.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead className="text-right">Acao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">
                    {quotation.number}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{quotation.farmer}</p>
                      <p className="text-xs text-muted-foreground">
                        {quotation.city}/{quotation.state}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{quotation.category}</TableCell>
                  <TableCell>{quotation.items.length}</TableCell>
                  <TableCell>{formatCurrency(quotation.estimatedTotal / 100)}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[quotation.status]}>
                      {statusLabelMap[quotation.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(quotation.createdAt)}</TableCell>
                  <TableCell>{formatDate(quotation.expiresAt)}</TableCell>
                  <TableCell className="text-right">
                    {quotation.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => openProposalSheet(quotation)}
                      >
                        Enviar Proposta
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredQuotations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center">
                    <Filter className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Nenhuma cotacao encontrada com os filtros selecionados
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Proposal Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent onClose={() => setSheetOpen(false)}>
          <SheetHeader>
            <SheetTitle>Enviar Proposta</SheetTitle>
            <SheetDescription>
              Cotacao {selectedQuotation?.number} - {selectedQuotation?.farmer}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmitProposal)}>
            <SheetBody>
              <div className="space-y-6">
                {/* Price per item */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    Preco por Item
                  </h3>
                  <div className="space-y-3">
                    {selectedQuotation?.items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border p-3"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {item.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Preco unitario (R$)"
                          {...register(`items.${index}.unitPrice`, {
                            valueAsNumber: true,
                          })}
                          error={errors.items?.[index]?.unitPrice?.message}
                        />
                        <input
                          type="hidden"
                          {...register(`items.${index}.productName`)}
                          value={item.productName}
                        />
                        <input
                          type="hidden"
                          {...register(`items.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                          value={item.quantity}
                        />
                        <input
                          type="hidden"
                          {...register(`items.${index}.unit`)}
                          value={item.unit}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Days */}
                <Input
                  type="number"
                  label="Prazo de Entrega (dias)"
                  placeholder="Ex: 7"
                  {...register('deliveryDays', { valueAsNumber: true })}
                  error={errors.deliveryDays?.message}
                />

                {/* Freight Cost */}
                <Input
                  type="number"
                  step="0.01"
                  label="Valor do Frete (R$)"
                  placeholder="0.00"
                  {...register('freightCost', { valueAsNumber: true })}
                  error={errors.freightCost?.message}
                />

                {/* Payment Methods */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Formas de Pagamento
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethodOptions.map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => togglePaymentMethod(method)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                          selectedPaymentMethods.includes(method)
                            ? 'bg-primary-500 text-white'
                            : 'bg-muted text-muted-foreground hover:bg-border'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                  {errors.paymentMethods && (
                    <p className="mt-1 text-xs text-destructive-500">
                      {errors.paymentMethods.message}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <Textarea
                  label="Observacoes"
                  placeholder="Informacoes adicionais sobre a proposta..."
                  rows={4}
                  {...register('notes')}
                  error={errors.notes?.message}
                />
              </div>
            </SheetBody>

            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSheetOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={submitting}>
                Enviar Proposta
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

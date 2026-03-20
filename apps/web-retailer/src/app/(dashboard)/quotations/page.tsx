'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Search,
  Filter,
  X,
  FileText,
  Send,
  Save,
  AlertTriangle,
  TrendingUp,
  Clock,
  DollarSign,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
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
import { useTranslations } from 'next-intl';

// -- Zod validation schema for proposal --

const proposalItemSchema = z.object({
  productName: z.string(),
  quantity: z.number(),
  unit: z.string(),
  unitPrice: z
    .number({ required_error: 'Preço unitário obrigatório' })
    .min(0.01, 'Preço deve ser maior que zero'),
  brand: z.string().optional(),
});

const proposalSchema = z.object({
  items: z
    .array(proposalItemSchema)
    .min(1, 'Pelo menos um item deve ter preço'),
  deliveryDays: z
    .number({ required_error: 'Prazo de entrega obrigatório' })
    .int('Prazo deve ser um número inteiro')
    .min(1, 'Prazo mínimo de 1 dia')
    .max(90, 'Prazo máximo de 90 dias'),
  freightCost: z
    .number({ required_error: 'Valor do frete obrigatório' })
    .min(0, 'Frete não pode ser negativo'),
  paymentMethods: z
    .array(z.string())
    .min(1, 'Selecione ao menos uma forma de pagamento'),
  notes: z.string().max(500, 'Observações devem ter no máximo 500 caracteres').optional(),
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
  urgency: 'urgent' | 'normal' | 'low';
  createdAt: string;
  expiresAt: string;
}

type TabKey = 'open' | 'myProposals' | 'accepted' | 'expired';

// -- Mock data --

const mockQuotations: Quotation[] = [
  {
    id: '1',
    number: 'COT-2026-001234',
    farmer: 'Fazenda Boa Vista',
    city: 'Uberlândia',
    state: 'MG',
    category: 'Fertilizantes',
    items: [
      { productName: 'Fertilizante NPK 20-05-20', quantity: 50, unit: 'ton' },
      { productName: 'Uréia Granulada', quantity: 30, unit: 'ton' },
      { productName: 'MAP Granulado', quantity: 20, unit: 'ton' },
    ],
    estimatedTotal: 158000,
    status: 'pending',
    urgency: 'urgent',
    createdAt: '2026-03-18T10:30:00Z',
    expiresAt: '2026-03-20T10:30:00Z',
  },
  {
    id: '2',
    number: 'COT-2026-001233',
    farmer: 'Sítio São José',
    city: 'Ribeirão Preto',
    state: 'SP',
    category: 'Sementes',
    items: [
      { productName: 'Semente Soja TMG 2381', quantity: 200, unit: 'sc' },
      { productName: 'Semente Milho AG 9025', quantity: 100, unit: 'sc' },
    ],
    estimatedTotal: 285000,
    status: 'pending',
    urgency: 'normal',
    createdAt: '2026-03-18T09:45:00Z',
    expiresAt: '2026-03-20T09:45:00Z',
  },
  {
    id: '3',
    number: 'COT-2026-001232',
    farmer: 'Fazenda Esperança',
    city: 'Rondonópolis',
    state: 'MT',
    category: 'Defensivos',
    items: [
      { productName: 'Herbicida Glifosato 480g/L', quantity: 500, unit: 'L' },
      { productName: 'Inseticida Imidacloprid', quantity: 200, unit: 'L' },
    ],
    estimatedTotal: 420000,
    status: 'responded',
    urgency: 'normal',
    createdAt: '2026-03-18T08:15:00Z',
    expiresAt: '2026-03-20T08:15:00Z',
  },
  {
    id: '4',
    number: 'COT-2026-001231',
    farmer: 'Agropecuária Sol Nascente',
    city: 'Cascavel',
    state: 'PR',
    category: 'Fertilizantes',
    items: [
      { productName: 'Calcário Dolomítico PRNT 85%', quantity: 100, unit: 'ton' },
    ],
    estimatedTotal: 19200,
    status: 'accepted',
    urgency: 'low',
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
    urgency: 'low',
    createdAt: '2026-03-17T14:00:00Z',
    expiresAt: '2026-03-18T14:00:00Z',
  },
  {
    id: '6',
    number: 'COT-2026-001229',
    farmer: 'Fazenda Três Irmãos',
    city: 'Dourados',
    state: 'MS',
    category: 'Defensivos',
    items: [
      { productName: 'Fungicida Azoxistrobina', quantity: 300, unit: 'L' },
    ],
    estimatedTotal: 78000,
    status: 'rejected',
    urgency: 'normal',
    createdAt: '2026-03-16T11:00:00Z',
    expiresAt: '2026-03-18T11:00:00Z',
  },
];

const statusVariantMap: Record<string, 'pending' | 'active' | 'expired' | 'success' | 'destructive'> = {
  pending: 'pending',
  responded: 'active',
  accepted: 'success',
  expired: 'expired',
  rejected: 'destructive',
};

const urgencyMap: Record<string, string> = {
  urgent: 'bg-error-container/20 text-error border border-error/20 animate-pulse',
  normal: 'bg-surface-container-highest text-on-surface-variant',
  low: 'bg-primary/10 text-primary',
};

const tabFilterMap: Record<TabKey, (q: Quotation) => boolean> = {
  open: (q) => q.status === 'pending',
  myProposals: (q) => q.status === 'responded',
  accepted: (q) => q.status === 'accepted',
  expired: (q) => q.status === 'expired' || q.status === 'rejected',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function getExpiryProgress(createdAt: string, expiresAt: string): number {
  const start = new Date(createdAt).getTime();
  const end = new Date(expiresAt).getTime();
  const now = Date.now();
  if (now >= end) return 100;
  if (now <= start) return 0;
  return Math.round(((now - start) / (end - start)) * 100);
}

export default function QuotationsPage() {
  const t = useTranslations('quotations');
  const tp = useTranslations('proposal');
  const tc = useTranslations('common');

  const [activeTab, setActiveTab] = useState<TabKey>('open');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'open', label: t('tabs.open') },
    { key: 'myProposals', label: t('tabs.myProposals') },
    { key: 'accepted', label: t('tabs.accepted') },
    { key: 'expired', label: t('tabs.expired') },
  ];

  const categoryOptions = [
    { value: '', label: t('filters.allCategories') },
    { value: 'Fertilizantes', label: t('categories.fertilizers') },
    { value: 'Sementes', label: t('categories.seeds') },
    { value: 'Defensivos', label: t('categories.pesticides') },
  ];

  const stateOptions = [
    { value: '', label: t('filters.allStates') },
    { value: 'SP', label: 'São Paulo' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'PR', label: 'Paraná' },
    { value: 'GO', label: 'Goiás' },
    { value: 'BA', label: 'Bahia' },
    { value: 'RS', label: 'Rio Grande do Sul' },
  ];

  const paymentMethodKeys = ['boleto30', 'boleto60', 'boleto90', 'pix', 'card', 'barter'] as const;

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  const watchedItems = watch('items');
  const watchedFreight = watch('freightCost');

  const filteredQuotations = useMemo(() => {
    return mockQuotations.filter((q) => {
      if (!tabFilterMap[activeTab](q)) return false;
      if (search && !q.number.toLowerCase().includes(search.toLowerCase()) && !q.farmer.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (categoryFilter && q.category !== categoryFilter) return false;
      if (stateFilter && q.state !== stateFilter) return false;
      return true;
    });
  }, [activeTab, search, categoryFilter, stateFilter]);

  const tabCounts = useMemo(() => {
    const counts: Record<TabKey, number> = { open: 0, myProposals: 0, accepted: 0, expired: 0 };
    for (const q of mockQuotations) {
      for (const key of Object.keys(tabFilterMap) as TabKey[]) {
        if (tabFilterMap[key](q)) counts[key]++;
      }
    }
    return counts;
  }, []);

  const proposalSubtotal = useMemo(() => {
    if (!watchedItems) return 0;
    return watchedItems.reduce((acc, item) => {
      const price = item?.unitPrice || 0;
      const qty = item?.quantity || 0;
      return acc + price * qty;
    }, 0);
  }, [watchedItems]);

  const proposalTotal = proposalSubtotal + (watchedFreight || 0);

  // KPI summary data
  const kpiData = {
    conversionRate: 68,
    pendingProposals: mockQuotations.filter((q) => q.status === 'responded').length,
    monthlySales: mockQuotations
      .filter((q) => q.status === 'accepted')
      .reduce((acc, q) => acc + q.estimatedTotal, 0),
  };

  function openProposalSheet(quotation: Quotation) {
    setSelectedQuotation(quotation);
    setSelectedPaymentMethods([]);
    reset({
      items: quotation.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: 0,
        brand: '',
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Proposal submitted:', { ...data, paymentMethods: selectedPaymentMethods, quotationId: selectedQuotation?.id });
    setSubmitting(false);
    setSheetOpen(false);
    setSelectedQuotation(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Breadcrumbs />
          <h1 className="mt-2 text-2xl font-black text-on-surface tracking-tight">
            {t('title')}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {t('subtitle')}
          </p>
        </div>
        <Button className="gap-2 bg-secondary text-on-secondary font-bold rounded-xl hover:shadow-[0_0_20px_rgba(246,190,57,0.3)]">
          <Plus className="h-4 w-4" />
          {t('newInternalQuotation')}
        </Button>
      </div>

      {/* Tabs Bar */}
      <div className="rounded-xl bg-surface-container p-1.5 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
            }`}
          >
            {tab.label}
            <span className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
              activeTab === tab.key
                ? 'bg-on-primary-container/20 text-on-primary-container'
                : 'bg-surface-container-highest text-on-surface-variant'
            }`}>
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl bg-surface-container-low p-4 border border-outline-variant/30">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[260px]">
            <label className="mb-1.5 block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {tc('search')}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder={t('filters.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-10 w-full rounded-lg border-none bg-surface-container-high pl-10 pr-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1.5 block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('filters.category')}
            </label>
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              placeholder={t('filters.category')}
            />
          </div>
          <div className="min-w-[180px]">
            <label className="mb-1.5 block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              {t('filters.state')}
            </label>
            <Select
              options={stateOptions}
              value={stateFilter}
              onChange={setStateFilter}
              placeholder={t('filters.state')}
            />
          </div>
          {(categoryFilter || stateFilter || search) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-on-surface-variant hover:text-on-surface"
              onClick={() => {
                setSearch('');
                setCategoryFilter('');
                setStateFilter('');
              }}
            >
              <X className="mr-1 h-4 w-4" />
              {t('filters.clear')}
            </Button>
          )}
        </div>
      </div>

      {/* Quotations Table */}
      <div className="rounded-2xl bg-surface-container border border-outline-variant/20 shadow-xl overflow-hidden">
        {/* Table Header Info */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10">
          <p className="text-sm font-bold text-on-surface">
            {filteredQuotations.length} {t('resultsFound')}
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-high border-b border-outline-variant/10">
              <TableHead className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {t('table.number')}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {t('table.producer')}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {t('table.category')}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {t('table.products')}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {t('table.estimatedValue')}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {t('table.urgency')}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {tc('status')}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                {t('table.expiration')}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                {tc('actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotations.map((quotation) => {
              const expiryProgress = getExpiryProgress(quotation.createdAt, quotation.expiresAt);
              return (
                <TableRow
                  key={quotation.id}
                  className="border-b border-outline-variant/10 hover:bg-primary/5 transition-colors"
                >
                  <TableCell className="px-6 py-4 font-mono text-sm font-bold text-primary">
                    {quotation.number}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tertiary-container">
                        <span className="text-[10px] font-bold text-on-tertiary-container">
                          {getInitials(quotation.farmer)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-on-surface">{quotation.farmer}</p>
                        <p className="text-xs text-on-surface-variant">
                          {quotation.city}/{quotation.state}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-on-surface-variant">
                    {quotation.category}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-on-surface-variant">
                    {quotation.items.length} {quotation.items.length === 1 ? 'item' : 'itens'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-bold text-on-surface">
                    {formatCurrency(quotation.estimatedTotal / 100)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${urgencyMap[quotation.urgency]}`}>
                      {quotation.urgency === 'urgent' && <AlertTriangle className="h-3 w-3" />}
                      {t(`urgency.${quotation.urgency}`)}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant={statusVariantMap[quotation.status]}>
                      {t(`status.${quotation.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs text-on-surface-variant">
                        {formatDate(quotation.expiresAt)}
                      </p>
                      <div className="h-1 w-full rounded-full bg-outline-variant">
                        <div
                          className={`h-full rounded-full transition-all ${
                            expiryProgress > 80 ? 'bg-error' : expiryProgress > 50 ? 'bg-secondary' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(expiryProgress, 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    {quotation.status === 'pending' ? (
                      <button
                        onClick={() => openProposalSheet(quotation)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-on-primary transition-all hover:shadow-[0_0_12px_rgba(137,216,158,0.3)]"
                      >
                        <Send className="h-3 w-3" />
                        {t('sendProposal')}
                      </button>
                    ) : (
                      <button className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-highest px-3 py-2 text-xs font-medium text-on-surface-variant transition-colors hover:text-on-surface">
                        <FileText className="h-3 w-3" />
                        {t('viewDetail')}
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredQuotations.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-16 text-center">
                  <Filter className="mx-auto h-10 w-10 text-on-surface-variant/40" />
                  <p className="mt-3 text-sm font-medium text-on-surface-variant">
                    {t('noResults')}
                  </p>
                  <p className="mt-1 text-xs text-on-surface-variant/60">
                    {t('noResultsHint')}
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between bg-surface-container-high px-6 py-4 border-t border-outline-variant/10">
          <p className="text-xs text-on-surface-variant">
            {t('showing')} <span className="font-bold text-on-surface">{filteredQuotations.length}</span> {t('of')} <span className="font-bold text-on-surface">{mockQuotations.length}</span> {t('resultsLabel')}
          </p>
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant transition-colors hover:text-on-surface">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-on-primary-container text-xs font-bold">
              1
            </span>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant transition-colors hover:text-on-surface">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bento KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Conversion Rate */}
        <div className="rounded-2xl bg-surface-container-low p-5 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {t('kpi.conversionRate')}
          </p>
          <p className="mt-1 text-2xl font-black text-on-surface">{kpiData.conversionRate}%</p>
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
            <TrendingUp className="h-3 w-3" /> +5.2%
          </span>
        </div>

        {/* Pending Proposals */}
        <div className="rounded-2xl bg-surface-container-low p-5 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
              <Clock className="h-5 w-5 text-secondary" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {t('kpi.pendingProposals')}
          </p>
          <p className="mt-1 text-2xl font-black text-on-surface">{kpiData.pendingProposals}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-secondary">
            {t('kpi.awaitingResponse')}
          </span>
        </div>

        {/* Monthly Sales */}
        <div className="rounded-2xl bg-surface-container-low p-5 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            {t('kpi.monthlySales')}
          </p>
          <p className="mt-1 text-2xl font-black text-on-surface">
            {formatCurrency(kpiData.monthlySales / 100)}
          </p>
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
            <TrendingUp className="h-3 w-3" /> +12.3%
          </span>
        </div>

        {/* AgroBiz Insights */}
        <div className="rounded-2xl bg-primary-container p-5 border border-primary/20 relative overflow-hidden">
          <Sparkles className="absolute -right-2 -bottom-2 h-20 w-20 text-on-primary-container/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-on-primary-container/10">
                <Sparkles className="h-5 w-5 text-on-primary-container" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-on-primary-container/80 uppercase tracking-widest">
              {t('kpi.insights')}
            </p>
            <p className="mt-1 text-sm font-bold text-on-primary-container">
              {t('kpi.insightsDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Proposal Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent onClose={() => setSheetOpen(false)}>
          <SheetHeader>
            <SheetTitle className="text-on-surface">{tp('title')}</SheetTitle>
            <SheetDescription className="text-on-surface-variant">
              {tp('quotationRef')} {selectedQuotation?.number} — {selectedQuotation?.farmer}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmitProposal)}>
            <SheetBody>
              <div className="space-y-6">
                {/* Per-item pricing cards */}
                <div>
                  <h3 className="mb-3 text-sm font-bold text-on-surface">
                    {tp('itemPricing')}
                  </h3>
                  <div className="space-y-3">
                    {selectedQuotation?.items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden"
                      >
                        {/* Item header */}
                        <div className="flex items-center gap-3 bg-surface-container-high px-4 py-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20">
                            <span className="text-xs font-bold text-primary">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-on-surface">{item.productName}</p>
                            <p className="text-xs text-on-surface-variant">
                              {item.quantity} {item.unit}
                            </p>
                          </div>
                        </div>

                        {/* Item fields */}
                        <div className="grid grid-cols-2 gap-3 p-4">
                          <div>
                            <label className="mb-1 block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                              {tp('item.unitPrice')}
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="R$ 0,00"
                              {...register(`items.${index}.unitPrice`, {
                                valueAsNumber: true,
                              })}
                              error={errors.items?.[index]?.unitPrice?.message}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                              {tp('item.brand')}
                            </label>
                            <Input
                              type="text"
                              placeholder={tp('item.brandPlaceholder')}
                              {...register(`items.${index}.brand`)}
                            />
                          </div>
                          <input type="hidden" {...register(`items.${index}.productName`)} value={item.productName} />
                          <input type="hidden" {...register(`items.${index}.quantity`, { valueAsNumber: true })} value={item.quantity} />
                          <input type="hidden" {...register(`items.${index}.unit`)} value={item.unit} />
                        </div>

                        {/* Subtotal */}
                        {watchedItems?.[index]?.unitPrice > 0 && (
                          <div className="mx-4 mb-4 rounded-lg bg-primary-container/10 border border-primary/20 px-4 py-2 flex items-center justify-between">
                            <span className="text-xs text-on-surface-variant">{tp('item.subtotal')}</span>
                            <span className="text-sm font-bold text-primary">
                              {formatCurrency((watchedItems[index].unitPrice || 0) * item.quantity)}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery & Freight */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      {tp('item.deliveryDays')}
                    </label>
                    <Input
                      type="number"
                      placeholder="7"
                      {...register('deliveryDays', { valueAsNumber: true })}
                      error={errors.deliveryDays?.message}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                      {tp('freightCost')}
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="R$ 0,00"
                      {...register('freightCost', { valueAsNumber: true })}
                      error={errors.freightCost?.message}
                    />
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="mb-2 block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    {tp('paymentMethods')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {paymentMethodKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => togglePaymentMethod(key)}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                          selectedPaymentMethods.includes(key)
                            ? 'bg-primary-container text-on-primary-container shadow-sm'
                            : 'bg-surface-container-highest text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {tp(`payment.${key}`)}
                      </button>
                    ))}
                  </div>
                  {errors.paymentMethods && (
                    <p className="mt-1 text-xs text-error">
                      {errors.paymentMethods.message}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    {tp('notes')}
                  </label>
                  <Textarea
                    placeholder={tp('notesPlaceholder')}
                    rows={3}
                    {...register('notes')}
                    error={errors.notes?.message}
                  />
                </div>

                {/* Financial Summary */}
                <div className="rounded-2xl bg-surface-container p-5 border-2 border-primary/30 shadow-xl">
                  <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
                    {tp('summary')}
                  </h4>
                  <div className="space-y-2 text-sm text-on-surface-variant">
                    <div className="flex justify-between">
                      <span>{tp('subtotalLabel')}</span>
                      <span className="font-medium text-on-surface">{formatCurrency(proposalSubtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{tp('freightCost')}</span>
                      <span className="font-medium text-on-surface">{formatCurrency(watchedFreight || 0)}</span>
                    </div>
                    <div className="border-t border-outline-variant/30 pt-2 mt-2 flex justify-between">
                      <span className="font-bold text-on-surface">{tp('totalValue')}</span>
                      <span className="text-xl font-black text-primary">{formatCurrency(proposalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SheetBody>

            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSheetOpen(false)}
                className="border-outline-variant text-on-surface-variant"
              >
                {tc('cancel')}
              </Button>
              <Button
                type="submit"
                loading={submitting}
                className="bg-primary text-on-primary font-bold rounded-xl hover:shadow-[0_0_20px_rgba(137,216,158,0.4)]"
              >
                <Send className="mr-2 h-4 w-4" />
                {tp('submit')}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

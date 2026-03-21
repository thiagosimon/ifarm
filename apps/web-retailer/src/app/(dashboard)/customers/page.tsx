'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Users, UserPlus, Search, Mail, Phone, MapPin, ShoppingBag,
  DollarSign, MoreVertical, ArrowUpDown, TrendingUp,
  X, Check, AlertTriangle, Loader2, Settings,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { cn, formatCurrency } from '@/lib/utils';

const GATEWAY = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/api').replace('/api', '');

type CustomerStatus = 'active' | 'inactive';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  status: CustomerStatus;
  totalSpent: number;
  orders: number;
  createdAt?: string;
}

// ---- Customer Modal ----
interface CustomerModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onSaved: (c: Customer) => void;
}

function CustomerModal({ open, customer, onClose, onSaved }: CustomerModalProps) {
  const t = useTranslations('customers');
  const tc = useTranslations('common');
  const isEdit = !!customer;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [status, setStatus] = useState<CustomerStatus>('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(customer?.name ?? '');
      setEmail(customer?.email ?? '');
      setPhone(customer?.phone ?? '');
      setCity(customer?.city ?? '');
      setState(customer?.state ?? '');
      setStatus(customer?.status ?? 'active');
      setError('');
    }
  }, [open, customer]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    setError('');

    try {
      const url = isEdit
        ? `${GATEWAY}/api/v1/identity/customers/${customer!._id}`
        : `${GATEWAY}/api/v1/identity/customers`;

      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          city: city.trim() || null,
          state: state.trim() || null,
          status,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Erro ao salvar cliente');
      }

      const data = await res.json();
      onSaved(data.data);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container shadow-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant/30 p-5">
          <h2 className="text-lg font-semibold text-on-surface">
            {isEdit ? t('editCustomer') : t('addCustomer')}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-surface-variant/30 transition-colors">
            <X className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-error-container/20 px-3 py-2 text-sm text-red-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-medium text-on-surface-variant mb-1 block">{t('fields.name')} *</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Fazenda Santa Clara" required />
            </div>

            <div>
              <label className="text-sm font-medium text-on-surface-variant mb-1 block">{t('fields.email')} *</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contato@fazenda.com.br" required />
            </div>

            <div>
              <label className="text-sm font-medium text-on-surface-variant mb-1 block">{t('fields.phone')}</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-on-surface-variant mb-1 block">{t('fields.city')}</label>
                <Input value={city} onChange={e => setCity(e.target.value)} placeholder="São Paulo" />
              </div>
              <div>
                <label className="text-sm font-medium text-on-surface-variant mb-1 block">{t('fields.state')}</label>
                <Input value={state} onChange={e => setState(e.target.value)} placeholder="SP" maxLength={2} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-on-surface-variant mb-1 block">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as CustomerStatus)}
                className="w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="active">{t('status.active')}</option>
                <option value="inactive">{t('status.inactive')}</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>
              {tc('cancel')}
            </Button>
            <Button type="submit" className="flex-1 gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {tc('save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Delete Dialog ----
interface DeleteDialogProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

function DeleteDialog({ open, customer, onClose, onConfirm, loading }: DeleteDialogProps) {
  const t = useTranslations('customers');
  const tc = useTranslations('common');

  if (!open || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container shadow-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-on-surface">{t('deleteTitle')}</h2>
            <p className="text-sm text-on-surface-variant">{t('deleteConfirm', { name: customer.name })}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>{tc('cancel')}</Button>
          <Button
            className="flex-1 gap-2 bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {tc('delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---- Context Menu ----
interface ContextMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

function ContextMenu({ onEdit, onDelete }: ContextMenuProps) {
  const tc = useTranslations('common');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(!open)}>
        <MoreVertical className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-9 z-50 w-36 rounded-xl border border-outline-variant bg-surface-container shadow-2xl overflow-hidden">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-high transition-colors"
            onClick={() => { setOpen(false); onEdit(); }}
          >
            <Settings className="h-4 w-4" />
            {tc('edit')}
          </button>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            onClick={() => { setOpen(false); onDelete(); }}
          >
            <X className="h-4 w-4" />
            {tc('delete')}
          </button>
        </div>
      )}
    </div>
  );
}

// ---- Main Page ----
export default function CustomersPage() {
  const t = useTranslations('customers');
  const tc = useTranslations('common');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | CustomerStatus>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const res = await fetch(`${GATEWAY}/api/v1/identity/customers`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.data ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  function handleSaved(saved: Customer) {
    setCustomers(prev => {
      const idx = prev.findIndex(c => c._id === saved._id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = saved;
        return updated;
      }
      return [saved, ...prev];
    });
    setModalOpen(false);
    setEditCustomer(null);
  }

  async function handleDelete() {
    if (!deleteCustomer) return;
    setDeleteLoading(true);
    try {
      await fetch(`${GATEWAY}/api/v1/identity/customers/${deleteCustomer._id}`, { method: 'DELETE' });
      setCustomers(prev => prev.filter(c => c._id !== deleteCustomer._id));
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
      setDeleteCustomer(null);
    }
  }

  const filtered = customers
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.city ?? '').toLowerCase().includes(search.toLowerCase())
    );

  const activeCount = customers.filter(c => c.status === 'active').length;
  const totalSpent = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const avgTicket = customers.length > 0 ? totalSpent / customers.length : 0;

  const KPIs = [
    { key: 'totalCustomers', value: String(customers.length), icon: Users, color: 'text-primary' },
    { key: 'activeCustomers', value: String(activeCount), icon: TrendingUp, color: 'text-emerald-400' },
    { key: 'newThisMonth', value: String(customers.filter(c => {
      if (!c.createdAt) return false;
      const d = new Date(c.createdAt);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length), icon: UserPlus, color: 'text-blue-400' },
    { key: 'avgTicket', value: formatCurrency(avgTicket), icon: DollarSign, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: t('title') }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">{t('title')}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{t('subtitle')}</p>
        </div>
        <Button className="gap-2" onClick={() => { setEditCustomer(null); setModalOpen(true); }}>
          <UserPlus className="h-4 w-4" />
          {t('addCustomer')}
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        {KPIs.map(kpi => (
          <Card key={kpi.key} className="glass-card">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant/50', kpi.color)}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-on-surface">{kpi.value}</p>
                <p className="text-xs text-on-surface-variant">{t(kpi.key)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <Input
            placeholder={t('search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? tc('all') : t(`status.${f}`)}
            </Button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <Card className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-on-surface">
                      {t('fields.name')} <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider hidden md:table-cell">{t('fields.city')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider hidden md:table-cell">{t('fields.phone')}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-on-surface-variant uppercase tracking-wider">{t('fields.totalSpent')}</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-on-surface-variant uppercase tracking-wider hidden sm:table-cell">{t('fields.orders')}</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filtered.map(customer => (
                  <tr key={customer._id} className="hover:bg-surface-variant/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-xs">
                          {customer.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-on-surface truncate">{customer.name}</p>
                          <p className="text-xs text-on-surface-variant flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {customer.city ? (
                        <span className="text-sm text-on-surface-variant flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {customer.city}{customer.state ? `/${customer.state}` : ''}
                        </span>
                      ) : (
                        <span className="text-sm text-on-surface-variant/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {customer.phone ? (
                        <span className="text-sm text-on-surface-variant flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {customer.phone}
                        </span>
                      ) : (
                        <span className="text-sm text-on-surface-variant/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-on-surface">{formatCurrency(customer.totalSpent || 0)}</span>
                    </td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <span className="flex items-center justify-center gap-1 text-sm text-on-surface-variant">
                        <ShoppingBag className="h-3 w-3" /> {customer.orders || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={customer.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {t(`status.${customer.status}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <ContextMenu
                        onEdit={() => { setEditCustomer(customer); setModalOpen(true); }}
                        onDelete={() => { setDeleteCustomer(customer); setDeleteDialogOpen(true); }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-on-surface-variant/40 mb-4" />
            <p className="text-on-surface-variant">{tc('noResults')}</p>
          </div>
        )}
      </Card>

      <CustomerModal
        open={modalOpen}
        customer={editCustomer}
        onClose={() => { setModalOpen(false); setEditCustomer(null); }}
        onSaved={handleSaved}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        customer={deleteCustomer}
        onClose={() => { setDeleteDialogOpen(false); setDeleteCustomer(null); }}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}

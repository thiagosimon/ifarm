'use client';

import React from 'react';
import { usePagination } from './use-pagination';
import { useDebounce } from './use-debounce';

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'in_preparation'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'disputed'
  | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  farmer: { id: string; name: string; company: string };
  retailer: { id: string; name: string };
  status: OrderStatus;
  value: number;
  commission: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{ name: string; ncm: string; quantity: number; unit: string; unitPrice: number; total: number }>;
  timeline: Array<{ status: string; date: string; done: boolean }>;
}

interface UseOrdersReturn {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  page: number;
  totalPages: number;
  goToPage: (p: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  cancelOrder: (id: string, reason: string) => Promise<void>;
  refresh: () => void;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const debouncedSearch = useDebounce(search, 300);
  const { page, totalPages, goToPage, nextPage, prevPage, setTotalItems } = usePagination({ itemsPerPage: 20 });

  const fetchOrders = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
      });
      const res = await fetch(`/api/v1/orders?${params}`);
      if (!res.ok) throw new Error('Erro ao buscar pedidos');
      const data = await res.json();
      setOrders(data.items || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, dateFrom, dateTo, setTotalItems, refreshTrigger]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const cancelOrder = async (id: string, reason: string) => {
    await fetch(`/api/v1/orders/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    setRefreshTrigger((n) => n + 1);
  };

  return {
    orders,
    isLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    page,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    cancelOrder,
    refresh: () => setRefreshTrigger((n) => n + 1),
  };
}

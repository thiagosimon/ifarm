'use client';

import React from 'react';
import { usePagination } from './use-pagination';
import { useDebounce } from './use-debounce';

export interface Retailer {
  id: string;
  name: string;
  email: string;
  cnpj: string;
  region: string;
  segment: string;
  status: 'active' | 'pending' | 'suspended';
  kycStatus: 'not_started' | 'docs_sent' | 'approved' | 'rejected';
  createdAt: string;
  totalOrders: number;
  totalSpend: number;
}

interface UseRetailersReturn {
  retailers: Retailer[];
  isLoading: boolean;
  error: string | null;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  page: number;
  totalPages: number;
  goToPage: (p: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  approveRetailerKyc: (id: string) => Promise<void>;
  rejectRetailerKyc: (id: string, reason: string) => Promise<void>;
  suspendRetailer: (id: string, reason: string) => Promise<void>;
  reactivateRetailer: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useRetailers(): UseRetailersReturn {
  const [retailers, setRetailers] = React.useState<Retailer[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const debouncedSearch = useDebounce(search, 300);
  const { page, totalPages, goToPage, nextPage, prevPage, setTotalItems } = usePagination({ itemsPerPage: 20 });

  const fetchRetailers = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });
      const res = await fetch(`/api/v1/retailers?${params}`);
      if (!res.ok) throw new Error('Erro ao buscar retailers');
      const data = await res.json();
      setRetailers(data.items || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, setTotalItems, refreshTrigger]);

  React.useEffect(() => {
    fetchRetailers();
  }, [fetchRetailers]);

  const approveRetailerKyc = async (id: string) => {
    await fetch(`/api/v1/retailers/${id}/kyc/approve`, { method: 'POST' });
    setRefreshTrigger((n) => n + 1);
  };

  const rejectRetailerKyc = async (id: string, reason: string) => {
    await fetch(`/api/v1/retailers/${id}/kyc/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    setRefreshTrigger((n) => n + 1);
  };

  const suspendRetailer = async (id: string, reason: string) => {
    await fetch(`/api/v1/retailers/${id}/suspend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    setRefreshTrigger((n) => n + 1);
  };

  const reactivateRetailer = async (id: string) => {
    await fetch(`/api/v1/retailers/${id}/reactivate`, { method: 'POST' });
    setRefreshTrigger((n) => n + 1);
  };

  return {
    retailers,
    isLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    approveRetailerKyc,
    rejectRetailerKyc,
    suspendRetailer,
    reactivateRetailer,
    refresh: () => setRefreshTrigger((n) => n + 1),
  };
}

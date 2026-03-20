'use client';

import React from 'react';
import { useApi } from './use-api';
import { usePagination } from './use-pagination';
import { useDebounce } from './use-debounce';

export interface Farmer {
  id: string;
  name: string;
  email: string;
  cnpj: string;
  region: string;
  state: string;
  status: 'active' | 'pending' | 'suspended';
  kycStatus: 'not_started' | 'docs_sent' | 'approved' | 'rejected';
  createdAt: string;
  totalOrders: number;
  totalGmv: number;
}

interface UseFarmersReturn {
  farmers: Farmer[];
  isLoading: boolean;
  error: string | null;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  kycFilter: string;
  setKycFilter: (v: string) => void;
  page: number;
  totalPages: number;
  goToPage: (p: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  approveFarmerKyc: (id: string) => Promise<void>;
  rejectFarmerKyc: (id: string, reason: string) => Promise<void>;
  suspendFarmer: (id: string, reason: string) => Promise<void>;
  reactivateFarmer: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useFarmers(): UseFarmersReturn {
  const [farmers, setFarmers] = React.useState<Farmer[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [kycFilter, setKycFilter] = React.useState('all');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const debouncedSearch = useDebounce(search, 300);
  const { page, totalPages, goToPage, nextPage, prevPage, setTotalItems } = usePagination({ itemsPerPage: 20 });

  const fetchFarmers = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(kycFilter !== 'all' && { kycStatus: kycFilter }),
      });
      const res = await fetch(`/api/v1/farmers?${params}`);
      if (!res.ok) throw new Error('Erro ao buscar farmers');
      const data = await res.json();
      setFarmers(data.items || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, kycFilter, setTotalItems, refreshTrigger]);

  React.useEffect(() => {
    fetchFarmers();
  }, [fetchFarmers]);

  const approveFarmerKyc = async (id: string) => {
    await fetch(`/api/v1/farmers/${id}/kyc/approve`, { method: 'POST' });
    setRefreshTrigger((n) => n + 1);
  };

  const rejectFarmerKyc = async (id: string, reason: string) => {
    await fetch(`/api/v1/farmers/${id}/kyc/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    setRefreshTrigger((n) => n + 1);
  };

  const suspendFarmer = async (id: string, reason: string) => {
    await fetch(`/api/v1/farmers/${id}/suspend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    setRefreshTrigger((n) => n + 1);
  };

  const reactivateFarmer = async (id: string) => {
    await fetch(`/api/v1/farmers/${id}/reactivate`, { method: 'POST' });
    setRefreshTrigger((n) => n + 1);
  };

  return {
    farmers,
    isLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    kycFilter,
    setKycFilter,
    page,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    approveFarmerKyc,
    rejectFarmerKyc,
    suspendFarmer,
    reactivateFarmer,
    refresh: () => setRefreshTrigger((n) => n + 1),
  };
}

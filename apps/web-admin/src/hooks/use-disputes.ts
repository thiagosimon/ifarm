'use client';

import React from 'react';
import { usePagination } from './use-pagination';

export type DisputeStatus = 'open' | 'in_analysis' | 'resolved' | 'closed';

export interface Dispute {
  id: string;
  orderNumber: string;
  farmer: { id: string; name: string; company: string };
  retailer: { id: string; name: string };
  reason: string;
  description: string;
  status: DisputeStatus;
  value: number;
  slaDays: number;
  openedAt: string;
  resolvedAt?: string;
  resolution?: string;
  messages: Array<{ author: string; text: string; time: string; isAdmin: boolean }>;
}

interface UseDisputesReturn {
  disputes: Dispute[];
  isLoading: boolean;
  error: string | null;
  statusFilter: DisputeStatus | 'all';
  setStatusFilter: (v: DisputeStatus | 'all') => void;
  stats: {
    open: number;
    inAnalysis: number;
    resolved: number;
    totalValue: number;
  };
  page: number;
  totalPages: number;
  goToPage: (p: number) => void;
  resolveDispute: (id: string, resolution: string, favorFarmer: boolean) => Promise<void>;
  addMessage: (id: string, message: string) => Promise<void>;
  refresh: () => void;
}

export function useDisputes(): UseDisputesReturn {
  const [disputes, setDisputes] = React.useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<DisputeStatus | 'all'>('all');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  const { page, totalPages, goToPage, setTotalItems } = usePagination({ itemsPerPage: 20 });

  const fetchDisputes = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });
      const res = await fetch(`/api/v1/disputes?${params}`);
      if (!res.ok) throw new Error('Erro ao buscar disputas');
      const data = await res.json();
      setDisputes(data.items || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, setTotalItems, refreshTrigger]);

  React.useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const stats = React.useMemo(() => ({
    open: disputes.filter((d) => d.status === 'open').length,
    inAnalysis: disputes.filter((d) => d.status === 'in_analysis').length,
    resolved: disputes.filter((d) => d.status === 'resolved').length,
    totalValue: disputes.reduce((acc, d) => acc + d.value, 0),
  }), [disputes]);

  const resolveDispute = async (id: string, resolution: string, favorFarmer: boolean) => {
    await fetch(`/api/v1/disputes/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution, favorFarmer }),
    });
    setRefreshTrigger((n) => n + 1);
  };

  const addMessage = async (id: string, message: string) => {
    await fetch(`/api/v1/disputes/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    setRefreshTrigger((n) => n + 1);
  };

  return {
    disputes,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    stats,
    page,
    totalPages,
    goToPage,
    resolveDispute,
    addMessage,
    refresh: () => setRefreshTrigger((n) => n + 1),
  };
}

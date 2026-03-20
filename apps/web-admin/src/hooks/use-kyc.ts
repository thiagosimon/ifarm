'use client';

import React from 'react';
import { usePagination } from './use-pagination';

export interface KycEntry {
  id: string;
  number: string;
  userId: string;
  userName: string;
  userEmail: string;
  userType: 'farmer' | 'retailer';
  cnpj: string;
  submittedAt: string;
  waitDays: number;
  documents: string[];
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
}

interface UseKycReturn {
  queue: KycEntry[];
  isLoading: boolean;
  error: string | null;
  stats: { pending: number; totalDocuments: number; oldestDays: number };
  approveKyc: (id: string) => Promise<void>;
  rejectKyc: (id: string, reason: string) => Promise<void>;
  page: number;
  totalPages: number;
  goToPage: (p: number) => void;
  refresh: () => void;
}

export function useKyc(): UseKycReturn {
  const [queue, setQueue] = React.useState<KycEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const { page, totalPages, goToPage, setTotalItems } = usePagination({ itemsPerPage: 20 });

  const fetchQueue = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/kyc/queue?page=${page}&limit=20&status=pending`);
      if (!res.ok) throw new Error('Erro ao buscar fila KYC');
      const data = await res.json();
      setQueue(data.items || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, [page, setTotalItems, refreshTrigger]);

  React.useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const stats = React.useMemo(() => ({
    pending: queue.length,
    totalDocuments: queue.reduce((acc, e) => acc + e.documents.length, 0),
    oldestDays: queue.reduce((max, e) => Math.max(max, e.waitDays), 0),
  }), [queue]);

  const approveKyc = async (id: string) => {
    await fetch(`/api/v1/kyc/${id}/approve`, { method: 'POST' });
    setRefreshTrigger((n) => n + 1);
  };

  const rejectKyc = async (id: string, reason: string) => {
    await fetch(`/api/v1/kyc/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    setRefreshTrigger((n) => n + 1);
  };

  return {
    queue,
    isLoading,
    error,
    stats,
    approveKyc,
    rejectKyc,
    page,
    totalPages,
    goToPage,
    refresh: () => setRefreshTrigger((n) => n + 1),
  };
}

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// -- Types --

export type PayoutStatus = 'paid' | 'scheduled' | 'processing' | 'held';

export interface Payout {
  id: string;
  reference: string;
  orderNumber: string;
  farmer: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: PayoutStatus;
  scheduledDate: string;
  paidDate: string | null;
}

export interface FinancialSummary {
  totalPaid: number;
  totalScheduled: number;
  totalHeld: number;
  totalFees: number;
  holdbackDays: number;
}

export interface FinancialFilters {
  page?: number;
  limit?: number;
  status?: PayoutStatus;
  startDate?: string;
  endDate?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// -- Query keys --

const financialKeys = {
  all: ['financial'] as const,
  summary: () => [...financialKeys.all, 'summary'] as const,
  payouts: () => [...financialKeys.all, 'payouts'] as const,
  payoutList: (filters: FinancialFilters) => [...financialKeys.payouts(), filters] as const,
};

// -- API functions --

async function fetchFinancialSummary(): Promise<FinancialSummary> {
  const { data } = await api.get('/financial/summary');
  return data;
}

async function fetchPayouts(filters: FinancialFilters): Promise<PaginatedResponse<Payout>> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.status) params.set('status', filters.status);
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);

  const { data } = await api.get(`/financial/payouts?${params.toString()}`);
  return data;
}

// -- Hooks --

export function useFinancialSummary() {
  return useQuery({
    queryKey: financialKeys.summary(),
    queryFn: fetchFinancialSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePayouts(filters: FinancialFilters = {}) {
  return useQuery({
    queryKey: financialKeys.payoutList(filters),
    queryFn: () => fetchPayouts(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useFinancialExport() {
  async function exportPayouts(filters: FinancialFilters): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);

    const { data } = await api.get(`/financial/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return data;
  }

  return { exportPayouts };
}

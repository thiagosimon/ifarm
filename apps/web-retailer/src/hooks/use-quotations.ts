import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// -- Types --

export interface QuotationItem {
  productName: string;
  quantity: number;
  unit: string;
}

export interface Quotation {
  id: string;
  number: string;
  farmer: string;
  city: string;
  state: string;
  category: string;
  items: QuotationItem[];
  estimatedTotal: number;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export interface QuotationFilters {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  state?: string;
  search?: string;
}

export interface ProposalPayload {
  quotationId: string;
  items: {
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }[];
  deliveryDays: number;
  freightCost: number;
  paymentMethods: string[];
  notes?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// -- Query keys --

const quotationKeys = {
  all: ['quotations'] as const,
  lists: () => [...quotationKeys.all, 'list'] as const,
  list: (filters: QuotationFilters) => [...quotationKeys.lists(), filters] as const,
  details: () => [...quotationKeys.all, 'detail'] as const,
  detail: (id: string) => [...quotationKeys.details(), id] as const,
};

// -- API functions --

async function fetchQuotations(filters: QuotationFilters): Promise<PaginatedResponse<Quotation>> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.status) params.set('status', filters.status);
  if (filters.category) params.set('category', filters.category);
  if (filters.state) params.set('state', filters.state);
  if (filters.search) params.set('search', filters.search);

  const { data } = await api.get(`/quotations?${params.toString()}`);
  return data;
}

async function fetchQuotationById(id: string): Promise<Quotation> {
  const { data } = await api.get(`/quotations/${id}`);
  return data;
}

async function submitProposal(payload: ProposalPayload): Promise<void> {
  await api.post(`/quotations/${payload.quotationId}/proposals`, payload);
}

// -- Hooks --

export function useQuotations(filters: QuotationFilters = {}) {
  return useQuery({
    queryKey: quotationKeys.list(filters),
    queryFn: () => fetchQuotations(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useQuotation(id: string) {
  return useQuery({
    queryKey: quotationKeys.detail(id),
    queryFn: () => fetchQuotationById(id),
    enabled: !!id,
  });
}

export function useSubmitProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quotationKeys.all });
    },
  });
}

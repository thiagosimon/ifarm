import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// -- Types --

export type OrderStatus = 'preparing' | 'shipped' | 'delivered' | 'disputed';

export interface OrderItem {
  name: string;
  quantity: number;
  unit: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  farmer: string;
  city: string;
  state: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  trackingCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
}

export interface MarkShippedPayload {
  orderId: string;
  trackingCode: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// -- Query keys --

const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// -- API functions --

async function fetchOrders(filters: OrderFilters): Promise<PaginatedResponse<Order>> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.status) params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);

  const { data } = await api.get(`/orders?${params.toString()}`);
  return data;
}

async function fetchOrderById(id: string): Promise<Order> {
  const { data } = await api.get(`/orders/${id}`);
  return data;
}

async function markOrderShipped(payload: MarkShippedPayload): Promise<void> {
  await api.patch(`/orders/${payload.orderId}/ship`, {
    trackingCode: payload.trackingCode,
  });
}

// -- Hooks --

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => fetchOrders(filters),
    placeholderData: (previousData) => previousData,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
  });
}

export function useMarkShipped() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markOrderShipped,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

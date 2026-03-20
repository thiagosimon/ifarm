import { renderHook, act, waitFor } from '@testing-library/react';
import { useOrders } from '@/hooks/use-orders';

const mockOrders = [
  {
    id: 'order-1',
    orderNumber: 'PED-001',
    farmer: { id: 'f1', name: 'João Silva', company: 'Fazenda Norte' },
    retailer: { id: 'r1', name: 'Distribuidora Sul' },
    status: 'completed' as const,
    value: 45000,
    commission: 2250,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
    items: [],
    timeline: [],
  },
];

global.fetch = jest.fn();

describe('useOrders', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockOrders, total: 1 }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useOrders());
    expect(result.current.orders).toEqual([]);
    expect(result.current.search).toBe('');
    expect(result.current.statusFilter).toBe('all');
    expect(result.current.dateFrom).toBe('');
    expect(result.current.dateTo).toBe('');
  });

  it('should fetch orders on mount', async () => {
    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.orders).toEqual(mockOrders);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/orders')
    );
  });

  it('should update search state', () => {
    const { result } = renderHook(() => useOrders());
    act(() => result.current.setSearch('PED-001'));
    expect(result.current.search).toBe('PED-001');
  });

  it('should update statusFilter', () => {
    const { result } = renderHook(() => useOrders());
    act(() => result.current.setStatusFilter('completed'));
    expect(result.current.statusFilter).toBe('completed');
  });

  it('should update date range filters', () => {
    const { result } = renderHook(() => useOrders());
    act(() => {
      result.current.setDateFrom('2024-01-01');
      result.current.setDateTo('2024-12-31');
    });
    expect(result.current.dateFrom).toBe('2024-01-01');
    expect(result.current.dateTo).toBe('2024-12-31');
  });

  it('should call cancel order API', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockOrders, total: 1 }),
    });
    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.cancelOrder('order-1', 'Cliente solicitou cancelamento');
    });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/orders/order-1/cancel',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ reason: 'Cliente solicitou cancelamento' }),
      })
    );
  });

  it('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({}) });
    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('Erro ao buscar pedidos');
  });
});

import { renderHook, act, waitFor } from '@testing-library/react';
import { useRetailers } from '@/hooks/use-retailers';

const mockRetailers = [
  {
    id: '1',
    name: 'Agro Insumos Ltda',
    email: 'agro@example.com',
    cnpj: '98.765.432/0001-10',
    segment: 'insumos',
    region: 'Sudeste',
    status: 'active' as const,
    kycStatus: 'approved' as const,
    createdAt: '2024-02-01T10:00:00Z',
    totalOrders: 18,
    totalSpend: 320000,
  },
];

global.fetch = jest.fn();

describe('useRetailers', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockRetailers, total: 1 }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useRetailers());
    expect(result.current.retailers).toEqual([]);
    expect(result.current.search).toBe('');
    expect(result.current.statusFilter).toBe('all');
    expect(result.current.page).toBe(1);
  });

  it('should fetch retailers on mount', async () => {
    const { result } = renderHook(() => useRetailers());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.retailers).toEqual(mockRetailers);
  });

  it('should update search state', () => {
    const { result } = renderHook(() => useRetailers());
    act(() => {
      result.current.setSearch('Agro');
    });
    expect(result.current.search).toBe('Agro');
  });

  it('should update statusFilter', () => {
    const { result } = renderHook(() => useRetailers());
    act(() => {
      result.current.setStatusFilter('suspended');
    });
    expect(result.current.statusFilter).toBe('suspended');
  });

  it('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({}) });
    const { result } = renderHook(() => useRetailers());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeTruthy();
  });
});

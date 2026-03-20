import { renderHook, act, waitFor } from '@testing-library/react';
import { useFarmers } from '@/hooks/use-farmers';

const mockFarmers = [
  {
    id: '1',
    name: 'Fazenda Boa Vista',
    email: 'fazenda@example.com',
    cnpj: '12.345.678/0001-90',
    region: 'Centro-Oeste',
    state: 'GO',
    status: 'active' as const,
    kycStatus: 'approved' as const,
    createdAt: '2024-01-15T10:00:00Z',
    totalOrders: 42,
    totalGmv: 185000,
  },
];

global.fetch = jest.fn();

describe('useFarmers', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockFarmers, total: 1 }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFarmers());
    expect(result.current.farmers).toEqual([]);
    expect(result.current.search).toBe('');
    expect(result.current.statusFilter).toBe('all');
    expect(result.current.kycFilter).toBe('all');
    expect(result.current.page).toBe(1);
  });

  it('should fetch farmers on mount', async () => {
    const { result } = renderHook(() => useFarmers());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.farmers).toEqual(mockFarmers);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/farmers')
    );
  });

  it('should update search state', () => {
    const { result } = renderHook(() => useFarmers());
    act(() => {
      result.current.setSearch('Boa Vista');
    });
    expect(result.current.search).toBe('Boa Vista');
  });

  it('should update statusFilter', () => {
    const { result } = renderHook(() => useFarmers());
    act(() => {
      result.current.setStatusFilter('active');
    });
    expect(result.current.statusFilter).toBe('active');
  });

  it('should update kycFilter', () => {
    const { result } = renderHook(() => useFarmers());
    act(() => {
      result.current.setKycFilter('approved');
    });
    expect(result.current.kycFilter).toBe('approved');
  });

  it('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });
    const { result } = renderHook(() => useFarmers());
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBe('Erro ao buscar farmers');
  });

  it('should call approve KYC API', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockFarmers, total: 1 }),
    });
    const { result } = renderHook(() => useFarmers());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.approveFarmerKyc('1');
    });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/farmers/1/kyc/approve',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('should call reject KYC API with reason', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockFarmers, total: 1 }),
    });
    const { result } = renderHook(() => useFarmers());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.rejectFarmerKyc('1', 'Documents invalid');
    });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/farmers/1/kyc/reject',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ reason: 'Documents invalid' }),
      })
    );
  });
});

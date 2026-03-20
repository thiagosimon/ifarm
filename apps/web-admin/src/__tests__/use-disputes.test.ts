import { renderHook, act, waitFor } from '@testing-library/react';
import { useDisputes } from '@/hooks/use-disputes';

const mockDisputes = [
  {
    id: 'dispute-1',
    orderNumber: 'PED-001',
    farmer: { id: 'f1', name: 'João Silva', company: 'Fazenda Norte' },
    retailer: { id: 'r1', name: 'Distribuidora Sul' },
    reason: 'Produto com defeito',
    description: 'O produto chegou danificado.',
    status: 'open' as const,
    value: 15000,
    slaDays: 2,
    openedAt: '2024-03-05T10:00:00Z',
    messages: [],
  },
  {
    id: 'dispute-2',
    orderNumber: 'PED-002',
    farmer: { id: 'f2', name: 'Maria Souza', company: 'Agro Leste' },
    retailer: { id: 'r2', name: 'Insumos Norte' },
    reason: 'Entrega atrasada',
    description: 'Entrega 10 dias atrasada.',
    status: 'in_analysis' as const,
    value: 8000,
    slaDays: 5,
    openedAt: '2024-03-01T10:00:00Z',
    messages: [],
  },
];

global.fetch = jest.fn();

describe('useDisputes', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockDisputes, total: 2 }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useDisputes());
    expect(result.current.disputes).toEqual([]);
    expect(result.current.statusFilter).toBe('all');
    expect(result.current.error).toBeNull();
  });

  it('should fetch disputes on mount', async () => {
    const { result } = renderHook(() => useDisputes());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.disputes).toEqual(mockDisputes);
  });

  it('should calculate stats correctly', async () => {
    const { result } = renderHook(() => useDisputes());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stats.open).toBe(1);
    expect(result.current.stats.inAnalysis).toBe(1);
    expect(result.current.stats.resolved).toBe(0);
    expect(result.current.stats.totalValue).toBe(23000);
  });

  it('should update statusFilter', () => {
    const { result } = renderHook(() => useDisputes());
    act(() => result.current.setStatusFilter('open'));
    expect(result.current.statusFilter).toBe('open');
  });

  it('should call resolve dispute API', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockDisputes, total: 2 }),
    });
    const { result } = renderHook(() => useDisputes());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.resolveDispute('dispute-1', 'Reembolso aprovado', true);
    });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/disputes/dispute-1/resolve',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ resolution: 'Reembolso aprovado', favorFarmer: true }),
      })
    );
  });

  it('should call add message API', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockDisputes, total: 2 }),
    });
    const { result } = renderHook(() => useDisputes());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addMessage('dispute-1', 'Solicitando documentação adicional');
    });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/disputes/dispute-1/messages',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ message: 'Solicitando documentação adicional' }),
      })
    );
  });

  it('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({}) });
    const { result } = renderHook(() => useDisputes());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('Erro ao buscar disputas');
  });
});

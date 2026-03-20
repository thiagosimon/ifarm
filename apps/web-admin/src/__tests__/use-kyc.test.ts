import { renderHook, act, waitFor } from '@testing-library/react';
import { useKyc } from '@/hooks/use-kyc';

const mockKycEntries = [
  {
    id: 'kyc-1',
    number: 'KYC-001',
    userId: 'user-1',
    userName: 'Fazenda Norte',
    userEmail: 'fazenda@example.com',
    userType: 'farmer' as const,
    cnpj: '12.345.678/0001-90',
    submittedAt: '2024-03-01T10:00:00Z',
    waitDays: 3,
    documents: ['doc1.pdf', 'doc2.pdf'],
    status: 'pending' as const,
  },
  {
    id: 'kyc-2',
    number: 'KYC-002',
    userId: 'user-2',
    userName: 'Distribuidora Sul',
    userEmail: 'dist@example.com',
    userType: 'retailer' as const,
    cnpj: '98.765.432/0001-10',
    submittedAt: '2024-02-28T10:00:00Z',
    waitDays: 5,
    documents: ['doc3.pdf'],
    status: 'pending' as const,
  },
];

global.fetch = jest.fn();

describe('useKyc', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockKycEntries, total: 2 }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useKyc());
    expect(result.current.queue).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should fetch KYC queue on mount', async () => {
    const { result } = renderHook(() => useKyc());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.queue).toEqual(mockKycEntries);
  });

  it('should calculate stats correctly', async () => {
    const { result } = renderHook(() => useKyc());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stats.pending).toBe(2);
    expect(result.current.stats.totalDocuments).toBe(3);
    expect(result.current.stats.oldestDays).toBe(5);
  });

  it('should call approve KYC API', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockKycEntries, total: 2 }),
    });
    const { result } = renderHook(() => useKyc());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.approveKyc('kyc-1');
    });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/kyc/kyc-1/approve',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('should call reject KYC API with reason', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ items: mockKycEntries, total: 2 }),
    });
    const { result } = renderHook(() => useKyc());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.rejectKyc('kyc-2', 'CNPJ inválido');
    });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/kyc/kyc-2/reject',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ reason: 'CNPJ inválido' }),
      })
    );
  });

  it('should handle fetch error', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false, json: async () => ({}) });
    const { result } = renderHook(() => useKyc());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('Erro ao buscar fila KYC');
  });
});

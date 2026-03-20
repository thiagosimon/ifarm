import { renderHook, act, waitFor } from '@testing-library/react';
import { useFinancial } from '@/hooks/use-financial';

const mockMetrics = {
  gmvTotal: 1250000,
  commissions: 62500,
  payoutsProcessed: 980000,
  payoutsPending: 270000,
  gmvGrowth: 12.5,
  commissionsGrowth: 8.3,
};

const mockGmvData = [
  { date: '2024-03-01', gmv: 45000, commission: 2250 },
  { date: '2024-03-02', gmv: 52000, commission: 2600 },
];

const mockTiers = [
  { tier: 'Bronze', value: 420000, percentage: 34 },
  { tier: 'Prata', value: 380000, percentage: 30 },
];

const mockPayouts = [
  {
    id: 'pay-1',
    farmer: 'Fazenda Norte',
    farmerId: 'f1',
    amount: 38500,
    status: 'paid' as const,
    date: '2024-03-10T10:00:00Z',
    transactionId: 'TXN-001',
  },
];

global.fetch = jest.fn();

describe('useFinancial', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/metrics')) return Promise.resolve({ ok: true, json: async () => mockMetrics });
      if (url.includes('/gmv')) return Promise.resolve({ ok: true, json: async () => mockGmvData });
      if (url.includes('/commission-tiers')) return Promise.resolve({ ok: true, json: async () => mockTiers });
      if (url.includes('/payouts')) return Promise.resolve({ ok: true, json: async () => ({ items: mockPayouts }) });
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useFinancial());
    expect(result.current.metrics).toBeNull();
    expect(result.current.gmvData).toEqual([]);
    expect(result.current.payouts).toEqual([]);
    expect(result.current.dateFrom).toBe('');
    expect(result.current.dateTo).toBe('');
  });

  it('should fetch all financial data on mount', async () => {
    const { result } = renderHook(() => useFinancial());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.metrics).toEqual(mockMetrics);
    expect(result.current.gmvData).toEqual(mockGmvData);
    expect(result.current.commissionTiers).toEqual(mockTiers);
    expect(result.current.payouts).toEqual(mockPayouts);
  });

  it('should update dateFrom and dateTo', () => {
    const { result } = renderHook(() => useFinancial());
    act(() => result.current.setDateFrom('2024-01-01'));
    act(() => result.current.setDateTo('2024-03-31'));
    expect(result.current.dateFrom).toBe('2024-01-01');
    expect(result.current.dateTo).toBe('2024-03-31');
  });

  it('should handle partial fetch failures gracefully', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/metrics')) return Promise.resolve({ ok: false, json: async () => null });
      if (url.includes('/gmv')) return Promise.resolve({ ok: true, json: async () => [] });
      if (url.includes('/commission-tiers')) return Promise.resolve({ ok: true, json: async () => [] });
      if (url.includes('/payouts')) return Promise.resolve({ ok: true, json: async () => ({ items: [] }) });
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
    const { result } = renderHook(() => useFinancial());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.metrics).toBeNull();
    expect(result.current.gmvData).toEqual([]);
  });
});

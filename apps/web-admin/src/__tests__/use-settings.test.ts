import { renderHook, act, waitFor } from '@testing-library/react';
import { useSettings } from '@/hooks/use-settings';

const mockTiers = [
  { id: 'tier-1', name: 'Bronze', rate: 5, minGmv: 0, maxGmv: 100000 },
  { id: 'tier-2', name: 'Prata', rate: 4.5, minGmv: 100001, maxGmv: 500000 },
  { id: 'tier-3', name: 'Ouro', rate: 4, minGmv: 500001, maxGmv: null },
];

const mockSettings = {
  holdbackDays: 7,
  defaultServiceFee: 5,
  maxSimultaneousQuotes: 5,
  disputeSlaBusinessDays: 10,
  minOrderValue: 500,
  maxCommissionRate: 8,
  enabledStates: ['SP', 'MG', 'GO', 'MT', 'MS'],
};

global.fetch = jest.fn();

describe('useSettings', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/commission-tiers')) {
        return Promise.resolve({ ok: true, json: async () => mockTiers });
      }
      if (url.includes('/system')) {
        return Promise.resolve({ ok: true, json: async () => mockSettings });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.tiers).toEqual([]);
    expect(result.current.settings).toBeNull();
    expect(result.current.isSaving).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch tiers and settings on mount', async () => {
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.tiers).toEqual(mockTiers);
    expect(result.current.settings).toEqual(mockSettings);
  });

  it('should call update tier API', async () => {
    (global.fetch as jest.Mock).mockImplementation((url: string, options?: RequestInit) => {
      if (url.includes('/commission-tiers') && (!options || options.method !== 'PATCH')) {
        return Promise.resolve({ ok: true, json: async () => mockTiers });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateTier('tier-1', { rate: 4.8 });
    });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/settings/commission-tiers/tier-1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ rate: 4.8 }),
      })
    );
  });

  it('should call update settings API', async () => {
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.updateSettings({ holdbackDays: 5 });
    });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/v1/settings/system',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ holdbackDays: 5 }),
      })
    );
  });

  it('should toggle state on/off', async () => {
    const { result } = renderHook(() => useSettings());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Toggle off an enabled state
    act(() => result.current.toggleState('SP'));
    expect(result.current.settings?.enabledStates).not.toContain('SP');

    // Toggle on a disabled state
    act(() => result.current.toggleState('RJ'));
    expect(result.current.settings?.enabledStates).toContain('RJ');
  });

  it('should not toggle state if settings is null', () => {
    const { result } = renderHook(() => useSettings());
    // Before fetch resolves, settings is null - toggleState should be a no-op
    act(() => result.current.toggleState('SP'));
    expect(result.current.settings).toBeNull();
  });
});

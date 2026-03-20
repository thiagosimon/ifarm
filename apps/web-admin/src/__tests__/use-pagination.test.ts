import { renderHook, act } from '@testing-library/react';
import { usePagination } from '@/hooks/use-pagination';

describe('usePagination', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(20);
    expect(result.current.offset).toBe(0);
    expect(result.current.totalItems).toBe(0);
  });

  it('should initialize with custom values', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 2, initialLimit: 10 }));
    expect(result.current.page).toBe(2);
    expect(result.current.limit).toBe(10);
  });

  it('should set page correctly', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setPage(3);
    });
    expect(result.current.page).toBe(3);
    expect(result.current.offset).toBe(40);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setTotalItems(100);
    });
    act(() => {
      result.current.nextPage();
    });
    expect(result.current.page).toBe(2);
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 3 }));
    act(() => {
      result.current.prevPage();
    });
    expect(result.current.page).toBe(2);
  });

  it('should not go below page 1', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.prevPage();
    });
    expect(result.current.page).toBe(1);
  });

  it('should calculate totalPages correctly', () => {
    const { result } = renderHook(() => usePagination({ initialLimit: 10 }));
    act(() => {
      result.current.setTotalItems(55);
    });
    expect(result.current.totalPages).toBe(6);
  });

  it('should reset to initial values', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setPage(5);
      result.current.setLimit(50);
    });
    act(() => {
      result.current.reset();
    });
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(20);
  });

  it('should goToPage correctly', () => {
    const { result } = renderHook(() => usePagination());
    act(() => {
      result.current.setTotalItems(100);
    });
    act(() => {
      result.current.goToPage(4);
    });
    expect(result.current.page).toBe(4);
  });
});

import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/use-debounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    rerender({ value: 'updated', delay: 300 });
    expect(result.current).toBe('initial');

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('updated');
  });

  it('should only update after the delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 500 } }
    );

    rerender({ value: 'second', delay: 500 });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('first');

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('second');
  });

  it('should use last value when updated multiple times within delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 300 } }
    );

    rerender({ value: 'b', delay: 300 });
    act(() => jest.advanceTimersByTime(100));
    rerender({ value: 'c', delay: 300 });
    act(() => jest.advanceTimersByTime(100));
    rerender({ value: 'd', delay: 300 });

    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe('d');
  });
});

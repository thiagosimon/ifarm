import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  itemsPerPage?: number;
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  offset: number;
  totalItems: number;
  totalPages: number;
  setPage: (page: number) => void;
  goToPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setTotalItems: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
}

export function usePagination({
  initialPage = 1,
  initialLimit = 20,
  itemsPerPage,
}: UsePaginationOptions = {}): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(itemsPerPage ?? initialLimit);
  const [totalItems, setTotalItems] = useState(0);

  const offset = (page - 1) * limit;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const goToPage = useCallback((p: number) => {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(itemsPerPage ?? initialLimit);
  }, [initialPage, initialLimit, itemsPerPage]);

  return {
    page,
    limit,
    offset,
    totalItems,
    totalPages,
    setPage,
    goToPage,
    setLimit,
    setTotalItems,
    nextPage,
    prevPage,
    reset,
  };
}

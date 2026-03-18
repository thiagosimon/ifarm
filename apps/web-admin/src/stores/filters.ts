import { create } from 'zustand';

interface FiltersState {
  search: string;
  status: string;
  kycStatus: string;
  dateFrom: string;
  dateTo: string;
  page: number;
  limit: number;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setKycStatus: (kycStatus: string) => void;
  setDateFrom: (dateFrom: string) => void;
  setDateTo: (dateTo: string) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  reset: () => void;
}

const initialState = {
  search: '',
  status: 'all',
  kycStatus: 'all',
  dateFrom: '',
  dateTo: '',
  page: 1,
  limit: 20,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search, page: 1 }),
  setStatus: (status) => set({ status, page: 1 }),
  setKycStatus: (kycStatus) => set({ kycStatus, page: 1 }),
  setDateFrom: (dateFrom) => set({ dateFrom, page: 1 }),
  setDateTo: (dateTo) => set({ dateTo, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  reset: () => set(initialState),
}));

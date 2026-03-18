import { create } from 'zustand';

export type QuotationStatus = 'pending' | 'responded' | 'expired' | 'accepted' | 'rejected';

export interface QuotationItem {
  productName: string;
  quantity: number;
  unit: string;
}

export interface Quotation {
  id: string;
  number: string;
  farmer: string;
  city: string;
  state: string;
  category: string;
  items: QuotationItem[];
  estimatedTotal: number;
  status: QuotationStatus;
  createdAt: string;
  expiresAt: string;
}

interface QuotationFilters {
  search: string;
  status: string;
  category: string;
  state: string;
}

interface QuotationState {
  quotations: Quotation[];
  filters: QuotationFilters;
  selectedQuotation: Quotation | null;
  isProposalSheetOpen: boolean;

  setQuotations: (quotations: Quotation[]) => void;
  setFilters: (filters: Partial<QuotationFilters>) => void;
  resetFilters: () => void;
  setSelectedQuotation: (quotation: Quotation | null) => void;
  setProposalSheetOpen: (open: boolean) => void;
  updateQuotationStatus: (id: string, status: QuotationStatus) => void;
}

const defaultFilters: QuotationFilters = {
  search: '',
  status: '',
  category: '',
  state: '',
};

export const useQuotationStore = create<QuotationState>()((set) => ({
  quotations: [],
  filters: { ...defaultFilters },
  selectedQuotation: null,
  isProposalSheetOpen: false,

  setQuotations: (quotations) => set({ quotations }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
  setSelectedQuotation: (quotation) => set({ selectedQuotation: quotation }),
  setProposalSheetOpen: (open) => set({ isProposalSheetOpen: open }),
  updateQuotationStatus: (id, status) =>
    set((state) => ({
      quotations: state.quotations.map((q) =>
        q.id === id ? { ...q, status } : q
      ),
    })),
}));

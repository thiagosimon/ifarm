import { create } from 'zustand';

export type ModalType =
  | 'kyc-approve'
  | 'kyc-reject'
  | 'user-suspend'
  | 'user-detail'
  | 'order-cancel'
  | 'order-timeline'
  | 'dispute-resolve'
  | 'dispute-detail'
  | 'tier-edit'
  | null;

interface ModalState {
  type: ModalType;
  data: Record<string, unknown>;
  open: (type: ModalType, data?: Record<string, unknown>) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  type: null,
  data: {},
  open: (type, data = {}) => set({ type, data }),
  close: () => set({ type: null, data: {} }),
}));

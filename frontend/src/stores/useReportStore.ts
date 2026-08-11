import { create } from 'zustand';

export type ReportItemType = 'chart' | 'table' | 'sql' | 'insight' | 'diagram';

export interface ReportItem {
  id: string;
  type: ReportItemType;
  title: string;
  content: any;
  metadata?: any;
}

interface ReportState {
  items: ReportItem[];
  addItem: (item: ReportItem) => void;
  removeItem: (id: string) => void;
  clearReport: () => void;
  reorderItems: (items: ReportItem[]) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
  clearReport: () => set({ items: [] }),
  reorderItems: (items) => set({ items }),
}));

import { create } from 'zustand';
import { Report } from './types';

interface ReportState {
  currentReport: Report | null;
  loading: boolean;
  error: string | null;
  setCurrentReport: (report: Report) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearReport: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  currentReport: null,
  loading: false,
  error: null,
  setCurrentReport: (report) => set({ currentReport: report }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearReport: () => set({ currentReport: null, error: null })
}));
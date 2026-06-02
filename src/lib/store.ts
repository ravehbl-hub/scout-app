import { create } from 'zustand';
import type { SearchFilters, Property, AreaAnalysis } from '@/types';

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  city: '',
  street: '',
  builtAreaMin: 0,
  builtAreaMax: 2000,
  apartmentAreaMin: 0,
  apartmentAreaMax: 2000,
  priceMin: 0,
  priceMax: 20000000,
  roomsMin: 1,
  roomsMax: 6,
  propertyTypes: [],
  advertisers: [],
  handType: null,
  features: [],
  floorMin: -1,
  floorMax: 20,
  entryDateFrom: '',
  conditions: [],
  adFeatures: [],
  sources: ['yad2', 'madlan', 'kones2', 'facebook', 'agent'],
};

interface AppState {
  filters: SearchFilters;
  results: Property[];
  isLoading: boolean;
  error: string | null;
  selectedProperty: Property | null;
  showFilters: boolean;
  analysis: AreaAnalysis | null;
  isAnalyzing: boolean;
  analysisError: string | null;
  analysisCity: string;

  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  resetFilters: () => void;
  search: () => Promise<void>;
  setSelectedProperty: (p: Property | null) => void;
  setShowFilters: (v: boolean) => void;
  analyzeArea: (city: string) => Promise<void>;
  setAnalysisCity: (city: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  filters: DEFAULT_FILTERS,
  results: [],
  isLoading: false,
  error: null,
  selectedProperty: null,
  showFilters: false,
  analysis: null,
  isAnalyzing: false,
  analysisError: null,
  analysisCity: '',

  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  search: async () => {
    const { filters } = get();
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          if (v.length > 0) params.append(k, v.join(','));
        } else if (v !== null && v !== '' && v !== undefined) {
          params.append(k, String(v));
        }
      });
      const res = await fetch(`/api/search?${params.toString()}`);
      if (!res.ok) throw new Error('שגיאה בחיפוש');
      const data = await res.json();
      set({ results: data.properties ?? [], isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  setSelectedProperty: (p) => set({ selectedProperty: p }),

  setShowFilters: (v) => set({ showFilters: v }),

  analyzeArea: async (city: string) => {
    set({ isAnalyzing: true, analysis: null, analysisError: null, analysisCity: city });
    try {
      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });
      // Always read the body — even on error it contains a useful message
      const data = await res.json();
      if (!res.ok) {
        set({ isAnalyzing: false, analysisError: data.error ?? 'שגיאה בניתוח' });
        return;
      }
      set({ analysis: data.analysis, isAnalyzing: false });
    } catch (e) {
      set({ isAnalyzing: false, analysisError: (e as Error).message });
    }
  },

  setAnalysisCity: (city) => set({ analysisCity: city }),
}));

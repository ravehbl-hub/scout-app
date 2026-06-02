'use client';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function SearchBar() {
  const { filters, setFilter, search, isLoading, showFilters, setShowFilters, resetFilters } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          placeholder="חפש עיר, שכונה, רחוב..."
          value={filters.query}
          onChange={(e) => setFilter('query', e.target.value)}
          className="w-full pr-9 pl-4 py-3 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
          dir="rtl"
        />
        {filters.query && (
          <button
            type="button"
            onClick={() => setFilter('query', '')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="relative p-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4 text-gray-600" />
        {/* dot indicator when filters are active */}
        {(filters.city || filters.propertyTypes.length > 0 || filters.features.length > 0) && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </button>

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 transition-colors whitespace-nowrap"
      >
        {isLoading ? '...' : 'חפש'}
      </button>

      {(filters.city || filters.propertyTypes.length > 0 || filters.features.length > 0 || filters.priceMax < 20000000) && (
        <button
          type="button"
          onClick={resetFilters}
          className="p-3 rounded-xl border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          title="אפס מסננים"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}

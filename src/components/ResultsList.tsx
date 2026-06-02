'use client';
import { useAppStore } from '@/lib/store';
import PropertyCard from '@/components/PropertyCard';
import { Loader2, SearchX } from 'lucide-react';

export default function ResultsList() {
  const { results, isLoading, error, setSelectedProperty } = useAppStore();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blue-500 gap-3">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-sm font-medium text-gray-500">מחפש נכסים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-2">
        <SearchX className="w-10 h-10" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
        <span className="text-6xl">🏠</span>
        <p className="text-base font-medium">חפש נכסים להתחיל</p>
        <p className="text-sm text-gray-300">השתמש בחיפוש ובמסננים</p>
      </div>
    );
  }

  return (
    <div dir="rtl">
      <p className="text-xs text-gray-400 mb-3">{results.length} נכסים נמצאו</p>
      {/* 1 col mobile → 2 col tablet → 3 col large desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((p) => (
          <PropertyCard key={p.id} property={p} onClick={() => setSelectedProperty(p)} />
        ))}
      </div>
    </div>
  );
}

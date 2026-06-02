'use client';
import { useAppStore } from '@/lib/store';
import PropertyCard from '@/components/PropertyCard';
import { Loader2, SearchX } from 'lucide-react';

export default function ResultsList() {
  const { results, isLoading, error, setSelectedProperty } = useAppStore();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-blue-500 gap-3">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-sm font-medium text-gray-500">מחפש נכסים...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-500 gap-2">
        <SearchX className="w-10 h-10" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
        <span className="text-5xl">🏠</span>
        <p className="text-sm font-medium">חפש נכסים להתחיל</p>
        <p className="text-xs text-gray-300">השתמש בחיפוש ובמסננים למעלה</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3 text-right">{results.length} נכסים נמצאו</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {results.map((p) => (
          <PropertyCard key={p.id} property={p} onClick={() => setSelectedProperty(p)} />
        ))}
      </div>
    </div>
  );
}

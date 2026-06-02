'use client';
import { useAppStore } from '@/lib/store';
import PropertyCard from '@/components/PropertyCard';
import { Loader2, SearchX } from 'lucide-react';

function isLinkCard(id: string) {
  return id.endsWith('-link');
}

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
        <p className="text-sm text-gray-300">הכנס עיר ולחץ חפש</p>
      </div>
    );
  }

  const linkCards = results.filter((p) => isLinkCard(p.id));
  const realCards = results.filter((p) => !isLinkCard(p.id));

  return (
    <div dir="rtl" className="space-y-6">
      {/* Real property listings */}
      {realCards.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-3">{realCards.length} נכסים נמצאו</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {realCards.map((p) => (
              <PropertyCard key={p.id} property={p} onClick={() => setSelectedProperty(p)} />
            ))}
          </div>
        </div>
      )}

      {/* Source link cards */}
      {linkCards.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-3">
            {realCards.length > 0 ? 'חפש גם ב:' : 'חפש ישירות במקורות:'}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {linkCards.map((p) => (
              <PropertyCard key={p.id} property={p} onClick={() => {}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

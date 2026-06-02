import type { Property, SearchFilters } from '@/types';

function buildUrl(filters: SearchFilters): string {
  const p = new URLSearchParams();
  if (filters.city) p.set('q', filters.city);
  if (filters.priceMin > 0) p.set('price_from', String(filters.priceMin));
  if (filters.priceMax < 20000000) p.set('price_to', String(filters.priceMax));
  if (filters.roomsMin > 1) p.set('rooms_from', String(filters.roomsMin));
  if (filters.roomsMax < 6) p.set('rooms_to', String(filters.roomsMax));
  return `https://www.kones2.co.il/results/?${p.toString()}`;
}

export async function searchKones2(filters: SearchFilters): Promise<Property[]> {
  return [
    {
      id: 'kones2-link',
      source: 'kones2',
      sourceUrl: buildUrl(filters),
      title: filters.city ? `כנס2 — ${filters.city}` : 'כנס2',
      price: null, rooms: null, floor: null, totalFloors: null,
      builtArea: null, apartmentArea: null,
      address: filters.city ?? '', city: filters.city ?? '',
      street: '', neighborhood: '',
      propertyType: 'general', features: [], condition: null,
      advertiserType: null, handType: null,
      description: 'חיפוש ישיר בכנס2 עם הפילטרים שנבחרו',
      images: [], publishedAt: '', priceDecreased: false,
      agentName: null, agentPhone: null,
    },
  ];
}

import type { Property, SearchFilters } from '@/types';

function buildUrl(filters: SearchFilters): string {
  const p = new URLSearchParams();
  if (filters.city) p.set('city', filters.city);
  if (filters.priceMin > 0) p.set('price', String(filters.priceMin));
  if (filters.priceMax < 20000000) p.set('price_max', String(filters.priceMax));
  if (filters.roomsMin > 1) p.set('rooms', String(filters.roomsMin));
  if (filters.roomsMax < 6) p.set('rooms_max', String(filters.roomsMax));
  if (filters.apartmentAreaMin > 0) p.set('squaremeter', String(filters.apartmentAreaMin));
  if (filters.apartmentAreaMax < 2000) p.set('squaremeter_max', String(filters.apartmentAreaMax));
  const qs = p.toString();
  return `https://www.yad2.co.il/realestate/forsale${qs ? `?${qs}` : ''}`;
}

export async function searchYad2(filters: SearchFilters): Promise<Property[]> {
  return [
    {
      id: 'yad2-link',
      source: 'yad2',
      sourceUrl: buildUrl(filters),
      title: filters.city ? `יד2 — ${filters.city}` : 'יד2',
      price: null, rooms: null, floor: null, totalFloors: null,
      builtArea: null, apartmentArea: null,
      address: filters.city ?? '', city: filters.city ?? '',
      street: '', neighborhood: '',
      propertyType: 'general', features: [], condition: null,
      advertiserType: null, handType: null,
      description: 'חיפוש ישיר ביד2 עם הפילטרים שנבחרו',
      images: [], publishedAt: '', priceDecreased: false,
      agentName: null, agentPhone: null,
    },
  ];
}

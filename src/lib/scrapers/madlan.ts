import type { Property, SearchFilters } from '@/types';

function buildUrl(filters: SearchFilters): string {
  const city = filters.city ? encodeURIComponent(filters.city) : '';
  const p = new URLSearchParams();
  p.set('listing_type', 'for_sale');
  if (filters.roomsMin > 1) p.set('rooms_min', String(filters.roomsMin));
  if (filters.roomsMax < 6) p.set('rooms_max', String(filters.roomsMax));
  if (filters.priceMin > 0) p.set('price_min', String(filters.priceMin));
  if (filters.priceMax < 20000000) p.set('price_max', String(filters.priceMax));
  const base = city
    ? `https://www.madlan.co.il/properties/${city}`
    : 'https://www.madlan.co.il/properties';
  return `${base}?${p.toString()}`;
}

export async function searchMadlan(filters: SearchFilters): Promise<Property[]> {
  return [
    {
      id: 'madlan-link',
      source: 'madlan',
      sourceUrl: buildUrl(filters),
      title: filters.city ? `מדלן — ${filters.city}` : 'מדלן',
      price: null, rooms: null, floor: null, totalFloors: null,
      builtArea: null, apartmentArea: null,
      address: filters.city ?? '', city: filters.city ?? '',
      street: '', neighborhood: '',
      propertyType: 'general', features: [], condition: null,
      advertiserType: null, handType: null,
      description: 'חיפוש ישיר במדלן עם הפילטרים שנבחרו',
      images: [], publishedAt: '', priceDecreased: false,
      agentName: null, agentPhone: null,
    },
  ];
}

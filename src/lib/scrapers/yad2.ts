import axios from 'axios';
import type { Property, SearchFilters } from '@/types';

function buildSearchUrl(filters: SearchFilters): string {
  const p = new URLSearchParams();
  if (filters.city) p.set('city', filters.city);
  if (filters.priceMin > 0) p.set('price', String(filters.priceMin));
  if (filters.priceMax < 20000000) p.set('price_max', String(filters.priceMax));
  if (filters.roomsMin > 1) p.set('rooms', String(filters.roomsMin));
  if (filters.roomsMax < 6) p.set('rooms_max', String(filters.roomsMax));
  const qs = p.toString();
  return `https://www.yad2.co.il/realestate/forsale${qs ? `?${qs}` : ''}`;
}

function linkCard(filters: SearchFilters): Property {
  return {
    id: 'yad2-link',
    source: 'yad2',
    sourceUrl: buildSearchUrl(filters),
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
  };
}

function mapType(cat: number): Property['propertyType'] {
  const m: Record<number, Property['propertyType']> = {
    1: 'apartment', 3: 'garden_apartment', 4: 'penthouse', 5: 'duplex',
    6: 'triplex', 7: 'studio_loft', 25: 'basement', 9: 'private_house',
    10: 'two_family', 11: 'farm', 14: 'plot', 16: 'residential_building',
    17: 'senior_housing', 19: 'housing_unit', 32: 'tourism',
  };
  return m[cat] ?? 'general';
}

async function fetchViaProxy(filters: SearchFilters): Promise<Property[]> {
  const apiParams = new URLSearchParams({ mainCategory: '1', subCategory: '1' });
  if (filters.city) apiParams.set('city', filters.city);
  if (filters.priceMin > 0) apiParams.set('price', String(filters.priceMin));
  if (filters.priceMax < 20000000) apiParams.set('price_max', String(filters.priceMax));
  if (filters.roomsMin > 1) apiParams.set('rooms', String(filters.roomsMin));
  if (filters.roomsMax < 6) apiParams.set('rooms_max', String(filters.roomsMax));

  const target = `https://gw.yad2.co.il/feed-search-legacy/realestate/forsale?${apiParams}`;

  // Route through allorigins — a free CORS proxy using different IPs than Vercel
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
  const res = await axios.get(proxyUrl, {
    headers: { Accept: 'application/json' },
    timeout: 7000,
  });

  const feed: Record<string, unknown>[] = res.data?.data?.feed?.feed_items ?? [];
  if (feed.length === 0) return [];

  return feed.filter((item) => item.id).map((item) => ({
    id: `yad2-${item.id}`,
    source: 'yad2' as const,
    sourceUrl: `https://www.yad2.co.il/item/${item.id}`,
    title: String(item.title ?? ''),
    price: item.price ? Number(item.price) : null,
    rooms: item.rooms ? Number(item.rooms) : null,
    floor: item.floor != null ? Number(item.floor) : null,
    totalFloors: item.floors != null ? Number(item.floors) : null,
    builtArea: item.square_meters ? Number(item.square_meters) : null,
    apartmentArea: item.square_meters ? Number(item.square_meters) : null,
    address: String(item.address ?? ''),
    city: String(item.city ?? filters.city ?? ''),
    street: String(item.street ?? ''),
    neighborhood: String(item.neighborhood ?? ''),
    propertyType: mapType(Number(item.category_id)),
    features: [],
    condition: null,
    advertiserType: item.is_agency === 1 ? 'broker' as const : null,
    handType: null,
    description: String(item.info_text ?? ''),
    images: (Array.isArray(item.images) ? item.images : [])
      .map((img: { src: string }) => img.src),
    publishedAt: String(item.date ?? ''),
    priceDecreased: !!item.price_dropped,
    agentName: item.contact_name ? String(item.contact_name) : null,
    agentPhone: item.phone ? String(item.phone) : null,
  }));
}

export async function searchYad2(filters: SearchFilters): Promise<Property[]> {
  try {
    const results = await fetchViaProxy(filters);
    return results.length > 0 ? results : [linkCard(filters)];
  } catch {
    return [linkCard(filters)];
  }
}

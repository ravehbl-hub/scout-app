import axios from 'axios';
import type { Property, SearchFilters } from '@/types';

function buildSearchUrl(filters: SearchFilters): string {
  const city = filters.city ? encodeURIComponent(filters.city) : '';
  const p = new URLSearchParams({ listing_type: 'for_sale' });
  if (filters.roomsMin > 1) p.set('rooms_min', String(filters.roomsMin));
  if (filters.roomsMax < 6) p.set('rooms_max', String(filters.roomsMax));
  if (filters.priceMin > 0) p.set('price_min', String(filters.priceMin));
  if (filters.priceMax < 20000000) p.set('price_max', String(filters.priceMax));
  const base = city
    ? `https://www.madlan.co.il/properties/${city}`
    : 'https://www.madlan.co.il/properties';
  return `${base}?${p}`;
}

function linkCard(filters: SearchFilters): Property {
  return {
    id: 'madlan-link',
    source: 'madlan',
    sourceUrl: buildSearchUrl(filters),
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
  };
}

function mapType(t: string): Property['propertyType'] {
  const m: Record<string, Property['propertyType']> = {
    APARTMENT: 'apartment', GARDEN_APARTMENT: 'garden_apartment',
    PENTHOUSE: 'penthouse', DUPLEX: 'duplex', PRIVATE_HOUSE: 'private_house',
    TWO_FAMILY: 'two_family', PLOT: 'plot', STUDIO: 'studio_loft',
  };
  return m[t] ?? 'general';
}

const QUERY = `
query SearchListings($filters: ListingFiltersInput, $pagination: PaginationInput) {
  listings(filters: $filters, pagination: $pagination) {
    items {
      id title price rooms floor totalFloors size
      address { street city neighborhood }
      propertyType images { url } publishedAt description
      agency { name phone } priceDropped
    }
  }
}`;

async function fetchFromApi(filters: SearchFilters): Promise<Property[]> {
  const variables = {
    filters: {
      city: filters.city || undefined,
      priceMin: filters.priceMin > 0 ? filters.priceMin : undefined,
      priceMax: filters.priceMax < 20000000 ? filters.priceMax : undefined,
      roomsMin: filters.roomsMin > 1 ? filters.roomsMin : undefined,
      roomsMax: filters.roomsMax < 6 ? filters.roomsMax : undefined,
    },
    pagination: { page: 1, pageSize: 40 },
  };

  const target = 'https://www.madlan.co.il/api/graphql';
  const body = JSON.stringify({ query: QUERY, variables });

  // Route through allorigins proxy
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`;
  const res = await axios.post(proxyUrl, body, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 7000,
  });

  const listings: Record<string, unknown>[] = res.data?.data?.listings?.items ?? [];
  if (listings.length === 0) return [];

  return listings.map((item) => {
    const addr = item.address as Record<string, string> | null;
    const agency = item.agency as Record<string, string> | null;
    return {
      id: `madlan-${item.id}`,
      source: 'madlan' as const,
      sourceUrl: `https://www.madlan.co.il/listing/${item.id}`,
      title: String(item.title ?? ''),
      price: item.price ? Number(item.price) : null,
      rooms: item.rooms ? Number(item.rooms) : null,
      floor: item.floor ? Number(item.floor) : null,
      totalFloors: item.totalFloors ? Number(item.totalFloors) : null,
      builtArea: item.size ? Number(item.size) : null,
      apartmentArea: item.size ? Number(item.size) : null,
      address: [addr?.street, addr?.city].filter(Boolean).join(', '),
      city: addr?.city ?? filters.city ?? '',
      street: addr?.street ?? '',
      neighborhood: addr?.neighborhood ?? '',
      propertyType: mapType(String(item.propertyType ?? '')),
      features: [],
      condition: null,
      advertiserType: agency ? 'broker' as const : null,
      handType: null,
      description: String(item.description ?? ''),
      images: (Array.isArray(item.images) ? item.images : [])
        .map((img: { url: string }) => img.url),
      publishedAt: String(item.publishedAt ?? ''),
      priceDecreased: !!item.priceDropped,
      agentName: agency?.name ?? null,
      agentPhone: agency?.phone ?? null,
    };
  });
}

export async function searchMadlan(filters: SearchFilters): Promise<Property[]> {
  try {
    const results = await fetchFromApi(filters);
    return results.length > 0 ? results : [linkCard(filters)];
  } catch {
    return [linkCard(filters)];
  }
}

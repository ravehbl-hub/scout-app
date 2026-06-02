import axios from 'axios';
import type { Property, SearchFilters } from '@/types';

const API = 'https://gw.yad2.co.il/feed-search-legacy/realestate/forsale';

function buildUrl(filters: SearchFilters): string {
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

async function fetchFromApi(filters: SearchFilters): Promise<Property[]> {
  const params: Record<string, string | number> = { mainCategory: 1, subCategory: 1 };
  if (filters.city) params['city'] = filters.city;
  if (filters.street) params['street'] = filters.street;
  if (filters.priceMin > 0) params['price'] = filters.priceMin;
  if (filters.priceMax < 20000000) params['price_max'] = filters.priceMax;
  if (filters.roomsMin > 1) params['rooms'] = filters.roomsMin;
  if (filters.roomsMax < 6) params['rooms_max'] = filters.roomsMax;
  if (filters.apartmentAreaMin > 0) params['squaremeter'] = filters.apartmentAreaMin;

  const res = await axios.get(API, {
    params,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'he-IL,he;q=0.9',
      'Referer': 'https://www.yad2.co.il/',
      'Origin': 'https://www.yad2.co.il',
    },
    timeout: 3000,
  });

  const feed: Record<string, unknown>[] = res.data?.data?.feed?.feed_items ?? [];
  if (feed.length === 0) return [linkCard(filters)];

  return feed
    .filter((item) => item.id)
    .map((item) => ({
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
  // Race the API against a 3.2s timeout — always return at least the link card
  const timeoutLink = new Promise<Property[]>((resolve) =>
    setTimeout(() => resolve([linkCard(filters)]), 3200)
  );
  try {
    const result = await Promise.race([fetchFromApi(filters), timeoutLink]);
    // If API returned empty, ensure link card is included
    return result.length > 0 ? result : [linkCard(filters)];
  } catch {
    return [linkCard(filters)];
  }
}

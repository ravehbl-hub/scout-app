import axios from 'axios';
import type { Property, SearchFilters } from '@/types';

const BASE = 'https://gw.yad2.co.il/feed-search-legacy/realestate/forsale';

function mapType(cat: number): Property['propertyType'] {
  const map: Record<number, Property['propertyType']> = {
    1: 'apartment',
    3: 'garden_apartment',
    4: 'penthouse',
    5: 'duplex',
    6: 'triplex',
    7: 'studio_loft',
    25: 'basement',
    9: 'private_house',
    10: 'two_family',
    11: 'farm',
    14: 'plot',
    16: 'residential_building',
    17: 'senior_housing',
    19: 'housing_unit',
    32: 'tourism',
  };
  return map[cat] ?? 'general';
}

export async function searchYad2(filters: SearchFilters): Promise<Property[]> {
  try {
    const params: Record<string, string | number> = {
      priceOnly: 1,
    };
    if (filters.city) params['city'] = filters.city;
    if (filters.street) params['street'] = filters.street;
    if (filters.priceMin > 0) params['price'] = filters.priceMin;
    if (filters.priceMax < 20000000) params['price_max'] = filters.priceMax;
    if (filters.roomsMin > 1) params['rooms'] = filters.roomsMin;
    if (filters.roomsMax < 6) params['rooms_max'] = filters.roomsMax;
    if (filters.apartmentAreaMin > 0) params['squaremeter'] = filters.apartmentAreaMin;
    if (filters.apartmentAreaMax < 2000) params['squaremeter_max'] = filters.apartmentAreaMax;

    const res = await axios.get(BASE, {
      params,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'application/json',
      },
      timeout: 10000,
    });

    const items: Property[] = [];
    const feed = res.data?.data?.feed?.feed_items ?? [];

    for (const item of feed) {
      if (!item.id) continue;
      items.push({
        id: `yad2-${item.id}`,
        source: 'yad2',
        sourceUrl: `https://www.yad2.co.il/item/${item.id}`,
        title: item.title ?? '',
        price: item.price ? Number(item.price) : null,
        rooms: item.rooms ? Number(item.rooms) : null,
        floor: item.floor != null ? Number(item.floor) : null,
        totalFloors: item.floors != null ? Number(item.floors) : null,
        builtArea: item.square_meters ? Number(item.square_meters) : null,
        apartmentArea: item.square_meters ? Number(item.square_meters) : null,
        address: item.address ?? '',
        city: item.city ?? '',
        street: item.street ?? '',
        neighborhood: item.neighborhood ?? '',
        propertyType: mapType(item.category_id),
        features: [],
        condition: null,
        advertiserType: item.is_agency === 1 ? 'broker' : null,
        handType: null,
        description: item.info_text ?? '',
        images: item.images?.map((img: { src: string }) => img.src) ?? [],
        publishedAt: item.date ?? '',
        priceDecreased: !!item.price_dropped,
        agentName: item.contact_name ?? null,
        agentPhone: item.phone ?? null,
      });
    }
    return items;
  } catch {
    return [];
  }
}

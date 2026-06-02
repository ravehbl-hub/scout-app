import axios from 'axios';
import type { Property, SearchFilters } from '@/types';

const GRAPHQL = 'https://www.madlan.co.il/api/graphql';

const QUERY = `
query SearchListings($filters: ListingFiltersInput, $pagination: PaginationInput) {
  listings(filters: $filters, pagination: $pagination) {
    items {
      id
      title
      price
      rooms
      floor
      totalFloors
      size
      address { street city neighborhood }
      propertyType
      images { url }
      publishedAt
      description
      agency { name phone }
      priceDropped
    }
  }
}`;

function mapType(t: string): Property['propertyType'] {
  const map: Record<string, Property['propertyType']> = {
    APARTMENT: 'apartment',
    GARDEN_APARTMENT: 'garden_apartment',
    PENTHOUSE: 'penthouse',
    DUPLEX: 'duplex',
    PRIVATE_HOUSE: 'private_house',
    TWO_FAMILY: 'two_family',
    PLOT: 'plot',
    STUDIO: 'studio_loft',
  };
  return map[t] ?? 'general';
}

export async function searchMadlan(filters: SearchFilters): Promise<Property[]> {
  try {
    const variables = {
      filters: {
        city: filters.city || undefined,
        street: filters.street || undefined,
        priceMin: filters.priceMin > 0 ? filters.priceMin : undefined,
        priceMax: filters.priceMax < 20000000 ? filters.priceMax : undefined,
        roomsMin: filters.roomsMin > 1 ? filters.roomsMin : undefined,
        roomsMax: filters.roomsMax < 6 ? filters.roomsMax : undefined,
        sizeMin: filters.apartmentAreaMin > 0 ? filters.apartmentAreaMin : undefined,
        sizeMax: filters.apartmentAreaMax < 2000 ? filters.apartmentAreaMax : undefined,
      },
      pagination: { page: 1, pageSize: 50 },
    };

    const res = await axios.post(
      GRAPHQL,
      { query: QUERY, variables },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        timeout: 10000,
      }
    );

    const items: Property[] = [];
    const listings = res.data?.data?.listings?.items ?? [];

    for (const item of listings) {
      items.push({
        id: `madlan-${item.id}`,
        source: 'madlan',
        sourceUrl: `https://www.madlan.co.il/listing/${item.id}`,
        title: item.title ?? '',
        price: item.price ?? null,
        rooms: item.rooms ?? null,
        floor: item.floor ?? null,
        totalFloors: item.totalFloors ?? null,
        builtArea: item.size ?? null,
        apartmentArea: item.size ?? null,
        address: [item.address?.street, item.address?.city].filter(Boolean).join(', '),
        city: item.address?.city ?? '',
        street: item.address?.street ?? '',
        neighborhood: item.address?.neighborhood ?? '',
        propertyType: mapType(item.propertyType),
        features: [],
        condition: null,
        advertiserType: item.agency ? 'broker' : null,
        handType: null,
        description: item.description ?? '',
        images: item.images?.map((img: { url: string }) => img.url) ?? [],
        publishedAt: item.publishedAt ?? '',
        priceDecreased: !!item.priceDropped,
        agentName: item.agency?.name ?? null,
        agentPhone: item.agency?.phone ?? null,
      });
    }
    return items;
  } catch {
    return [];
  }
}

import type { Property, SearchFilters } from '@/types';

// Facebook Marketplace requires authentication — we return a deep-link instead.
export async function searchFacebook(filters: SearchFilters): Promise<Property[]> {
  const parts: string[] = [];
  if (filters.city) parts.push(filters.city);
  const query = ['נדלן', ...parts].join(' ');

  return [
    {
      id: 'facebook-link',
      source: 'facebook',
      sourceUrl: `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(query)}&category_id=propertyrentals`,
      title: `חפש ב-Facebook Marketplace: ${query}`,
      price: null,
      rooms: null,
      floor: null,
      totalFloors: null,
      builtArea: null,
      apartmentArea: null,
      address: filters.city ?? '',
      city: filters.city ?? '',
      street: '',
      neighborhood: '',
      propertyType: 'general',
      features: [],
      condition: null,
      advertiserType: null,
      handType: null,
      description: 'לחץ כדי לחפש ב-Facebook Marketplace',
      images: [],
      publishedAt: '',
      priceDecreased: false,
      agentName: null,
      agentPhone: null,
    },
  ];
}

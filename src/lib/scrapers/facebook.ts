import type { Property, SearchFilters } from '@/types';

export async function searchFacebook(filters: SearchFilters): Promise<Property[]> {
  const query = ['נדל"ן למכירה', filters.city].filter(Boolean).join(' ');
  return [
    {
      id: 'facebook-link',
      source: 'facebook',
      sourceUrl: `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(query)}&category_id=propertyrentals`,
      title: filters.city ? `פייסבוק מרקטפלייס — ${filters.city}` : 'פייסבוק מרקטפלייס',
      price: null, rooms: null, floor: null, totalFloors: null,
      builtArea: null, apartmentArea: null,
      address: filters.city ?? '', city: filters.city ?? '',
      street: '', neighborhood: '',
      propertyType: 'general', features: [], condition: null,
      advertiserType: null, handType: null,
      description: 'חיפוש ישיר ב-Facebook Marketplace עם הפילטרים שנבחרו',
      images: [], publishedAt: '', priceDecreased: false,
      agentName: null, agentPhone: null,
    },
  ];
}

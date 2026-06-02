import axios from 'axios';
import * as cheerio from 'cheerio';
import type { Property, SearchFilters } from '@/types';

const BASE = 'https://www.kones2.co.il';

function buildSearchUrl(filters: SearchFilters): string {
  const p = new URLSearchParams();
  if (filters.city) p.set('q', filters.city);
  if (filters.priceMin > 0) p.set('price_from', String(filters.priceMin));
  if (filters.priceMax < 20000000) p.set('price_to', String(filters.priceMax));
  if (filters.roomsMin > 1) p.set('rooms_from', String(filters.roomsMin));
  if (filters.roomsMax < 6) p.set('rooms_to', String(filters.roomsMax));
  return `${BASE}/results/?${p.toString()}`;
}

function linkCard(filters: SearchFilters): Property {
  return {
    id: 'kones2-link',
    source: 'kones2',
    sourceUrl: buildSearchUrl(filters),
    title: `חפש בכנס2${filters.city ? ` — ${filters.city}` : ''}`,
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
    description: 'לחץ לחיפוש ישיר בכנס2 עם הפילטרים שנבחרו',
    images: [],
    publishedAt: '',
    priceDecreased: false,
    agentName: null,
    agentPhone: null,
  };
}

export async function searchKones2(filters: SearchFilters): Promise<Property[]> {
  try {
    const params: Record<string, string> = {};
    if (filters.city) params['city'] = filters.city;
    if (filters.priceMax < 20000000) params['price_to'] = String(filters.priceMax);
    if (filters.priceMin > 0) params['price_from'] = String(filters.priceMin);
    if (filters.roomsMin > 1) params['rooms_from'] = String(filters.roomsMin);
    if (filters.roomsMax < 6) params['rooms_to'] = String(filters.roomsMax);

    const res = await axios.get(`${BASE}/sale`, {
      params,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': BASE,
        'Accept-Language': 'he-IL,he;q=0.9',
      },
      timeout: 8000,
    });

    const $ = cheerio.load(res.data as string);
    const items: Property[] = [];

    $('.property-item, .listing-item, article.property, .property-card').each((i, el) => {
      const $el = $(el);
      const id = $el.attr('data-id') ?? String(i);
      const href = $el.find('a').first().attr('href') ?? '';
      const priceText = $el.find('.price, [class*="price"]').first().text().replace(/\D/g, '');
      const roomsText = $el.find('.rooms, [class*="room"]').first().text().replace(/\D/g, '');
      const areaText = $el.find('.area, [class*="area"], [class*="sqm"]').first().text().replace(/\D/g, '');
      const cityText = $el.find('.city, [class*="city"], [class*="location"]').first().text().trim();
      const titleText = $el.find('h2, h3, .title, [class*="title"]').first().text().trim();
      const img = $el.find('img').first().attr('src') ?? '';
      const desc = $el.find('.description, p').first().text().trim();

      items.push({
        id: `kones2-${id}`,
        source: 'kones2',
        sourceUrl: href.startsWith('http') ? href : `${BASE}${href}`,
        title: titleText || `נכס ${i + 1}`,
        price: priceText ? Number(priceText) : null,
        rooms: roomsText ? Number(roomsText) : null,
        floor: null,
        totalFloors: null,
        builtArea: areaText ? Number(areaText) : null,
        apartmentArea: areaText ? Number(areaText) : null,
        address: cityText || (filters.city ?? ''),
        city: cityText || (filters.city ?? ''),
        street: '',
        neighborhood: '',
        propertyType: 'apartment',
        features: [],
        condition: null,
        advertiserType: null,
        handType: null,
        description: desc,
        images: img ? [img] : [],
        publishedAt: '',
        priceDecreased: false,
        agentName: null,
        agentPhone: null,
      });
    });

    return items.length > 0 ? items : [linkCard(filters)];
  } catch {
    return [linkCard(filters)];
  }
}

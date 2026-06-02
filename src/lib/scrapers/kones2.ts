import axios from 'axios';
import * as cheerio from 'cheerio';
import type { Property, SearchFilters } from '@/types';

const BASE = 'https://www.kones2.co.il';

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
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000,
    });

    const $ = cheerio.load(res.data as string);
    const items: Property[] = [];

    $('.property-item, .listing-item, article.property').each((i, el) => {
      const $el = $(el);
      const id = $el.attr('data-id') ?? `kones2-${i}`;
      const href = $el.find('a').attr('href') ?? '';
      const priceText = $el.find('.price, [class*="price"]').first().text().replace(/\D/g, '');
      const roomsText = $el.find('.rooms, [class*="room"]').first().text().replace(/\D/g, '');
      const areaText = $el.find('.area, [class*="area"], [class*="sqm"]').first().text().replace(/\D/g, '');
      const cityText = $el.find('.city, [class*="city"]').first().text().trim();
      const titleText = $el.find('h2, h3, .title').first().text().trim();
      const img = $el.find('img').first().attr('src') ?? '';
      const desc = $el.find('.description, p').first().text().trim();

      items.push({
        id: `kones2-${id}`,
        source: 'kones2',
        sourceUrl: href.startsWith('http') ? href : `${BASE}${href}`,
        title: titleText,
        price: priceText ? Number(priceText) : null,
        rooms: roomsText ? Number(roomsText) : null,
        floor: null,
        totalFloors: null,
        builtArea: areaText ? Number(areaText) : null,
        apartmentArea: areaText ? Number(areaText) : null,
        address: cityText,
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

    return items;
  } catch {
    return [];
  }
}

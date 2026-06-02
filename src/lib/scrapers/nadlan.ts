import axios from 'axios';
import type { Property, SearchFilters } from '@/types';

const CKAN = 'https://data.gov.il/api/3/action';

/** Discover the most recent real-estate transaction resource ID from data.gov.il */
async function findResourceId(): Promise<string | null> {
  const res = await axios.get(`${CKAN}/package_search`, {
    params: { q: 'עסקות מכר נדל"ן', rows: 5 },
    timeout: 4000,
  });
  const packages: Array<{ resources: Array<{ id: string; format: string; name: string }> }> =
    res.data?.result?.results ?? [];
  for (const pkg of packages) {
    for (const r of pkg.resources ?? []) {
      if (['JSON', 'CSV'].includes((r.format ?? '').toUpperCase())) return r.id;
    }
  }
  return null;
}

function f(r: Record<string, unknown>, ...keys: string[]): string | null {
  for (const k of keys) if (r[k] != null && r[k] !== '') return String(r[k]);
  return null;
}

export async function searchNadlan(filters: SearchFilters): Promise<Property[]> {
  if (!filters.city) return [];

  try {
    const resourceId = await findResourceId();
    if (!resourceId) return [];

    const res = await axios.get(`${CKAN}/datastore_search`, {
      params: { resource_id: resourceId, q: filters.city, limit: 30 },
      timeout: 5000,
    });

    const records: Record<string, unknown>[] = res.data?.result?.records ?? [];
    if (records.length === 0) return [];

    return records.map((r, i) => {
      const priceRaw = f(r, 'DEALAMOUNT', 'FULL_PURCHASE_PRICE', 'SumVkach', 'PurchasePrice');
      const price = priceRaw ? Number(priceRaw.replace(/\D/g, '')) : null;
      const rooms = f(r, 'ROOMS', 'RoomNum', 'ROOM_NUM');
      const floor = f(r, 'FLOOR', 'FLOOR_FIELD', 'FloorNo', 'FLOOR_NO');
      const area = f(r, 'AREA', 'NET_ASSET_AREA', 'AssetArea', 'ASSET_AREA', 'TOT_ASSET_AREA');
      const date = f(r, 'DEALDATE', 'DEAL_DATE', 'DealDate');
      const street = f(r, 'STREET', 'STREET_NAME_HE', 'Street', 'FULLADRESS');
      const houseNum = f(r, 'HOUSE_NUMBER', 'HouseNo', 'HOUSE_NO');
      const city = f(r, 'CITY_NAME', 'CITY_NAME_HE', 'CityName') ?? filters.city;
      const priceM2 = f(r, 'PRICEPERM2', 'PRICE_PER_M2', 'PricePerM2');

      const address = [street, houseNum, city].filter(Boolean).join(' ');

      return {
        id: `nadlan-${i}`,
        source: 'agent' as const,
        sourceUrl: 'https://www.nadlan.gov.il/',
        title: `${city}${street ? ` — ${street}` : ''}${houseNum ? ` ${houseNum}` : ''}`,
        price,
        rooms: rooms ? Math.round(Number(rooms) * 2) / 2 : null,
        floor: floor != null ? Number(floor) : null,
        totalFloors: null,
        builtArea: area ? Number(area) : null,
        apartmentArea: area ? Number(area) : null,
        address,
        city,
        street: street ?? '',
        neighborhood: '',
        propertyType: 'apartment' as const,
        features: [],
        condition: null,
        advertiserType: null,
        handType: 'second_hand' as const,
        description: [
          date ? `📅 תאריך עסקה: ${date}` : null,
          priceM2 ? `📐 ${Number(priceM2).toLocaleString('he-IL')} ₪ למ"ר` : null,
          '📊 מקור: מרשם עסקאות ממשלתי',
        ].filter(Boolean).join('\n'),
        images: [],
        publishedAt: date ?? '',
        priceDecreased: false,
        agentName: 'נדל"ן ממשלתי',
        agentPhone: null,
      };
    }).filter((p) => {
      if (p.price === null) return true;
      if (filters.priceMin > 0 && p.price < filters.priceMin) return false;
      if (filters.priceMax < 20000000 && p.price > filters.priceMax) return false;
      return true;
    });
  } catch {
    return [];
  }
}

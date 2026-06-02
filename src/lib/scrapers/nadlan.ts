import axios from 'axios';
import type { Property, SearchFilters } from '@/types';

// Israeli government real estate transaction registry (data.gov.il)
const CKAN = 'https://data.gov.il/api/3/action/datastore_search';

// Try multiple dataset resource IDs — the gov rotates these by year
const RESOURCE_IDS = [
  '43a5a79e-7e74-4cc8-bb1f-61d5a0f6b059', // recent transactions
  'b8f58bad-7635-4108-9989-1fcf22a41a36',
  '5c78e9fa-c2e2-4771-93ff-7f400a12f7ba',
];

// Field names vary by dataset version — try multiple candidates
function f(r: Record<string, unknown>, ...names: string[]): string | null {
  for (const n of names) if (r[n] != null && r[n] !== '') return String(r[n]);
  return null;
}

export async function searchNadlan(filters: SearchFilters): Promise<Property[]> {
  if (!filters.city) return [];

  for (const resourceId of RESOURCE_IDS) {
    try {
      const res = await axios.get(CKAN, {
        params: {
          resource_id: resourceId,
          q: filters.city,
          limit: 30,
        },
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 5000,
      });

      const records: Record<string, unknown>[] = res.data?.result?.records ?? [];
      if (records.length === 0) continue;

      const items: Property[] = records.map((r, i) => {
        const priceRaw = f(r, 'DEALAMOUNT', 'FULL_PURCHASE_PRICE', 'SumVkach', 'PurchasePrice');
        const price = priceRaw ? Number(priceRaw.replace(/\D/g, '')) : null;
        const roomsRaw = f(r, 'ROOMS', 'RoomNum', 'ROOM_NUM');
        const floorRaw = f(r, 'FLOOR', 'FLOOR_FIELD', 'FloorNo', 'FLOOR_NO');
        const areaRaw = f(r, 'AREA', 'NET_ASSET_AREA', 'AssetArea', 'ASSET_AREA');
        const dateRaw = f(r, 'DEALDATE', 'DEAL_DATE', 'DealDate');
        const streetRaw = f(r, 'STREET', 'STREET_NAME_HE', 'Street', 'FULLADRESS');
        const cityRaw = f(r, 'CITY_NAME', 'CITY_NAME_HE', 'CityName') ?? filters.city;
        const houseNum = f(r, 'HOUSE_NUMBER', 'HouseNo', 'HOUSE_NO');
        const priceM2 = f(r, 'PRICEPERM2', 'PRICE_PER_M2', 'PricePerM2');

        const fullAddress = [streetRaw, houseNum, cityRaw].filter(Boolean).join(' ');

        return {
          id: `nadlan-${i}-${resourceId.slice(0, 6)}`,
          source: 'agent' as const,
          sourceUrl: 'https://www.nadlan.gov.il/',
          title: `${cityRaw}${streetRaw ? ` — ${streetRaw}` : ''}`,
          price,
          rooms: roomsRaw ? Math.round(Number(roomsRaw) * 2) / 2 : null,
          floor: floorRaw != null ? Number(floorRaw) : null,
          totalFloors: null,
          builtArea: areaRaw ? Number(areaRaw) : null,
          apartmentArea: areaRaw ? Number(areaRaw) : null,
          address: fullAddress,
          city: cityRaw,
          street: streetRaw ?? '',
          neighborhood: '',
          propertyType: 'apartment' as const,
          features: [],
          condition: null,
          advertiserType: null,
          handType: 'second_hand' as const,
          description: [
            dateRaw ? `📅 תאריך עסקה: ${dateRaw}` : null,
            priceM2 ? `📐 ${Number(priceM2).toLocaleString('he-IL')} ₪ למ"ר` : null,
            `📊 מרשם עסקאות ממשלתי (נדל"ן.gov.il)`,
          ]
            .filter(Boolean)
            .join('\n'),
          images: [],
          publishedAt: dateRaw ?? '',
          priceDecreased: false,
          agentName: 'נדל"ן ממשלתי',
          agentPhone: null,
        };
      });

      // Filter by price range if set
      const filtered = items.filter((p) => {
        if (p.price === null) return true;
        if (filters.priceMin > 0 && p.price < filters.priceMin) return false;
        if (filters.priceMax < 20000000 && p.price > filters.priceMax) return false;
        return true;
      });

      if (filtered.length > 0) return filtered;
    } catch {
      continue;
    }
  }

  return [];
}

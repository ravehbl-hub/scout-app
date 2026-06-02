import { NextRequest, NextResponse } from 'next/server';
import type { SearchFilters, Source, Property } from '@/types';
import { searchYad2 } from '@/lib/scrapers/yad2';
import { searchMadlan } from '@/lib/scrapers/madlan';
import { searchKones2 } from '@/lib/scrapers/kones2';
import { searchFacebook } from '@/lib/scrapers/facebook';
import { searchNadlan } from '@/lib/scrapers/nadlan';

function parseFilters(req: NextRequest): SearchFilters {
  const p = req.nextUrl.searchParams;
  const g = (k: string, d: string) => p.get(k) ?? d;
  const gn = (k: string, d: number) => Number(p.get(k) ?? d);
  const ga = <T>(k: string): T[] =>
    p.has(k) ? (p.get(k)!.split(',') as T[]) : [];

  return {
    query: g('query', ''),
    city: g('city', ''),
    street: g('street', ''),
    builtAreaMin: gn('builtAreaMin', 0),
    builtAreaMax: gn('builtAreaMax', 2000),
    apartmentAreaMin: gn('apartmentAreaMin', 0),
    apartmentAreaMax: gn('apartmentAreaMax', 2000),
    priceMin: gn('priceMin', 0),
    priceMax: gn('priceMax', 20000000),
    roomsMin: gn('roomsMin', 1),
    roomsMax: gn('roomsMax', 6),
    propertyTypes: ga('propertyTypes'),
    advertisers: ga('advertisers'),
    handType: (p.get('handType') as SearchFilters['handType']) ?? null,
    features: ga('features'),
    floorMin: gn('floorMin', -1),
    floorMax: gn('floorMax', 20),
    entryDateFrom: g('entryDateFrom', ''),
    conditions: ga('conditions'),
    adFeatures: ga('adFeatures'),
    sources: ga<Source>('sources').length
      ? ga<Source>('sources')
      : ['yad2', 'madlan', 'kones2', 'facebook', 'agent'],
  };
}

export async function GET(req: NextRequest) {
  const filters = parseFilters(req);
  const sources = filters.sources;

  const tasks: Promise<Property[]>[] = [];
  // Government real estate transaction data — always runs when city is set
  if (filters.city) tasks.push(searchNadlan(filters));
  // Source link cards + live API attempts
  if (sources.includes('yad2')) tasks.push(searchYad2(filters));
  if (sources.includes('madlan')) tasks.push(searchMadlan(filters));
  if (sources.includes('kones2')) tasks.push(searchKones2(filters));
  if (sources.includes('facebook')) tasks.push(searchFacebook(filters));

  const results = await Promise.allSettled(tasks);
  const properties: Property[] = results.flatMap((r) =>
    r.status === 'fulfilled' ? r.value : []
  );

  // Real listings first (have price), then link cards (no price, id ends with -link)
  const realListings = properties.filter((p) => !p.id.endsWith('-link'));
  const linkCards = properties.filter((p) => p.id.endsWith('-link'));

  // Sort real listings by price asc, nulls last
  realListings.sort((a, b) => {
    if (a.price === null && b.price === null) return 0;
    if (a.price === null) return 1;
    if (b.price === null) return -1;
    return a.price - b.price;
  });

  return NextResponse.json({
    properties: [...realListings, ...linkCards],
    total: properties.length,
  });
}

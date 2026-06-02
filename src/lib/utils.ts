import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null): string {
  if (price === null) return 'מחיר לא צוין';
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area: number | null): string {
  if (area === null) return '—';
  return `${area} מ"ר`;
}

export function formatRooms(rooms: number | null): string {
  if (rooms === null) return '—';
  return rooms >= 6 ? '6+' : String(rooms);
}

export const SOURCE_LABELS: Record<string, string> = {
  yad2: 'יד 2',
  madlan: 'מדלן',
  kones2: 'כנס2',
  facebook: 'פייסבוק',
  agent: 'מתווך',
};

export const SOURCE_COLORS: Record<string, string> = {
  yad2: 'bg-red-100 text-red-800',
  madlan: 'bg-blue-100 text-blue-800',
  kones2: 'bg-green-100 text-green-800',
  facebook: 'bg-indigo-100 text-indigo-800',
  agent: 'bg-yellow-100 text-yellow-800',
};

export const SOURCE_URLS: Record<string, string> = {
  yad2: 'https://www.yad2.co.il/realestate/rent',
  madlan: 'https://www.madlan.co.il',
  kones2: 'https://www.kones2.co.il',
  facebook: 'https://www.facebook.com/marketplace/category/propertyrentals',
  agent: '#',
};

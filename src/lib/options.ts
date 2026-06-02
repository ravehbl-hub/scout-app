import type { PropertyType, PropertyFeature, PropertyCondition, AdFeature } from '@/types';

export interface Option<T> {
  value: T;
  label: string;
  icon: string;
  group?: string;
}

export const PROPERTY_TYPE_OPTIONS: Option<PropertyType | 'all_apartments' | 'all_houses'>[] = [
  // Apartments
  { value: 'all_apartments', label: 'כל הדירות', icon: '🏢', group: 'דירות' },
  { value: 'apartment', label: 'דירה', icon: '🏠', group: 'דירות' },
  { value: 'garden_apartment', label: 'דירת גן', icon: '🌿', group: 'דירות' },
  { value: 'penthouse', label: 'גג / פנטהאוז', icon: '🌇', group: 'דירות' },
  { value: 'duplex', label: 'דופלקס', icon: '🏘', group: 'דירות' },
  { value: 'tourism', label: 'תיירות ונופש', icon: '🌴', group: 'דירות' },
  { value: 'basement', label: 'מרתף / פרטר', icon: '⬇️', group: 'דירות' },
  { value: 'triplex', label: 'טריפלקס', icon: '🏗', group: 'דירות' },
  { value: 'housing_unit', label: 'יחידת דיור', icon: '🛖', group: 'דירות' },
  { value: 'studio_loft', label: 'סטודיו / לופט', icon: '🎨', group: 'דירות' },
  // Houses
  { value: 'all_houses', label: 'כל הבתים', icon: '🏡', group: 'בתים' },
  { value: 'private_house', label: 'בית פרטי / קוטג׳', icon: '🏡', group: 'בתים' },
  { value: 'two_family', label: 'בית דו משפחתי', icon: '🏘', group: 'בתים' },
  { value: 'farm', label: 'נחלה / חווה', icon: '🌾', group: 'בתים' },
  { value: 'subsidiary_farm', label: 'משק עזר', icon: '🐄', group: 'בתים' },
  // Other
  { value: 'plot', label: 'מגרשים', icon: '📐', group: 'אחר' },
  { value: 'senior_housing', label: 'דיור מוגן', icon: '👴', group: 'אחר' },
  { value: 'residential_building', label: 'בניין מגורים', icon: '🏢', group: 'אחר' },
  { value: 'warehouse', label: 'מחסן', icon: '📦', group: 'אחר' },
  { value: 'parking', label: 'חניה', icon: '🚗', group: 'אחר' },
  { value: 'purchase_right', label: 'קנייה/זכות לנכס', icon: '📋', group: 'אחר' },
  { value: 'general', label: 'כללי', icon: '📍', group: 'אחר' },
];

export const FEATURE_OPTIONS: Option<PropertyFeature>[] = [
  { value: 'parking', label: 'חניה', icon: '🚗' },
  { value: 'elevator', label: 'מעלית', icon: '🛗' },
  { value: 'mad', label: 'מ.א.ד', icon: '🛡' },
  { value: 'balcony', label: 'מרפסת', icon: '🌅' },
  { value: 'ac', label: 'מיזוג', icon: '❄️' },
  { value: 'storage', label: 'מחסן', icon: '📦' },
  { value: 'renovated', label: 'משופץ', icon: '🔨' },
  { value: 'handicap', label: 'נגישות', icon: '♿' },
  { value: 'barriers', label: 'חסם', icon: '🚧' },
  { value: 'furnished', label: 'מרוהט', icon: '🛋' },
  { value: 'exclusive', label: 'בלעדי', icon: '⭐' },
  { value: 'shelter', label: 'ממ"ד בבניין', icon: '🏗' },
];

export const CONDITION_OPTIONS: Option<PropertyCondition>[] = [
  { value: 'new_contractor', label: 'חדש מקבלן (מעולם לא גרו)', icon: '🆕' },
  { value: 'new', label: 'חדש (עד 10 שנים)', icon: '✨' },
  { value: 'renovated', label: 'משופץ (שופץ ב-5 שנים האחרונות)', icon: '🔧' },
  { value: 'good', label: 'מצב טוב (לא שופץ)', icon: '👍' },
  { value: 'needs_renovation', label: 'דורש שיפוץ', icon: '🏚' },
];

export const AD_FEATURE_OPTIONS: Option<AdFeature>[] = [
  { value: 'with_image', label: 'עם תמונה', icon: '📸' },
  { value: 'moshav_kibbutz', label: 'מושבים וקיבוצים בלבד', icon: '🌾' },
  { value: 'with_price', label: 'עם מחיר', icon: '💰' },
  { value: 'price_decrease', label: 'נכסים עם ירידת מחיר', icon: '📉' },
];

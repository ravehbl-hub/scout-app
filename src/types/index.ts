export type PropertyType =
  | 'apartment'
  | 'garden_apartment'
  | 'penthouse'
  | 'duplex'
  | 'tourism'
  | 'basement'
  | 'triplex'
  | 'housing_unit'
  | 'studio_loft'
  | 'private_house'
  | 'two_family'
  | 'farm'
  | 'subsidiary_farm'
  | 'plot'
  | 'senior_housing'
  | 'residential_building'
  | 'warehouse'
  | 'parking'
  | 'purchase_right'
  | 'general';

export type PropertyFeature =
  | 'parking'
  | 'elevator'
  | 'mad'
  | 'balcony'
  | 'ac'
  | 'storage'
  | 'renovated'
  | 'handicap'
  | 'barriers'
  | 'furnished'
  | 'exclusive'
  | 'shelter';

export type PropertyCondition =
  | 'new_contractor'
  | 'new'
  | 'renovated'
  | 'good'
  | 'needs_renovation';

export type AdFeature =
  | 'with_image'
  | 'moshav_kibbutz'
  | 'with_price'
  | 'price_decrease';

export type AdvertiserType = 'broker' | 'developer';

export type HandType = 'new' | 'second_hand';

export type Source = 'yad2' | 'madlan' | 'kones2' | 'facebook' | 'agent';

export interface SearchFilters {
  query: string;
  city: string;
  street: string;
  builtAreaMin: number;
  builtAreaMax: number;
  apartmentAreaMin: number;
  apartmentAreaMax: number;
  priceMin: number;
  priceMax: number;
  roomsMin: number;
  roomsMax: number;
  propertyTypes: PropertyType[];
  advertisers: AdvertiserType[];
  handType: HandType | null;
  features: PropertyFeature[];
  floorMin: number;
  floorMax: number;
  entryDateFrom: string;
  conditions: PropertyCondition[];
  adFeatures: AdFeature[];
  sources: Source[];
}

export interface Property {
  id: string;
  source: Source;
  sourceUrl: string;
  title: string;
  price: number | null;
  rooms: number | null;
  floor: number | null;
  totalFloors: number | null;
  builtArea: number | null;
  apartmentArea: number | null;
  address: string;
  city: string;
  street: string;
  neighborhood: string;
  propertyType: PropertyType;
  features: PropertyFeature[];
  condition: PropertyCondition | null;
  advertiserType: AdvertiserType | null;
  handType: HandType | null;
  description: string;
  images: string[];
  publishedAt: string;
  priceDecreased: boolean;
  agentName: string | null;
  agentPhone: string | null;
  entryDate?: string;
}

export interface AreaAnalysis {
  city: string;
  population: string;
  education: {
    kindergartens: string;
    elementarySchools: string;
    highSchools: string;
    level: string;
  };
  academics: string;
  newNeighborhoods: string;
  crimeLevel: string;
  schoolViolence: string;
  cityViolence: string;
  arabBedouinPresence: string;
  medicalCenters: string;
  classSize: string;
  specialEducation: string;
  prices: {
    newApartment5rooms: string;
    newApartment6rooms: string;
    secondHandApartment5rooms: string;
    secondHandApartment6rooms: string;
  };
  ultraOrthodox: string;
  recommendedNeighborhoods: string;
  newNeighborhoodsList: string;
  academicEmployment: string;
  engineerEmployment: string;
  taxBenefits: string;
  borderProximity: string;
}

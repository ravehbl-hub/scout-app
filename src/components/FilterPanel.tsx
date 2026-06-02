'use client';
import { X, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import RangeSlider from '@/components/ui/RangeSlider';
import MultiSelect from '@/components/ui/MultiSelect';
import GroupedMultiSelect from '@/components/ui/GroupedMultiSelect';
import {
  PROPERTY_TYPE_OPTIONS,
  FEATURE_OPTIONS,
  CONDITION_OPTIONS,
  AD_FEATURE_OPTIONS,
} from '@/lib/options';
import type { PropertyType, PropertyFeature, PropertyCondition, AdFeature, AdvertiserType, HandType } from '@/types';
import { cn } from '@/lib/utils';

const FLOOR_LABELS: Record<number, string> = { '-1': 'מרתף', '0': 'קרקע' };
const fmtFloor = (v: number) => FLOOR_LABELS[v] ?? String(v);
const fmtPrice = (v: number) =>
  v >= 1000000 ? `${(v / 1000000).toFixed(1)}M ₪` : v >= 1000 ? `${Math.round(v / 1000)}K ₪` : `${v} ₪`;
const fmtArea = (v: number) => `${v} מ"ר`;

interface Props {
  /** overlay = mobile full-screen; sidebar = desktop inline panel */
  variant?: 'overlay' | 'sidebar';
}

export default function FilterPanel({ variant = 'overlay' }: Props) {
  const { filters, setFilter, resetFilters, setShowFilters, search } = useAppStore();

  const handleApply = () => {
    if (variant === 'overlay') setShowFilters(false);
    search();
  };

  const isOverlay = variant === 'overlay';

  return (
    <div
      className={cn(
        'flex flex-col bg-gray-50 h-full',
        isOverlay && 'fixed inset-0 z-50'
      )}
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm shrink-0">
        <h2 className="font-bold text-gray-900 text-sm">סינון מתקדם</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
          >
            <RotateCcw className="w-3 h-3" />
            אפס
          </button>
          {isOverlay && (
            <button onClick={() => setShowFilters(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable filters */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">

        <Section title="מיקום">
          <input
            type="text"
            placeholder="עיר / ישוב / קיבוץ"
            value={filters.city}
            onChange={(e) => setFilter('city', e.target.value)}
            className="input-field"
            dir="rtl"
          />
          <input
            type="text"
            placeholder="רחוב"
            value={filters.street}
            onChange={(e) => setFilter('street', e.target.value)}
            className="input-field mt-2"
            dir="rtl"
          />
        </Section>

        <Section title="מחיר (₪)">
          <RangeSlider
            label="טווח מחיר"
            min={0}
            max={20000000}
            step={50000}
            value={[filters.priceMin, filters.priceMax]}
            onChange={([a, b]) => { setFilter('priceMin', a); setFilter('priceMax', b); }}
            format={fmtPrice}
          />
        </Section>

        <Section title="חדרים">
          <RangeSlider
            label="מספר חדרים"
            min={1}
            max={6}
            step={0.5}
            value={[filters.roomsMin, filters.roomsMax]}
            onChange={([a, b]) => { setFilter('roomsMin', a); setFilter('roomsMax', b); }}
            format={(v) => (v >= 6 ? '6+' : String(v))}
          />
        </Section>

        <Section title='שטח (מ"ר)'>
          <RangeSlider
            label='שטח דירה'
            min={0}
            max={2000}
            step={5}
            value={[filters.apartmentAreaMin, filters.apartmentAreaMax]}
            onChange={([a, b]) => { setFilter('apartmentAreaMin', a); setFilter('apartmentAreaMax', b); }}
            format={fmtArea}
          />
          <div className="mt-3">
            <RangeSlider
              label='שטח בנוי'
              min={0}
              max={2000}
              step={5}
              value={[filters.builtAreaMin, filters.builtAreaMax]}
              onChange={([a, b]) => { setFilter('builtAreaMin', a); setFilter('builtAreaMax', b); }}
              format={fmtArea}
            />
          </div>
        </Section>

        <Section title="קומה">
          <RangeSlider
            label="קומות"
            min={-1}
            max={20}
            step={1}
            value={[filters.floorMin, filters.floorMax]}
            onChange={([a, b]) => { setFilter('floorMin', a); setFilter('floorMax', b); }}
            format={fmtFloor}
          />
        </Section>

        <Section title="סוג נכס">
          <GroupedMultiSelect<PropertyType>
            options={PROPERTY_TYPE_OPTIONS.filter(
              (o) => o.value !== 'all_apartments' && o.value !== 'all_houses'
            ) as { value: PropertyType; label: string; icon: string; group?: string }[]}
            selected={filters.propertyTypes}
            onChange={(v) => setFilter('propertyTypes', v)}
          />
        </Section>

        <Section title="מפרסם">
          <div className="flex gap-2 flex-wrap">
            {(['broker', 'developer'] as AdvertiserType[]).map((a) => {
              const labels: Record<AdvertiserType, string> = { broker: 'מתווך', developer: 'קבלן/יזם' };
              const active = filters.advertisers.includes(a);
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() =>
                    setFilter('advertisers', active
                      ? filters.advertisers.filter((x) => x !== a)
                      : [...filters.advertisers, a]
                    )
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}
                >
                  {labels[a]}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="יד">
          <div className="flex gap-2">
            {([['new', 'חדש מקבלן'], ['second_hand', 'יד שניה']] as [HandType, string][]).map(([val, lbl]) => {
              const active = filters.handType === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFilter('handType', active ? null : val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}
                >
                  {lbl}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="מאפייני נכס">
          <MultiSelect<PropertyFeature>
            options={FEATURE_OPTIONS}
            selected={filters.features}
            onChange={(v) => setFilter('features', v)}
          />
        </Section>

        <Section title="תאריך כניסה">
          <input
            type="date"
            value={filters.entryDateFrom}
            onChange={(e) => setFilter('entryDateFrom', e.target.value)}
            className="input-field"
          />
        </Section>

        <Section title="מצב הנכס">
          <MultiSelect<PropertyCondition>
            options={CONDITION_OPTIONS}
            selected={filters.conditions}
            onChange={(v) => setFilter('conditions', v)}
          />
        </Section>

        <Section title="מאפייני מודעה">
          <MultiSelect<AdFeature>
            options={AD_FEATURE_OPTIONS}
            selected={filters.adFeatures}
            onChange={(v) => setFilter('adFeatures', v)}
          />
        </Section>
      </div>

      {/* Apply button */}
      <div className="px-3 py-3 bg-white border-t border-gray-100 shrink-0">
        <button
          onClick={handleApply}
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          {isOverlay ? 'החל סינון וחפש' : 'חפש'}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      <h3 className="text-xs font-semibold text-gray-600 mb-2.5">{title}</h3>
      {children}
    </div>
  );
}

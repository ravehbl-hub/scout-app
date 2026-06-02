'use client';
import { X, ExternalLink, Phone, MapPin, Bed, Maximize2, Calendar, Building2 } from 'lucide-react';
import { formatPrice, formatArea, formatRooms, SOURCE_LABELS } from '@/lib/utils';
import type { Property } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  property: Property;
  onClose: () => void;
  onAnalyze: (city: string) => void;
}

const CONDITION_LABELS: Record<string, string> = {
  new_contractor: 'חדש מקבלן',
  new: 'חדש',
  renovated: 'משופץ',
  good: 'מצב טוב',
  needs_renovation: 'דורש שיפוץ',
};

export default function PropertyDetail({ property, onClose, onAnalyze }: Props) {
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <span className="text-sm font-semibold text-gray-700">{SOURCE_LABELS[property.source]}</span>
        <a
          href={property.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="w-4 h-4" />
          מקור
        </a>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Images */}
        {property.images.length > 0 && (
          <div className="relative h-64 bg-gray-100">
            <Image
              src={property.images[imgIdx]}
              alt={property.title}
              fill
              className="object-cover"
              unoptimized
            />
            {property.images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {property.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="px-4 py-4 space-y-4">
          {/* Price & title */}
          <div>
            <p className="text-2xl font-bold text-blue-700">{formatPrice(property.price)}</p>
            <h1 className="text-base font-semibold text-gray-900 mt-1">{property.title}</h1>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span>{[property.street, property.neighborhood, property.city].filter(Boolean).join(', ')}</span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={<Bed className="w-4 h-4" />} label="חדרים" value={formatRooms(property.rooms)} />
            <Stat icon={<Maximize2 className="w-4 h-4" />} label='שטח' value={formatArea(property.apartmentArea)} />
            <Stat
              icon={<Building2 className="w-4 h-4" />}
              label="קומה"
              value={property.floor !== null
                ? property.floor === -1 ? 'מרתף' : property.floor === 0 ? 'קרקע' : String(property.floor)
                : '—'}
            />
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-2xl p-3 space-y-2 text-sm">
            {property.handType && (
              <Row label="יד" value={property.handType === 'new' ? 'חדש מקבלן' : 'יד שניה'} />
            )}
            {property.condition && (
              <Row label="מצב" value={CONDITION_LABELS[property.condition] ?? property.condition} />
            )}
            {property.advertiserType && (
              <Row label="מפרסם" value={property.advertiserType === 'broker' ? 'מתווך' : 'קבלן/יזם'} />
            )}
            {property.totalFloors && (
              <Row label="סה״כ קומות" value={String(property.totalFloors)} />
            )}
            {property.builtArea && (
              <Row label='שטח בנוי' value={formatArea(property.builtArea)} />
            )}
            {property.entryDate && (
              <Row label="כניסה" value={property.entryDate} />
            )}
          </div>

          {/* Features */}
          {property.features.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">מאפיינים</p>
              <div className="flex flex-wrap gap-1.5">
                {property.features.map((f) => (
                  <span key={f} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-xl text-xs font-medium border border-blue-100">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {property.description && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">תיאור</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          )}

          {/* Analyze area button */}
          {property.city && (
            <button
              onClick={() => onAnalyze(property.city)}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors"
            >
              ניתוח רקע על {property.city} 🔍
            </button>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-3">
        {property.agentPhone && (
          <a
            href={`tel:${property.agentPhone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors"
          >
            <Phone className="w-4 h-4" />
            {property.agentName ?? 'התקשר'}
          </a>
        )}
        <a
          href={property.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          לצפות במודעה
        </a>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center gap-1">
      <span className="text-gray-400">{icon}</span>
      <span className="text-base font-bold text-gray-900">{value}</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

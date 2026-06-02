'use client';
import { Bed, Maximize2, MapPin, TrendingDown, ExternalLink, Phone } from 'lucide-react';
import { formatPrice, formatArea, formatRooms, SOURCE_LABELS, SOURCE_COLORS } from '@/lib/utils';
import type { Property } from '@/types';
import Image from 'next/image';

interface Props {
  property: Property;
  onClick: () => void;
}

export default function PropertyCard({ property, onClick }: Props) {
  const img = property.images[0];

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.99] transition-transform cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100">
        {img ? (
          <Image
            src={img}
            alt={property.title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-4xl">🏠</div>
        )}

        {/* Source badge */}
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-bold ${SOURCE_COLORS[property.source]}`}
        >
          {SOURCE_LABELS[property.source]}
        </span>

        {/* Price decrease badge */}
        {property.priceDecreased && (
          <span className="absolute top-2 left-2 flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-orange-500 text-white text-[10px] font-bold">
            <TrendingDown className="w-3 h-3" />
            ירידת מחיר
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3" dir="rtl">
        {/* Price */}
        <p className="text-lg font-bold text-blue-700 leading-tight">
          {formatPrice(property.price)}
        </p>

        {/* Title */}
        <p className="text-sm text-gray-800 font-medium mt-0.5 line-clamp-1">{property.title}</p>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="line-clamp-1">
            {[property.street, property.neighborhood, property.city].filter(Boolean).join(', ')}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
          <span className="flex items-center gap-0.5">
            <Bed className="w-3.5 h-3.5" />
            {formatRooms(property.rooms)} חדרים
          </span>
          <span className="flex items-center gap-0.5">
            <Maximize2 className="w-3.5 h-3.5" />
            {formatArea(property.apartmentArea)}
          </span>
          {property.floor !== null && (
            <span>קומה {property.floor === -1 ? 'מרתף' : property.floor === 0 ? 'קרקע' : property.floor}</span>
          )}
        </div>

        {/* Features */}
        {property.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {property.features.slice(0, 4).map((f) => (
              <span key={f} className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-600">
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          {property.agentPhone && (
            <a
              href={`tel:${property.agentPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-medium hover:bg-green-100"
            >
              <Phone className="w-3.5 h-3.5" />
              {property.agentName ?? 'התקשר'}
            </a>
          )}
          <a
            href={property.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium hover:bg-blue-100"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            לצפות במודעה
          </a>
        </div>
      </div>
    </div>
  );
}

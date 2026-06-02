'use client';
import { ExternalLink } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { SOURCE_LABELS, SOURCE_URLS } from '@/lib/utils';
import type { Source } from '@/types';

const ALL_SOURCES: Source[] = ['yad2', 'madlan', 'kones2', 'facebook', 'agent'];

const SOURCE_COLORS: Record<Source, string> = {
  yad2: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
  madlan: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
  kones2: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
  facebook: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
  agent: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
};

export default function SourceLinks() {
  const { filters, setFilter } = useAppStore();
  const active = filters.sources;

  const toggle = (s: Source) => {
    if (active.includes(s)) {
      if (active.length === 1) return; // keep at least one
      setFilter('sources', active.filter((x) => x !== s));
    } else {
      setFilter('sources', [...active, s]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center" dir="rtl">
      <span className="text-xs text-gray-500 font-medium">מקורות:</span>
      {ALL_SOURCES.map((s) => {
        const isActive = active.includes(s);
        const url = SOURCE_URLS[s];
        return (
          <div key={s} className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => toggle(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${SOURCE_COLORS[s]} ${!isActive ? 'opacity-40' : ''}`}
            >
              {SOURCE_LABELS[s]}
            </button>
            {url !== '#' && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

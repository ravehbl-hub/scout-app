'use client';
import { cn } from '@/lib/utils';

interface Option<T> {
  value: T;
  label: string;
  icon?: string;
  group?: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
}

export default function GroupedMultiSelect<T extends string>({ options, selected, onChange }: Props<T>) {
  const toggle = (val: T) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const groups = Array.from(new Set(options.map((o) => o.group ?? ''))).filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <div key={group}>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{group}</p>
          <div className="flex flex-wrap gap-1.5">
            {options
              .filter((o) => o.group === group)
              .map((opt) => {
                const active = selected.includes(opt.value);
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={cn(
                      'flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all',
                      active
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    )}
                  >
                    {opt.icon && <span>{opt.icon}</span>}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

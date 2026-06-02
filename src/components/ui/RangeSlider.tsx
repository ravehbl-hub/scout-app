'use client';
import * as Slider from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  format?: (v: number) => string;
  className?: string;
}

export default function RangeSlider({ label, min, max, step = 1, value, onChange, format, className }: Props) {
  const fmt = format ?? String;
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{label}</span>
        <span className="font-medium text-gray-700">{fmt(value[0])} – {fmt(value[1])}</span>
      </div>
      <Slider.Root
        className="relative flex items-center w-full h-5 select-none touch-none"
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        dir="rtl"
      >
        <Slider.Track className="relative bg-gray-200 rounded-full h-1.5 flex-1">
          <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </Slider.Root>
    </div>
  );
}

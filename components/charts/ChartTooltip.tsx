'use client';

import type { TooltipProps } from 'recharts';
import { compact } from '@/lib/format';

export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-sm border border-line bg-cream px-3 py-2 text-xs">
      <div className="text-2xs uppercase tracking-tracked text-stone">{label}</div>
      {payload.map(p => (
        <div key={String(p.dataKey)} className="mt-1 flex items-center gap-3">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ background: p.color ?? 'currentColor' }}
          />
          <span className="text-graphite">{p.name}</span>
          <span className="num ml-auto font-serif text-base text-charcoal">
            {typeof p.value === 'number' ? compact(p.value) : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

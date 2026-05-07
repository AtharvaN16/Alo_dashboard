'use client';

import { cn } from '@/lib/cn';
import { compact } from '@/lib/format';
import { BRAND_COLORS } from '@/lib/brand';

export type HBarRow = { label: string; value: number; color?: string; rightLabel?: string };

export function HorizontalBarBlock({
  rows, max, className,
}: { rows: HBarRow[]; max?: number; className?: string }) {
  const peak = max ?? Math.max(...rows.map(r => r.value));
  return (
    <ul className={cn('space-y-2', className)}>
      {rows.map(r => {
        const w = peak === 0 ? 0 : (r.value / peak) * 100;
        return (
          <li key={r.label} className="flex items-center gap-3 text-xs">
            <span className="w-32 shrink-0 text-graphite">{r.label}</span>
            <div className="flex-1">
              <div className="h-1.5 w-full bg-cream">
                <div
                  className="h-full transition-[width] duration-400 ease-out-quart"
                  style={{ width: `${w}%`, background: r.color ?? BRAND_COLORS.sage }}
                />
              </div>
            </div>
            <span className="num w-16 shrink-0 text-right font-mono text-charcoal">
              {r.rightLabel ?? compact(r.value)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

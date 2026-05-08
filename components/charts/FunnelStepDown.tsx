'use client';

import { compact, percent } from '@/lib/format';
import type { FunnelStep } from '@/lib/mock-data/engagement';

export function FunnelStepDown({ steps }: { steps: FunnelStep[] }) {
  const peak = steps[0]?.value ?? 1;
  return (
    <ol className="space-y-5">
      {steps.map((s, i) => {
        const widthPct = (s.value / peak) * 100;
        return (
          <li key={s.label}>
            <div className="flex items-baseline justify-between gap-4">
              <div className="text-xs uppercase tracking-tracked text-stone">{s.label}</div>
              <div className="num font-serif text-display-sm font-extralight text-charcoal">
                {compact(s.value)}
              </div>
            </div>
            <div className="mt-1 h-px w-full bg-line">
              <div
                className="h-full bg-charcoal transition-[width] duration-400 ease-out-quart"
                style={{ width: `${widthPct}%` }}
              />
            </div>
            {i < steps.length - 1 && (
              <div className="pt-2 text-xs text-graphite">
                {percent(s.rateToNext)} continue to {steps[i + 1].label.toLowerCase()}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

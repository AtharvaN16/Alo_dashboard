'use client';

import { cn } from '@/lib/cn';
import { percent } from '@/lib/format';

export type Stack = { label: string; pct: number; color: string };

export function StackedBarBlock({
  stacks, label, className,
}: { stacks: Stack[]; label?: string; className?: string }) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="pb-2 text-2xs uppercase tracking-tracked text-stone">{label}</div>
      )}
      <div className="flex h-3 w-full overflow-hidden rounded-sm">
        {stacks.map(s => (
          <div
            key={s.label}
            style={{ width: `${s.pct * 100}%`, background: s.color }}
            title={`${s.label}: ${percent(s.pct)}`}
            className="transition-opacity duration-200 ease-out-quart hover:opacity-80"
          />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5 text-xs">
        {stacks.map(s => (
          <li key={s.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-graphite">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="num font-mono text-charcoal">{percent(s.pct)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

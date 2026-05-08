import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

export type LedgerRow = {
  label: string;
  value: string;
  delta?: { sign: 'up' | 'down' | 'flat'; text: string };
};

export function MetricLedger({
  rows, className,
}: { rows: LedgerRow[]; className?: string }) {
  return (
    <dl className={cn('px-10', className)}>
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={cn(
            'flex items-baseline justify-between gap-6 py-6',
            i !== rows.length - 1 && 'border-b border-line',
          )}
        >
          <dt className="text-sm uppercase tracking-tracked text-stone">{r.label}</dt>
          <dd className="text-right">
            <div className="num font-mono text-4xl font-medium text-charcoal">{r.value}</div>
            {r.delta && <DeltaPill sign={r.delta.sign} text={r.delta.text} />}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function DeltaPill({ sign, text }: { sign: 'up' | 'down' | 'flat'; text: string }) {
  const Icon = sign === 'up' ? ArrowUp : sign === 'down' ? ArrowDown : Minus;
  return (
    <div
      className={cn(
        'mt-1 inline-flex items-center gap-1 text-sm font-medium',
        sign === 'up' && 'text-sage-deep',
        sign === 'down' && 'text-clay',
        sign === 'flat' && 'text-stone',
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span>{stripPriorSuffix(text)}</span>
    </div>
  );
}

function stripPriorSuffix(s: string): string {
  return s.replace(/\s*vs\s*(prior(\s+\w+)*|previous(\s+\w+)*)\s*$/i, '').trim();
}

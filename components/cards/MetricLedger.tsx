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
            'flex items-baseline justify-between gap-6 py-4',
            i !== rows.length - 1 && 'border-b border-line',
          )}
        >
          <dt className="text-2xs uppercase tracking-tracked text-stone">{r.label}</dt>
          <dd className="text-right">
            <div className="num font-mono text-3xl text-charcoal">{r.value}</div>
            {r.delta && (
              <div
                className={cn(
                  'text-xs',
                  r.delta.sign === 'up' && 'text-sage-deep',
                  r.delta.sign === 'down' && 'text-clay',
                  r.delta.sign === 'flat' && 'text-stone',
                )}
              >
                {r.delta.text}
              </div>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

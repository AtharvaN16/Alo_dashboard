import { cn } from '@/lib/cn';

export function AuthorityScale({ score, max = 100 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  return (
    <div className={cn('w-full')}>
      <div className="flex items-baseline gap-2">
        <span className="num font-serif text-display-md font-extralight text-charcoal">{score}</span>
        <span className="text-sm text-stone">/ {max}</span>
      </div>
      <div className="mt-3 h-px w-full bg-line">
        <div
          className="h-full bg-sage transition-[width] duration-400 ease-out-quart"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-2xs text-stone">
        <span>0</span><span>{max}</span>
      </div>
    </div>
  );
}

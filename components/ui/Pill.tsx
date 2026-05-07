'use client';

import { cn } from '@/lib/cn';

type PillProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
};

export function PillSegmented<T extends string>({
  options, value, onChange, size = 'md',
}: PillProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-full border border-line bg-bone p-0.5',
        size === 'sm' ? 'text-xs' : 'text-sm',
      )}
    >
      {options.map(opt => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt)}
            className={cn(
              'rounded-full px-3 py-1 transition-colors duration-200 ease-out-quart',
              active
                ? 'bg-charcoal text-bone'
                : 'text-graphite hover:text-charcoal',
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

export function PillToggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs',
        'transition-colors duration-200 ease-out-quart',
        checked
          ? 'border-charcoal bg-charcoal text-bone'
          : 'border-line bg-bone text-graphite hover:border-stone hover:text-charcoal',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          checked ? 'bg-sage' : 'bg-stone',
        )}
      />
      {label}
    </button>
  );
}

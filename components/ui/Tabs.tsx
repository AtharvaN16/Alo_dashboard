'use client';

import { cn } from '@/lib/cn';

type TabsProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
};

export function Tabs<T extends string>({ options, value, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" className="flex gap-6 border-b border-line">
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              '-mb-px border-b pb-2 text-sm transition-colors duration-200 ease-out-quart',
              active
                ? 'border-charcoal text-charcoal'
                : 'border-transparent text-stone hover:text-graphite',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

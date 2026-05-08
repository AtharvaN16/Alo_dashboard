'use client';

import { usePathname } from 'next/navigation';
import { PillSegmented, PillToggle } from '@/components/ui/Pill';
import { useDateRange } from './DateRangeContext';
import type { RangeLabel } from '@/lib/date-range';

const RANGE_OPTIONS: readonly RangeLabel[] = ['7D', '30D', '90D', '12M', 'YTD'];

const TITLES: Record<string, string> = {
  '/': 'Overview',
  '/traffic': 'Traffic',
  '/engagement': 'Engagement',
  '/audience': 'Audience',
  '/social': 'Social',
  '/seo': 'SEO',
  '/competitors': 'Competitors',
};

export function Topbar() {
  const pathname = usePathname();
  const { label, setLabel, compare, setCompare } = useDateRange();
  const title = TITLES[pathname] ?? 'Overview';

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface px-10 py-5">
      <h1 className="text-display-sm font-bold tracking-tight text-charcoal">{title}</h1>
      <div className="flex items-center gap-4">
        <PillSegmented
          options={RANGE_OPTIONS}
          value={label}
          onChange={setLabel}
          size="sm"
        />
        <PillToggle label="Compare to prev period" checked={compare} onChange={setCompare} />
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-xs uppercase tracking-tracked text-graphite">
          AY
        </div>
      </div>
    </header>
  );
}

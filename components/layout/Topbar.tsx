'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PillSegmented, PillToggle } from '@/components/ui/Pill';
import { useDateRange } from './DateRangeContext';
import type { RangeLabel } from '@/lib/date-range';
import { cn } from '@/lib/cn';

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

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-20 h-20 transition-colors duration-200 ease-out-quart',
        'border-b border-line',
        scrolled ? 'bg-surface shadow-sm' : 'bg-bone',
      )}
    >
      <div className="flex h-full items-center">
        <div className="flex w-60 shrink-0 items-center px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/alo-logo.svg" alt="Alo Yoga" className="h-12 w-auto" />
        </div>
        <div className="flex flex-1 items-center justify-between gap-6 pl-2 pr-10">
          <h1 className="text-3xl font-bold tracking-tight text-charcoal">{title}</h1>
          <div className="flex items-center gap-4">
            <PillSegmented
              options={RANGE_OPTIONS}
              value={label}
              onChange={setLabel}
              size="sm"
            />
            <PillToggle label="Compare to prev period" checked={compare} onChange={setCompare} />
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-xs font-medium uppercase tracking-tracked text-graphite">
              AY
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type ChartCardProps = {
  title: string;
  eyebrow?: string;
  detailHref?: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function ChartCard({
  title, eyebrow, detailHref, controls, children, className,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        'group rounded-lg border border-transparent bg-surface p-9',
        'transition-all duration-200 ease-out-quart',
        'hover:border-line hover:shadow-card-hover',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          {eyebrow && (
            <div className="text-xs uppercase tracking-tracked text-stone">{eyebrow}</div>
          )}
          <h3 className="text-3xl font-medium text-charcoal">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          {controls}
          {detailHref && (
            <Link
              href={detailHref}
              className="inline-flex items-center gap-1 text-xs uppercase tracking-tracked text-graphite transition-colors duration-200 ease-out-quart hover:text-charcoal"
            >
              View details <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          )}
        </div>
      </header>
      <div className="mt-8">{children}</div>
    </section>
  );
}

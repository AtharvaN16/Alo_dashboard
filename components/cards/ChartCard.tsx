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
        'group rounded-md border border-line bg-bone p-8',
        'transition-all duration-200 ease-out-quart',
        'hover:border-stone hover:shadow-hairline',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <div className="text-2xs uppercase tracking-tracked text-stone">{eyebrow}</div>
          )}
          <h3 className="font-serif text-2xl font-extralight text-charcoal">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          {controls}
          {detailHref && (
            <Link
              href={detailHref}
              className="inline-flex items-center gap-1 text-2xs uppercase tracking-tracked text-graphite transition-colors duration-200 ease-out-quart hover:text-charcoal"
            >
              View details <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          )}
        </div>
      </header>
      <div className="mt-6">{children}</div>
    </section>
  );
}

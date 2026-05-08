'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/cards/ChartCard';
import { HorizontalBarBlock } from '@/components/charts/HorizontalBarBlock';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { BRAND_COLORS } from '@/lib/brand';
import { ageGenderMatrix, topCountries, interests, keywords } from '@/lib/mock-data/audience';
import { integer, percent } from '@/lib/format';
import { cn } from '@/lib/cn';

const FILTERS = ['All', "Men's", "Women's", 'Workout', 'Lifestyle', 'Yoga'] as const;
type Filter = typeof FILTERS[number];

export default function AudiencePage() {
  const [filter, setFilter] = useState<Filter>('All');
  const filteredKeywords = useMemo(
    () => filter === 'All' ? keywords : keywords.filter(k => k.intent.toLowerCase() === filter.toLowerCase()),
    [filter],
  );

  return (
    <>
      <PageHeader description="Who's coming to Alo, where from, and what they're searching for." />

      <section className="grid grid-cols-12 gap-6 px-10 pb-10">
        <ChartCard title="Age x Gender" eyebrow="Sessions distribution" className="col-span-7">
          <div className="grid grid-cols-5 items-end gap-4 pt-2">
            {ageGenderMatrix.map(row => {
              const total = row.female + row.male + row.nonbinary;
              return (
                <div key={row.ageBracket} className="flex flex-col items-center gap-2">
                  <div className="flex h-48 w-full flex-col-reverse overflow-hidden rounded-sm">
                    <div style={{ height: `${(row.female / total) * 100}%`, background: BRAND_COLORS.sage }} />
                    <div style={{ height: `${(row.male / total) * 100}%`, background: BRAND_COLORS.charcoal }} />
                    <div style={{ height: `${(row.nonbinary / total) * 100}%`, background: BRAND_COLORS.clay }} />
                  </div>
                  <div className="text-xs text-stone">{row.ageBracket}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-graphite">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sage" /> Female</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-charcoal" /> Male</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-clay" /> Nonbinary</span>
          </div>
        </ChartCard>

        <ChartCard title="Interests" eyebrow="Affinity index" className="col-span-5">
          <HorizontalBarBlock
            rows={interests.map(i => ({
              label: i.label,
              value: i.affinity * 10,
              rightLabel: i.affinity.toFixed(1),
            }))}
          />
        </ChartCard>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 pb-10">
        <ChartCard title="Top Countries" eyebrow="Sessions" className="col-span-5">
          <HorizontalBarBlock
            rows={topCountries.map(c => ({ label: c.country, value: c.sessions }))}
          />
        </ChartCard>

        <ChartCard title="Targeted Keywords" eyebrow="Filter by intent" className="col-span-7">
          <div className="flex flex-wrap gap-2 pb-4">
            {FILTERS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors duration-200 ease-out-quart',
                  filter === f
                    ? 'border-charcoal bg-charcoal text-bone'
                    : 'border-line text-graphite hover:border-stone hover:text-charcoal',
                )}
              >
                {f}
              </button>
            ))}
          </div>
          {filteredKeywords.length === 0 ? (
            <EmptyState message="No keywords match this filter." />
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-tracked text-stone">
                <tr>
                  <th className="pb-3 text-left">Keyword</th>
                  <th className="pb-3 text-left">Intent</th>
                  <th className="pb-3 text-right">Volume</th>
                  <th className="pb-3 text-right">Position</th>
                  <th className="pb-3 text-right">Change</th>
                </tr>
              </thead>
              <tbody className="num font-mono">
                {filteredKeywords.map(k => (
                  <tr key={k.keyword} className="border-t border-line">
                    <td className="py-2.5 font-sans text-charcoal">{k.keyword}</td>
                    <td className="py-2.5"><Badge tone="neutral">{k.intent}</Badge></td>
                    <td className="py-2.5 text-right text-charcoal">{integer(k.volume)}</td>
                    <td className="py-2.5 text-right text-charcoal">{k.position}</td>
                    <td className={`py-2.5 text-right ${k.change > 0 ? 'text-sage-deep' : k.change < 0 ? 'text-clay' : 'text-stone'}`}>
                      {k.change > 0 ? `+${k.change}` : k.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ChartCard>
      </section>
    </>
  );
}

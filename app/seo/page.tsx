'use client';

import { ArrowUp } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/cards/ChartCard';
import { AreaChartBlock } from '@/components/charts/AreaChartBlock';
import { HorizontalBarBlock } from '@/components/charts/HorizontalBarBlock';
import { AuthorityScale } from '@/components/charts/AuthorityScale';
import { useSeoData } from '@/lib/hooks/usePageData';
import { topReferringDomains, anchorTextDistribution } from '@/lib/mock-data/seo';
import { BRANDS } from '@/lib/mock-data/story';
import { BRAND_COLORS } from '@/lib/brand';
import { compact, integer, percent } from '@/lib/format';

export default function SeoPage() {
  const seo = useSeoData('alo');
  const b = BRANDS.alo;

  return (
    <>
      <PageHeader description="Authority, backlinks, and the editorial network referring to alo.com." />

      {/* Editorial three-stack at top, no card frame */}
      <section className="grid grid-cols-3 divide-x divide-line border-y border-line px-10 py-2">
        <div className="space-y-3 px-6 py-10">
          <div className="text-sm uppercase tracking-tracked text-stone">Authority Score</div>
          <AuthorityScale score={b.authorityScore} />
        </div>
        <div className="space-y-3 px-6 py-10">
          <div className="text-sm uppercase tracking-tracked text-stone">Total Backlinks</div>
          <div className="num text-display-xl font-medium leading-none text-charcoal">
            {compact(b.backlinks)}
          </div>
          <div className="inline-flex items-center gap-1 text-sm font-medium text-sage-deep">
            <ArrowUp className="h-4 w-4" aria-hidden /> 18% YoY
          </div>
        </div>
        <div className="space-y-3 px-6 py-10">
          <div className="text-sm uppercase tracking-tracked text-stone">Referring Domains</div>
          <div className="num text-display-xl font-medium leading-none text-charcoal">
            {compact(b.referringDomains)}
          </div>
          <div className="inline-flex items-center gap-1 text-sm font-medium text-sage-deep">
            <ArrowUp className="h-4 w-4" aria-hidden /> 9% YoY
          </div>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 py-10">
        <ChartCard title="Backlinks Over Time" eyebrow="Cumulative" className="col-span-8">
          <AreaChartBlock
            series={[{ key: 'backlinks', name: 'Backlinks', color: BRAND_COLORS.sage, data: seo.backlinks }]}
            height={280}
          />
        </ChartCard>
        <ChartCard title="Anchor Text" eyebrow="Distribution" className="col-span-4">
          <HorizontalBarBlock
            rows={anchorTextDistribution.map(a => ({
              label: a.label,
              value: a.share * 100,
              rightLabel: percent(a.share),
            }))}
          />
        </ChartCard>
      </section>

      <section className="px-10 pb-16">
        <ChartCard title="Top Referring Domains" eyebrow="Sorted by authority">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-tracked text-stone">
              <tr>
                <th className="pb-3 text-left">Domain</th>
                <th className="pb-3 text-right">Authority</th>
                <th className="pb-3 text-right">Backlinks</th>
                <th className="pb-3 text-right">First Seen</th>
              </tr>
            </thead>
            <tbody className="num font-mono">
              {topReferringDomains.map(d => (
                <tr key={d.domain} className="border-t border-line">
                  <td className="py-2.5 font-sans text-charcoal">{d.domain}</td>
                  <td className="py-2.5 text-right text-charcoal">{d.authority}</td>
                  <td className="py-2.5 text-right text-charcoal">{integer(d.backlinks)}</td>
                  <td className="py-2.5 text-right text-graphite">{d.firstSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
      </section>
    </>
  );
}

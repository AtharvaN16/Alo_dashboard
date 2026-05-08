'use client';

import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/cards/ChartCard';
import { CompetitorToggleStandalone } from '@/components/cards/CompetitorToggle';
import { LineChartBlock } from '@/components/charts/LineChartBlock';
import { FunnelStepDown } from '@/components/charts/FunnelStepDown';
import { useEngagementData } from '@/lib/hooks/usePageData';
import { engagedSessionsSeries } from '@/lib/mock-data/engagement';
import { useDateRange } from '@/components/layout/DateRangeContext';
import { sliceSeries } from '@/lib/date-range';
import { BRAND_COLORS } from '@/lib/brand';
import { compact, percent, duration, integer, signedPercent } from '@/lib/format';
import { BRANDS } from '@/lib/mock-data/story';

export default function EngagementPage() {
  const { range } = useDateRange();
  const eng = useEngagementData('alo');
  const [compare, setCompare] = useState(false);

  const heroSeries = compare
    ? [
        { key: 'alo',  name: 'Alo Yoga',  color: BRAND_COLORS.sage, data: eng.engaged.series },
        { key: 'lulu', name: 'Lululemon', color: BRAND_COLORS.lulu, data: sliceSeries(engagedSessionsSeries('lulu'), range) },
        { key: 'gym',  name: 'Gymshark',  color: BRAND_COLORS.gym,  data: sliceSeries(engagedSessionsSeries('gym'),  range) },
      ]
    : [{ key: 'alo', name: 'Engaged Sessions', color: BRAND_COLORS.sage, data: eng.engaged.series }];

  return (
    <>
      <PageHeader description="How deeply visitors interact and where they drop off in the funnel." />

      <section className="px-10 pb-10">
        <ChartCard
          title="Engaged Sessions"
          eyebrow="Sessions with meaningful interaction"
          controls={<CompetitorToggleStandalone defaultOn={compare} onChange={setCompare} />}
        >
          <LineChartBlock series={heroSeries} height={320} />
        </ChartCard>
      </section>

      {/* Editorial ledger row of 4 KPIs, no cards */}
      <section className="grid grid-cols-4 divide-x divide-line border-y border-line px-10 py-2">
        {[
          { label: 'Engagement Rate', value: percent(eng.erate.avg), delta: signedPercent(eng.erate.delta), sign: (eng.erate.delta >= 0 ? 'up' : 'down') as 'up' | 'down' },
          { label: 'Avg Engagement Time', value: duration(eng.time.avg), delta: signedPercent(eng.time.delta), sign: (eng.time.delta >= 0 ? 'up' : 'down') as 'up' | 'down' },
          { label: 'Bounce Rate',  value: percent(eng.bounce.avg), delta: signedPercent(eng.bounce.delta), sign: (eng.bounce.delta <= 0 ? 'up' : 'down') as 'up' | 'down' },
          { label: 'Events / Session', value: '8.4', delta: '+0.6', sign: 'up' as 'up' | 'down' },
        ].map((m, i) => {
          const Arrow = m.sign === 'up' ? ArrowUp : ArrowDown;
          const tone = m.sign === 'up' ? 'text-sage-deep' : 'text-clay';
          return (
            <div key={m.label} className={`px-6 py-8 ${i === 0 ? 'pl-0' : ''}`}>
              <div className="text-sm uppercase tracking-tracked text-stone">{m.label}</div>
              <div className="num pt-3 text-display-md font-medium text-charcoal">{m.value}</div>
              <div className={`pt-2 inline-flex items-center gap-1 text-sm font-medium ${tone}`}>
                <Arrow className="h-4 w-4" aria-hidden />
                {m.delta}
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 py-10">
        <ChartCard title="Top Engaged Pages" eyebrow="Sorted by sessions" className="col-span-7">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-tracked text-stone">
              <tr>
                <th className="pb-3 text-left">URL</th>
                <th className="pb-3 text-right">Sessions</th>
                <th className="pb-3 text-right">Avg Time</th>
                <th className="pb-3 text-right">Engagement Rate</th>
              </tr>
            </thead>
            <tbody className="num font-mono">
              {eng.topPages.map(p => (
                <tr key={p.url} className="border-t border-line">
                  <td className="py-2.5 font-sans text-charcoal">{p.url}</td>
                  <td className="py-2.5 text-right text-charcoal">{integer(p.sessions)}</td>
                  <td className="py-2.5 text-right text-charcoal">{duration(p.avgTimeSec)}</td>
                  <td className="py-2.5 text-right text-charcoal">{percent(p.engagementRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>

        <ChartCard title="Conversion Funnel" eyebrow="Sessions to purchase" className="col-span-5">
          <FunnelStepDown steps={eng.funnel} />
          <div className="mt-6 border-t border-line pt-3 text-xs text-graphite">
            Overall conversion rate: <span className="num font-mono text-charcoal">{percent(BRANDS.alo.conversionRate, 2)}</span>
          </div>
        </ChartCard>
      </section>
    </>
  );
}

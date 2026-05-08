'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/cards/ChartCard';
import { CompetitorToggleStandalone } from '@/components/cards/CompetitorToggle';
import { AreaChartBlock } from '@/components/charts/AreaChartBlock';
import { LineChartBlock } from '@/components/charts/LineChartBlock';
import { StackedBarBlock } from '@/components/charts/StackedBarBlock';
import { PillSegmented } from '@/components/ui/Pill';
import { useTrafficData } from '@/lib/hooks/usePageData';
import { trafficSeries } from '@/lib/mock-data/traffic';
import { useDateRange } from '@/components/layout/DateRangeContext';
import { sliceSeries } from '@/lib/date-range';
import { BRAND_COLORS } from '@/lib/brand';
import { compact, signedPercent, percent } from '@/lib/format';

const AGG = ['Daily', 'Weekly', 'Monthly', 'Yearly'] as const;
type Agg = typeof AGG[number];

function aggregate(data: { date: string; value: number }[], agg: Agg) {
  if (agg === 'Daily') return data;
  const buckets = new Map<string, number>();
  for (const p of data) {
    const d = new Date(p.date + 'T00:00:00Z');
    let key: string;
    if (agg === 'Weekly') {
      const day = d.getUTCDay();
      const monday = new Date(d.getTime() - ((day + 6) % 7) * 86_400_000);
      key = monday.toISOString().slice(0, 10);
    } else if (agg === 'Monthly') {
      key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    } else {
      key = String(d.getUTCFullYear());
    }
    buckets.set(key, (buckets.get(key) ?? 0) + p.value);
  }
  return Array.from(buckets.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export default function TrafficPage() {
  const { range } = useDateRange();
  const traffic = useTrafficData('alo');
  const [agg, setAgg] = useState<Agg>('Daily');
  const [compare, setCompare] = useState(false);

  const heroData = useMemo(() => aggregate(traffic.series, agg), [traffic.series, agg]);
  const compData = useMemo(() => ({
    lulu: aggregate(sliceSeries(trafficSeries('lulu'), range), agg),
    gym:  aggregate(sliceSeries(trafficSeries('gym'),  range), agg),
  }), [range, agg]);

  const heroSeries = compare
    ? [
        { key: 'alo',  name: 'Alo Yoga',  color: BRAND_COLORS.sage, data: heroData },
        { key: 'lulu', name: 'Lululemon', color: BRAND_COLORS.lulu, data: compData.lulu },
        { key: 'gym',  name: 'Gymshark',  color: BRAND_COLORS.gym,  data: compData.gym },
      ]
    : [{ key: 'alo', name: 'Sessions', color: BRAND_COLORS.sage, data: heroData }];

  return (
    <>
      <PageHeader description="Where the traffic is coming from, how much, and who's bringing it." />

      <section className="px-10 pb-10">
        <ChartCard
          title="Organic Sessions"
          eyebrow={`${signedPercent(traffic.delta)} vs prior period`}
          controls={
            <div className="flex items-center gap-3">
              <PillSegmented options={AGG} value={agg} onChange={setAgg} size="sm" />
              <CompetitorToggleStandalone defaultOn={compare} onChange={setCompare} />
            </div>
          }
        >
          <AreaChartBlock series={heroSeries} height={320} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 pb-10">
        <ChartCard title="Sessions" eyebrow="Total" className="col-span-6">
          <div className="num pb-3 font-serif text-display-sm font-extralight text-charcoal">
            {compact(traffic.total)}
          </div>
          <LineChartBlock
            series={[{ key: 'alo', name: 'Sessions', color: BRAND_COLORS.sage, data: traffic.series }]}
            height={140}
          />
        </ChartCard>

        <div className="col-span-6 grid grid-cols-1 gap-6">
          <ChartCard title="Users" eyebrow="Unique">
            <LineChartBlock
              series={[{ key: 'users', name: 'Users', color: BRAND_COLORS.charcoal, data: traffic.users.series }]}
              height={100}
            />
          </ChartCard>
          <ChartCard title="Pages / Session" eyebrow="Average">
            <LineChartBlock
              series={[{ key: 'pps', name: 'Pages/Session', color: BRAND_COLORS.sage, data: traffic.pps.series }]}
              height={100}
            />
          </ChartCard>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 pb-16">
        <ChartCard title="Sessions by Source" eyebrow="Channel split" className="col-span-8">
          <StackedBarBlock
            stacks={traffic.sourceBreakdown.map((s, i) => ({
              label: s.label,
              pct: s.pct,
              color: [BRAND_COLORS.sage, BRAND_COLORS.charcoal, BRAND_COLORS.lulu, BRAND_COLORS.gym, BRAND_COLORS.clay, BRAND_COLORS.stone][i],
            }))}
          />
        </ChartCard>
        <ChartCard title="Device" eyebrow="Sessions split" className="col-span-4">
          <div className="num pb-2 font-serif text-display-sm font-extralight text-charcoal">
            {compact(traffic.total)}
          </div>
          <StackedBarBlock
            stacks={traffic.deviceSplit.map((d, i) => ({
              label: d.label,
              pct: d.pct,
              color: [BRAND_COLORS.charcoal, BRAND_COLORS.sage, BRAND_COLORS.stone][i],
            }))}
          />
          <div className="pt-3 text-xs text-graphite">{percent(traffic.deviceSplit[0].pct)} mobile.</div>
        </ChartCard>
      </section>
    </>
  );
}

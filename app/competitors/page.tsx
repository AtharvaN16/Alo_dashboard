'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/cards/ChartCard';
import { LineChartBlock } from '@/components/charts/LineChartBlock';
import { HorizontalBarBlock } from '@/components/charts/HorizontalBarBlock';
import { StackedBarBlock } from '@/components/charts/StackedBarBlock';
import {
  trafficByBrand, engagementComparison, followersByPlatform,
  seoComparison, shareOfVoice, benchmarkTable,
} from '@/lib/mock-data/competitors';
import { BRANDS } from '@/lib/mock-data/story';
import { useDateRange } from '@/components/layout/DateRangeContext';
import { sliceSeries } from '@/lib/date-range';
import { compact, percent, signedPercent, integer } from '@/lib/format';

const PLATFORM_LABEL = { ig: 'Instagram', tiktok: 'TikTok', yt: 'YouTube' } as const;

export default function CompetitorsPage() {
  const { range } = useDateRange();
  const traffic = trafficByBrand();
  const eng = engagementComparison();
  const social = followersByPlatform();
  const seo = seoComparison();
  const sov = shareOfVoice();
  const bench = benchmarkTable();

  const trafficSeries = useMemo(() => [
    { key: 'alo',  name: 'Alo Yoga',  color: BRANDS.alo.color,  data: sliceSeries(traffic.alo,  range) },
    { key: 'lulu', name: 'Lululemon', color: BRANDS.lulu.color, data: sliceSeries(traffic.lulu, range) },
    { key: 'gym',  name: 'Gymshark',  color: BRANDS.gym.color,  data: sliceSeries(traffic.gym,  range) },
  ], [traffic, range]);

  return (
    <>
      <PageHeader description="How Alo stacks up against Lululemon and Gymshark across web, social, and search." />

      {/* Brand strip: 6 + 3 + 3 with hairlines */}
      <section className="grid grid-cols-12 divide-x divide-line border-y border-line px-10">
        <div className="col-span-6 py-8 pr-8">
          <div className="text-xs uppercase tracking-tracked text-stone">Alo Yoga</div>
          <div className="num font-serif text-display-lg font-extralight leading-none text-charcoal">
            {compact(BRANDS.alo.sessions)}
          </div>
          <div className="pt-2 text-sm text-sage-deep">{signedPercent(BRANDS.alo.yoyGrowth)} YoY</div>
          <p className="max-w-prose pt-3 text-xs text-graphite">
            Smaller absolute scale, leading on engagement and growth.
          </p>
        </div>
        <div className="col-span-3 px-6 py-8">
          <div className="text-xs uppercase tracking-tracked text-stone">Lululemon</div>
          <div className="num font-serif text-display-md font-extralight leading-none text-charcoal">
            {compact(BRANDS.lulu.sessions)}
          </div>
          <div className="pt-1 text-xs text-graphite">
            {(BRANDS.lulu.sessions / BRANDS.alo.sessions).toFixed(1)}x Alo traffic. {signedPercent(BRANDS.lulu.yoyGrowth)} YoY.
          </div>
        </div>
        <div className="col-span-3 px-6 py-8">
          <div className="text-xs uppercase tracking-tracked text-stone">Gymshark</div>
          <div className="num font-serif text-display-md font-extralight leading-none text-charcoal">
            {compact(BRANDS.gym.sessions)}
          </div>
          <div className="pt-1 text-xs text-graphite">
            {(BRANDS.gym.sessions / BRANDS.alo.sessions).toFixed(2)}x Alo traffic. {signedPercent(BRANDS.gym.yoyGrowth)} YoY.
          </div>
        </div>
      </section>

      <section className="px-10 py-10">
        <ChartCard title="Traffic" eyebrow="Sessions over time">
          <LineChartBlock series={trafficSeries} height={320} />
        </ChartCard>
      </section>

      <section className="px-10 pb-10">
        <ChartCard title="Engagement Comparison" eyebrow="Per metric">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-tracked text-stone">
              <tr>
                <th className="pb-3 text-left">Metric</th>
                <th className="pb-3 text-right">Alo</th>
                <th className="pb-3 text-right">Lululemon</th>
                <th className="pb-3 text-right">Gymshark</th>
              </tr>
            </thead>
            <tbody className="num font-mono">
              {[
                { m: 'Engagement Rate',   k: 'engagementRate' as const, fmt: (v: number) => percent(v) },
                { m: 'Avg Session (sec)', k: 'avgSessionDurationSec' as const, fmt: (v: number) => `${v}s` },
                { m: 'Pages / Session',   k: 'pagesPerSession' as const, fmt: (v: number) => v.toFixed(1) },
                { m: 'Bounce Rate',       k: 'bounceRate' as const, fmt: (v: number) => percent(v) },
              ].map(row => (
                <tr key={row.m} className="border-t border-line">
                  <td className="py-2.5 font-sans text-charcoal">{row.m}</td>
                  <td className="py-2.5 text-right text-charcoal">{row.fmt(eng[0][row.k])}</td>
                  <td className="py-2.5 text-right text-charcoal">{row.fmt(eng[1][row.k])}</td>
                  <td className="py-2.5 text-right text-charcoal">{row.fmt(eng[2][row.k])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 pb-10">
        <ChartCard title="Social Reach" eyebrow="Followers per platform" className="col-span-8">
          <div className="space-y-6">
            {social.map(group => (
              <div key={group.platform}>
                <div className="pb-2 text-xs uppercase tracking-tracked text-stone">
                  {PLATFORM_LABEL[group.platform]}
                </div>
                <HorizontalBarBlock
                  rows={group.rows.map(r => ({ label: r.name, value: r.followers, color: r.color }))}
                />
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="SEO" eyebrow="Authority / Backlinks / Domains" className="col-span-4">
          <div className="space-y-4">
            {seo.map(b => (
              <div key={b.brand} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-2 text-sm text-charcoal">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: b.color }} />
                    {b.name}
                  </div>
                  <div className="num font-mono text-xs text-graphite">AS {b.authorityScore}</div>
                </div>
                <div className="num pt-1 font-mono text-xs text-graphite">
                  {compact(b.backlinks)} backlinks. {compact(b.referringDomains)} domains.
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 pb-16">
        <ChartCard title="Share of Voice" eyebrow="Organic traffic share" className="col-span-4">
          <StackedBarBlock
            stacks={sov.map(s => ({
              label: BRANDS[s.brand].name,
              pct: s.pct,
              color: BRANDS[s.brand].color,
            }))}
          />
        </ChartCard>

        <ChartCard title="Benchmark" eyebrow="vs industry average" className="col-span-8">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-tracked text-stone">
              <tr>
                <th className="pb-3 text-left">Metric</th>
                <th className="pb-3 text-right">Alo</th>
                <th className="pb-3 text-right">Lulu</th>
                <th className="pb-3 text-right">Gym</th>
                <th className="pb-3 text-right">Industry Avg</th>
              </tr>
            </thead>
            <tbody className="num font-mono">
              {bench.map(row => {
                const fmt = (v: number) =>
                  row.format === 'percent' ? percent(v, 2)
                  : row.format === 'compact' ? compact(v)
                  : integer(v);
                const winnerVal = Math.max(row.alo, row.lulu, row.gym);
                const cellTone = (v: number) => v === winnerVal ? 'text-sage-deep' : 'text-charcoal';
                return (
                  <tr key={row.metric} className="border-t border-line">
                    <td className="py-2.5 font-sans text-charcoal">{row.metric}</td>
                    <td className={`py-2.5 text-right ${cellTone(row.alo)}`}>{fmt(row.alo)}</td>
                    <td className={`py-2.5 text-right ${cellTone(row.lulu)}`}>{fmt(row.lulu)}</td>
                    <td className={`py-2.5 text-right ${cellTone(row.gym)}`}>{fmt(row.gym)}</td>
                    <td className="py-2.5 text-right text-stone">{fmt(row.industry)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ChartCard>
      </section>
    </>
  );
}

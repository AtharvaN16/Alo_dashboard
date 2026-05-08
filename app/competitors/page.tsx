'use client';

import { useMemo } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
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
                { m: 'Engagement Rate',   k: 'engagementRate' as const, fmt: (v: number) => percent(v), higherIsBetter: true },
                { m: 'Avg Session (sec)', k: 'avgSessionDurationSec' as const, fmt: (v: number) => `${v}s`, higherIsBetter: true },
                { m: 'Pages / Session',   k: 'pagesPerSession' as const, fmt: (v: number) => v.toFixed(1), higherIsBetter: true },
                { m: 'Bounce Rate',       k: 'bounceRate' as const, fmt: (v: number) => percent(v), higherIsBetter: false },
              ].map(row => {
                const vals = [eng[0][row.k], eng[1][row.k], eng[2][row.k]] as const;
                const winnerIdx = row.higherIsBetter
                  ? vals.indexOf(Math.max(...vals))
                  : vals.indexOf(Math.min(...vals));
                const trends = [
                  { sign: BRANDS.alo.yoyGrowth >= 0 ? 'up' : 'down', pct: BRANDS.alo.yoyGrowth },
                  { sign: BRANDS.lulu.yoyGrowth >= 0 ? 'up' : 'down', pct: BRANDS.lulu.yoyGrowth },
                  { sign: BRANDS.gym.yoyGrowth >= 0 ? 'up' : 'down', pct: BRANDS.gym.yoyGrowth },
                ] as const;
                const renderCell = (v: number, idx: number) => {
                  const isWinner = idx === winnerIdx;
                  const t = trends[idx];
                  const TrendIcon = t.sign === 'up' ? ArrowUp : ArrowDown;
                  return (
                    <td key={idx} className={`py-2.5 text-right ${isWinner ? 'font-bold text-charcoal' : 'text-graphite'}`}>
                      <span className="inline-flex items-baseline gap-1.5">
                        {row.fmt(v)}
                        <TrendIcon
                          className={`h-3 w-3 self-center ${t.sign === 'up' ? 'text-sage-deep' : 'text-clay'}`}
                          aria-hidden
                        />
                      </span>
                    </td>
                  );
                };
                return (
                  <tr key={row.m} className="border-t border-line">
                    <td className="py-2.5 font-sans text-charcoal">{row.m}</td>
                    {vals.map((v, i) => renderCell(v, i))}
                  </tr>
                );
              })}
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
          <div className="space-y-5">
            {seo.map(b => {
              const winner = Math.max(BRANDS.alo.authorityScore, BRANDS.lulu.authorityScore, BRANDS.gym.authorityScore);
              const isLeader = b.authorityScore === winner;
              return (
                <div key={b.brand} className="border-t border-line pt-4 first:border-t-0 first:pt-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-center gap-2 text-base text-charcoal">
                      <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: b.color }} />
                      {b.name}
                    </div>
                    <div className={`num text-3xl ${isLeader ? 'font-bold text-charcoal' : 'font-medium text-graphite'}`}>
                      {b.authorityScore}
                    </div>
                  </div>
                  <div className="num pt-1 text-xs text-graphite">
                    {compact(b.backlinks)} backlinks · {compact(b.referringDomains)} domains
                  </div>
                </div>
              );
            })}
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

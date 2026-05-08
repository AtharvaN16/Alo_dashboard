'use client';

import { useState } from 'react';
import { EditorialLede } from '@/components/cards/EditorialLede';
import { MetricLedger, type LedgerRow } from '@/components/cards/MetricLedger';
import { ChartCard } from '@/components/cards/ChartCard';
import { CompetitorToggleStandalone } from '@/components/cards/CompetitorToggle';
import { AreaChartBlock } from '@/components/charts/AreaChartBlock';
import { LineChartBlock } from '@/components/charts/LineChartBlock';
import { StackedBarBlock } from '@/components/charts/StackedBarBlock';
import { HorizontalBarBlock } from '@/components/charts/HorizontalBarBlock';
import { AuthorityScale } from '@/components/charts/AuthorityScale';
import { useTrafficData, useEngagementData, useSocialData, useSeoData } from '@/lib/hooks/usePageData';
import { trafficSeries } from '@/lib/mock-data/traffic';
import { followerSeries } from '@/lib/mock-data/social';
import { keywords } from '@/lib/mock-data/audience';
import { topCountries, ageGenderMatrix } from '@/lib/mock-data/audience';
import { BRANDS } from '@/lib/mock-data/story';
import { BRAND_COLORS } from '@/lib/brand';
import { compact, percent, signedPercent, integer } from '@/lib/format';
import { sliceSeries } from '@/lib/date-range';
import { useDateRange } from '@/components/layout/DateRangeContext';

export default function Overview() {
  const { range } = useDateRange();
  const traffic = useTrafficData('alo');
  const eng = useEngagementData('alo');
  const social = useSocialData('all', 'alo');
  const seo = useSeoData('alo');

  const [trafficCompare, setTrafficCompare] = useState(false);
  const [socialCompare, setSocialCompare] = useState(false);

  const ledgerRows: LedgerRow[] = [
    { label: 'Engaged Sessions', value: compact(BRANDS.alo.sessions * BRANDS.alo.engagementRate), delta: { sign: 'up', text: '+22.1% vs prior' } },
    { label: 'Conversion Rate',  value: percent(BRANDS.alo.conversionRate, 2),                     delta: { sign: 'up', text: '+0.6pp vs prior' } },
    { label: 'Total Backlinks',  value: compact(BRANDS.alo.backlinks),                              delta: { sign: 'up', text: '+4.2% vs prior' } },
  ];

  const trafficSeriesProps = trafficCompare
    ? [
        { key: 'alo',  name: 'Alo Yoga',  color: BRAND_COLORS.sage, data: sliceSeries(trafficSeries('alo'),  range) },
        { key: 'lulu', name: 'Lululemon', color: BRAND_COLORS.lulu, data: sliceSeries(trafficSeries('lulu'), range) },
        { key: 'gym',  name: 'Gymshark',  color: BRAND_COLORS.gym,  data: sliceSeries(trafficSeries('gym'),  range) },
      ]
    : [{ key: 'alo', name: 'Organic Sessions', color: BRAND_COLORS.sage, data: traffic.series }];

  const igSeries = social.seriesByPlatform.find(s => s.platform === 'ig')?.data ?? [];
  const tiktokSeries = social.seriesByPlatform.find(s => s.platform === 'tiktok')?.data ?? [];
  const ytSeries = social.seriesByPlatform.find(s => s.platform === 'yt')?.data ?? [];

  const socialSeriesProps = socialCompare
    ? [
        { key: 'alo',  name: 'Alo Yoga IG',  color: BRAND_COLORS.sage, data: sliceSeries(followerSeries('alo',  'ig'), range) },
        { key: 'lulu', name: 'Lululemon IG', color: BRAND_COLORS.lulu, data: sliceSeries(followerSeries('lulu', 'ig'), range) },
        { key: 'gym',  name: 'Gymshark IG',  color: BRAND_COLORS.gym,  data: sliceSeries(followerSeries('gym',  'ig'), range) },
      ]
    : [
        { key: 'ig',     name: 'Instagram', color: BRAND_COLORS.sage,     data: igSeries },
        { key: 'tiktok', name: 'TikTok',    color: BRAND_COLORS.charcoal, data: tiktokSeries },
        { key: 'yt',     name: 'YouTube',   color: BRAND_COLORS.clay,     data: ytSeries },
      ];

  return (
    <>
      {/* Row 1: Editorial ledger lede */}
      <section className="grid grid-cols-12 gap-6 px-0 pb-12 pt-8">
        <div className="col-span-7">
          <EditorialLede
            eyebrow="Organic sessions"
            number={compact(BRANDS.alo.sessions)}
            narrative={`up ${signedPercent(BRANDS.alo.yoyGrowth).slice(1)} from prior 30 days, led by men's vertical search.`}
          />
        </div>
        <div className="col-span-5">
          <MetricLedger rows={ledgerRows} />
        </div>
      </section>

      {/* Row 2: Hero traffic + source split */}
      <section className="grid grid-cols-12 gap-6 px-10 pb-12">
        <ChartCard
          title="Organic Traffic"
          eyebrow="Sessions"
          detailHref="/traffic"
          controls={<CompetitorToggleStandalone defaultOn={trafficCompare} onChange={setTrafficCompare} />}
          className="col-span-8"
        >
          <AreaChartBlock series={trafficSeriesProps} />
        </ChartCard>

        <ChartCard
          title="Sessions by Source"
          eyebrow="Channel split"
          detailHref="/traffic"
          className="col-span-4"
        >
          <StackedBarBlock
            stacks={traffic.sourceBreakdown.map((s, i) => ({
              label: s.label,
              pct: s.pct,
              color: [BRAND_COLORS.sage, BRAND_COLORS.charcoal, BRAND_COLORS.lulu, BRAND_COLORS.gym, BRAND_COLORS.clay, BRAND_COLORS.stone][i],
            }))}
          />
        </ChartCard>
      </section>

      {/* Row 3: Engagement + Social growth */}
      <section className="grid grid-cols-12 gap-6 px-10 pb-12">
        <ChartCard
          title="Engagement Rate"
          eyebrow="Engaged sessions / total"
          detailHref="/engagement"
          className="col-span-6"
        >
          <LineChartBlock
            series={[{ key: 'erate', name: 'Engagement Rate', color: BRAND_COLORS.sage, data: eng.erate }]}
          />
        </ChartCard>
        <ChartCard
          title="Follower Growth"
          eyebrow="IG / TikTok / YT"
          detailHref="/social"
          controls={<CompetitorToggleStandalone defaultOn={socialCompare} onChange={setSocialCompare} />}
          className="col-span-6"
        >
          <LineChartBlock series={socialSeriesProps} />
        </ChartCard>
      </section>

      {/* Row 4: Top keywords + SEO three-stack */}
      <section className="grid grid-cols-12 gap-6 px-10 pb-12">
        <ChartCard title="Top Keywords" eyebrow="Sorted by volume" detailHref="/audience" className="col-span-8">
          <table className="w-full text-sm">
            <thead className="text-2xs uppercase tracking-tracked text-stone">
              <tr>
                <th className="pb-3 text-left">Keyword</th>
                <th className="pb-3 text-left">Intent</th>
                <th className="pb-3 text-right">Volume</th>
                <th className="pb-3 text-right">Position</th>
                <th className="pb-3 text-right">Change</th>
              </tr>
            </thead>
            <tbody className="num font-mono">
              {keywords.slice(0, 8).map(k => (
                <tr key={k.keyword} className="border-t border-line">
                  <td className="py-2.5 font-sans text-charcoal">{k.keyword}</td>
                  <td className="py-2.5 font-sans text-graphite">{k.intent}</td>
                  <td className="py-2.5 text-right text-charcoal">{integer(k.volume)}</td>
                  <td className="py-2.5 text-right text-charcoal">{k.position}</td>
                  <td className={`py-2.5 text-right ${k.change > 0 ? 'text-sage-deep' : k.change < 0 ? 'text-clay' : 'text-stone'}`}>
                    {k.change > 0 ? `+${k.change}` : k.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>

        <div className="col-span-4">
          <div className="grid grid-cols-1 divide-y divide-line border-y border-line py-2">
            <div className="py-5">
              <div className="text-2xs uppercase tracking-tracked text-stone">Authority Score</div>
              <AuthorityScale score={BRANDS.alo.authorityScore} />
            </div>
            <div className="py-5">
              <div className="text-2xs uppercase tracking-tracked text-stone">Total Backlinks</div>
              <div className="num font-serif text-display-md font-extralight text-charcoal">
                {compact(BRANDS.alo.backlinks)}
              </div>
            </div>
            <div className="py-5">
              <div className="text-2xs uppercase tracking-tracked text-stone">Referring Domains</div>
              <div className="num font-serif text-display-md font-extralight text-charcoal">
                {compact(BRANDS.alo.referringDomains)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 5: Geo + Demographics */}
      <section className="grid grid-cols-12 gap-6 px-10 pb-16">
        <ChartCard title="Top Countries" eyebrow="Sessions" className="col-span-6">
          <HorizontalBarBlock
            rows={topCountries.map(c => ({ label: c.country, value: c.sessions }))}
          />
        </ChartCard>
        <ChartCard title="Demographics" eyebrow="Age x Gender" className="col-span-6">
          <div className="grid grid-cols-5 items-end gap-2 pt-2">
            {ageGenderMatrix.map(row => {
              const total = row.female + row.male + row.nonbinary;
              return (
                <div key={row.ageBracket} className="flex flex-col items-center gap-2">
                  <div className="flex h-32 w-full flex-col-reverse overflow-hidden rounded-sm">
                    <div style={{ height: `${(row.female / total) * 100}%`, background: BRAND_COLORS.sage }} />
                    <div style={{ height: `${(row.male / total) * 100}%`, background: BRAND_COLORS.charcoal }} />
                    <div style={{ height: `${(row.nonbinary / total) * 100}%`, background: BRAND_COLORS.clay }} />
                  </div>
                  <div className="text-2xs text-stone">{row.ageBracket}</div>
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
      </section>
    </>
  );
}

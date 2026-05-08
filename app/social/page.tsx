'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/cards/ChartCard';
import { CompetitorToggleStandalone } from '@/components/cards/CompetitorToggle';
import { LineChartBlock } from '@/components/charts/LineChartBlock';
import { Tabs } from '@/components/ui/Tabs';
import { useSocialData } from '@/lib/hooks/usePageData';
import { followerSeries, topPosts, type Platform } from '@/lib/mock-data/social';
import { useDateRange } from '@/components/layout/DateRangeContext';
import { sliceSeries } from '@/lib/date-range';
import { BRAND_COLORS } from '@/lib/brand';
import { compact, percent, integer } from '@/lib/format';

const TABS = [
  { value: 'all',    label: 'All' },
  { value: 'ig',     label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'yt',     label: 'YouTube' },
] as const;

const PLATFORM_LABEL: Record<Platform, string> = { ig: 'Instagram', tiktok: 'TikTok', yt: 'YouTube' };
const PLATFORM_COLOR: Record<Platform, string> = {
  ig: BRAND_COLORS.sage,
  tiktok: BRAND_COLORS.charcoal,
  yt: BRAND_COLORS.clay,
};

export default function SocialPage() {
  const { range } = useDateRange();
  const [tab, setTab] = useState<typeof TABS[number]['value']>('all');
  const [compare, setCompare] = useState(false);
  const social = useSocialData(tab, 'alo');

  const baseSeries = social.seriesByPlatform.map(s => ({
    key: s.platform,
    name: PLATFORM_LABEL[s.platform],
    color: PLATFORM_COLOR[s.platform],
    data: s.data,
  }));

  const compareSeries = compare && tab !== 'all'
    ? [
        { key: 'alo',  name: `Alo ${PLATFORM_LABEL[tab]}`,  color: BRAND_COLORS.sage, data: sliceSeries(followerSeries('alo',  tab), range) },
        { key: 'lulu', name: `Lulu ${PLATFORM_LABEL[tab]}`, color: BRAND_COLORS.lulu, data: sliceSeries(followerSeries('lulu', tab), range) },
        { key: 'gym',  name: `Gym ${PLATFORM_LABEL[tab]}`,  color: BRAND_COLORS.gym,  data: sliceSeries(followerSeries('gym',  tab), range) },
      ]
    : null;

  return (
    <>
      <PageHeader description="Audience growth and engagement across IG, TikTok, and YouTube." />

      <div className="px-10 pb-6">
        <Tabs options={TABS} value={tab} onChange={setTab} />
      </div>

      <section className="px-10 pb-10">
        <ChartCard
          title="Follower Growth"
          eyebrow={tab === 'all' ? 'All platforms' : PLATFORM_LABEL[tab]}
          controls={tab !== 'all' ? <CompetitorToggleStandalone defaultOn={compare} onChange={setCompare} /> : undefined}
        >
          <LineChartBlock series={compareSeries ?? baseSeries} height={320} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-4 divide-x divide-line border-y border-line px-10 py-2">
        {[
          { label: 'Avg Likes',       value: integer(social.metrics.avgLikes) },
          { label: 'Avg Comments',    value: integer(social.metrics.avgComments) },
          { label: 'Avg Shares',      value: integer(social.metrics.avgShares) },
          { label: 'Engagement Rate', value: percent(social.metrics.engagementRate, 2) },
        ].map((m, i) => (
          <div key={m.label} className={`px-6 py-6 ${i === 0 ? 'pl-0' : ''}`}>
            <div className="text-2xs uppercase tracking-tracked text-stone">{m.label}</div>
            <div className="num font-serif text-display-sm font-extralight text-charcoal">{m.value}</div>
          </div>
        ))}
      </section>

      <section className="px-10 py-10">
        <ChartCard title="Top Posts" eyebrow="Last 30 days">
          <div className="grid grid-cols-6 gap-4">
            {topPosts.map((post, i) => {
              const span = post.feature ? 'col-span-3 row-span-2 aspect-square' : 'col-span-3 aspect-[2/1]';
              return (
                <div key={i} className={`flex flex-col justify-end border border-line bg-cream p-4 ${span}`}>
                  <div className="text-2xs uppercase tracking-tracked text-stone">
                    {PLATFORM_LABEL[post.platform]}
                  </div>
                  <div className="mt-1 font-serif text-base text-charcoal">{post.caption}</div>
                  <div className="mt-3 flex gap-4 text-2xs text-graphite num font-mono">
                    <span>{compact(post.likes)} likes</span>
                    <span>{compact(post.comments)} cm</span>
                    <span>{compact(post.shares)} sh</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </section>
    </>
  );
}

'use client';

import { useMemo } from 'react';
import { useDateRange } from '@/components/layout/DateRangeContext';
import { sliceSeries, totalOf, deltaPct } from '@/lib/date-range';
import type { TimePoint } from '@/lib/generators';
import {
  trafficSeries, usersSeries, pagesPerSessionSeries, sourceBreakdown, deviceSplit,
} from '@/lib/mock-data/traffic';
import {
  engagedSessionsSeries, engagementRateSeries, avgEngagementTimeSeries, bounceRateSeries,
  topEngagedPages, funnel,
} from '@/lib/mock-data/engagement';
import {
  followerSeries, engagementMetrics, type Platform,
} from '@/lib/mock-data/social';
import { authorityScoreSeries, backlinksSeries } from '@/lib/mock-data/seo';
import type { BrandKey } from '@/lib/brand';

function avgOf(points: TimePoint[]): number {
  if (points.length === 0) return 0;
  return points.reduce((s, p) => s + p.value, 0) / points.length;
}

type Aggregate = {
  series: TimePoint[];
  total: number;
  avg: number;
  end: number;
  delta: number;
};

function aggregate(full: TimePoint[], range: { start: Date; end: Date; previous: { start: Date; end: Date } }): Aggregate {
  const sliced = sliceSeries(full, range);
  const prev = sliceSeries(full, range.previous);
  const total = totalOf(sliced);
  const prevTotal = totalOf(prev);
  const avg = avgOf(sliced);
  const prevAvg = avgOf(prev);
  const end = sliced.length ? sliced[sliced.length - 1].value : 0;
  // For sums (sessions): delta on totals. For rates/durations: delta on avg.
  // Caller picks the right field — we expose both.
  return { series: sliced, total, avg, end, delta: deltaPct(total, prevTotal) };
}

function aggregateAvg(full: TimePoint[], range: { start: Date; end: Date; previous: { start: Date; end: Date } }): Aggregate {
  const sliced = sliceSeries(full, range);
  const prev = sliceSeries(full, range.previous);
  const total = totalOf(sliced);
  const avg = avgOf(sliced);
  const prevAvg = avgOf(prev);
  const end = sliced.length ? sliced[sliced.length - 1].value : 0;
  return { series: sliced, total, avg, end, delta: deltaPct(avg, prevAvg) };
}

export function useTrafficData(brand: BrandKey = 'alo') {
  const { range } = useDateRange();
  return useMemo(() => {
    const sessions = aggregate(trafficSeries(brand), range);
    const users = aggregate(usersSeries(brand), range);
    const pps = aggregateAvg(pagesPerSessionSeries(brand), range);
    return {
      // legacy aliases
      series: sessions.series,
      total: sessions.total,
      delta: sessions.delta,
      // new
      sessions,
      users,
      pps,
      sourceBreakdown: sourceBreakdown(brand),
      deviceSplit: deviceSplit(brand),
    };
  }, [brand, range]);
}

export function useEngagementData(brand: BrandKey = 'alo') {
  const { range } = useDateRange();
  return useMemo(() => {
    const engaged = aggregate(engagedSessionsSeries(brand), range);
    const erate = aggregateAvg(engagementRateSeries(brand), range);
    const time = aggregateAvg(avgEngagementTimeSeries(brand), range);
    const bounce = aggregateAvg(bounceRateSeries(brand), range);
    return {
      engaged,
      erate,
      time,
      bounce,
      // legacy field aliases (raw sliced series)
      legacyEngaged: engaged.series,
      topPages: topEngagedPages(),
      funnel: funnel(brand),
    };
  }, [brand, range]);
}

export function useSocialData(platform: Platform | 'all', brand: BrandKey = 'alo') {
  const { range } = useDateRange();
  return useMemo(() => {
    const platforms: Platform[] = platform === 'all' ? ['ig', 'tiktok', 'yt'] : [platform];
    const seriesByPlatform = platforms.map(p => {
      const agg = aggregate(followerSeries(brand, p), range);
      return { platform: p, data: agg.series, end: agg.end, delta: agg.delta };
    });
    const totalFollowersEnd = seriesByPlatform.reduce((s, p) => s + p.end, 0);
    return {
      seriesByPlatform,
      totalFollowersEnd,
      metrics: engagementMetrics(brand),
    };
  }, [brand, platform, range]);
}

export function useSeoData(brand: BrandKey = 'alo') {
  const { range } = useDateRange();
  return useMemo(() => {
    const authority = aggregateAvg(authorityScoreSeries(brand), range);
    const backlinks = aggregate(backlinksSeries(brand), range);
    return {
      // legacy series-only fields
      authority: authority.series,
      backlinks: backlinks.series,
      // new aggregates
      authorityScoreEnd: Math.round(authority.end),
      backlinksEnd: backlinks.end,
      backlinksDelta: backlinks.delta,
    };
  }, [brand, range]);
}

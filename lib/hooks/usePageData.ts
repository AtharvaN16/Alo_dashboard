'use client';

import { useMemo } from 'react';
import { useDateRange } from '@/components/layout/DateRangeContext';
import { sliceSeries, totalOf, deltaPct } from '@/lib/date-range';
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

export function useTrafficData(brand: BrandKey = 'alo') {
  const { range } = useDateRange();
  return useMemo(() => {
    const series = trafficSeries(brand);
    const sliced = sliceSeries(series, range);
    const prev = sliceSeries(series, range.previous);
    const total = totalOf(sliced);
    const prevTotal = totalOf(prev);
    return {
      series: sliced,
      total,
      delta: deltaPct(total, prevTotal),
      users: { series: sliceSeries(usersSeries(brand), range) },
      pps: { series: sliceSeries(pagesPerSessionSeries(brand), range) },
      sourceBreakdown: sourceBreakdown(brand),
      deviceSplit: deviceSplit(brand),
    };
  }, [brand, range]);
}

export function useEngagementData(brand: BrandKey = 'alo') {
  const { range } = useDateRange();
  return useMemo(() => {
    const engaged = sliceSeries(engagedSessionsSeries(brand), range);
    const erate = sliceSeries(engagementRateSeries(brand), range);
    const time = sliceSeries(avgEngagementTimeSeries(brand), range);
    const bounce = sliceSeries(bounceRateSeries(brand), range);
    return {
      engaged,
      erate,
      time,
      bounce,
      topPages: topEngagedPages(),
      funnel: funnel(brand),
    };
  }, [brand, range]);
}

export function useSocialData(platform: Platform | 'all', brand: BrandKey = 'alo') {
  const { range } = useDateRange();
  return useMemo(() => {
    const platforms: Platform[] = platform === 'all' ? ['ig', 'tiktok', 'yt'] : [platform];
    return {
      seriesByPlatform: platforms.map(p => ({
        platform: p,
        data: sliceSeries(followerSeries(brand, p), range),
      })),
      metrics: engagementMetrics(brand),
    };
  }, [brand, platform, range]);
}

export function useSeoData(brand: BrandKey = 'alo') {
  const { range } = useDateRange();
  return useMemo(() => ({
    authority: sliceSeries(authorityScoreSeries(brand), range),
    backlinks: sliceSeries(backlinksSeries(brand), range),
  }), [brand, range]);
}

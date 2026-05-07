import { BRANDS } from './story';
import type { BrandKey } from '../brand';
import { trafficSeries } from './traffic';
import { followerSeries, type Platform } from './social';
import type { TimePoint } from '../generators';

const ALL_BRANDS: BrandKey[] = ['alo', 'lulu', 'gym'];

export function trafficByBrand(): Record<BrandKey, TimePoint[]> {
  return {
    alo: trafficSeries('alo'),
    lulu: trafficSeries('lulu'),
    gym: trafficSeries('gym'),
  };
}

export function engagementComparison() {
  return ALL_BRANDS.map(key => {
    const b = BRANDS[key];
    return {
      brand: key,
      name: b.name,
      color: b.color,
      engagementRate: b.engagementRate,
      avgSessionDurationSec: key === 'alo' ? 184 : key === 'lulu' ? 152 : 167,
      pagesPerSession: key === 'alo' ? 4.0 : key === 'lulu' ? 5.1 : 3.2,
      bounceRate: key === 'alo' ? 0.38 : key === 'lulu' ? 0.42 : 0.41,
    };
  });
}

export function followersByPlatform() {
  const platforms: Platform[] = ['ig', 'tiktok', 'yt'];
  return platforms.map(p => ({
    platform: p,
    rows: ALL_BRANDS.map(key => ({
      brand: key,
      name: BRANDS[key].name,
      color: BRANDS[key].color,
      followers: BRANDS[key].followers[p],
    })),
  }));
}

export function followerSeriesByBrand(platform: Platform): Record<BrandKey, TimePoint[]> {
  return {
    alo: followerSeries('alo', platform),
    lulu: followerSeries('lulu', platform),
    gym: followerSeries('gym', platform),
  };
}

export function seoComparison() {
  return ALL_BRANDS.map(key => ({
    brand: key,
    name: BRANDS[key].name,
    color: BRANDS[key].color,
    authorityScore: BRANDS[key].authorityScore,
    backlinks: BRANDS[key].backlinks,
    referringDomains: BRANDS[key].referringDomains,
  }));
}

export function shareOfVoice(): { brand: BrandKey; pct: number }[] {
  const total = BRANDS.alo.sessions + BRANDS.lulu.sessions + BRANDS.gym.sessions;
  return ALL_BRANDS.map(b => ({ brand: b, pct: BRANDS[b].sessions / total }));
}

export function benchmarkTable() {
  const ind = (alo: number, lulu: number, gym: number) => (alo + lulu + gym) / 3;
  return [
    {
      metric: 'Monthly Sessions',
      alo: BRANDS.alo.sessions,
      lulu: BRANDS.lulu.sessions,
      gym: BRANDS.gym.sessions,
      industry: ind(BRANDS.alo.sessions, BRANDS.lulu.sessions, BRANDS.gym.sessions),
      format: 'compact' as const,
    },
    {
      metric: 'Engagement Rate',
      alo: BRANDS.alo.engagementRate,
      lulu: BRANDS.lulu.engagementRate,
      gym: BRANDS.gym.engagementRate,
      industry: ind(BRANDS.alo.engagementRate, BRANDS.lulu.engagementRate, BRANDS.gym.engagementRate),
      format: 'percent' as const,
    },
    {
      metric: 'Conversion Rate',
      alo: BRANDS.alo.conversionRate,
      lulu: BRANDS.lulu.conversionRate,
      gym: BRANDS.gym.conversionRate,
      industry: ind(BRANDS.alo.conversionRate, BRANDS.lulu.conversionRate, BRANDS.gym.conversionRate),
      format: 'percent' as const,
    },
    {
      metric: 'Authority Score',
      alo: BRANDS.alo.authorityScore,
      lulu: BRANDS.lulu.authorityScore,
      gym: BRANDS.gym.authorityScore,
      industry: ind(BRANDS.alo.authorityScore, BRANDS.lulu.authorityScore, BRANDS.gym.authorityScore),
      format: 'integer' as const,
    },
    {
      metric: 'YoY Growth',
      alo: BRANDS.alo.yoyGrowth,
      lulu: BRANDS.lulu.yoyGrowth,
      gym: BRANDS.gym.yoyGrowth,
      industry: ind(BRANDS.alo.yoyGrowth, BRANDS.lulu.yoyGrowth, BRANDS.gym.yoyGrowth),
      format: 'percent' as const,
    },
  ];
}

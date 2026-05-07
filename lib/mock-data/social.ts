import { generateTimeSeries, hashSeed, type TimePoint } from '../generators';
import { BRANDS } from './story';
import type { BrandKey } from '../brand';

const DAYS = 365;

export type Platform = 'ig' | 'tiktok' | 'yt';

export type TopPost = {
  platform: Platform;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  feature?: boolean; // larger tile in the grid
};

const PLATFORM_GROWTH: Record<BrandKey, Record<Platform, number>> = {
  alo:  { ig: 0.21, tiktok: 0.62, yt: 0.18 },
  lulu: { ig: 0.04, tiktok: 0.31, yt: 0.07 },
  gym:  { ig: 0.09, tiktok: 0.44, yt: 0.22 },
};

export function followerSeries(brand: BrandKey, platform: Platform): TimePoint[] {
  const b = BRANDS[brand];
  const end = b.followers[platform];
  const growth = PLATFORM_GROWTH[brand][platform];
  return generateTimeSeries({
    days: DAYS,
    baseValue: end / (1 + growth),
    trend: growth,
    seasonality: 0.005,
    noise: 0.003,
    seed: hashSeed(`${brand}-followers-${platform}`),
    anchorEnd: end,
  });
}

export function engagementMetrics(brand: BrandKey) {
  const b = BRANDS[brand];
  // mock per-post averages anchored loosely to follower size
  const baseLikes = (b.followers.ig + b.followers.tiktok) / 200;
  return {
    avgLikes:    Math.round(baseLikes),
    avgComments: Math.round(baseLikes * 0.04),
    avgShares:   Math.round(baseLikes * 0.07),
    engagementRate: brand === 'alo' ? 0.062 : brand === 'lulu' ? 0.031 : 0.048,
  };
}

export const topPosts: TopPost[] = [
  { platform: 'ig',     caption: 'Sunrise flow at the studio', likes: 184_000, comments: 2_100, shares: 4_900, feature: true },
  { platform: 'tiktok', caption: 'Men\'s airbrush drop',       likes: 92_000,  comments: 880,   shares: 12_400 },
  { platform: 'ig',     caption: 'New movement campaign',      likes: 71_000,  comments: 540,   shares: 1_800 },
  { platform: 'tiktok', caption: 'Recovery routine',           likes: 64_000,  comments: 720,   shares: 9_200 },
  { platform: 'yt',     caption: '20-min full body flow',      likes: 41_000,  comments: 980,   shares: 2_400 },
  { platform: 'ig',     caption: 'Behind the design: studio',  likes: 38_000,  comments: 412,   shares: 760 },
];

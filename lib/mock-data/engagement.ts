import { generateTimeSeries, hashSeed, type TimePoint } from '../generators';
import { BRANDS } from './story';
import type { BrandKey } from '../brand';

const DAYS = 365;

export type EngagedPage = {
  url: string;
  sessions: number;
  avgTimeSec: number;
  engagementRate: number;
};

export type FunnelStep = { label: string; value: number; rateToNext: number };

export function engagedSessionsSeries(brand: BrandKey): TimePoint[] {
  const b = BRANDS[brand];
  const dailyEngaged = (b.sessions * b.engagementRate) / 30;
  return generateTimeSeries({
    days: DAYS,
    baseValue: dailyEngaged,
    trend: b.yoyGrowth * 1.1,
    seasonality: 0.10,
    noise: 0.06,
    seed: hashSeed(`${brand}-engaged`),
    anchorEnd: Math.round(dailyEngaged),
  });
}

export function engagementRateSeries(brand: BrandKey): TimePoint[] {
  const b = BRANDS[brand];
  return generateTimeSeries({
    days: DAYS,
    baseValue: b.engagementRate,
    trend: 0.04,
    seasonality: 0.03,
    noise: 0.02,
    seed: hashSeed(`${brand}-erate`),
    anchorEnd: Math.round(b.engagementRate * 1000) / 1000,
  });
}

export function avgEngagementTimeSeries(brand: BrandKey): TimePoint[] {
  const baselines: Record<BrandKey, number> = { alo: 184, lulu: 152, gym: 167 };
  return generateTimeSeries({
    days: DAYS,
    baseValue: baselines[brand],
    trend: 0.05,
    seasonality: 0.04,
    noise: 0.03,
    seed: hashSeed(`${brand}-time`),
    anchorEnd: baselines[brand],
  });
}

export function bounceRateSeries(brand: BrandKey): TimePoint[] {
  const baselines: Record<BrandKey, number> = { alo: 0.38, lulu: 0.42, gym: 0.41 };
  return generateTimeSeries({
    days: DAYS,
    baseValue: baselines[brand],
    trend: -0.03,
    seasonality: 0.02,
    noise: 0.02,
    seed: hashSeed(`${brand}-bounce`),
    anchorEnd: Math.round(baselines[brand] * 100) / 100,
  });
}

export function topEngagedPages(): EngagedPage[] {
  return [
    { url: '/collections/mens',          sessions: 412_000, avgTimeSec: 248, engagementRate: 0.71 },
    { url: '/collections/yoga',          sessions: 389_000, avgTimeSec: 221, engagementRate: 0.68 },
    { url: '/collections/airbrush',      sessions: 311_000, avgTimeSec: 312, engagementRate: 0.74 },
    { url: '/collections/accessories',   sessions: 224_000, avgTimeSec: 167, engagementRate: 0.62 },
    { url: '/collections/outerwear',     sessions: 198_000, avgTimeSec: 191, engagementRate: 0.65 },
    { url: '/blog/movement',             sessions: 142_000, avgTimeSec: 367, engagementRate: 0.78 },
    { url: '/stores/locator',            sessions: 121_000, avgTimeSec: 88,  engagementRate: 0.51 },
    { url: '/account/orders',            sessions: 98_000,  avgTimeSec: 142, engagementRate: 0.59 },
  ];
}

export function funnel(brand: BrandKey): FunnelStep[] {
  const b = BRANDS[brand];
  const sessions = b.sessions;
  const productView = Math.round(sessions * 0.58);
  const addToCart   = Math.round(productView * 0.22);
  const checkout    = Math.round(addToCart * 0.42);
  const purchase    = Math.round(checkout * 0.41);

  return [
    { label: 'Sessions',     value: sessions,    rateToNext: productView / sessions },
    { label: 'Product View', value: productView, rateToNext: addToCart / productView },
    { label: 'Add to Cart',  value: addToCart,   rateToNext: checkout / addToCart },
    { label: 'Checkout',     value: checkout,    rateToNext: purchase / checkout },
    { label: 'Purchase',     value: purchase,    rateToNext: 0 },
  ];
}

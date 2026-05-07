import { generateTimeSeries, hashSeed, type TimePoint } from '../generators';
import { BRANDS } from './story';
import type { BrandKey } from '../brand';

const DAYS = 365;

export type SourceBreakdown = { label: string; value: number; pct: number };
export type DeviceSplit = { label: 'Mobile' | 'Desktop' | 'Tablet'; pct: number };

export function trafficSeries(brand: BrandKey): TimePoint[] {
  const b = BRANDS[brand];
  const baseDaily = b.sessions / 30; // headline is monthly
  return generateTimeSeries({
    days: DAYS,
    baseValue: baseDaily,
    trend: b.yoyGrowth,
    seasonality: 0.12,
    noise: 0.08,
    seed: hashSeed(`${brand}-traffic`),
    anchorEnd: Math.round(baseDaily * (1 + b.yoyGrowth / 12)),
  });
}

export function usersSeries(brand: BrandKey): TimePoint[] {
  const b = BRANDS[brand];
  const dailyUsers = (b.sessions * 0.78) / 30;
  return generateTimeSeries({
    days: DAYS,
    baseValue: dailyUsers,
    trend: b.yoyGrowth * 0.9,
    seasonality: 0.10,
    noise: 0.07,
    seed: hashSeed(`${brand}-users`),
    anchorEnd: Math.round(dailyUsers),
  });
}

export function pagesPerSessionSeries(brand: BrandKey): TimePoint[] {
  return generateTimeSeries({
    days: DAYS,
    baseValue: 4.2,
    trend: 0.02,
    seasonality: 0.05,
    noise: 0.04,
    seed: hashSeed(`${brand}-pps`),
    anchorEnd: brand === 'alo' ? 4 : brand === 'lulu' ? 5 : 3,
  });
}

export function sourceBreakdown(brand: BrandKey): SourceBreakdown[] {
  const b = BRANDS[brand];
  const splits: Record<BrandKey, number[]> = {
    alo:  [0.62, 0.18, 0.10, 0.05, 0.03, 0.02], // organic-heavy
    lulu: [0.51, 0.27, 0.08, 0.06, 0.04, 0.04],
    gym:  [0.45, 0.20, 0.22, 0.07, 0.03, 0.03], // social-heavy
  };
  const labels = ['Organic', 'Direct', 'Social', 'Referral', 'Email', 'Paid'];
  const total = b.sessions;
  return labels.map((label, i) => ({
    label,
    pct: splits[brand][i],
    value: Math.round(total * splits[brand][i]),
  }));
}

export function deviceSplit(brand: BrandKey): DeviceSplit[] {
  const splits: Record<BrandKey, [number, number, number]> = {
    alo:  [0.71, 0.24, 0.05],
    lulu: [0.64, 0.32, 0.04],
    gym:  [0.82, 0.15, 0.03],
  };
  const [m, d, t] = splits[brand];
  return [
    { label: 'Mobile', pct: m },
    { label: 'Desktop', pct: d },
    { label: 'Tablet', pct: t },
  ];
}

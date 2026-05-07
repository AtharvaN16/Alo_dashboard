import { generateTimeSeries, hashSeed, type TimePoint } from '../generators';
import { BRANDS } from './story';
import type { BrandKey } from '../brand';

const DAYS = 365;

export type ReferringDomain = {
  domain: string;
  authority: number;
  backlinks: number;
  firstSeen: string;
};

export type AnchorText = { label: string; share: number };

export function authorityScoreSeries(brand: BrandKey): TimePoint[] {
  const b = BRANDS[brand];
  return generateTimeSeries({
    days: DAYS,
    baseValue: b.authorityScore - 4,
    trend: 0.05,
    seasonality: 0.005,
    noise: 0.003,
    seed: hashSeed(`${brand}-authority`),
    anchorEnd: b.authorityScore,
  });
}

export function backlinksSeries(brand: BrandKey): TimePoint[] {
  const b = BRANDS[brand];
  return generateTimeSeries({
    days: DAYS,
    baseValue: b.backlinks * 0.85,
    trend: 0.18,
    seasonality: 0.01,
    noise: 0.008,
    seed: hashSeed(`${brand}-backlinks`),
    anchorEnd: b.backlinks,
  });
}

export const topReferringDomains: ReferringDomain[] = [
  { domain: 'vogue.com',         authority: 92, backlinks: 1_842, firstSeen: '2019-04-12' },
  { domain: 'harpersbazaar.com', authority: 89, backlinks: 1_211, firstSeen: '2020-02-08' },
  { domain: 'wellandgood.com',   authority: 78, backlinks: 2_984, firstSeen: '2018-06-21' },
  { domain: 'mindbodygreen.com', authority: 74, backlinks: 1_672, firstSeen: '2019-09-30' },
  { domain: 'self.com',          authority: 86, backlinks: 942,   firstSeen: '2021-01-18' },
  { domain: 'shape.com',         authority: 81, backlinks: 1_104, firstSeen: '2019-11-04' },
  { domain: 'mensjournal.com',   authority: 79, backlinks: 612,   firstSeen: '2022-03-15' },
  { domain: 'gq.com',            authority: 90, backlinks: 488,   firstSeen: '2022-08-01' },
  { domain: 'refinery29.com',    authority: 84, backlinks: 1_388, firstSeen: '2018-12-09' },
  { domain: 'thecut.com',        authority: 82, backlinks: 967,   firstSeen: '2020-07-22' },
];

export const anchorTextDistribution: AnchorText[] = [
  { label: 'alo yoga',           share: 0.34 },
  { label: 'brand mention',      share: 0.21 },
  { label: 'product name',       share: 0.18 },
  { label: 'naked URL',          share: 0.11 },
  { label: 'image / no text',    share: 0.09 },
  { label: 'generic ("here", "shop")', share: 0.07 },
];

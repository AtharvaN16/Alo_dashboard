import { BRAND_COLORS, type BrandKey } from '../brand';

export type BrandStory = {
  name: string;
  color: string;
  sessions: number;
  followers: { ig: number; tiktok: number; yt: number };
  authorityScore: number;
  backlinks: number;
  referringDomains: number;
  engagementRate: number;
  conversionRate: number;
  yoyGrowth: number;
};

export const BRANDS: Record<BrandKey, BrandStory> = {
  alo: {
    name: 'Alo Yoga',
    color: BRAND_COLORS.sage,
    sessions: 4_200_000,
    followers: { ig: 3_100_000, tiktok: 1_900_000, yt: 410_000 },
    authorityScore: 68,
    backlinks: 412_000,
    referringDomains: 8_400,
    engagementRate: 0.642,
    conversionRate: 0.0384,
    yoyGrowth: 0.184,
  },
  lulu: {
    name: 'Lululemon',
    color: BRAND_COLORS.lulu,
    sessions: 16_800_000,
    followers: { ig: 4_900_000, tiktok: 1_100_000, yt: 290_000 },
    authorityScore: 81,
    backlinks: 1_240_000,
    referringDomains: 22_100,
    engagementRate: 0.541,
    conversionRate: 0.0421,
    yoyGrowth: 0.041,
  },
  gym: {
    name: 'Gymshark',
    color: BRAND_COLORS.gym,
    sessions: 3_700_000,
    followers: { ig: 7_200_000, tiktok: 4_500_000, yt: 970_000 },
    authorityScore: 71,
    backlinks: 510_000,
    referringDomains: 11_300,
    engagementRate: 0.598,
    conversionRate: 0.0312,
    yoyGrowth: 0.092,
  },
};

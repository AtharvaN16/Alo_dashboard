export type AgeGenderRow = {
  ageBracket: string;
  female: number;
  male: number;
  nonbinary: number;
};

export type GeoRow = { country: string; sessions: number };

export type Interest = { label: string; affinity: number };

export type KeywordIntent = "men's" | "women's" | 'workout' | 'lifestyle' | 'yoga';

export type Keyword = {
  keyword: string;
  intent: KeywordIntent;
  volume: number;
  position: number;
  change: number; // +/- positions vs previous period
};

export const ageGenderMatrix: AgeGenderRow[] = [
  { ageBracket: '18-24', female: 18, male: 6,  nonbinary: 1 },
  { ageBracket: '25-34', female: 27, male: 11, nonbinary: 2 },
  { ageBracket: '35-44', female: 16, male: 8,  nonbinary: 1 },
  { ageBracket: '45-54', female: 6,  male: 3,  nonbinary: 0 },
  { ageBracket: '55+',   female: 1,  male: 0,  nonbinary: 0 },
];

export const topCountries: GeoRow[] = [
  { country: 'United States',  sessions: 2_810_000 },
  { country: 'United Kingdom', sessions: 384_000 },
  { country: 'Canada',         sessions: 281_000 },
  { country: 'Australia',      sessions: 212_000 },
  { country: 'Germany',        sessions: 142_000 },
  { country: 'France',         sessions: 98_000 },
  { country: 'Japan',          sessions: 78_000 },
  { country: 'Netherlands',    sessions: 54_000 },
  { country: 'Sweden',         sessions: 41_000 },
  { country: 'Singapore',      sessions: 38_000 },
];

export const interests: Interest[] = [
  { label: 'Yoga & Meditation',   affinity: 9.2 },
  { label: 'Health & Fitness',    affinity: 8.7 },
  { label: 'Wellness',            affinity: 8.4 },
  { label: 'Athleisure Fashion',  affinity: 7.9 },
  { label: 'Pilates',             affinity: 7.3 },
  { label: 'Running',             affinity: 6.1 },
  { label: 'Sustainable Living',  affinity: 5.8 },
];

export const keywords: Keyword[] = [
  { keyword: "alo yoga men's",          intent: "men's",     volume: 33_100, position: 1,  change:  0 },
  { keyword: 'mens workout joggers',    intent: "men's",     volume: 22_400, position: 4,  change: +2 },
  { keyword: 'mens yoga shorts',        intent: "men's",     volume: 18_900, position: 6,  change: +1 },
  { keyword: 'alo airbrush leggings',   intent: 'workout',   volume: 74_200, position: 1,  change:  0 },
  { keyword: 'high waisted leggings',   intent: 'workout',   volume: 110_500,position: 8,  change: -1 },
  { keyword: 'workout sets women',      intent: 'workout',   volume: 41_300, position: 5,  change: +3 },
  { keyword: 'alo yoga sweat set',      intent: 'lifestyle', volume: 27_800, position: 2,  change: +1 },
  { keyword: 'oversized sweatshirt',    intent: 'lifestyle', volume: 88_100, position: 12, change: +4 },
  { keyword: 'soft yoga pants',         intent: 'yoga',      volume: 19_700, position: 3,  change:  0 },
  { keyword: 'best yoga mat',           intent: 'yoga',      volume: 60_400, position: 9,  change: -2 },
  { keyword: "alo yoga women's",        intent: "women's",   volume: 49_500, position: 1,  change:  0 },
  { keyword: 'cropped tank top',        intent: "women's",   volume: 35_200, position: 7,  change: +1 },
];

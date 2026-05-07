# ALO Yoga Digital Analytics Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mock GA4-style digital analytics dashboard for Alo Yoga with editorial-print aesthetic, optional per-card competitive comparison against Lululemon and Gymshark, and a deterministic mock-data layer.

**Architecture:** Next.js 15 App Router monolith. No backend. Seeded mulberry32 PRNG generates realistic time series whose terminal values are anchored to hand-tuned story numbers in `lib/mock-data/story.ts`. Global `DateRangeContext` drives all chart data hooks. Shared chart, card, and UI primitives compose into 7 routes (Overview, Traffic, Engagement, Audience, Social, SEO, Competitors).

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Recharts, lucide-react, clsx + tailwind-merge, Vitest + React Testing Library, Fraunces / Schibsted Grotesk / Geist Mono via `next/font/google`.

**Spec:** See `docs/superpowers/specs/2026-05-05-alo-analytics-dashboard-design.md` for the full design rationale, brand tokens, and per-page layout. This plan implements that spec.

---

## Task 1: Project scaffolding and dependencies

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `.gitignore`
- Create: `.eslintrc.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `app/layout.tsx` (placeholder, replaced in Task 15)
- Create: `app/page.tsx` (placeholder, replaced in Task 20)

- [ ] **Step 1: Initialize git repo**

```bash
cd "/Users/atharvanayak/ALO Dashboard"
git init
git branch -m main
```

Expected: `Initialized empty Git repository`.

- [ ] **Step 2: Create `.gitignore`**

```
node_modules
.next
out
.env*.local
.DS_Store
coverage
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "alo-analytics-dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.13.0",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@types/node": "^22.9.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.14.0",
    "eslint-config-next": "^15.0.0",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3",
    "vitest": "^2.1.4"
  }
}
```

- [ ] **Step 4: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 6: Create `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 7: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
});
```

- [ ] **Step 8: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 9: Create placeholder `app/layout.tsx`**

```tsx
export const metadata = { title: 'Alo Analytics' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Create placeholder `app/page.tsx`**

```tsx
export default function Home() {
  return <main>Alo Analytics scaffolding ready</main>;
}
```

- [ ] **Step 11: Install dependencies**

Run: `npm install`
Expected: dependencies install successfully, `node_modules/` populated.

- [ ] **Step 12: Verify dev server boots**

Run: `npm run dev` in one terminal, then `curl -s http://localhost:3000 | grep "Alo Analytics scaffolding"` in another. Kill the dev server.
Expected: `curl` finds the placeholder text.

- [ ] **Step 13: Verify test runner works**

Run: `npm test`
Expected: `No test files found` (exit 0 or 1 with that message). Acceptable.

- [ ] **Step 14: Commit**

```bash
git add .
git commit -m "chore: scaffold Next.js 15 + TypeScript + Vitest project"
```

---

## Task 2: Tailwind config, OKLCH brand tokens, fonts, globals.css

**Files:**
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `app/globals.css`
- Create: `lib/brand.ts`
- Modify: `app/layout.tsx` (load fonts and globals)

- [ ] **Step 1: Create `postcss.config.mjs`**

```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

- [ ] **Step 2: Create `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: 'oklch(0.96 0.012 75)',
        cream: 'oklch(0.93 0.018 70)',
        charcoal: 'oklch(0.22 0.008 75)',
        graphite: 'oklch(0.38 0.008 75)',
        stone: 'oklch(0.62 0.012 70)',
        sage: 'oklch(0.58 0.038 130)',
        'sage-deep': 'oklch(0.42 0.045 132)',
        clay: 'oklch(0.55 0.085 50)',
        line: 'oklch(0.88 0.012 75)',
        lulu: 'oklch(0.72 0.025 240)',
        gym: 'oklch(0.25 0.005 75)',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-schibsted)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1.4' }],
        'display-sm': ['3.125rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-md': ['4.1875rem', { lineHeight: '0.95', letterSpacing: '-0.025em' }],
        'display-lg': ['5.5625rem', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-xl': ['7.4375rem', { lineHeight: '0.9', letterSpacing: '-0.035em' }],
      },
      letterSpacing: { tracked: '0.12em' },
      transitionTimingFunction: { 'out-quart': 'cubic-bezier(0.165, 0.84, 0.44, 1)' },
      boxShadow: { hairline: '0 1px 2px oklch(0.22 0.008 75 / 0.06)' },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Create `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }

html, body { background: oklch(0.96 0.012 75); color: oklch(0.22 0.008 75); }

body {
  font-family: var(--font-schibsted), system-ui, sans-serif;
  font-feature-settings: 'ss01', 'cv11';
  -webkit-font-smoothing: antialiased;
}

/* Tabular figures for ledger/table numbers. Apply via .num utility class. */
.num { font-variant-numeric: tabular-nums; }

/* Hairline horizontal rule used between ledger rows and editorial blocks. */
.hairline { background: oklch(0.88 0.012 75); height: 1px; width: 100%; }
.hairline-v { background: oklch(0.88 0.012 75); width: 1px; align-self: stretch; }
```

- [ ] **Step 4: Create `lib/brand.ts`**

```ts
export const BRAND_COLORS = {
  bone: 'oklch(0.96 0.012 75)',
  cream: 'oklch(0.93 0.018 70)',
  charcoal: 'oklch(0.22 0.008 75)',
  graphite: 'oklch(0.38 0.008 75)',
  stone: 'oklch(0.62 0.012 70)',
  sage: 'oklch(0.58 0.038 130)',
  sageDeep: 'oklch(0.42 0.045 132)',
  clay: 'oklch(0.55 0.085 50)',
  line: 'oklch(0.88 0.012 75)',
  lulu: 'oklch(0.72 0.025 240)',
  gym: 'oklch(0.25 0.005 75)',
} as const;

export const TYPE_SCALE = {
  base: 16,
  ratio: 1.333,
  steps: [12, 14, 16, 21, 28, 37, 50, 67, 89, 119],
} as const;

export const EASING = 'cubic-bezier(0.165, 0.84, 0.44, 1)';

export const DURATIONS = {
  ui: 200,
  chart: 400,
  route: 600,
} as const;

export type BrandKey = 'alo' | 'lulu' | 'gym';
```

- [ ] **Step 5: Replace `app/layout.tsx` with font loading and globals import**

```tsx
import './globals.css';
import { Fraunces, Schibsted_Grotesk, Geist_Mono } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
});

const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-schibsted',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Alo Analytics',
  description: 'Mock digital analytics dashboard for Alo Yoga',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${schibsted.variable} ${geistMono.variable}`}
    >
      <body className="bg-bone text-charcoal min-h-screen">{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Run dev server and visually verify font + bone background**

Run: `npm run dev`, open `http://localhost:3000`. The placeholder text "Alo Analytics scaffolding ready" should appear in Schibsted Grotesk on a warm cream/bone background. Kill the server.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add Tailwind config, OKLCH tokens, font loading, globals"
```

---

## Task 3: Seeded mulberry32 PRNG (TDD)

**Files:**
- Create: `lib/generators.ts` (seededRandom + hashSeed only in this task)
- Create: `lib/__tests__/generators.test.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/__tests__/generators.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { seededRandom, hashSeed } from '../generators';

describe('seededRandom', () => {
  it('produces deterministic sequence for same seed', () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    const seqA = [a(), a(), a(), a(), a()];
    const seqB = [b(), b(), b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it('produces different sequence for different seeds', () => {
    const a = seededRandom(1);
    const b = seededRandom(2);
    expect(a()).not.toBe(b());
  });

  it('returns values in [0, 1)', () => {
    const rng = seededRandom(99);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('hashSeed', () => {
  it('returns same int for same string', () => {
    expect(hashSeed('alo-sessions')).toBe(hashSeed('alo-sessions'));
  });

  it('returns different ints for different strings', () => {
    expect(hashSeed('a')).not.toBe(hashSeed('b'));
  });

  it('returns a 32-bit unsigned int', () => {
    const h = hashSeed('test-string-123');
    expect(Number.isInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(2 ** 32);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- generators`
Expected: FAIL with `Cannot find module '../generators'`.

- [ ] **Step 3: Implement `lib/generators.ts`**

```ts
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return function () {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(key: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- generators`
Expected: PASS, all 6 tests green.

- [ ] **Step 5: Commit**

```bash
git add lib/generators.ts lib/__tests__/generators.test.ts
git commit -m "feat(generators): add seeded mulberry32 PRNG and string hash"
```

---

## Task 4: Time-series generator (TDD)

**Files:**
- Modify: `lib/generators.ts` (append `generateTimeSeries`)
- Modify: `lib/__tests__/generators.test.ts` (add test cases)

- [ ] **Step 1: Add failing tests for `generateTimeSeries`**

Append to `lib/__tests__/generators.test.ts`:

```ts
import { generateTimeSeries } from '../generators';

describe('generateTimeSeries', () => {
  it('returns the requested number of points', () => {
    const series = generateTimeSeries({
      days: 30,
      baseValue: 1000,
      trend: 0.1,
      seasonality: 0.05,
      noise: 0.02,
      seed: 1,
      anchorEnd: 1100,
    });
    expect(series).toHaveLength(30);
  });

  it('terminal value matches anchorEnd exactly', () => {
    const series = generateTimeSeries({
      days: 30,
      baseValue: 1000,
      trend: 0.1,
      seasonality: 0.05,
      noise: 0.02,
      seed: 1,
      anchorEnd: 4_200_000,
    });
    expect(series[series.length - 1].value).toBe(4_200_000);
  });

  it('is deterministic for same seed', () => {
    const args = {
      days: 30, baseValue: 1000, trend: 0.1, seasonality: 0.05,
      noise: 0.02, seed: 7, anchorEnd: 1500,
    };
    const a = generateTimeSeries(args);
    const b = generateTimeSeries(args);
    expect(a).toEqual(b);
  });

  it('produces ISO date strings spaced one day apart', () => {
    const series = generateTimeSeries({
      days: 5, baseValue: 100, trend: 0, seasonality: 0,
      noise: 0, seed: 1, anchorEnd: 100,
    });
    expect(series[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const d0 = new Date(series[0].date).getTime();
    const d1 = new Date(series[1].date).getTime();
    expect(d1 - d0).toBe(86_400_000);
  });

  it('respects endDate parameter', () => {
    const series = generateTimeSeries({
      days: 3, baseValue: 100, trend: 0, seasonality: 0,
      noise: 0, seed: 1, anchorEnd: 100,
      endDate: new Date('2026-05-05T00:00:00Z'),
    });
    expect(series[series.length - 1].date).toBe('2026-05-05');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- generators`
Expected: FAIL with `generateTimeSeries is not exported`.

- [ ] **Step 3: Implement `generateTimeSeries`**

Append to `lib/generators.ts`:

```ts
export type TimePoint = { date: string; value: number };

export type TimeSeriesArgs = {
  days: number;
  baseValue: number;
  /** annualized trend, e.g., 0.18 = +18%/yr */
  trend: number;
  /** weekly seasonality amplitude as fraction of baseValue */
  seasonality: number;
  /** noise amplitude as fraction of baseValue */
  noise: number;
  seed: number;
  /** terminal value the last point is rescaled to match exactly */
  anchorEnd: number;
  /** end date of the series; defaults to today (UTC) */
  endDate?: Date;
};

const DAY_MS = 86_400_000;

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function generateTimeSeries(args: TimeSeriesArgs): TimePoint[] {
  const { days, baseValue, trend, seasonality, noise, seed, anchorEnd } = args;
  const endDate = args.endDate ?? new Date();
  const rng = seededRandom(seed);

  const raw: TimePoint[] = [];
  for (let i = 0; i < days; i++) {
    const dayIndex = i;
    const t = dayIndex / 365;
    const trendFactor = 1 + trend * (t - days / 365);
    const dayOfWeek = (new Date(endDate.getTime() - (days - 1 - i) * DAY_MS)).getUTCDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? -seasonality : seasonality * 0.25;
    const jitter = (rng() * 2 - 1) * noise;
    const value = baseValue * trendFactor * (1 + weekendDip + jitter);
    const date = isoDate(new Date(endDate.getTime() - (days - 1 - i) * DAY_MS));
    raw.push({ date, value });
  }

  // Rescale so terminal value equals anchorEnd exactly.
  const terminal = raw[raw.length - 1].value;
  const scale = terminal === 0 ? 1 : anchorEnd / terminal;
  return raw.map(p => ({ date: p.date, value: Math.round(p.value * scale) }));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- generators`
Expected: PASS, 11 tests green.

- [ ] **Step 5: Commit**

```bash
git add lib/generators.ts lib/__tests__/generators.test.ts
git commit -m "feat(generators): add deterministic time-series with terminal-value anchor"
```

---

## Task 5: Story file with hand-tuned brand totals

**Files:**
- Create: `lib/mock-data/story.ts`
- Create: `lib/mock-data/__tests__/story.test.ts`

- [ ] **Step 1: Write failing test**

Create `lib/mock-data/__tests__/story.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { BRANDS } from '../story';

describe('BRANDS', () => {
  it('contains alo, lulu, gym', () => {
    expect(Object.keys(BRANDS)).toEqual(['alo', 'lulu', 'gym']);
  });

  it('alo headline numbers match the spec narrative', () => {
    expect(BRANDS.alo.sessions).toBe(4_200_000);
    expect(BRANDS.alo.yoyGrowth).toBe(0.184);
    expect(BRANDS.alo.engagementRate).toBe(0.642);
  });

  it('lulu is bigger than alo on traffic', () => {
    expect(BRANDS.lulu.sessions).toBeGreaterThan(BRANDS.alo.sessions);
  });

  it('gym leads on social followers, lags on web sessions', () => {
    expect(BRANDS.gym.followers.tiktok).toBeGreaterThan(BRANDS.alo.followers.tiktok);
    expect(BRANDS.gym.sessions).toBeLessThan(BRANDS.alo.sessions);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test -- story`
Expected: FAIL with `Cannot find module '../story'`.

- [ ] **Step 3: Implement `lib/mock-data/story.ts`**

```ts
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
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- story`
Expected: PASS, 4 tests green.

- [ ] **Step 5: Commit**

```bash
git add lib/mock-data/story.ts lib/mock-data/__tests__/story.test.ts
git commit -m "feat(mock-data): add brand story totals for alo, lulu, gym"
```

---

## Task 6: Date range context, hooks, and slicing helpers (TDD)

**Files:**
- Create: `lib/date-range.ts`
- Create: `lib/__tests__/date-range.test.ts`
- Create: `components/layout/DateRangeContext.tsx`

- [ ] **Step 1: Write failing tests for slicing helpers**

Create `lib/__tests__/date-range.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { rangeForLabel, sliceSeries, deltaPct, prevRange } from '../date-range';

describe('rangeForLabel', () => {
  it('returns 7-day window for 7D', () => {
    const ref = new Date('2026-05-05T00:00:00Z');
    const r = rangeForLabel('7D', ref);
    expect(Math.round((r.end.getTime() - r.start.getTime()) / 86_400_000)).toBe(7);
  });

  it('returns 30-day window for 30D', () => {
    const ref = new Date('2026-05-05T00:00:00Z');
    const r = rangeForLabel('30D', ref);
    expect(Math.round((r.end.getTime() - r.start.getTime()) / 86_400_000)).toBe(30);
  });
});

describe('sliceSeries', () => {
  const points = [
    { date: '2026-05-01', value: 1 },
    { date: '2026-05-02', value: 2 },
    { date: '2026-05-03', value: 3 },
    { date: '2026-05-04', value: 4 },
    { date: '2026-05-05', value: 5 },
  ];

  it('returns points within range inclusive', () => {
    const result = sliceSeries(points, {
      start: new Date('2026-05-02T00:00:00Z'),
      end: new Date('2026-05-04T00:00:00Z'),
    });
    expect(result.map(p => p.value)).toEqual([2, 3, 4]);
  });

  it('returns empty array if no points in range', () => {
    const result = sliceSeries(points, {
      start: new Date('2027-01-01T00:00:00Z'),
      end: new Date('2027-01-31T00:00:00Z'),
    });
    expect(result).toEqual([]);
  });
});

describe('prevRange', () => {
  it('returns equal-length window immediately preceding the range', () => {
    const r = {
      start: new Date('2026-05-01T00:00:00Z'),
      end: new Date('2026-05-30T00:00:00Z'),
    };
    const p = prevRange(r);
    expect(p.end.toISOString().slice(0, 10)).toBe('2026-04-30');
    expect(Math.round((p.end.getTime() - p.start.getTime()) / 86_400_000)).toBe(29);
  });
});

describe('deltaPct', () => {
  it('returns positive percent for growth', () => {
    expect(deltaPct(120, 100)).toBeCloseTo(0.2, 5);
  });

  it('returns negative percent for decline', () => {
    expect(deltaPct(80, 100)).toBeCloseTo(-0.2, 5);
  });

  it('returns 0 when previous is 0', () => {
    expect(deltaPct(50, 0)).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- date-range`
Expected: FAIL with `Cannot find module '../date-range'`.

- [ ] **Step 3: Implement `lib/date-range.ts`**

```ts
import type { TimePoint } from './generators';

export type RangeLabel = '7D' | '30D' | '90D' | '12M' | 'YTD';

export type DateRange = { start: Date; end: Date };

export type ActiveRange = DateRange & { label: RangeLabel; previous: DateRange };

const DAY_MS = 86_400_000;

export function rangeForLabel(label: RangeLabel, ref: Date = new Date()): DateRange {
  const end = new Date(Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate()));
  let days: number;
  switch (label) {
    case '7D': days = 7; break;
    case '30D': days = 30; break;
    case '90D': days = 90; break;
    case '12M': days = 365; break;
    case 'YTD': {
      const start = new Date(Date.UTC(ref.getUTCFullYear(), 0, 1));
      return { start, end };
    }
  }
  return { start: new Date(end.getTime() - days * DAY_MS), end };
}

export function prevRange(r: DateRange): DateRange {
  const span = r.end.getTime() - r.start.getTime();
  const prevEnd = new Date(r.start.getTime() - DAY_MS);
  const prevStart = new Date(prevEnd.getTime() - span);
  return { start: prevStart, end: prevEnd };
}

export function sliceSeries(points: TimePoint[], r: DateRange): TimePoint[] {
  const startMs = r.start.getTime();
  const endMs = r.end.getTime();
  return points.filter(p => {
    const t = new Date(p.date + 'T00:00:00Z').getTime();
    return t >= startMs && t <= endMs;
  });
}

export function deltaPct(current: number, previous: number): number {
  if (previous === 0) return 0;
  return (current - previous) / previous;
}

export function totalOf(points: TimePoint[]): number {
  return points.reduce((sum, p) => sum + p.value, 0);
}

export function buildActiveRange(label: RangeLabel, ref: Date = new Date()): ActiveRange {
  const r = rangeForLabel(label, ref);
  return { ...r, label, previous: prevRange(r) };
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- date-range`
Expected: PASS, 8 tests green.

- [ ] **Step 5: Implement `components/layout/DateRangeContext.tsx`**

```tsx
'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { buildActiveRange, type ActiveRange, type RangeLabel } from '@/lib/date-range';

type Ctx = {
  range: ActiveRange;
  label: RangeLabel;
  setLabel: (l: RangeLabel) => void;
  compare: boolean;
  setCompare: (v: boolean) => void;
};

const DateRangeCtx = createContext<Ctx | null>(null);

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [label, setLabel] = useState<RangeLabel>('30D');
  const [compare, setCompare] = useState(false);
  const range = useMemo(() => buildActiveRange(label), [label]);
  return (
    <DateRangeCtx.Provider value={{ range, label, setLabel, compare, setCompare }}>
      {children}
    </DateRangeCtx.Provider>
  );
}

export function useDateRange(): Ctx {
  const v = useContext(DateRangeCtx);
  if (!v) throw new Error('useDateRange must be used within DateRangeProvider');
  return v;
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/date-range.ts lib/__tests__/date-range.test.ts components/layout/DateRangeContext.tsx
git commit -m "feat(date-range): add range helpers, slicing, deltaPct, and React context"
```

---

## Task 7: Traffic mock-data module

**Files:**
- Create: `lib/mock-data/traffic.ts`

- [ ] **Step 1: Implement `lib/mock-data/traffic.ts`**

```ts
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
```

- [ ] **Step 2: Sanity check via test (no new test file, just compile)**

Run: `npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data/traffic.ts
git commit -m "feat(mock-data): add traffic series, source breakdown, device split"
```

---

## Task 8: Engagement mock-data module

**Files:**
- Create: `lib/mock-data/engagement.ts`

- [ ] **Step 1: Implement `lib/mock-data/engagement.ts`**

```ts
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
```

- [ ] **Step 2: Sanity check**

Run: `npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data/engagement.ts
git commit -m "feat(mock-data): add engagement series, top pages, conversion funnel"
```

---

## Task 9: Audience mock-data module

**Files:**
- Create: `lib/mock-data/audience.ts`

- [ ] **Step 1: Implement `lib/mock-data/audience.ts`**

```ts
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
```

- [ ] **Step 2: Sanity check**

Run: `npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data/audience.ts
git commit -m "feat(mock-data): add demographics, geo, interests, keyword table"
```

---

## Task 10: Social mock-data module

**Files:**
- Create: `lib/mock-data/social.ts`

- [ ] **Step 1: Implement `lib/mock-data/social.ts`**

```ts
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
```

- [ ] **Step 2: Sanity check**

Run: `npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data/social.ts
git commit -m "feat(mock-data): add follower series, engagement metrics, top posts"
```

---

## Task 11: SEO mock-data module

**Files:**
- Create: `lib/mock-data/seo.ts`

- [ ] **Step 1: Implement `lib/mock-data/seo.ts`**

```ts
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
```

- [ ] **Step 2: Sanity check**

Run: `npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data/seo.ts
git commit -m "feat(mock-data): add authority/backlinks series, referring domains, anchors"
```

---

## Task 12: Competitors helper module

**Files:**
- Create: `lib/mock-data/competitors.ts`

- [ ] **Step 1: Implement `lib/mock-data/competitors.ts`**

```ts
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
```

- [ ] **Step 2: Sanity check**

Run: `npx tsc --noEmit`
Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data/competitors.ts
git commit -m "feat(mock-data): add cross-brand comparison helpers"
```

---

## Task 13: Number formatters and `cn` utility

**Files:**
- Create: `lib/format.ts`
- Create: `lib/cn.ts`
- Create: `lib/__tests__/format.test.ts`

- [ ] **Step 1: Write failing tests for formatters**

Create `lib/__tests__/format.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { compact, percent, signedPercent, integer } from '../format';

describe('compact', () => {
  it('formats millions', () => { expect(compact(4_200_000)).toBe('4.2M'); });
  it('formats thousands', () => { expect(compact(412_000)).toBe('412K'); });
  it('formats small numbers as-is', () => { expect(compact(842)).toBe('842'); });
});

describe('percent', () => {
  it('formats with 1 decimal', () => { expect(percent(0.642)).toBe('64.2%'); });
  it('handles zero', () => { expect(percent(0)).toBe('0.0%'); });
});

describe('signedPercent', () => {
  it('shows + for positive', () => { expect(signedPercent(0.184)).toBe('+18.4%'); });
  it('shows minus for negative', () => { expect(signedPercent(-0.041)).toBe('-4.1%'); });
});

describe('integer', () => {
  it('adds thousands separators', () => { expect(integer(1234567)).toBe('1,234,567'); });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- format`
Expected: FAIL with `Cannot find module '../format'`.

- [ ] **Step 3: Implement `lib/format.ts`**

```ts
export function compact(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v.toFixed(v >= 10 ? 0 : 1)}M`;
  }
  if (Math.abs(n) >= 1_000) {
    const v = n / 1_000;
    return `${v.toFixed(v >= 10 ? 0 : 1)}K`;
  }
  return String(Math.round(n));
}

export function percent(n: number, decimals: number = 1): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

export function signedPercent(n: number, decimals: number = 1): string {
  const sign = n >= 0 ? '+' : '-';
  return `${sign}${Math.abs(n * 100).toFixed(decimals)}%`;
}

export function integer(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

export function duration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}
```

- [ ] **Step 4: Implement `lib/cn.ts`**

```ts
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npm test -- format`
Expected: PASS, 8 tests green.

- [ ] **Step 6: Commit**

```bash
git add lib/format.ts lib/cn.ts lib/__tests__/format.test.ts
git commit -m "feat(lib): add number formatters and cn utility"
```

---

## Task 14: UI primitives (Pill, Tabs, Badge, Skeleton, EmptyState)

**Files:**
- Create: `components/ui/Pill.tsx`
- Create: `components/ui/Tabs.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/Skeleton.tsx`
- Create: `components/ui/EmptyState.tsx`

- [ ] **Step 1: Implement `components/ui/Pill.tsx` (segmented control + single-pill toggle)**

```tsx
'use client';

import { cn } from '@/lib/cn';

type PillProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
};

export function PillSegmented<T extends string>({
  options, value, onChange, size = 'md',
}: PillProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-full border border-line bg-bone p-0.5',
        size === 'sm' ? 'text-xs' : 'text-sm',
      )}
    >
      {options.map(opt => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt)}
            className={cn(
              'rounded-full px-3 py-1 transition-colors duration-200 ease-out-quart',
              active
                ? 'bg-charcoal text-bone'
                : 'text-graphite hover:text-charcoal',
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
};

export function PillToggle({ label, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs',
        'transition-colors duration-200 ease-out-quart',
        checked
          ? 'border-charcoal bg-charcoal text-bone'
          : 'border-line bg-bone text-graphite hover:border-stone hover:text-charcoal',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          checked ? 'bg-sage' : 'bg-stone',
        )}
      />
      {label}
    </button>
  );
}
```

- [ ] **Step 2: Implement `components/ui/Tabs.tsx`**

```tsx
'use client';

import { cn } from '@/lib/cn';

type TabsProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
};

export function Tabs<T extends string>({ options, value, onChange }: TabsProps<T>) {
  return (
    <div role="tablist" className="flex gap-6 border-b border-line">
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              '-mb-px border-b pb-2 text-sm transition-colors duration-200 ease-out-quart',
              active
                ? 'border-charcoal text-charcoal'
                : 'border-transparent text-stone hover:text-graphite',
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Implement `components/ui/Badge.tsx`**

```tsx
import { cn } from '@/lib/cn';

type BadgeProps = {
  tone?: 'neutral' | 'sage' | 'clay';
  children: React.ReactNode;
  className?: string;
};

export function Badge({ tone = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-1.5 py-0.5 text-2xs uppercase tracking-tracked',
        tone === 'neutral' && 'bg-cream text-graphite',
        tone === 'sage' && 'bg-sage/10 text-sage-deep',
        tone === 'clay' && 'bg-clay/10 text-clay',
        className,
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Implement `components/ui/Skeleton.tsx`**

```tsx
import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-sm bg-cream', className)}
    />
  );
}
```

- [ ] **Step 5: Implement `components/ui/EmptyState.tsx`**

```tsx
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-32 items-center justify-center text-sm text-stone">
      {message}
    </div>
  );
}
```

- [ ] **Step 6: Verify type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add components/ui
git commit -m "feat(ui): add Pill, Tabs, Badge, Skeleton, EmptyState primitives"
```

---

## Task 15: Layout shell (Sidebar, Topbar, PageHeader)

**Files:**
- Create: `components/layout/Sidebar.tsx`
- Create: `components/layout/Topbar.tsx`
- Create: `components/layout/PageHeader.tsx`
- Create: `components/layout/AppShell.tsx`
- Modify: `app/layout.tsx` (wrap children in AppShell + DateRangeProvider)

- [ ] **Step 1: Implement `components/layout/Sidebar.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/',             label: 'Overview' },
  { href: '/traffic',      label: 'Traffic' },
  { href: '/engagement',   label: 'Engagement' },
  { href: '/audience',     label: 'Audience' },
  { href: '/social',       label: 'Social' },
  { href: '/seo',          label: 'SEO' },
  { href: '/competitors',  label: 'Competitors' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-60 flex-col border-r border-line bg-bone">
      <div className="px-6 py-8">
        <span className="font-serif text-2xl font-extralight uppercase tracking-tracked text-charcoal">
          Alo
        </span>
      </div>
      <nav className="mt-2 flex-1">
        {NAV.map(item => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-6 py-2.5 text-sm transition-colors duration-200 ease-out-quart',
                active
                  ? 'bg-cream text-charcoal'
                  : 'text-graphite hover:text-charcoal',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-colors duration-200 ease-out-quart',
                  active ? 'bg-sage' : 'bg-transparent',
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-6 text-2xs text-stone">
        Mock data. Refreshed 5 May 2026.
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Implement `components/layout/Topbar.tsx`**

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { PillSegmented, PillToggle } from '@/components/ui/Pill';
import { useDateRange } from './DateRangeContext';
import type { RangeLabel } from '@/lib/date-range';

const RANGE_OPTIONS: readonly RangeLabel[] = ['7D', '30D', '90D', '12M', 'YTD'];

const TITLES: Record<string, string> = {
  '/': 'Overview',
  '/traffic': 'Traffic',
  '/engagement': 'Engagement',
  '/audience': 'Audience',
  '/social': 'Social',
  '/seo': 'SEO',
  '/competitors': 'Competitors',
};

export function Topbar() {
  const pathname = usePathname();
  const { label, setLabel, compare, setCompare } = useDateRange();
  const title = TITLES[pathname] ?? 'Overview';

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bone/90 px-10 py-5 backdrop-blur-sm">
      <h1 className="font-serif text-display-sm font-extralight text-charcoal">{title}</h1>
      <div className="flex items-center gap-4">
        <PillSegmented
          options={RANGE_OPTIONS}
          value={label}
          onChange={setLabel}
          size="sm"
        />
        <PillToggle label="Compare to prev period" checked={compare} onChange={setCompare} />
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-2xs uppercase tracking-tracked text-graphite">
          AY
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Implement `components/layout/PageHeader.tsx`**

```tsx
type PageHeaderProps = { title?: string; description: string };

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="px-10 pb-6 pt-8">
      {title && (
        <h2 className="font-serif text-display-md font-extralight text-charcoal">
          {title}
        </h2>
      )}
      <p className="max-w-prose pt-2 text-sm text-graphite">{description}</p>
    </div>
  );
}
```

- [ ] **Step 4: Implement `components/layout/AppShell.tsx`**

```tsx
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DateRangeProvider } from './DateRangeContext';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DateRangeProvider>
      <div className="min-h-screen">
        <Sidebar />
        <div className="ml-60">
          <Topbar />
          <main>{children}</main>
        </div>
      </div>
    </DateRangeProvider>
  );
}
```

- [ ] **Step 5: Update `app/layout.tsx` to use AppShell**

Replace existing `RootLayout` body with:

```tsx
import './globals.css';
import { Fraunces, Schibsted_Grotesk, Geist_Mono } from 'next/font/google';
import { AppShell } from '@/components/layout/AppShell';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
  display: 'swap',
});

const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-schibsted',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Alo Analytics',
  description: 'Mock digital analytics dashboard for Alo Yoga',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${schibsted.variable} ${geistMono.variable}`}
    >
      <body className="bg-bone text-charcoal min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Replace `app/page.tsx` placeholder with a temporary Overview shell**

```tsx
import { PageHeader } from '@/components/layout/PageHeader';

export default function Home() {
  return (
    <>
      <PageHeader description="A read on Alo's digital footprint and how it's moving." />
      <div className="px-10 pb-12 text-graphite">Overview content coming in Task 20.</div>
    </>
  );
}
```

- [ ] **Step 7: Run dev server and verify shell renders**

Run: `npm run dev`. Open `http://localhost:3000`. Verify: sidebar with Alo wordmark + nav, topbar with "Overview" title + range pills + compare toggle, cream-on-bone palette. Click between nav items (they will 404 on routes not yet built; that is expected). Kill the server.

- [ ] **Step 8: Commit**

```bash
git add components/layout app/layout.tsx app/page.tsx
git commit -m "feat(layout): add Sidebar, Topbar, PageHeader, AppShell"
```

---

## Task 16: ChartCard, CompetitorToggle, EditorialLede, MetricLedger

**Files:**
- Create: `components/cards/ChartCard.tsx`
- Create: `components/cards/CompetitorToggle.tsx`
- Create: `components/cards/EditorialLede.tsx`
- Create: `components/cards/MetricLedger.tsx`

- [ ] **Step 1: Implement `components/cards/ChartCard.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

type ChartCardProps = {
  title: string;
  eyebrow?: string;
  detailHref?: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function ChartCard({
  title, eyebrow, detailHref, controls, children, className,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        'group rounded-md border border-line bg-bone p-8',
        'transition-all duration-200 ease-out-quart',
        'hover:border-stone hover:shadow-hairline',
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          {eyebrow && (
            <div className="text-2xs uppercase tracking-tracked text-stone">{eyebrow}</div>
          )}
          <h3 className="font-serif text-2xl font-extralight text-charcoal">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          {controls}
          {detailHref && (
            <Link
              href={detailHref}
              className="inline-flex items-center gap-1 text-2xs uppercase tracking-tracked text-graphite transition-colors duration-200 ease-out-quart hover:text-charcoal"
            >
              View details <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          )}
        </div>
      </header>
      <div className="mt-6">{children}</div>
    </section>
  );
}
```

- [ ] **Step 2: Implement `components/cards/CompetitorToggle.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { PillToggle } from '@/components/ui/Pill';

type Props = {
  defaultOn?: boolean;
  onChange?: (v: boolean) => void;
};

export function useCompetitorToggle(defaultOn = false) {
  const [on, setOn] = useState(defaultOn);
  const node = <PillToggle label="vs Lulu / Gym" checked={on} onChange={setOn} />;
  return { on, setOn, node };
}

export function CompetitorToggleStandalone({ defaultOn = false, onChange }: Props) {
  const [on, setOn] = useState(defaultOn);
  return (
    <PillToggle
      label="vs Lulu / Gym"
      checked={on}
      onChange={v => { setOn(v); onChange?.(v); }}
    />
  );
}
```

- [ ] **Step 3: Implement `components/cards/EditorialLede.tsx`**

```tsx
import { cn } from '@/lib/cn';

type EditorialLedeProps = {
  eyebrow: string;
  number: string;
  narrative: string;
  className?: string;
};

export function EditorialLede({ eyebrow, number, narrative, className }: EditorialLedeProps) {
  return (
    <article className={cn('px-10 pt-2', className)}>
      <div className="text-2xs uppercase tracking-tracked text-stone">{eyebrow}</div>
      <div className="font-serif text-display-xl font-extralight leading-none text-charcoal">
        {number}
      </div>
      <p className="max-w-prose pt-4 text-base text-graphite">{narrative}</p>
    </article>
  );
}
```

- [ ] **Step 4: Implement `components/cards/MetricLedger.tsx`**

```tsx
import { cn } from '@/lib/cn';

export type LedgerRow = {
  label: string;
  value: string;
  delta?: { sign: 'up' | 'down' | 'flat'; text: string };
};

export function MetricLedger({
  rows, className,
}: { rows: LedgerRow[]; className?: string }) {
  return (
    <dl className={cn('px-10', className)}>
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={cn(
            'flex items-baseline justify-between gap-6 py-4',
            i !== rows.length - 1 && 'border-b border-line',
          )}
        >
          <dt className="text-2xs uppercase tracking-tracked text-stone">{r.label}</dt>
          <dd className="text-right">
            <div className="num font-mono text-3xl text-charcoal">{r.value}</div>
            {r.delta && (
              <div
                className={cn(
                  'text-xs',
                  r.delta.sign === 'up' && 'text-sage-deep',
                  r.delta.sign === 'down' && 'text-clay',
                  r.delta.sign === 'flat' && 'text-stone',
                )}
              >
                {r.delta.text}
              </div>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 5: Run type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add components/cards
git commit -m "feat(cards): add ChartCard, CompetitorToggle, EditorialLede, MetricLedger"
```

---

## Task 17: Chart primitives (Line, Area, StackedBar, HorizontalBar)

**Files:**
- Create: `components/charts/ChartTooltip.tsx`
- Create: `components/charts/LineChartBlock.tsx`
- Create: `components/charts/AreaChartBlock.tsx`
- Create: `components/charts/StackedBarBlock.tsx`
- Create: `components/charts/HorizontalBarBlock.tsx`

- [ ] **Step 1: Implement shared tooltip `components/charts/ChartTooltip.tsx`**

```tsx
'use client';

import type { TooltipProps } from 'recharts';
import { compact } from '@/lib/format';

export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-sm border border-line bg-cream px-3 py-2 text-xs">
      <div className="text-2xs uppercase tracking-tracked text-stone">{label}</div>
      {payload.map(p => (
        <div key={String(p.dataKey)} className="mt-1 flex items-center gap-3">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ background: p.color ?? 'currentColor' }}
          />
          <span className="text-graphite">{p.name}</span>
          <span className="num ml-auto font-serif text-base text-charcoal">
            {typeof p.value === 'number' ? compact(p.value) : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Implement `components/charts/LineChartBlock.tsx`**

```tsx
'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { useMemo } from 'react';
import type { TimePoint } from '@/lib/generators';
import { BRAND_COLORS } from '@/lib/brand';
import { compact } from '@/lib/format';
import { ChartTooltip } from './ChartTooltip';

export type LineSeries = {
  key: string;
  name: string;
  color: string;
  data: TimePoint[];
};

export function LineChartBlock({
  series, height = 240,
}: { series: LineSeries[]; height?: number }) {
  const merged = useMemo(() => {
    const byDate = new Map<string, Record<string, number | string>>();
    series.forEach(s => {
      s.data.forEach(p => {
        const row = byDate.get(p.date) ?? { date: p.date };
        row[s.key] = p.value;
        byDate.set(p.date, row);
      });
    });
    return Array.from(byDate.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [series]);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={merged} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={BRAND_COLORS.line} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: BRAND_COLORS.stone, fontSize: 11 }}
            axisLine={{ stroke: BRAND_COLORS.line }}
            tickLine={false}
            minTickGap={48}
          />
          <YAxis
            tick={{ fill: BRAND_COLORS.stone, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => compact(Number(v))}
            width={48}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: BRAND_COLORS.line }} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: BRAND_COLORS.graphite }}
            iconType="plainline"
          />
          {series.map(s => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive
              animationDuration={400}
              animationEasing="ease-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 3: Implement `components/charts/AreaChartBlock.tsx`**

```tsx
'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { useMemo } from 'react';
import type { TimePoint } from '@/lib/generators';
import { BRAND_COLORS } from '@/lib/brand';
import { compact } from '@/lib/format';
import { ChartTooltip } from './ChartTooltip';

export type AreaSeries = {
  key: string;
  name: string;
  color: string;
  data: TimePoint[];
};

export function AreaChartBlock({
  series, height = 280,
}: { series: AreaSeries[]; height?: number }) {
  const merged = useMemo(() => {
    const byDate = new Map<string, Record<string, number | string>>();
    series.forEach(s => {
      s.data.forEach(p => {
        const row = byDate.get(p.date) ?? { date: p.date };
        row[s.key] = p.value;
        byDate.set(p.date, row);
      });
    });
    return Array.from(byDate.values()).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [series]);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={merged} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            {series.map(s => (
              <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.18} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke={BRAND_COLORS.line} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: BRAND_COLORS.stone, fontSize: 11 }}
            axisLine={{ stroke: BRAND_COLORS.line }}
            tickLine={false}
            minTickGap={48}
          />
          <YAxis
            tick={{ fill: BRAND_COLORS.stone, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => compact(Number(v))}
            width={48}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: BRAND_COLORS.line }} />
          <Legend wrapperStyle={{ fontSize: 12, color: BRAND_COLORS.graphite }} iconType="plainline" />
          {series.map(s => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={1.5}
              fill={`url(#fill-${s.key})`}
              isAnimationActive
              animationDuration={400}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

Note on the gradient fills: these are area-chart fills under the line, not gradient text or decorative gradients. The Impeccable ban on gradients targets text and surface decoration; area-chart fills with one transparent stop are conventional data viz, not the cliché.

- [ ] **Step 4: Implement `components/charts/StackedBarBlock.tsx` (horizontal stacked, replaces donuts)**

```tsx
'use client';

import { cn } from '@/lib/cn';
import { percent } from '@/lib/format';

export type Stack = { label: string; pct: number; color: string };

export function StackedBarBlock({
  stacks, label, className,
}: { stacks: Stack[]; label?: string; className?: string }) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="pb-2 text-2xs uppercase tracking-tracked text-stone">{label}</div>
      )}
      <div className="flex h-3 w-full overflow-hidden rounded-sm">
        {stacks.map(s => (
          <div
            key={s.label}
            style={{ width: `${s.pct * 100}%`, background: s.color }}
            title={`${s.label}: ${percent(s.pct)}`}
            className="transition-opacity duration-200 ease-out-quart hover:opacity-80"
          />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5 text-xs">
        {stacks.map(s => (
          <li key={s.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-graphite">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="num font-mono text-charcoal">{percent(s.pct)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 5: Implement `components/charts/HorizontalBarBlock.tsx`**

```tsx
'use client';

import { cn } from '@/lib/cn';
import { compact } from '@/lib/format';
import { BRAND_COLORS } from '@/lib/brand';

export type HBarRow = { label: string; value: number; color?: string; rightLabel?: string };

export function HorizontalBarBlock({
  rows, max, className,
}: { rows: HBarRow[]; max?: number; className?: string }) {
  const peak = max ?? Math.max(...rows.map(r => r.value));
  return (
    <ul className={cn('space-y-2', className)}>
      {rows.map(r => {
        const w = peak === 0 ? 0 : (r.value / peak) * 100;
        return (
          <li key={r.label} className="flex items-center gap-3 text-xs">
            <span className="w-32 shrink-0 text-graphite">{r.label}</span>
            <div className="flex-1">
              <div className="h-1.5 w-full bg-cream">
                <div
                  className="h-full transition-[width] duration-400 ease-out-quart"
                  style={{ width: `${w}%`, background: r.color ?? BRAND_COLORS.sage }}
                />
              </div>
            </div>
            <span className="num w-16 shrink-0 text-right font-mono text-charcoal">
              {r.rightLabel ?? compact(r.value)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 6: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add components/charts
git commit -m "feat(charts): add Line, Area, StackedBar, HorizontalBar primitives + tooltip"
```

---

## Task 18: FunnelStepDown and AuthorityScale chart primitives

**Files:**
- Create: `components/charts/FunnelStepDown.tsx`
- Create: `components/charts/AuthorityScale.tsx`

- [ ] **Step 1: Implement `components/charts/FunnelStepDown.tsx`**

```tsx
'use client';

import { compact, percent } from '@/lib/format';
import type { FunnelStep } from '@/lib/mock-data/engagement';

export function FunnelStepDown({ steps }: { steps: FunnelStep[] }) {
  const peak = steps[0]?.value ?? 1;
  return (
    <ol className="space-y-5">
      {steps.map((s, i) => {
        const widthPct = (s.value / peak) * 100;
        return (
          <li key={s.label}>
            <div className="flex items-baseline justify-between gap-4">
              <div className="text-2xs uppercase tracking-tracked text-stone">{s.label}</div>
              <div className="num font-serif text-display-sm font-extralight text-charcoal">
                {compact(s.value)}
              </div>
            </div>
            <div className="mt-1 h-px w-full bg-line">
              <div
                className="h-full bg-charcoal transition-[width] duration-400 ease-out-quart"
                style={{ width: `${widthPct}%` }}
              />
            </div>
            {i < steps.length - 1 && (
              <div className="pt-2 text-2xs text-graphite">
                {percent(s.rateToNext)} continue to {steps[i + 1].label.toLowerCase()}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
```

- [ ] **Step 2: Implement `components/charts/AuthorityScale.tsx`**

```tsx
import { cn } from '@/lib/cn';

export function AuthorityScale({ score, max = 100 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  return (
    <div className={cn('w-full')}>
      <div className="flex items-baseline gap-2">
        <span className="num font-serif text-display-md font-extralight text-charcoal">{score}</span>
        <span className="text-sm text-stone">/ {max}</span>
      </div>
      <div className="mt-3 h-px w-full bg-line">
        <div
          className="h-full bg-sage transition-[width] duration-400 ease-out-quart"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-2xs text-stone">
        <span>0</span><span>{max}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/charts/FunnelStepDown.tsx components/charts/AuthorityScale.tsx
git commit -m "feat(charts): add FunnelStepDown and AuthorityScale primitives"
```

---

## Task 19: Per-page data hooks

**Files:**
- Create: `lib/hooks/usePageData.ts`

- [ ] **Step 1: Implement `lib/hooks/usePageData.ts`**

```ts
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
```

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/hooks/usePageData.ts
git commit -m "feat(hooks): add per-page data hooks bound to DateRangeContext"
```

---

## Task 20: Overview page

**Files:**
- Modify: `app/page.tsx` (full Overview)

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { EditorialLede } from '@/components/cards/EditorialLede';
import { MetricLedger, type LedgerRow } from '@/components/cards/MetricLedger';
import { ChartCard } from '@/components/cards/ChartCard';
import { CompetitorToggleStandalone } from '@/components/cards/CompetitorToggle';
import { AreaChartBlock } from '@/components/charts/AreaChartBlock';
import { LineChartBlock } from '@/components/charts/LineChartBlock';
import { StackedBarBlock } from '@/components/charts/StackedBarBlock';
import { HorizontalBarBlock } from '@/components/charts/HorizontalBarBlock';
import { AuthorityScale } from '@/components/charts/AuthorityScale';
import { useTrafficData, useEngagementData, useSocialData, useSeoData } from '@/lib/hooks/usePageData';
import { trafficSeries } from '@/lib/mock-data/traffic';
import { followerSeries } from '@/lib/mock-data/social';
import { keywords } from '@/lib/mock-data/audience';
import { topCountries, ageGenderMatrix } from '@/lib/mock-data/audience';
import { BRANDS } from '@/lib/mock-data/story';
import { BRAND_COLORS } from '@/lib/brand';
import { compact, percent, signedPercent, integer } from '@/lib/format';
import { sliceSeries } from '@/lib/date-range';
import { useDateRange } from '@/components/layout/DateRangeContext';

export default function Overview() {
  const { range } = useDateRange();
  const traffic = useTrafficData('alo');
  const eng = useEngagementData('alo');
  const social = useSocialData('all', 'alo');
  const seo = useSeoData('alo');

  const [trafficCompare, setTrafficCompare] = useState(false);
  const [socialCompare, setSocialCompare] = useState(false);

  const ledgerRows: LedgerRow[] = [
    { label: 'Engaged Sessions', value: compact(BRANDS.alo.sessions * BRANDS.alo.engagementRate), delta: { sign: 'up', text: '+22.1% vs prior' } },
    { label: 'Conversion Rate',  value: percent(BRANDS.alo.conversionRate, 2),                     delta: { sign: 'up', text: '+0.6pp vs prior' } },
    { label: 'Total Backlinks',  value: compact(BRANDS.alo.backlinks),                              delta: { sign: 'up', text: '+4.2% vs prior' } },
  ];

  const trafficSeriesProps = trafficCompare
    ? [
        { key: 'alo',  name: 'Alo Yoga',  color: BRAND_COLORS.sage, data: sliceSeries(trafficSeries('alo'),  range) },
        { key: 'lulu', name: 'Lululemon', color: BRAND_COLORS.lulu, data: sliceSeries(trafficSeries('lulu'), range) },
        { key: 'gym',  name: 'Gymshark',  color: BRAND_COLORS.gym,  data: sliceSeries(trafficSeries('gym'),  range) },
      ]
    : [{ key: 'alo', name: 'Organic Sessions', color: BRAND_COLORS.sage, data: traffic.series }];

  const igSeries = social.seriesByPlatform.find(s => s.platform === 'ig')?.data ?? [];
  const tiktokSeries = social.seriesByPlatform.find(s => s.platform === 'tiktok')?.data ?? [];
  const ytSeries = social.seriesByPlatform.find(s => s.platform === 'yt')?.data ?? [];

  const socialSeriesProps = socialCompare
    ? [
        { key: 'alo',  name: 'Alo Yoga IG',  color: BRAND_COLORS.sage, data: sliceSeries(followerSeries('alo',  'ig'), range) },
        { key: 'lulu', name: 'Lululemon IG', color: BRAND_COLORS.lulu, data: sliceSeries(followerSeries('lulu', 'ig'), range) },
        { key: 'gym',  name: 'Gymshark IG',  color: BRAND_COLORS.gym,  data: sliceSeries(followerSeries('gym',  'ig'), range) },
      ]
    : [
        { key: 'ig',     name: 'Instagram', color: BRAND_COLORS.sage,     data: igSeries },
        { key: 'tiktok', name: 'TikTok',    color: BRAND_COLORS.charcoal, data: tiktokSeries },
        { key: 'yt',     name: 'YouTube',   color: BRAND_COLORS.clay,     data: ytSeries },
      ];

  return (
    <>
      {/* Row 1: Editorial ledger lede */}
      <section className="grid grid-cols-12 gap-6 px-0 pb-12 pt-8">
        <div className="col-span-7">
          <EditorialLede
            eyebrow="Organic sessions"
            number={compact(BRANDS.alo.sessions)}
            narrative={`up ${signedPercent(BRANDS.alo.yoyGrowth).slice(1)} from prior 30 days, led by men's vertical search.`}
          />
        </div>
        <div className="col-span-5">
          <MetricLedger rows={ledgerRows} />
        </div>
      </section>

      {/* Row 2: Hero traffic + source split */}
      <section className="grid grid-cols-12 gap-6 px-10 pb-12">
        <ChartCard
          title="Organic Traffic"
          eyebrow="Sessions"
          detailHref="/traffic"
          controls={<CompetitorToggleStandalone defaultOn={trafficCompare} onChange={setTrafficCompare} />}
          className="col-span-8"
        >
          <AreaChartBlock series={trafficSeriesProps} />
        </ChartCard>

        <ChartCard
          title="Sessions by Source"
          eyebrow="Channel split"
          detailHref="/traffic"
          className="col-span-4"
        >
          <StackedBarBlock
            stacks={traffic.sourceBreakdown.map((s, i) => ({
              label: s.label,
              pct: s.pct,
              color: [BRAND_COLORS.sage, BRAND_COLORS.charcoal, BRAND_COLORS.lulu, BRAND_COLORS.gym, BRAND_COLORS.clay, BRAND_COLORS.stone][i],
            }))}
          />
        </ChartCard>
      </section>

      {/* Row 3: Engagement + Social growth */}
      <section className="grid grid-cols-12 gap-6 px-10 pb-12">
        <ChartCard
          title="Engagement Rate"
          eyebrow="Engaged sessions / total"
          detailHref="/engagement"
          className="col-span-6"
        >
          <LineChartBlock
            series={[{ key: 'erate', name: 'Engagement Rate', color: BRAND_COLORS.sage, data: eng.erate }]}
          />
        </ChartCard>
        <ChartCard
          title="Follower Growth"
          eyebrow="IG / TikTok / YT"
          detailHref="/social"
          controls={<CompetitorToggleStandalone defaultOn={socialCompare} onChange={setSocialCompare} />}
          className="col-span-6"
        >
          <LineChartBlock series={socialSeriesProps} />
        </ChartCard>
      </section>

      {/* Row 4: Top keywords + SEO three-stack */}
      <section className="grid grid-cols-12 gap-6 px-10 pb-12">
        <ChartCard title="Top Keywords" eyebrow="Sorted by volume" detailHref="/audience" className="col-span-8">
          <table className="w-full text-sm">
            <thead className="text-2xs uppercase tracking-tracked text-stone">
              <tr>
                <th className="pb-3 text-left">Keyword</th>
                <th className="pb-3 text-left">Intent</th>
                <th className="pb-3 text-right">Volume</th>
                <th className="pb-3 text-right">Position</th>
                <th className="pb-3 text-right">Change</th>
              </tr>
            </thead>
            <tbody className="num font-mono">
              {keywords.slice(0, 8).map(k => (
                <tr key={k.keyword} className="border-t border-line">
                  <td className="py-2.5 font-sans text-charcoal">{k.keyword}</td>
                  <td className="py-2.5 font-sans text-graphite">{k.intent}</td>
                  <td className="py-2.5 text-right text-charcoal">{integer(k.volume)}</td>
                  <td className="py-2.5 text-right text-charcoal">{k.position}</td>
                  <td className={`py-2.5 text-right ${k.change > 0 ? 'text-sage-deep' : k.change < 0 ? 'text-clay' : 'text-stone'}`}>
                    {k.change > 0 ? `+${k.change}` : k.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>

        <div className="col-span-4">
          <div className="grid grid-cols-1 divide-y divide-line border-y border-line py-2">
            <div className="py-5">
              <div className="text-2xs uppercase tracking-tracked text-stone">Authority Score</div>
              <AuthorityScale score={BRANDS.alo.authorityScore} />
            </div>
            <div className="py-5">
              <div className="text-2xs uppercase tracking-tracked text-stone">Total Backlinks</div>
              <div className="num font-serif text-display-md font-extralight text-charcoal">
                {compact(BRANDS.alo.backlinks)}
              </div>
            </div>
            <div className="py-5">
              <div className="text-2xs uppercase tracking-tracked text-stone">Referring Domains</div>
              <div className="num font-serif text-display-md font-extralight text-charcoal">
                {compact(BRANDS.alo.referringDomains)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 5: Geo + Demographics */}
      <section className="grid grid-cols-12 gap-6 px-10 pb-16">
        <ChartCard title="Top Countries" eyebrow="Sessions" className="col-span-6">
          <HorizontalBarBlock
            rows={topCountries.map(c => ({ label: c.country, value: c.sessions }))}
          />
        </ChartCard>
        <ChartCard title="Demographics" eyebrow="Age x Gender" className="col-span-6">
          <div className="grid grid-cols-5 items-end gap-2 pt-2">
            {ageGenderMatrix.map(row => {
              const total = row.female + row.male + row.nonbinary;
              return (
                <div key={row.ageBracket} className="flex flex-col items-center gap-2">
                  <div className="flex h-32 w-full flex-col-reverse overflow-hidden rounded-sm">
                    <div style={{ height: `${(row.female / total) * 100}%`, background: BRAND_COLORS.sage }} />
                    <div style={{ height: `${(row.male / total) * 100}%`, background: BRAND_COLORS.charcoal }} />
                    <div style={{ height: `${(row.nonbinary / total) * 100}%`, background: BRAND_COLORS.clay }} />
                  </div>
                  <div className="text-2xs text-stone">{row.ageBracket}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-graphite">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sage" /> Female</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-charcoal" /> Male</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-clay" /> Nonbinary</span>
          </div>
        </ChartCard>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run dev server and verify Overview**

Run: `npm run dev`. Open `http://localhost:3000`.

Verify visually:
- Editorial lede with `4.2M` headline in serif display
- Right-side ledger with 3 metrics
- Area chart of organic traffic (toggle competitor switch and confirm Lulu / Gym lines fade in)
- Stacked bar source split
- Line charts for Engagement Rate and Follower Growth
- Keyword table with intent chips
- 3-row editorial SEO block (Authority Score / Backlinks / Referring Domains)
- Top countries horizontal bars
- Demographics stacked bars

Kill the server.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(overview): build Overview page with editorial lede, ledger, charts"
```

---

## Task 21: Traffic page

**Files:**
- Create: `app/traffic/page.tsx`

- [ ] **Step 1: Implement `app/traffic/page.tsx`**

```tsx
'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/cards/ChartCard';
import { CompetitorToggleStandalone } from '@/components/cards/CompetitorToggle';
import { AreaChartBlock } from '@/components/charts/AreaChartBlock';
import { LineChartBlock } from '@/components/charts/LineChartBlock';
import { StackedBarBlock } from '@/components/charts/StackedBarBlock';
import { PillSegmented } from '@/components/ui/Pill';
import { useTrafficData } from '@/lib/hooks/usePageData';
import { trafficSeries } from '@/lib/mock-data/traffic';
import { useDateRange } from '@/components/layout/DateRangeContext';
import { sliceSeries } from '@/lib/date-range';
import { BRAND_COLORS } from '@/lib/brand';
import { compact, signedPercent, percent } from '@/lib/format';

const AGG = ['Daily', 'Weekly', 'Monthly', 'Yearly'] as const;
type Agg = typeof AGG[number];

function aggregate(data: { date: string; value: number }[], agg: Agg) {
  if (agg === 'Daily') return data;
  const buckets = new Map<string, number>();
  for (const p of data) {
    const d = new Date(p.date + 'T00:00:00Z');
    let key: string;
    if (agg === 'Weekly') {
      const day = d.getUTCDay();
      const monday = new Date(d.getTime() - ((day + 6) % 7) * 86_400_000);
      key = monday.toISOString().slice(0, 10);
    } else if (agg === 'Monthly') {
      key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    } else {
      key = String(d.getUTCFullYear());
    }
    buckets.set(key, (buckets.get(key) ?? 0) + p.value);
  }
  return Array.from(buckets.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export default function TrafficPage() {
  const { range } = useDateRange();
  const traffic = useTrafficData('alo');
  const [agg, setAgg] = useState<Agg>('Daily');
  const [compare, setCompare] = useState(false);

  const heroData = useMemo(() => aggregate(traffic.series, agg), [traffic.series, agg]);
  const compData = useMemo(() => ({
    lulu: aggregate(sliceSeries(trafficSeries('lulu'), range), agg),
    gym:  aggregate(sliceSeries(trafficSeries('gym'),  range), agg),
  }), [range, agg]);

  const heroSeries = compare
    ? [
        { key: 'alo',  name: 'Alo Yoga',  color: BRAND_COLORS.sage, data: heroData },
        { key: 'lulu', name: 'Lululemon', color: BRAND_COLORS.lulu, data: compData.lulu },
        { key: 'gym',  name: 'Gymshark',  color: BRAND_COLORS.gym,  data: compData.gym },
      ]
    : [{ key: 'alo', name: 'Sessions', color: BRAND_COLORS.sage, data: heroData }];

  return (
    <>
      <PageHeader description="Where the traffic is coming from, how much, and who's bringing it." />

      <section className="px-10 pb-10">
        <ChartCard
          title="Organic Sessions"
          eyebrow={`${signedPercent(traffic.delta)} vs prior period`}
          controls={
            <div className="flex items-center gap-3">
              <PillSegmented options={AGG} value={agg} onChange={setAgg} size="sm" />
              <CompetitorToggleStandalone defaultOn={compare} onChange={setCompare} />
            </div>
          }
        >
          <AreaChartBlock series={heroSeries} height={320} />
        </ChartCard>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 pb-10">
        <ChartCard title="Sessions" eyebrow="Total" className="col-span-6">
          <div className="num pb-3 font-serif text-display-sm font-extralight text-charcoal">
            {compact(traffic.total)}
          </div>
          <LineChartBlock
            series={[{ key: 'alo', name: 'Sessions', color: BRAND_COLORS.sage, data: traffic.series }]}
            height={140}
          />
        </ChartCard>

        <div className="col-span-6 grid grid-cols-1 gap-6">
          <ChartCard title="Users" eyebrow="Unique">
            <LineChartBlock
              series={[{ key: 'users', name: 'Users', color: BRAND_COLORS.charcoal, data: traffic.users.series }]}
              height={100}
            />
          </ChartCard>
          <ChartCard title="Pages / Session" eyebrow="Average">
            <LineChartBlock
              series={[{ key: 'pps', name: 'Pages/Session', color: BRAND_COLORS.sage, data: traffic.pps.series }]}
              height={100}
            />
          </ChartCard>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 pb-16">
        <ChartCard title="Sessions by Source" eyebrow="Channel split" className="col-span-8">
          <StackedBarBlock
            stacks={traffic.sourceBreakdown.map((s, i) => ({
              label: s.label,
              pct: s.pct,
              color: [BRAND_COLORS.sage, BRAND_COLORS.charcoal, BRAND_COLORS.lulu, BRAND_COLORS.gym, BRAND_COLORS.clay, BRAND_COLORS.stone][i],
            }))}
          />
        </ChartCard>
        <ChartCard title="Device" eyebrow="Sessions split" className="col-span-4">
          <div className="num pb-2 font-serif text-display-sm font-extralight text-charcoal">
            {compact(traffic.total)}
          </div>
          <StackedBarBlock
            stacks={traffic.deviceSplit.map((d, i) => ({
              label: d.label,
              pct: d.pct,
              color: [BRAND_COLORS.charcoal, BRAND_COLORS.sage, BRAND_COLORS.stone][i],
            }))}
          />
          <div className="pt-3 text-xs text-graphite">{percent(traffic.deviceSplit[0].pct)} mobile.</div>
        </ChartCard>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run dev server, verify Traffic page**

Run: `npm run dev`. Navigate to `/traffic`.

Verify: hero area chart, aggregation pill switches Daily/Weekly/Monthly/Yearly, competitor toggle adds Lulu/Gym lines, asymmetric 6+3+3 row of secondary cards, stacked source + device split.

Kill the server.

- [ ] **Step 3: Commit**

```bash
git add app/traffic
git commit -m "feat(traffic): build Traffic page with aggregation tabs and competitor toggle"
```

---

## Task 22: Engagement page (with funnel)

**Files:**
- Create: `app/engagement/page.tsx`

- [ ] **Step 1: Implement `app/engagement/page.tsx`**

```tsx
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/cards/ChartCard';
import { CompetitorToggleStandalone } from '@/components/cards/CompetitorToggle';
import { LineChartBlock } from '@/components/charts/LineChartBlock';
import { FunnelStepDown } from '@/components/charts/FunnelStepDown';
import { useEngagementData } from '@/lib/hooks/usePageData';
import { engagedSessionsSeries } from '@/lib/mock-data/engagement';
import { useDateRange } from '@/components/layout/DateRangeContext';
import { sliceSeries } from '@/lib/date-range';
import { BRAND_COLORS } from '@/lib/brand';
import { compact, percent, duration, integer } from '@/lib/format';
import { BRANDS } from '@/lib/mock-data/story';

export default function EngagementPage() {
  const { range } = useDateRange();
  const eng = useEngagementData('alo');
  const [compare, setCompare] = useState(false);

  const heroSeries = compare
    ? [
        { key: 'alo',  name: 'Alo Yoga',  color: BRAND_COLORS.sage, data: eng.engaged },
        { key: 'lulu', name: 'Lululemon', color: BRAND_COLORS.lulu, data: sliceSeries(engagedSessionsSeries('lulu'), range) },
        { key: 'gym',  name: 'Gymshark',  color: BRAND_COLORS.gym,  data: sliceSeries(engagedSessionsSeries('gym'),  range) },
      ]
    : [{ key: 'alo', name: 'Engaged Sessions', color: BRAND_COLORS.sage, data: eng.engaged }];

  return (
    <>
      <PageHeader description="How deeply visitors interact and where they drop off in the funnel." />

      <section className="px-10 pb-10">
        <ChartCard
          title="Engaged Sessions"
          eyebrow="Sessions with meaningful interaction"
          controls={<CompetitorToggleStandalone defaultOn={compare} onChange={setCompare} />}
        >
          <LineChartBlock series={heroSeries} height={320} />
        </ChartCard>
      </section>

      {/* Editorial ledger row of 4 KPIs, no cards */}
      <section className="grid grid-cols-4 divide-x divide-line border-y border-line px-10 py-2">
        {[
          { label: 'Engagement Rate',  value: percent(BRANDS.alo.engagementRate), delta: '+2.1pp' },
          { label: 'Avg Engagement Time', value: duration(184), delta: '+11s' },
          { label: 'Bounce Rate',       value: percent(0.38),  delta: '-1.4pp' },
          { label: 'Events / Session',  value: '8.4',          delta: '+0.6' },
        ].map((m, i) => (
          <div key={m.label} className={`px-6 py-6 ${i === 0 ? 'pl-0' : ''}`}>
            <div className="text-2xs uppercase tracking-tracked text-stone">{m.label}</div>
            <div className="num font-serif text-display-sm font-extralight text-charcoal">{m.value}</div>
            <div className="text-xs text-sage-deep">{m.delta} vs prior</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 py-10">
        <ChartCard title="Top Engaged Pages" eyebrow="Sorted by sessions" className="col-span-7">
          <table className="w-full text-sm">
            <thead className="text-2xs uppercase tracking-tracked text-stone">
              <tr>
                <th className="pb-3 text-left">URL</th>
                <th className="pb-3 text-right">Sessions</th>
                <th className="pb-3 text-right">Avg Time</th>
                <th className="pb-3 text-right">Engagement Rate</th>
              </tr>
            </thead>
            <tbody className="num font-mono">
              {eng.topPages.map(p => (
                <tr key={p.url} className="border-t border-line">
                  <td className="py-2.5 font-sans text-charcoal">{p.url}</td>
                  <td className="py-2.5 text-right text-charcoal">{integer(p.sessions)}</td>
                  <td className="py-2.5 text-right text-charcoal">{duration(p.avgTimeSec)}</td>
                  <td className="py-2.5 text-right text-charcoal">{percent(p.engagementRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>

        <ChartCard title="Conversion Funnel" eyebrow="Sessions to purchase" className="col-span-5">
          <FunnelStepDown steps={eng.funnel} />
          <div className="mt-6 border-t border-line pt-3 text-xs text-graphite">
            Overall conversion rate: <span className="num font-mono text-charcoal">{percent(BRANDS.alo.conversionRate, 2)}</span>
          </div>
        </ChartCard>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run dev server, verify Engagement page**

Run: `npm run dev`. Navigate to `/engagement`.

Verify: hero engaged-sessions line chart with competitor toggle, 4-cell editorial KPI ledger separated by hairlines, top-pages table on the left, typographic step-down funnel on the right.

Kill the server.

- [ ] **Step 3: Commit**

```bash
git add app/engagement
git commit -m "feat(engagement): build Engagement page with KPI ledger and step-down funnel"
```

---

## Task 23: Audience page (with keyword filter)

**Files:**
- Create: `app/audience/page.tsx`

- [ ] **Step 1: Implement `app/audience/page.tsx`**

```tsx
'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/cards/ChartCard';
import { HorizontalBarBlock } from '@/components/charts/HorizontalBarBlock';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { BRAND_COLORS } from '@/lib/brand';
import { ageGenderMatrix, topCountries, interests, keywords, type KeywordIntent } from '@/lib/mock-data/audience';
import { integer, percent } from '@/lib/format';
import { cn } from '@/lib/cn';

const FILTERS: readonly (KeywordIntent | 'All')[] = ['All', "Men's", "Women's", 'Workout', 'Lifestyle', 'Yoga'];

export default function AudiencePage() {
  const [filter, setFilter] = useState<typeof FILTERS[number]>('All');
  const filteredKeywords = useMemo(
    () => filter === 'All' ? keywords : keywords.filter(k => k.intent.toLowerCase() === filter.toLowerCase()),
    [filter],
  );

  return (
    <>
      <PageHeader description="Who's coming to Alo, where from, and what they're searching for." />

      <section className="grid grid-cols-12 gap-6 px-10 pb-10">
        <ChartCard title="Age x Gender" eyebrow="Sessions distribution" className="col-span-7">
          <div className="grid grid-cols-5 items-end gap-4 pt-2">
            {ageGenderMatrix.map(row => {
              const total = row.female + row.male + row.nonbinary;
              return (
                <div key={row.ageBracket} className="flex flex-col items-center gap-2">
                  <div className="flex h-48 w-full flex-col-reverse overflow-hidden rounded-sm">
                    <div style={{ height: `${(row.female / total) * 100}%`, background: BRAND_COLORS.sage }} />
                    <div style={{ height: `${(row.male / total) * 100}%`, background: BRAND_COLORS.charcoal }} />
                    <div style={{ height: `${(row.nonbinary / total) * 100}%`, background: BRAND_COLORS.clay }} />
                  </div>
                  <div className="text-2xs text-stone">{row.ageBracket}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex gap-4 text-xs text-graphite">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sage" /> Female</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-charcoal" /> Male</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-clay" /> Nonbinary</span>
          </div>
        </ChartCard>

        <ChartCard title="Interests" eyebrow="Affinity index" className="col-span-5">
          <HorizontalBarBlock
            rows={interests.map(i => ({
              label: i.label,
              value: i.affinity * 10,
              rightLabel: i.affinity.toFixed(1),
            }))}
          />
        </ChartCard>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 pb-10">
        <ChartCard title="Top Countries" eyebrow="Sessions" className="col-span-5">
          <HorizontalBarBlock
            rows={topCountries.map(c => ({ label: c.country, value: c.sessions }))}
          />
        </ChartCard>

        <ChartCard title="Targeted Keywords" eyebrow="Filter by intent" className="col-span-7">
          <div className="flex flex-wrap gap-2 pb-4">
            {FILTERS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors duration-200 ease-out-quart',
                  filter === f
                    ? 'border-charcoal bg-charcoal text-bone'
                    : 'border-line text-graphite hover:border-stone hover:text-charcoal',
                )}
              >
                {f}
              </button>
            ))}
          </div>
          {filteredKeywords.length === 0 ? (
            <EmptyState message="No keywords match this filter." />
          ) : (
            <table className="w-full text-sm">
              <thead className="text-2xs uppercase tracking-tracked text-stone">
                <tr>
                  <th className="pb-3 text-left">Keyword</th>
                  <th className="pb-3 text-left">Intent</th>
                  <th className="pb-3 text-right">Volume</th>
                  <th className="pb-3 text-right">Position</th>
                  <th className="pb-3 text-right">Change</th>
                </tr>
              </thead>
              <tbody className="num font-mono">
                {filteredKeywords.map(k => (
                  <tr key={k.keyword} className="border-t border-line">
                    <td className="py-2.5 font-sans text-charcoal">{k.keyword}</td>
                    <td className="py-2.5"><Badge tone="neutral">{k.intent}</Badge></td>
                    <td className="py-2.5 text-right text-charcoal">{integer(k.volume)}</td>
                    <td className="py-2.5 text-right text-charcoal">{k.position}</td>
                    <td className={`py-2.5 text-right ${k.change > 0 ? 'text-sage-deep' : k.change < 0 ? 'text-clay' : 'text-stone'}`}>
                      {k.change > 0 ? `+${k.change}` : k.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </ChartCard>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run dev server, verify Audience page**

Run: `npm run dev`. Navigate to `/audience`.

Verify: age x gender stacked bars, interests horizontal bar list, top countries horizontal bars, intent filter chips that filter the keyword table, EmptyState shows when a filter has no matches (try "Men's"; it has matches. All filters should have matches in current data, so manually flip to one with no rows to confirm if needed).

Kill the server.

- [ ] **Step 3: Commit**

```bash
git add app/audience
git commit -m "feat(audience): build Audience page with intent-filtered keyword table"
```

---

## Task 24: Social page (platform tabs + top posts grid)

**Files:**
- Create: `app/social/page.tsx`

- [ ] **Step 1: Implement `app/social/page.tsx`**

```tsx
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
```

- [ ] **Step 2: Run dev server, verify Social page**

Run: `npm run dev`. Navigate to `/social`.

Verify: tabs at top (All/IG/TikTok/YT), follower line chart re-keys on tab switch, competitor toggle visible only on single-platform tabs, 4-cell editorial KPI row, top posts grid with one feature tile and five smaller tiles.

Kill the server.

- [ ] **Step 3: Commit**

```bash
git add app/social
git commit -m "feat(social): build Social page with platform tabs and top posts grid"
```

---

## Task 25: SEO page

**Files:**
- Create: `app/seo/page.tsx`

- [ ] **Step 1: Implement `app/seo/page.tsx`**

```tsx
'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/cards/ChartCard';
import { AreaChartBlock } from '@/components/charts/AreaChartBlock';
import { HorizontalBarBlock } from '@/components/charts/HorizontalBarBlock';
import { AuthorityScale } from '@/components/charts/AuthorityScale';
import { useSeoData } from '@/lib/hooks/usePageData';
import { topReferringDomains, anchorTextDistribution } from '@/lib/mock-data/seo';
import { BRANDS } from '@/lib/mock-data/story';
import { BRAND_COLORS } from '@/lib/brand';
import { compact, integer, percent } from '@/lib/format';

export default function SeoPage() {
  const seo = useSeoData('alo');
  const b = BRANDS.alo;

  return (
    <>
      <PageHeader description="Authority, backlinks, and the editorial network referring to alo.com." />

      {/* Editorial three-stack at top, no card frame */}
      <section className="grid grid-cols-3 divide-x divide-line border-y border-line px-10 py-2">
        <div className="px-6 py-8">
          <div className="text-2xs uppercase tracking-tracked text-stone">Authority Score</div>
          <AuthorityScale score={b.authorityScore} />
        </div>
        <div className="px-6 py-8">
          <div className="text-2xs uppercase tracking-tracked text-stone">Total Backlinks</div>
          <div className="num font-serif text-display-lg font-extralight leading-none text-charcoal">
            {compact(b.backlinks)}
          </div>
          <div className="pt-2 text-xs text-sage-deep">+18% YoY</div>
        </div>
        <div className="px-6 py-8">
          <div className="text-2xs uppercase tracking-tracked text-stone">Referring Domains</div>
          <div className="num font-serif text-display-lg font-extralight leading-none text-charcoal">
            {compact(b.referringDomains)}
          </div>
          <div className="pt-2 text-xs text-sage-deep">+9% YoY</div>
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 py-10">
        <ChartCard title="Backlinks Over Time" eyebrow="Cumulative" className="col-span-8">
          <AreaChartBlock
            series={[{ key: 'backlinks', name: 'Backlinks', color: BRAND_COLORS.sage, data: seo.backlinks }]}
            height={280}
          />
        </ChartCard>
        <ChartCard title="Anchor Text" eyebrow="Distribution" className="col-span-4">
          <HorizontalBarBlock
            rows={anchorTextDistribution.map(a => ({
              label: a.label,
              value: a.share * 100,
              rightLabel: percent(a.share),
            }))}
          />
        </ChartCard>
      </section>

      <section className="px-10 pb-16">
        <ChartCard title="Top Referring Domains" eyebrow="Sorted by authority">
          <table className="w-full text-sm">
            <thead className="text-2xs uppercase tracking-tracked text-stone">
              <tr>
                <th className="pb-3 text-left">Domain</th>
                <th className="pb-3 text-right">Authority</th>
                <th className="pb-3 text-right">Backlinks</th>
                <th className="pb-3 text-right">First Seen</th>
              </tr>
            </thead>
            <tbody className="num font-mono">
              {topReferringDomains.map(d => (
                <tr key={d.domain} className="border-t border-line">
                  <td className="py-2.5 font-sans text-charcoal">{d.domain}</td>
                  <td className="py-2.5 text-right text-charcoal">{d.authority}</td>
                  <td className="py-2.5 text-right text-charcoal">{integer(d.backlinks)}</td>
                  <td className="py-2.5 text-right text-graphite">{d.firstSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run dev server, verify SEO page**

Run: `npm run dev`. Navigate to `/seo`.

Verify: editorial three-stack at top with hairline verticals, backlinks area chart, anchor text horizontal bars, referring domains table.

Kill the server.

- [ ] **Step 3: Commit**

```bash
git add app/seo
git commit -m "feat(seo): build SEO page with editorial three-stack and referring domains"
```

---

## Task 26: Competitors page

**Files:**
- Create: `app/competitors/page.tsx`

- [ ] **Step 1: Implement `app/competitors/page.tsx`**

```tsx
'use client';

import { useMemo } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/cards/ChartCard';
import { LineChartBlock } from '@/components/charts/LineChartBlock';
import { HorizontalBarBlock } from '@/components/charts/HorizontalBarBlock';
import { StackedBarBlock } from '@/components/charts/StackedBarBlock';
import {
  trafficByBrand, engagementComparison, followersByPlatform,
  seoComparison, shareOfVoice, benchmarkTable,
} from '@/lib/mock-data/competitors';
import { BRANDS } from '@/lib/mock-data/story';
import { useDateRange } from '@/components/layout/DateRangeContext';
import { sliceSeries } from '@/lib/date-range';
import { compact, percent, signedPercent, integer } from '@/lib/format';

const PLATFORM_LABEL = { ig: 'Instagram', tiktok: 'TikTok', yt: 'YouTube' } as const;

export default function CompetitorsPage() {
  const { range } = useDateRange();
  const traffic = trafficByBrand();
  const eng = engagementComparison();
  const social = followersByPlatform();
  const seo = seoComparison();
  const sov = shareOfVoice();
  const bench = benchmarkTable();

  const trafficSeries = useMemo(() => [
    { key: 'alo',  name: 'Alo Yoga',  color: BRANDS.alo.color,  data: sliceSeries(traffic.alo,  range) },
    { key: 'lulu', name: 'Lululemon', color: BRANDS.lulu.color, data: sliceSeries(traffic.lulu, range) },
    { key: 'gym',  name: 'Gymshark',  color: BRANDS.gym.color,  data: sliceSeries(traffic.gym,  range) },
  ], [traffic, range]);

  return (
    <>
      <PageHeader description="How Alo stacks up against Lululemon and Gymshark across web, social, and search." />

      {/* Brand strip: 6 + 3 + 3 with hairlines */}
      <section className="grid grid-cols-12 divide-x divide-line border-y border-line px-10">
        <div className="col-span-6 py-8 pr-8">
          <div className="text-2xs uppercase tracking-tracked text-stone">Alo Yoga</div>
          <div className="num font-serif text-display-lg font-extralight leading-none text-charcoal">
            {compact(BRANDS.alo.sessions)}
          </div>
          <div className="pt-2 text-sm text-sage-deep">{signedPercent(BRANDS.alo.yoyGrowth)} YoY</div>
          <p className="max-w-prose pt-3 text-xs text-graphite">
            Smaller absolute scale, leading on engagement and growth.
          </p>
        </div>
        <div className="col-span-3 px-6 py-8">
          <div className="text-2xs uppercase tracking-tracked text-stone">Lululemon</div>
          <div className="num font-serif text-display-md font-extralight leading-none text-charcoal">
            {compact(BRANDS.lulu.sessions)}
          </div>
          <div className="pt-1 text-xs text-graphite">
            {(BRANDS.lulu.sessions / BRANDS.alo.sessions).toFixed(1)}x Alo traffic. {signedPercent(BRANDS.lulu.yoyGrowth)} YoY.
          </div>
        </div>
        <div className="col-span-3 px-6 py-8">
          <div className="text-2xs uppercase tracking-tracked text-stone">Gymshark</div>
          <div className="num font-serif text-display-md font-extralight leading-none text-charcoal">
            {compact(BRANDS.gym.sessions)}
          </div>
          <div className="pt-1 text-xs text-graphite">
            {(BRANDS.gym.sessions / BRANDS.alo.sessions).toFixed(2)}x Alo traffic. {signedPercent(BRANDS.gym.yoyGrowth)} YoY.
          </div>
        </div>
      </section>

      <section className="px-10 py-10">
        <ChartCard title="Traffic" eyebrow="Sessions over time">
          <LineChartBlock series={trafficSeries} height={320} />
        </ChartCard>
      </section>

      <section className="px-10 pb-10">
        <ChartCard title="Engagement Comparison" eyebrow="Per metric">
          <table className="w-full text-sm">
            <thead className="text-2xs uppercase tracking-tracked text-stone">
              <tr>
                <th className="pb-3 text-left">Metric</th>
                <th className="pb-3 text-right">Alo</th>
                <th className="pb-3 text-right">Lululemon</th>
                <th className="pb-3 text-right">Gymshark</th>
              </tr>
            </thead>
            <tbody className="num font-mono">
              {[
                { m: 'Engagement Rate',   k: 'engagementRate' as const, fmt: (v: number) => percent(v) },
                { m: 'Avg Session (sec)', k: 'avgSessionDurationSec' as const, fmt: (v: number) => `${v}s` },
                { m: 'Pages / Session',   k: 'pagesPerSession' as const, fmt: (v: number) => v.toFixed(1) },
                { m: 'Bounce Rate',       k: 'bounceRate' as const, fmt: (v: number) => percent(v) },
              ].map(row => (
                <tr key={row.m} className="border-t border-line">
                  <td className="py-2.5 font-sans text-charcoal">{row.m}</td>
                  <td className="py-2.5 text-right text-charcoal">{row.fmt(eng[0][row.k])}</td>
                  <td className="py-2.5 text-right text-charcoal">{row.fmt(eng[1][row.k])}</td>
                  <td className="py-2.5 text-right text-charcoal">{row.fmt(eng[2][row.k])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 pb-10">
        <ChartCard title="Social Reach" eyebrow="Followers per platform" className="col-span-8">
          <div className="space-y-6">
            {social.map(group => (
              <div key={group.platform}>
                <div className="pb-2 text-2xs uppercase tracking-tracked text-stone">
                  {PLATFORM_LABEL[group.platform]}
                </div>
                <HorizontalBarBlock
                  rows={group.rows.map(r => ({ label: r.name, value: r.followers, color: r.color }))}
                />
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="SEO" eyebrow="Authority / Backlinks / Domains" className="col-span-4">
          <div className="space-y-4">
            {seo.map(b => (
              <div key={b.brand} className="border-t border-line pt-3 first:border-t-0 first:pt-0">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-2 text-sm text-charcoal">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: b.color }} />
                    {b.name}
                  </div>
                  <div className="num font-mono text-xs text-graphite">AS {b.authorityScore}</div>
                </div>
                <div className="num pt-1 font-mono text-xs text-graphite">
                  {compact(b.backlinks)} backlinks. {compact(b.referringDomains)} domains.
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="grid grid-cols-12 gap-6 px-10 pb-16">
        <ChartCard title="Share of Voice" eyebrow="Organic traffic share" className="col-span-4">
          <StackedBarBlock
            stacks={sov.map(s => ({
              label: BRANDS[s.brand].name,
              pct: s.pct,
              color: BRANDS[s.brand].color,
            }))}
          />
        </ChartCard>

        <ChartCard title="Benchmark" eyebrow="vs industry average" className="col-span-8">
          <table className="w-full text-sm">
            <thead className="text-2xs uppercase tracking-tracked text-stone">
              <tr>
                <th className="pb-3 text-left">Metric</th>
                <th className="pb-3 text-right">Alo</th>
                <th className="pb-3 text-right">Lulu</th>
                <th className="pb-3 text-right">Gym</th>
                <th className="pb-3 text-right">Industry Avg</th>
              </tr>
            </thead>
            <tbody className="num font-mono">
              {bench.map(row => {
                const fmt = (v: number) =>
                  row.format === 'percent' ? percent(v, 2)
                  : row.format === 'compact' ? compact(v)
                  : integer(v);
                const winnerVal = Math.max(row.alo, row.lulu, row.gym);
                const cellTone = (v: number) => v === winnerVal ? 'text-sage-deep' : 'text-charcoal';
                return (
                  <tr key={row.metric} className="border-t border-line">
                    <td className="py-2.5 font-sans text-charcoal">{row.metric}</td>
                    <td className={`py-2.5 text-right ${cellTone(row.alo)}`}>{fmt(row.alo)}</td>
                    <td className={`py-2.5 text-right ${cellTone(row.lulu)}`}>{fmt(row.lulu)}</td>
                    <td className={`py-2.5 text-right ${cellTone(row.gym)}`}>{fmt(row.gym)}</td>
                    <td className="py-2.5 text-right text-stone">{fmt(row.industry)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ChartCard>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Run dev server, verify Competitors page**

Run: `npm run dev`. Navigate to `/competitors`.

Verify: asymmetric brand strip (Alo lead, Lulu / Gym secondary) with hairline verticals, traffic line chart with all 3 brands, engagement comparison table, social reach bars per platform, SEO summary stack, share of voice horizontal stacked bar, benchmark table with sage on winners.

Kill the server.

- [ ] **Step 3: Commit**

```bash
git add app/competitors
git commit -m "feat(competitors): build Competitors page with brand strip and benchmark"
```

---

## Task 27: Component snapshot tests

**Files:**
- Create: `components/cards/__tests__/EditorialLede.test.tsx`
- Create: `components/cards/__tests__/MetricLedger.test.tsx`
- Create: `components/charts/__tests__/FunnelStepDown.test.tsx`

- [ ] **Step 1: Write `EditorialLede` snapshot test**

Create `components/cards/__tests__/EditorialLede.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EditorialLede } from '../EditorialLede';

describe('EditorialLede', () => {
  it('renders eyebrow, number, and narrative', () => {
    const { container, getByText } = render(
      <EditorialLede
        eyebrow="Organic sessions"
        number="4.2M"
        narrative="up 18.4% from prior 30 days, led by men's vertical search."
      />
    );
    expect(getByText('Organic sessions')).toBeInTheDocument();
    expect(getByText('4.2M')).toBeInTheDocument();
    expect(getByText(/up 18.4%/)).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

- [ ] **Step 2: Write `MetricLedger` snapshot test**

Create `components/cards/__tests__/MetricLedger.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MetricLedger } from '../MetricLedger';

describe('MetricLedger', () => {
  it('renders rows with values and deltas', () => {
    const { getByText, container } = render(
      <MetricLedger
        rows={[
          { label: 'Engaged Sessions', value: '2.7M', delta: { sign: 'up', text: '+22.1% vs prior' } },
          { label: 'Conversion Rate', value: '3.84%', delta: { sign: 'up', text: '+0.6pp' } },
        ]}
      />
    );
    expect(getByText('2.7M')).toBeInTheDocument();
    expect(getByText('Conversion Rate')).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

- [ ] **Step 3: Write `FunnelStepDown` snapshot test**

Create `components/charts/__tests__/FunnelStepDown.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { FunnelStepDown } from '../FunnelStepDown';

describe('FunnelStepDown', () => {
  it('renders steps with values and continue rates', () => {
    const { getByText, container } = render(
      <FunnelStepDown
        steps={[
          { label: 'Sessions',    value: 4_200_000, rateToNext: 0.58 },
          { label: 'Product View', value: 2_436_000, rateToNext: 0.22 },
          { label: 'Add to Cart',  value: 535_920,   rateToNext: 0 },
        ]}
      />
    );
    expect(getByText('Sessions')).toBeInTheDocument();
    expect(getByText('4.2M')).toBeInTheDocument();
    expect(getByText(/58.0% continue/)).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
```

- [ ] **Step 4: Run all tests**

Run: `npm test`
Expected: PASS, all tests green (snapshots auto-generated on first run).

- [ ] **Step 5: Commit**

```bash
git add components/cards/__tests__ components/charts/__tests__
git commit -m "test(components): add snapshot tests for editorial primitives"
```

---

## Task 28: Polish pass and final verification

**Files:**
- (Verification only; fixes inline as needed)

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: build succeeds with no errors. Note any warnings about missing alt text or unused imports and fix.

- [ ] **Step 4: Manual click-through every page**

Run: `npm run dev`. For each route (`/`, `/traffic`, `/engagement`, `/audience`, `/social`, `/seo`, `/competitors`):

  1. Confirm page renders without console errors.
  2. Change date range pill (7D / 30D / 90D / 12M / YTD). Confirm charts re-derive.
  3. Toggle "Compare to prev period" pill (visual only; charts unchanged in this version, acceptable).
  4. Where present, toggle "vs Lulu / Gym" competitor switch. Confirm Lulu / Gym lines fade in.
  5. Hover chart data points. Confirm tooltip styling (cream bg, hairline border, serif numbers).
  6. Hover cards. Confirm border darkens to stone and a hairline shadow appears.
  7. On Audience, click each filter chip (`Men's`, `Women's`, etc). Confirm table filters and chip activates.
  8. On Social, switch platform tabs. Confirm chart re-keys.
  9. On Engagement, confirm typographic step-down funnel ratios make visual sense.
  10. On Competitors, confirm brand strip is asymmetric and benchmark table tints the winner cell sage.

- [ ] **Step 5: Verify Impeccable compliance with a spot check**

Manually scan the rendered UI for:
- No row of 4 identical cards anywhere.
- No left-border colored accents.
- No gradient text, no glassmorphism panels.
- All neutrals visibly warm (not stark grey or stark white).
- Charts use thin (1.5px) lines and tinted area fills only.
- Sidebar active state is cream fill + sage glyph (no left bar).

If any violation appears, fix before proceeding.

- [ ] **Step 6: Final commit**

```bash
git add -u
git commit -m "chore: polish pass and verification"
```

---

## Spec coverage check

Mapping the original 9 spec requirements to tasks:

1. Daily / monthly / yearly organic traffic. **Task 21** (aggregation pill).
2. Website engagement (engaged sessions). **Task 22**.
3. Website conversions. **Task 22** (funnel).
4. Targeted keywords with intent. **Task 23** (filter chips).
5. User demographics. **Task 23** (age x gender, geo).
6. Competitor overview. **Task 26**, plus per-card toggles in Tasks 20-22, 24.
7. Social media growth. **Task 24**.
8. Social media engagement. **Task 24** (KPI ledger, top posts).
9. Backlink analytics. **Task 25** (Authority Score, Total Backlinks, Referring Domains).

All 9 covered. Brand system (Task 2), mock data layer (Tasks 3-12), shell (Tasks 14-15), shared components (Tasks 16-18), data hooks (Task 19), and tests (Tasks 3-6, 13, 27) round out the build.

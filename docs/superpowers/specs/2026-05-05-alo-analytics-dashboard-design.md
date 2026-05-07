# ALO Yoga Digital Analytics Dashboard. Design Spec.

**Date:** 2026-05-05
**Status:** Approved (pending user review of this written spec)
**Author:** Brainstorm session, applied with `pbakaus/impeccable` design rigor

## 1. Goal

Build a mock GA4-style digital analytics dashboard for Alo Yoga, with optional per-card competitive comparison against Lululemon and Gymshark. Primary audience for the dashboard (in the fiction): Alo's organic-growth lead, reviewing performance on a 27-inch display in a soft-lit Beverly Hills HQ during morning daylight. The dashboard should read like the brand's print campaigns, not a SaaS tool. Real-feeling interactions, mock data only.

## 2. Scope

### In scope
1. Daily, monthly, yearly organic traffic.
2. Website engagement (engaged sessions, engagement rate, time, bounce).
3. Website conversions (e-commerce funnel, conversion rate).
4. Targeted keywords with intent tags (men's, women's, workout, lifestyle, yoga).
5. User demographics (age, gender, geo, interests).
6. Competitor overview (traffic, social, SEO benchmark vs Lululemon, Gymshark).
7. Social media growth (Instagram, TikTok, YouTube follower trajectories).
8. Social media engagement (avg likes, comments, shares, top posts).
9. Backlink analytics (Authority Score, Total Backlinks, Referring Domains, anchor text, top referring domains).

### Out of scope
- Authentication, user management, settings.
- CSV / PDF export.
- Real-time updates, websockets.
- Mobile-first layouts (desktop-first, 1280px+ target; layouts gracefully degrade but are not optimized for phones).
- Real backend, real API integration, real analytics SDK.

## 3. Stack

- Next.js 15 (App Router) + TypeScript.
- Tailwind CSS with custom Alo design tokens wired into `tailwind.config.ts`.
- Recharts for all charts.
- `lucide-react` for icons.
- `clsx` + `tailwind-merge` for class composition.
- `next/font/google` for Fraunces, Schibsted Grotesk, Geist Mono.
- No backend. All data lives in `/lib/mock-data/` as TypeScript modules with a seeded generator.

## 4. Folder Layout

```
app/
  layout.tsx              // global shell (sidebar + topbar + DateRangeProvider)
  page.tsx                // Overview
  traffic/page.tsx        // Organic Traffic deep-dive
  engagement/page.tsx     // Engagement + Conversions
  audience/page.tsx       // Demographics + Targeted keywords
  social/page.tsx         // Social growth + engagement
  seo/page.tsx            // Backlinks + Authority
  competitors/page.tsx    // Cross-brand benchmark
components/
  layout/    (Sidebar, Topbar, PageHeader, DateRangeContext)
  cards/     (ChartCard, CompetitorToggle, MetricLedger, EditorialLede)
  charts/    (LineChartBlock, AreaChartBlock, StackedBarBlock, HorizontalBarBlock,
              FunnelStepDown, AuthorityScale)
  ui/        (Button, Tabs, Select, Pill, Badge, Skeleton, EmptyState)
lib/
  mock-data/ (story.ts, traffic.ts, engagement.ts, social.ts, seo.ts,
              audience.ts, competitors.ts)
  generators.ts           // mulberry32 seeded PRNG, time-series generator
  brand.ts                // OKLCH tokens, font refs, scale constants
  date-range.ts           // hooks + helpers for active range
docs/
  superpowers/specs/      // this file lives here
```

## 5. Brand System

### 5.1 Color (OKLCH only)

All neutrals tinted warm (chroma ~0.008-0.018) toward the brand hue. No `#000`, no `#fff` anywhere. Strategy: **Restrained**. Sage carries 10% of the surface; everything else is tinted neutrals.

```
--bone        oklch(0.96 0.012 75)     // page background
--cream       oklch(0.93 0.018 70)     // active nav fill, card hover surface
--charcoal    oklch(0.22 0.008 75)     // primary text, strong UI
--graphite    oklch(0.38 0.008 75)     // secondary text
--stone       oklch(0.62 0.012 70)     // labels, muted
--sage        oklch(0.58 0.038 130)    // primary accent (chart line, KPI deltas up)
--sage-deep   oklch(0.42 0.045 132)    // hover/active sage
--clay        oklch(0.55 0.085 50)     // negative deltas, alerts (rare)
--line        oklch(0.88 0.012 75)     // hairline rules
// competitors
--lulu        oklch(0.72 0.025 240)
--gym         oklch(0.25 0.005 75)
```

### 5.2 Typography

- Display / serif: **Fraunces** (variable axes for weight, optical size, softness).
- Body / UI sans: **Schibsted Grotesk**.
- Tabular numerics in tables and ledgers: **Geist Mono**.
- Type scale ratio: 1.333 (perfect fourth). Steps: 12 / 14 / 16 / 21 / 28 / 37 / 50 / 67 / 89 / 119 px.
- Body line length capped at 70ch.
- Headline weight contrast: display weights 200 (numbers) and 400 (titles) only; body weights 400 / 500. No bold body.

### 5.3 Spacing & rhythm

- Base unit 4px. Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- Vary spacing intentionally per section (rhythm, not monotone padding).
- Cards: `p-8` minimum; full-bleed sections sit flush against the page gutter.
- Hairline rules at 1px in `--line`. No heavier dividers.

### 5.4 Visual signatures

- 1px hairline borders only. No drop shadows by default; a barely-visible 1px shadow appears on card hover.
- Border radii: `rounded-none` for editorial blocks, `rounded-md` (6px) cap for chart cards. Never larger.
- No gradients. No glassmorphism. No gradient text. No side-stripe accents.

## 6. Layout Shell

### 6.1 Sidebar (left, 240px, fixed)

- ALO wordmark at top in Fraunces 200, all caps, tracked +0.12em.
- Nav items in Schibsted Grotesk 14px:
  - Overview, Traffic, Engagement, Audience, Social, SEO, Competitors.
- Active state: `--cream` background fill across the row, charcoal text, a small sage glyph (a 6px filled circle) preceding the label. **No left-border accent.**
- Footer: small "Mock data. Refreshed 5 May 2026." in `--stone`, 11px.

### 6.2 Topbar (sticky, full width minus sidebar)

- Page title in Fraunces, 37px display.
- Right cluster: global date-range pill segmented control (`7D / 30D / 90D / 12M / YTD`), a "Compare to previous period" toggle, an avatar circle with initials.
- Date range is global. Changes propagate via `DateRangeContext` to every page's data hook (`useTrafficData`, etc.), which re-derives totals, deltas, and slices from the seeded generator.

### 6.3 Grid

- 12-column grid, 24px gutter.
- Spans intentionally asymmetric per row. **Never a row of equal-sized cards.** Patterns used: 7+5, 8+4, 9+3, 6+3+3, full-bleed.

## 7. Page Specs

### 7.1 Overview

**Row 1. Editorial ledger lede.** No cards.

- Left, span 7. Magazine-style headline composition:
  - Label "Organic sessions" in small caps, 12px, stone.
  - Number `4.2M` in Fraunces display, 96px, weight 200, charcoal.
  - Inline narrative below the number in graphite, 16px body: "up 18.4% from prior 30 days, led by men's-vertical search."
- Right, span 5. Typographic ledger:
  - Three rows (Engaged Sessions, Conversion Rate, Total Backlinks).
  - Label left in stone, number right in Geist Mono 28px charcoal, delta beneath in 12px (sage if up, clay if down).
  - 1px hairline rule between rows.

**Row 2. Hero traffic + channel split.**

- Span 8. ChartCard with area chart of organic traffic over the active range. Per-card competitor toggle in the card header (pill switch). On toggle, Lululemon and Gymshark lines fade in.
- Span 4. ChartCard with horizontal stacked bar (replaces a donut) showing sessions by source: Organic, Direct, Social, Referral, Email, Paid. Each band labeled with percentage inline.

**Row 3. Engagement + Social growth.**

- Span 6. ChartCard, multi-tab: pages/session, avg engagement time, engagement rate. Default tab: engagement rate. Line chart.
- Span 6. ChartCard, line chart of follower growth across IG, TikTok, YT with platform legend toggles. Per-card competitor toggle available.

**Row 4. Top keywords + SEO summary.**

- Span 8. ChartCard wrapping a sortable table: keyword, intent tag (chip), volume, position, change (sage / clay).
- Span 4. **No card frame** (typographic block sits directly on the page background within its 4-column span):
  - "Authority Score" label / `68 / 100` in Fraunces display 67px / hairline horizontal scale showing position.
  - 1px hairline rule.
  - "Total Backlinks" label / `412K` display number.
  - 1px hairline rule.
  - "Referring Domains" label / `8.4K` display number.

**Row 5. Geo + Demographics.**

- Span 6. ChartCard, horizontal bar chart of top 10 countries by sessions.
- Span 6. ChartCard, stacked bar chart by age x gender, with a small inline ledger to the right of the chart listing top three age brackets and percentage split (no separate card).

### 7.2 Traffic

- Page header: title + 1-line description.
- Hero ChartCard, span 12: daily organic sessions area chart over the active range. Aggregation tabs above the chart (Daily / Weekly / Monthly / Yearly) re-aggregate the time series. Per-card competitor toggle.
- Row, span 6 + 3 + 3: three ChartCards (Sessions left as the primary, Users and Pages per Session stacked on the right). Each has the headline number above the chart in Fraunces display 50px. Asymmetric spans (rather than equal-thirds) avoid the identical-card grid trap; the right column's two cards stack vertically so visual weight stays balanced.
- Span 8 + 4: source breakdown horizontal stacked bar; device split as a small inline horizontal stacked bar beside the total sessions number (no donut, no separate card).

### 7.3 Engagement

- Hero ChartCard, span 12: Engaged Sessions line over time. Competitor toggle.
- Editorial ledger row, no cards, span 12 split into 4: Engagement Rate, Avg Engagement Time, Bounce Rate, Events / Session. Each is label + Fraunces display number + delta. Hairline rules between cells.
- Span 7. ChartCard wrapping the Top Engaged Pages table: URL, sessions, avg time, engagement rate, sortable.
- Span 5. **Conversions block.** ChartCard containing the typographic step-down funnel: each step (Sessions, Product View, Add to Cart, Checkout, Purchase) on its own row with the number in Fraunces display, a hairline progress mark showing the conversion ratio to the next step, and a final overall e-commerce conversion rate at the bottom.

### 7.4 Audience

(No competitor toggle anywhere on this page.)

- Span 7. ChartCard, age x gender stacked bar.
- Span 5. ChartCard, interests as a horizontal bar list (replaces interests donut).
- Span 5. ChartCard, geo horizontal bar (top 10 countries).
- Span 7. ChartCard wrapping the Targeted Keywords table. Above the table: filter chips (`All / Men's / Women's / Workout / Lifestyle / Yoga`). Selecting a chip filters the table client-side. Empty state shown if a filter produces no rows.

### 7.5 Social

- Tabs at the top: Instagram / TikTok / YouTube / All. Switching tabs re-keys the chart data.
- Hero ChartCard, span 12: follower growth line chart across the selected platform(s). Competitor toggle.
- Editorial ledger row, no cards, span 12 split into 4: Avg Likes, Avg Comments, Avg Shares, Engagement Rate.
- Span 12. ChartCard wrapping a top-posts grid (mock thumbnails as hairline boxes with caption + engagement counts). 6 posts in a 3x2 grid, intentionally varied tile sizes (one larger feature post on the left, five smaller on the right).

### 7.6 SEO

- Editorial three-stack at the top, no card frame, edge-to-edge across the page width (4 + 4 + 4 typographic columns separated by 1px hairline verticals): Authority Score (with the hairline horizontal scale), Total Backlinks, Referring Domains. Each headline number in Fraunces 89px.
- Span 8. ChartCard, area chart of total backlinks over time.
- Span 4. ChartCard, anchor text horizontal bar list (replaces donut).
- Span 12. ChartCard wrapping the Top Referring Domains table: domain, authority, backlinks, first seen.

### 7.7 Competitors

The one place where ALO vs Lululemon vs Gymshark is the headline.

- Page header: title + 1-line description.
- Brand strip, no card frames, span 12 split asymmetric (6 + 3 + 3) with 1px hairline verticals between blocks: ALO is the lead block (largest type, primary position, headline metric in Fraunces 89px with a sage delta), Lululemon and Gymshark are smaller secondary blocks with comparison context inline (e.g., "3.9x ALO traffic, 4.1% YoY").
- Span 12. Traffic comparison ChartCard, multi-line chart, all 3 brands, full date range. Legend toggles per brand.
- Span 12. Engagement comparison ChartCard, grouped bar: Engagement Rate, Avg Session Duration, Pages / Session, Bounce Rate. One group per metric, three bars per group.
- Span 8 + 4. Social reach comparison (horizontal grouped bar of followers per platform per brand) and SEO comparison (a tight ledger of Authority Score / Backlinks / Referring Domains for each brand, no nested cards).
- Span 4 + 8. Share-of-voice horizontal stacked bar (replaces donut) and benchmark table (rows = metrics, cols = ALO, LULU, GYM, Industry Avg, with sage / clay deltas).

## 8. Mock Data Model

### 8.1 Story file

Hand-tuned headline numbers per brand. Lives in `lib/mock-data/story.ts`. The narrative the dashboard tells: ALO is the smaller premium-challenger brand winning on engagement and growth; Lululemon is the incumbent giant; Gymshark is similar-scale to ALO socially but smaller on web.

```ts
export const BRANDS = {
  alo: {
    name: 'Alo Yoga',
    color: 'oklch(0.58 0.038 130)',
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
    color: 'oklch(0.72 0.025 240)',
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
    color: 'oklch(0.25 0.005 75)',
    sessions: 3_700_000,
    followers: { ig: 7_200_000, tiktok: 4_500_000, yt: 970_000 },
    authorityScore: 71,
    backlinks: 510_000,
    referringDomains: 11_300,
    engagementRate: 0.598,
    conversionRate: 0.0312,
    yoyGrowth: 0.092,
  },
}
```

### 8.2 Generator

`lib/generators.ts`:

- `seededRandom(seed: number)`: mulberry32 PRNG. Deterministic.
- `hashSeed(key: string)`: cheap string hash to a 32-bit int seed.
- `generateTimeSeries({ days, baseValue, trend, seasonality, noise, seed })`: returns `{ date: string; value: number }[]`. Trend pulled from the brand's `yoyGrowth`. Weekly seasonality (B2C apparel weekend dip). Noise as percentage of baseValue.
- Each metric per brand uses a stable seed (e.g., `hashSeed('alo-sessions')`) so reloads are byte-identical.
- Final-day value of each generated series is anchored to match the headline number in `story.ts` (the generator scales the series so its terminal value equals the story number, ensuring chart and headline never disagree).

### 8.3 Per-domain modules

- `traffic.ts`: sessions, users, pages-per-session, source breakdown (Organic / Direct / Social / Referral / Paid / Email), device split (Mobile / Desktop / Tablet).
- `engagement.ts`: engaged sessions, engagement rate, avg time, bounce, events per session, top engaged pages, funnel steps.
- `audience.ts`: age x gender matrix, geo (top 25 countries), interests, keywords table with `intent` tag (`men's | women's | workout | lifestyle | yoga`).
- `social.ts`: daily follower counts per platform per brand, post-level engagement (top 6 posts mock).
- `seo.ts`: authority score history, backlinks over time, top referring domains, anchor text distribution.
- `competitors.ts`: cross-brand comparison helpers that pull from the above per brand.

### 8.4 Date range integration

`useDateRange()` returns `{ start: Date, end: Date, label: string, previous: { start, end } }`. Each page's data hook slices generated series to the active range, computes totals, and derives delta vs the equal-length previous period.

## 9. Interactivity

- Card hover: hairline border darkens from `--line` to `--stone`, a 1px-blur shadow appears at 6% opacity, transition 200ms ease-out-quart. No translate, no scale.
- Recharts tooltips: custom-styled. Cream background, charcoal text, hairline border, Fraunces for the numeric value, Schibsted for labels, no drop shadow.
- Chart legend: clicking a series toggles its visibility (Recharts native).
- Date-range pill: instant chart updates via context. No spinners (data is local).
- Per-card competitor toggle (where applicable): pill switch in card header. Toggling animates competitor lines in / out via path-length opacity, 400ms ease-out-quart.
- Tabs (Daily / Weekly / Monthly, platform tabs on Social): segmented control, instant re-aggregation.
- Card click region: clicking the title or "View details" link in the corner routes to the matching deep-dive page. The whole card is not clickable (preserves chart interaction).
- Filter chips on Audience: client-side filter with empty-state fallback.

## 10. Motion

- Single easing: `cubic-bezier(0.165, 0.84, 0.44, 1)` (ease-out-quart). No bounce, no elastic, no spring.
- Standard durations: 200ms (UI state), 400ms (chart series enter), 600ms (route transitions).
- Chart line draw-in on mount: stroke-dashoffset / opacity, 400ms.
- Never animate layout properties (width, height, margin, padding, top, left). Transforms and opacity only.

## 11. Error Handling

- All data is local and deterministic. No network errors possible.
- Empty state component for the keyword filter when no rows match a chip.
- Chart components accept a typed `data` prop. If empty, render an axis with a centered "No data for this range" in stone.
- Skeleton components defined for cards (used briefly during route transitions for polish).

## 12. Testing

- Unit (Vitest): generator determinism (same seed produces identical series), brand totals match the story file, date-range slicing math, delta calculation.
- Component (React Testing Library): snapshot tests for `EditorialLede`, `MetricLedger`, `ChartCard`, `FunnelStepDown` with sample props.
- Visual: manual click-through every page in the browser before declaring done.
- No e2e (overkill for a mock).

## 13. Impeccable Compliance Checklist

This design was audited against `pbakaus/impeccable` design laws. Compliance summary:

- Color in OKLCH, no `#000` / `#fff`, neutrals tinted warm. Pass.
- Color strategy declared: Restrained. Pass.
- Theme justified by a physical scene sentence. Pass.
- Typography: scale ratio 1.333 (>=1.25), body capped at 70ch, weight contrast on. Pass.
- Spacing varied per section. Pass.
- Cards used only where they are the best affordance; KPI numbers and editorial blocks are typographic, not card-wrapped. Pass.
- No side-stripe borders (sidebar active state uses fill + glyph). Pass.
- No gradient text, no glassmorphism, no hero-metric SaaS template, no identical card grids. Pass.
- No modals (drill-down via routes, not modal overlays). Pass.
- Motion: ease-out-quart only, no layout animations. Pass.
- Copy: no em dashes anywhere (this spec uses periods, colons, parens). Pass.
- AI slop test: cream + sage + serif is the first-order wellness-brand reflex. Mitigated by editorial execution (asymmetric grids, oversized serif numbers as typographic hero, cards minimized, restrained 10% accent), not palette swap. Honors user's "follow Alo brand guidelines" directive. Acknowledged.

## 14. Open Questions

None at spec time. Implementation may surface trade-offs (e.g., specific Fraunces variable axis values, exact chart heights for visual rhythm) that get resolved during build with reference back to this spec's principles.

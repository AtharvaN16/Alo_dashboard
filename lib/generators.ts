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

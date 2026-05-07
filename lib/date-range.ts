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

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

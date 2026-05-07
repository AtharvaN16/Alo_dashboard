import { describe, it, expect } from 'vitest';
import { seededRandom, hashSeed } from '../generators';
import { generateTimeSeries } from '../generators';

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

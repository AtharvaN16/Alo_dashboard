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

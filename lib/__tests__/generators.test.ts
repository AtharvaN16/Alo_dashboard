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

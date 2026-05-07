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

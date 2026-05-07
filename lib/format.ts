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

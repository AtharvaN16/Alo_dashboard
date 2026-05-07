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

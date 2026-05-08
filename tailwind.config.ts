import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: 'oklch(0.93 0.020 75)',
        surface: 'oklch(0.995 0.003 75)',
        cream: 'oklch(0.90 0.022 70)',
        charcoal: 'oklch(0.22 0.008 75)',
        graphite: 'oklch(0.38 0.008 75)',
        stone: 'oklch(0.62 0.012 70)',
        sage: 'oklch(0.66 0.18 145)',
        'sage-deep': 'oklch(0.50 0.18 145)',
        clay: 'oklch(0.62 0.18 35)',
        line: 'oklch(0.88 0.012 75)',
        lulu: 'oklch(0.60 0.22 27)',
        gym: 'oklch(0.85 0.20 110)',
      },
      fontFamily: {
        serif: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1.4' }],
        'display-sm': ['3.125rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-md': ['4.1875rem', { lineHeight: '0.95', letterSpacing: '-0.025em' }],
        'display-lg': ['5.5625rem', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-xl': ['7.4375rem', { lineHeight: '0.9', letterSpacing: '-0.035em' }],
      },
      letterSpacing: { tracked: '0.12em' },
      transitionTimingFunction: { 'out-quart': 'cubic-bezier(0.165, 0.84, 0.44, 1)' },
      boxShadow: {
        hairline: '0 1px 2px oklch(0.22 0.008 75 / 0.06)',
        card: '0 1px 3px oklch(0.22 0.008 75 / 0.06), 0 4px 16px oklch(0.22 0.008 75 / 0.05)',
        'card-hover': '0 2px 6px oklch(0.22 0.008 75 / 0.08), 0 12px 32px oklch(0.22 0.008 75 / 0.10)',
      },
    },
  },
  plugins: [],
};

export default config;

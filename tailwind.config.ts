import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: 'oklch(0.96 0.012 75)',
        cream: 'oklch(0.93 0.018 70)',
        charcoal: 'oklch(0.22 0.008 75)',
        graphite: 'oklch(0.38 0.008 75)',
        stone: 'oklch(0.62 0.012 70)',
        sage: 'oklch(0.58 0.038 130)',
        'sage-deep': 'oklch(0.42 0.045 132)',
        clay: 'oklch(0.55 0.085 50)',
        line: 'oklch(0.88 0.012 75)',
        lulu: 'oklch(0.72 0.025 240)',
        gym: 'oklch(0.25 0.005 75)',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-schibsted)', 'system-ui', 'sans-serif'],
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
      boxShadow: { hairline: '0 1px 2px oklch(0.22 0.008 75 / 0.06)' },
    },
  },
  plugins: [],
};

export default config;

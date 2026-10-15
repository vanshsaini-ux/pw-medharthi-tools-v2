import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A0F1E',
          900: '#0F1830',
          800: '#152040',
          700: '#1D2C55',
          600: '#293C70'
        },
        paper: '#F4F6F9',
        amber: {
          500: '#E8A33D',
          600: '#D6892A',
          100: '#FBEBD3'
        },
        teal: {
          500: '#1E8C7A',
          100: '#D9F0EA'
        },
        coral: {
          500: '#D8564A',
          100: '#FBE2DF'
        }
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace']
      },
      fontSize: {
        sm: ['0.875rem', { lineHeight: '1.6' }],
        base: ['1rem', { lineHeight: '1.7' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.015em' }],
        '3xl': ['1.875rem', { lineHeight: '1.28', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.16', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1.08', letterSpacing: '-0.025em' }]
      },
      borderRadius: {
        xl2: '1.25rem'
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,24,48,0.04), 0 10px 26px -12px rgba(15,24,48,0.14)',
        'card-hover': '0 4px 10px rgba(15,24,48,0.06), 0 20px 36px -14px rgba(15,24,48,0.20)',
        header: '0 1px 0 rgba(255,255,255,0.06), 0 8px 24px -12px rgba(10,15,30,0.45)'
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle at 1px 1px, rgba(15,24,48,0.10) 1px, transparent 0)'
      }
    }
  },
  plugins: []
};

export default config;

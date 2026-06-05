import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        // Stadium dark palette — used across fan/game screens
        pitch: {
          950: '#0d0f14',
          900: '#141720',
          800: '#1c2030',
          700: '#252a3a',
          600: '#2f3547',
        },
        // Electric amber — live state + primary accents on dark screens
        live: {
          400: '#fbbf24',
          500: '#f5a623',
          600: '#d97706',
        },
        // Admin warm off-white
        admin: {
          bg:      '#faf9f6',
          sidebar: '#1e2433',
          border:  '#e8e5df',
        },
        // Per-emotion tints (background fills, 10% opacity equivalent)
        emotion: {
          excited:      '#fef3c7', // amber-100
          hopeful:      '#e0f2fe', // sky-100
          calm:         '#ccfbf1', // teal-100
          happy:        '#dcfce7', // green-100
          proud:        '#ede9fe', // violet-100
          relieved:     '#d1fae5', // emerald-100
          nervous:      '#fef9c3', // yellow-100
          anxious:      '#ffedd5', // orange-100
          stressed:     '#fee2e2', // red-100
          frustrated:   '#fee2e2', // red-100
          disappointed: '#f1f5f9', // slate-100
          devastated:   '#ffe4e6', // rose-100
        },
      },
      keyframes: {
        'pulse-ring': {
          '0%':   { boxShadow: '0 0 0 0 rgba(245,166,35,0.7)' },
          '70%':  { boxShadow: '0 0 0 8px rgba(245,166,35,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(245,166,35,0)' },
        },
        'card-reveal': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'emotion-pop': {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1.05)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-ring':   'pulse-ring 1.4s ease-out infinite',
        'card-reveal':  'card-reveal 0.35s ease-out forwards',
        'emotion-pop':  'emotion-pop 0.2s ease-out forwards',
        'fade-in':      'fade-in 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config

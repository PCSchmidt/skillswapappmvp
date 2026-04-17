/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    borderRadius: {
      none: '0',
      DEFAULT: '0',
      sm: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '9999px',
    },
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#06070b',
          50: '#f4f6f7',
          100: '#e2e5e8',
          200: '#c5cad1',
          300: '#a1a8b3',
          400: '#7b8494',
          500: '#5f6979',
          600: '#4b5363',
          700: '#3d4452',
          800: '#343a46',
          900: '#1a1d24',
          950: '#06070b',
        },
        emerald: {
          DEFAULT: '#047857',
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        surface: {
          DEFAULT: '#0d0f14',
          raised: '#12141a',
          overlay: '#181b22',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.04)',
          strong: 'rgba(255, 255, 255, 0.16)',
        },
        text: {
          primary: '#f4f6f7',
          secondary: '#a1a8b3',
          muted: '#5f6979',
        },
        error: {
          DEFAULT: '#ef4444',
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        },
        warning: {
          DEFAULT: '#eab308',
          50: '#fefce8',
          500: '#eab308',
        },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      letterSpacing: {
        eyebrow: '0.15em',
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.15em', fontWeight: '600' }],
      },
      boxShadow: {
        glow: '0 0 80px 20px rgba(4, 120, 87, 0.08)',
        'glow-sm': '0 0 40px 10px rgba(4, 120, 87, 0.06)',
        'glow-lg': '0 0 120px 40px rgba(4, 120, 87, 0.12)',
      },
    },
  },
  plugins: [],
}

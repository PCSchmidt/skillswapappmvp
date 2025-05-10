/** @type {import('tailwindcss').Config} */
const designTokens = require('./src/styles/design-tokens');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: designTokens.colors.primary,
        secondary: designTokens.colors.secondary,
        tertiary: designTokens.colors.tertiary,
        neutral: designTokens.colors.neutral,
        'accent-yellow': designTokens.colors.accentYellow,
        'accent-lavender': designTokens.colors.accentLavender,
        success: designTokens.colors.success,
        warning: designTokens.colors.warning,
        error: designTokens.colors.error,
        info: designTokens.colors.info,
        // Keep original gray for backward compatibility
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        sans: [
          '"Inter var"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        heading: designTokens.typography.fontFamily.heading,
        body: designTokens.typography.fontFamily.body,
        accent: designTokens.typography.fontFamily.accent,
      },
      spacing: {
        ...designTokens.spacing,
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        ...designTokens.borders.borderRadius,
        '4xl': '2rem',
      },
      boxShadow: designTokens.shadows,
      transitionDuration: designTokens.transitions.duration,
      transitionTimingFunction: designTokens.transitions.timingFunction,
      zIndex: designTokens.zIndex,
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.500'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.gray.900'),
              fontWeight: '600',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [],
  darkMode: 'class',
}

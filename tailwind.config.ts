import type { Config } from 'tailwindcss'

import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',

      // New orange-based color palette (matching variables.css)
      primary: {
        50: '#FFF5F0',
        100: '#FFE6D9',
        200: '#FFC4A6',
        300: '#FF9A66',
        400: '#FF7A3D',
        500: '#FF5A1F',
        600: '#E04E1B',
        700: '#C04115',
        800: '#A03510',
        900: '#802A0C',
      },
      secondary: {
        50: '#FFF5F0',
        100: '#FFE6D9',
        200: '#FFC4A6',
        300: '#FF9A66',
        400: '#FF7A3D',
        500: '#FF5A1F',
        600: '#E04E1B',
        700: '#C04115',
        800: '#A03510',
        900: '#802A0C',
      },
      success: {
        50: '#F0FDF4',
        100: '#DCFCE7',
        200: '#BBF7D0',
        300: '#86EFAC',
        400: '#4ADE80',
        500: '#22C55E',
        600: '#16A34A',
        700: '#15803D',
        800: '#166534',
        900: '#14532D',
      },
      warning: {
        50: '#FFF8E6',
        100: '#FFF0C2',
        200: '#FFE68A',
        300: '#FFD952',
        400: '#FACC15',
        500: '#E6B800',
        600: '#CCA300',
        700: '#B38F00',
        800: '#997A00',
        900: '#806600',
      },
      danger: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        300: '#FCA5A5',
        400: '#F87171',
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
        800: '#991B1B',
        900: '#7F1D1D',
      },
      light: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
      },

      // Ion specific color names for theming
      'ion-primary': '#FF5A1F',
      'ion-secondary': '#FF7A3D',
      'ion-success': '#22C55E',
      'ion-warning': '#FACC15',
      'ion-danger': '#EF4444',
      'ion-light': '#F1F5F9',
      'ion-medium': '#94A3B8',
      'ion-dark': '#0F172A',

      // Background colors
      'background': {
        color: '#F8FAFC',
        dark: '#0B0F19',
      },
      'card': {
        background: '#FFFFFF',
        dark: '#1E293B',
      },
      'item': {
        background: '#FFFFFF',
        dark: '#1E293B',
      },
      'text': {
        color: '#0F172A',
        dark: '#F1F5F9',
        secondary: '#64748B',
        secondaryDark: '#94A3B8',
      },
      'border': {
        color: '#E5E7EB',
        dark: '#334155',
      },
      'shadow': {
        default: '0 1px 3px rgba(0, 0, 0, 0.1)',
        dark: '0 1px 3px rgba(0, 0, 0, 0.3)',
      },
      'navbar': {
        background: '#FFFFFF',
        dark: '#1E293B',
      },
    },
    // Add font family support
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    },
    extend: {
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
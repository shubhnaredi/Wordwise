import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: {
          'glass-light': 'rgba(255,255,255,0.3)',
          'glass-dark': 'rgba(25,25,25,0.3)',
          'text-light': '#1a1a1a',
          'text-dark': '#f2f2f2',
          'background-light': '#fdfdfd',
          'background-dark': '#0d1326',
          'surface-light': 'rgba(255,255,255,0.5)',
          'surface-dark': 'rgba(0,0,0,0.5)',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.3)'
        },
        surface: {
          light: '#ffffff',
          dark: '#1e1e1e'
        },
        text: {
          light: '#111827',
          dark: '#f9fafb'
        }
      },
      boxShadow: {
        soft: '0 2px 15px rgba(0, 0, 0, 0.15)',
        inner: 'inset 0 1px 2px rgba(255, 255, 255, 0.05)'
      },
      backdropBlur: {
        md: '12px'
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      }
    }
  },
  plugins: [
    require('tailwindcss-animate') // 👈 Needed for shadcn transitions
  ],
};

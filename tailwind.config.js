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
          dark: 'rgba(0, 0, 0, 0.3)',
        },
        surface: {
          light: '#ffffff',
          dark: '#1e1e1e',
        },
        text: {
          light: '#111827',
          dark: '#f9fafb',
        },
        yellow: {
          300: '#fde68a',
          400: '#facc15',
        },
        accent: {
          green: '#4ade80',   // For save buttons
          red: '#f87171',     // For alerts or errors
          blue: '#3b82f6',    // If you want to re-theme that 'shitty blue' later
        },
      },
      boxShadow: {
        soft: '0 2px 15px rgba(0, 0, 0, 0.15)',
        inner: 'inset 0 1px 2px rgba(255, 255, 255, 0.05)',
        glass: '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      backdropBlur: {
        md: '12px',
        xl: '20px',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shake: 'shake 0.4s ease-in-out',
        fade: 'fade 0.3s ease-in-out',
        slidein: 'slidein 0.4s ease',
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
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        },
        fade: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slidein: {
          '0%': { transform: 'translateY(12px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), // Needed for shadcn transitions
  ],
};

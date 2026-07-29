import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Satoshi', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FBBF24',
          glow: 'rgba(245, 158, 11, 0.15)',
        },
        background: {
          dark: '#050505',
          light: '#FFFFFF',
        },
        surface: {
          dark: '#111111',
          light: '#F9FAFB',
        },
        card: {
          dark: '#1A1A1A',
          light: '#F3F4F6',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#D1D5DB',
          muted: '#9CA3AF',
        },
        border: {
          dark: '#374151',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        'dark-gradient': 'linear-gradient(180deg, #111111 0%, #050505 100%)',
        'hero-gradient': 'radial-gradient(circle at top, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
        'card-shine': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 30px rgba(245, 158, 11, 0.25)',
        'soft-dark': '0 10px 40px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1.0rem',
        'space-lg': '1.5rem',
        'space-xl': '2.0rem',
        'space-2xl': '3.0rem',
        'space-3xl': '4.0rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

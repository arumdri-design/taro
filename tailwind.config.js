/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#0a0618',
          900: '#120a2a',
          800: '#1c1240',
          700: '#2a1d5c',
        },
        mystic: {
          300: '#c4b0f0',
          400: '#9d7fe0',
          500: '#7c5cd6',
        },
        gold: {
          200: '#f5e6c4',
          300: '#ead196',
          400: '#d9b96a',
          500: '#c9a24f',
          600: '#a8833a',
        },
      },
      fontFamily: {
        serif: ['"Gowun Batang"', '"Nanum Myeongjo"', 'serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shuffle: {
          '0%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-10px) rotate(-3deg)' },
          '50%': { transform: 'translateX(8px) rotate(2deg)' },
          '75%': { transform: 'translateX(-6px) rotate(-1deg)' },
          '100%': { transform: 'translateX(0) rotate(0deg)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.8s ease-out both',
        twinkle: 'twinkle 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'spin-slow': 'spinSlow 8s linear infinite',
        shuffle: 'shuffle 0.9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', '"Times New Roman"', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#0F1419',
          mid: '#3D4852',
          light: '#7A8691',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EADF',
        },
        paper: '#FFFFFF',
        border: '#E8E1D4',
        navy: {
          DEFAULT: '#1E3A5F',
          light: '#2D5280',
        },
        sand: {
          DEFAULT: '#C9A961',
          light: '#E2C88A',
          dark: '#A6893C',
        },
        forest: '#3B6B4A',
        rust: '#B54B3C',
        plum: '#6B4267',
      },
    },
  },
  plugins: [],
};

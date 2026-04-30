/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: 'var(--color-ink)',
          mid: 'var(--color-ink-mid)',
          light: 'var(--color-ink-light)',
        },
        cream: {
          DEFAULT: 'var(--color-cream)',
          dark: 'var(--color-cream-dark)',
        },
        paper: 'var(--color-paper)',
        border: 'var(--color-border)',
        navy: {
          DEFAULT: 'var(--color-navy)',
          light: 'var(--color-navy-light)',
        },
        sand: {
          DEFAULT: 'var(--color-sand)',
          light: 'var(--color-sand-light)',
          dark: 'var(--color-sand-dark)',
        },
        forest: 'var(--color-forest)',
        rust: 'var(--color-rust)',
        plum: 'var(--color-plum)',
      },
    },
  },
  plugins: [],
};

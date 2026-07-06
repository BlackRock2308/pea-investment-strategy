/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // "serif" is retained as the display key so existing font-serif usages
        // pick up the brand's Inter display treatment without touching every view.
        serif: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
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
        warning: 'var(--color-warning)',
        rust: 'var(--color-rust)',
        plum: 'var(--color-plum)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        inner: 'var(--radius-inner)',
        pill: '999px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
        hero: 'var(--shadow-hero)',
        tooltip: 'var(--shadow-tooltip)',
      },
    },
  },
  plugins: [],
};

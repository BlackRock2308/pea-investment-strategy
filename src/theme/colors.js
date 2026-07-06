export const COLORS = {
  ink: 'var(--color-ink)',
  inkMid: 'var(--color-ink-mid)',
  inkLight: 'var(--color-ink-light)',
  cream: 'var(--color-cream)',
  creamDark: 'var(--color-cream-dark)',
  paper: 'var(--color-paper)',
  border: 'var(--color-border)',
  navy: 'var(--color-navy)',
  navyLight: 'var(--color-navy-light)',
  sand: 'var(--color-sand)',
  sandLight: 'var(--color-sand-light)',
  sandDark: 'var(--color-sand-dark)',
  forest: 'var(--color-forest)',
  warning: 'var(--color-warning)',
  rust: 'var(--color-rust)',
  plum: 'var(--color-plum)',
  rowAlt: 'var(--color-row-alt)',
  // Tinted pill backgrounds
  posBg: 'var(--pos-bg)',
  negBg: 'var(--neg-bg)',
  ochreBg: 'var(--ochre-bg)',
  navyBg: 'var(--navy-bg)',
  // Midnight hero surface
  heroInk: 'var(--hero-ink)',
  heroInkDim: 'var(--hero-ink-dim)',
  // Chart categorical hues — lifted, validated versions of the brand palette.
  chart1: 'var(--chart-1)',
  chart2: 'var(--chart-2)',
  chart3: 'var(--chart-3)',
  chart4: 'var(--chart-4)',
};

// Fixed categorical order — never cycled. Uses the validated chart hues so
// marks read as distinct rather than near-black on either surface.
export const CHART_COLORS = [
  COLORS.chart1,
  COLORS.chart2,
  COLORS.chart3,
  COLORS.chart4,
  COLORS.navyLight,
  COLORS.sandDark,
];

export function colorWithAlpha(cssVar, alpha) {
  return `color-mix(in srgb, ${cssVar} ${Math.round(alpha * 100)}%, transparent)`;
}

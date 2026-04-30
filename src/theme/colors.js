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
  rust: 'var(--color-rust)',
  plum: 'var(--color-plum)',
  rowAlt: 'var(--color-row-alt)',
};

export const CHART_COLORS = [
  COLORS.navy,
  COLORS.sand,
  COLORS.forest,
  COLORS.plum,
  COLORS.rust,
  COLORS.navyLight,
];

export function colorWithAlpha(cssVar, alpha) {
  return `color-mix(in srgb, ${cssVar} ${Math.round(alpha * 100)}%, transparent)`;
}

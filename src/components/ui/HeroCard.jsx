import { COLORS } from '../../theme/colors';

/**
 * The signature Omaad dark "wealth desk" card. Deep midnight surface with a
 * warm ochre glow, an oversized headline number and an optional right slot.
 */
export default function HeroCard({ eyebrow, value, unit, sub, badge, children, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-card p-6 sm:p-8 ${className}`}
      style={{ background: 'var(--hero-grad)', boxShadow: 'var(--shadow-hero)' }}
    >
      {/* ochre glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full opacity-25 blur-3xl"
        style={{ background: COLORS.sand }}
      />
      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="min-w-0">
          {eyebrow && (
            <div className="flex items-center gap-2 mb-4">
              {badge}
              <span
                className="text-[11px] uppercase tracking-[0.22em] font-semibold"
                style={{ color: COLORS.sandLight }}
              >
                {eyebrow}
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tabular-nums leading-none"
              style={{ color: COLORS.heroInk, letterSpacing: '-0.04em' }}
            >
              {value}
            </span>
            {unit && (
              <span className="text-lg font-semibold" style={{ color: COLORS.heroInkDim }}>
                {unit}
              </span>
            )}
          </div>
          {sub && (
            <div className="mt-4 text-sm font-medium" style={{ color: COLORS.heroInkDim }}>
              {sub}
            </div>
          )}
        </div>
        {children && <div className="lg:text-right flex-shrink-0 w-full lg:w-auto">{children}</div>}
      </div>
    </div>
  );
}

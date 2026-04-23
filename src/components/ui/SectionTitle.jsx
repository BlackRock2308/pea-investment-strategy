import { COLORS } from '../../theme/colors';

export default function SectionTitle({ number, title, subtitle }) {
  return (
    <div className="mb-8 pb-4 border-b border-border">
      <div className="flex items-baseline gap-4">
        {number && (
          <span
            className="text-xs uppercase tracking-[0.2em] font-medium"
            style={{ color: COLORS.sand }}
          >
            {number}
          </span>
        )}
        <h2 className="text-3xl font-normal font-serif" style={{ color: COLORS.ink }}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-3 text-sm max-w-3xl" style={{ color: COLORS.inkMid, lineHeight: 1.6 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

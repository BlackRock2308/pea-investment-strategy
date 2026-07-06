import { COLORS } from '../../theme/colors';

export default function SectionTitle({ number, title, subtitle, eyebrow }) {
  return (
    <div className="mb-6 sm:mb-8">
      {(eyebrow || number) && (
        <div
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-semibold mb-3"
          style={{ color: COLORS.sand }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.sand }} />
          {eyebrow || `Section ${number}`}
        </div>
      )}
      <h2
        className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.05]"
        style={{ color: COLORS.ink, letterSpacing: '-0.035em' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm sm:text-[15px] max-w-3xl" style={{ color: COLORS.inkMid, lineHeight: 1.65 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

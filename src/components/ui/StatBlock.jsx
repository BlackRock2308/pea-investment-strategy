import { COLORS } from '../../theme/colors';

export default function StatBlock({ label, value, sub, accent, large }) {
  return (
    <div className="flex gap-3">
      {accent && (
        <div className="w-0.5 flex-shrink-0 rounded-full self-stretch" style={{ backgroundColor: accent }} />
      )}
      <div className="flex flex-col min-w-0">
        <div
          className="text-[11px] uppercase tracking-[0.15em] font-medium mb-2 font-sans"
          style={{ color: COLORS.inkLight }}
        >
          {label}
        </div>
        <div
          className={`${large ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'} font-light leading-none tabular-nums font-serif`}
          style={{ color: accent || COLORS.ink, letterSpacing: '-0.02em' }}
        >
          {value}
        </div>
        {sub && (
          <div className="text-xs mt-2" style={{ color: COLORS.inkMid }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

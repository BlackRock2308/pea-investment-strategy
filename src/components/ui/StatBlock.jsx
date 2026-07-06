import { COLORS } from '../../theme/colors';

export default function StatBlock({ label, value, sub, accent, large, icon: Icon }) {
  return (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div
          className="text-[10px] uppercase tracking-[0.16em] font-semibold"
          style={{ color: COLORS.inkLight }}
        >
          {label}
        </div>
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" style={{ color: COLORS.inkLight }} />}
      </div>
      <div
        className={`${large ? 'text-[26px] sm:text-4xl' : 'text-xl sm:text-2xl'} font-extrabold leading-none tabular-nums`}
        style={{ color: accent || COLORS.ink, letterSpacing: '-0.03em' }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs mt-2.5 font-medium" style={{ color: COLORS.inkMid }}>
          {sub}
        </div>
      )}
    </div>
  );
}

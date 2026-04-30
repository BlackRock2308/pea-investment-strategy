import { COLORS } from '../../theme/colors';
import { fmtEur } from '../../utils/formatters';

export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="px-4 py-3 rounded-lg border"
      style={{
        backgroundColor: COLORS.paper,
        borderColor: COLORS.border,
        boxShadow: 'var(--shadow-tooltip)',
      }}
    >
      {label !== undefined && (
        <div
          className="text-[10px] uppercase tracking-[0.15em] font-medium mb-2 pb-2 border-b"
          style={{ color: COLORS.inkLight, borderColor: COLORS.border }}
        >
          {typeof label === 'number' ? `Année ${label}` : label}
        </div>
      )}
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-3 text-xs py-0.5">
          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span style={{ color: COLORS.inkMid }}>{entry.name} :</span>
          <span className="tabular-nums font-medium ml-auto" style={{ color: COLORS.ink }}>
            {typeof entry.value === 'number' ? fmtEur(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

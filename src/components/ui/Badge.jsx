import { COLORS } from '../../theme/colors';

export default function Badge({ children, color = COLORS.navy, bg }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] font-medium"
      style={{
        color,
        backgroundColor: bg || `${color}15`,
        border: `1px solid ${color}30`,
      }}
    >
      {children}
    </span>
  );
}

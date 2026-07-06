import { colorWithAlpha } from '../../theme/colors';

export default function Badge({ children, color = 'var(--color-navy)', bg }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] font-semibold rounded-full"
      style={{
        color,
        backgroundColor: bg || colorWithAlpha(color, 0.12),
      }}
    >
      {children}
    </span>
  );
}

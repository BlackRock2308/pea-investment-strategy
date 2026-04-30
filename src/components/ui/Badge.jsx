import { colorWithAlpha } from '../../theme/colors';

export default function Badge({ children, color = 'var(--color-navy)', bg }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] font-medium rounded"
      style={{
        color,
        backgroundColor: bg || colorWithAlpha(color, 0.1),
        border: `1px solid ${colorWithAlpha(color, 0.2)}`,
      }}
    >
      {children}
    </span>
  );
}

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/** Green/red rounded pill for a +/- delta value. */
export default function DeltaPill({ positive, children, size = 'sm', arrow = true }) {
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  const pad = size === 'lg' ? 'px-2.5 py-1 text-sm' : 'px-2 py-0.5 text-[11px]';
  return (
    <span className={`pill ${positive ? 'pill-pos' : 'pill-neg'} ${pad}`}>
      {arrow && <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} />}
      {children}
    </span>
  );
}

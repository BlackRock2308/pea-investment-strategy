import { COLORS } from '../../theme/colors';

export default function Slider({ label, value, min, max, step, onChange, unit, color = COLORS.navy }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label
          className="text-xs uppercase tracking-[0.15em] font-medium"
          style={{ color: COLORS.inkMid }}
        >
          {label}
        </label>
        <span className="text-2xl font-light tabular-nums font-serif" style={{ color, letterSpacing: '-0.02em' }}>
          {value}
          <span className="text-sm ml-1" style={{ color: COLORS.inkLight }}>
            {unit}
          </span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 cursor-pointer slider-thumb rounded-full"
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, var(--color-border) ${pct}%, var(--color-border) 100%)`,
        }}
      />
    </div>
  );
}

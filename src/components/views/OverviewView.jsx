import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';
import { COLORS } from '../../theme/colors';
import { fmtEur } from '../../utils/formatters';
import { portfolioActual, portfolioTarget, TOTAL_CURRENT, PV_CURRENT, PHASE_1_THRESHOLD, PHASE_2_THRESHOLD, PEA_CEILING } from '../../data/portfolio';
import Card from '../ui/Card';
import StatBlock from '../ui/StatBlock';
import SectionTitle from '../ui/SectionTitle';
import Badge from '../ui/Badge';
import CustomTooltip from '../ui/CustomTooltip';

const phases = [
  { label: 'Phase 1 — Capitalisation', range: '0 – 20k €', threshold: PHASE_1_THRESHOLD, color: COLORS.navy },
  { label: 'Phase 2 — Structuration', range: '20k – 80k €', threshold: PHASE_2_THRESHOLD, color: COLORS.sand },
  { label: 'Phase 3 — Optimisation', range: '80k €+', threshold: PEA_CEILING, color: COLORS.forest },
];

const milestones = [
  { label: '20 000 €', value: 20000, desc: 'Sortie phase 1 — allocation précise', color: COLORS.navy },
  { label: '50 000 €', value: 50000, desc: 'Mi-parcours phase 2', color: COLORS.navyLight },
  { label: '100 000 €', value: 100000, desc: 'Cap symbolique', color: COLORS.sand },
  { label: '150 000 €', value: 150000, desc: 'Plafond versements PEA', color: COLORS.forest },
];

function PhaseTracker() {
  const pct = Math.min((TOTAL_CURRENT / 100000) * 100, 100);
  const phase1Pct = (PHASE_1_THRESHOLD / 100000) * 100;
  const phase2Pct = (PHASE_2_THRESHOLD / 100000) * 100;

  return (
    <Card padding="p-5 sm:p-8" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: COLORS.navy }} />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5" style={{ color: COLORS.navy }} />
          <h3 className="text-lg sm:text-xl font-normal font-serif" style={{ color: COLORS.ink }}>
            Phase 1 — Capitalisation
          </h3>
          <Badge color={COLORS.navy}>Active</Badge>
        </div>
        <div className="text-sm tabular-nums font-serif" style={{ color: COLORS.ink }}>
          {fmtEur(TOTAL_CURRENT)} / {fmtEur(PHASE_1_THRESHOLD)}
        </div>
      </div>

      <div className="relative mb-3">
        <div className="h-3 w-full relative" style={{ backgroundColor: COLORS.border }}>
          <div
            className="absolute top-0 left-0 h-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: COLORS.navy }}
          />
          <div
            className="absolute top-0 h-full w-px"
            style={{ left: `${phase1Pct}%`, backgroundColor: COLORS.sand }}
          />
          <div
            className="absolute top-0 h-full w-px"
            style={{ left: `${phase2Pct}%`, backgroundColor: COLORS.forest }}
          />
        </div>
      </div>

      <div className="flex justify-between text-[10px] tabular-nums mb-6" style={{ color: COLORS.inkLight }}>
        <span>0 €</span>
        <span style={{ marginLeft: `${phase1Pct - 5}%` }}>20k</span>
        <span>80k</span>
        <span>100k €</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {phases.map((p, i) => {
          const isActive = i === 0;
          return (
            <div
              key={p.label}
              className="p-3 sm:p-4 border-l-4"
              style={{
                borderColor: p.color,
                backgroundColor: isActive ? `${p.color}08` : COLORS.cream,
                opacity: isActive ? 1 : 0.6,
              }}
            >
              <div className="text-xs font-medium" style={{ color: p.color }}>
                {p.label}
              </div>
              <div className="text-[11px] mt-1" style={{ color: COLORS.inkMid }}>
                {p.range}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs sm:text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.7, maxWidth: '48rem' }}>
        En phase 1, la priorité absolue est le <strong style={{ color: COLORS.ink }}>volume investi</strong>.
        L'allocation se précisera naturellement avec le capital. Le rééquilibrage fin est réservé à la phase 2 (à partir de 20 000 €).
      </p>
    </Card>
  );
}

export default function OverviewView() {
  const pvPct = ((PV_CURRENT / (TOTAL_CURRENT - PV_CURRENT)) * 100).toFixed(2);

  return (
    <div className="space-y-8 sm:space-y-12">
      <SectionTitle
        number="I"
        title="Portefeuille & allocation"
        subtitle="Le S&P 500 est le cœur assumé du portefeuille. En phase capitalisation, la priorité est d'alimenter le PEA régulièrement — pas l'optimisation allocative."
      />

      <PhaseTracker />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: COLORS.border }}>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock label="Valeur actuelle" value={fmtEur(TOTAL_CURRENT)} large accent={COLORS.ink} />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock label="Plus-value latente" value={`+${fmtEur(PV_CURRENT)}`} sub={`+${pvPct} %`} accent={COLORS.forest} large />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock label="Lignes actuelles" value="3" sub="ETF UCITS capitalisants" large />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock label="Cible phase 1" value="5–6" sub="3 ETF + 2–3 actions" accent={COLORS.sand} large />
        </div>
      </div>

      {/* Comparaison allocations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6" style={{ backgroundColor: COLORS.inkLight }} />
            <h3 className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
              Allocation actuelle
            </h3>
            <Badge color={COLORS.navy}>59 % USA</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={portfolioActual}
                dataKey="pct"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={2}
                label={({ pct }) => `${pct}%`}
                labelLine={false}
              >
                {portfolioActual.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {portfolioActual.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between text-sm py-1.5 border-b last:border-0 border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <span style={{ color: COLORS.inkMid }}>{p.name}</span>
                </div>
                <span className="tabular-nums font-medium ml-2" style={{ color: COLORS.ink }}>
                  {fmtEur(p.value)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6" style={{ backgroundColor: COLORS.sand }} />
            <h3 className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
              Allocation cible phase 1
            </h3>
            <Badge color={COLORS.forest}>souple</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={portfolioTarget}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={2}
                label={({ value }) => `${value}%`}
                labelLine={false}
              >
                {portfolioTarget.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {portfolioTarget.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-between text-sm py-1.5 border-b last:border-0 border-border"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <div className="min-w-0">
                    <div className="truncate" style={{ color: COLORS.ink }}>{p.name}</div>
                    <div className="text-[10px] mt-0.5 truncate" style={{ color: COLORS.inkLight }}>
                      {p.desc}
                    </div>
                  </div>
                </div>
                <span className="tabular-nums font-medium flex-shrink-0 ml-2" style={{ color: COLORS.ink }}>
                  {p.value}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trajectoire d'accumulation */}
      <Card className="relative overflow-hidden" padding="p-5 sm:p-8">
        <div className="absolute top-0 left-0 w-24 h-1" style={{ backgroundColor: COLORS.sand }} />
        <h3 className="text-lg sm:text-xl font-normal mb-4 sm:mb-6 font-serif" style={{ color: COLORS.ink }}>
          Trajectoire d'accumulation
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {milestones.map((m) => {
            const progress = Math.min((TOTAL_CURRENT / m.value) * 100, 100);
            const reached = TOTAL_CURRENT >= m.value;
            return (
              <div key={m.label} className="relative">
                <div className="text-[11px] uppercase tracking-[0.15em] mb-2 sm:mb-3" style={{ color: COLORS.inkLight }}>
                  {m.desc}
                </div>
                <div className="text-2xl sm:text-4xl font-normal tabular-nums font-serif" style={{ color: reached ? COLORS.forest : COLORS.ink }}>
                  {m.label}
                </div>
                <div className="mt-3 h-1.5 relative" style={{ backgroundColor: COLORS.border }}>
                  <div
                    className="absolute left-0 top-0 h-full"
                    style={{ width: `${progress}%`, backgroundColor: m.color }}
                  />
                </div>
                <div className="mt-2 text-xs tabular-nums" style={{ color: m.color }}>
                  {progress.toFixed(1)} %
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.7, maxWidth: '48rem' }}>
          La transition se réalise <strong style={{ color: COLORS.ink }}>sans vente d'existant</strong> —
          uniquement par orientation des flux DCA mensuels. Le rééquilibrage fin s'activera
          naturellement à partir de 20 000 €.
        </p>
      </Card>
    </div>
  );
}

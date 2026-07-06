import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon, Target, TrendingUp, Wallet, Layers } from 'lucide-react';
import { COLORS } from '../../theme/colors';
import { fmtEur } from '../../utils/formatters';
import { portfolioTarget, PHASE_1_THRESHOLD, PHASE_2_THRESHOLD, PEA_CEILING } from '../../data/portfolio';
import usePortfolio from '../../hooks/usePortfolio';
import useTotalDeposited from '../../hooks/useTotalDeposited';
import useCashBalance from '../../hooks/useCashBalance';
import Card from '../ui/Card';
import StatBlock from '../ui/StatBlock';
import SectionTitle from '../ui/SectionTitle';
import Badge from '../ui/Badge';
import HeroCard from '../ui/HeroCard';
import DeltaPill from '../ui/DeltaPill';
import CustomTooltip from '../ui/CustomTooltip';

const milestones = [
  { label: '20 000 €', value: 20000, desc: 'Sortie phase 1', color: COLORS.navy },
  { label: '50 000 €', value: 50000, desc: 'Mi-parcours phase 2', color: COLORS.navyLight },
  { label: '100 000 €', value: 100000, desc: 'Cap symbolique', color: COLORS.sand },
  { label: '150 000 €', value: 150000, desc: 'Plafond PEA', color: COLORS.forest },
];

function ChartHeader({ icon: Icon, title, badge }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="icon-chip"><Icon className="w-4 h-4" /></span>
      <h3 className="text-lg font-bold" style={{ color: COLORS.ink, letterSpacing: '-0.02em' }}>{title}</h3>
      {badge}
    </div>
  );
}

function AllocationLegend({ rows }) {
  return (
    <div className="mt-5 space-y-1">
      {rows.map((p) => (
        <div key={p.name} className="flex items-center justify-between text-sm py-2 border-b last:border-0" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            <div className="min-w-0">
              <div className="truncate font-medium" style={{ color: COLORS.ink }}>{p.name}</div>
              {p.desc && <div className="text-[11px] mt-0.5 truncate" style={{ color: COLORS.inkLight }}>{p.desc}</div>}
            </div>
          </div>
          <span className="tabular-nums font-bold flex-shrink-0 ml-2" style={{ color: COLORS.ink }}>{p.right}</span>
        </div>
      ))}
    </div>
  );
}

export default function OverviewView() {
  const { totalDeposited } = useTotalDeposited();
  const { cashBalance } = useCashBalance();
  const { holdings, totals } = usePortfolio();

  const currentValue = totals.totalValue;
  const totalPEA = currentValue + cashBalance;
  const unrealizedPL = totals.totalUnrealizedPL;
  const unrealizedPLPct = totals.totalUnrealizedPLPct;
  const hasLive = currentValue > 0;
  const hasPL = totals.totalInvested > 0 && hasLive;
  const plPositive = unrealizedPL >= 0;

  const phasePct = Math.min((totalDeposited / 100000) * 100, 100);
  const phase1Pct = (PHASE_1_THRESHOLD / 100000) * 100;
  const phase2Pct = (PHASE_2_THRESHOLD / 100000) * 100;

  const livePortfolioActual = holdings
    .filter((h) => h.currentValue > 0)
    .map((h) => ({ name: h.label, value: h.currentValue, pct: Number((h.weightPct || 0).toFixed(1)), color: h.color }));

  return (
    <div className="space-y-7 sm:space-y-9">
      <SectionTitle
        eyebrow="Vue d'ensemble"
        title="Portefeuille & allocation"
        subtitle="Le S&P 500 est le cœur assumé du portefeuille. En phase capitalisation, la priorité est d'alimenter le PEA régulièrement — pas l'optimisation allocative."
      />

      {/* Hero — patrimoine + phase progress */}
      <HeroCard
        eyebrow="Patrimoine total PEA"
        value={hasLive ? fmtEur(Math.round(totalPEA)) : '—'}
        sub={hasLive ? `Titres ${fmtEur(Math.round(currentValue))} · Espèces ${fmtEur(Math.round(cashBalance))}` : 'En attente des cours'}
        badge={hasPL ? <DeltaPill positive={plPositive} size="lg">{plPositive ? '+' : ''}{unrealizedPLPct.toFixed(2)} %</DeltaPill> : null}
      >
        <div className="w-full lg:w-80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: COLORS.heroInkDim }}>
              Progression Phase 1
            </span>
            <span className="text-sm font-bold tabular-nums" style={{ color: COLORS.sandLight }}>
              {((totalDeposited / PHASE_1_THRESHOLD) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
            <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${phasePct}%`, background: `linear-gradient(90deg, ${COLORS.sandDark}, ${COLORS.sandLight})` }} />
            <div className="absolute top-0 h-full w-px" style={{ left: `${phase1Pct}%`, backgroundColor: 'rgba(255,255,255,0.4)' }} />
            <div className="absolute top-0 h-full w-px" style={{ left: `${phase2Pct}%`, backgroundColor: 'rgba(255,255,255,0.4)' }} />
          </div>
          <div className="mt-3 text-xs" style={{ color: COLORS.heroInkDim }}>
            {fmtEur(Math.round(totalDeposited))} déposés sur {fmtEur(PHASE_1_THRESHOLD)} · cœur S&P 500 · DCA 400 €/mois
          </div>
        </div>
      </HeroCard>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <Card padding="p-5" hover>
          <StatBlock label="Cumul versements" icon={Wallet} value={fmtEur(Math.round(totalDeposited))} sub="Cash déposé sur le PEA" large />
        </Card>
        <Card padding="p-5" hover>
          <StatBlock label="Évaluation titres" icon={Layers} value={hasLive ? fmtEur(Math.round(currentValue)) : '—'} sub={`${holdings.length} ETF UCITS`} large />
        </Card>
        <Card padding="p-5" hover>
          <StatBlock
            label="Plus-value latente" icon={TrendingUp}
            value={hasPL ? `${plPositive ? '+' : ''}${fmtEur(Math.round(unrealizedPL))}` : '—'}
            sub={hasPL ? `${plPositive ? '+' : ''}${unrealizedPLPct.toFixed(2)} %` : null}
            accent={hasPL ? (plPositive ? COLORS.forest : COLORS.rust) : COLORS.ink}
            large
          />
        </Card>
        <Card padding="p-5" hover>
          <StatBlock label="Solde espèces" icon={Wallet} value={fmtEur(Math.round(cashBalance))} sub="Cash non investi" accent={COLORS.sand} large />
        </Card>
      </div>

      {/* Allocations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <Card>
          <ChartHeader icon={PieIcon} title="Allocation actuelle" badge={(() => {
            const sp500 = livePortfolioActual.find((p) => p.name.includes('S&P 500'));
            const usaPct = sp500 ? Math.round(sp500.pct) : 0;
            return usaPct > 0 ? <Badge color={COLORS.navy}>{usaPct}% USA</Badge> : null;
          })()} />
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={livePortfolioActual} dataKey="pct" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={52} paddingAngle={3} cornerRadius={5} label={({ pct }) => `${pct}%`} labelLine={false}>
                {livePortfolioActual.map((e, i) => <Cell key={i} fill={e.color} stroke="var(--color-paper)" strokeWidth={2} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <AllocationLegend rows={livePortfolioActual.map((p) => ({ ...p, right: fmtEur(p.value) }))} />
        </Card>

        <Card>
          <ChartHeader icon={Target} title="Allocation cible phase 1" badge={<Badge color={COLORS.forest} bg={COLORS.posBg}>souple</Badge>} />
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={portfolioTarget} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={52} paddingAngle={3} cornerRadius={5} label={({ value }) => `${value}%`} labelLine={false}>
                {portfolioTarget.map((e, i) => <Cell key={i} fill={e.color} stroke="var(--color-paper)" strokeWidth={2} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <AllocationLegend rows={portfolioTarget.map((p) => ({ ...p, right: `${p.value}%` }))} />
        </Card>
      </div>

      {/* Trajectoire */}
      <Card>
        <ChartHeader icon={Target} title="Trajectoire d'accumulation" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {milestones.map((m) => {
            const progress = Math.min((totalDeposited / m.value) * 100, 100);
            const reached = totalDeposited >= m.value;
            return (
              <div key={m.label} className="relative">
                <div className="text-[11px] uppercase tracking-[0.15em] mb-2.5 font-semibold" style={{ color: COLORS.inkLight }}>{m.desc}</div>
                <div className="text-2xl sm:text-[2rem] font-extrabold tabular-nums" style={{ color: reached ? COLORS.forest : COLORS.ink, letterSpacing: '-0.03em' }}>{m.label}</div>
                <div className="mt-3 h-1.5 rounded-full relative overflow-hidden" style={{ backgroundColor: COLORS.border }}>
                  <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: m.color }} />
                </div>
                <div className="mt-2 text-xs tabular-nums font-semibold" style={{ color: m.color }}>{progress.toFixed(1)} %</div>
              </div>
            );
          })}
        </div>
        <p className="mt-7 text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.7, maxWidth: '48rem' }}>
          La transition se réalise <strong style={{ color: COLORS.ink }}>sans vente d'existant</strong> —
          uniquement par orientation des flux DCA mensuels. Le rééquilibrage fin s'activera naturellement à partir de 20 000 €.
        </p>
      </Card>
    </div>
  );
}

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronRight } from 'lucide-react';
import { COLORS } from '../../theme/colors';
import { fmtEur } from '../../utils/formatters';
import { portfolioActual, portfolioTarget, TOTAL_CURRENT, PV_CURRENT } from '../../data/portfolio';
import Card from '../ui/Card';
import StatBlock from '../ui/StatBlock';
import SectionTitle from '../ui/SectionTitle';
import Badge from '../ui/Badge';
import CustomTooltip from '../ui/CustomTooltip';

const rebalanceData = [
  { zone: 'États-Unis', actuel: 59, cible: 40, delta: -19 },
  { zone: 'Europe (ETF)', actuel: 21, cible: 30, delta: +9 },
  { zone: 'Émergents', actuel: 20, cible: 15, delta: -5 },
  { zone: 'Actions EU', actuel: 0, cible: 15, delta: +15 },
];

export default function OverviewView() {
  return (
    <div className="space-y-8 sm:space-y-12">
      <SectionTitle
        number="I"
        title="Portefeuille & allocation"
        subtitle="État actuel vs allocation cible révisée. L'architecture retenue repose sur quatre poches non redondantes — zéro overlap ETF — chacune avec un rôle identifiable."
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: COLORS.border }}>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock label="Valeur actuelle" value={fmtEur(TOTAL_CURRENT)} large accent={COLORS.ink} />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock label="Plus-value latente" value={`+${fmtEur(PV_CURRENT)}`} sub="+3,17 %" accent={COLORS.forest} large />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock label="Lignes actuelles" value="3" sub="ETF UCITS capitalisants" large />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock label="Lignes cibles" value="4" sub="+ 8 actions individuelles" accent={COLORS.sand} large />
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
            <Badge color={COLORS.rust}>59 % USA</Badge>
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
              Allocation cible révisée
            </h3>
            <Badge color={COLORS.forest}>0 overlap ETF</Badge>
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

      {/* Transition */}
      <Card className="relative overflow-hidden" padding="p-5 sm:p-8">
        <div className="absolute top-0 left-0 w-24 h-1" style={{ backgroundColor: COLORS.sand }} />
        <h3 className="text-lg sm:text-xl font-normal mb-4 sm:mb-6 font-serif" style={{ color: COLORS.ink }}>
          Trajectoire de rééquilibrage
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {rebalanceData.map((r) => (
            <div key={r.zone} className="relative">
              <div className="text-[11px] uppercase tracking-[0.15em] mb-2 sm:mb-3" style={{ color: COLORS.inkLight }}>
                {r.zone}
              </div>
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-xl sm:text-3xl font-light line-through tabular-nums font-serif" style={{ color: COLORS.inkLight }}>
                  {r.actuel}%
                </span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: COLORS.sand }} />
                <span className="text-2xl sm:text-4xl font-normal tabular-nums font-serif" style={{ color: COLORS.ink }}>
                  {r.cible}%
                </span>
              </div>
              <div
                className="mt-2 sm:mt-3 text-sm tabular-nums"
                style={{ color: r.delta >= 0 ? COLORS.forest : COLORS.rust }}
              >
                {r.delta > 0 ? '+' : ''}
                {r.delta} points
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 sm:mt-8 text-xs sm:text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.7, maxWidth: '48rem' }}>
          La transition se réalise <strong style={{ color: COLORS.ink }}>sans vente d'existant</strong> —
          uniquement par orientation des flux DCA mensuels. Aucun frottement fiscal, conservation des
          plus-values latentes, et dilution naturelle des poches en surpoids.
        </p>
      </Card>
    </div>
  );
}

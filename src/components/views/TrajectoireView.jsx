import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Target, TrendingUp, Flag, Calendar } from 'lucide-react';
import { COLORS, colorWithAlpha } from '../../theme/colors';
import { fmtEur, fmt } from '../../utils/formatters';
import { PHASE_1_THRESHOLD, PHASE_2_THRESHOLD } from '../../data/portfolio';
import useTotalDeposited from '../../hooks/useTotalDeposited';
import Card from '../ui/Card';
import StatBlock from '../ui/StatBlock';
import SectionTitle from '../ui/SectionTitle';
import Slider from '../ui/Slider';
import Badge from '../ui/Badge';
import CustomTooltip from '../ui/CustomTooltip';

const START_DATE = new Date(2026, 5, 1); // 1 juin 2026

const MONTHS_FR = ['Janv.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

function monthLabel(date) {
  return `${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
}

function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}

function computeMonthlyRate(annualPct) {
  return Math.pow(1 + annualPct / 100, 1 / 12) - 1;
}

function computeMonthsToTarget(initial, monthly, annualRate, target) {
  const r = computeMonthlyRate(annualRate);
  let balance = initial;
  for (let m = 1; m <= 600; m++) {
    balance = balance * (1 + r) + monthly;
    if (balance >= target) return m;
  }
  return null;
}

function projectMonthly(initial, monthly, annualRate, numMonths) {
  const r = computeMonthlyRate(annualRate);
  const rows = [];
  let balance = initial;

  for (let m = 1; m <= numMonths; m++) {
    const startOfMonth = balance;
    const gains = balance * r;
    balance = balance + gains + monthly;
    const date = addMonths(START_DATE, m);
    rows.push({
      month: m,
      label: monthLabel(date),
      shortLabel: MONTHS_FR[date.getMonth()],
      capitalDebut: Math.round(startOfMonth),
      apport: monthly,
      plusValue: Math.round(gains),
      capitalFin: Math.round(balance),
    });
  }

  return rows;
}

const DCA_VARIANTS = [300, 400, 500, 700];
const ANNUAL_RATE = 8.5;

// ---------------------------------------------------------------------------

export default function TrajectoireView() {
  const { totalDeposited } = useTotalDeposited();
  const [dca, setDca] = useState(400);
  const remaining = PHASE_1_THRESHOLD - totalDeposited;
  const progressPct = (totalDeposited / PHASE_1_THRESHOLD) * 100;

  const monthsTo20k = useMemo(() => computeMonthsToTarget(totalDeposited, dca, ANNUAL_RATE, PHASE_1_THRESHOLD), [totalDeposited, dca]);
  const exitDate = useMemo(() => monthsTo20k ? addMonths(START_DATE, monthsTo20k) : null, [monthsTo20k]);
  const exitDateStr = useMemo(() => exitDate ? monthLabel(exitDate) : '—', [exitDate]);

  const monthlyData = useMemo(() => projectMonthly(totalDeposited, dca, ANNUAL_RATE, 6), [totalDeposited, dca]);

  const endOf2026 = monthlyData[monthlyData.length - 1];
  const totalApports2026 = monthlyData.reduce((s, r) => s + r.apport, 0);
  const totalPV2026 = monthlyData.reduce((s, r) => s + r.plusValue, 0);
  const gain2026 = endOf2026.capitalFin - totalDeposited;

  const dcaComparison = useMemo(() => DCA_VARIANTS.map((m) => {
    const months = computeMonthsToTarget(totalDeposited, m, ANNUAL_RATE, PHASE_1_THRESHOLD);
    const date = months ? addMonths(START_DATE, months) : null;
    return {
      dca: m,
      months,
      dateStr: date ? monthLabel(date) : '—',
      isActive: m === dca,
    };
  }), [totalDeposited, dca]);

  const milestones = useMemo(() => {
    const entries = [
      { label: 'Aujourd\'hui', value: totalDeposited, date: 'Juin 2026', color: COLORS.ink, reached: true },
    ];

    const targets = [
      { label: 'Fin 2026', yearEnd: 2026, color: COLORS.navyLight },
      { label: 'Fin 2027', yearEnd: 2027, color: COLORS.navy },
      { label: 'Fin 2028', yearEnd: 2028, color: COLORS.sand },
    ];
    const r = computeMonthlyRate(ANNUAL_RATE);
    for (const t of targets) {
      const monthsToEnd = (t.yearEnd - 2026) * 12 + (12 - START_DATE.getMonth());
      let balance = totalDeposited;
      for (let m = 0; m < monthsToEnd; m++) balance = balance * (1 + r) + dca;
      entries.push({ label: t.label, value: Math.round(balance), date: `Déc. ${t.yearEnd}`, color: t.color, reached: false });
    }

    const phase1Months = computeMonthsToTarget(totalDeposited, dca, ANNUAL_RATE, PHASE_1_THRESHOLD);
    if (phase1Months) {
      const d = addMonths(START_DATE, phase1Months);
      entries.push({ label: '20 000 €', value: PHASE_1_THRESHOLD, date: monthLabel(d), color: COLORS.sand, reached: false, highlight: true });
    }

    const phase2Months = computeMonthsToTarget(totalDeposited, dca, ANNUAL_RATE, PHASE_2_THRESHOLD);
    if (phase2Months) {
      const d = addMonths(START_DATE, phase2Months);
      entries.push({ label: '80 000 €', value: PHASE_2_THRESHOLD, date: monthLabel(d), color: COLORS.forest, reached: false });
    }

    entries.sort((a, b) => a.value - b.value);
    return entries;
  }, [totalDeposited, dca]);

  const graduations = [0, 5000, 10000, 15000, 20000];

  return (
    <div className="space-y-8 sm:space-y-12">
      <SectionTitle
        eyebrow="Trajectoire"
        title="Trajectoire court terme"
        subtitle="La projection court terme rend tangible la progression vers le palier 20 000 € — sortie de la phase 1 et entrée dans la phase de structuration."
      />

      {/* ------------------------------------------------------------------ */}
      {/* 1. Compteur principal — palier 20 000 € */}
      {/* ------------------------------------------------------------------ */}
      <Card padding="p-5 sm:p-8" className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: COLORS.sand }} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5" style={{ color: COLORS.sand }} />
            <h3 className="text-lg sm:text-xl font-normal font-serif" style={{ color: COLORS.ink }}>
              Objectif phase 1 — 20 000 €
            </h3>
            <Badge color={COLORS.sand}>En cours</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-8" style={{ backgroundColor: COLORS.border }}>
          <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-5">
            <StatBlock label="Capital déposé" value={fmtEur(Math.round(totalDeposited))} accent={COLORS.ink} large />
          </div>
          <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-5">
            <StatBlock label="Capital cible" value={fmtEur(PHASE_1_THRESHOLD)} accent={COLORS.sand} large />
          </div>
          <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-5">
            <StatBlock label="Reste à parcourir" value={fmtEur(Math.round(remaining))} accent={COLORS.navy} large />
          </div>
          <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-5">
            <StatBlock label="Progression" value={`${progressPct.toFixed(1)} %`} accent={COLORS.forest} large />
          </div>
        </div>

        {/* Progress bar with graduations */}
        <div className="relative mb-2">
          <div className="h-4 w-full relative rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{ width: `${progressPct}%`, backgroundColor: COLORS.sand }}
            />
            {graduations.slice(1, -1).map((g) => (
              <div
                key={g}
                className="absolute top-0 h-full w-px"
                style={{ left: `${(g / PHASE_1_THRESHOLD) * 100}%`, backgroundColor: colorWithAlpha(COLORS.ink, 0.15) }}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between text-[9px] sm:text-[10px] tabular-nums mb-6 sm:mb-8" style={{ color: COLORS.inkLight }}>
          {graduations.map((g) => (
            <span key={g}>{g === 0 ? '0 €' : `${fmt(g)} €`}</span>
          ))}
        </div>

        {/* Estimation */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-l-4" style={{ borderColor: COLORS.sand, backgroundColor: colorWithAlpha(COLORS.sand, 0.05) }}>
          <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: COLORS.sand }} />
          <div className="text-sm" style={{ color: COLORS.inkMid }}>
            À {fmtEur(dca)}/mois avec un rendement annualisé de 8,5 %, le palier 20 000 € est estimé en{' '}
            <strong className="font-serif" style={{ color: COLORS.ink }}>{exitDateStr}</strong>
            {monthsTo20k && (
              <span> — soit <strong className="font-serif" style={{ color: COLORS.ink }}>{monthsTo20k} mois</strong></span>
            )}.
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 2. Projection mensuelle — Juil à Décembre 2026 */}
      {/* ------------------------------------------------------------------ */}
      <Card padding="p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-normal font-serif" style={{ color: COLORS.ink }}>
              Projection mensuelle — fin d'année 2026
            </h3>
            <p className="text-xs sm:text-sm mt-1" style={{ color: COLORS.inkLight }}>
              Évolution mois par mois, hypothèse DCA {fmtEur(dca)}/mois et rendement annualisé 8,5 %
            </p>
          </div>
          <div style={{ minWidth: '11rem' }}>
            <Slider label="DCA mensuel" value={dca} min={100} max={1000} step={25} onChange={setDca} unit="€" color={COLORS.sand} />
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid stroke={COLORS.border} strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="shortLabel"
              tick={{ fill: COLORS.inkLight, fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.border }}
            />
            <YAxis
              tick={{ fill: COLORS.inkLight, fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.border }}
              tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="capitalFin" name="Capital fin de mois" fill={COLORS.navy} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Monthly table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-xs sm:text-sm" style={{ color: COLORS.ink }}>
            <thead>
              <tr className="border-b" style={{ borderColor: COLORS.border }}>
                {['Mois', 'Capital début', 'Apport', 'Plus-value', 'Capital fin'].map((h) => (
                  <th
                    key={h}
                    className="py-2 px-2 sm:px-3 text-left text-[10px] uppercase tracking-[0.15em] font-medium"
                    style={{ color: COLORS.inkLight }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((row, i) => (
                <tr
                  key={row.month}
                  className="border-b last:border-0"
                  style={{ borderColor: COLORS.border, backgroundColor: i % 2 === 0 ? COLORS.paper : COLORS.rowAlt }}
                >
                  <td className="py-2.5 px-2 sm:px-3 font-medium whitespace-nowrap">{row.label}</td>
                  <td className="py-2.5 px-2 sm:px-3 tabular-nums">{fmtEur(row.capitalDebut)}</td>
                  <td className="py-2.5 px-2 sm:px-3 tabular-nums" style={{ color: COLORS.navy }}>+{fmtEur(row.apport)}</td>
                  <td className="py-2.5 px-2 sm:px-3 tabular-nums" style={{ color: COLORS.forest }}>+{fmtEur(row.plusValue)}</td>
                  <td className="py-2.5 px-2 sm:px-3 tabular-nums font-medium font-serif">{fmtEur(row.capitalFin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* KPI fin 2026 + Décomposition */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* KPI fin 2026 */}
        <Card padding="p-5 sm:p-8" className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-1" style={{ backgroundColor: COLORS.navy }} />
          <div className="flex items-center gap-3 mb-6">
            <Flag className="w-5 h-5" style={{ color: COLORS.navy }} />
            <h3 className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
              Capital estimé fin 2026
            </h3>
          </div>
          <div className="text-4xl sm:text-5xl font-light tabular-nums font-serif mb-2" style={{ color: COLORS.navy, letterSpacing: '-0.02em' }}>
            {fmtEur(endOf2026.capitalFin)}
          </div>
          <div className="text-sm" style={{ color: COLORS.forest }}>
            +{fmtEur(gain2026)} sur l'année
          </div>
          <p className="mt-4 text-xs" style={{ color: COLORS.inkMid, lineHeight: 1.6 }}>
            Projection au 31 décembre 2026 avec un DCA de {fmtEur(dca)}/mois
            et un rendement annualisé de 8,5 %.
          </p>
        </Card>

        {/* Décomposition */}
        <Card padding="p-5 sm:p-8" className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-1" style={{ backgroundColor: COLORS.sand }} />
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5" style={{ color: COLORS.sand }} />
            <h3 className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
              Décomposition fin 2026
            </h3>
          </div>

          {/* Stacked horizontal bar */}
          <div className="flex h-8 rounded overflow-hidden mb-4">
            <div style={{ width: `${(totalDeposited / endOf2026.capitalFin) * 100}%`, backgroundColor: COLORS.inkMid }} />
            <div style={{ width: `${(totalApports2026 / endOf2026.capitalFin) * 100}%`, backgroundColor: COLORS.navy }} />
            <div style={{ width: `${(totalPV2026 / endOf2026.capitalFin) * 100}%`, backgroundColor: COLORS.forest }} />
          </div>

          <div className="space-y-3">
            {[
              { label: 'Capital initial', value: totalDeposited, color: COLORS.inkMid },
              { label: 'Apports DCA cumulés', value: totalApports2026, color: COLORS.navy, sub: `${monthlyData.length} mois × ${fmtEur(dca)}` },
              { label: 'Plus-values estimées', value: totalPV2026, color: COLORS.forest, sub: 'Rendement 8,5 % annualisé' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: COLORS.border }}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-3 h-3 flex-shrink-0 rounded-sm" style={{ backgroundColor: item.color }} />
                  <div className="min-w-0">
                    <div className="text-sm" style={{ color: COLORS.ink }}>{item.label}</div>
                    {item.sub && <div className="text-[10px] mt-0.5" style={{ color: COLORS.inkLight }}>{item.sub}</div>}
                  </div>
                </div>
                <span className="tabular-nums font-medium font-serif flex-shrink-0 ml-3" style={{ color: COLORS.ink }}>
                  {fmtEur(Math.round(item.value))}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. Échéances clés — frise temporelle */}
      {/* ------------------------------------------------------------------ */}
      <Card padding="p-5 sm:p-8">
        <h3 className="text-lg sm:text-xl font-normal mb-6 sm:mb-8 font-serif" style={{ color: COLORS.ink }}>
          Échéances clés
        </h3>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-px" style={{ backgroundColor: COLORS.border }} />

          <div className="space-y-5 sm:space-y-6">
            {milestones.map((m, i) => (
              <div key={i} className="relative flex items-start gap-4 sm:gap-6 pl-8 sm:pl-10">
                {/* Dot */}
                <div
                  className="absolute left-1.5 sm:left-2 top-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 flex-shrink-0"
                  style={{
                    borderColor: m.color,
                    backgroundColor: m.reached ? m.color : COLORS.paper,
                    boxShadow: m.highlight ? `0 0 0 3px ${colorWithAlpha(COLORS.sand, 0.3)}` : undefined,
                  }}
                />
                <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-serif tabular-nums ${m.highlight ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'} font-normal`}
                        style={{ color: m.highlight ? COLORS.sand : COLORS.ink }}
                      >
                        {m.label}
                      </span>
                      {m.highlight && <Badge color={COLORS.sand}>Objectif phase 1</Badge>}
                      {m.reached && <Badge color={COLORS.forest}>Atteint</Badge>}
                    </div>
                    {!m.reached && !m.highlight && (
                      <div className="text-xs tabular-nums mt-0.5" style={{ color: COLORS.inkMid }}>
                        ~ {fmtEur(m.value)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm tabular-nums flex-shrink-0" style={{ color: COLORS.inkLight }}>
                    {m.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* 5. Variantes DCA */}
      {/* ------------------------------------------------------------------ */}
      <Card padding="p-5 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5" style={{ color: COLORS.navy }} />
          <h3 className="text-lg sm:text-xl font-normal font-serif" style={{ color: COLORS.ink }}>
            Impact du montant DCA
          </h3>
        </div>
        <p className="text-xs sm:text-sm mb-6" style={{ color: COLORS.inkMid, lineHeight: 1.6 }}>
          Chaque euro supplémentaire rapproche la sortie de phase 1. Le tableau rend tangible le coût
          de chaque mois de retard et le bénéfice d'un effort d'épargne additionnel.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ color: COLORS.ink }}>
            <thead>
              <tr className="border-b" style={{ borderColor: COLORS.border }}>
                {['DCA mensuel', 'Mois pour 20k €', 'Date estimée'].map((h) => (
                  <th
                    key={h}
                    className="py-2.5 px-3 sm:px-4 text-left text-[10px] uppercase tracking-[0.15em] font-medium"
                    style={{ color: COLORS.inkLight }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dcaComparison.map((row) => (
                <tr
                  key={row.dca}
                  className="border-b last:border-0"
                  style={{
                    borderColor: COLORS.border,
                    backgroundColor: row.isActive ? colorWithAlpha(COLORS.sand, 0.06) : undefined,
                  }}
                >
                  <td className="py-3 px-3 sm:px-4">
                    <div className="flex items-center gap-2">
                      <span className="tabular-nums font-medium font-serif">{fmtEur(row.dca)}</span>
                      {row.isActive && <Badge color={COLORS.sand}>Actuel</Badge>}
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 tabular-nums">
                    {row.months} mois
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    <span className="tabular-nums font-medium font-serif" style={{ color: row.isActive ? COLORS.sand : COLORS.ink }}>
                      {row.dateStr}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {dcaComparison.length >= 2 && (() => {
          const baseline = dcaComparison[0];
          const best = dcaComparison[dcaComparison.length - 1];
          const saved = baseline.months - best.months;
          return saved > 0 ? (
            <p className="mt-4 text-xs" style={{ color: COLORS.inkMid, lineHeight: 1.6 }}>
              Passer de {fmtEur(baseline.dca)} à {fmtEur(best.dca)}/mois permet de franchir le palier{' '}
              <strong style={{ color: COLORS.ink }}>{saved} mois plus tôt</strong>.
            </p>
          ) : null;
        })()}
      </Card>
    </div>
  );
}

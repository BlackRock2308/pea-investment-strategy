import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COLORS } from '../../theme/colors';
import { fmtEur } from '../../utils/formatters';
import { projectPortfolio } from '../../utils/calculations';
import Card from '../ui/Card';
import StatBlock from '../ui/StatBlock';
import SectionTitle from '../ui/SectionTitle';
import Slider from '../ui/Slider';
import CustomTooltip from '../ui/CustomTooltip';

export default function SimulatorView() {
  const [monthly, setMonthly] = useState(300);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8.5);

  const data = useMemo(() => projectPortfolio(3427, monthly, years, rate), [monthly, years, rate]);
  const final = data[data.length - 1];
  const totalApports = final.apports;
  const totalPV = final.plusValue;
  const multiplier = (final.capital / totalApports).toFixed(2);

  const psAmount = totalPV * 0.172;
  const ctoAmount = totalPV * 0.3;
  const gainFiscal = ctoAmount - psAmount;

  return (
    <div className="space-y-8 sm:space-y-12">
      <SectionTitle
        number="II"
        title="Simulateur de projection"
        subtitle="Ajuste les paramètres pour visualiser l'effet de la capitalisation composée sur ton PEA. Portefeuille de départ 3 427 €."
      />

      <Card padding="p-5 sm:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
          <Slider label="DCA mensuel" value={monthly} min={100} max={1000} step={25} onChange={setMonthly} unit="€" color={COLORS.navy} />
          <Slider label="Horizon" value={years} min={5} max={30} step={1} onChange={setYears} unit="ans" color={COLORS.sand} />
          <Slider label="Rendement annualisé" value={rate} min={4} max={14} step={0.5} onChange={setRate} unit="%" color={COLORS.forest} />
        </div>

        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: COLORS.border }}>
            <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
              <StatBlock label="Capital final" value={fmtEur(final.capital)} accent={COLORS.navy} large />
            </div>
            <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
              <StatBlock label="Total apports" value={fmtEur(totalApports)} sub={`${monthly} €/mois × ${years} ans`} large />
            </div>
            <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
              <StatBlock label="Plus-values" value={`+${fmtEur(totalPV)}`} sub={`×${multiplier} sur apports`} accent={COLORS.forest} large />
            </div>
            <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
              <StatBlock label="Gain fiscal PEA vs CTO" value={`+${fmtEur(gainFiscal)}`} sub="17,2 % PS vs 30 % flat tax" accent={COLORS.sand} large />
            </div>
          </div>
        </div>
      </Card>

      <Card padding="p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-3 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-normal font-serif" style={{ color: COLORS.ink }}>
              Projection du patrimoine PEA
            </h3>
            <p className="text-xs sm:text-sm mt-1" style={{ color: COLORS.inkLight }}>
              Capital total vs apports cumulés
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: COLORS.navy }} />
              <span style={{ color: COLORS.inkMid }}>Capital total</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: COLORS.sand }} />
              <span style={{ color: COLORS.inkMid }}>Apports cumulés</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -10, bottom: 10 }}>
            <defs>
              <linearGradient id="capitalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.navy} stopOpacity={0.25} />
                <stop offset="100%" stopColor={COLORS.navy} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="apportsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.sand} stopOpacity={0.2} />
                <stop offset="100%" stopColor={COLORS.sand} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={COLORS.border} strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: COLORS.inkLight, fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.border }}
            />
            <YAxis
              tick={{ fill: COLORS.inkLight, fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.border }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="capital" name="Capital total" stroke={COLORS.navy} strokeWidth={2.5} fill="url(#capitalGradient)" />
            <Area type="monotone" dataKey="apports" name="Apports cumulés" stroke={COLORS.sand} strokeWidth={2} strokeDasharray="4 4" fill="url(#apportsGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card padding="p-5 sm:p-8">
        <h3 className="text-lg sm:text-xl font-normal mb-4 sm:mb-6 font-serif" style={{ color: COLORS.ink }}>
          Jalons temporels
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {[5, 10, 15, 20, years >= 25 ? 25 : years]
            .filter((v, i, a) => a.indexOf(v) === i)
            .slice(0, 5)
            .map((y) => {
              const point = data.find((d) => d.year === y);
              if (!point) return null;
              return (
                <div key={y} className="border-l pl-3 sm:pl-4" style={{ borderColor: COLORS.sand }}>
                  <div className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: COLORS.inkLight }}>
                    An {y}
                  </div>
                  <div className="text-lg sm:text-2xl font-light tabular-nums mt-1 sm:mt-2 font-serif" style={{ color: COLORS.ink }}>
                    {fmtEur(point.capital)}
                  </div>
                  <div className="text-[10px] sm:text-xs mt-1 tabular-nums" style={{ color: COLORS.forest }}>
                    +{fmtEur(point.plusValue)} PV
                  </div>
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
}

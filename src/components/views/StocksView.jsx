import { useState } from 'react';
import { Award, BookOpen, Sparkles, CircleCheck, CircleAlert, ChevronDown } from 'lucide-react';
import { COLORS } from '../../theme/colors';
import { stocks } from '../../data/stocks';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';

const PRIORITE_CONFIG = {
  1: { label: 'Priorité 1 — Achat immédiat', color: COLORS.forest, stars: '★★★' },
  2: { label: 'Priorité 2 — Achat', color: COLORS.sand, stars: '★★' },
  3: { label: 'Priorité 3 — Patient', color: COLORS.plum, stars: '★' },
};

function PrioriteBadge({ p }) {
  const config = PRIORITE_CONFIG[p];
  return (
    <div
      className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 text-[10px] sm:text-xs uppercase tracking-[0.1em] font-medium"
      style={{
        color: config.color,
        backgroundColor: `${config.color}12`,
        border: `1px solid ${config.color}30`,
      }}
    >
      <span>{config.stars}</span>
      <span className="hidden sm:inline">{config.label}</span>
      <span className="sm:hidden">P{p}</span>
    </div>
  );
}

function StockDetail({ selected }) {
  return (
    <Card padding="p-0" className="overflow-hidden">
      <div className="p-5 sm:p-8" style={{ backgroundColor: COLORS.navy, color: COLORS.paper }}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:mb-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-normal font-serif">{selected.nom}</h2>
            <div className="flex items-center gap-3 mt-2 text-sm" style={{ color: COLORS.sandLight }}>
              <span className="tabular-nums">{selected.ticker}</span>
              <span>·</span>
              <span>{selected.pays}</span>
              <span>·</span>
              <span>{selected.secteur}</span>
            </div>
          </div>
          <PrioriteBadge p={selected.priorite} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px p-0" style={{ backgroundColor: COLORS.border }}>
        {[
          { label: 'Cours', value: `${selected.cours} €` },
          { label: 'Rendement', value: `${selected.rendement}%`, color: COLORS.forest },
          { label: 'PER', value: selected.per },
          { label: 'Payout', value: `${selected.payout}%` },
        ].map((kpi) => (
          <div key={kpi.label} className="p-3 sm:p-4" style={{ backgroundColor: COLORS.creamDark }}>
            <div className="text-[10px] uppercase tracking-[0.15em]" style={{ color: COLORS.inkMid }}>
              {kpi.label}
            </div>
            <div className="text-lg sm:text-xl font-light tabular-nums mt-1 font-serif" style={{ color: kpi.color }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-5 sm:pb-6 border-b border-border">
          <Award className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" style={{ color: COLORS.sand }} />
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.15em]" style={{ color: COLORS.inkLight }}>
              Hausse consécutive du dividende
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl sm:text-4xl font-light tabular-nums font-serif" style={{ color: COLORS.ink }}>
                {selected.anneesHausse}
              </span>
              <span className="text-sm" style={{ color: COLORS.inkMid }}>années consécutives</span>
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-[10px] uppercase tracking-[0.15em]" style={{ color: COLORS.inkLight }}>
              Dividende 2025
            </div>
            <div className="text-xl sm:text-2xl font-light tabular-nums mt-1 font-serif" style={{ color: COLORS.ink }}>
              {selected.divAnnuel.toFixed(2)} €
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4" style={{ color: COLORS.navy }} />
            <h4 className="text-sm uppercase tracking-[0.15em] font-medium" style={{ color: COLORS.inkMid }}>
              Thèse d'investissement
            </h4>
          </div>
          <p className="text-sm" style={{ color: COLORS.ink, lineHeight: 1.7 }}>
            {selected.these}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4" style={{ color: COLORS.forest }} />
            <h4 className="text-sm uppercase tracking-[0.15em] font-medium" style={{ color: COLORS.inkMid }}>
              Catalyseurs 2026–2030
            </h4>
          </div>
          <ul className="space-y-2">
            {selected.catalyseurs.map((c, i) => (
              <li key={i} className="flex gap-3 text-sm" style={{ color: COLORS.ink, lineHeight: 1.6 }}>
                <CircleCheck className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: COLORS.forest }} />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <CircleAlert className="w-4 h-4" style={{ color: COLORS.rust }} />
            <h4 className="text-sm uppercase tracking-[0.15em] font-medium" style={{ color: COLORS.inkMid }}>
              Risques principaux
            </h4>
          </div>
          <ul className="space-y-2">
            {selected.risques.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm" style={{ color: COLORS.ink, lineHeight: 1.6 }}>
                <span style={{ color: COLORS.rust, flexShrink: 0 }}>◆</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 sm:p-5 border-l-4" style={{ borderColor: COLORS.sand, backgroundColor: COLORS.cream }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: COLORS.inkLight }}>
                Fourchette d'achat
              </div>
              <div className="text-lg sm:text-xl font-light tabular-nums mt-1 font-serif" style={{ color: COLORS.sandDark }}>
                {selected.fourchette[0]} — {selected.fourchette[1]} €
              </div>
              <div className="text-xs mt-1" style={{ color: COLORS.inkMid }}>
                Cours actuel {selected.cours} €{' '}
                {selected.cours >= selected.fourchette[0] && selected.cours <= selected.fourchette[1]
                  ? '— dans la fourchette ✓'
                  : selected.cours < selected.fourchette[0]
                    ? '— opportunité'
                    : '— attendre repli'}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.15em] font-medium" style={{ color: COLORS.inkLight }}>
                Rôle dans le portefeuille
              </div>
              <div className="text-sm mt-1 italic font-serif" style={{ color: COLORS.ink, lineHeight: 1.5 }}>
                {selected.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function StocksView() {
  const [selected, setSelected] = useState(stocks[0]);
  const [listOpen, setListOpen] = useState(false);

  return (
    <div className="space-y-8 sm:space-y-12">
      <SectionTitle
        number="IV"
        title="Poche actions dividendes"
        subtitle="Huit valeurs européennes sélectionnées sur leur moat, leur régularité de croissance du dividende, et leur rôle de diversification. Construction progressive sur 24 mois."
      />

      {/* Mobile: dropdown selector + detail card */}
      <div className="lg:hidden space-y-4">
        <button
          onClick={() => setListOpen(!listOpen)}
          className="w-full text-left p-4 border flex justify-between items-center"
          style={{ backgroundColor: COLORS.paper, borderColor: COLORS.border }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>{selected.nom}</span>
              <span className="text-[10px] tabular-nums" style={{ color: COLORS.inkLight }}>{selected.ticker}</span>
            </div>
            <div className="text-xs mt-0.5" style={{ color: COLORS.inkLight }}>
              {selected.pays} · {selected.secteur} · {selected.rendement}%
            </div>
          </div>
          <ChevronDown
            className="w-5 h-5 transition-transform flex-shrink-0"
            style={{ color: COLORS.inkLight, transform: listOpen ? 'rotate(180deg)' : 'rotate(0)' }}
          />
        </button>

        {listOpen && (
          <div className="border border-border divide-y divide-border" style={{ backgroundColor: COLORS.paper }}>
            {stocks.map((s) => {
              const isActive = selected.ticker === s.ticker;
              return (
                <button
                  key={s.ticker}
                  onClick={() => { setSelected(s); setListOpen(false); }}
                  className="w-full text-left p-3 flex justify-between items-center transition-colors"
                  style={{ backgroundColor: isActive ? `${COLORS.navy}10` : 'transparent' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5"
                          style={{ backgroundColor: i < s.moat ? COLORS.navy : COLORS.border }}
                        />
                      ))}
                    </div>
                    <div>
                      <span className="text-sm font-medium" style={{ color: COLORS.ink }}>{s.nom}</span>
                      <span className="text-[10px] ml-2" style={{ color: COLORS.inkLight }}>{s.ticker}</span>
                    </div>
                  </div>
                  <div className="text-sm tabular-nums font-serif" style={{ color: COLORS.forest }}>
                    {s.rendement}%
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <StockDetail selected={selected} />
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:grid grid-cols-12 gap-6">
        <div className="col-span-5 space-y-2">
          {stocks.map((s) => {
            const isActive = selected.ticker === s.ticker;
            return (
              <button
                key={s.ticker}
                onClick={() => setSelected(s)}
                className="w-full text-left p-4 border transition-all"
                style={{
                  backgroundColor: isActive ? COLORS.navy : COLORS.paper,
                  borderColor: isActive ? COLORS.navy : COLORS.border,
                  color: isActive ? COLORS.paper : COLORS.ink,
                }}
              >
                <div className="flex justify-between items-baseline">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-normal font-serif">{s.nom}</span>
                      <span
                        className="text-[10px] tabular-nums"
                        style={{ color: isActive ? COLORS.sandLight : COLORS.inkLight }}
                      >
                        {s.ticker}
                      </span>
                    </div>
                    <div className="text-xs mt-1" style={{ color: isActive ? COLORS.sandLight : COLORS.inkLight }}>
                      {s.pays} · {s.secteur}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-xl font-light tabular-nums font-serif"
                      style={{ color: isActive ? COLORS.sand : COLORS.forest }}
                    >
                      {s.rendement}%
                    </div>
                    <div className="text-[10px] mt-1" style={{ color: isActive ? COLORS.sandLight : COLORS.inkLight }}>
                      {s.anneesHausse} ans ↗
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-0.5"
                      style={{
                        backgroundColor:
                          i < s.moat
                            ? isActive ? COLORS.sand : COLORS.navy
                            : isActive ? '#ffffff20' : COLORS.border,
                      }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="col-span-7">
          <div className="sticky top-6">
            <StockDetail selected={selected} />
          </div>
        </div>
      </div>
    </div>
  );
}

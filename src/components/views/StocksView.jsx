import { useState } from 'react';
import { Award, BookOpen, Sparkles, CircleCheck, CircleAlert, ChevronDown, Filter } from 'lucide-react';
import { COLORS, colorWithAlpha } from '../../theme/colors';
import { stocks } from '../../data/stocks';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';
import Badge from '../ui/Badge';

const PHASE_CONFIG = {
  1: { label: 'PHASE 1 — À DÉMARRER', color: COLORS.navy },
  2: { label: 'PHASE 2+', color: COLORS.inkLight },
};

function PhaseBadge({ phase }) {
  const config = PHASE_CONFIG[phase] || PHASE_CONFIG[2];
  return (
    <Badge color={config.color}>
      {config.label}
    </Badge>
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
          <PhaseBadge phase={selected.phase} />
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
  const [showAll, setShowAll] = useState(false);
  const filteredStocks = showAll ? stocks : stocks.filter((s) => s.phase === 1);
  const [selected, setSelected] = useState(filteredStocks[0]);

  const handleFilterToggle = (all) => {
    setShowAll(all);
    const newList = all ? stocks : stocks.filter((s) => s.phase === 1);
    if (!newList.find((s) => s.ticker === selected.ticker)) {
      setSelected(newList[0]);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      <SectionTitle
        number="IV"
        title="Poche actions dividendes"
        subtitle="En phase 1, focus sur 2–3 lignes maximum. Les fiches détaillées des 8 valeurs restent disponibles pour la phase 2."
      />

      {/* Phase 1 notice */}
      <Card padding="p-4 sm:p-6" className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: COLORS.navy }} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5" style={{ color: COLORS.navy }} />
            <div>
              <div className="text-sm font-medium" style={{ color: COLORS.ink }}>
                Phase 1 — Focus sur 2 lignes prioritaires
              </div>
              <div className="text-xs mt-0.5" style={{ color: COLORS.inkMid }}>
                Sanofi et TotalEnergies en priorité. Les 6 autres valeurs sont réservées à la phase 2 (à partir de 20 000 €).
              </div>
            </div>
          </div>
          <div className="flex gap-1 p-1" style={{ backgroundColor: COLORS.cream }}>
            <button
              onClick={() => handleFilterToggle(false)}
              className="px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: !showAll ? COLORS.navy : 'transparent',
                color: !showAll ? COLORS.paper : COLORS.inkMid,
              }}
            >
              Phase 1 ({stocks.filter((s) => s.phase === 1).length})
            </button>
            <button
              onClick={() => handleFilterToggle(true)}
              className="px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: showAll ? COLORS.navy : 'transparent',
                color: showAll ? COLORS.paper : COLORS.inkMid,
              }}
            >
              Toutes ({stocks.length})
            </button>
          </div>
        </div>
      </Card>

      {/* Mobile: dropdown selector + detail card */}
      <div className="lg:hidden space-y-4">
        <button
          onClick={() => {}}
          className="w-full text-left p-4 border flex justify-between items-center"
          style={{ backgroundColor: COLORS.paper, borderColor: COLORS.border }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>{selected.nom}</span>
              <span className="text-[10px] tabular-nums" style={{ color: COLORS.inkLight }}>{selected.ticker}</span>
              <PhaseBadge phase={selected.phase} />
            </div>
            <div className="text-xs mt-0.5" style={{ color: COLORS.inkLight }}>
              {selected.pays} · {selected.secteur} · {selected.rendement}%
            </div>
          </div>
          <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.inkLight }} />
        </button>

        <div className="border border-border divide-y divide-border" style={{ backgroundColor: COLORS.paper }}>
          {filteredStocks.map((s) => {
            const isActive = selected.ticker === s.ticker;
            return (
              <button
                key={s.ticker}
                onClick={() => setSelected(s)}
                className="w-full text-left p-3 flex justify-between items-center transition-colors"
                style={{ backgroundColor: isActive ? colorWithAlpha(COLORS.navy, 0.06) : 'transparent' }}
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: COLORS.ink }}>{s.nom}</span>
                    <span className="text-[10px]" style={{ color: COLORS.inkLight }}>{s.ticker}</span>
                  </div>
                </div>
                <div className="text-sm tabular-nums font-serif" style={{ color: COLORS.forest }}>
                  {s.rendement}%
                </div>
              </button>
            );
          })}
        </div>

        <StockDetail selected={selected} />
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="hidden lg:grid grid-cols-12 gap-6">
        <div className="col-span-5 space-y-2">
          {filteredStocks.map((s) => {
            const isActive = selected.ticker === s.ticker;
            return (
              <button
                key={s.ticker}
                onClick={() => setSelected(s)}
                className="w-full text-left p-4 border transition-all"
                style={{
                  backgroundColor: isActive ? COLORS.navy : COLORS.paper,
                  borderColor: isActive ? COLORS.navy : s.phase === 2 ? colorWithAlpha(COLORS.border, 0.5) : COLORS.border,
                  color: isActive ? COLORS.paper : COLORS.ink,
                  opacity: s.phase === 2 && !isActive ? 0.7 : 1,
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
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: isActive ? COLORS.sandLight : COLORS.inkLight }}>
                        {s.pays} · {s.secteur}
                      </span>
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
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1 flex-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-0.5"
                        style={{
                          backgroundColor:
                            i < s.moat
                              ? isActive ? COLORS.sand : COLORS.navy
                              : isActive ? 'rgba(255,255,255,0.12)' : COLORS.border,
                        }}
                      />
                    ))}
                  </div>
                  {!isActive && (
                    <div className="ml-3">
                      <PhaseBadge phase={s.phase} />
                    </div>
                  )}
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

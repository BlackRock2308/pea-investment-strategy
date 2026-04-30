import { useState, useCallback } from 'react';
import { Target, Shield, Check, Zap } from 'lucide-react';
import { COLORS } from '../../theme/colors';
import { fmtEur } from '../../utils/formatters';
import { dcaSchedule } from '../../data/dca';
import Card from '../ui/Card';
import StatBlock from '../ui/StatBlock';
import SectionTitle from '../ui/SectionTitle';
import Badge from '../ui/Badge';

const STORAGE_KEY = 'pea_dca_done';

const TYPE_CONFIG = {
  'etf-us': { label: 'ETF S&P 500', color: COLORS.navyLight },
  'etf-eu': { label: 'ETF Europe', color: COLORS.sand },
  action: { label: 'Action individuelle', color: COLORS.plum },
  flex: { label: 'Flexible', color: COLORS.forest },
};

function loadDoneSet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveDoneSet(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

function DCACheckbox({ id, checked, onToggle }) {
  return (
    <button
      onClick={() => onToggle(id)}
      className="w-5 h-5 sm:w-[22px] sm:h-[22px] flex-shrink-0 flex items-center justify-center border-2 transition-all"
      style={{
        borderColor: checked ? COLORS.forest : COLORS.border,
        backgroundColor: checked ? COLORS.forest : 'transparent',
      }}
      aria-label={checked ? 'Marquer comme non réalisé' : 'Marquer comme réalisé'}
    >
      {checked && <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" strokeWidth={3} />}
    </button>
  );
}

export default function DCAView() {
  const [doneSet, setDoneSet] = useState(loadDoneSet);

  const toggleDone = useCallback((id) => {
    setDoneSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveDoneSet(next);
      return next;
    });
  }, []);

  const totalAnnuel = dcaSchedule.reduce((s, m) => s + m.montant, 0);
  const partESE = dcaSchedule.filter((m) => m.type === 'etf-us').reduce((s, m) => s + m.montant, 0);
  const partStoxx = dcaSchedule.filter((m) => m.type === 'etf-eu').reduce((s, m) => s + m.montant, 0);
  const partActions = dcaSchedule.filter((m) => m.type === 'action').reduce((s, m) => s + m.montant, 0);
  const doneCount = dcaSchedule.filter((m) => doneSet.has(m.id)).length;

  function getTypeConfig(type) {
    return TYPE_CONFIG[type] || TYPE_CONFIG.flex;
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      <SectionTitle
        number="III"
        title="Plan DCA opérationnel"
        subtitle="Calendrier des 12 prochains mois — 300 €/mois. ESE redevient un destinataire légitime du DCA : le S&P 500 est le cœur assumé du portefeuille."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: COLORS.border }}>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock label="Total sur 12 mois" value={fmtEur(totalAnnuel)} sub="3 600 € prévus" accent={COLORS.ink} large />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock
            label="Dont ESE (S&P 500)"
            value={fmtEur(partESE)}
            sub={`${Math.round((partESE / totalAnnuel) * 100)} % — cœur`}
            accent={COLORS.navyLight}
            large
          />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock
            label="Dont Stoxx 600"
            value={fmtEur(partStoxx)}
            sub={`${Math.round((partStoxx / totalAnnuel) * 100)} % — ancrage EUR`}
            accent={COLORS.sand}
            large
          />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock label="Dont actions" value={fmtEur(partActions)} sub="2 positions phase 1" accent={COLORS.plum} large />
        </div>
      </div>

      <Card padding="p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-normal font-serif" style={{ color: COLORS.ink }}>
            Séquence mensuelle
          </h3>
          <div className="text-xs tabular-nums" style={{ color: doneCount > 0 ? COLORS.forest : COLORS.inkLight }}>
            {doneCount}/{dcaSchedule.length} réalisé{doneCount > 1 ? 's' : ''}
          </div>
        </div>

        {/* Desktop timeline */}
        <div className="hidden md:block space-y-1">
          {dcaSchedule.map((m, i) => {
            const done = doneSet.has(m.id);
            const cfg = getTypeConfig(m.type);
            return (
              <div
                key={m.id}
                className="grid grid-cols-12 gap-4 items-center py-3 px-4 border-l-4 hover:bg-cream transition-colors"
                style={{
                  borderColor: done ? COLORS.forest : cfg.color,
                  backgroundColor: i % 2 === 0 ? COLORS.paper : '#FDFBF7',
                  opacity: done ? 0.6 : 1,
                }}
              >
                <div className="col-span-1 flex items-center gap-3">
                  <DCACheckbox id={m.id} checked={done} onToggle={toggleDone} />
                  <div>
                    <div className="text-xs uppercase tracking-[0.15em] font-medium" style={{ color: COLORS.inkLight }}>
                      {m.mois}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: COLORS.inkMid }}>
                      {m.label}
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  <div
                    className="font-medium font-serif"
                    style={{ color: COLORS.ink, textDecoration: done ? 'line-through' : 'none' }}
                  >
                    {m.action}
                  </div>
                  <Badge color={cfg.color}>
                    {cfg.label}
                  </Badge>
                </div>
                <div className="col-span-3 text-sm" style={{ color: COLORS.inkMid }}>
                  {m.qte}
                </div>
                <div className="col-span-2 text-right">
                  <div className="text-xl font-light tabular-nums font-serif" style={{ color: COLORS.ink }}>
                    {fmtEur(m.montant)}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="h-1 relative" style={{ backgroundColor: COLORS.border }}>
                    <div
                      className="absolute left-0 top-0 h-full"
                      style={{
                        width: `${(m.montant / 400) * 100}%`,
                        backgroundColor: done ? COLORS.forest : cfg.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden space-y-3">
          {dcaSchedule.map((m, i) => {
            const done = doneSet.has(m.id);
            const cfg = getTypeConfig(m.type);
            return (
              <div
                key={m.id}
                className="border-l-4 p-3 rounded-r"
                style={{
                  borderColor: done ? COLORS.forest : cfg.color,
                  backgroundColor: i % 2 === 0 ? COLORS.paper : '#FDFBF7',
                  opacity: done ? 0.6 : 1,
                }}
              >
                <div className="flex items-start gap-3 mb-2">
                  <DCACheckbox id={m.id} checked={done} onToggle={toggleDone} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <div
                          className="font-medium font-serif"
                          style={{ color: COLORS.ink, textDecoration: done ? 'line-through' : 'none' }}
                        >
                          {m.action}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: COLORS.inkMid }}>
                          {m.label} · {m.qte}
                        </div>
                      </div>
                      <div className="text-lg font-light tabular-nums font-serif flex-shrink-0 ml-3" style={{ color: COLORS.ink }}>
                        {fmtEur(m.montant)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-8">
                  <Badge color={cfg.color}>
                    {cfg.label}
                  </Badge>
                  <div className="flex-1 h-1 relative" style={{ backgroundColor: COLORS.border }}>
                    <div
                      className="absolute left-0 top-0 h-full"
                      style={{
                        width: `${(m.montant / 400) * 100}%`,
                        backgroundColor: done ? COLORS.forest : cfg.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <Card padding="p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5" style={{ color: COLORS.sand }} />
            <h3 className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
              Règles de priorisation — Phase 1
            </h3>
          </div>
          <ol className="space-y-3 text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.6 }}>
            {[
              'Maximiser le volume investi — chaque mois compte plus que la précision allocative.',
              'Le S&P 500 (ESE) est le cœur : il reçoit le DCA par défaut en l\'absence d\'écart majeur.',
              'Actions individuelles : 2–3 lignes maximum (Sanofi + TotalEnergies en priorité).',
              'Rééquilibrage actif uniquement à partir de 20 000 € — en attendant, laisser faire le DCA.',
            ].map((t, i) => (
              <li key={i} className="flex gap-3">
                <span className="tabular-nums font-medium flex-shrink-0" style={{ color: COLORS.sand }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card padding="p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5" style={{ color: COLORS.forest }} />
            <h3 className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
              Mois flexibles
            </h3>
          </div>
          <div className="space-y-3 text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.6 }}>
            <p>
              Les mois M11 et M12 sont marqués <strong style={{ color: COLORS.forest }}>flexibles</strong>.
              Décision en fonction de :
            </p>
            <ol className="space-y-2 ml-4">
              {[
                'L\'écart le plus important aux fourchettes cibles (52/22/13/13 %).',
                'Opportunité de marché : drawdown > −15 % sur une poche = renforcement.',
                'Amorcer une 3e action individuelle si Sanofi et TotalEnergies sont déjà en portefeuille.',
              ].map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="tabular-nums font-medium flex-shrink-0" style={{ color: COLORS.forest }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}

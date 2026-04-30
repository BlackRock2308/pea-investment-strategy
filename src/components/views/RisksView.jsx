import { COLORS, colorWithAlpha } from '../../theme/colors';
import { risques } from '../../data/risks';
import { TOTAL_CURRENT } from '../../data/portfolio';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';
import Badge from '../ui/Badge';

const investmentRules = [
  { text: 'Maximiser le DCA mensuel — l\'allocation se précisera avec le volume.', active: true },
  { text: 'DCA automatique 300 €/mois, sans exception, quelle que soit la conjoncture.', active: true },
  { text: 'Pas de market timing : ne jamais suspendre le DCA sur anticipation de baisse.', active: true },
  { text: 'Renforts exceptionnels autorisés uniquement sur drawdowns > −20 %.', active: true },
  { text: 'Rééquilibrage semestriel par flux entrants (jamais par vente).', active: false, note: 'Actif à partir de 20 000 €' },
  { text: 'Maximum 5 % du PEA par action individuelle.', active: true },
  { text: "Zéro produit à effet de levier, pas d'options, pas de structurés.", active: true },
  { text: "Actions individuelles : 2–3 lignes max en phase 1 (Sanofi + TotalEnergies en priorité).", active: true },
];

const circuitBreakers = [
  {
    seuil: '−30 %',
    color: COLORS.rust,
    desc: "Drawdown marché : ne rien faire 7 jours. Relire l'IPS. Continuer le DCA.",
  },
  {
    seuil: '+25 %',
    color: COLORS.forest,
    desc: "Performance 12 mois : ne pas confondre chance et compétence. Pas d'augmentation d'apport.",
  },
  {
    seuil: '30 jours',
    color: COLORS.sand,
    desc: 'Tentation de vendre : délai obligatoire entre décision et exécution.',
  },
  {
    seuil: '1 fois/an',
    color: COLORS.plum,
    desc: 'Relecture complète de cet IPS — mise à jour si nécessaire.',
  },
];

const phases = [
  { label: 'Phase 1', titre: 'Capitalisation', range: '0 – 20k €', threshold: 20000, desc: "Alimenter la machine. Allocation grossière acceptable. Priorité au volume investi.", color: COLORS.navy },
  { label: 'Phase 2', titre: 'Structuration', range: '20k – 80k €', threshold: 80000, desc: 'Allocation précise 40/30/15/15. Optimisation fiscale. Rééquilibrage semestriel.', color: COLORS.sand },
  { label: 'Phase 3', titre: 'Optimisation', range: '80k €+', threshold: 150000, desc: 'Rééquilibrage fin, satellites, bascule partielle en distributifs.', color: COLORS.forest },
  { label: 'Phase 4', titre: 'Distribution', range: 'An 15+', threshold: null, desc: 'Revenu passif estimé 1 000 — 1 800 €/mois net de PS.', color: COLORS.plum },
];

export default function RisksView() {
  const currentPhaseIdx = TOTAL_CURRENT < 20000 ? 0 : TOTAL_CURRENT < 80000 ? 1 : 2;

  return (
    <div className="space-y-8 sm:space-y-12">
      <SectionTitle
        number="V"
        title="Risques & Investment Policy Statement"
        subtitle="Cartographie macro 2026–2027 et règles d'investissement personnalisées. L'IPS constitue la première défense contre tes propres biais comportementaux."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ backgroundColor: COLORS.border }}>
        {risques.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={i} className="p-4 sm:p-6" style={{ backgroundColor: COLORS.paper }}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: colorWithAlpha(r.color, 0.08) }}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: r.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
                    <h3 className="text-base sm:text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
                      {r.titre}
                    </h3>
                    <Badge color={r.color}>{r.niveau}</Badge>
                  </div>
                  <p className="text-xs sm:text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.6 }}>
                    {r.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Card padding="p-5 sm:p-10">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-1 h-8" style={{ backgroundColor: COLORS.sand }} />
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: COLORS.sand }}>
              Document contractuel personnel
            </div>
            <h3 className="text-xl sm:text-2xl font-normal font-serif" style={{ color: COLORS.ink }}>
              Investment Policy Statement
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <h4
              className="text-sm uppercase tracking-[0.15em] font-medium mb-4 pb-2 border-b border-border"
              style={{ color: COLORS.navy }}
            >
              Règles d'investissement
            </h4>
            <ol className="space-y-3 text-sm" style={{ color: COLORS.ink, lineHeight: 1.6 }}>
              {investmentRules.map((r, i) => (
                <li key={i} className="flex gap-3" style={{ opacity: r.active ? 1 : 0.5 }}>
                  <span className="tabular-nums font-medium flex-shrink-0" style={{ color: COLORS.sand }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <span>{r.text}</span>
                    {r.note && (
                      <span className="block text-[10px] uppercase tracking-wider mt-0.5 font-medium" style={{ color: COLORS.inkLight }}>
                        {r.note}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4
              className="text-sm uppercase tracking-[0.15em] font-medium mb-4 pb-2 border-b border-border"
              style={{ color: COLORS.navy }}
            >
              Circuit-breakers psychologiques
            </h4>
            <div className="space-y-3 sm:space-y-4">
              {circuitBreakers.map((b, i) => (
                <div key={i} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border-l-4" style={{ borderColor: b.color, backgroundColor: COLORS.cream }}>
                  <div className="text-xl sm:text-2xl font-light tabular-nums flex-shrink-0 font-serif" style={{ color: b.color }}>
                    {b.seuil}
                  </div>
                  <div className="text-xs sm:text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.5 }}>
                    {b.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
          <h4 className="text-sm uppercase tracking-[0.15em] font-medium mb-4 sm:mb-6" style={{ color: COLORS.navy }}>
            Phases du capital
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
            {phases.map((p, i) => {
              const isActive = i === currentPhaseIdx;
              return (
                <div
                  key={i}
                  className="relative p-4 sm:p-5 border-b lg:border-b-0 lg:border-r last:border-0 border-border"
                  style={{ backgroundColor: isActive ? colorWithAlpha(p.color, 0.04) : 'transparent' }}
                >
                  <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: p.color }} />
                  {isActive && (
                    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: p.color }} />
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: p.color }}>
                      {p.label}
                    </div>
                    {isActive && <Badge color={p.color}>Actuelle</Badge>}
                  </div>
                  <div className="text-lg sm:text-xl font-normal mb-1 font-serif" style={{ color: COLORS.ink }}>
                    {p.titre}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-medium mb-2" style={{ color: COLORS.inkLight }}>
                    {p.range}
                  </div>
                  <div className="text-xs" style={{ color: COLORS.inkMid, lineHeight: 1.5 }}>
                    {p.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

import { COLORS } from '../../theme/colors';
import { risques } from '../../data/risks';
import Card from '../ui/Card';
import SectionTitle from '../ui/SectionTitle';
import Badge from '../ui/Badge';

const investmentRules = [
  'DCA automatique 300 €/mois, sans exception, quelle que soit la conjoncture.',
  'Pas de market timing : ne jamais suspendre le DCA sur anticipation de baisse.',
  'Renforts exceptionnels autorisés uniquement sur drawdowns > −20 %.',
  'Rééquilibrage semestriel par flux entrants (jamais par vente).',
  'Maximum 5 % du PEA par action individuelle.',
  "Zéro produit à effet de levier, pas d'options, pas de structurés.",
  "Actions individuelles : n'acheter que dans la fourchette d'achat fiche.",
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
  { an: 'An 1—5', titre: 'Accumulation', desc: "Capitalisation pure. Aucun retrait (perte de l'avantage fiscal).", color: COLORS.navy },
  { an: 'An 5—12', titre: 'Capitalisation', desc: 'Zéro retrait. Effet composé maximal.', color: COLORS.navyLight },
  { an: 'An 12—15', titre: 'Transition', desc: 'Bascule ETF capitalisants → distributifs sur une partie.', color: COLORS.sand },
  { an: 'An 15—20+', titre: 'Distribution', desc: 'Revenu passif estimé 1 000 — 1 800 €/mois net de PS.', color: COLORS.forest },
];

export default function RisksView() {
  return (
    <div className="space-y-12">
      <SectionTitle
        number="V"
        title="Risques & Investment Policy Statement"
        subtitle="Cartographie macro 2026–2027 et règles d'investissement personnalisées. L'IPS constitue la première défense contre tes propres biais comportementaux."
      />

      <div className="grid grid-cols-2 gap-px" style={{ backgroundColor: COLORS.border }}>
        {risques.map((r, i) => {
          const Icon = r.icon;
          return (
            <div key={i} className="p-6" style={{ backgroundColor: COLORS.paper }}>
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${r.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: r.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h3 className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
                      {r.titre}
                    </h3>
                    <Badge color={r.color}>{r.niveau}</Badge>
                  </div>
                  <p className="text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.6 }}>
                    {r.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Card padding="p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8" style={{ backgroundColor: COLORS.sand }} />
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: COLORS.sand }}>
              Document contractuel personnel
            </div>
            <h3 className="text-2xl font-normal font-serif" style={{ color: COLORS.ink }}>
              Investment Policy Statement
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div>
            <h4
              className="text-sm uppercase tracking-[0.15em] font-medium mb-4 pb-2 border-b border-border"
              style={{ color: COLORS.navy }}
            >
              Règles d'investissement
            </h4>
            <ol className="space-y-3 text-sm" style={{ color: COLORS.ink, lineHeight: 1.6 }}>
              {investmentRules.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="tabular-nums font-medium flex-shrink-0" style={{ color: COLORS.sand }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{t}</span>
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
            <div className="space-y-4">
              {circuitBreakers.map((b, i) => (
                <div key={i} className="flex gap-4 p-4 border-l-4" style={{ borderColor: b.color, backgroundColor: COLORS.cream }}>
                  <div className="text-2xl font-light tabular-nums flex-shrink-0 font-serif" style={{ color: b.color }}>
                    {b.seuil}
                  </div>
                  <div className="text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.5 }}>
                    {b.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <h4 className="text-sm uppercase tracking-[0.15em] font-medium mb-6" style={{ color: COLORS.navy }}>
            Phases temporelles
          </h4>
          <div className="grid grid-cols-4 gap-0">
            {phases.map((p, i) => (
              <div key={i} className="relative p-5 border-r last:border-0 border-border">
                <div className="absolute top-0 left-0 w-full h-0.5" style={{ backgroundColor: p.color }} />
                <div className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: p.color }}>
                  {p.an}
                </div>
                <div className="text-xl font-normal mb-2 font-serif" style={{ color: COLORS.ink }}>
                  {p.titre}
                </div>
                <div className="text-xs" style={{ color: COLORS.inkMid, lineHeight: 1.5 }}>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

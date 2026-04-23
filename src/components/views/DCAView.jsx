import { Target, Shield } from 'lucide-react';
import { COLORS } from '../../theme/colors';
import { fmtEur } from '../../utils/formatters';
import { dcaSchedule } from '../../data/dca';
import Card from '../ui/Card';
import StatBlock from '../ui/StatBlock';
import SectionTitle from '../ui/SectionTitle';
import Badge from '../ui/Badge';

export default function DCAView() {
  const totalAnnuel = dcaSchedule.reduce((s, m) => s + m.montant, 0);
  const partActions = dcaSchedule.filter((m) => m.type === 'action').reduce((s, m) => s + m.montant, 0);
  const partETF = dcaSchedule.filter((m) => m.type === 'etf').reduce((s, m) => s + m.montant, 0);

  return (
    <div className="space-y-12">
      <SectionTitle
        number="III"
        title="Plan DCA opérationnel"
        subtitle="Calendrier des 12 prochains mois — 300 €/mois. Chaque achat est orienté pour corriger la sur-concentration US actuelle et construire progressivement la poche actions dividendes."
      />

      <div className="grid grid-cols-3 gap-px" style={{ backgroundColor: COLORS.border }}>
        <div style={{ backgroundColor: COLORS.paper }} className="p-6">
          <StatBlock label="Total sur 12 mois" value={fmtEur(totalAnnuel)} sub="3 600 € prévus" accent={COLORS.ink} large />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-6">
          <StatBlock
            label="Dont Stoxx 600"
            value={fmtEur(partETF)}
            sub={`${Math.round((partETF / totalAnnuel) * 100)} % — priorité n°1`}
            accent={COLORS.sand}
            large
          />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-6">
          <StatBlock label="Dont actions individuelles" value={fmtEur(partActions)} sub="5 positions ouvertes sur 12 mois" accent={COLORS.plum} large />
        </div>
      </div>

      <Card padding="p-8">
        <h3 className="text-xl font-normal mb-8 font-serif" style={{ color: COLORS.ink }}>
          Séquence mensuelle
        </h3>
        <div className="space-y-1">
          {dcaSchedule.map((m, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 items-center py-3 px-4 border-l-4 hover:bg-cream transition-colors"
              style={{
                borderColor: m.type === 'action' ? COLORS.plum : COLORS.sand,
                backgroundColor: i % 2 === 0 ? COLORS.paper : '#FDFBF7',
              }}
            >
              <div className="col-span-1">
                <div className="text-xs uppercase tracking-[0.15em] font-medium" style={{ color: COLORS.inkLight }}>
                  {m.mois}
                </div>
                <div className="text-xs mt-0.5" style={{ color: COLORS.inkMid }}>
                  {m.label}
                </div>
              </div>
              <div className="col-span-4">
                <div className="font-medium font-serif" style={{ color: COLORS.ink }}>
                  {m.action}
                </div>
                <Badge color={m.type === 'action' ? COLORS.plum : COLORS.sand}>
                  {m.type === 'action' ? 'Action individuelle' : 'ETF Europe'}
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
                      backgroundColor: m.type === 'action' ? COLORS.plum : COLORS.sand,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-8">
        <Card padding="p-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5" style={{ color: COLORS.sand }} />
            <h3 className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
              Règles de priorisation
            </h3>
          </div>
          <ol className="space-y-3 text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.6 }}>
            {[
              'Prioriser la poche la plus éloignée (en %) de sa cible, par le bas.',
              'Ne jamais renforcer une poche au-dessus de sa cible (ESE et PAEEM actuellement).',
              'Les actions individuelles s\'achètent une par une, tous les 2 à 3 mois.',
              'Aucune vente d\'existant : rééquilibrage par les flux entrants uniquement.',
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

        <Card padding="p-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5" style={{ color: COLORS.forest }} />
            <h3 className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
              Seuils de rééquilibrage
            </h3>
          </div>
          <ol className="space-y-3 text-sm" style={{ color: COLORS.inkMid, lineHeight: 1.6 }}>
            {[
              { label: '+10 pts', color: COLORS.forest, text: 'Stopper les achats sur cette poche, rediriger le DCA.' },
              { label: '+15 pts', color: COLORS.sand, text: 'Arbitrer partiellement (vente interne — zéro frottement fiscal en PEA).' },
              { label: '+3 %', color: COLORS.rust, text: 'Plafond par action individuelle — arrêter les renforts.' },
              { label: '6 mois', color: COLORS.plum, text: 'Fréquence de revue (fin juin + fin décembre).' },
            ].map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="tabular-nums font-medium flex-shrink-0" style={{ color: b.color }}>
                  {b.label}
                </span>
                <span>{b.text}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

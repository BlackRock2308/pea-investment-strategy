import { AlertTriangle, Activity, Layers, Shield, TrendingUp } from 'lucide-react';
import { COLORS } from '../theme/colors';

export const risques = [
  {
    titre: 'Valorisation USA extrême',
    icon: AlertTriangle,
    niveau: 'Élevé',
    color: COLORS.rust,
    desc: "CAPE S&P 500 à 39,5 vs médiane historique 16. Rendement futur implicite Shiller : 1,8 %/an sur 10 ans. Mitigation : ESE borné à 50–55 % en phase 1, 40 % à partir de la phase 2.",
  },
  {
    titre: 'USD vs EUR',
    icon: Activity,
    niveau: 'Moyen',
    color: COLORS.sand,
    desc: 'Affaiblissement USD en 2025–2026 érode les rendements en EUR. Mitigation : ~35 % du portefeuille en EUR pur (Stoxx 600 + actions individuelles).',
  },
  {
    titre: 'Récession US',
    icon: TrendingUp,
    niveau: 'Moyen',
    color: COLORS.sand,
    desc: 'Scénario à préparer : −30 à −40 % sur 18 mois. Plan : maintenir DCA, accélérer apports si budget le permet. Les creux créent les opportunités décennales.',
  },
  {
    titre: 'Concentration tech',
    icon: Layers,
    niveau: 'Moyen',
    color: COLORS.sand,
    desc: 'Mag7 = 35 % du S&P 500. En phase 1 avec 52 % ESE cible, cela représente ~18 % du PEA — acceptable. Ce poids se réduira naturellement en phase 2.',
  },
  {
    titre: 'Tensions commerciales',
    icon: Shield,
    niveau: 'Moyen',
    color: COLORS.sand,
    desc: "Volatilité tarifaire persistante. Marchés ont démontré leur résilience en 2025. Pas de décision stratégique — discipline DCA.",
  },
];

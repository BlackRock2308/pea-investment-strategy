import { COLORS } from '../theme/colors';

export const portfolioActual = [
  { name: 'ESE (S&P 500)', value: 2027.87, pct: 59.2, color: COLORS.navy },
  { name: 'PAEEM (EM)', value: 686.70, pct: 20.0, color: COLORS.sand },
  { name: 'Stoxx 600', value: 712.15, pct: 20.8, color: COLORS.forest },
];

export const portfolioTarget = [
  { name: 'Core USA (ESE)', value: 40, color: COLORS.navy, desc: 'Prime de risque marché US' },
  { name: 'Core Europe (Stoxx 600)', value: 30, color: COLORS.sand, desc: 'Ancrage EUR + valorisation' },
  { name: 'Satellite EM (PAEEM)', value: 15, color: COLORS.forest, desc: 'Diversification hors développés' },
  { name: 'Actions dividende Europe', value: 15, color: COLORS.plum, desc: 'Revenu passif croissant' },
];

export const TOTAL_CURRENT = 3426.72;
export const PV_CURRENT = 105.14;

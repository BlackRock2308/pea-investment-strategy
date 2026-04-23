import { COLORS } from '../theme/colors';

export const portfolioActual = [
  { name: 'ESE (S&P 500)', value: 2027.20, pct: 64.6, color: COLORS.navy },
  { name: 'PAEEM (EM)', value: 692.18, pct: 22.1, color: COLORS.sand },
  { name: 'Stoxx 600', value: 419.87, pct: 13.4, color: COLORS.forest },
];

export const portfolioTarget = [
  { name: 'Core USA (ESE)', value: 40, color: COLORS.navy, desc: 'Prime de risque marché US' },
  { name: 'Core Europe (Stoxx 600)', value: 30, color: COLORS.sand, desc: 'Ancrage EUR + valorisation' },
  { name: 'Satellite EM (PAEEM)', value: 15, color: COLORS.forest, desc: 'Diversification hors développés' },
  { name: 'Actions dividende Europe', value: 15, color: COLORS.plum, desc: 'Revenu passif croissant' },
];

export const TOTAL_CURRENT = 3139.25;
export const PV_CURRENT = 117.14;

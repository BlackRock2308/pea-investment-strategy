import { COLORS } from '../theme/colors';

export const ETF_HOLDINGS = [
  { id: 'sp500', isin: 'FR0011550185', ticker: 'ESE.PA', boursoCode: '1rTESE', label: 'BNP Easy S&P 500', shares: 0, targetPct: 52, color: COLORS.navy },
  { id: 'stoxx600', isin: 'FR0011550193', ticker: 'ETZ.PA', boursoCode: '1rTETZ', label: 'BNP Easy Stoxx 600', shares: 0, targetPct: 22, color: COLORS.sand },
  { id: 'emerging', isin: 'FR0013412020', ticker: 'PAEEM.PA', boursoCode: '1rTPAEEM', label: 'Amundi PEA Emerging', shares: 0, targetPct: 13, color: COLORS.forest },
];

export const portfolioActual = [
  { name: 'ESE (S&P 500)', value: 2034.08, pct: 59.3, color: COLORS.navy },
  { name: 'Stoxx 600', value: 708.04, pct: 20.6, color: COLORS.sand },
  { name: 'PAEEM (EM)', value: 689.36, pct: 20.1, color: COLORS.forest },
];

export const portfolioTarget = [
  { name: 'ESE (S&P 500)', value: 52, color: COLORS.navy, desc: 'Cœur assumé — prime de risque US' },
  { name: 'Stoxx 600', value: 22, color: COLORS.sand, desc: 'Ancrage EUR de bon sens' },
  { name: 'PAEEM (EM)', value: 13, color: COLORS.forest, desc: 'Diversification émergents' },
  { name: 'Actions dividendes', value: 13, color: COLORS.plum, desc: '2–3 lignes max en phase 1' },
];

export const TOTAL_CURRENT = 3431.48;
export const PV_CURRENT = 110.10;

export const PHASE_1_THRESHOLD = 20000;
export const PHASE_2_THRESHOLD = 80000;
export const PEA_CEILING = 150000;

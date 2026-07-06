import { COLORS } from '../theme/colors';

export const ETF_HOLDINGS = [
  { id: 'sp500',    isin: 'FR0011550185', ticker: 'ESE.PA',   boursoCode: '1rTESE',   label: 'BNP Easy S&P 500',    shares: 96, costBasis: 30.68, targetPct: 52, color: COLORS.chart1 },
  { id: 'stoxx600', isin: 'FR0011550193', ticker: 'ETZ.PA',   boursoCode: '1rTETZ',   label: 'BNP Easy Stoxx 600',  shares: 46, costBasis: 20.15, targetPct: 22, color: COLORS.chart2 },
  { id: 'emerging', isin: 'FR0013412020', ticker: 'PAEEM.PA', boursoCode: '1rTPAEEM', label: 'Amundi PEA Emerging', shares: 21, costBasis: 30.06, targetPct: 13, color: COLORS.chart3 },
];

export const portfolioTarget = [
  { name: 'ESE (S&P 500)',       value: 52, color: COLORS.chart1, desc: 'Cœur assumé — prime de risque US' },
  { name: 'Stoxx 600',           value: 22, color: COLORS.chart2, desc: 'Ancrage EUR de bon sens' },
  { name: 'PAEEM (EM)',          value: 13, color: COLORS.chart3, desc: 'Diversification émergents' },
  { name: 'Actions dividendes',  value: 13, color: COLORS.chart4, desc: '2–3 lignes max en phase 1' },
];

export const TOTAL_DEPOSITED_DEFAULT = 4520;

export const PHASE_1_THRESHOLD = 20000;
export const PHASE_2_THRESHOLD = 80000;
export const PEA_CEILING = 150000;

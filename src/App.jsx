import { useState, useEffect, useCallback } from 'react';
import {
  PieChart as PieIcon,
  Activity,
  Calendar,
  Briefcase,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { COLORS } from './theme/colors';
import { TOTAL_CURRENT, PHASE_1_THRESHOLD } from './data/portfolio';
import { fmtEur } from './utils/formatters';
import OverviewView from './components/views/OverviewView';
import SimulatorView from './components/views/SimulatorView';
import DCAView from './components/views/DCAView';
import StocksView from './components/views/StocksView';
import RisksView from './components/views/RisksView';

const TABS = [
  { id: 'overview', label: "Vue d'ensemble", shortLabel: 'Aperçu', icon: PieIcon },
  { id: 'simulator', label: 'Simulateur', shortLabel: 'Simul.', icon: Activity },
  { id: 'dca', label: 'Plan DCA', shortLabel: 'DCA', icon: Calendar },
  { id: 'stocks', label: 'Actions dividendes', shortLabel: 'Actions', icon: Briefcase },
  { id: 'risks', label: 'Risques & IPS', shortLabel: 'Risques', icon: Shield },
];

const VIEW_MAP = {
  overview: OverviewView,
  simulator: SimulatorView,
  dca: DCAView,
  stocks: StocksView,
  risks: RisksView,
};

function getInitialDark() {
  try {
    const stored = localStorage.getItem('pea_dark_mode');
    if (stored !== null) return stored === 'true';
  } catch {}
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export default function App() {
  const [tab, setTab] = useState('overview');
  const [dark, setDark] = useState(getInitialDark);
  const ActiveView = VIEW_MAP[tab];
  const phasePct = Math.min((TOTAL_CURRENT / PHASE_1_THRESHOLD) * 100, 100);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('pea_dark_mode', String(dark));
  }, [dark]);

  const toggleDark = useCallback(() => setDark((d) => !d), []);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: COLORS.cream, color: COLORS.ink }}>
      {/* Premium accent gradient */}
      <div className="h-0.5" style={{ background: 'linear-gradient(90deg, var(--color-navy), var(--color-sand), var(--color-forest))' }} />

      {/* Header */}
      <header className="border-b" style={{ backgroundColor: COLORS.paper, borderColor: COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="flex items-center gap-4 sm:gap-5">
              <img src="/omaad-pea.svg" alt="OMAAD PEA" className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex-shrink-0" />
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.3em] font-medium mb-1 sm:mb-2"
                  style={{ color: COLORS.sand }}
                >
                  Rapport stratégique — Avril 2026
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal font-serif" style={{ color: COLORS.ink }}>
                  Portefeuille PEA
                  <span className="block sm:inline text-lg sm:text-2xl sm:ml-3 italic" style={{ color: COLORS.inkLight }}>
                    stratégie long terme
                  </span>
                </h1>
                <div className="flex items-center gap-3 mt-1.5 sm:mt-2">
                  <span className="text-xs sm:text-sm" style={{ color: COLORS.inkMid }}>
                    Phase 1 · Capitalisation · {fmtEur(Math.round(TOTAL_CURRENT))} / {fmtEur(PHASE_1_THRESHOLD)}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-3">
                  <div className="h-1.5 flex-1 relative rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border, maxWidth: '12rem' }}>
                    <div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{ width: `${phasePct}%`, backgroundColor: COLORS.sand }}
                    />
                  </div>
                  <span className="text-[10px] tabular-nums font-medium" style={{ color: COLORS.sand }}>
                    {phasePct.toFixed(1)} %
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="hidden md:block text-right">
                <div className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: COLORS.inkLight }}>
                  Philosophie
                </div>
                <div className="text-sm mt-1 font-serif" style={{ color: COLORS.ink }}>
                  S&P 500 cœur assumé · DCA 300 €/mois
                </div>
              </div>
              <button
                onClick={toggleDark}
                className="w-9 h-9 flex items-center justify-center rounded-lg border"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
                aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                {dark
                  ? <Sun className="w-4 h-4" style={{ color: COLORS.sand }} />
                  : <Moon className="w-4 h-4" style={{ color: COLORS.inkLight }} />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Tabs — single responsive bar */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-10">
          <nav className="flex border-t overflow-x-auto scrollbar-hide" style={{ borderColor: COLORS.border }}>
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="relative flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 whitespace-nowrap"
                  style={{
                    color: active ? COLORS.ink : COLORS.inkLight,
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="sm:hidden">{t.shortLabel}</span>
                  <span className="hidden sm:inline">{t.label}</span>
                  {active && (
                    <div
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ backgroundColor: COLORS.sand, boxShadow: `0 1px 8px ${COLORS.sand}` }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-12">
        <div className="animate-fade-in">
          <ActiveView />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 sm:mt-20" style={{ backgroundColor: COLORS.paper, borderColor: COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-[10px] sm:text-xs" style={{ color: COLORS.inkLight, lineHeight: 1.6 }}>
            Ce document est un rapport d'analyse factuel et ne constitue pas un conseil en investissement
            personnalisé au sens AMF.
            <br />
            Les performances passées ne préjugent pas des performances futures.
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-medium flex-shrink-0" style={{ color: COLORS.sand }}>
            Version 3 · 30 avril 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

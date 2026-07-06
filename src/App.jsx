import { useState, useEffect, useCallback } from 'react';
import {
  PieChart as PieIcon,
  Activity,
  Calendar,
  Briefcase,
  Shield,
  Sun,
  Moon,
  Target,
  Radio,
} from 'lucide-react';
import { COLORS } from './theme/colors';
import { PHASE_1_THRESHOLD } from './data/portfolio';
import useTotalDeposited from './hooks/useTotalDeposited';
import OverviewView from './components/views/OverviewView';
import TrajectoireView from './components/views/TrajectoireView';
import SimulatorView from './components/views/SimulatorView';
import DCAView from './components/views/DCAView';
import StocksView from './components/views/StocksView';
import RisksView from './components/views/RisksView';
import PortfolioTrackerView from './components/views/PortfolioTrackerView';

const TABS = [
  { id: 'overview', label: "Vue d'ensemble", shortLabel: 'Aperçu', icon: PieIcon },
  { id: 'live', label: 'Portefeuille Live', shortLabel: 'Live', icon: Radio },
  { id: 'trajectoire', label: 'Trajectoire', shortLabel: 'Traj.', icon: Target },
  { id: 'simulator', label: 'Simulateur', shortLabel: 'Simul.', icon: Activity },
  { id: 'dca', label: 'Plan DCA', shortLabel: 'DCA', icon: Calendar },
  { id: 'stocks', label: 'Actions dividendes', shortLabel: 'Actions', icon: Briefcase },
  { id: 'risks', label: 'Risques & IPS', shortLabel: 'Risques', icon: Shield },
];

const VIEW_MAP = {
  overview: OverviewView,
  live: PortfolioTrackerView,
  trajectoire: TrajectoireView,
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
  // Light is the default; dark only if the user has explicitly opted in before.
  return false;
}

export default function App() {
  const [tab, setTab] = useState('overview');
  const [dark, setDark] = useState(getInitialDark);
  const { totalDeposited } = useTotalDeposited();
  const ActiveView = VIEW_MAP[tab];
  const phasePct = Math.min((totalDeposited / PHASE_1_THRESHOLD) * 100, 100);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('pea_dark_mode', String(dark));
  }, [dark]);

  const toggleDark = useCallback(() => setDark((d) => !d), []);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: COLORS.cream, color: COLORS.ink }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl border-b"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-cream) 82%, transparent)', borderColor: COLORS.border }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Brand row */}
          <div className="flex items-center justify-between gap-3 py-3 sm:py-4">
            <div className="flex items-center gap-3">
              <img src="/omaad-pea.svg" alt="Omaad" className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0" />
              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-extrabold tracking-tight" style={{ color: COLORS.ink }}>
                    Omaad
                  </span>
                  <span className="text-base sm:text-lg font-medium" style={{ color: COLORS.inkLight }}>
                    Portefeuille PEA
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] font-semibold mt-0.5" style={{ color: COLORS.sand }}>
                  Construis · Protège · Règne
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: COLORS.paper, boxShadow: 'var(--shadow-soft)', color: COLORS.inkMid }}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.forest }} />
                Phase 1
                <span style={{ color: COLORS.inkLight }}>·</span>
                <span className="tabular-nums" style={{ color: COLORS.ink }}>{phasePct.toFixed(1)}%</span>
              </div>
              <button
                onClick={toggleDark}
                className="w-9 h-9 flex items-center justify-center rounded-full border transition-colors"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.paper }}
                aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              >
                {dark
                  ? <Sun className="w-4 h-4" style={{ color: COLORS.sand }} />
                  : <Moon className="w-4 h-4" style={{ color: COLORS.inkLight }} />}
              </button>
            </div>
          </div>

          {/* Pill nav */}
          <div className="pb-3 sm:pb-4">
            <nav className="nav-track flex gap-1 overflow-x-auto scrollbar-hide">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    data-active={active}
                    className="nav-pill flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-[13px] font-semibold flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="sm:hidden">{t.shortLabel}</span>
                    <span className="hidden sm:inline">{t.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-7 sm:py-10 lg:py-12">
        <div key={tab} className="animate-fade-in">
          <ActiveView />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-14 sm:mt-20" style={{ borderColor: COLORS.border }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-7 sm:py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-[10px] sm:text-xs" style={{ color: COLORS.inkLight, lineHeight: 1.6 }}>
            Ce document est un rapport d'analyse factuel et ne constitue pas un conseil en investissement
            personnalisé au sens AMF.
            <br />
            Les performances passées ne préjugent pas des performances futures.
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold flex-shrink-0" style={{ color: COLORS.sand }}>
            Omaad Intelligence · v2026
          </div>
        </div>
      </footer>
    </div>
  );
}

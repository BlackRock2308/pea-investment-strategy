import { useState } from 'react';
import {
  PieChart as PieIcon,
  Activity,
  Calendar,
  Briefcase,
  Shield,
} from 'lucide-react';
import { COLORS } from './theme/colors';
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

export default function App() {
  const [tab, setTab] = useState('overview');
  const ActiveView = VIEW_MAP[tab];

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: COLORS.cream, color: COLORS.ink }}>
      {/* Header */}
      <header className="border-b border-border" style={{ backgroundColor: COLORS.paper }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
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
              <p className="text-xs sm:text-sm mt-1 sm:mt-2" style={{ color: COLORS.inkMid }}>
                Profil dynamique 29 ans · Horizon 15–20 ans · DCA 300 €/mois
              </p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: COLORS.inkLight }}>
                Architecture
              </div>
              <div className="text-sm mt-1 font-serif" style={{ color: COLORS.ink }}>
                4 poches · Zéro overlap ETF
              </div>
            </div>
          </div>
        </div>

        {/* Tabs — icons + short labels on mobile, full labels on desktop */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-10">
          <nav className="flex border-t border-border overflow-x-auto scrollbar-hide">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="relative flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm transition-colors flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 whitespace-nowrap"
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
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: COLORS.sand }}
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
        <ActiveView />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 sm:mt-20" style={{ backgroundColor: COLORS.paper }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-[10px] sm:text-xs" style={{ color: COLORS.inkLight, lineHeight: 1.6 }}>
            Ce document est un rapport d'analyse factuel et ne constitue pas un conseil en investissement
            personnalisé au sens AMF.
            <br />
            Les performances passées ne préjugent pas des performances futures.
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-medium flex-shrink-0" style={{ color: COLORS.sand }}>
            Version 2 · 23 avril 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

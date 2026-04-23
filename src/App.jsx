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
  { id: 'overview', label: "Vue d'ensemble", icon: PieIcon },
  { id: 'simulator', label: 'Simulateur', icon: Activity },
  { id: 'dca', label: 'Plan DCA', icon: Calendar },
  { id: 'stocks', label: 'Actions dividendes', icon: Briefcase },
  { id: 'risks', label: 'Risques & IPS', icon: Shield },
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
        <div className="max-w-7xl mx-auto px-10 py-6">
          <div className="flex items-end justify-between">
            <div>
              <div
                className="text-[10px] uppercase tracking-[0.3em] font-medium mb-2"
                style={{ color: COLORS.sand }}
              >
                Rapport stratégique — Avril 2026
              </div>
              <h1 className="text-4xl font-normal font-serif" style={{ color: COLORS.ink }}>
                Portefeuille PEA
                <span className="text-2xl ml-3 italic" style={{ color: COLORS.inkLight }}>
                  stratégie long terme
                </span>
              </h1>
              <p className="text-sm mt-2" style={{ color: COLORS.inkMid }}>
                Profil dynamique 29 ans · Horizon 15–20 ans · DCA 300 €/mois · Résident français
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: COLORS.inkLight }}>
                Architecture
              </div>
              <div className="text-sm mt-1 font-serif" style={{ color: COLORS.ink }}>
                4 poches · Zéro overlap ETF
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-10">
          <nav className="flex gap-0 border-t border-border">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="relative px-6 py-4 text-sm transition-colors flex items-center gap-2"
                  style={{
                    color: active ? COLORS.ink : COLORS.inkLight,
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
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
      <main className="max-w-7xl mx-auto px-10 py-12">
        <ActiveView />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20" style={{ backgroundColor: COLORS.paper }}>
        <div className="max-w-7xl mx-auto px-10 py-8 flex justify-between items-center">
          <div className="text-xs" style={{ color: COLORS.inkLight, lineHeight: 1.6 }}>
            Ce document est un rapport d'analyse factuel et ne constitue pas un conseil en investissement
            personnalisé au sens AMF.
            <br />
            Les performances passées ne préjugent pas des performances futures.
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: COLORS.sand }}>
            Version 2 · 23 avril 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

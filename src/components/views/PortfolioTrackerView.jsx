import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { RefreshCw, TrendingUp, TrendingDown, Clock, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { COLORS, colorWithAlpha } from '../../theme/colors';
import { fmtEur } from '../../utils/formatters';
import usePortfolio from '../../hooks/usePortfolio';
import Card from '../ui/Card';
import StatBlock from '../ui/StatBlock';
import SectionTitle from '../ui/SectionTitle';
import CustomTooltip from '../ui/CustomTooltip';

function formatTime(date) {
  if (!date) return '—';
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function PriceChange({ change, changePct }) {
  if (change == null) return <span style={{ color: COLORS.inkLight }}>—</span>;
  const positive = change >= 0;
  const color = positive ? COLORS.forest : COLORS.rust;
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span className="inline-flex items-center gap-1 tabular-nums" style={{ color }}>
      <Icon className="w-3 h-3" />
      {positive ? '+' : ''}{change.toFixed(2)} ({positive ? '+' : ''}{changePct.toFixed(2)}%)
    </span>
  );
}

function MarketStateIndicator({ state }) {
  const isOpen = state === 'REGULAR';
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium">
      {isOpen ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: COLORS.forest }} />
          <span style={{ color: COLORS.forest }}>Marché ouvert</span>
        </>
      ) : (
        <>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.inkLight }} />
          <span style={{ color: COLORS.inkLight }}>Marché fermé</span>
        </>
      )}
    </span>
  );
}

export default function PortfolioTrackerView() {
  const {
    holdings,
    totals,
    loading,
    error,
    lastUpdated,
    updateShares,
    setManualPrice,
    clearManualPrice,
    refreshPrices,
    prices,
  } = usePortfolio();
  const hasPrices = prices !== null && Object.keys(prices || {}).length > 0;
  const hasShares = holdings.some((h) => h.shares > 0);
  const hasAnyPrice = holdings.some((h) => h.price > 0);

  const allocationData = holdings
    .filter((h) => h.currentValue > 0)
    .map((h) => ({ name: h.label, value: h.currentValue, color: h.color }));

  const deviationData = holdings.map((h) => ({
    name: h.label.replace('BNP Easy ', '').replace('Amundi PEA ', ''),
    deviation: Number(h.deviationFromTarget?.toFixed(1)) || 0,
    color: h.color,
  }));

  const marketState = holdings[0]?.marketState;

  return (
    <div className="space-y-8 sm:space-y-12">
      <SectionTitle
        number="Live"
        title="Portefeuille en temps réel"
        subtitle="Suivi automatique de la valeur de vos ETF basé sur les cours Boursorama (rafraîchi toutes les 5 min). Entrez vos parts ; les cours sont remplaçables manuellement."
      />

      {/* Status bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-lg text-xs"
        style={{ backgroundColor: colorWithAlpha(COLORS.navy, 0.05), border: `1px solid ${COLORS.border}` }}
      >
        <div className="flex items-center gap-4">
          {hasPrices ? (
            <span className="flex items-center gap-1.5" style={{ color: COLORS.forest }}>
              <Wifi className="w-3.5 h-3.5" /> Connecté
            </span>
          ) : (
            <span className="flex items-center gap-1.5" style={{ color: COLORS.rust }}>
              <WifiOff className="w-3.5 h-3.5" /> Hors ligne
            </span>
          )}
          <MarketStateIndicator state={marketState} />
          {lastUpdated && (
            <span className="flex items-center gap-1 tabular-nums" style={{ color: COLORS.inkLight }}>
              <Clock className="w-3 h-3" /> {formatTime(lastUpdated)}
            </span>
          )}
        </div>
        <button
          onClick={refreshPrices}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-opacity"
          style={{ backgroundColor: COLORS.navy, color: COLORS.cream, opacity: loading ? 0.6 : 1 }}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
          style={{ backgroundColor: colorWithAlpha(COLORS.rust, 0.08), color: COLORS.rust }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: COLORS.border }}>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock
            label="Valeur du portefeuille"
            value={hasShares ? fmtEur(Math.round(totals.totalValue)) : '—'}
            large
            accent={COLORS.ink}
          />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock
            label="P&L du jour"
            value={hasShares ? `${totals.totalDailyPL >= 0 ? '+' : ''}${fmtEur(Math.round(totals.totalDailyPL))}` : '—'}
            sub={hasShares ? `${totals.totalDailyPLPct >= 0 ? '+' : ''}${totals.totalDailyPLPct.toFixed(2)} %` : null}
            accent={totals.totalDailyPL >= 0 ? COLORS.forest : COLORS.rust}
            large
          />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock label="ETFs suivis" value={String(holdings.length)} sub="UCITS capitalisants" large />
        </div>
        <div style={{ backgroundColor: COLORS.paper }} className="p-4 sm:p-6">
          <StatBlock
            label="Rafraîchissement"
            value="5 min"
            sub="Boursorama"
            accent={COLORS.sand}
            large
          />
        </div>
      </div>

      {/* Shares input + live prices table */}
      <Card padding="p-0">
        <div className="px-5 sm:px-8 pt-5 sm:pt-8 pb-4">
          <h3 className="text-lg sm:text-xl font-normal font-serif" style={{ color: COLORS.ink }}>
            Détail des positions
          </h3>
          <p className="text-xs mt-1" style={{ color: COLORS.inkLight }}>
            Entrez le nombre de parts pour chaque ETF. Les données sont sauvegardées localement.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: COLORS.cream }}>
                <th className="text-left px-5 sm:px-8 py-3 text-[10px] uppercase tracking-wider font-medium" style={{ color: COLORS.inkLight }}>ETF</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider font-medium" style={{ color: COLORS.inkLight }}>Cours (€)</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider font-medium" style={{ color: COLORS.inkLight }}>Variation</th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider font-medium" style={{ color: COLORS.inkLight }}>Parts</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider font-medium" style={{ color: COLORS.inkLight }}>Valeur</th>
                <th className="text-right px-4 py-3 text-[10px] uppercase tracking-wider font-medium" style={{ color: COLORS.inkLight }}>Poids</th>
                <th className="text-right px-5 sm:px-8 py-3 text-[10px] uppercase tracking-wider font-medium" style={{ color: COLORS.inkLight }}>Cible</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((etf, idx) => (
                <tr
                  key={etf.id}
                  className="border-t transition-colors"
                  style={{ borderColor: COLORS.border, backgroundColor: idx % 2 === 0 ? COLORS.paper : COLORS.rowAlt }}
                >
                  <td className="px-5 sm:px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: etf.color }} />
                      <div className="min-w-0">
                        <div className="font-medium truncate" style={{ color: COLORS.ink }}>{etf.label}</div>
                        <div className="text-[10px] mt-0.5 font-mono" style={{ color: COLORS.inkLight }}>{etf.isin}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right px-4 py-4 whitespace-nowrap" style={{ color: COLORS.ink }}>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={etf.manualPrice ?? ''}
                          onChange={(e) => setManualPrice(etf.id, e.target.value)}
                          placeholder={etf.livePrice ? etf.livePrice.toFixed(2) : '—'}
                          className="w-24 text-right py-1.5 px-2 rounded border text-sm tabular-nums font-medium"
                          style={{
                            borderColor: etf.isManual ? COLORS.sand : COLORS.border,
                            backgroundColor: COLORS.cream,
                            color: COLORS.ink,
                            outline: 'none',
                          }}
                          onFocus={(e) => { e.target.style.borderColor = COLORS.sand; }}
                          onBlur={(e) => { e.target.style.borderColor = etf.isManual ? COLORS.sand : COLORS.border; }}
                        />
                        <span className="tabular-nums font-medium" style={{ color: COLORS.inkLight }}>€</span>
                      </div>
                      <div className="text-[10px] flex items-center gap-2">
                        {etf.isManual ? (
                          <button
                            onClick={() => clearManualPrice(etf.id)}
                            className="uppercase tracking-wider underline"
                            style={{ color: COLORS.sand }}
                            title="Revenir au cours en direct"
                          >
                            Saisi · revenir au direct
                          </button>
                        ) : etf.livePrice ? (
                          <span style={{ color: COLORS.inkLight }}>
                            {etf.stale ? 'cache' : etf.cached ? 'live (cache)' : 'live'}
                          </span>
                        ) : (
                          <span style={{ color: COLORS.rust }}>aucun cours — saisir</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-right px-4 py-4 whitespace-nowrap">
                    <PriceChange change={etf.change} changePct={etf.changePct} />
                  </td>
                  <td className="text-center px-4 py-4">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={etf.shares || ''}
                      onChange={(e) => updateShares(etf.id, e.target.value)}
                      placeholder="0"
                      className="w-20 text-center py-1.5 px-2 rounded border text-sm tabular-nums font-medium"
                      style={{
                        borderColor: COLORS.border,
                        backgroundColor: COLORS.cream,
                        color: COLORS.ink,
                        outline: 'none',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = COLORS.sand; }}
                      onBlur={(e) => { e.target.style.borderColor = COLORS.border; }}
                    />
                  </td>
                  <td className="text-right px-4 py-4 tabular-nums font-medium whitespace-nowrap" style={{ color: COLORS.ink }}>
                    {etf.shares > 0 && etf.price ? fmtEur(Math.round(etf.currentValue)) : '—'}
                  </td>
                  <td className="text-right px-4 py-4 tabular-nums whitespace-nowrap" style={{ color: COLORS.inkMid }}>
                    {etf.weightPct > 0 ? `${etf.weightPct.toFixed(1)}%` : '—'}
                  </td>
                  <td className="text-right px-5 sm:px-8 py-4 tabular-nums whitespace-nowrap" style={{ color: COLORS.sand }}>
                    {etf.targetPct}%
                  </td>
                </tr>
              ))}
            </tbody>
            {hasShares && hasAnyPrice && (
              <tfoot>
                <tr className="border-t-2" style={{ borderColor: COLORS.ink, backgroundColor: COLORS.cream }}>
                  <td className="px-5 sm:px-8 py-4 font-medium font-serif" style={{ color: COLORS.ink }}>Total</td>
                  <td />
                  <td className="text-right px-4 py-4">
                    <PriceChange change={totals.totalDailyPL} changePct={totals.totalDailyPLPct} />
                  </td>
                  <td />
                  <td className="text-right px-4 py-4 tabular-nums font-medium text-base" style={{ color: COLORS.ink }}>
                    {fmtEur(Math.round(totals.totalValue))}
                  </td>
                  <td className="text-right px-4 py-4 tabular-nums font-medium" style={{ color: COLORS.ink }}>100%</td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {/* Allocation charts */}
      {hasShares && hasAnyPrice && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Actual allocation donut */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6" style={{ backgroundColor: COLORS.navy }} />
              <h3 className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
                Allocation actuelle
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={allocationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={2}
                  label={({ name, value }) => {
                    const total = allocationData.reduce((s, d) => s + d.value, 0);
                    return `${((value / total) * 100).toFixed(0)}%`;
                  }}
                  labelLine={false}
                >
                  {allocationData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {holdings.filter((h) => h.currentValue > 0).map((h) => (
                <div key={h.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0" style={{ borderColor: COLORS.border }}>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: h.color }} />
                    <span style={{ color: COLORS.inkMid }}>{h.label}</span>
                  </div>
                  <span className="tabular-nums font-medium ml-2" style={{ color: COLORS.ink }}>
                    {fmtEur(Math.round(h.currentValue))}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Deviation from target */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6" style={{ backgroundColor: COLORS.sand }} />
              <h3 className="text-lg font-normal font-serif" style={{ color: COLORS.ink }}>
                Écart vs. cible
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deviationData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`} style={{ fontSize: 11, fill: COLORS.inkLight }} />
                <YAxis type="category" dataKey="name" width={90} style={{ fontSize: 11, fill: COLORS.inkMid }} />
                <Tooltip
                  formatter={(value) => [`${value > 0 ? '+' : ''}${value}%`, 'Écart']}
                  contentStyle={{ backgroundColor: COLORS.paper, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="deviation" radius={[0, 4, 4, 0]}>
                  {deviationData.map((entry, i) => (
                    <Cell key={i} fill={entry.deviation >= 0 ? COLORS.forest : COLORS.rust} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {holdings.map((h) => (
                <div key={h.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0" style={{ borderColor: COLORS.border }}>
                  <span style={{ color: COLORS.inkMid }}>{h.label}</span>
                  <div className="flex items-center gap-3 tabular-nums text-xs">
                    <span style={{ color: COLORS.inkLight }}>{h.weightPct?.toFixed(1) || '0'}%</span>
                    <span style={{ color: COLORS.sand }}>→ {h.targetPct}%</span>
                    <span style={{ color: (h.deviationFromTarget || 0) >= 0 ? COLORS.forest : COLORS.rust }}>
                      {(h.deviationFromTarget || 0) >= 0 ? '+' : ''}{(h.deviationFromTarget || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {!hasShares && hasAnyPrice && (
        <Card padding="p-8 sm:p-12">
          <div className="text-center">
            <div className="text-4xl mb-4 opacity-30">📊</div>
            <h3 className="text-lg font-serif mb-2" style={{ color: COLORS.ink }}>Entrez vos parts</h3>
            <p className="text-sm max-w-md mx-auto" style={{ color: COLORS.inkMid }}>
              Renseignez le nombre de parts détenues dans le tableau ci-dessus pour voir la valeur de votre portefeuille et sa répartition.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

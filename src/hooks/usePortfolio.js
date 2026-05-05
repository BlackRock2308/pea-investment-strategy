import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ETF_HOLDINGS } from '../data/portfolio';
import { fetchQuotes, AUTO_REFRESH_INTERVAL } from '../services/etfPriceService';

const SHARES_KEY = 'pea_etf_holdings_v2';
const MANUAL_KEY = 'pea_etf_manual_prices_v2';
const COST_BASIS_KEY = 'pea_etf_cost_basis_v2';

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export default function usePortfolio() {
  const [holdings, setHoldings] = useState(() => loadJson(SHARES_KEY));
  const [manualPrices, setManualPrices] = useState(() => loadJson(MANUAL_KEY));
  const [costBasisOverrides, setCostBasisOverrides] = useState(() => loadJson(COST_BASIS_KEY));
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const tickers = useMemo(() => ETF_HOLDINGS.map((e) => e.ticker), []);

  const refreshPrices = useCallback(async () => {
    setLoading(true);
    const result = await fetchQuotes(tickers);
    setError(result.error || null);
    if (result.prices) setPrices(result.prices);
    if (result.fetchedAt) setLastUpdated(new Date(result.fetchedAt));
    setLoading(false);
  }, [tickers]);

  useEffect(() => {
    refreshPrices();
  }, [refreshPrices]);

  useEffect(() => {
    intervalRef.current = setInterval(refreshPrices, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [refreshPrices]);

  const updateShares = useCallback((etfId, count) => {
    setHoldings((prev) => {
      const next = { ...prev, [etfId]: Math.max(0, Number(count) || 0) };
      saveJson(SHARES_KEY, next);
      return next;
    });
  }, []);

  const setManualPrice = useCallback((etfId, price) => {
    setManualPrices((prev) => {
      const next = { ...prev };
      const num = Number(price);
      if (!price || !Number.isFinite(num) || num <= 0) {
        delete next[etfId];
      } else {
        next[etfId] = num;
      }
      saveJson(MANUAL_KEY, next);
      return next;
    });
  }, []);

  const clearManualPrice = useCallback((etfId) => {
    setManualPrices((prev) => {
      const next = { ...prev };
      delete next[etfId];
      saveJson(MANUAL_KEY, next);
      return next;
    });
  }, []);

  const setCostBasis = useCallback((etfId, value) => {
    setCostBasisOverrides((prev) => {
      const next = { ...prev };
      const num = Number(value);
      if (value === '' || value == null || !Number.isFinite(num) || num < 0) {
        delete next[etfId];
      } else {
        next[etfId] = num;
      }
      saveJson(COST_BASIS_KEY, next);
      return next;
    });
  }, []);

  const clearCostBasis = useCallback((etfId) => {
    setCostBasisOverrides((prev) => {
      const next = { ...prev };
      delete next[etfId];
      saveJson(COST_BASIS_KEY, next);
      return next;
    });
  }, []);

  const enrichedHoldings = useMemo(() => {
    const items = ETF_HOLDINGS.map((etf) => {
      const quote = prices?.[etf.ticker];
      const livePrice = quote?.price ?? 0;
      const previousClose = quote?.previousClose ?? 0;
      const manualPrice = manualPrices[etf.id];
      const isManual = manualPrice != null && manualPrice > 0;
      const price = isManual ? manualPrice : livePrice;
      const shares = holdings[etf.id] ?? etf.shares;
      const costBasis = costBasisOverrides[etf.id] ?? etf.costBasis ?? 0;
      const invested = shares * costBasis;
      const currentValue = shares * price;
      const unrealizedPL = costBasis > 0 ? currentValue - invested : 0;
      const unrealizedPLPct = invested > 0 ? (unrealizedPL / invested) * 100 : 0;

      const change = isManual
        ? (previousClose > 0 ? price - previousClose : 0)
        : (quote?.change ?? 0);
      const changePct = isManual
        ? (previousClose > 0 ? ((price - previousClose) / previousClose) * 100 : 0)
        : (quote?.changePct ?? 0);
      const dailyPL = shares * change;

      return {
        ...etf,
        shares,
        price,
        livePrice,
        manualPrice: isManual ? manualPrice : null,
        isManual,
        previousClose,
        change,
        changePct,
        currency: quote?.currency ?? 'EUR',
        marketState: quote?.marketState ?? 'CLOSED',
        shortName: quote?.shortName ?? etf.label,
        cached: !!quote?.cached,
        stale: !!quote?.stale,
        costBasis,
        invested,
        currentValue,
        dailyPL,
        unrealizedPL,
        unrealizedPLPct,
      };
    });

    const totalValue = items.reduce((sum, i) => sum + i.currentValue, 0);

    return items.map((item) => ({
      ...item,
      weightPct: totalValue > 0 ? (item.currentValue / totalValue) * 100 : 0,
      deviationFromTarget: totalValue > 0
        ? (item.currentValue / totalValue) * 100 - item.targetPct
        : 0,
    }));
  }, [prices, holdings, manualPrices, costBasisOverrides]);

  const totals = useMemo(() => {
    const totalValue = enrichedHoldings.reduce((s, i) => s + (i.currentValue || 0), 0);
    const totalInvested = enrichedHoldings.reduce((s, i) => s + (i.invested || 0), 0);
    const totalDailyPL = enrichedHoldings.reduce((s, i) => s + (i.dailyPL || 0), 0);
    const totalDailyPLPct = totalValue > 0 && totalValue - totalDailyPL > 0
      ? (totalDailyPL / (totalValue - totalDailyPL)) * 100
      : 0;
    const totalUnrealizedPL = totalInvested > 0 ? totalValue - totalInvested : 0;
    const totalUnrealizedPLPct = totalInvested > 0
      ? (totalUnrealizedPL / totalInvested) * 100
      : 0;

    return {
      totalValue,
      totalInvested,
      totalDailyPL,
      totalDailyPLPct,
      totalUnrealizedPL,
      totalUnrealizedPLPct,
    };
  }, [enrichedHoldings]);

  return {
    holdings: enrichedHoldings,
    totals,
    prices,
    loading,
    error,
    lastUpdated,
    updateShares,
    setManualPrice,
    clearManualPrice,
    setCostBasis,
    clearCostBasis,
    refreshPrices,
  };
}

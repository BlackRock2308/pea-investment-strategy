export const AUTO_REFRESH_INTERVAL = 5 * 60_000;

let lastKnownPrices = null;

export async function fetchQuotes(tickers) {
  const symbols = tickers.join(',');
  const url = `/.netlify/functions/etf-prices?symbols=${encodeURIComponent(symbols)}`;

  try {
    const res = await fetch(url);

    if (!res.ok && res.status !== 207) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const priceMap = {};
    let staleCount = 0;
    let errorCount = 0;

    for (const q of data.results) {
      if (q.error && !q.price) {
        errorCount += 1;
        continue;
      }
      if (q.stale) staleCount += 1;
      priceMap[q.ticker] = {
        price: q.price,
        previousClose: q.previousClose,
        change: q.change,
        changePct: q.changePct,
        currency: q.currency,
        marketState: q.marketState,
        shortName: q.shortName,
        marketTime: q.marketTime,
        cached: !!q.cached,
        stale: !!q.stale,
        ageSec: q.ageSec ?? 0,
      };
    }

    lastKnownPrices = priceMap;

    let warning = null;
    if (errorCount > 0 && Object.keys(priceMap).length === 0) {
      warning = 'Source de prix indisponible. Saisissez vos cours manuellement.';
    } else if (staleCount > 0) {
      warning = 'Cours en cache (source temporairement indisponible).';
    }

    return { prices: priceMap, fetchedAt: data.fetchedAt, error: warning };
  } catch (err) {
    return {
      prices: lastKnownPrices,
      fetchedAt: null,
      error: err.message || 'Erreur réseau',
    };
  }
}

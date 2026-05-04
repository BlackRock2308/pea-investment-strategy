import { getStore } from '@netlify/blobs';

const ETFS = {
  'ESE.PA':   { boursoCode: '1rTESE',   shortName: 'BNP Easy S&P 500' },
  'ETZ.PA':   { boursoCode: '1rTETZ',   shortName: 'BNP Easy Stoxx 600' },
  'PAEEM.PA': { boursoCode: '1rTPAEEM', shortName: 'Amundi PEA Emerging' },
};

const FRESH_TTL_MS = 5 * 60 * 1000;
const HARD_TTL_MS  = 24 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const memoryCache = new Map();

function parseFr(str) {
  if (!str) return NaN;
  return parseFloat(String(str).replace(/ |\s/g, '').replace(',', '.'));
}

function firstMatch(html, regex) {
  const m = html.match(regex);
  return m ? m[1] : null;
}

function isMarketOpen() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const obj = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const weekend = obj.weekday === 'Sat' || obj.weekday === 'Sun';
  const minutes = parseInt(obj.hour, 10) * 60 + parseInt(obj.minute, 10);
  const open = 9 * 60;
  const close = 17 * 60 + 30;
  return !weekend && minutes >= open && minutes < close;
}

async function fetchBoursorama(ticker) {
  const meta = ETFS[ticker];
  const url = `https://www.boursorama.com/cours/${meta.boursoCode}/`;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8' },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    const lastRaw     = firstMatch(html, /c-instrument c-instrument--last"[^>]*>([^<]+)</);
    const previousRaw = firstMatch(html, /c-instrument c-instrument--previousclose"[^>]*>([^<]+)</);
    const variationRaw = firstMatch(html, /c-instrument c-instrument--variation"[^>]*>([^<]+)</);

    const price = parseFr(lastRaw);
    const previousClose = parseFr(previousRaw);

    if (!Number.isFinite(price) || !Number.isFinite(previousClose) || previousClose <= 0) {
      throw new Error('Failed to parse price/previous from Boursorama HTML');
    }

    const change = price - previousClose;
    const changePct = variationRaw != null
      ? parseFr(variationRaw.replace('%', ''))
      : (change / previousClose) * 100;

    return {
      ticker,
      shortName: meta.shortName,
      price: Math.round(price * 10000) / 10000,
      previousClose: Math.round(previousClose * 10000) / 10000,
      change: Math.round(change * 10000) / 10000,
      changePct: Math.round(changePct * 10000) / 10000,
      currency: 'EUR',
      marketState: isMarketOpen() ? 'REGULAR' : 'CLOSED',
      marketTime: Math.floor(Date.now() / 1000),
    };
  } finally {
    clearTimeout(timer);
  }
}

function getBlobStore() {
  try {
    return getStore({ name: 'etf-prices', consistency: 'strong' });
  } catch {
    return null;
  }
}

async function readCache(store, ticker) {
  if (memoryCache.has(ticker)) return memoryCache.get(ticker);
  if (!store) return null;
  try {
    const obj = await store.get(ticker, { type: 'json' });
    if (obj) memoryCache.set(ticker, obj);
    return obj || null;
  } catch {
    return null;
  }
}

async function writeCache(store, ticker, payload) {
  memoryCache.set(ticker, payload);
  if (!store) return;
  try {
    await store.setJSON(ticker, payload);
  } catch {
    // best-effort cache; ignore
  }
}

export async function handler(event) {
  const symbols = event.queryStringParameters?.symbols;
  if (!symbols) {
    return jsonResponse(400, { error: 'Missing "symbols" query parameter' });
  }

  const tickers = symbols
    .split(',')
    .map((s) => s.trim())
    .filter((s) => ETFS[s]);

  if (tickers.length === 0) {
    return jsonResponse(400, { error: 'No valid tickers', allowed: Object.keys(ETFS) });
  }

  const store = getBlobStore();
  const now = Date.now();

  const results = await Promise.all(
    tickers.map(async (ticker) => {
      const cached = await readCache(store, ticker);
      const fresh = cached && now - cached.fetchedAtMs < FRESH_TTL_MS;

      if (fresh) {
        return { ...cached.data, cached: true, ageSec: Math.round((now - cached.fetchedAtMs) / 1000) };
      }

      try {
        const data = await fetchBoursorama(ticker);
        await writeCache(store, ticker, { data, fetchedAtMs: now });
        return data;
      } catch (err) {
        if (cached && now - cached.fetchedAtMs < HARD_TTL_MS) {
          return {
            ...cached.data,
            cached: true,
            stale: true,
            ageSec: Math.round((now - cached.fetchedAtMs) / 1000),
            sourceError: err.message,
          };
        }
        return { ticker, error: err.message };
      }
    })
  );

  const anyError = results.some((r) => r.error && !r.price);
  return jsonResponse(anyError ? 207 : 200, {
    results,
    fetchedAt: new Date().toISOString(),
    source: 'boursorama',
  });
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(body),
  };
}

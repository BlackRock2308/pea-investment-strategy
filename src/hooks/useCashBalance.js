import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'pea_cash_balance_v2';
const DEFAULT_CASH = 15.80;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw != null) {
      const n = Number(raw);
      if (Number.isFinite(n) && n >= 0) return n;
    }
  } catch {}
  return DEFAULT_CASH;
}

export default function useCashBalance() {
  const [cashBalance, setCash] = useState(load);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setCash(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setCashBalance = useCallback((value) => {
    const n = Number(value);
    const safe = Number.isFinite(n) && n >= 0 ? n : 0;
    setCash(safe);
    try {
      localStorage.setItem(STORAGE_KEY, String(safe));
    } catch {}
  }, []);

  return { cashBalance, setCashBalance };
}

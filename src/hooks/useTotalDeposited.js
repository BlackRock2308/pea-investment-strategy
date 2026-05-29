import { useCallback, useEffect, useState } from 'react';
import { TOTAL_DEPOSITED_DEFAULT } from '../data/portfolio';

const STORAGE_KEY = 'pea_versements_v2';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw != null) {
      const n = Number(raw);
      if (Number.isFinite(n) && n >= 0) return n;
    }
  } catch {}
  return TOTAL_DEPOSITED_DEFAULT;
}

export default function useTotalDeposited() {
  const [totalDeposited, setTotal] = useState(load);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setTotal(load());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setTotalDeposited = useCallback((value) => {
    const n = Number(value);
    const safe = Number.isFinite(n) && n >= 0 ? n : 0;
    setTotal(safe);
    try {
      localStorage.setItem(STORAGE_KEY, String(safe));
    } catch {}
  }, []);

  return { totalDeposited, setTotalDeposited };
}

'use client';

import { useSettings } from './settings';

/** busca a cotação JPY→BRL e guarda no settings store (cache p/ offline) */
export async function refreshRate(): Promise<void> {
  const s = useSettings.getState();
  // no máximo a cada 6h
  if (s.cachedRate && Date.now() - s.cachedRate.fetchedAt < 6 * 60 * 60 * 1000) {
    return;
  }
  try {
    const res = await fetch('/api/rate');
    if (!res.ok) return;
    const data = (await res.json()) as { rate: number; date: string };
    if (data.rate > 0) {
      s.setCachedRate({ rate: data.rate, date: data.date, fetchedAt: Date.now() });
    }
  } catch {
    // offline — mantém o cache
  }
}

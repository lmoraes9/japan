'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'auto' | 'light' | 'dark';

interface SettingsState {
  tripCode: string;
  who: 'L' | 'P';
  /** orçamento de compras em ienes (null = sem orçamento) */
  budgetJpy: number | null;
  /** cotação manual JPY→BRL (por ¥1); null = usar a automática */
  rateOverride: number | null;
  cachedRate: { rate: number; date: string; fetchedAt: number } | null;
  theme: Theme;
  installHintDismissed: boolean;
  setTripCode: (code: string) => void;
  setWho: (who: 'L' | 'P') => void;
  setBudgetJpy: (v: number | null) => void;
  setRateOverride: (v: number | null) => void;
  setCachedRate: (r: { rate: number; date: string; fetchedAt: number }) => void;
  setTheme: (t: Theme) => void;
  dismissInstallHint: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      tripCode: 'japao2026',
      who: 'L',
      budgetJpy: null,
      rateOverride: null,
      cachedRate: null,
      theme: 'auto',
      installHintDismissed: false,
      setTripCode: (tripCode) => set({ tripCode: tripCode.trim().toLowerCase() }),
      setWho: (who) => set({ who }),
      setBudgetJpy: (budgetJpy) => set({ budgetJpy }),
      setRateOverride: (rateOverride) => set({ rateOverride }),
      setCachedRate: (cachedRate) => set({ cachedRate }),
      setTheme: (theme) => set({ theme }),
      dismissInstallHint: () => set({ installHintDismissed: true }),
    }),
    { name: 'japao2026:settings' },
  ),
);

/** cotação efetiva JPY→BRL por ¥1 (override > cache > fallback aproximado) */
export function effectiveRate(s: {
  rateOverride: number | null;
  cachedRate: { rate: number } | null;
}): { rate: number; source: 'manual' | 'api' | 'fallback' } {
  if (s.rateOverride) return { rate: s.rateOverride, source: 'manual' };
  if (s.cachedRate) return { rate: s.cachedRate.rate, source: 'api' };
  return { rate: 0.036, source: 'fallback' };
}

export function jpyToBrl(
  amountJpy: number,
  s: { rateOverride: number | null; cachedRate: { rate: number } | null },
): number {
  return amountJpy * effectiveRate(s).rate;
}

export const fmtJpy = (v: number) =>
  '¥' + Math.round(v).toLocaleString('pt-BR');

export const fmtBrl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

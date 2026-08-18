'use client';

import { useEffect } from 'react';
import { startSync } from '@/lib/sync';
import { refreshRate } from '@/lib/rate';
import { useSettings } from '@/lib/settings';

/** Inicialização client-side: sync, cotação, tema, service worker */
export function AppInit() {
  const theme = useSettings((s) => s.theme);

  useEffect(() => {
    startSync();
    void refreshRate();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'auto' && mq.matches);
      root.classList.toggle('dark', dark);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);

  return null;
}

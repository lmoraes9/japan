'use client';

import { useSyncStore, onMutation } from './store';
import { useSettings } from './settings';
import type { SyncedState } from '@/data/types';

let flushTimer: ReturnType<typeof setTimeout> | null = null;
let intervalTimer: ReturnType<typeof setInterval> | null = null;
let started = false;

export async function flush(): Promise<void> {
  const store = useSyncStore.getState();
  const { tripCode } = useSettings.getState();
  if (store.syncing) return;
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    store.setOnline(false);
    return;
  }

  useSyncStore.getState().setSyncing(true);
  try {
    const pending = useSyncStore.getState().pending;
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trip: tripCode, mutations: pending }),
    });
    if (!res.ok) throw new Error(`sync ${res.status}`);
    const data = (await res.json()) as { state: SyncedState };
    const st = useSyncStore.getState();
    st.markFlushed(pending.length, Date.now());
    st.mergeServer(data.state);
    st.setOnline(true);
  } catch {
    useSyncStore.getState().setOnline(false);
  } finally {
    useSyncStore.getState().setSyncing(false);
  }
}

function scheduleFlush(delayMs = 2000) {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, delayMs);
}

/** liga os gatilhos de sincronização — chamar uma vez no client root */
export function startSync() {
  if (started || typeof window === 'undefined') return;
  started = true;

  onMutation(() => scheduleFlush(2000));

  window.addEventListener('online', () => {
    useSyncStore.getState().setOnline(true);
    scheduleFlush(300);
  });
  window.addEventListener('offline', () =>
    useSyncStore.getState().setOnline(false),
  );
  window.addEventListener('focus', () => scheduleFlush(300));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') scheduleFlush(300);
  });

  intervalTimer = setInterval(() => {
    if (document.visibilityState === 'visible') void flush();
  }, 60_000);

  // primeira sincronização
  scheduleFlush(500);
}

export function stopSync() {
  if (intervalTimer) clearInterval(intervalTimer);
  started = false;
}

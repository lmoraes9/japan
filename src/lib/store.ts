'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Expense, Reserva, SyncedState } from '@/data/types';
import { emptySyncedState } from '@/data/types';

export interface Mutation {
  /** 'checklist.<id>' | 'favorites.<stopId>' | 'notes.<key>' | 'expenses.<id>' */
  path: string;
  value: unknown;
  updatedAt: number;
}

interface SyncStore {
  state: SyncedState;
  pending: Mutation[];
  lastSyncAt: number | null;
  syncing: boolean;
  online: boolean;

  toggleChecklist: (id: string) => void;
  toggleFavorite: (stopId: string) => void;
  setNote: (key: string, text: string, who?: string) => void;
  upsertExpense: (e: Expense) => void;
  removeExpense: (id: string) => void;
  upsertReserva: (r: Reserva) => void;
  removeReserva: (id: string) => void;
  setDoc: (key: string, text: string) => void;

  /** aplica doc vindo do servidor com LWW; preserva locais mais novos */
  mergeServer: (server: SyncedState) => void;
  markFlushed: (count: number, at: number) => void;
  setSyncing: (v: boolean) => void;
  setOnline: (v: boolean) => void;
}

type Section = keyof SyncedState;

function mergeDoc(local: SyncedState, server: SyncedState): SyncedState {
  const out = emptySyncedState();
  local = { ...emptySyncedState(), ...local };
  server = { ...emptySyncedState(), ...server };
  (Object.keys(out) as Section[]).forEach((section) => {
    const keys = new Set([
      ...Object.keys(local[section] ?? {}),
      ...Object.keys(server[section] ?? {}),
    ]);
    keys.forEach((k) => {
      const l = (local[section] as Record<string, { updatedAt: number }>)[k];
      const s = (server[section] as Record<string, { updatedAt: number }>)[k];
      const winner = !l ? s : !s ? l : l.updatedAt >= s.updatedAt ? l : s;
      if (winner) {
        (out[section] as Record<string, unknown>)[k] = winner;
      }
    });
  });
  return out;
}

let mutationListeners: (() => void)[] = [];
/** chamado pelo sync.ts para agendar flush com debounce após cada mutação */
export function onMutation(fn: () => void) {
  mutationListeners.push(fn);
  return () => {
    mutationListeners = mutationListeners.filter((f) => f !== fn);
  };
}
const notifyMutation = () => mutationListeners.forEach((f) => f());

export const useSyncStore = create<SyncStore>()(
  persist(
    (set, get) => {
      const push = (path: string, value: unknown) => {
        const updatedAt = Date.now();
        set((st) => ({ pending: [...st.pending, { path, value, updatedAt }] }));
        notifyMutation();
        return updatedAt;
      };

      return {
        state: emptySyncedState(),
        pending: [],
        lastSyncAt: null,
        syncing: false,
        online: true,

        toggleChecklist: (id) => {
          const cur = get().state.checklist[id]?.checked ?? false;
          const value = { checked: !cur, updatedAt: 0 };
          value.updatedAt = push(`checklist.${id}`, value);
          set((st) => ({
            state: {
              ...st.state,
              checklist: { ...st.state.checklist, [id]: value },
            },
          }));
        },

        toggleFavorite: (stopId) => {
          const cur = get().state.favorites[stopId]?.fav ?? false;
          const value = { fav: !cur, updatedAt: 0 };
          value.updatedAt = push(`favorites.${stopId}`, value);
          set((st) => ({
            state: {
              ...st.state,
              favorites: { ...st.state.favorites, [stopId]: value },
            },
          }));
        },

        setNote: (key, text, who) => {
          const value = { text, who, updatedAt: 0 };
          value.updatedAt = push(`notes.${key}`, value);
          set((st) => ({
            state: { ...st.state, notes: { ...st.state.notes, [key]: value } },
          }));
        },

        upsertExpense: (e) => {
          const value = { ...e, updatedAt: 0 };
          value.updatedAt = push(`expenses.${e.id}`, value);
          set((st) => ({
            state: {
              ...st.state,
              expenses: { ...st.state.expenses, [e.id]: value },
            },
          }));
        },

        removeExpense: (id) => {
          const cur = get().state.expenses[id];
          if (!cur) return;
          const value = { ...cur, deleted: true, updatedAt: 0 };
          value.updatedAt = push(`expenses.${id}`, value);
          set((st) => ({
            state: {
              ...st.state,
              expenses: { ...st.state.expenses, [id]: value },
            },
          }));
        },

        upsertReserva: (r) => {
          const value = { ...r, updatedAt: 0 };
          value.updatedAt = push(`reservas.${r.id}`, value);
          set((st) => ({
            state: { ...st.state, reservas: { ...st.state.reservas, [r.id]: value } },
          }));
        },

        removeReserva: (id) => {
          const cur = get().state.reservas[id];
          if (!cur) return;
          const value = { ...cur, deleted: true, updatedAt: 0 };
          value.updatedAt = push(`reservas.${id}`, value);
          set((st) => ({
            state: { ...st.state, reservas: { ...st.state.reservas, [id]: value } },
          }));
        },

        setDoc: (key, text) => {
          const value = { text, updatedAt: 0 };
          value.updatedAt = push(`docs.${key}`, value);
          set((st) => ({
            state: { ...st.state, docs: { ...st.state.docs, [key]: value } },
          }));
        },

        mergeServer: (server) =>
          set((st) => ({ state: mergeDoc(st.state, server) })),

        markFlushed: (count, at) =>
          set((st) => ({ pending: st.pending.slice(count), lastSyncAt: at })),

        setSyncing: (syncing) => set({ syncing }),
        setOnline: (online) => set({ online }),
      };
    },
    {
      name: 'japao2026:synced',
      // estado gravado por versões antigas do app não tem as seções novas
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<SyncStore>;
        return { ...current, ...p, state: { ...emptySyncedState(), ...(p.state ?? {}) } };
      },
      partialize: (st) => ({
        state: st.state,
        pending: st.pending,
        lastSyncAt: st.lastSyncAt,
      }),
    },
  ),
);

export function activeExpenses(state: SyncedState): Expense[] {
  return Object.values(state.expenses)
    .filter((e) => !e.deleted)
    .sort((a, b) => (a.date === b.date ? b.updatedAt - a.updatedAt : a.date < b.date ? 1 : -1));
}

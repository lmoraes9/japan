'use client';

import { useMemo } from 'react';
import type { Reserva } from '@/data/types';
import { RESERVA_SEEDS } from '@/data/reservas';
import { CHECKLIST_DAS_RESERVAS } from '@/data/comoReservar';
import { useSyncStore } from './store';

/** modelos + edições sincronizadas = as reservas como estão hoje, em ordem de data */
export function useReservas(): Reserva[] {
  const synced = useSyncStore((s) => s.state.reservas);
  return useMemo(() => {
    const byId = new Map<string, Reserva>();
    for (const seed of RESERVA_SEEDS) byId.set(seed.id, { ...seed, updatedAt: 0 });
    for (const r of Object.values(synced ?? {})) {
      const base = byId.get(r.id);
      byId.set(r.id, { ...(base ?? {}), ...r } as Reserva);
    }
    return [...byId.values()]
      .filter((r) => !r.deleted)
      .sort((a, b) =>
        a.date === b.date ? (a.time ?? '').localeCompare(b.time ?? '') : a.date.localeCompare(b.date),
      );
  }, [synced]);
}

/** o hotel onde se dorme na noite de uma data ('2026-11-20' → hotel de Tóquio) */
export function hotelFor(reservas: Reserva[], date: string): Reserva | undefined {
  return reservas.find((r) => r.kind === 'hotel' && r.date <= date && (r.dateEnd ?? r.date) > date);
}

/** reservas que valem para uma data (trens, ingressos, mesas) */
export function reservasOf(reservas: Reserva[], date: string): Reserva[] {
  return reservas.filter((r) => r.kind !== 'hotel' && r.date === date);
}

/**
 * Marca uma reserva como feita (ou desfaz) e acerta a checklist junto: o item
 * "Reservar Shinkansen" só fica marcado quando os dois trens estão feitos, e
 * volta a desmarcar se alguma voltar a pendente.
 */
export function useMarcarFeita(reservas: Reserva[]) {
  const upsert = useSyncStore((s) => s.upsertReserva);
  return (r: Reserva, done: boolean) => {
    upsert({ ...r, done, updatedAt: Date.now() });
    const feitas = new Set(reservas.filter((x) => (x.id === r.id ? done : x.done)).map((x) => x.id));
    const { state, toggleChecklist } = useSyncStore.getState();
    for (const [item, ids] of Object.entries(CHECKLIST_DAS_RESERVAS)) {
      if (!ids.includes(r.id)) continue;
      const alvo = ids.every((id) => feitas.has(id));
      if ((state.checklist[item]?.checked ?? false) !== alvo) toggleChecklist(item);
    }
  };
}

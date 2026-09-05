'use client';

import { useMemo } from 'react';
import type { Reserva } from '@/data/types';
import { RESERVA_SEEDS } from '@/data/reservas';
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

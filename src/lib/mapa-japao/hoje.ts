import { ALL_DAYS } from '@/data/days';
import { TRIP } from '@/data/trip';

export type Hoje =
  | { fase: 'antes'; dias: number }
  | { fase: 'durante'; indiceDia: number; dayId: string }
  | { fase: 'depois' };

/** A data de hoje no fuso do Japão, em ISO. */
export function hojeNoJapao(agora: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(agora);
}

/** Onde a viagem está: antes, durante (com o dia) ou depois. */
export function hojeNaViagem(agora: Date = new Date()): Hoje {
  const hoje = hojeNoJapao(agora);
  const i = ALL_DAYS.findIndex((d) => d.date === hoje);
  if (i >= 0) return { fase: 'durante', indiceDia: i, dayId: ALL_DAYS[i].id };
  if (hoje < TRIP.start) {
    const dias = Math.max(
      1,
      Math.ceil((new Date(`${TRIP.start}T00:00:00+09:00`).getTime() - agora.getTime()) / 86_400_000),
    );
    return { fase: 'antes', dias };
  }
  return { fase: 'depois' };
}

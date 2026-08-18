import { ALL_DAYS } from '@/data/days';
import { TRIP, TRIP_EVENTS } from '@/data/trip';
import type { Day, Stop, TripEvent } from '@/data/types';

/**
 * Hora "agora" — em dev aceita override via ?fakeNow=2026-11-19T07:00
 * (interpretado como horário do Japão) para testar a tela Agora.
 */
export function getNow(): Date {
  if (typeof window !== 'undefined') {
    const fake = new URLSearchParams(window.location.search).get('fakeNow');
    if (fake) {
      const d = new Date(
        fake.includes('+') || fake.endsWith('Z') ? fake : `${fake}:00+09:00`,
      );
      if (!isNaN(d.getTime())) return d;
    }
  }
  return new Date();
}

interface JstParts {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  hour: number;
  minute: number;
  weekday: string;
}

const jstFmt = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const jstWeekdayFmt = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'Asia/Tokyo',
  weekday: 'long',
});

export function getJstParts(now: Date = getNow()): JstParts {
  // sv-SE → '2026-11-19 07:00'
  const s = jstFmt.format(now).replace(',', '');
  const [date, time] = s.split(' ');
  const [hour, minute] = time.split(':').map(Number);
  return { date, time, hour, minute, weekday: jstWeekdayFmt.format(now) };
}

export function getBrParts(now: Date = getNow()): { date: string; time: string } {
  const s = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(now)
    .replace(',', '');
  const [date, time] = s.split(' ');
  return { date, time };
}

/**
 * "Dia do roteiro" em JST — o dia vira às 04:00 (ramen pós-meia-noite ainda é "hoje").
 */
export function itineraryDate(now: Date = getNow()): string {
  const shifted = new Date(now.getTime() - 4 * 60 * 60 * 1000);
  return jstFmt.format(shifted).split(' ')[0];
}

export type TripPhase = 'before' | 'during' | 'after';

export interface TripPosition {
  phase: TripPhase;
  jst: JstParts;
  br: { date: string; time: string };
  day?: Day;
  dayIndex?: number;
  currentStop?: Stop;
  nextStop?: Stop;
  /** minutos até a próxima parada */
  minutesToNext?: number;
  /** próximo evento (voo/trem/prazo) nas próximas 36h */
  nextEvent?: TripEvent & { minutesUntil: number };
}

function stopMinutes(stop: Stop): number {
  const [h, m] = stop.time.split(':').map(Number);
  // horários antes das 04:00 pertencem à madrugada do dia seguinte
  return h < 4 ? (h + 24) * 60 + m : h * 60 + m;
}

export function resolvePosition(now: Date = getNow()): TripPosition {
  const jst = getJstParts(now);
  const br = getBrParts(now);
  const itDate = itineraryDate(now);

  const base: Omit<TripPosition, 'phase'> = { jst, br };

  // próximo evento em 36h
  const nextEvent = TRIP_EVENTS.map((e) => ({
    ...e,
    minutesUntil: Math.round((new Date(e.at).getTime() - now.getTime()) / 60000),
  }))
    .filter((e) => e.minutesUntil > -30 && e.minutesUntil < 36 * 60)
    .sort((a, b) => a.minutesUntil - b.minutesUntil)[0];

  if (itDate < TRIP.start) {
    return { ...base, phase: 'before', nextEvent };
  }
  if (itDate > TRIP.end) {
    return { ...base, phase: 'after' };
  }

  const dayIndex = ALL_DAYS.findIndex((d) => d.date === itDate);
  const day = dayIndex >= 0 ? ALL_DAYS[dayIndex] : undefined;
  if (!day) return { ...base, phase: 'during', nextEvent };

  const nowMin =
    jst.hour < 4 ? (jst.hour + 24) * 60 + jst.minute : jst.hour * 60 + jst.minute;
  const sorted = [...day.stops].sort((a, b) => stopMinutes(a) - stopMinutes(b));
  const currentStop = [...sorted].reverse().find((s) => stopMinutes(s) <= nowMin);
  const nextStop = sorted.find((s) => stopMinutes(s) > nowMin);
  const minutesToNext = nextStop ? stopMinutes(nextStop) - nowMin : undefined;

  return {
    ...base,
    phase: 'during',
    day,
    dayIndex,
    currentStop,
    nextStop,
    minutesToNext,
    nextEvent,
  };
}

export function formatCountdown(minutes: number): string {
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `em ${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h < 48) return m > 0 ? `em ${h}h${String(m).padStart(2, '0')}` : `em ${h}h`;
  const d = Math.floor(h / 24);
  return `em ${d} dia${d > 1 ? 's' : ''}`;
}

export function formatDayLabel(iso: string): string {
  const d = new Date(`${iso}T12:00:00+09:00`);
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'Asia/Tokyo',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d);
}

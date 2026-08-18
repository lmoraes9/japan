import type { Day, Stop } from '../types';
import { tokyo1Days } from './tokyo1';
import { hiroshimaDays } from './hiroshima';
import { osakaDays } from './osaka';
import { kyotoDays } from './kyoto';
import { tokyo2Days } from './tokyo2';
import { COORDS } from '../coords';

/** Todos os dias em ordem, com coords injetadas nos stops */
export const ALL_DAYS: Day[] = [
  ...tokyo1Days,
  ...hiroshimaDays,
  ...osakaDays,
  ...kyotoDays,
  ...tokyo2Days,
].map((day) => ({
  ...day,
  stops: day.stops.map((s) => (COORDS[s.id] ? { ...s, coords: COORDS[s.id] } : s)),
}));

export const dayById = (id: string): Day | undefined =>
  ALL_DAYS.find((d) => d.id === id);

export const dayByDate = (isoDate: string): Day | undefined =>
  ALL_DAYS.find((d) => d.date === isoDate);

export const stopById = (id: string): { day: Day; stop: Stop } | undefined => {
  for (const day of ALL_DAYS) {
    const stop = day.stops.find((s) => s.id === id);
    if (stop) return { day, stop };
  }
  return undefined;
};

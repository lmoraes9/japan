import type { StageId } from '@/data/types';

/** coordenadas de referência de cada etapa (para sol e previsão do tempo) */
export const STAGE_COORDS: Record<StageId, { lat: number; lng: number; name: string }> = {
  tokyo1: { lat: 35.69, lng: 139.7, name: 'Tóquio' },
  hiroshima: { lat: 34.39, lng: 132.46, name: 'Hiroshima' },
  osaka: { lat: 34.69, lng: 135.5, name: 'Osaka' },
  kyoto: { lat: 35.01, lng: 135.77, name: 'Kyoto' },
  tokyo2: { lat: 35.67, lng: 139.76, name: 'Tóquio' },
};

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/**
 * Nascer e pôr do sol pelo algoritmo do NOAA (precisão de ~1 min), devolvidos
 * em horário do Japão como 'HH:mm'. Funciona offline, sem tabela.
 */
export function sunTimes(isoDate: string, lat: number, lng: number): { sunrise: string; sunset: string; dayMinutes: number } {
  const [y, m, d] = isoDate.split('-').map(Number);
  // dia juliano ao meio-dia UTC
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  const jdn = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  const jd = jdn - 0.5; // 0h UTC

  const t = (jd - 2451545) / 36525;
  const L0 = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
  const M = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  const C =
    Math.sin(rad(M)) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(rad(2 * M)) * (0.019993 - 0.000101 * t) +
    Math.sin(rad(3 * M)) * 0.000289;
  const sunLong = L0 + C;
  const omega = 125.04 - 1934.136 * t;
  const lambda = sunLong - 0.00569 - 0.00478 * Math.sin(rad(omega));
  const eps0 = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(rad(omega));
  const decl = deg(Math.asin(Math.sin(rad(eps)) * Math.sin(rad(lambda))));
  const yv = Math.tan(rad(eps / 2)) ** 2;
  const eqTime =
    4 *
    deg(
      yv * Math.sin(2 * rad(L0)) -
        2 * e * Math.sin(rad(M)) +
        4 * e * yv * Math.sin(rad(M)) * Math.cos(2 * rad(L0)) -
        0.5 * yv * yv * Math.sin(4 * rad(L0)) -
        1.25 * e * e * Math.sin(2 * rad(M)),
    );
  const ha = deg(
    Math.acos(
      Math.cos(rad(90.833)) / (Math.cos(rad(lat)) * Math.cos(rad(decl))) - Math.tan(rad(lat)) * Math.tan(rad(decl)),
    ),
  );
  const noonUtc = 720 - 4 * lng - eqTime; // minutos UTC
  const riseUtc = noonUtc - ha * 4;
  const setUtc = noonUtc + ha * 4;
  const toJst = (min: number) => {
    const local = ((min + 9 * 60) % 1440 + 1440) % 1440;
    const h = Math.floor(local / 60);
    const mi = Math.round(local % 60);
    return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`;
  };
  return { sunrise: toJst(riseUtc), sunset: toJst(setUtc), dayMinutes: Math.round(setUtc - riseUtc) };
}

export const sunFor = (isoDate: string, stageId: StageId) => {
  const c = STAGE_COORDS[stageId];
  return sunTimes(isoDate, c.lat, c.lng);
};

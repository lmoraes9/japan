/**
 * Os lugares que o editor reconhece: as paradas do roteiro (com coordenadas,
 * data, horário e história), os lugares de comer e os aeroportos das conexões.
 * Lê direto de ../src/data, então o app continua sendo a única fonte.
 */
import { readFileSync } from 'node:fs';
import { ALL_DAYS } from '../../../src/data/days/index.ts';
import { STAGES } from '../../../src/data/trip.ts';
import { PLACE_HISTORIES } from '../../../src/data/historia.ts';
import { LEGS } from '../../../src/data/legs.ts';
import { COMIDA_ITENS } from '../../../src/data/comida.ts';
import { COMIDA_COORDS } from '../../../src/data/comidaCoords.ts';
import type { Leg } from '../../../src/data/types.ts';

export interface Lugar {
  id: string;
  nome: string;
  jp?: string;
  /** fora = lugar que não está no roteiro, achado pelo GPS da foto (só no catálogo) */
  tipo: 'parada' | 'comida' | 'aeroporto' | 'fora';
  /** cidade/etapa: 'Tóquio', 'Hiroshima', 'Nova York' */
  cidade: string;
  /** 'YYYY-MM-DD' (JST) e 'HH:mm' do roteiro, quando é parada */
  data?: string;
  hora?: string;
  diaTitulo?: string;
  lat: number;
  lng: number;
  /** fuso do lugar, '+09:00' */
  tz: string;
  /** até onde uma foto ainda conta como "neste lugar" */
  raioM: number;
  historia?: { titulo: string; jp?: string; paragrafos: string[] };
  /** como se chega daqui à próxima parada do roteiro */
  pernas?: Leg[];
  sigla?: string;
}

const RAIO: Record<string, number> = { temple: 450, sight: 450, view: 600, food: 200, shopping: 300, transit: 400, flight: 2500, hotel: 150, note: 300 };

const dir = new URL('../../dados/', import.meta.url);

export function carregarLugares(): Lugar[] {
  const etapa = new Map(STAGES.map((s) => [s.id, s.name]));
  const out: Lugar[] = [];

  for (const day of ALL_DAYS) {
    for (const s of day.stops) {
      if (!s.coords) continue;
      const h = PLACE_HISTORIES[s.id];
      out.push({
        id: s.id,
        nome: s.name,
        jp: s.jp,
        tipo: 'parada',
        cidade: etapa.get(day.stageId) ?? day.stageId,
        data: day.date,
        hora: s.time,
        diaTitulo: day.title,
        lat: s.coords.lat,
        lng: s.coords.lng,
        tz: '+09:00',
        raioM: RAIO[s.kind] ?? 400,
        historia: h
          ? { titulo: h.title, jp: h.jp, paragrafos: h.paragraphs }
          : s.history
            ? { titulo: s.history.label ?? s.name, paragrafos: s.history.paragraphs }
            : undefined,
        pernas: LEGS[s.id],
      });
    }
  }

  // a parada de origem pode não ter coordenada (ex.: uma parada de trânsito), por isso o mapa é de todas
  const paradas = new Map(ALL_DAYS.flatMap((d) => d.stops.map((s) => [s.id, { cidade: etapa.get(d.stageId) ?? d.stageId, data: d.date }] as const)));
  for (const c of COMIDA_ITENS) {
    const co = COMIDA_COORDS[c.id];
    if (!co) continue;
    const origem = paradas.get(c.stopId);
    out.push({
      id: `comida:${c.id}`,
      nome: c.nome,
      jp: c.jp,
      tipo: 'comida',
      cidade: origem?.cidade ?? '',
      data: origem?.data,
      lat: co.lat,
      lng: co.lng,
      tz: '+09:00',
      raioM: 120,
    });
  }

  const extras = JSON.parse(readFileSync(new URL('extras.json', dir), 'utf8')) as { lugares: Omit<Lugar, 'tipo'>[] };
  for (const e of extras.lugares) out.push({ ...e, tipo: 'aeroporto' });

  return out;
}

/** distância em metros (haversine) */
export function distM(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

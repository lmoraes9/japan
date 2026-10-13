import type { LegMode, Stop } from '@/data/types';

/**
 * Como o Google Maps acha uma parada. A coordenada conferida vence o texto:
 * o texto é ambíguo, e foi ele que mandou o botão de navegar para o lugar
 * errado mais de uma vez.
 */
export function pontoDe(stop: { coords?: { lat: number; lng: number }; mapQuery?: string; name: string }): string {
  return stop.coords ? `${stop.coords.lat},${stop.coords.lng}` : stop.mapQuery ?? stop.name;
}

const SO_JAPONES = /^[\u3040-\u30ff\u3400-\u9fff・ー々\s]+$/;

/** onde o ônibus e o bonde do dia circulam — "Hatchōbori" existe em Tóquio e em Hiroshima */
const REGIAO_LOCAL: Record<string, string> = {
  'd2026-11-23': 'Hiroshima',
  'd2026-11-24': 'Hiroshima',
  'd2026-11-28': 'Kyoto',
  'd2026-11-29': 'Kyoto',
  'd2026-11-30': 'Nara',
  'd2026-12-01': 'Kyoto',
};
export const regiaoDoDia = (dayId: string): string | undefined => REGIAO_LOCAL[dayId];

/**
 * Uma estação ou parada citada num trecho de legs.ts, escrita como o Google
 * Maps entende. O texto do trecho é para gente ler ("Kyoto (final)",
 * "Ginza (troca pelo corredor…)"); mandado cru, "Kyoto" vira a cidade e
 * "Ginza" vira o bairro. Aqui ele vira "Kyoto Station" — ou, quando o trecho
 * traz o nome em japonês entre parênteses, "新大塚駅" / "千手院橋 バス停",
 * que é inequívoco.
 */
export function pontoDoTrecho(texto: string, modo: LegMode, regiao?: string): string {
  const s = texto.replace(/\*\*/g, '').split(/\s[—–]\s|:\s/)[0];
  const jp = [...s.matchAll(/\(([^)]*)\)/g)]
    .map((m) => m[1].trim())
    .find((t) => SO_JAPONES.test(t) && !/方面/.test(t));
  if (jp) {
    if (modo === 'bus') return `${jp} バス停${regiao ? `, ${regiao}` : ''}`;
    if (modo === 'taxi' || modo === 'walk' || modo === 'ferry') return jp;
    return jp.endsWith('駅') ? jp : `${jp}駅`;
  }
  const nome = s
    .replace(/\([^)]*\)/g, '')
    .split(',')[0]
    .replace(/^(estação de|estação|parada|ponto)\s+/i, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  const tipo =
    modo === 'bus' ? ' bus stop'
    : modo === 'ferry' ? ' ferry terminal'
    : modo === 'taxi' || modo === 'walk' || /station/i.test(nome) ? ''
    : ' Station';
  const onde = (modo === 'bus' || modo === 'tram') && regiao ? `, ${regiao}` : '';
  return `${nome}${tipo}${onde}, Japan`;
}

/** Deep link que abre o app do Google Maps em modo navegação/busca */
export function navigateUrl(stop: Stop): string | undefined {
  if (stop.coords) {
    return `https://www.google.com/maps/dir/?api=1&destination=${stop.coords.lat},${stop.coords.lng}&travelmode=transit`;
  }
  if (stop.mapQuery) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.mapQuery)}`;
  }
  return undefined;
}

export function searchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Galeria de fotos do lugar (Google Imagens) */
export function photosUrl(stop: Stop): string | undefined {
  if (!stop.mapQuery) return undefined;
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(stop.mapQuery)}`;
}

export type ModoRota = 'transit' | 'walking' | 'driving';

/**
 * Rota de A até B no Google Maps. É o que o modo rua usa em cada trecho:
 * do hotel até a estação, da estação até o templo, do templo até o café.
 */
export function directionsUrl(origem: string | undefined, destino: string, modo: ModoRota = 'transit'): string {
  const p = new URLSearchParams({ api: '1', destination: destino, travelmode: modo });
  if (origem) p.set('origin', origem);
  return `https://www.google.com/maps/dir/?${p.toString()}`;
}

/**
 * Onde vocês dormem em cada etapa — os hotéis reservados de verdade, pela
 * coordenada do endereço da reserva (geocodificador do GSI, out/2026).
 * Pelo nome, o Google às vezes escolhia a filial errada da rede.
 */
const HOTEL = {
  amanek: '35.6956,139.7041', // HOTEL AMANEK Shinjuku Kabukicho · Kabukichō 2-24-10
  apa: '34.3954,132.4724', // APA Hotel Hiroshima Ekimae Ohashi · Kyōbashi-chō 2-26
  koko: '34.6673,135.5053', // KOKO HOTEL Osaka Namba Sennichimae · Sennichimae 1-3-7
  fumonin: '34.2159,135.5927', // Fumon-in · Kōyasan 608
  travelodge: '35.0072,135.7689', // Travelodge Kyoto Shijo Kawaramachi · Yamazaki-chō 240
  sotetsu: '35.6718,139.7677', // Sotetsu Fresa Inn Ginza Sanchome · Ginza 3-8-4
};

export const BASE_DA_ETAPA: Record<string, string> = {
  tokyo1: HOTEL.amanek,
  hiroshima: HOTEL.apa,
  osaka: HOTEL.koko,
  koyasan: HOTEL.fumonin,
  kyoto: HOTEL.travelodge,
  tokyo2: HOTEL.sotetsu,
};

/**
 * Nos dias de mudança de cidade, a manhã começa no hotel da etapa ANTERIOR —
 * a etapa de um dia é onde se dorme naquela noite, não de onde se saiu. Sem
 * esta tabela, o botão "do hotel até a primeira parada" do dia 26 traçaria a
 * rota a partir de um templo em Kōyasan que vocês só vão conhecer à tarde.
 */
const BASE_DA_MANHA: Record<string, string> = {
  'd2026-11-23': HOTEL.amanek,
  'd2026-11-25': HOTEL.apa,
  'd2026-11-26': HOTEL.koko,
  'd2026-11-27': HOTEL.fumonin,
  'd2026-12-01': HOTEL.travelodge,
};

/** De onde a manhã deste dia parte de fato. */
export const baseDaManha = (dayId: string, stageId: string): string | undefined =>
  BASE_DA_MANHA[dayId] ?? BASE_DA_ETAPA[stageId];

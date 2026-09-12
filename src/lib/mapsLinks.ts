import type { Stop } from '@/data/types';

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

/** Onde vocês dormem em cada etapa — os hotéis reservados de verdade. */
export const BASE_DA_ETAPA: Record<string, string> = {
  tokyo1: 'HOTEL AMANEK Shinjuku Kabukicho',
  hiroshima: 'APA Hotel Hiroshima Ekimae Ohashi',
  osaka: 'KOKO HOTEL Osaka Namba Sennichimae',
  koyasan: 'Kumagaiji, Koyasan',
  kyoto: 'Travelodge Kyoto Shijo Kawaramachi',
  tokyo2: 'Sotetsu Fresa Inn Ginza Sanchome',
};

/**
 * Nos dias de mudança de cidade, a manhã começa no hotel da etapa ANTERIOR —
 * a etapa de um dia é onde se dorme naquela noite, não de onde se saiu. Sem
 * esta tabela, o botão "do hotel até a primeira parada" do dia 26 traçaria a
 * rota a partir de um templo em Kōyasan que vocês só vão conhecer à tarde.
 */
const BASE_DA_MANHA: Record<string, string> = {
  'd2026-11-23': 'HOTEL AMANEK Shinjuku Kabukicho',
  'd2026-11-25': 'APA Hotel Hiroshima Ekimae Ohashi',
  'd2026-11-26': 'KOKO HOTEL Osaka Namba Sennichimae',
  'd2026-11-27': 'Kumagaiji, Koyasan',
  'd2026-12-01': 'Travelodge Kyoto Shijo Kawaramachi',
};

/** De onde a manhã deste dia parte de fato. */
export const baseDaManha = (dayId: string, stageId: string): string | undefined =>
  BASE_DA_MANHA[dayId] ?? BASE_DA_ETAPA[stageId];

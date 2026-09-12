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

/** Onde vocês dormem em cada etapa, para as rotas que começam no hotel. */
export const BASE_DA_ETAPA: Record<string, string> = {
  tokyo1: 'Shinjuku Station, Tokyo',
  hiroshima: 'Hondori, Hiroshima',
  osaka: 'Namba Station, Osaka',
  kyoto: 'Kyoto Station',
  tokyo2: 'Ginza, Tokyo',
};

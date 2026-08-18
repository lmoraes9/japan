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

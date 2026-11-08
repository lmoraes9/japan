import type { Stop } from '@/data/types';
import type { ComidaCatId } from '@/data/comida';
import { COMIDA_ITENS } from '@/data/comida';

/**
 * Um emoji por tipo de lugar, para o mapa não virar uma nuvem de bolinhas
 * iguais: 🏠 é o hotel, 🍣 é sushi, 🏪 é konbini, ⛩️ é templo.
 */
export const EMOJI_CAT: Record<ComidaCatId, string> = {
  sushi: '🍣',
  ramen: '🍜',
  soba: '🥢',
  chapa: '🍢',
  katsu: '🍖',
  curry: '🍛',
  arroz: '🍚',
  templo: '🍱',
  mercado: '🐟',
  rua: '🍡',
  cafe: '🍵',
  bar: '🍶',
  konbini: '🏪',
};

const EMOJI_KIND: Record<Stop['kind'], string> = {
  sight: '📍',
  temple: '⛩️',
  food: '🍽️',
  transit: '🚆',
  shopping: '🛍️',
  flight: '✈️',
  hotel: '🏠',
  view: '🌄',
  note: '📝',
};

/** a categoria do prato marcado (ou da primeira opção) de cada parada de comida */
const CAT_DA_PARADA = new Map<string, ComidaCatId>();
for (const item of COMIDA_ITENS) {
  const atual = CAT_DA_PARADA.get(item.stopId);
  if (!atual || item.plano === 'marcado') CAT_DA_PARADA.set(item.stopId, item.cat);
}

export function emojiDaParada(stop: Stop): string {
  const label = (stop.timeLabel ?? '').toLowerCase();
  if (label === 'konbini' || /7-eleven|konbini/i.test(stop.name)) return '🏪';
  if (stop.kind === 'food') {
    const cat = CAT_DA_PARADA.get(stop.id);
    if (cat) return EMOJI_CAT[cat];
    if (label.includes('sushi')) return '🍣';
    if (label.includes('ramen')) return '🍜';
    if (label.includes('saquê') || label.includes('bar')) return '🍶';
    if (label.includes('café') || label.includes('chá') || label.includes('doce')) return '🍵';
    return '🍽️';
  }
  if (stop.kind === 'temple' && label.includes('templo')) return '🛕';
  return EMOJI_KIND[stop.kind] ?? '📍';
}

/** '35.6718,139.7677' → { lat, lng } */
export function pontoLatLng(p: string | undefined): { lat: number; lng: number } | undefined {
  if (!p) return undefined;
  const [lat, lng] = p.split(',').map(Number);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined;
}

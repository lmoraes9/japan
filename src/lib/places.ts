/** Contexto de cidade para buscas de lugares sugeridos (fotos/mapa por item) */

const DAY_CITY: Record<string, string> = {
  'd2026-11-18': 'Tokyo',
  'd2026-11-19': 'Tokyo',
  'd2026-11-20': 'Kamakura',
  'd2026-11-21': 'Ginza Tokyo',
  'd2026-11-22': 'Tokyo',
  'd2026-11-23': 'Hiroshima',
  'd2026-11-24': 'Miyajima',
  'd2026-11-25': 'Osaka',
  'd2026-11-26': 'Osaka',
  'd2026-11-27': 'Kyoto',
  'd2026-11-28': 'Kyoto',
  'd2026-11-29': 'Kyoto',
  'd2026-11-30': 'Nara',
  'd2026-12-01': 'Kyoto',
  'd2026-12-02': 'Tokyo',
  'd2026-12-03': 'Tokyo',
};

/** paradas cuja cidade difere da cidade-base do dia */
const STOP_CITY: Record<string, string> = {
  'd20-volta': 'Shinjuku Tokyo',
  'd25-almoco-kurashiki': 'Kurashiki',
  'd01-checkin-compras': 'Ginza Tokyo',
  'd18-haneda': 'Haneda',
  'd03-haneda': 'Haneda',
};

/** 'Kikanbō (Kanda)' → 'Kikanbō Kanda' · 'Anago-meshi — enguia…' → 'Anago-meshi' */
function cleanItemName(name: string): string {
  return name
    .replace(/\s[—–].*$/, '')
    .replace(/[()/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function itemQuery(itemName: string, stopId: string, dayId: string): string {
  const city = STOP_CITY[stopId] ?? DAY_CITY[dayId] ?? 'Japan';
  return `${cleanItemName(itemName)} ${city}`;
}

export function itemPhotosUrl(itemName: string, stopId: string, dayId: string): string {
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(itemQuery(itemName, stopId, dayId))}`;
}

export function itemMapsUrl(itemName: string, stopId: string, dayId: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(itemQuery(itemName, stopId, dayId))}`;
}

/**
 * A mesma cidade das buscas acima, mas escrita para aparecer na tela — em
 * português e sem o bairro que só serve para desambiguar o Google.
 */
const CIDADE_DO_DIA: Record<string, string> = {
  'd2026-11-18': 'Tóquio',
  'd2026-11-19': 'Tóquio',
  'd2026-11-20': 'Kamakura',
  'd2026-11-21': 'Tóquio',
  'd2026-11-22': 'Tóquio',
  'd2026-11-23': 'Hiroshima',
  'd2026-11-24': 'Miyajima',
  'd2026-11-25': 'Osaka',
  'd2026-11-26': 'Osaka',
  'd2026-11-27': 'Kyoto',
  'd2026-11-28': 'Kyoto',
  'd2026-11-29': 'Kyoto',
  'd2026-11-30': 'Nara',
  'd2026-12-01': 'Kyoto',
  'd2026-12-02': 'Tóquio',
  'd2026-12-03': 'Tóquio',
};

/** paradas cuja cidade difere da cidade-base do dia */
const CIDADE_DA_PARADA: Record<string, string> = {
  'd25-almoco-kurashiki': 'Kurashiki',
  'd26-jantar-shojin': 'Kōyasan',
  'd27-almoco': 'Osaka',
};

export function cidadeDe(stopId: string, dayId: string): string {
  return CIDADE_DA_PARADA[stopId] ?? CIDADE_DO_DIA[dayId] ?? 'Japão';
}

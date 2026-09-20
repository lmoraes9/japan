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

/**
 * O bairro de cada parada de comida — para a pergunta "estou aqui agora, o
 * que mais tem por perto?".
 *
 * É por parada e não por item porque uma parada já é um lugar: quem está em
 * Akihabara quer ver tudo que o roteiro tem em Akihabara, mesmo o que estava
 * marcado para outro dia. Um item que foge do bairro da própria parada
 * (WAGYUMAFIA em Nakameguro, dentro do almoço de Harajuku) corrige isso com
 * o campo `bairro` no próprio item.
 */
const BAIRRO_DA_PARADA: Record<string, string> = {
  // Tóquio
  'd18-ramen': 'Shinjuku',
  'd18-konbini': 'Shinjuku',
  'd19-kuramae': 'Asakusa e Kuramae',
  'd19-almoco-ueno': 'Ueno',
  'd19-akihabara': 'Akihabara',
  'd19-jantar': 'Akihabara e Kanda',
  'd20-volta': 'Shinjuku',
  'd21-tsukiji': 'Tsukiji',
  'd21-almoco-ginza': 'Ginza',
  'd21-ginza': 'Ginza',
  'd21-jantar-estacao': 'Estação de Tóquio',
  'd21-bar-triad': 'Ebisu',
  'd22-almoco': 'Harajuku e Aoyama',
  'd22-gaien': 'Harajuku e Aoyama',
  'd22-jantar': 'Shibuya e Shinjuku',
  'd02-jimbocho': 'Jimbōchō',
  'd02-nihonbashi': 'Nihonbashi',
  'd02-jantar-despedida': 'Ginza',
  'd02-konbini': 'Ginza',
  'd03-ultima-manha': 'Tsukiji e Toyosu',

  // Kamakura
  'd20-komachi': 'Komachi-dōri',

  // Hiroshima e Miyajima
  'd23-konbini': 'Estação de Hiroshima',
  'd23-okonomiyaki': 'Centro de Hiroshima',
  'd24-comer-miyajima': 'Miyajima',
  'd24-jantar': 'Centro de Hiroshima',

  // Okayama e Osaka
  'd25-almoco-kurashiki': 'Bikan, em Kurashiki',
  'd25-dotonbori': 'Dōtonbori',
  'd26-kuromon': 'Kuromon Ichiba',
  'd26-jantar-shojin': 'Kōyasan',
  'd27-almoco': 'Namba',

  // Kyoto e Nara
  'd27-nishiki-rapido': 'Nishiki',
  'd27-jantar': 'Fushimi',
  'd27-sushi-musashi': 'Kawaramachi-Sanjō',
  'd29-jantar': 'Kawaramachi-Sanjō',
  'd28-sannenzaka': 'Higashiyama',
  'd28-almoco': 'Higashiyama',
  'd28-gion': 'Gion e Pontochō',
  'd29-konbini': 'Arashiyama',
  'd29-almoco': 'Arashiyama',
  'd30-almoco': 'Nara',
  'd01-almoco': 'Estação de Kyoto',
};

/**
 * Onde este item fica, para agrupar por lugar. Uma parada de comida sem
 * bairro no mapa acima é erro de build — senão o cartão some do agrupamento
 * por lugar sem ninguém perceber.
 */
export function bairroDe(stopId: string, override?: string): string {
  if (override) return override;
  const bairro = BAIRRO_DA_PARADA[stopId];
  if (!bairro) {
    throw new Error(
      `places.ts: a parada de comida "${stopId}" não tem bairro em BAIRRO_DA_PARADA.`,
    );
  }
  return bairro;
}

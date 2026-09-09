/**
 * Os lugares da viagem no mapa do Japão inteiro: um marco 3D por localidade,
 * com a coordenada real. O mapa é um diorama, não uma carta náutica — os
 * marcos são gigantes de propósito, como nos mapas pictóricos antigos.
 */
export type Marco =
  | 'torre'      // Tóquio: a torre e os prédios
  | 'buda'       // Kamakura: o Daibutsu ao ar livre
  | 'domo'       // Hiroshima: a cúpula da bomba
  | 'torii'      // Miyajima: o torii na água
  | 'kura'       // Kurashiki: os armazéns brancos do canal
  | 'castelo'    // Himeji: a garça branca
  | 'castelo-osaka'
  | 'pagode'     // Kyoto: o pagode de cinco andares
  | 'veado';     // Nara: o Grande Buda e os veados

export interface LugarMapa {
  id: string;
  nome: string;
  jp: string;
  lat: number;
  lng: number;
  marco: Marco;
  /** uma frase que resume o lugar */
  resumo: string;
  /** id do mapa ilustrado / cena 3D, quando existe */
  placeMapId?: string;
  /** slug da história da cidade em /mais/historia */
  historiaId?: string;
  /** altura do marco, em unidades da cena */
  escala?: number;
  /** empurra a placa para cima, para as cidades vizinhas não se cobrirem */
  placaOffset?: number;
}

export const LUGARES: LugarMapa[] = [
  {
    id: 'tokyo',
    placaOffset: 26,
    nome: 'Tóquio',
    jp: '東京',
    lat: 35.69,
    lng: 139.7,
    marco: 'torre',
    resumo: 'A base da viagem: sete noites no total, no começo e no fim. Edo antigo em Asakusa, o novo em Shibuya.',
    placeMapId: 'sensoji',
    historiaId: 'tokyo',
    escala: 1.15,
  },
  {
    id: 'kamakura',
    placaOffset: 0,
    nome: 'Kamakura',
    jp: '鎌倉',
    lat: 35.317,
    lng: 139.536,
    marco: 'buda',
    resumo: 'A primeira capital dos samurais, a uma hora de Tóquio. O Grande Buda está ao ar livre desde 1498.',
    placeMapId: 'kamakura',
    historiaId: 'kamakura',
  },
  {
    id: 'hiroshima',
    placaOffset: 26,
    nome: 'Hiroshima',
    jp: '広島',
    lat: 34.395,
    lng: 132.454,
    marco: 'domo',
    resumo: 'A cúpula que sobrou de pé embaixo do epicentro, e uma cidade inteira reconstruída em volta dela.',
    placeMapId: 'parque-da-paz',
    historiaId: 'hiroshima',
  },
  {
    id: 'miyajima',
    placaOffset: 0,
    nome: 'Miyajima',
    jp: '宮島',
    lat: 34.296,
    lng: 132.32,
    marco: 'torii',
    resumo: 'A ilha onde o santuário foi construído sobre a água porque pisar nela era proibido.',
    placeMapId: 'miyajima',
    historiaId: 'miyajima',
  },
  {
    id: 'kurashiki',
    placaOffset: 26,
    nome: 'Kurashiki',
    jp: '倉敷',
    lat: 34.595,
    lng: 133.771,
    marco: 'kura',
    resumo: 'Um canal com salgueiros e armazéns brancos de arroz do período Edo, intactos.',
    placeMapId: 'kurashiki',
    historiaId: 'kurashiki',
  },
  {
    id: 'himeji',
    placaOffset: 0,
    nome: 'Himeji',
    jp: '姫路',
    lat: 34.839,
    lng: 134.694,
    marco: 'castelo',
    resumo: 'O único castelo japonês que nunca queimou, nunca caiu e nunca foi reconstruído. Branco de garça.',
    placeMapId: 'himeji',
    historiaId: 'himeji',
  },
  {
    id: 'osaka',
    placaOffset: 26,
    nome: 'Osaka',
    jp: '大阪',
    lat: 34.687,
    lng: 135.526,
    marco: 'castelo-osaka',
    resumo: 'A cozinha do Japão, com o castelo de Hideyoshi no meio e o néon do Dōtonbori na água.',
    placeMapId: 'castelo-osaka',
    historiaId: 'osaka',
  },
  {
    id: 'kyoto',
    placaOffset: 52,
    nome: 'Kyoto',
    jp: '京都',
    lat: 35.011,
    lng: 135.768,
    marco: 'pagode',
    resumo: 'Mil e cem anos de capital. Cinco noites, e o pico exato da folhagem de outono.',
    placeMapId: 'fushimi-inari',
    historiaId: 'kyoto',
    escala: 1.1,
  },
  {
    id: 'nara',
    placaOffset: 0,
    nome: 'Nara',
    jp: '奈良',
    lat: 34.685,
    lng: 135.843,
    marco: 'veado',
    resumo: 'A capital antes de Kyoto, com o maior prédio de madeira do mundo e mil e duzentos veados soltos.',
    placeMapId: 'nara',
    historiaId: 'nara',
  },
];

export const lugarPorId = (id: string) => LUGARES.find((l) => l.id === id);

/**
 * Onde cada dia acontece, na ordem em que acontece. Dias de travessia
 * listam mais de um lugar: é o que desenha a linha da viagem no mapa.
 */
export const DIA_LUGARES: Record<string, string[]> = {
  'd2026-11-18': ['tokyo'],
  'd2026-11-19': ['tokyo'],
  'd2026-11-20': ['kamakura'],
  'd2026-11-21': ['tokyo'],
  'd2026-11-22': ['tokyo'],
  'd2026-11-23': ['tokyo', 'hiroshima'],
  'd2026-11-24': ['miyajima'],
  'd2026-11-25': ['hiroshima', 'kurashiki', 'himeji', 'osaka'],
  'd2026-11-26': ['osaka'],
  'd2026-11-27': ['osaka', 'kyoto'],
  'd2026-11-28': ['kyoto'],
  'd2026-11-29': ['kyoto'],
  'd2026-11-30': ['nara'],
  'd2026-12-01': ['kyoto', 'tokyo'],
  'd2026-12-02': ['tokyo'],
  'd2026-12-03': ['tokyo'],
};

/** A sequência geográfica da viagem inteira, sem repetir o lugar anterior. */
export function rotaDaViagem(dayIds: string[]): string[] {
  const seq: string[] = [];
  for (const d of dayIds) {
    for (const l of DIA_LUGARES[d] ?? []) {
      if (seq[seq.length - 1] !== l) seq.push(l);
    }
  }
  return seq;
}

/**
 * Pontos por onde a linha passa entre duas cidades, para o traço seguir o
 * corredor do Tōkaidō/San'yō em vez de cortar o mar em linha reta.
 * A chave é 'origem>destino'; o inverso é usado de trás para frente.
 */
export const PASSAGENS: Record<string, [number, number][]> = {
  // Tóquio → Kansai pelo Tōkaidō: Odawara, Shizuoka, Nagoya
  'tokyo>kyoto': [[139.15, 35.25], [138.38, 34.97], [136.88, 35.17]],
  'tokyo>osaka': [[139.15, 35.25], [138.38, 34.97], [136.88, 35.17]],
  'tokyo>hiroshima': [[139.15, 35.25], [138.38, 34.97], [136.88, 35.17], [135.5, 34.69], [133.92, 34.66]],
  // Kansai → oeste pelo San'yō: Okayama
  'osaka>hiroshima': [[133.92, 34.66]],
  'himeji>hiroshima': [[133.92, 34.66]],
  // Kamakura sai de Tóquio pela costa
  'tokyo>kamakura': [[139.62, 35.44]],
};

/** As passagens entre dois lugares, já na direção certa. */
export function passagensEntre(a: string, b: string): [number, number][] {
  const direta = PASSAGENS[`${a}>${b}`];
  if (direta) return direta;
  const inversa = PASSAGENS[`${b}>${a}`];
  return inversa ? [...inversa].reverse() : [];
}

/** O monte Fuji entra como cenário: é o que se vê do Shinkansen. */
export const FUJI = { lat: 35.3606, lng: 138.7274 };

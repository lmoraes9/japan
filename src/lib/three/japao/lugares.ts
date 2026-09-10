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
  /**
   * Os mapas ilustrados desta cidade, com o rumo aproximado (graus, 0 = norte)
   * em que cada lugar fica em relação ao centro: vira o anel de miniaturas
   * que aparece quando a câmera chega perto.
   */
  mapas?: { id: string; nome: string; rumo: number }[];
}

export const LUGARES: LugarMapa[] = [
  {
    id: 'tokyo',
    mapas: [{ id: 'sensoji', nome: 'Sensō-ji', rumo: 40 }, { id: 'meiji-jingu', nome: 'Meiji Jingū', rumo: 250 }, { id: 'shibuya', nome: 'Shibuya', rumo: 215 }],
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
    mapas: [{ id: 'kamakura', nome: 'Kamakura', rumo: 200 }],
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
    mapas: [{ id: 'parque-da-paz', nome: 'Parque da Paz', rumo: 270 }],
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
    mapas: [{ id: 'miyajima', nome: 'Miyajima', rumo: 180 }],
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
    mapas: [{ id: 'kurashiki', nome: 'Bairro Bikan', rumo: 160 }],
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
    mapas: [{ id: 'himeji', nome: 'Castelo de Himeji', rumo: 0 }],
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
    mapas: [{ id: 'castelo-osaka', nome: 'Castelo de Osaka', rumo: 30 }, { id: 'sumiyoshi', nome: 'Sumiyoshi Taisha', rumo: 190 }],
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
    mapas: [{ id: 'kinkakuji', nome: 'Kinkaku-ji', rumo: 320 }, { id: 'arashiyama', nome: 'Arashiyama', rumo: 265 }, { id: 'higashiyama', nome: 'Higashiyama', rumo: 85 }, { id: 'tofukuji', nome: 'Tōfuku-ji', rumo: 150 }, { id: 'fushimi-inari', nome: 'Fushimi Inari', rumo: 170 }],
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
    mapas: [{ id: 'nara', nome: 'Parque de Nara', rumo: 90 }],
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

/** Como se vai de uma cidade à outra: aparece ao tocar na linha. */
export interface Trecho {
  de: string;
  para: string;
  trem: string;
  duracao: string;
  custo: string;
  nota?: string;
}

export const TRECHOS: Trecho[] = [
  { de: 'tokyo', para: 'kamakura', trem: 'JR Shōnan-Shinjuku Line', duracao: '~1h', custo: '¥950', nota: 'direto de Shinjuku; descer em Kita-Kamakura' },
  { de: 'tokyo', para: 'hiroshima', trem: 'Nozomi (Tōkaidō + San\'yō Shinkansen)', duracao: '3h50', custo: '¥19.800', nota: 'assentos D/E, lado direito, para o Fuji · reservar em 23/10' },
  { de: 'hiroshima', para: 'miyajima', trem: 'JR San\'yō Line + balsa JR', duracao: '~40 min', custo: '¥620', nota: 'trem até Miyajimaguchi, 27 min; balsa, 10 min' },
  { de: 'hiroshima', para: 'kurashiki', trem: 'San\'yō Shinkansen + JR local', duracao: '~55 min', custo: '~¥8.000', nota: 'Shinkansen até Okayama, 35 min; local até Kurashiki, 17 min' },
  { de: 'kurashiki', para: 'himeji', trem: 'JR local + San\'yō Shinkansen', duracao: '~40 min', custo: '~¥3.900', nota: 'local até Okayama; Shinkansen até Himeji, 20 min' },
  { de: 'himeji', para: 'osaka', trem: 'JR Special Rapid', duracao: '60 min', custo: '¥1.520', nota: 'sem taxa de Shinkansen; sai a cada 15 min' },
  { de: 'osaka', para: 'kyoto', trem: 'JR Special Rapid', duracao: '29 min', custo: '¥580', nota: 'de Osaka Station; o mais rápido e o mais barato' },
  { de: 'kyoto', para: 'nara', trem: 'Kintetsu Limited Express', duracao: '35 min', custo: '¥1.280', nota: 'Kintetsu-Nara chega mais perto do parque que a JR' },
  { de: 'kyoto', para: 'tokyo', trem: 'Nozomi (Tōkaidō Shinkansen)', duracao: '2h15', custo: '¥14.200', nota: 'assentos A/B, lado esquerdo, para o Fuji · reservar em 1/11' },
];

export function trechoEntre(a: string, b: string): Trecho | undefined {
  return TRECHOS.find((t) => (t.de === a && t.para === b) || (t.de === b && t.para === a));
}

/** Rótulos da paisagem: o que vocês vão reconhecer pela janela. */
export interface Rotulo {
  texto: string;
  sub?: string;
  lng: number;
  lat: number;
}

export const ROTULOS: Rotulo[] = [
  { texto: 'Fuji-san', sub: '3.776 m · fileira E indo, A voltando', lng: 138.73, lat: 35.36 },
  { texto: 'Mar Interior de Seto', sub: 'entre Hiroshima e Miyajima', lng: 133.4, lat: 34.05 },
  { texto: 'Lago Biwa', sub: 'o maior do Japão, à direita antes de Kyoto', lng: 136.1, lat: 35.33 },
  { texto: 'Baía de Osaka', lng: 135.2, lat: 34.5 },
  { texto: 'Baía de Tóquio', lng: 139.85, lat: 35.45 },
  { texto: 'Oceano Pacífico', lng: 137.6, lat: 33.4 },
  { texto: 'Mar do Japão', lng: 135.6, lat: 37.3 },
];

/** O lago Biwa não está no contorno da costa: desenha-se à parte. */
export const BIWA = { lng: 136.08, lat: 35.33, rx: 0.22, rz: 0.42 };

/** O monte Fuji entra como cenário: é o que se vê do Shinkansen. */
export const FUJI = { lat: 35.3606, lng: 138.7274 };

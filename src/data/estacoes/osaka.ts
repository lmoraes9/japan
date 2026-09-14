import type { MapaEstacoes } from './types';

/**
 * Osaka e Kōyasan: a Midōsuji desce de Umeda a Namba, onde fica o hotel; a
 * Nankai sai do 3º andar da Takashimaya e sobe a montanha. Kōyasan vira uma
 * caixa embaixo, com o funicular e as paradas do ônibus.
 */
export const OSAKA: MapaEstacoes = {
  id: 'osaka',
  titulo: 'Osaka & Kōyasan',
  jp: '大阪',
  subtitulo: 'Umeda em cima, Namba embaixo, e a Nankai subindo a montanha',
  viewBox: '0 0 600 760',
  stageIds: ['osaka', 'koyasan'],
  bases: [
    { estacaoId: 'namba', nome: 'KOKO Hotel · Sennichimae', dx: -66, dy: 40, stageId: 'osaka' },
    { estacaoId: 'ichinohashi-guchi', nome: 'Shukubō Kumagaiji', dx: -30, dy: -48, stageId: 'koyasan' },
  ],
  caixas: [{ titulo: 'Kōyasan · dias 26–27 · 1h30 de Nankai + funicular', x: 300, y: 585, w: 290, h: 165 }],
  oficiais: [
    { nome: 'Mapa do metrô de Osaka', url: 'https://subway.osakametro.co.jp/en/guide/routemap.php' },
    { nome: 'Kōyasan pela Nankai (guia oficial)', url: 'https://www.nankaikoya.jp/en/' },
  ],
  linhas: [
    {
      id: 'midosuji',
      nome: 'Metrô Midōsuji (vermelha)',
      cor: '#E5171F',
      modo: 'metro',
      casa: /Midōsuji/,
      tracado: [[170, 40], 'umeda', 'honmachi', 'namba', [170, 470]],
      rotulos: [
        { texto: '↑ Shin-Osaka', x: 176, y: 38 },
        { texto: '↓ Tennōji', x: 176, y: 484 },
      ],
    },
    {
      id: 'chuo-osaka',
      nome: 'Metrô Chūō (verde)',
      cor: '#019A66',
      modo: 'metro',
      casa: /Chūō Line \(verde\)/,
      tracado: [[90, 252], 'honmachi', 'sakaisuji-hommachi', 'tanimachi4', [470, 252]],
      rotulos: [{ texto: '→ Cosmosquare', x: 96, y: 240 }],
    },
    {
      id: 'sakaisuji',
      nome: 'Metrô Sakaisuji (marrom)',
      cor: '#814721',
      modo: 'metro',
      casa: /Sakaisuji/,
      tracado: [[250, 165], 'sakaisuji-hommachi', 'nippombashi', [250, 470]],
      rotulos: [{ texto: '↓ Tengachaya', x: 256, y: 484 }],
    },
    {
      id: 'jr-special-rapid',
      nome: 'JR Special Rapid (Himeji ⇄ Osaka ⇄ Kyoto)',
      cor: '#0072BC',
      modo: 'jr',
      casa: /Special Rapid/,
      tracado: [[20, 60], [110, 96], 'umeda', [330, 92], [430, 70]],
      rotulos: [
        { texto: '← Himeji 60 min', x: 22, y: 50 },
        { texto: '→ Kyoto 29 min', x: 436, y: 66 },
      ],
    },
    {
      id: 'hankyu-osaka',
      nome: 'Hankyu (→ Kyoto-Kawaramachi)',
      cor: '#7A2F3D',
      modo: 'privada',
      casa: /Hankyu/,
      tracado: ['umeda', [262, 62], [350, 30]],
      rotulos: [{ texto: '→ Kyoto-Kawaramachi 45 min', x: 358, y: 28 }],
    },
    {
      id: 'nankai-koya',
      nome: 'Nankai Kōya Line',
      cor: '#00A651',
      modo: 'privada',
      casa: /Nankai Kōya/,
      tracado: ['nankai-namba', [200, 470], 'sumiyoshi-higashi', [226, 560], 'hashimoto', 'gokurakubashi'],
      rotulos: [{ texto: '特急 Kōya 85 min · no passe', x: 246, y: 556, ancora: 'start' }],
    },
    {
      id: 'cabo-koyasan',
      nome: 'Funicular de Kōyasan',
      cor: '#6B4A7A',
      modo: 'cabo',
      casa: /funicular/,
      tracado: ['gokurakubashi', 'koyasan-eki'],
    },
    {
      id: 'rinkan',
      nome: 'ônibus Nankai Rinkan',
      cor: '#8A8F98',
      modo: 'onibus',
      casa: /Rinkan|linha do Okunoin/,
      tracado: ['koyasan-eki', [446, 678], 'senjuinbashi', 'ichinohashi-guchi', 'okunoin-mae'],
    },
    {
      id: 'rinkan-oeste',
      nome: 'ônibus Nankai Rinkan (Daimon)',
      cor: '#8A8F98',
      modo: 'onibus',
      casa: /Rinkan/,
      tracado: ['senjuinbashi', 'kondo-mae', [318, 718]],
      rotulos: [{ texto: 'Daimon', x: 306, y: 733 }],
    },
  ],
  estacoes: [
    { id: 'umeda', nome: 'Osaka · Umeda', jp: '大阪 · 梅田', x: 170, y: 110, troca: true, destaque: true, lado: 'l', nota: 'JR Osaka, Hankyu Osaka-Umeda e o metrô Umeda são prédios diferentes, ligados por baixo' },
    { id: 'honmachi', nome: 'Honmachi', jp: '本町', x: 170, y: 252, troca: true, lado: 'l' },
    { id: 'sakaisuji-hommachi', nome: 'Sakaisuji-Hommachi', jp: '堺筋本町', x: 250, y: 252, troca: true, lado: 't' },
    { id: 'tanimachi4', nome: 'Tanimachi 4-chōme', jp: '谷町四丁目', x: 380, y: 252, lado: 'b', nota: 'saída 1-B → portão Ōtemon do castelo' },
    { id: 'namba', nome: 'Namba', jp: 'なんば', x: 170, y: 380, troca: true, destaque: true, lado: 'l' },
    { id: 'nankai-namba', nome: 'Nankai Namba', jp: '南海なんば', x: 195, y: 428, troca: true, lado: 'l', nota: '3º andar do prédio da Takashimaya — não é a estação do metrô' },
    { id: 'nippombashi', nome: 'Nippombashi', jp: '日本橋', x: 250, y: 382, lado: 'r', nota: 'saída 10 → galeria do Kuromon' },
    { id: 'sumiyoshi-higashi', nome: 'Sumiyoshi-Higashi', jp: '住吉東', x: 200, y: 520, lado: 'l', nota: 'parada de trem local' },
    { id: 'hashimoto', nome: 'Hashimoto', jp: '橋本', x: 280, y: 600, troca: true, lado: 'l', nota: 'às vezes é preciso trocar de trem aqui' },
    { id: 'gokurakubashi', nome: 'Gokurakubashi', jp: '極楽橋', x: 335, y: 652, troca: true, lado: 'b', nota: 'o funicular sai da mesma plataforma' },
    { id: 'koyasan-eki', nome: 'Kōyasan (funicular)', jp: '高野山', x: 425, y: 645, tipo: 'cabo', lado: 't', nota: 'daqui só de ônibus: a estrada não tem calçada' },
    { id: 'senjuinbashi', nome: 'Senjuinbashi', jp: '千手院橋', x: 428, y: 718, tipo: 'onibus', lado: 'b' },
    { id: 'kondo-mae', nome: 'Kondō-mae', jp: '金堂前', x: 362, y: 718, tipo: 'onibus', lado: 'b', rotuloDy: 12 },
    { id: 'ichinohashi-guchi', nome: 'Ichinohashi-guchi', jp: '一の橋口', x: 498, y: 718, tipo: 'onibus', lado: 'b' },
    { id: 'okunoin-mae', nome: 'Okunoin-mae', jp: '奥の院前', x: 562, y: 718, tipo: 'onibus', lado: 'b', rotuloDy: 12 },
  ],
  pontos: [
    // 25 nov
    { id: 'p-d25-dotonbori', nome: 'Dōtonbori', estacaoId: 'namba', dx: 44, dy: -36, stopId: 'd25-dotonbori' },
    // 26 nov
    { id: 'p-d26-castelo-osaka', nome: 'Castelo de Osaka', estacaoId: 'tanimachi4', dx: 34, dy: -40, stopId: 'd26-castelo-osaka' },
    { id: 'p-d26-kuromon', nome: 'Kuromon Ichiba', estacaoId: 'nippombashi', dx: 42, dy: 26, stopId: 'd26-kuromon' },
    { id: 'p-d26-nankai', nome: 'Nankai → Kōyasan 13:20', estacaoId: 'nankai-namba', dx: 48, dy: 34, stopId: 'd26-nankai' },
    { id: 'p-d26-checkin-shukubo', nome: 'Shukubō · check-in', estacaoId: 'ichinohashi-guchi', dx: -30, dy: -48, stopId: 'd26-checkin-shukubo', lado: 'l' },
    { id: 'p-d26-okunoin', nome: 'Okunoin', estacaoId: 'ichinohashi-guchi', dx: 24, dy: -46, stopId: 'd26-okunoin' },
    { id: 'p-d26-okunoin-noite', nome: 'Okunoin (noite)', estacaoId: 'ichinohashi-guchi', dx: 34, dy: -20, stopId: 'd26-okunoin-noite' },
    // 27 nov
    { id: 'p-d27-gongyo', nome: 'Oração das 6h', estacaoId: 'ichinohashi-guchi', dx: -52, dy: -20, stopId: 'd27-gongyo', lado: 'l' },
    { id: 'p-d27-garan', nome: 'Garan', estacaoId: 'kondo-mae', dx: -22, dy: -38, stopId: 'd27-garan', lado: 'l' },
    { id: 'p-d27-kongobuji', nome: 'Kongōbu-ji', estacaoId: 'kondo-mae', dx: 30, dy: -38, stopId: 'd27-kongobuji' },
    { id: 'p-d27-sumiyoshi', nome: 'Sumiyoshi Taisha', estacaoId: 'sumiyoshi-higashi', dx: 42, dy: -20, stopId: 'd27-sumiyoshi' },
    { id: 'p-d27-almoco', nome: '551 Hōrai · butaman', estacaoId: 'nankai-namba', dx: 52, dy: 6, stopId: 'd27-almoco' },
    { id: 'p-d27-trem-kyoto', nome: 'Hankyu → Kyoto 14:45', estacaoId: 'umeda', dx: 46, dy: 32, stopId: 'd27-trem-kyoto' },
    // desejos
    { id: 'w-mario-kart-osaka', nome: 'Mario Kart · Round1', estacaoId: 'namba', dx: 52, dy: 22, desejoId: 'mario-kart' },
    { id: 'w-nambu-tekki-osaka', nome: 'Loft Umeda · nambu tekki', estacaoId: 'umeda', dx: 52, dy: -30, desejoId: 'nambu-tekki' },
  ],
};

import type { Reserva, ReservaKind } from './types';

/**
 * Modelos das reservas da viagem. O que está aqui é o esqueleto (o que
 * precisa existir, em que data); nome do hotel, endereço, código e horários
 * são preenchidos no app e sincronizam entre os dois celulares.
 */
export type ReservaSeed = Omit<Reserva, 'updatedAt'> & { hint?: string };

export const RESERVA_SEEDS: ReservaSeed[] = [
  // ── voos ──
  {
    id: 'voo-gru-jfk',
    kind: 'voo',
    title: 'GRU → JFK · JL5501',
    date: '2026-11-16',
    time: '22:50 → 06:40 (17/11)',
    notes: 'GRU T3 → JFK T4 · op. Latam · 9h50 de voo · conexão de 6h no JFK, com imigração dos EUA',
    hint: 'Localizador da JAL/Latam e assentos',
  },
  {
    id: 'voo-jfk-hnd',
    kind: 'voo',
    title: 'JFK → HND · JL005',
    date: '2026-11-17',
    time: '12:40 → 17:15 (18/11)',
    notes: 'JFK T8 · 14h35 de voo · pouso em Haneda T3',
  },
  {
    id: 'voo-hnd-dfw',
    kind: 'voo',
    title: 'HND → DFW · JL7014',
    date: '2026-12-03',
    time: '20:25 → 17:05',
    notes: 'Haneda T3 · estar no aeroporto às 17:00 (reembolso do imposto antes do check-in)',
  },
  {
    id: 'voo-dfw-gru',
    kind: 'voo',
    title: 'DFW → GRU · JL7204',
    date: '2026-12-03',
    time: '19:20 → 08:30 (4/12)',
    notes: 'Conexão de 2h15 em Dallas',
  },

  // ── hotéis ──
  {
    id: 'hotel-tokyo1',
    kind: 'hotel',
    title: 'HOTEL AMANEK Shinjuku Kabukicho',
    date: '2026-11-18',
    dateEnd: '2026-11-23',
    time: 'check-in 15:00 · check-out 11:00',
    notes: 'R$ 5.987 · 5 noites · confirmada',
    hint: 'Endereço em japonês (para o táxi) e o código da reserva',
  },
  {
    id: 'hotel-hiroshima',
    kind: 'hotel',
    title: 'APA Hotel Hiroshima Ekimae Ohashi',
    date: '2026-11-23',
    dateEnd: '2026-11-25',
    time: 'check-in 15:00 · check-out 11:00',
    notes: 'R$ 953 · confirmada · as malas grandes vão de takuhaibin direto para Kyoto; aqui só a mochila',
  },
  {
    id: 'hotel-osaka',
    kind: 'hotel',
    title: 'KOKO HOTEL Osaka Namba Sennichimae',
    date: '2026-11-25',
    dateEnd: '2026-11-26',
    time: 'check-in 15:00 · check-out 11:00',
    notes: 'Reservado 25–27 por R$ 1.084: precisa virar UMA noite (25–26). Reservar a nova antes de cancelar a atual.',
    hint: 'Novo código depois de refazer a reserva',
  },
  {
    id: 'hotel-koyasan',
    kind: 'hotel',
    title: 'Shukubō em Kōyasan · 熊谷寺 ou 普門院',
    date: '2026-11-26',
    dateEnd: '2026-11-27',
    time: 'check-in até 17:00 · jantar ~17:30 · oração 06:00–06:30 · check-out 09:00',
    notes: 'Kumagai-ji R$ 1.861 (conf. 5897947836) e Fumon-in, os dois reservados para a mesma noite — cancelar um. Subir com dinheiro vivo: a montanha quase não tem caixa eletrônico.',
    hint: 'Qual dos dois ficou, e a resposta do templo sobre o goma e o horário do jantar',
  },
  {
    id: 'hotel-kyoto',
    kind: 'hotel',
    title: 'Travelodge Kyoto Shijo Kawaramachi',
    date: '2026-11-27',
    dateEnd: '2026-12-01',
    time: 'check-in 15:00 · check-out 11:00',
    notes: 'R$ 3.920 · confirmada. As malas do takuhaibin de Tóquio chegam aqui no dia 24 — avisar a recepção por escrito ANTES de despachar. O Carta Hotel Kyoto Gion está reservado nas mesmas datas e precisa ser cancelado.',
  },
  {
    id: 'hotel-tokyo2',
    kind: 'hotel',
    title: 'Sotetsu Fresa Inn Ginza Sanchome',
    date: '2026-12-01',
    dateEnd: '2026-12-03',
    time: 'check-in 15:00 · check-out 11:00',
    notes: 'R$ 1.596 · confirmada · recebe as malas do takuhaibin de Kyoto no dia 1º ou 2',
  },

  // ── trens ──
  {
    id: 'trem-nozomi-hiroshima',
    kind: 'trem',
    title: 'Nozomi Tóquio → Hiroshima',
    date: '2026-11-23',
    time: '07:00 · 3h50',
    notes: 'Feriado nacional: assento reservado. Lado direito para o Fuji (uns 40 min após a saída).',
    hint: 'Número do trem, vagão e assentos (smartEX ou bilhete físico)',
  },
  {
    id: 'trem-hiroshima-okayama',
    kind: 'trem',
    title: 'Sanyo Shinkansen Hiroshima → Okayama',
    date: '2026-11-25',
    time: '08:20',
    notes: 'Depois local até Kurashiki; à tarde Himeji e Osaka',
  },
  {
    id: 'trem-koyasan',
    kind: 'trem',
    title: 'Nankai · Kōyasan World Heritage Ticket',
    date: '2026-11-26',
    time: 'partir de Namba até 13:30',
    notes: 'Ida e volta Namba–Kōyasan + funicular + 2 dias de ônibus na montanha. ¥3.980 digital, ¥4.910 com assento do especial こうや na ida. A versão digital só pode ser comprada até as 15:00.',
    hint: 'Horário do 特急こうや escolhido e o número do assento',
  },
  {
    id: 'trem-nozomi-tokyo',
    kind: 'trem',
    title: 'Nozomi Kyoto → Tóquio',
    date: '2026-12-01',
    time: '13:20 · 2h15',
    notes: 'Fuji do lado esquerdo desta vez',
  },

  // ── ingressos e mesas ──
  {
    id: 'ingresso-shibuya-sky',
    kind: 'ingresso',
    title: 'Shibuya Sky',
    date: '2026-11-22',
    time: 'faixa do pôr do sol (~16:00)',
    notes: 'Esgota com semanas de antecedência; comprar online assim que abrir a venda',
    hint: 'Horário do slot e QR do ingresso',
  },
  {
    id: 'ingresso-torokko',
    kind: 'ingresso',
    title: 'Trem Torokko (Sagano Romantic Train)',
    date: '2026-11-29',
    time: 'manhã',
    notes: 'Novembro é o pico; reservar na JR West ou em qualquer estação JR com antecedência',
  },
  {
    id: 'mesa-omakase',
    kind: 'restaurante',
    title: 'Jantar de despedida (omakase)',
    date: '2026-12-02',
    time: '19:30',
    notes: 'Kyūbey Ginza ou Sushi Ginza Onodera — reserva com antecedência',
  },
];

export const RESERVA_KIND_LABEL: Record<ReservaKind, { label: string; emoji: string }> = {
  voo: { label: 'Voo', emoji: '✈️' },
  hotel: { label: 'Hotel', emoji: '🏨' },
  trem: { label: 'Trem', emoji: '🚄' },
  ingresso: { label: 'Ingresso', emoji: '🎟️' },
  restaurante: { label: 'Mesa', emoji: '🍣' },
  outro: { label: 'Outro', emoji: '📎' },
};

export const RESERVA_KINDS: ReservaKind[] = ['voo', 'hotel', 'trem', 'ingresso', 'restaurante', 'outro'];

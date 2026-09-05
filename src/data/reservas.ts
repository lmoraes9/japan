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
    time: '22:50 → 07:50 (17/11)',
    notes: 'Terminal 3 · op. American · conexão de 6h no JFK, com imigração dos EUA',
    hint: 'Localizador da JAL/American e assentos',
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
    title: 'Hotel em Shinjuku',
    date: '2026-11-18',
    dateEnd: '2026-11-23',
    time: 'check-in 15:00 · check-out 11:00',
    hint: 'Nome exato da reserva, endereço em japonês (para o táxi) e código',
  },
  {
    id: 'hotel-hiroshima',
    kind: 'hotel',
    title: 'Hotel em Hiroshima',
    date: '2026-11-23',
    dateEnd: '2026-11-25',
    time: 'check-in 15:00 · check-out 11:00',
    notes: 'As malas grandes vão de takuhaibin direto para Kyoto; aqui só a mochila de dois dias',
  },
  {
    id: 'hotel-osaka',
    kind: 'hotel',
    title: 'Hotel em Osaka',
    date: '2026-11-25',
    dateEnd: '2026-11-27',
    time: 'check-in 15:00 · check-out 11:00',
  },
  {
    id: 'hotel-kyoto',
    kind: 'hotel',
    title: 'Hotel em Kyoto',
    date: '2026-11-27',
    dateEnd: '2026-12-01',
    time: 'check-in 15:00 · check-out 11:00',
    notes: 'As malas do takuhaibin de Tóquio chegam aqui no dia 27 — avisar a recepção',
  },
  {
    id: 'hotel-tokyo2',
    kind: 'hotel',
    title: 'Hotel em Ginza',
    date: '2026-12-01',
    dateEnd: '2026-12-03',
    time: 'check-in 15:00 · check-out 11:00',
    notes: 'Recebe as malas do takuhaibin de Kyoto no dia 1º ou 2',
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

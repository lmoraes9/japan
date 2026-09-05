export type StageId = 'tokyo1' | 'hiroshima' | 'osaka' | 'kyoto' | 'tokyo2';

export interface Stage {
  id: StageId;
  name: string;
  jp: string;
  /** ISO date (JST) of first night */
  start: string;
  /** ISO date (JST) of checkout day */
  end: string;
  nights: number;
  /** tailwind-friendly hex accent */
  color: string;
  /** "Por que X é assim" — parágrafos de história da etapa */
  intro?: string[];
  hotelHint?: string;
}

export interface Day {
  /** 'd2026-11-19' */
  id: string;
  /** ISO date in JST, e.g. '2026-11-19' */
  date: string;
  stageId: StageId;
  title: string;
  subtitle: string;
  chips: string[];
  /** aviso no topo do dia (ex.: takuhaibin, maré) */
  notes?: DayNote[];
  stops: Stop[];
}

export interface DayNote {
  label: string;
  text: string;
  tone?: 'info' | 'ok' | 'warn';
}

export type StopKind =
  | 'sight'
  | 'temple'
  | 'food'
  | 'transit'
  | 'shopping'
  | 'flight'
  | 'hotel'
  | 'view'
  | 'note';

export interface Stop {
  /** 'd19-sensoji' */
  id: string;
  /** '06:30' 24h JST */
  time: string;
  /** 'templo', 'trem', 'café'… */
  timeLabel?: string;
  kind: StopKind;
  name: string;
  jp?: string;
  /** linha de facts, itens separados por ' · ', com **bold** */
  facts?: string;
  paragraphs?: string[];
  /** bloco "História" */
  history?: HistoryBlock;
  eat?: EatBlock[];
  links?: { label: string; url: string }[];
  /** query original para Google Maps */
  mapQuery?: string;
  /** id de um mapa ilustrado interativo em src/data/placeMaps.ts */
  placeMapId?: string;
  coords?: { lat: number; lng: number };
}

export interface HistoryBlock {
  label?: string;
  paragraphs: string[];
}

export interface EatBlock {
  label: string;
  items: {
    name: string;
    note: string;
    /** especialidade típica desta cidade/região */
    specialty?: boolean;
  }[];
}

export interface ChecklistItem {
  id: string;
  group: 'compras' | 'pretrip' | 'konbini' | 'mala';
  title: string;
  subtitle: string;
}

export type ExpenseCategory =
  | 'comida'
  | 'transporte'
  | 'compras'
  | 'hospedagem'
  | 'outros';

export interface Expense {
  id: string;
  amountJpy: number;
  category: ExpenseCategory;
  note: string;
  /** ISO date (JST) */
  date: string;
  /** 'P' | 'L' */
  who?: string;
  checklistItemId?: string;
  updatedAt: number;
  deleted?: boolean;
}

export type PhraseSituation =
  | 'restaurante'
  | 'trem'
  | 'taxi'
  | 'compras'
  | 'taxfree'
  | 'hotel'
  | 'saude'
  | 'emergencia';

export interface Phrase {
  id: string;
  situation: PhraseSituation;
  pt: string;
  jp: string;
  romaji: string;
  /** merece a tela de letras grandes para mostrar ao atendente */
  showable?: boolean;
}

export interface TripEvent {
  id: string;
  label: string;
  /** ISO datetime with offset, e.g. '2026-11-23T07:00:00+09:00' */
  at: string;
  kind: 'flight' | 'train' | 'checkout' | 'deadline';
  detail?: string;
}

export type ReservaKind = 'voo' | 'hotel' | 'trem' | 'ingresso' | 'restaurante' | 'outro';

/** Uma reserva editável no app (hotel, trem, ingresso…), sincronizada */
export interface Reserva {
  id: string;
  kind: ReservaKind;
  /** nome do hotel / trecho / atração */
  title: string;
  /** '2026-11-18' — primeiro dia em que vale */
  date: string;
  /** '2026-11-23' — só hotéis (check-out) */
  dateEnd?: string;
  /** horário ou faixa: '15:00', 'check-in 15:00 · check-out 11:00' */
  time?: string;
  /** endereço em alfabeto latino */
  address?: string;
  /** endereço em japonês, para mostrar ao taxista */
  addressJp?: string;
  /** código/localizador da reserva */
  code?: string;
  phone?: string;
  notes?: string;
  /** já confirmada/comprada? */
  done?: boolean;
  updatedAt: number;
  deleted?: boolean;
}

/** Campo livre de documento (passaporte, seguro, contato), sincronizado */
export interface DocField {
  text: string;
  updatedAt: number;
}

/** Documento sincronizado (valor no Redis + espelho local) */
export interface SyncedState {
  checklist: Record<string, { checked: boolean; updatedAt: number }>;
  favorites: Record<string, { fav: boolean; updatedAt: number }>;
  notes: Record<string, { text: string; who?: string; updatedAt: number }>;
  expenses: Record<string, Expense>;
  reservas: Record<string, Reserva>;
  docs: Record<string, DocField>;
}

export const emptySyncedState = (): SyncedState => ({
  checklist: {},
  favorites: {},
  notes: {},
  expenses: {},
  reservas: {},
  docs: {},
});

import { STAGES } from '@/data/trip';
import type { StageId } from '@/data/types';

/**
 * Onde se dorme em cada etapa: a base de onde os dias saem e para onde
 * voltam. As datas e as cores vêm das etapas em trip.ts; o hotel e a
 * coordenada ficam aqui, e seguem as reservas de hoteis.ts — onde ainda não
 * há reserva fechada (Osaka, Kōyasan), fica o bairro ou o tipo de pouso.
 */
export interface Base {
  id: StageId;
  nome: string;
  cidade: string;
  cidadeId: string;
  lat: number;
  lng: number;
  /** ISO do check-in e do check-out */
  inicio: string;
  fim: string;
  noites: number;
  cor: string;
}

const POUSOS: Record<StageId, Pick<Base, 'nome' | 'cidade' | 'cidadeId' | 'lat' | 'lng'>> = {
  tokyo1: { nome: 'Hotel Amanek Shinjuku Kabukicho', cidade: 'Shinjuku', cidadeId: 'tokyo', lat: 35.6963, lng: 139.7043 },
  hiroshima: { nome: 'APA Hotel Hiroshima Ekimae Ohashi', cidade: 'Hiroshima', cidadeId: 'hiroshima', lat: 34.396, lng: 132.4742 },
  osaka: { nome: 'Hotel em Namba', cidade: 'Osaka', cidadeId: 'osaka', lat: 34.6655, lng: 135.506 },
  koyasan: { nome: 'Shukubō, alojamento em templo', cidade: 'Kōyasan', cidadeId: 'koyasan', lat: 34.2129, lng: 135.5866 },
  kyoto: { nome: 'Travelodge Kyoto Shijo Kawaramachi', cidade: 'Kyoto', cidadeId: 'kyoto', lat: 35.0034, lng: 135.7688 },
  tokyo2: { nome: 'Sotetsu Fresa Inn Ginza Sanchome', cidade: 'Ginza', cidadeId: 'tokyo', lat: 35.6716, lng: 139.7665 },
};

export const BASES: Base[] = STAGES.map((s) => ({
  id: s.id,
  ...POUSOS[s.id],
  inicio: s.start,
  fim: s.end,
  noites: s.nights,
  cor: s.color,
}));

/** onde se dorme na noite de uma data: a etapa que começa até ela e acaba depois */
export function baseDaNoite(data: string): Base | undefined {
  return BASES.find((b) => b.inicio <= data && data < b.fim);
}

/** a data de um dia antes, em ISO */
export function vespera(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

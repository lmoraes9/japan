/**
 * Quatro regiões disjuntas, usadas só como atalho de câmera e como destino
 * do toque grosso na janela. Nenhuma cidade aparece em duas.
 */
export type RegiaoId = 'kanto' | 'sanyo' | 'setouchi' | 'kansai';

export interface Regiao {
  id: RegiaoId;
  nome: string;
  detalhe: string;
  lugares: string[];
}

export const REGIOES: Regiao[] = [
  { id: 'kanto', nome: 'Kantō', detalhe: 'Tóquio e Kamakura', lugares: ['tokyo', 'kamakura'] },
  { id: 'sanyo', nome: "San'yō", detalhe: 'Hiroshima e Miyajima', lugares: ['hiroshima', 'miyajima'] },
  { id: 'setouchi', nome: 'Setouchi', detalhe: 'Kurashiki e Himeji', lugares: ['kurashiki', 'himeji'] },
  { id: 'kansai', nome: 'Kansai', detalhe: 'Osaka, Kyoto e Nara', lugares: ['osaka', 'kyoto', 'nara'] },
];

export const regiaoDe = (lugarId: string): Regiao | undefined =>
  REGIOES.find((r) => r.lugares.includes(lugarId));

export const regiaoPorId = (id: RegiaoId): Regiao | undefined => REGIOES.find((r) => r.id === id);

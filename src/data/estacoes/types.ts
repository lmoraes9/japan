import type { StageId } from '../types';

/**
 * Mapa esquemático das estações de uma cidade — no espírito dos mapas de
 * metrô: linhas coloridas, estações como nós, e os lugares do roteiro
 * pendurados na estação onde se desce. Não é escala geográfica.
 */

export type ModoLinha = 'jr' | 'metro' | 'privada' | 'shinkansen' | 'bonde' | 'onibus' | 'balsa' | 'cabo' | 'taxi';

export interface Linha {
  id: string;
  /** 'JR Yamanote' */
  nome: string;
  cor: string;
  modo: ModoLinha;
  /**
   * Reconhece a linha nos trechos de legs.ts, testado contra `${mode} ${line}`.
   * É o que acende a linha quando se escolhe um dia.
   */
  casa?: RegExp;
  /** o traçado: id de estação, ou [x, y] de uma curva onde não há estação */
  tracado: (string | [number, number])[];
  /** volta ao começo (Yamanote) */
  fechada?: boolean;
  /** rótulo solto ao longo da linha — 'para Haneda, 15 min' */
  rotulos?: { texto: string; x: number; y: number; ancora?: 'start' | 'middle' | 'end' }[];
}

export type TipoEstacao = 'estacao' | 'onibus' | 'bonde' | 'balsa' | 'cabo' | 'pier';

export interface Estacao {
  id: string;
  nome: string;
  jp?: string;
  x: number;
  y: number;
  tipo?: TipoEstacao;
  /** nó grande, de baldeação */
  troca?: boolean;
  /** onde fica o nome: direita (padrão), esquerda, cima, baixo */
  lado?: 'r' | 'l' | 't' | 'b';
  /** nome sempre visível, mesmo sem zoom */
  destaque?: boolean;
  /** empurra o nome para baixo (ou para cima, se negativo), para escalonar rótulos vizinhos */
  rotuloDy?: number;
  /** uma linha do que há ali — 'saída Electric Town' */
  nota?: string;
}

export interface Ponto {
  id: string;
  /** nome curto para o mapa */
  nome: string;
  estacaoId: string;
  /** o pino fica deslocado da estação, para caber vários na mesma */
  dx: number;
  dy: number;
  /** a parada do roteiro: dia, hora e texto vêm de lá */
  stopId: string;
  /** de que lado do pino fica o nome */
  lado?: 'r' | 'l';
}

/** água (rio, baía) para orientar — só cenário */
export interface Agua {
  d: string;
  nome?: string;
  x?: number;
  y?: number;
}

/** uma caixa de destaque: 'Kamakura · dia 20' */
export interface Caixa {
  titulo: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MapaEstacoes {
  id: string;
  titulo: string;
  jp: string;
  subtitulo: string;
  viewBox: string;
  stageIds: StageId[];
  /** onde se dorme, pendurado numa estação */
  bases: { estacaoId: string; nome: string; dx: number; dy: number; stageId: StageId }[];
  linhas: Linha[];
  estacoes: Estacao[];
  pontos: Ponto[];
  agua?: Agua[];
  caixas?: Caixa[];
  /** mapas oficiais, online */
  oficiais?: { nome: string; url: string }[];
}

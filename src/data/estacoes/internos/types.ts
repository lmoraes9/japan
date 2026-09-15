/**
 * O interior de uma estação: andares empilhados, e dentro de cada um as
 * catracas, plataformas, saídas e lojas que a viagem usa. Não é planta:
 * é um esquema do que fica onde, com os passos de cada dia.
 */

export type TipoArea =
  | 'plataforma'
  | 'catraca'
  | 'saida'
  | 'loja'
  | 'comida'
  | 'passagem'
  | 'armario'
  | 'onibus'
  | 'taxi'
  | 'hotel'
  | 'balcao'
  | 'rua';

export interface Andar {
  id: string;
  /** 'B1', 'Térreo', '2º andar', 'Plataformas' */
  nome: string;
  /** faixa vertical no viewBox */
  y: number;
  h: number;
  nota?: string;
}

export interface AreaInterna {
  id: string;
  nome: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tipo: TipoArea;
  /** cor da linha, para plataformas e catracas */
  cor?: string;
  /** o que é, em uma frase — aparece ao tocar */
  nota?: string;
}

/** seta entre duas áreas: 'da catraca do Shinkansen ao ekie' */
export interface Ligacao {
  de: string;
  para: string;
  nota?: string;
}

export interface UsoInterno {
  dayId?: string;
  /** 'Dia 21 · chegando pela Marunouchi' */
  titulo: string;
  passos: string[];
  /** áreas que este uso percorre, para acender no desenho */
  areas?: string[];
}

export interface Interno {
  /** id da estação no mapa das estações */
  estacaoId: string;
  /** id do mapa (cidade) */
  mapaId: string;
  nome: string;
  jp?: string;
  /** a estação em duas frases: como se orientar */
  resumo: string;
  /** os lados: 'Oeste = Marunouchi (Palácio) · Leste = Yaesu (Shinkansen)' */
  bussola?: string;
  viewBox: string;
  andares: Andar[];
  areas: AreaInterna[];
  ligacoes?: Ligacao[];
  usos: UsoInterno[];
  oficiais?: { nome: string; url: string }[];
  avisos?: string[];
  /** quando a pesquisa não fechou um detalhe */
  incertezas?: string[];
}

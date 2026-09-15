import type { Interno } from './types';

export type { Interno, AreaInterna, Andar, UsoInterno, TipoArea, Ligacao } from './types';

/** as estações desenhadas por dentro, na ordem da viagem */
export const INTERNOS: Interno[] = [];

export const internoById = (estacaoId: string): Interno | undefined => INTERNOS.find((i) => i.estacaoId === estacaoId);

export const internosDoMapa = (mapaId: string): Interno[] => INTERNOS.filter((i) => i.mapaId === mapaId);

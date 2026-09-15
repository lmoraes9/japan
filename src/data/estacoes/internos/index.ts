import type { Interno } from './types';
import { INTERNOS_TOKYO } from './tokyo';
import { INTERNOS_HIROSHIMA } from './hiroshima';
import { INTERNOS_KANSAI } from './kansai';

export type { Interno, AreaInterna, Andar, UsoInterno, TipoArea, Ligacao } from './types';

/** as estações desenhadas por dentro, na ordem da viagem */
export const INTERNOS: Interno[] = [...INTERNOS_TOKYO, ...INTERNOS_HIROSHIMA, ...INTERNOS_KANSAI];

export const internoById = (estacaoId: string): Interno | undefined => INTERNOS.find((i) => i.estacaoId === estacaoId);

export const internosDoMapa = (mapaId: string): Interno[] => INTERNOS.filter((i) => i.mapaId === mapaId);

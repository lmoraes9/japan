import type { MapaEstacoes } from './types';
import { TOKYO } from './tokyo';
import { HIROSHIMA } from './hiroshima';
import { OSAKA } from './osaka';
import { KYOTO } from './kyoto';

export { DESEJOS, desejoById } from './desejos';
export type { MapaEstacoes, Ponto, Estacao, Linha, Desejo } from './types';

/** na ordem da viagem */
export const MAPAS_ESTACOES: MapaEstacoes[] = [TOKYO, HIROSHIMA, OSAKA, KYOTO];

export const mapaEstacoesById = (id: string): MapaEstacoes | undefined => MAPAS_ESTACOES.find((m) => m.id === id);

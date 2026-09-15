import type { MapaEstacoes } from './types';
import { TOKYO } from './tokyo';
import { HIROSHIMA } from './hiroshima';
import { OSAKA } from './osaka';
import { KYOTO } from './kyoto';

export type { MapaEstacoes, Ponto, Estacao, Linha } from './types';

/** na ordem da viagem */
export const MAPAS_ESTACOES: MapaEstacoes[] = [TOKYO, HIROSHIMA, OSAKA, KYOTO];

export const mapaEstacoesById = (id: string): MapaEstacoes | undefined => MAPAS_ESTACOES.find((m) => m.id === id);

/** em que mapa uma estação aparece */
export const mapaDaEstacao = (estacaoId: string): MapaEstacoes | undefined =>
  MAPAS_ESTACOES.find((m) => m.estacoes.some((e) => e.id === estacaoId));

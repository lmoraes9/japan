import type { Base } from './bases';
import type { No } from './hierarquia';

/** o que está escolhido no mapa: um marcador da hierarquia, ou uma cama */
export type Foco = { tipo: 'no'; no: No } | { tipo: 'base'; base: Base };

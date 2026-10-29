import React from 'react';
import { ESTILOS } from './estilos/index.ts';
import type { Plano } from './plano.ts';

/** escolhe o visual pelo `plano.estilo` */
export const Reel: React.FC<Plano> = (plano) => {
  const Estilo = ESTILOS[plano.estilo ?? 'noite'];
  return <Estilo {...plano} />;
};

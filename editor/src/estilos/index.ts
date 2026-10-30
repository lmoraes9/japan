import type React from 'react';
import type { Estilo, Plano } from '../plano.ts';
import { ReelNoite } from './noite.tsx';
import { ReelOutono } from './outono.tsx';
import { ReelCaderno } from './caderno.tsx';
import { ReelUkiyoe } from './ukiyoe.tsx';
import { ReelLinha } from './linha.tsx';
import { ReelAoVivo } from './aovivo.tsx';
import { ReelGlobinho } from './globinho.tsx';

export const ESTILOS: Record<Estilo, React.FC<Plano>> = {
  noite: ReelNoite,
  outono: ReelOutono,
  caderno: ReelCaderno,
  ukiyoe: ReelUkiyoe,
  linha: ReelLinha,
  aovivo: ReelAoVivo,
  globinho: ReelGlobinho,
  'globinho-viagem': ReelGlobinho,
};

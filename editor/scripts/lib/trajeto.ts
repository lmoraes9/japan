/**
 * Como se foi de um lugar a outro, segundo o roteiro: junta as pernas
 * (src/data/legs.ts) entre as duas paradas e resume em modos, linhas e minutos.
 * Entre dias diferentes, conta só o caminho do dia de chegada (START + paradas
 * até o destino), que é o deslocamento que o vídeo vai mostrar.
 */
import { ALL_DAYS } from '../../../src/data/days/index.ts';
import { LEGS, START } from '../../../src/data/legs.ts';
import type { Leg, LegMode } from '../../../src/data/types.ts';

export interface Trajeto {
  /** modos na ordem em que aparecem, sem caminhada (a não ser que só tenha caminhada) */
  modos: LegMode[];
  linhas: string[];
  minutos: number;
}

const posicao = new Map<string, { dia: number; i: number }>();
ALL_DAYS.forEach((d, dia) => d.stops.forEach((s, i) => posicao.set(s.id, { dia, i })));

export function trajeto(deId: string, paraId: string): Trajeto | undefined {
  const a = posicao.get(deId);
  const b = posicao.get(paraId);
  if (!a || !b) return undefined;
  if (a.dia > b.dia || (a.dia === b.dia && a.i >= b.i)) return undefined;

  const pernas: Leg[] = [];
  const diaB = ALL_DAYS[b.dia];
  const inicio = a.dia === b.dia ? a.i : 0;
  if (a.dia !== b.dia) pernas.push(...(START[diaB.id] ?? []));
  for (let i = inicio; i < b.i; i++) pernas.push(...(LEGS[diaB.stops[i].id] ?? []));
  if (pernas.length === 0) return undefined;

  const semPe = pernas.filter((p) => p.mode !== 'walk');
  const base = semPe.length ? semPe : pernas;
  const modos = base.map((p) => p.mode).filter((m, i, arr) => arr.indexOf(m) === i);
  const linhas = base.map((p) => p.line).filter((l): l is string => !!l).filter((l, i, arr) => arr.indexOf(l) === i);
  return { modos, linhas, minutos: pernas.reduce((n, p) => n + p.minutes, 0) };
}

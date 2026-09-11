import { DIA_LUGARES, trechoEntre, lugarPorId, type Trecho, type LugarMapa } from '@/lib/three/japao/lugares';
import { ALL_DAYS } from '@/data/days';
import { STAGES } from '@/data/trip';
import type { Day } from '@/data/types';

/**
 * A viagem como uma fita de casas alternadas: visita, trecho, visita, trecho…
 *
 * Esta é a espinha do mapa. A posição de cada casa é o índice dela nesta
 * sequência — nunca a latitude. É daí que vem a garantia de que Kyoto e Nara,
 * a 37 km uma da outra, recebem alvos tão grandes e tão separados quanto
 * Tóquio e Hiroshima, a 365 km.
 */

export interface Visita {
  tipo: 'visita';
  /** índice na fita, sempre par */
  i: number;
  /** índice entre as 13 visitas */
  iVisita: number;
  lugarId: string;
  lugar: LugarMapa;
  dias: Day[];
  /** '18–19 nov' */
  datas: string;
  /** cor da etapa a que o primeiro dia pertence */
  cor: string;
}

export interface Baldeacao {
  tipo: 'trecho';
  /** índice na fita, sempre ímpar */
  i: number;
  de: string;
  para: string;
  trecho: Trecho;
  /** true quando é o caminho de volta do mesmo par */
  volta: boolean;
  /** o dia em que este deslocamento acontece */
  dia: Day;
}

export type Casa = Visita | Baldeacao;

const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** '18–19 nov', '25 nov', '1 dez' */
function faixaDeDatas(dias: Day[]): string {
  if (!dias.length) return '';
  const parte = (d: Day) => {
    const [, m, dd] = d.date.split('-');
    return { dia: Number(dd), mes: MES[Number(m) - 1] };
  };
  const a = parte(dias[0]);
  const b = parte(dias[dias.length - 1]);
  if (dias.length === 1) return `${a.dia} ${a.mes}`;
  if (a.mes === b.mes) return `${a.dia}–${b.dia} ${a.mes}`;
  return `${a.dia} ${a.mes} – ${b.dia} ${b.mes}`;
}

/** Blocos contíguos no mesmo lugar, na ordem em que a viagem acontece. */
function visitas(): { lugarId: string; dias: Day[] }[] {
  const seq: { lugarId: string; dias: Day[] }[] = [];
  for (const dia of ALL_DAYS) {
    for (const lugarId of DIA_LUGARES[dia.id] ?? []) {
      const ultimo = seq[seq.length - 1];
      if (ultimo && ultimo.lugarId === lugarId) {
        if (ultimo.dias[ultimo.dias.length - 1]?.id !== dia.id) ultimo.dias.push(dia);
      } else {
        seq.push({ lugarId, dias: [dia] });
      }
    }
  }
  return seq;
}

/** O dia em que se vai de uma visita à seguinte: o último dia da que termina. */
function diaDaTravessia(anterior: Day[], seguinte: Day[]): Day {
  const fim = anterior[anterior.length - 1];
  const inicio = seguinte[0];
  // quando a travessia acontece dentro de um mesmo dia, é esse dia
  return fim.id === inicio.id ? fim : inicio;
}

function construir(): Casa[] {
  const vs = visitas();
  const casas: Casa[] = [];
  const vistos = new Map<string, number>();

  vs.forEach((v, iVisita) => {
    const lugar = lugarPorId(v.lugarId);
    if (!lugar) throw new Error(`lugar desconhecido na rota: ${v.lugarId}`);
    const etapa = STAGES.find((s) => s.id === v.dias[0].stageId);
    casas.push({
      tipo: 'visita',
      i: casas.length,
      iVisita,
      lugarId: v.lugarId,
      lugar,
      dias: v.dias,
      datas: faixaDeDatas(v.dias),
      cor: etapa?.color ?? 'var(--rail)',
    });

    const prox = vs[iVisita + 1];
    if (!prox) return;
    const trecho = trechoEntre(v.lugarId, prox.lugarId);
    if (!trecho) throw new Error(`sem trecho entre ${v.lugarId} e ${prox.lugarId}`);
    const par = [v.lugarId, prox.lugarId].sort().join('>');
    const jaFeito = (vistos.get(par) ?? 0) > 0;
    vistos.set(par, (vistos.get(par) ?? 0) + 1);
    casas.push({
      tipo: 'trecho',
      i: casas.length,
      de: v.lugarId,
      para: prox.lugarId,
      trecho,
      volta: jaFeito,
      dia: diaDaTravessia(v.dias, prox.dias),
    });
  });

  return casas;
}

export const CASAS: Casa[] = construir();
export const VISITAS: Visita[] = CASAS.filter((c): c is Visita => c.tipo === 'visita');
export const N_CASAS = CASAS.length;

/** A rota geográfica: a sequência de lugares, para a curva no diorama. */
export const ROTA_LUGARES: string[] = VISITAS.map((v) => v.lugarId);

/** A casa (índice na fita) da primeira visita a um lugar. */
export function primeiraCasaDe(lugarId: string): number {
  return VISITAS.find((v) => v.lugarId === lugarId)?.i ?? 0;
}

/** A visita mais próxima do cursor, entre as várias a um mesmo lugar. */
export function casaMaisProxima(lugarId: string, cursor: number): number {
  const cands = VISITAS.filter((v) => v.lugarId === lugarId);
  if (!cands.length) return 0;
  return cands.reduce((a, b) => (Math.abs(b.i - cursor) < Math.abs(a.i - cursor) ? b : a)).i;
}

/** A casa em que um dia do roteiro acontece: o último lugar daquele dia. */
export function casaDoDia(dayId: string): number {
  const lugares = DIA_LUGARES[dayId] ?? [];
  const alvo = lugares[lugares.length - 1];
  if (!alvo) return 0;
  const cands = VISITAS.filter((v) => v.lugarId === alvo && v.dias.some((d) => d.id === dayId));
  return (cands[0] ?? VISITAS.find((v) => v.lugarId === alvo))?.i ?? 0;
}

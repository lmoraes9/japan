import { STAGES } from '@/data/trip';
import { DIAS_MAPA, type DiaMapa } from './dias';
import { baseDaNoite, vespera } from './bases';

/**
 * A linha da viagem, como ela acontece de verdade: cada dia sai da cama de
 * manhã, vai ao seu lugar e volta a uma cama à noite — a mesma, num
 * bate-volta como Kamakura ou Nara, ou outra, quando a viagem muda de
 * base. A ida leva a cor da etapa do dia; a volta, tracejada, a cor da
 * etapa em que se dorme. É isso que desenha as bases como estrelas, com os
 * bate-voltas em raios, e os trechos longos como as pontes entre elas.
 */
export interface PontoRota {
  lat: number;
  lng: number;
  cidadeId: string;
}

export interface Trecho {
  de: PontoRota;
  para: PontoRota;
  /** o dia em que se anda este trecho */
  dia: DiaMapa;
  cor: string;
  /** a volta para a cama no fim do dia */
  volta: boolean;
  /** [lng, lat] por onde a linha passa entre os dois, sem os extremos */
  passagens: [number, number][];
}

type LngLat = [number, number];

/** estações por onde o trem passa, para a linha seguir o trilho e não cortar o mar */
const YOKOHAMA: LngLat = [139.62, 35.44];
const ODAWARA: LngLat = [139.15, 35.25];
const SHIZUOKA: LngLat = [138.38, 34.97];
const NAGOYA: LngLat = [136.88, 35.17];
const KYOTO: LngLat = [135.76, 34.99];
const SHIN_OSAKA: LngLat = [135.5, 34.73];
const NAMBA: LngLat = [135.5, 34.66];
const OKAYAMA: LngLat = [133.92, 34.66];

/** a chave é 'origem>destino', por cidade; o inverso é lido de trás para frente */
const PASSAGENS: Record<string, LngLat[]> = {
  'tokyo>kamakura': [YOKOHAMA],
  'tokyo>hiroshima': [ODAWARA, SHIZUOKA, NAGOYA, KYOTO, SHIN_OSAKA, OKAYAMA],
  'hiroshima>himeji': [OKAYAMA],
  // a Nankai sobe a montanha a partir de Namba, e desce para lá
  'koyasan>kyoto': [NAMBA],
  'kyoto>tokyo': [NAGOYA, SHIZUOKA, ODAWARA],
};

function passagensEntre(a: string, b: string): LngLat[] {
  const direta = PASSAGENS[`${a}>${b}`];
  if (direta) return direta;
  const inversa = PASSAGENS[`${b}>${a}`];
  return inversa ? [...inversa].reverse() : [];
}

/** a cor da etapa em que o dia acontece */
export const corDaEtapa = (d: DiaMapa) => STAGES.find((s) => s.id === d.day.stageId)?.color ?? '#16324a';

export const TRECHOS: Trecho[] = DIAS_MAPA.flatMap((dia) => {
  const lugar: PontoRota = { lat: dia.lat, lng: dia.lng, cidadeId: dia.cidadeId };
  const acorda = baseDaNoite(vespera(dia.day.date));
  const dorme = baseDaNoite(dia.day.date);
  const out: Trecho[] = [];
  if (acorda) out.push({ de: acorda, para: lugar, dia, cor: corDaEtapa(dia), volta: false, passagens: passagensEntre(acorda.cidadeId, dia.cidadeId) });
  if (dorme) out.push({ de: lugar, para: dorme, dia, cor: dorme.cor, volta: true, passagens: passagensEntre(dia.cidadeId, dorme.cidadeId) });
  return out;
});

/** a distância entre dois pontos, em quilômetros, pela esfera */
function km(a: LngLat, b: LngLat): number {
  const R = 6371;
  const rad = Math.PI / 180;
  const dLat = (b[1] - a[1]) * rad;
  const dLng = (b[0] - a[0]) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** o comprimento de um trecho pelo caminho desenhado, em quilômetros */
export function kmDoTrecho(t: Trecho): number {
  const pontos: LngLat[] = [[t.de.lng, t.de.lat], ...t.passagens, [t.para.lng, t.para.lat]];
  let total = 0;
  for (let i = 1; i < pontos.length; i += 1) total += km(pontos[i - 1], pontos[i]);
  return total;
}

/** quantos quilômetros a viagem tem até o fim de um dia (todos, sem dia) */
export function kmAte(n = Infinity): number {
  return Math.round(TRECHOS.filter((t) => t.dia.n <= n).reduce((s, t) => s + kmDoTrecho(t), 0));
}

/**
 * O trem do dia, para o cartão: quando o dia muda de cidade, o que se pega,
 * quanto demora e quanto custa. É o resumo dos trechos em legs.ts, onde
 * estão a plataforma, o sentido e os avisos.
 */
export interface Movimento {
  trem: string;
  duracao: string;
  custo: string;
}

export const MOVIMENTOS: Record<string, Movimento> = {
  'd2026-11-20': { trem: 'JR Shōnan-Shinjuku', duracao: '55 min', custo: '¥950' },
  'd2026-11-23': { trem: 'Nozomi', duracao: '3h55', custo: '¥19.800' },
  'd2026-11-24': { trem: 'JR Sanyō e balsa', duracao: '40 min', custo: '¥720' },
  'd2026-11-25': { trem: 'Sakura até Himeji, Special Rapid até Osaka', duracao: '1h e 1h', custo: '~¥11.000' },
  'd2026-11-26': { trem: 'Nankai Kōya e funicular', duracao: '~1h50', custo: 'no passe' },
  'd2026-11-27': { trem: 'funicular, Nankai até Namba, JR até Kyoto', duracao: '~2h30', custo: 'no passe + ¥580' },
  'd2026-11-30': { trem: 'Kintetsu Limited Express', duracao: '35 min', custo: '¥1.280' },
  'd2026-12-01': { trem: 'Nozomi', duracao: '2h15', custo: '¥14.200' },
};

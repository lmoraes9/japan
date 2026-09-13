import { STAGES } from '@/data/trip';
import { DIAS_MAPA, type DiaMapa } from './dias';

/**
 * A linha da viagem: um trecho entre cada dia e o seguinte, na ordem.
 *
 * Cada trecho leva a cor da etapa em que ele chega. Um trecho que volta a uma
 * cidade por onde a viagem já passou é tracejado — Kamakura de volta a
 * Tóquio, Nara de volta a Kyoto, e o Shinkansen final, que corre pelo mesmo
 * Tōkaidō da ida. Tracejada, a volta não engole a ida no mapa.
 */
export interface Trecho {
  de: DiaMapa;
  para: DiaMapa;
  /** a cor da etapa do dia de chegada */
  cor: string;
  /** volta a uma cidade por onde a viagem já passou */
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
  'miyajima>himeji': [OKAYAMA],
  // a noite é em Osaka, e a Nankai sobe a montanha a partir de Namba
  'himeji>koyasan': [NAMBA],
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

export const TRECHOS: Trecho[] = DIAS_MAPA.slice(1).map((para, i) => {
  const de = DIAS_MAPA[i];
  return {
    de,
    para,
    cor: corDaEtapa(para),
    volta: DIAS_MAPA.some((d) => d.n < para.n && d.cidadeId === para.cidadeId),
    passagens: passagensEntre(de.cidadeId, para.cidadeId),
  };
});

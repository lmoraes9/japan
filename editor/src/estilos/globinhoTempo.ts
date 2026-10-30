/**
 * Linha do tempo do estilo "globinho" (sem React, para o render.ts poder usar).
 *
 * Neste estilo não há mapa em tela cheia: o fundo é sempre foto ou vídeo, e os
 * deslocamentos acontecem no globo do canto. Por isso o plano é remontado:
 * - mapa com fotos (os aeroportos do voo) → as fotos viram o fundo enquanto o
 *   avião cruza o globo;
 * - mapa sem fotos → some da linha do tempo; o trajeto anda no globo durante o
 *   começo do vídeo seguinte, que já mostra o lugar de chegada;
 * - fecho → mosaico com todos os lugares e o globo grande no meio.
 */
import { FPS, TRANSICAO, quadrosDe, type Plano, type SegClipe, type SegFim, type SegMapa } from '../plano.ts';

export interface ItemFundo {
  seg: SegClipe;
  ini: number;
  dur: number;
  /** onde foi feita a foto ou o vídeo [lng, lat], se se sabe */
  pos?: [number, number];
}

export interface Viagem {
  seg: SegMapa;
  ini: number;
  fim: number;
}

export interface LinhaGlobinho {
  itens: ItemFundo[];
  viagens: Viagem[];
  fecho?: { seg: SegFim; ini: number; dur: number };
  total: number;
}

export function linhaGlobinho(p: Plano): LinhaGlobinho {
  const itens: ItemFundo[] = [];
  const viagens: Viagem[] = [];
  let fecho: LinhaGlobinho['fecho'];
  let q = 0;
  let pendente: SegMapa | undefined;

  const empurra = (seg: SegClipe, dur: number, pos?: [number, number]) => {
    itens.push({ seg, ini: q, dur, pos });
    q += dur - TRANSICAO;
  };

  for (const s of p.segmentos) {
    if (s.tipo === 'mapa') {
      const fotos = s.pontos.filter((pt) => pt.foto);
      if (fotos.length) {
        const total = quadrosDe(s);
        viagens.push({ seg: s, ini: q, fim: q + Math.round(total * 0.92) });
        const cada = Math.round((total + TRANSICAO * (fotos.length - 1)) / fotos.length);
        fotos.forEach((pt) => empurra({ tipo: 'clipe', arquivo: pt.foto!, segundos: cada / FPS }, cada, [pt.lng, pt.lat]));
      } else {
        pendente = s;
      }
    } else if (s.tipo === 'clipe') {
      let dur = quadrosDe(s);
      if (pendente) {
        if (p.estilo === 'globinho-viagem') {
          // o globo vai ao meio e volta, então o trajeto leva o tempo inteiro do mapa:
          // começa no fim do vídeo anterior (saindo de lá) e termina no de chegada,
          // deixando pelo menos 1 s do lugar novo com o globo de volta no canto.
          // A foto de chegada espera o quanto precisar; o vídeo tem o tamanho que tem.
          const quer = Math.round(pendente.segundos * FPS);
          const anterior = itens[itens.length - 1];
          // e 1,5 s do lugar anterior no canto, desde a viagem de antes
          const livre = q - ((viagens[viagens.length - 1]?.fim ?? 0) + 45);
          const antes = Math.max(0, Math.min(Math.round(quer * 0.4), livre, anterior ? Math.round(anterior.dur * 0.5) : 0));
          if (s.de === undefined) dur = Math.max(dur, quer - antes + 40);
          viagens.push({ seg: pendente, ini: q - antes, fim: q - antes + Math.min(quer, antes + dur - 40) });
        } else {
          // o trajeto ocupa o começo do vídeo de chegada
          const len = Math.min(Math.round(pendente.segundos * FPS * 0.65), Math.round(dur * 0.62));
          viagens.push({ seg: pendente, ini: q, fim: q + len });
        }
        pendente = undefined;
      }
      empurra(s, dur, s.lugar?.lat !== undefined && s.lugar.lng !== undefined ? [s.lugar.lng, s.lugar.lat] : undefined);
    } else {
      const dur = quadrosDe(s);
      fecho = { seg: s, ini: q, dur };
      q += dur;
    }
  }
  const total = fecho ? q : q + TRANSICAO;
  return { itens, viagens, fecho, total };
}

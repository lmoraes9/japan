/**
 * Duração do vídeo e quadros de prévia por estilo. Sem React nem CSS, porque o
 * render.ts (Node) também usa.
 */
import { TRANSICAO, duracaoTotal, quadrosDe, type Plano } from '../plano.ts';
import { linhaGlobinho } from './globinhoTempo.ts';

export function duracaoDoReel(p: Plano): number {
  return p.estilo?.startsWith('globinho') ? linhaGlobinho(p).total : duracaoTotal(p);
}

/** um quadro representativo de cada trecho, para a prévia lado a lado */
export function amostras(p: Plano): number[] {
  if (p.estilo?.startsWith('globinho')) {
    const l = linhaGlobinho(p);
    const q = l.itens.map((it) => it.ini + Math.round(it.dur * 0.5));
    // nos vídeos com trajeto, mostra também o globo no meio do caminho
    l.viagens.forEach((v) => q.push(Math.round((v.ini + v.fim) / 2)));
    if (l.fecho) q.push(l.fecho.ini + Math.round(l.fecho.dur * 0.7));
    return q.sort((a, b) => a - b);
  }
  const out: number[] = [];
  let ini = 0;
  for (const s of p.segmentos) {
    const n = quadrosDe(s);
    out.push(ini + Math.round(n * (s.tipo === 'clipe' ? 0.55 : 0.7)));
    ini += n - TRANSICAO;
  }
  return out;
}

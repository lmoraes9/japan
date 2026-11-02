/**
 * Primeiro corte automático: lê trabalho/catalogo.json e monta um plano com um
 * mapa a cada mudança de lugar e um trecho de cada vídeo. É só o ponto de
 * partida — o Claude revisa olhando as folhas de contato, acerta os cortes,
 * escreve as notas e salva como trabalho/plano.json.
 *
 *   npm run rascunho [-- --dia 2026-11-23]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import type { Midia } from './lib/catalogo.ts';
import { montar } from './lib/montar.ts';
import type { Plano } from '../src/plano.ts';

const arg = (n: string) => {
  const i = process.argv.indexOf(n);
  return i > 0 ? process.argv[i + 1] : undefined;
};

const lido = JSON.parse(readFileSync('trabalho/catalogo.json', 'utf8')) as Midia[];
const catalogo = lido.filter((m) => m.lugar && m.quando);
const soDia = arg('--dia');
const midias = soDia ? catalogo.filter((m) => m.quando!.startsWith(soDia)) : catalogo;

const semLugar = lido.filter((m) => !m.lugar || !m.quando);
if (semLugar.length) console.log(`sem lugar nem hora, ficaram de fora: ${semLugar.map((m) => m.arquivo).join(', ')}\n`);

const segs = montar(midias);

const plano: Plano = { titulo: soDia ? `dia ${soDia}` : 'rascunho', formato: 'reel', segmentos: segs };
writeFileSync('trabalho/plano-rascunho.json', JSON.stringify(plano, null, 2));
console.log(`${segs.length} segmentos → trabalho/plano-rascunho.json`);
for (const s of segs) console.log(' ·', s.tipo === 'mapa' ? `mapa ${s.escala}: ${s.titulo} (${s.modos.join('+')}) ${s.legenda ?? ''}` : s.tipo === 'clipe' ? `clipe ${s.arquivo} ${s.de ?? ''}–${s.ate ?? ''}${s.nota ? ' + nota' : ''}` : `fim ${s.titulo}`);

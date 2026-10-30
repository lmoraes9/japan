/**
 * Renderiza um plano em mp4.
 *
 *   npm run render -- trabalho/plano.json            → saida/<titulo>.mp4
 *   npm run render -- trabalho/plano.json --previa   → saida/<titulo>-previa.jpg
 *     (um quadro do meio de cada segmento, lado a lado: para conferir antes do render longo)
 *   npm run render -- trabalho/plano.json --quadros 30,60,90
 *     (esses quadros específicos, lado a lado — para olhar uma animação de perto)
 *   --estilo outono   troca o visual (noite, outono, caderno, ukiyoe, linha, aovivo, globinho)
 */
import { copyFileSync, existsSync, linkSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { FPS, type Estilo, type Plano } from '../src/plano.ts';
import { amostras } from '../src/estilos/tempos.ts';
import { ffmpeg, navegador } from './lib/ferramentas.ts';

const args = process.argv.slice(2);
const valor = (flag: string) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const COM_VALOR = new Set(['--quadros', '--estilo']);
const arquivoPlano = args.find((a, i) => !a.startsWith('--') && !COM_VALOR.has(args[i - 1])) ?? 'trabalho/plano.json';
const quadrosPedidos = valor('--quadros')?.split(',').map(Number);
const previa = args.includes('--previa') || !!quadrosPedidos;
const plano = JSON.parse(readFileSync(arquivoPlano, 'utf8')) as Plano;
const estilo = (valor('--estilo') as Estilo | undefined) ?? plano.estilo;
if (estilo) plano.estilo = estilo;
const nome = [plano.titulo, estilo].filter(Boolean).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w-]+/g, '-').toLowerCase();

// pasta pública só com o que o plano usa (hard link quando dá, para não copiar gigas)
// uma pasta por render, para dois renders em paralelo não se atropelarem
const publico = resolve(`trabalho/publico-${nome}${previa ? '-previa' : ''}`);
rmSync(publico, { recursive: true, force: true });
const usados = new Set<string>();
for (const s of plano.segmentos) {
  if (s.tipo === 'clipe') usados.add(s.arquivo);
  if (s.tipo === 'mapa' || s.tipo === 'fim') s.pontos.forEach((p) => p.foto && usados.add(p.foto));
}
if (plano.trilha) usados.add(plano.trilha);
for (const u of usados) {
  if (!existsSync(u)) throw new Error(`arquivo do plano não existe: ${u}`);
  const destino = join(publico, u);
  mkdirSync(dirname(destino), { recursive: true });
  try {
    linkSync(u, destino);
  } catch {
    copyFileSync(u, destino);
  }
}

const serveUrl = await bundle({ entryPoint: resolve('src/index.ts'), publicDir: publico });
const inputProps = plano as unknown as Record<string, unknown>;
const composition = await selectComposition({ serveUrl, id: 'Reel', inputProps, browserExecutable: navegador });
mkdirSync('saida', { recursive: true });

if (previa) {
  const quadros: string[] = [];
  for (const [i, q] of (quadrosPedidos ?? amostras(plano)).entries()) {
    const out = join('trabalho', `previa-${i}.png`);
    await renderStill({ composition, serveUrl, inputProps, frame: Math.min(q, composition.durationInFrames - 1), output: out, scale: 0.25, browserExecutable: navegador });
    quadros.push(out);
  }
  const colunas = Math.min(6, quadros.length);
  const linhas = Math.ceil(quadros.length / colunas);
  const vazios = colunas * linhas - quadros.length;
  const ins = quadros.flatMap((q) => ['-i', q]);
  const pads = Array.from({ length: vazios }, () => ['-f', 'lavfi', '-i', 'color=c=black:s=270x480']).flat();
  const total = quadros.length + vazios;
  ffmpeg([...ins, ...pads, '-filter_complex', `xstack=inputs=${total}:layout=${Array.from({ length: total }, (_, k) => `${(k % colunas) * 270}_${Math.floor(k / colunas) * 480}`).join('|')}`, '-frames:v', '1', '-update', '1', join('saida', `${nome}-previa.jpg`)]);
  quadros.forEach((q) => rmSync(q));
  console.log(`saida/${nome}-previa.jpg`);
} else {
  const out = join('saida', `${nome}.mp4`);
  let ultimo = -1;
  await renderMedia({
    composition,
    serveUrl,
    inputProps,
    codec: 'h264',
    crf: 20,
    // o cache de quadros de vídeo cresce sem limite e derruba o PC por falta de memória
    offthreadVideoCacheSizeInBytes: 512 * 1024 * 1024,
    concurrency: 2,
    outputLocation: out,
    browserExecutable: navegador,
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 10);
      if (p !== ultimo) {
        ultimo = p;
        process.stdout.write(`${p * 10}% `);
      }
    },
  });
  console.log(`\n${out} · ${(composition.durationInFrames / FPS).toFixed(1)} s`);
}

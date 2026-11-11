/**
 * Renderiza o edit avulso "Preparando o Natal" (composição Natal, visual próprio, nada da viagem).
 *
 *   npm run natal -- trabalho/natal.json            → saida/natal.mp4
 *   npm run natal -- trabalho/natal.json --previa   → saida/natal-previa.jpg (um quadro por cena)
 */
import { copyFileSync, existsSync, linkSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import type { PlanoNatal } from '../src/natal/Natal.tsx';
const FPS_NATAL = 30;
import { ffmpeg, navegador } from './lib/ferramentas.ts';

const args = process.argv.slice(2);
const arquivo = args.find((a) => !a.startsWith('--')) ?? 'trabalho/natal.json';
const previa = args.includes('--previa');
const plano = JSON.parse(readFileSync(arquivo, 'utf8')) as PlanoNatal;

const publico = resolve(`trabalho/publico-natal${previa ? '-previa' : ''}`);
rmSync(publico, { recursive: true, force: true });
for (const u of [...plano.itens.map((i) => i.arquivo), ...(plano.trilha ? [plano.trilha] : [])]) {
  if (!existsSync(u)) throw new Error(`não existe: ${u}`);
  const d = join(publico, u);
  mkdirSync(dirname(d), { recursive: true });
  try {
    linkSync(u, d);
  } catch {
    copyFileSync(u, d);
  }
}

const serveUrl = await bundle({ entryPoint: resolve('src/index.ts'), publicDir: publico });
const inputProps = plano as unknown as Record<string, unknown>;
const composition = await selectComposition({ serveUrl, id: 'Natal', inputProps, browserExecutable: navegador });
mkdirSync('saida', { recursive: true });

if (previa) {
  // meio de cada cena (o cartão de abertura e o de fim entram também)
  const TRANS = 12;
  const marcos: number[] = [];
  let t = Math.round((plano.intro ?? 2.6) * FPS_NATAL);
  marcos.push(40);
  for (const i of plano.itens) {
    const n = Math.round(i.dur * FPS_NATAL);
    marcos.push(t - TRANS + Math.round(n / 2));
    t += n - TRANS;
  }
  marcos.push(composition.durationInFrames - 20);
  const quadros: string[] = [];
  for (const [k, q] of marcos.entries()) {
    const out = join('trabalho', `previa-natal-${k}.png`);
    await renderStill({ composition, serveUrl, inputProps, frame: Math.min(q, composition.durationInFrames - 1), output: out, scale: 0.25, browserExecutable: navegador });
    quadros.push(out);
  }
  const col = Math.min(6, quadros.length);
  const lin = Math.ceil(quadros.length / col);
  const pads = Array.from({ length: col * lin - quadros.length }, () => ['-f', 'lavfi', '-i', 'color=c=black:s=270x480']).flat();
  const total = col * lin;
  const layout = Array.from({ length: total }, (_, k) => `${(k % col) * 270}_${Math.floor(k / col) * 480}`).join('|');
  ffmpeg([...quadros.flatMap((q) => ['-i', q]), ...pads, '-filter_complex', `xstack=inputs=${total}:layout=${layout}`, '-frames:v', '1', '-update', '1', join('saida', 'natal-previa.jpg')]);
  quadros.forEach((q) => rmSync(q));
  console.log('saida/natal-previa.jpg');
} else {
  const out = join('saida', 'natal.mp4');
  let ultimo = -1;
  await renderMedia({
    composition,
    serveUrl,
    inputProps,
    codec: 'h264',
    crf: 20,
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
  console.log(`\n${out} · ${(composition.durationInFrames / FPS_NATAL).toFixed(1)} s`);
}
rmSync(serveUrl, { recursive: true, force: true });

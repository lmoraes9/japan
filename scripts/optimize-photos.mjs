#!/usr/bin/env node
/**
 * Recomprime as fotos de public/lugares e gera as miniaturas usadas nos
 * marcadores dos mapas e nas capas do roteiro.
 *
 *   node scripts/optimize-photos.mjs
 *
 * - fotos de mapa: até 1200px, qualidade 78
 * - fotos de parada: até 960px, qualidade 76
 * - miniatura <id>.thumb.jpg: 160px quadrada, cortada ao centro, qualidade 72
 *
 * Precisa do sharp (npm i -D sharp). Idempotente: só mexe no que ainda está
 * acima do tamanho-alvo ou sem miniatura.
 */
import { readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = join(ROOT, 'public/lugares');

const LIMITE = { stops: { w: 960, q: 76 }, mapa: { w: 1200, q: 78 } };
const THUMB = { w: 160, q: 72 };

let recomprimidas = 0, thumbs = 0, antes = 0, depois = 0;

for (const grupo of await readdir(BASE)) {
  const dir = join(BASE, grupo);
  if (!(await stat(dir)).isDirectory()) continue;
  const alvo = grupo === 'stops' ? LIMITE.stops : LIMITE.mapa;

  for (const arquivo of await readdir(dir)) {
    if (!arquivo.endsWith('.jpg') || arquivo.endsWith('.thumb.jpg')) continue;
    const caminho = join(dir, arquivo);
    const tamanho = (await stat(caminho)).size;
    antes += tamanho;
    const meta = await sharp(caminho).metadata();

    // recomprime se estiver largo demais ou pesado demais para a largura
    if (meta.width > alvo.w || tamanho > alvo.w * 220) {
      const buf = await sharp(caminho)
        .rotate()
        .resize({ width: alvo.w, withoutEnlargement: true })
        .jpeg({ quality: alvo.q, mozjpeg: true })
        .toBuffer();
      await sharp(buf).toFile(caminho);
      recomprimidas++;
      depois += buf.length;
    } else {
      depois += tamanho;
    }

    const thumb = caminho.replace(/\.jpg$/, '.thumb.jpg');
    try {
      await stat(thumb);
    } catch {
      await sharp(caminho)
        .rotate()
        .resize({ width: THUMB.w, height: THUMB.w, fit: 'cover', position: 'attention' })
        .jpeg({ quality: THUMB.q, mozjpeg: true })
        .toFile(thumb);
      thumbs++;
    }
  }
}

const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
console.log(`${recomprimidas} recomprimida(s): ${mb(antes)} → ${mb(depois)} · ${thumbs} miniatura(s) nova(s)`);

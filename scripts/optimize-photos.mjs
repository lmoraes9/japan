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
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
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
    const nascida = (await stat(caminho)).mtimeMs;
    // lemos o arquivo inteiro de uma vez: dando o caminho ao sharp, o libvips
    // o mantém aberto para leitura preguiçosa e a gravação por cima falha
    let atual = await readFile(caminho);
    antes += atual.length;
    const meta = await sharp(atual).metadata();

    // recomprime se estiver largo demais ou pesado demais para a largura
    const larga = meta.width > alvo.w;
    if (larga || atual.length > alvo.w * 220) {
      // `buf` já sai como o JPEG final; passá-lo pelo sharp outra vez para
      // gravar o reencodaria na qualidade padrão, jogando fora o `alvo.q`
      const buf = await sharp(atual)
        .rotate()
        .resize({ width: alvo.w, withoutEnlargement: true })
        .jpeg({ quality: alvo.q, mozjpeg: true })
        .toBuffer();
      // Uma foto detalhada continua acima do limite de bytes mesmo já estando
      // na largura certa — e aí toda passada a reencodava outra vez, perdendo
      // qualidade de graça. Só vale reescrever por redimensionamento ou por um
      // ganho que justifique a perda.
      if (larga || buf.length <= atual.length * 0.9) {
        await writeFile(caminho, buf);
        atual = buf;
        recomprimidas++;
      }
    }
    depois += atual.length;

    const thumb = caminho.replace(/\.jpg$/, '.thumb.jpg');
    // miniatura mais velha que a foto é miniatura de outra foto: depois de um
    // `fotos --force` a imagem muda e a miniatura antiga ficava no lugar
    let precisa = true;
    try {
      precisa = (await stat(thumb)).mtimeMs < nascida;
    } catch {
      /* ainda não existe */
    }
    if (precisa) {
      await writeFile(
        thumb,
        await sharp(atual)
          .rotate()
          .resize({ width: THUMB.w, height: THUMB.w, fit: 'cover', position: 'attention' })
          .jpeg({ quality: THUMB.q, mozjpeg: true })
          .toBuffer(),
      );
      thumbs++;
    }
  }
}

const mb = (n) => (n / 1048576).toFixed(1) + ' MB';
console.log(`${recomprimidas} recomprimida(s): ${mb(antes)} → ${mb(depois)} · ${thumbs} miniatura(s) nova(s)`);

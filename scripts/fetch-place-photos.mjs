#!/usr/bin/env node
/**
 * Baixa uma foto de licença livre do Wikimedia Commons para cada ponto dos
 * mapas ilustrados e gera src/data/placePhotos.generated.ts com os créditos.
 *
 *   node scripts/fetch-place-photos.mjs                 # só o que falta
 *   node scripts/fetch-place-photos.mjs --force         # rebaixa tudo
 *   node scripts/fetch-place-photos.mjs --only fushimi-inari
 *
 * As buscas ficam em scripts/photo-queries.json — troque a frase de busca e
 * rode de novo com --force se a foto escolhida não agradar. Para usar uma foto
 * própria, é só salvar por cima de public/lugares/<mapa>/<ponto>.jpg e apagar
 * a linha correspondente do arquivo gerado (aí ela fica sem crédito).
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_TS = join(ROOT, 'src/data/placePhotos.generated.ts');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'japao2026-trip-app/1.0 (uso pessoal; contato via repositório)';
const WIDTH = 1200;

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

const exists = (p) => access(p).then(() => true, () => false);
const stripTags = (html) =>
  String(html ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

async function search(query) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6', // File:
    gsrlimit: '12',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: String(WIDTH),
  }).toString();

  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Commons respondeu ${res.status}`);
  const json = await res.json();
  const pages = Object.values(json.query?.pages ?? {});
  const candidates = pages
    .map((p) => ({ title: p.title, info: p.imageinfo?.[0] }))
    .filter(({ info }) => info && /image\/(jpeg|png)/.test(info.mime));

  // ordem da busca é a relevância do Commons; primeiro tentamos o que é bonito
  // numa tela larga, e só depois aceitamos qualquer coisa que preste
  const bom = candidates
    .filter(({ info }) => info.width >= 1000 && info.width >= info.height * 0.6)
    .filter(({ title }) => !/(map|diagram|plan|logo|icon|stamp)/i.test(title));
  const aceitavel = candidates.filter(({ info }) => info.width >= 700);
  return bom.length ? bom : aceitavel;
}

/** tenta cada frase de busca até uma trazer resultado */
async function searchAny(queries) {
  for (const q of queries) {
    const hits = await search(q);
    if (hits.length) return { hit: hits[0], usedQuery: q };
    await new Promise((r) => setTimeout(r, 250));
  }
  return null;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

const queries = JSON.parse(await readFile(join(ROOT, 'scripts/photo-queries.json'), 'utf8'));
const entries = Object.entries(queries).filter(([k]) => !k.startsWith('_'));

/** carrega os créditos já existentes para não perder o que não vamos rebaixar */
let current = {};
if (await exists(OUT_TS)) {
  const src = await readFile(OUT_TS, 'utf8');
  const match = src.match(/=\s*(\{[\s\S]*\})\s*;?\s*$/);
  if (match) {
    try {
      current = JSON.parse(match[1].replace(/,(\s*[}\]])/g, '$1'));
    } catch {
      current = {};
    }
  }
}

for (const [key, query] of entries) {
  const [mapId, hotspotId] = key.split('/');
  if (only && mapId !== only) continue;

  const rel = `lugares/${mapId}/${hotspotId}.jpg`;
  const dest = join(ROOT, 'public', rel);
  if (!force && current[key] && (await exists(dest))) {
    console.log(`· ${key} — já tem, pulando`);
    continue;
  }

  const tentativas = Array.isArray(query) ? query : [query];
  try {
    const found = await searchAny(tentativas);
    if (!found) {
      console.warn(`! ${key} — nada encontrado para ${tentativas.map((q) => `"${q}"`).join(' / ')}`);
      continue;
    }
    const best = found.hit;
    const meta = best.info.extmetadata ?? {};
    await download(best.info.thumburl, dest);
    current[key] = {
      src: `/${rel}`,
      credit: stripTags(meta.Artist?.value) || 'autor não identificado',
      license: stripTags(meta.LicenseShortName?.value) || 'ver página no Commons',
      source: best.info.descriptionurl,
      title: best.title.replace(/^File:/, ''),
    };
    console.log(`✓ ${key} — ${current[key].title}`);
  } catch (err) {
    console.warn(`! ${key} — ${err.message}`);
  }
  await new Promise((r) => setTimeout(r, 400)); // gentileza com a API
}

const sorted = Object.fromEntries(Object.entries(current).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(
  OUT_TS,
  `// GERADO por scripts/fetch-place-photos.mjs — não editar à mão.\n` +
    `// Fotos do Wikimedia Commons; o crédito e a licença aparecem embaixo de cada foto no app.\n` +
    `import type { PlacePhoto } from './placeMaps';\n\n` +
    `export const PLACE_PHOTOS: Record<string, PlacePhoto> = ${JSON.stringify(sorted, null, 2)};\n`,
  'utf8',
);
console.log(`\nEscrito ${OUT_TS} com ${Object.keys(sorted).length} foto(s).`);

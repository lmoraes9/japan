#!/usr/bin/env node
/**
 * Baixa uma foto de licença livre do Wikimedia Commons para cada ponto dos
 * mapas ilustrados e gera src/data/placePhotos.generated.ts com os créditos.
 *
 *   node scripts/fetch-place-photos.mjs                 # só o que falta
 *   node scripts/fetch-place-photos.mjs --force         # rebaixa tudo
 *   node scripts/fetch-place-photos.mjs --only fushimi-inari
 *   node scripts/fetch-place-photos.mjs --force --only stops/d02-jimbocho
 *
 * As buscas ficam em scripts/photo-queries.json — troque a frase de busca e
 * rode de novo com --force se a foto escolhida não agradar. Para usar uma foto
 * própria, é só salvar por cima de public/lugares/<mapa>/<ponto>.jpg e apagar
 * a linha correspondente do arquivo gerado (aí ela fica sem crédito).
 */
import { mkdir, writeFile, readFile, access, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_TS = join(ROOT, 'src/data/placePhotos.generated.ts');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'japao2026-trip-app/1.0 (uso pessoal; contato via repositório)';
/** conexão pendurada trava o script inteiro — nenhuma requisição espera além disso */
const TIMEOUT = 20_000;
/** o Commons devolve 429 se apertarmos: um pedido por vez, ~1 por segundo */
const INTERVALO = 1100;
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

let ultima = 0;
async function buscar(url, tentativa = 0) {
  const desde = Date.now() - ultima;
  if (desde < INTERVALO) await espera(INTERVALO - desde);
  ultima = Date.now();

  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(TIMEOUT),
  });

  // 429 (limite de requisições) e 503 (servidor ocupado) pedem paciência, não desistência
  if ((res.status === 429 || res.status === 503) && tentativa < 4) {
    const sugerido = Number(res.headers.get('retry-after')) * 1000;
    const pausa = Number.isFinite(sugerido) && sugerido > 0 ? sugerido : 2000 * 2 ** tentativa;
    console.log(`  (${res.status} do Commons; esperando ${Math.round(pausa / 1000)}s)`);
    await espera(pausa);
    return buscar(url, tentativa + 1);
  }
  return res;
}
/** largura do thumb: os mapas ganham foto maior; as paradas do roteiro, menor */
const WIDTH_MAPA = 1200;
const WIDTH_PARADA = 800;

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

/**
 * Palavras que não identificam lugar nenhum: se a régua aceitasse "buddha" ou
 * "temple", o Commons devolveria um Buda coreano para "o Grande Buda de Nara".
 */
const GENERICAS = new Set(
  ('shrine temple park station street great buddha pond gate statue summit shop shops ' +
   'tower museum garden market hall main mount view city japan japanese kyoto tokyo osaka ' +
   'grand sando dori building house street food ropeway ferry deer lantern fox key').split(' '),
);

/** gravuras, pinturas e mapas de museu não servem como foto do lugar */
const NAO_E_FOTO =
  /(map|diagram|plan|logo|icon|stamp|hiroshige|hokusai|ukiyo|woodblock|print|painting|drawing|engraving|titel op object|AK-MAK|RP-P-|浮世絵|錦絵|版画|絵図|五十三次|三十六景|名所|之図|の図|広重|北斎|画|views of|from the series|MET DP|Rijksmuseum|collection of the)/i;

/**
 * Muitos santuários têm xarás pelo país (há um 厳島神社 em Kushiro, Hokkaidō).
 * Quando o título traz a cidade entre parênteses — "(釧路市)" — ela precisa
 * ser uma cidade do roteiro daquele grupo/dia; senão é outro lugar.
 */
const CIDADES = {
  tokyo: ['東京', '台東', '墨田', '千代田', '中央区', '港区', '新宿', '渋谷', '鎌倉', '江東', 'tokyo', 'kamakura', 'asakusa'],
  hiroshima: ['広島', '廿日市', '宮島', 'hiroshima', 'miyajima', 'hatsukaichi'],
  osaka: ['大阪', '姫路', '倉敷', 'osaka', 'himeji', 'kurashiki'],
  kyoto: ['京都', '奈良', '伏見', '宇治', 'kyoto', 'nara', 'fushimi'],
};
const cidadesDe = (key) => {
  const [grupo, item] = key.split('/');
  if (grupo === 'sensoji' || grupo === 'meiji-jingu' || grupo === 'kamakura') return CIDADES.tokyo;
  if (grupo === 'miyajima' || grupo === 'parque-da-paz') return CIDADES.hiroshima;
  if (grupo === 'himeji') return CIDADES.osaka;
  if (grupo === 'nara' || grupo === 'fushimi-inari' || grupo === 'higashiyama' || grupo === 'arashiyama') return CIDADES.kyoto;
  if (grupo === 'stops') {
    const dia = Number(item.match(/^d(\d\d)/)?.[1]);
    if (dia >= 18 && dia <= 22) return CIDADES.tokyo;
    if (dia === 23 || dia === 24) return CIDADES.hiroshima;
    if (dia === 25 || dia === 26) return CIDADES.osaka;
    if (dia >= 27 || dia === 1) return CIDADES.kyoto;
    return CIDADES.tokyo; // 2 e 3 de dezembro
  }
  return null; // konbini, extras: sem restrição
};
const cidadeBate = (titulo, cidades) => {
  if (!cidades) return true;
  const m = titulo.match(/[（(]([^()（）]*?[市区町村])[)）]/);
  if (!m) return true;
  const t = m[1].toLowerCase();
  return cidades.some((c) => t.includes(c.toLowerCase()));
};

const normalizar = (t) =>
  t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[-_,.()]/g, ' ');

/** termos que identificam o lugar: nomes próprios em latim e bigramas de kanji/kana */
function termosDe(queries) {
  const termos = new Set();
  for (const q of queries) {
    for (const bloco of q.match(/[\u3040-\u30ff\u4e00-\u9fff]{2,}/g) ?? []) {
      for (let i = 0; i + 2 <= bloco.length; i++) termos.add(bloco.slice(i, i + 2));
    }
    for (const palavra of normalizar(q).match(/[a-z][a-z']{3,}/g) ?? []) {
      if (!GENERICAS.has(palavra)) termos.add(palavra);
    }
  }
  return [...termos];
}

/** o título do arquivo precisa citar o lugar de alguma forma */
const combina = (titulo, termos) => {
  if (!termos.length) return true;
  const t = normalizar(titulo);
  return termos.some((termo) => t.includes(normalizar(termo)));
};

async function search(query, width, termos, cidades) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: query,
    gsrnamespace: '6', // File:
    gsrlimit: '8',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: String(width),
  }).toString();

  const res = await buscar(url);
  if (!res.ok) throw new Error(`Commons respondeu ${res.status}`);
  const json = await res.json();
  const pages = Object.values(json.query?.pages ?? {});
  const candidates = pages
    .map((p) => ({ title: p.title, info: p.imageinfo?.[0] }))
    .filter(({ info }) => info && /image\/(jpeg|png)/.test(info.mime));

  // ordem da busca é a relevância do Commons; primeiro tentamos o que é bonito
  // numa tela larga, e só depois aceitamos qualquer coisa que preste
  // foto errada é pior que ponto sem foto
  const doLugar = candidates.filter(({ title }) => combina(title, termos) && cidadeBate(title, cidades));

  const bom = doLugar
    .filter(({ info }) => info.width >= 1000 && info.width >= info.height * 0.6)
    .filter(({ title }) => !NAO_E_FOTO.test(title));
  const aceitavel = doLugar.filter(({ info }) => info.width >= 700 && !NAO_E_FOTO.test(info.title ?? ''));
  return bom.length ? bom : aceitavel;
}

/** tenta cada frase de busca até uma trazer resultado ainda não usado */
async function searchAny(queries, usados, width, cidades) {
  const termos = termosDe(queries);
  let repetido = null;
  for (const q of queries) {
    let hits = [];
    try {
      hits = await search(q, width, termos, cidades);
    } catch (err) {
      console.warn(`  (busca "${q}" falhou: ${err.message})`);
    }
    const novo = hits.find((h) => !usados.has(h.title));
    if (novo) return { hit: novo, usedQuery: q };
    if (!repetido && hits.length) repetido = { hit: hits[0], usedQuery: q };
  }
  // se todas as buscas só trouxeram fotos já usadas, é melhor ponto sem foto
  // do que a mesma imagem aparecendo duas vezes no mesmo mapa
  return repetido ? { ...repetido, duplicada: true } : null;
}

async function download(url, dest) {
  const res = await buscar(url);
  if (!res.ok) throw new Error(`download ${res.status}`);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

async function escreverGerado(mapa) {
  const sorted = Object.fromEntries(Object.entries(mapa).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(
    OUT_TS,
    `// GERADO por scripts/fetch-place-photos.mjs — não editar à mão.\n` +
      `// Fotos do Wikimedia Commons; o crédito e a licença aparecem embaixo de cada foto no app.\n` +
      `import type { PlacePhoto } from './placeMaps';\n\n` +
      `export const PLACE_PHOTOS: Record<string, PlacePhoto> = ${JSON.stringify(sorted, null, 2)};\n`,
    'utf8',
  );
}

/** títulos já usados por grupo (um mapa, ou as paradas do roteiro) */
const usadosPor = new Map();
const usadosDe = (grupo) => {
  if (!usadosPor.has(grupo)) usadosPor.set(grupo, new Set());
  return usadosPor.get(grupo);
};

const queries = JSON.parse(await readFile(join(ROOT, 'scripts/photo-queries.json'), 'utf8'));
const entries = Object.entries(queries).filter(([k]) => !k.startsWith('_'));
const validar = args.includes('--validar');

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

if (validar) {
  // revê o que já está baixado com a régua de relevância, sem tocar na rede
  let removidas = 0;
  for (const [key, query] of entries) {
    const atual = current[key];
    if (!atual) continue;
    const termos = termosDe(Array.isArray(query) ? query : [query]);
    if (combina(atual.title, termos) && !NAO_E_FOTO.test(atual.title) && cidadeBate(atual.title, cidadesDe(key))) continue;
    console.log(`✗ ${key} — "${atual.title}" não parece ser do lugar; removida`);
    delete current[key];
    await rm(join(ROOT, 'public', `lugares/${key.split('/')[0]}/${key.split('/')[1]}.jpg`), { force: true });
    removidas++;
  }
  await escreverGerado(current);
  console.log(`\n${removidas} foto(s) removida(s). Rode sem --validar para rebaixar.`);
  process.exit(0);
}

for (const [key, query] of entries) {
  const [grupo, itemId] = key.split('/');
  // --only aceita um grupo inteiro ('nara') ou um ponto só ('stops/d02-jimbocho')
  if (only && only !== grupo && only !== key) continue;
  const usados = usadosDe(grupo);
  const width = grupo === 'stops' ? WIDTH_PARADA : WIDTH_MAPA;

  const rel = `lugares/${grupo}/${itemId}.jpg`;
  const dest = join(ROOT, 'public', rel);
  if (!force && current[key] && (await exists(dest))) {
    usados.add(current[key].title);
    console.log(`· ${key} — já tem, pulando`);
    continue;
  }

  const tentativas = Array.isArray(query) ? query : [query];
  try {
    const found = await searchAny(tentativas, usados, width, cidadesDe(key));
    if (found?.duplicada) {
      console.warn(`! ${key} — só achou fotos já usadas neste grupo; melhore a busca`);
      continue;
    }
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
    usados.add(current[key].title);
    console.log(`✓ ${key} — ${current[key].title}`);
  } catch (err) {
    console.warn(`! ${key} — ${err.message}`);
  }
}

await escreverGerado(current);
console.log(`\nEscrito ${OUT_TS} com ${Object.keys(current).length} foto(s).`);

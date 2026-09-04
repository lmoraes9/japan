#!/usr/bin/env node
/**
 * Lê os arquivos de dias do roteiro e monta, para cada parada que tem
 * mapQuery, a busca de foto correspondente em scripts/photo-queries.json
 * (chave `stops/<id da parada>`). Rode depois de mexer no roteiro:
 *
 *   node scripts/gen-stop-queries.mjs
 *
 * Buscas ajustadas à mão são preservadas — o gerador só acrescenta as que
 * ainda não existem. Para refazer uma, apague a linha e rode de novo.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DAYS = join(ROOT, 'src/data/days');
const QUERIES = join(ROOT, 'scripts/photo-queries.json');

/** pares (id da parada, mapQuery) na ordem em que aparecem no arquivo */
function extrair(src) {
  const pares = [];
  const re = /\bid: '([^']+)'|\bmapQuery: '([^']+)'|\bname: '((?:[^'\\]|\\.)*)'/g;
  let atual = null;
  for (const m of src.matchAll(re)) {
    if (m[1]) atual = { id: m[1], name: null };
    else if (m[3] && atual && !atual.name) atual.name = m[3];
    else if (m[2] && atual) {
      pares.push({ id: atual.id, query: m[2], name: atual.name });
      atual = null;
    }
  }
  return pares;
}

const arquivos = (await readdir(DAYS)).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
const queries = JSON.parse(await readFile(QUERIES, 'utf8'));

let novos = 0;
for (const arq of arquivos) {
  const src = await readFile(join(DAYS, arq), 'utf8');
  for (const { id, query } of extrair(src)) {
    const key = `stops/${id}`;
    if (queries[key]) continue;
    queries[key] = query;
    novos++;
  }
}

const ordenado = Object.fromEntries(
  Object.entries(queries).sort(([a], [b]) => (a === '_comment' ? -1 : b === '_comment' ? 1 : a.localeCompare(b))),
);
await writeFile(QUERIES, JSON.stringify(ordenado, null, 2) + '\n', 'utf8');
console.log(`${novos} busca(s) nova(s); ${Object.keys(ordenado).length - 1} no total.`);

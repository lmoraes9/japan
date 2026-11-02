/**
 * Ruas e trilhos em volta de cada parada, do OpenStreetMap (Overpass), para o
 * globinho mostrar o bairro na saída e na chegada. Baixa uma vez por lugar e
 * guarda em trabalho/ruas/; o render junta as do plano num ruas.json da pasta pública.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import type { Plano } from '../../src/plano.ts';
import { chaveRua, type Ruas, type RuasDoLugar } from '../../src/ruas.ts';

const RAIO = 2200;
const PRINCIPAIS = /^(motorway|trunk|primary|secondary|tertiary)(_link)?$/;

async function baixar(lat: number, lng: number): Promise<RuasDoLugar> {
  const q = `[out:json][timeout:90];
(way[highway~"^(motorway|trunk|primary|secondary|tertiary|motorway_link|trunk_link|primary_link|unclassified|residential|living_street|pedestrian)$"](around:${RAIO},${lat},${lng});
 way[railway~"^(rail|subway|light_rail|monorail)$"](around:${RAIO},${lat},${lng}););
out geom;`;
  const r = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'japan-editor (video pessoal de viagem)' },
    body: 'data=' + encodeURIComponent(q),
  });
  if (!r.ok) throw new Error(`Overpass ${r.status}`);
  const j = (await r.json()) as { elements: { tags?: Record<string, string>; geometry?: { lat: number; lon: number }[] }[] };
  const out: RuasDoLugar = { grandes: [], pequenas: [], trilhos: [] };
  for (const e of j.elements) {
    if (!e.geometry || !e.tags) continue;
    const linha = e.geometry.map((p) => [Math.round(p.lon * 1e5) / 1e5, Math.round(p.lat * 1e5) / 1e5] as [number, number]);
    if (e.tags.railway) out.trilhos.push(linha);
    else if (PRINCIPAIS.test(e.tags.highway)) out.grandes.push(linha);
    else out.pequenas.push(linha);
  }
  return out;
}

/** as ruas de todas as paradas dos trajetos do plano (sem as de passagem nem os voos) */
export async function ruasDoPlano(plano: Plano): Promise<Ruas> {
  const pts = plano.segmentos.flatMap((s) => (s.tipo === 'mapa' && s.escala !== 'globo' ? s.pontos.filter((p) => !p.passagem) : []));
  const ruas: Ruas = {};
  mkdirSync('trabalho/ruas', { recursive: true });
  for (const p of pts) {
    const k = chaveRua(p.lat, p.lng);
    if (ruas[k]) continue;
    const arq = `trabalho/ruas/${k}.json`;
    if (!existsSync(arq)) {
      try {
        console.log(`baixando as ruas de ${p.nome}…`);
        writeFileSync(arq, JSON.stringify(await baixar(p.lat, p.lng)));
      } catch (e) {
        // sem internet o vídeo sai igual, só sem as ruas
        console.warn(`sem ruas para ${p.nome}: ${(e as Error).message}`);
        continue;
      }
    }
    ruas[k] = JSON.parse(readFileSync(arq, 'utf8'));
  }
  return ruas;
}

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
import { carregarLugares, distM, type Lugar } from './lib/lugares.ts';
import { trajeto } from './lib/trajeto.ts';
import type { Modo, Plano, Ponto, Segmento } from '../src/plano.ts';

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const dia = (iso: string) => `${Number(iso.slice(8, 10))} ${MESES[Number(iso.slice(5, 7)) - 1]}`;
const MODO: Record<string, Modo> = { plane: 'aviao', shinkansen: 'shinkansen', train: 'trem', metro: 'metro', tram: 'bonde', bus: 'onibus', ferry: 'balsa', cable: 'teleferico', taxi: 'taxi', walk: 'ape' };
const ROTULO: Record<Modo, string> = { aviao: 'avião', shinkansen: 'Shinkansen', trem: 'trem', metro: 'metrô', bonde: 'bonde', onibus: 'ônibus', balsa: 'balsa', teleferico: 'teleférico', taxi: 'táxi', ape: 'a pé' };
const duracao = (min: number) => (min >= 60 ? `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}` : `${min} min`);

const arg = (n: string) => {
  const i = process.argv.indexOf(n);
  return i > 0 ? process.argv[i + 1] : undefined;
};

const catalogo = (JSON.parse(readFileSync('trabalho/catalogo.json', 'utf8')) as Midia[]).filter((m) => m.lugar && m.quando);
const soDia = arg('--dia');
const midias = soDia ? catalogo.filter((m) => m.quando!.startsWith(soDia)) : catalogo;
const lugares = new Map(carregarLugares().map((l) => [l.id, l]));
const todos = [...lugares.values()];

const ponto = (l: Lugar, extra: Partial<Ponto> = {}): Ponto => ({ nome: l.sigla ? l.cidade : l.nome, jp: l.jp, lat: l.lat, lng: l.lng, ...extra });

const segs: Segmento[] = [];

// 1. aeroportos do começo viram um globo só, com as fotos de polaroid
const aeroportos: Midia[] = [];
while (midias.length && lugares.get(midias[0].lugar!.id)?.tipo === 'aeroporto') aeroportos.push(midias.shift()!);
if (aeroportos.length && midias.length) {
  const chegada = todos.find((l) => l.id === 'd18-haneda') ?? lugares.get(midias[0].lugar!.id)!;
  segs.push({
    tipo: 'mapa',
    escala: 'globo',
    modos: ['aviao'],
    quando: `${dia(aeroportos[0].quando!)} → ${dia(midias[0].quando!)}`,
    titulo: `${lugares.get(aeroportos[0].lugar!.id)!.cidade} → Tóquio`,
    legenda: `${aeroportos.length} voos`,
    pontos: [
      ...aeroportos.map((m) => {
        const l = lugares.get(m.lugar!.id)!;
        return ponto(l, { sub: `${l.sigla} · ${dia(m.quando!)}`, foto: m.tipo === 'foto' ? m.arquivo : undefined });
      }),
      { nome: 'Tóquio', jp: '東京', sub: `HND · ${dia(midias[0].quando!)}`, lat: chegada.lat, lng: chegada.lng },
    ],
    segundos: 6.5,
  });
}

// 2. um mapa a cada mudança de lugar, um trecho de cada mídia
let antes: { l: Lugar; quando: string } | undefined;
for (const m of midias) {
  const l = lugares.get(m.lugar!.id)!;
  if (antes && distM(antes.l, l) > 150) {
    const km = distM(antes.l, l) / 1000;
    const escala = km > 1500 ? 'globo' : km > 30 ? 'regiao' : 'local';
    const tr = trajeto(antes.l.id, l.id);
    const modos: Modo[] = tr ? tr.modos.map((x) => MODO[x] ?? 'trem') : [escala === 'globo' ? 'aviao' : escala === 'regiao' ? 'shinkansen' : km < 1.5 ? 'ape' : 'metro'];
    const mesmoDia = antes.quando.slice(0, 10) === m.quando!.slice(0, 10);
    // no mesmo dia, as paradas do roteiro no meio do caminho viram pontos de passagem
    const meio = mesmoDia
      ? todos.filter((x) => x.tipo === 'parada' && x.data === l.data && x.hora && antes!.l.hora && x.hora > antes!.l.hora && x.hora < (l.hora ?? '99')).map((x) => ponto(x, { passagem: true }))
      : [];
    segs.push({
      tipo: 'mapa',
      escala,
      modos,
      quando: mesmoDia ? dia(m.quando!) : `${dia(antes.quando)} → ${dia(m.quando!)}`,
      titulo: escala === 'local' ? `${antes.l.nome} → ${l.nome}` : `${antes.l.cidade} → ${l.cidade}`,
      legenda: tr ? [modos.map((x) => ROTULO[x]).join(' + '), tr.linhas.slice(0, 2).join(', '), duracao(tr.minutos)].filter(Boolean).join(' · ') : undefined,
      pontos: [ponto(antes.l), ...meio, ponto(l)],
      segundos: escala === 'local' ? 4 : 5,
    });
  }
  const linha = `${l.cidade} · ${dia(m.quando!)}, ${m.quando!.slice(11, 16)}`;
  const base = { arquivo: m.arquivo, largura: m.largura, altura: m.altura, lugar: { nome: l.nome, jp: l.jp, linha, lat: m.gps?.lat ?? l.lat, lng: m.gps?.lng ?? l.lng } };
  const nota = l.historia ? { titulo: l.historia.titulo, texto: `ESCREVER (1–2 frases, até ~110 caracteres): ${l.historia.paragrafos[0].slice(0, 160)}…` } : undefined;
  if (m.tipo === 'video') {
    const d = m.duracao ?? 4;
    const tam = Math.min(5, d * 0.6);
    segs.push({ tipo: 'clipe', ...base, de: Math.round((d - tam) / 2 * 10) / 10, ate: Math.round(((d + tam) / 2) * 10) / 10, nota });
  } else {
    segs.push({ tipo: 'clipe', ...base, segundos: 2.5, nota });
  }
  antes = { l, quando: m.quando! };
}

// 3. fecho com a rota no Japão
const noJapao = midias.map((m) => lugares.get(m.lugar!.id)!).filter((l) => l.tz === '+09:00');
const cidades = noJapao.filter((l, i) => noJapao.findIndex((x) => x.cidade === l.cidade) === i);
if (cidades.length > 1) {
  segs.push({ tipo: 'fim', titulo: 'até aqui', sub: `${dia(midias[0].quando!)} – ${dia(midias[midias.length - 1].quando!)}`, pontos: cidades.map((l) => ({ nome: l.cidade, lat: l.lat, lng: l.lng })), numeros: [`${cidades.length} cidades`], segundos: 4 });
}

const plano: Plano = { titulo: soDia ? `dia ${soDia}` : 'rascunho', formato: 'reel', segmentos: segs };
writeFileSync('trabalho/plano-rascunho.json', JSON.stringify(plano, null, 2));
console.log(`${segs.length} segmentos → trabalho/plano-rascunho.json`);
for (const s of segs) console.log(' ·', s.tipo === 'mapa' ? `mapa ${s.escala}: ${s.titulo} (${s.modos.join('+')}) ${s.legenda ?? ''}` : s.tipo === 'clipe' ? `clipe ${s.arquivo} ${s.de ?? ''}–${s.ate ?? ''}${s.nota ? ' + nota' : ''}` : `fim ${s.titulo}`);

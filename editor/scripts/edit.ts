/**
 * Transforma um edit da Ilha de Edição (a música, o tema e as mídias na ordem que eles
 * escolheram) num plano com os cortes no tempo da música.
 *
 *   npm run edit -- trabalho/edits/<id>.json   → trabalho/plano-edit-<id>.json
 *
 * O edit chega do banco do artefato (o Claude salva o JSON com o ArtifactData). Os mapas entre
 * lugares saem do mesmo `montar` do rascunho; as notas de história o Claude escreve depois,
 * revisando o plano, como sempre.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import type { Midia } from './lib/catalogo.ts';
import { montar } from './lib/montar.ts';
import { FPS, TRANSICAO, type Estilo, type NomeTema, type Plano, type SegClipe, type Segmento } from '../src/plano.ts';

interface Edit {
  titulo: string;
  musica?: string;
  tema?: NomeTema;
  estilo?: Estilo;
  formato?: Plano['formato'];
  semParticulas?: boolean;
  /** id da mídia (do painel.json) e, nos vídeos, de que segundo começar */
  itens: { id: string; de?: number }[];
}
interface Musica {
  arquivo: string;
  dur: number;
  bpm: number;
  unidade: number;
  inicio: number;
}

const arquivoEdit = process.argv[2];
if (!arquivoEdit) throw new Error('uso: npm run edit -- trabalho/edits/<id>.json');
const edit = JSON.parse(readFileSync(arquivoEdit, 'utf8')) as Edit;
const painel = JSON.parse(readFileSync('trabalho/painel/painel.json', 'utf8')) as { midias: { id: string; arquivo: string }[] };
const catalogo = JSON.parse(readFileSync('trabalho/catalogo.json', 'utf8')) as Midia[];
const musicas = JSON.parse(readFileSync('trabalho/musicas.json', 'utf8')) as Musica[];

const porId = new Map(painel.midias.map((m) => [m.id, catalogo.find((c) => c.arquivo === m.arquivo)]));
const faltam = edit.itens.filter((i) => !porId.get(i.id));
if (faltam.length) throw new Error(`mídias que não estão no catálogo: ${faltam.map((i) => i.id).join(', ')}`);
const midias = edit.itens.map((i) => porId.get(i.id)!);
const dePedido = new Map(edit.itens.map((i) => [porId.get(i.id)!.arquivo, i.de]));

const estilo = edit.estilo ?? 'globinho-viagem';
const globinho = estilo.startsWith('globinho');
const segs = montar(midias);
const musica = edit.musica ? musicas.find((m) => basename(m.arquivo, '.mp3') === edit.musica) : undefined;
if (edit.musica && !musica) throw new Error(`música sem análise: ${edit.musica} (rode python scripts/musica.py)`);

// sem música, um andamento neutro só para dar ritmo aos cortes
const U = musica ? (60 / musica.bpm) * musica.unidade : 0.5;
const t = (n: number) => n * U;
const entra = (n: number) => (n === 0 ? 0 : Math.round(t(n) * FPS) - TRANSICAO / 2);

// quantas unidades cada coisa fica na tela: vídeo e abertura 8, foto 4, foto com nota 8, fecho 16
// (no globinho o mapa sem fotos não ocupa a tela: o trajeto anda sobre o clipe seguinte)
const naTela = segs.filter((s) => !(globinho && s.tipo === 'mapa'));
const unidades = new Map<Segmento, number>();
naTela.forEach((s, k) => {
  let u = s.tipo === 'fim' ? 16 : s.tipo === 'mapa' ? 8 : k === 0 || s.nota ? 8 : s.de !== undefined ? 8 : 4;
  if (s.tipo === 'clipe' && s.de !== undefined) {
    const m = midias.find((x) => x.arquivo === s.arquivo)!;
    const sobra = (m.duracao ?? 4) - (dePedido.get(s.arquivo) ?? 0) - 0.2;
    while (u > 2 && t(u) + TRANSICAO / FPS > sobra) u -= 2;
  }
  unidades.set(s, u);
});
const comeco = new Map<Segmento, number>();
let n = 0;
for (const s of naTela) {
  comeco.set(s, n);
  n += unidades.get(s)!;
}
const FIM = n;
const quadros = (s: Segmento) => {
  const k = naTela.indexOf(s);
  return k === naTela.length - 1 ? Math.round(t(FIM) * FPS) - entra(comeco.get(s)!) : entra(comeco.get(naTela[k + 1])!) - entra(comeco.get(s)!) + TRANSICAO;
};

const final = segs.map((s, i): Segmento => {
  if (s.tipo === 'mapa' && globinho) {
    // o trajeto não pode esticar a foto de chegada (globinhoTempo: dur >= quer - antes + 40)
    const ant = segs[i - 1] ? quadros(segs[i - 1]) : 90;
    const cheg = segs[i + 1] ? quadros(segs[i + 1]) : 90;
    let quer = 180;
    while (quer > 60 && quer - Math.min(Math.round(quer * 0.4), Math.round(ant * 0.5)) + 40 > cheg) quer -= 3;
    return { ...s, segundos: +(quer / FPS).toFixed(4) };
  }
  const seg = +(quadros(s) / FPS).toFixed(4);
  if (s.tipo === 'clipe' && s.de !== undefined) {
    const m = midias.find((x) => x.arquivo === s.arquivo)!;
    const de = dePedido.get(s.arquivo) ?? Math.max(0, Math.round((((m.duracao ?? seg) - seg) / 2) * 10) / 10);
    const c: SegClipe = { ...s, de, ate: +(de + seg).toFixed(4) };
    if (musica) c.volume = 0;
    return c;
  }
  return { ...s, segundos: seg };
});

// o trecho da música: o que a análise achou; se o vídeo passar do fim dela, volta de 4 em 4 tempos
let trilhaDe = musica?.inicio ?? 0;
if (musica) while (trilhaDe > 0 && trilhaDe + t(FIM) > musica.dur - 0.5) trilhaDe = Math.max(0, trilhaDe - 4 * U);

const id = basename(arquivoEdit, '.json');
const plano: Plano = {
  titulo: edit.titulo,
  formato: edit.formato ?? 'reel',
  estilo,
  ...(edit.tema && { tema: edit.tema }),
  ...(edit.semParticulas && { semParticulas: true }),
  ...(musica && { trilha: musica.arquivo, trilhaDe: +trilhaDe.toFixed(3) }),
  segmentos: final,
};
const saida = `trabalho/plano-edit-${id}.json`;
writeFileSync(saida, JSON.stringify(plano, null, 2));
console.log(`${saida} · ${final.length} segmentos · ~${t(FIM).toFixed(1)} s${musica ? ` · ${edit.musica} ${musica.bpm} bpm desde ${trilhaDe.toFixed(1)} s` : ''}`);
for (const s of final) console.log(' ·', s.tipo === 'mapa' ? `mapa ${s.titulo}` : s.tipo === 'clipe' ? `${s.arquivo} ${s.de !== undefined ? `${s.de}–${s.ate}` : `${s.segundos} s`}${s.nota ? ' + nota (escrever)' : ''}` : `fim ${s.titulo}`);

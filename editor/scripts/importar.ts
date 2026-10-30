/**
 * Lê tudo que chegou em entrada/<aparelho>/, descobre quando e onde cada foto
 * ou vídeo foi feito, casa com o roteiro e gera folhas de contato dos vídeos.
 * Saída: trabalho/catalogo.json (ordenado por horário) e trabalho/quadros/.
 *
 *   npm run importar
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative } from 'node:path';
import { exiftool, type Tags } from 'exiftool-vendored';
import { carregarLugares, distM, type Lugar } from './lib/lugares.ts';
import { cidadePerto } from './lib/cidades.ts';
import type { Candidato, Midia } from './lib/catalogo.ts';
import { ffmpeg } from './lib/ferramentas.ts';

const FOTO = new Set(['.jpg', '.jpeg', '.heic', '.heif', '.png']);
const VIDEO = new Set(['.mp4', '.mov', '.m4v']);
const HEIC = new Set(['.heic', '.heif']);
const ext = (f: string) => extname(f).toLowerCase();
const semExt = (f: string) => f.slice(0, f.length - extname(f).length).toLowerCase();

function listar(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    // .stfolder, .trashed-…, ~syncthing~….tmp: coisas do Syncthing e da lixeira do Android
    if (n.startsWith('.') || n.startsWith('~')) return [];
    const p = join(dir, n);
    return statSync(p).isDirectory() ? listar(p) : [p];
  });
}

/**
 * A data como veio do arquivo. Com fuso (OffsetTime, iPhone, ou deduzido pelo
 * GPS pelo exiftool-vendored), já está pronta. Sem fuso, sobra a hora local
 * (foto sem GPS) ou só o instante em UTC (vídeo do Android sem GPS).
 */
interface Data {
  local?: string;
  fuso?: string;
  utc?: number;
}

function dataDe(t: Tags): Data | undefined {
  const ordem = ['SubSecDateTimeOriginal', 'DateTimeOriginal', 'CreationDate', 'CreateDate'] as const;
  for (const k of ordem) {
    const v = (t as any)[k];
    if (v && typeof v === 'object' && 'toISOString' in v) {
      if (v.hasZone && t.tzSource !== 'defaultVideosToUTC') {
        const iso: string = v.toISOString({ suppressMilliseconds: true }).replace(/\.\d+(?=[+-Z])/, '').replace(/Z$/, '+00:00');
        return { local: iso.slice(0, 19), fuso: iso.slice(19) };
      }
      if (v.hasZone) return { utc: v.toMillis() };
      const local = v.toISOString({ includeOffset: false }) ?? String(v.rawValue).replace(/^(\d+):(\d+):(\d+) /, '$1-$2-$3T');
      return { local: local.slice(0, 19) };
    }
  }
  return undefined;
}

const fmtFuso = (min: number) => `${min < 0 ? '-' : '+'}${String(Math.floor(Math.abs(min) / 60)).padStart(2, '0')}:${String(Math.abs(min) % 60).padStart(2, '0')}`;
const minFuso = (f: string) => (f[0] === '-' ? -1 : 1) * (Number(f.slice(1, 3)) * 60 + Number(f.slice(4, 6)));

/**
 * Dá fuso a quem não tem: o da mídia mais perto no tempo (do mesmo aparelho, se
 * houver, até 12 h); sem vizinha, hora do Japão nos dias do roteiro e a do PC
 * fora deles (o teste em casa).
 */
function comFuso(itens: { m: Midia; d?: Data }[], diasViagem: [string, string]) {
  const certos = itens.filter((x) => x.d?.fuso);
  for (const x of itens) {
    const d = x.d;
    if (!d || d.fuso) continue;
    // hora local compara com hora local; instante compara com instante
    const t = d.local ? Date.parse(`${d.local}Z`) : d.utc!;
    const t2 = (o: Data) => (d.local ? Date.parse(`${o.local}Z`) : Date.parse(`${o.local}${o.fuso}`));
    const perto = (lista: typeof certos) => lista.map((o) => ({ o, dt: Math.abs(t2(o.d!) - t) })).filter((c) => c.dt < 12 * 3600e3).sort((a, b) => a.dt - b.dt)[0];
    const viz = perto(certos.filter((o) => o.m.aparelho === x.m.aparelho)) ?? perto(certos);
    const dia = d.local ? d.local.slice(0, 10) : new Date(d.utc! + 9 * 3600e3).toISOString().slice(0, 10);
    if (viz) {
      d.fuso = viz.o.d!.fuso;
      x.m.fusoDeduzido = 'vizinha';
    } else if (dia >= diasViagem[0] && dia <= diasViagem[1]) {
      d.fuso = '+09:00';
      x.m.fusoDeduzido = 'roteiro';
    } else {
      d.fuso = fmtFuso(-(d.local ? new Date(d.local) : new Date(d.utc!)).getTimezoneOffset());
      x.m.fusoDeduzido = 'pc';
    }
    if (!d.local) d.local = new Date(d.utc! + minFuso(d.fuso!) * 60e3).toISOString().slice(0, 19);
  }
  for (const x of itens) if (x.d?.local && x.d.fuso) x.m.quando = `${x.d.local}${x.d.fuso}`;
}

/** 'HH:mm' de um ISO local */
const horaDe = (iso: string) => iso.slice(11, 16);
const minutos = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/**
 * Nota de cada lugar: distância em "raios" + quão longe do horário marcado no
 * roteiro (meia hora de diferença pesa meio raio). Menor é melhor.
 */
function pontuar(m: { gps: { lat: number; lng: number }; quando?: string }, lugares: Lugar[]): Candidato[] {
  const data = m.quando?.slice(0, 10);
  const hora = m.quando ? minutos(horaDe(m.quando)) : undefined;
  return lugares
    .map((l) => {
      const d = distM(m.gps, l);
      let nota = d / l.raioM;
      if (l.data && data) {
        if (l.data !== data) nota += 1;
        else if (l.hora && hora !== undefined) nota += (Math.abs(minutos(l.hora) - hora) / 30) * 0.5;
        else nota += 0.3;
      }
      return { id: l.id, nome: l.nome, distanciaM: Math.round(d), hora: l.hora, nota: Math.round(nota * 100) / 100 };
    })
    .filter((c) => c.distanciaM < 50_000)
    .sort((a, b) => a.nota - b.nota)
    .slice(0, 3);
}

/** Sem GPS: a parada do mesmo dia com horário marcado mais perto, desde que perto das outras mídias do dia. */
function peloRoteiro(m: Midia, todas: Midia[], lugares: Lugar[]): Candidato[] {
  if (!m.quando) return [];
  const data = m.quando.slice(0, 10);
  const hora = minutos(horaDe(m.quando));
  const vizinha = todas
    .filter((o) => o.gps && o.quando?.slice(0, 10) === data)
    .sort((a, b) => Math.abs(minutos(horaDe(a.quando!)) - hora) - Math.abs(minutos(horaDe(b.quando!)) - hora))[0];
  return lugares
    .filter((l) => l.tipo === 'parada' && l.data === data && l.hora)
    .filter((l) => !vizinha?.gps || distM(vizinha.gps, l) < 5000)
    .map((l) => ({ id: l.id, nome: l.nome, hora: l.hora, nota: Math.round((Math.abs(minutos(l.hora!) - hora) / 30) * 50) / 100 }))
    .sort((a, b) => a.nota - b.nota)
    .slice(0, 3);
}

/**
 * Fora do roteiro (o teste em casa, um lugar que surgiu na viagem): junta o que
 * foi feito a menos de 300 m e dá o nome da cidade pelo GPS. Perto do roteiro,
 * a cidade fica com o nome do app ('Tóquio', não 'Tokyo').
 */
function foraDoRoteiro(midias: Midia[], lugares: Lugar[]) {
  const paradas = lugares.filter((l) => l.tipo === 'parada');
  const grupos: { id: string; lat: number; lng: number; nome: string; cidade: string }[] = [];
  for (const m of midias) {
    if (m.lugar || !m.gps) continue;
    let g = grupos.find((x) => distM(x, m.gps!) < 300);
    if (!g) {
      const nome = cidadePerto(m.gps) ?? 'sem nome';
      const roteiro = paradas.map((l) => ({ l, d: distM(l, m.gps!) })).sort((a, b) => a.d - b.d)[0];
      g = { id: `fora:${grupos.length + 1}`, ...m.gps, nome, cidade: roteiro && roteiro.d < 20_000 ? roteiro.l.cidade : nome };
      grupos.push(g);
    }
    m.lugar = { id: g.id, nome: g.nome, cidade: g.cidade, lat: g.lat, lng: g.lng, metodo: 'gps', confianca: 'baixa', distanciaM: Math.round(distM(g, m.gps)), fora: true };
  }
  // sem GPS: o lugar da mídia mais perto no tempo, no mesmo dia, até 2 h
  for (const m of midias) {
    if (m.lugar || !m.quando) continue;
    const t = Date.parse(m.quando);
    const viz = midias
      .filter((o) => o.gps && o.lugar && o.quando?.slice(0, 10) === m.quando!.slice(0, 10))
      .map((o) => ({ o, dt: Math.abs(Date.parse(o.quando!) - t) }))
      .filter((c) => c.dt < 2 * 3600e3)
      .sort((a, b) => a.dt - b.dt)[0];
    if (viz) m.lugar = { ...viz.o.lugar!, metodo: 'vizinha', confianca: 'baixa', distanciaM: undefined };
  }
}

/** O Chrome do render não abre HEIC: vira JPG em trabalho/jpg/ com os metadados (data, GPS) copiados. */
async function paraJpg(heic: string, aparelho: string): Promise<string> {
  const jpg = join('trabalho/jpg', aparelho, `${basename(heic, extname(heic))}.jpg`).replace(/\\/g, '/');
  if (existsSync(jpg)) return jpg;
  mkdirSync(dirname(jpg), { recursive: true });
  ffmpeg(['-i', heic, '-frames:v', '1', '-q:v', '2', jpg]);
  // o ffmpeg já desvira a imagem; copiar a orientação do original viraria de novo
  await exiftool.write(jpg, {}, { writeArgs: ['-tagsFromFile', heic, '-all:all', '--Orientation', '-overwrite_original'] });
  return jpg;
}

function folhaDeContato(arquivo: string, duracao: number, saida: string) {
  const n = Math.min(16, Math.max(4, Math.round(duracao * 2)));
  const passo = Math.round((duracao / n) * 100) / 100;
  const colunas = 4;
  if (existsSync(saida)) return { imagem: saida, passo, colunas };
  const linhas = Math.ceil(n / colunas);
  const base = `fps=1/${passo},scale=270:-2`;
  const tile = `tile=${colunas}x${linhas}:padding=6:color=white`;
  // no Windows o ffmpeg não acha fonte sozinho (Fontconfig) e o tempo sumia da folha
  const fonte = process.platform === 'win32' ? "fontfile='C\\:/Windows/Fonts/arial.ttf':" : '';
  const comHora = `${base},drawtext=${fonte}text='%{pts\\:hms}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,${tile}`;
  try {
    ffmpeg(['-i', arquivo, '-vf', comHora, '-frames:v', '1', '-update', '1', saida]);
  } catch {
    ffmpeg(['-i', arquivo, '-vf', `${base},${tile}`, '-frames:v', '1', '-update', '1', saida]);
  }
  return { imagem: saida, passo, colunas };
}

async function main() {
  if (!existsSync('entrada')) throw new Error('crie entrada/<aparelho>/ com as fotos e vídeos (ou rode npm run demo:midia)');
  const lugares = carregarLugares();
  const porId = new Map(lugares.map((l) => [l.id, l]));
  const datas = lugares.filter((l) => l.tipo === 'parada' && l.data).map((l) => l.data!).sort();
  const todos = listar('entrada').filter((f) => FOTO.has(ext(f)) || VIDEO.has(ext(f)));
  // Live Photo: o iPhone guarda um .MOV de 3 s com o mesmo nome da foto; fica de fora
  const fotos = new Set(todos.filter((f) => FOTO.has(ext(f))).map(semExt));
  const arquivos = todos.filter((f) => !(ext(f) === '.mov' && fotos.has(semExt(f))));
  mkdirSync('trabalho/quadros', { recursive: true });

  const lidos: { m: Midia; d?: Data }[] = [];
  for (const f of arquivos) {
    const t = await exiftool.read(f);
    const video = VIDEO.has(ext(f));
    const aparelho = relative('entrada', f).split(/[\\/]/)[0];
    const lat = typeof t.GPSLatitude === 'number' ? t.GPSLatitude : undefined;
    const lng = typeof t.GPSLongitude === 'number' ? t.GPSLongitude : undefined;
    const original = relative('.', f).replace(/\\/g, '/');
    let arquivo = original;
    let { ImageWidth: largura, ImageHeight: altura } = t;
    if (HEIC.has(ext(f))) {
      arquivo = await paraJpg(f, aparelho);
      ({ ImageWidth: largura, ImageHeight: altura } = await exiftool.read(arquivo));
    }
    const m: Midia = {
      arquivo,
      original: arquivo !== original ? original : undefined,
      aparelho,
      tipo: video ? 'video' : 'foto',
      duracao: video ? Number(t.Duration) || undefined : undefined,
      largura,
      altura,
      gps: lat !== undefined && lng !== undefined ? { lat, lng } : undefined,
    };
    lidos.push({ m, d: dataDe(t) });
  }
  await exiftool.end();
  comFuso(lidos, [datas[0], datas[datas.length - 1]]);
  const midias = lidos.map((x) => x.m);
  midias.sort((a, b) => Date.parse(a.quando ?? '') - Date.parse(b.quando ?? '') || a.arquivo.localeCompare(b.arquivo));

  for (const m of midias) {
    const cands = m.gps ? pontuar({ gps: m.gps, quando: m.quando }, lugares) : peloRoteiro(m, midias, lugares);
    m.candidatos = cands;
    const melhor = cands[0] && porId.get(cands[0].id);
    if (melhor && cands[0].nota <= 2.5) {
      const nota = cands[0].nota;
      m.lugar = {
        id: melhor.id,
        nome: melhor.nome,
        jp: melhor.jp,
        cidade: melhor.cidade,
        lat: melhor.lat,
        lng: melhor.lng,
        metodo: m.gps ? 'gps' : 'roteiro',
        confianca: !m.gps ? 'media' : nota <= 1.2 ? 'alta' : nota <= 2 ? 'media' : 'baixa',
        distanciaM: cands[0].distanciaM,
      };
    }
    if (m.tipo === 'video' && m.duracao) {
      m.quadros = folhaDeContato(m.arquivo, m.duracao, join('trabalho/quadros', `${basename(m.arquivo)}.jpg`).replace(/\\/g, '/'));
    }
  }
  foraDoRoteiro(midias, lugares);

  writeFileSync('trabalho/catalogo.json', JSON.stringify(midias, null, 2));
  const comoAchou = { gps: (m: Midia) => `${m.lugar!.distanciaM} m`, roteiro: () => 'pelo horário do roteiro', vizinha: () => 'pela mídia vizinha' };
  for (const m of midias) {
    const onde = m.lugar
      ? `${m.lugar.nome} (${m.lugar.cidade})${m.lugar.fora ? ' · fora do roteiro' : ''} · ${comoAchou[m.lugar.metodo](m)} · ${m.lugar.confianca}`
      : 'lugar desconhecido';
    const fuso = m.fusoDeduzido ? ` (fuso ${m.fusoDeduzido === 'pc' ? 'do PC' : `pel${m.fusoDeduzido === 'vizinha' ? 'a vizinha' : 'o roteiro'}`})` : '';
    console.log(`${(m.quando ?? '?').padEnd(25)} ${m.tipo.padEnd(5)} ${(m.original ?? m.arquivo).padEnd(46)} → ${onde}${fuso}`);
  }
  console.log(`\n${midias.length} arquivos → trabalho/catalogo.json`);
}

main().catch(async (e) => {
  console.error(e);
  await exiftool.end();
  process.exit(1);
});

/**
 * Lê tudo que chegou em entrada/<aparelho>/, descobre quando e onde cada foto
 * ou vídeo foi feito, casa com o roteiro e gera folhas de contato dos vídeos.
 * Saída: trabalho/catalogo.json (ordenado por horário) e trabalho/quadros/.
 *
 *   npm run importar
 */
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';
import { exiftool, type Tags } from 'exiftool-vendored';
import { carregarLugares, distM, type Lugar } from './lib/lugares.ts';
import type { Candidato, Midia } from './lib/catalogo.ts';
import { ffmpeg } from './lib/ferramentas.ts';

const FOTO = new Set(['.jpg', '.jpeg', '.heic', '.png']);
const VIDEO = new Set(['.mp4', '.mov', '.m4v']);

function listar(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? listar(p) : [p];
  });
}

/** primeira data útil, com fuso. O exiftool-vendored deduz o fuso pelo GPS quando o arquivo não traz. */
function quando(t: Tags): string | undefined {
  const ordem = ['SubSecDateTimeOriginal', 'DateTimeOriginal', 'CreationDate', 'CreateDate'] as const;
  for (const k of ordem) {
    const v = (t as any)[k];
    if (v && typeof v === 'object' && 'toISOString' in v) {
      const iso: string | undefined = v.hasZone ? v.toISOString({ suppressMilliseconds: true }) : undefined;
      if (iso) return iso.replace(/\.\d+(?=[+-Z])/, '');
      // sem fuso: durante a viagem, é hora do Japão
      const local = v.toISOString({ includeOffset: false }) ?? String(v.rawValue).replace(/^(\d+):(\d+):(\d+) /, '$1-$2-$3T');
      return `${local.slice(0, 19)}+09:00`;
    }
  }
  return undefined;
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

function folhaDeContato(arquivo: string, duracao: number, saida: string) {
  const n = Math.min(16, Math.max(4, Math.round(duracao * 2)));
  const passo = Math.round((duracao / n) * 100) / 100;
  const colunas = 4;
  const linhas = Math.ceil(n / colunas);
  const base = `fps=1/${passo},scale=270:-2`;
  const tile = `tile=${colunas}x${linhas}:padding=6:color=white`;
  const comHora = `${base},drawtext=text='%{pts\\:hms}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,${tile}`;
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
  const arquivos = listar('entrada').filter((f) => FOTO.has(extname(f).toLowerCase()) || VIDEO.has(extname(f).toLowerCase()));
  mkdirSync('trabalho/quadros', { recursive: true });

  const midias: Midia[] = [];
  for (const f of arquivos) {
    const t = await exiftool.read(f);
    const video = VIDEO.has(extname(f).toLowerCase());
    const lat = typeof t.GPSLatitude === 'number' ? t.GPSLatitude : undefined;
    const lng = typeof t.GPSLongitude === 'number' ? t.GPSLongitude : undefined;
    midias.push({
      arquivo: relative('.', f).replace(/\\/g, '/'),
      aparelho: relative('entrada', f).split(/[\\/]/)[0],
      tipo: video ? 'video' : 'foto',
      quando: quando(t),
      duracao: video ? Number(t.Duration) || undefined : undefined,
      largura: t.ImageWidth,
      altura: t.ImageHeight,
      gps: lat !== undefined && lng !== undefined ? { lat, lng } : undefined,
    });
  }
  await exiftool.end();
  midias.sort((a, b) => (a.quando ?? '').localeCompare(b.quando ?? ''));

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

  writeFileSync('trabalho/catalogo.json', JSON.stringify(midias, null, 2));
  for (const m of midias) {
    const onde = m.lugar
      ? `${m.lugar.nome} (${m.lugar.cidade}) · ${m.lugar.metodo === 'gps' ? `${m.lugar.distanciaM} m` : 'pelo horário do roteiro'} · ${m.lugar.confianca}`
      : 'lugar desconhecido';
    console.log(`${(m.quando ?? '?').padEnd(25)} ${m.tipo.padEnd(5)} ${m.arquivo.padEnd(46)} → ${onde}`);
  }
  console.log(`\n${midias.length} arquivos → trabalho/catalogo.json`);
}

main().catch(async (e) => {
  console.error(e);
  await exiftool.end();
  process.exit(1);
});

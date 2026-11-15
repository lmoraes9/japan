/**
 * Busca do app: procura uma palavra no roteiro inteiro e nas páginas de apoio.
 *
 * Três níveis, do mais estrito ao mais tolerante:
 *
 * 1. o texto como está escrito, sem acento e sem maiúscula;
 * 2. o texto "pelo som": quem ouviu "Nishiki" e escreveu "Nichiqui" acha do
 *    mesmo jeito, porque os dois viram a mesma chave (`som`);
 * 3. só quando os dois primeiros não acham nada: palavras a uma letra de
 *    distância ("Nichique", "Asakuza", "Tsukigi").
 *
 * Tudo aqui é função pura sobre os dados estáticos. O índice só é montado na
 * primeira busca, e nunca no servidor.
 */
import { ALL_DAYS } from '@/data/days';
import { PLACE_MAPS } from '@/data/placeMaps';
import { LEGS, START } from '@/data/legs';
import { COMIDA_ITENS } from '@/data/comida';
import { RESERVAS_HOTEL } from '@/data/hoteis';
import { SHOPPING_GUIDES } from '@/data/shopping';
import { COMPRAS_ITEMS } from '@/data/checklist';
import { KONBINI_ITEMS } from '@/data/konbini';
import { HACKS } from '@/data/hacks';
import { INGRESSOS } from '@/data/ingressos';
import type { Leg } from '@/data/types';
import { formatDayLabel } from '@/lib/now';

export type TipoResultado =
  | 'parada'
  | 'dia'
  | 'comida'
  | 'mapa'
  | 'hotel'
  | 'ingresso'
  | 'compras'
  | 'konbini'
  | 'truque';

export const TIPO_ROTULO: Record<TipoResultado, string> = {
  parada: 'Roteiro',
  dia: 'Roteiro',
  comida: 'Comida',
  mapa: 'Mapa ilustrado',
  hotel: 'Hotel',
  ingresso: 'Ingressos',
  compras: 'Compras',
  konbini: 'Konbini',
  truque: 'Truques',
};

export interface Trecho {
  antes: string;
  achado: string;
  depois: string;
}

export interface Resultado {
  key: string;
  href: string;
  title: string;
  sub: string;
  tipo: TipoResultado;
  /** pedaço do texto onde bateu, quando não foi no nome */
  trecho?: Trecho;
}

export interface RespostaBusca {
  resultados: Resultado[];
  /** quantos bateram no total (a lista mostra só os primeiros) */
  total: number;
  /** nada bateu como escrito: estas são as palavras parecidas que foram usadas */
  parecidos: string[];
}

export const MAX_RESULTADOS = 30;

// ── normalização ────────────────────────────────────────────────────────────

const tiraMarcacao = (t: string) => t.replace(/\*\*\*|\*\*|\*|`/g, '');

/**
 * Minúscula e sem acento, **um caractere por caractere**: o resultado tem o
 * mesmo comprimento da entrada, então um índice achado aqui vale no original.
 * Só mexe em letras latinas; kana e kanji passam intactos.
 */
function leve(t: string): string {
  let out = '';
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (ch.charCodeAt(0) < 0x250) {
      const n = ch.toLowerCase().normalize('NFD');
      out += n.length > 0 && ch.toLowerCase().length === 1 ? n[0] : ch;
    } else {
      out += ch;
    }
  }
  return out;
}

/** "Tōfuku-ji" e "tofukuji" têm de ser a mesma coisa: some o hífen e o apóstrofo de dentro da palavra. */
const cola = (t: string) => t.replace(/([a-z0-9])['’-](?=[a-z0-9])/g, '$1');

/** Chave de comparação "como está escrito". */
export const plano = (t: string) => cola(leve(tiraMarcacao(t)));

/**
 * Chave "pelo som", para quem escreve japonês de ouvido em português:
 * ch/sh/tch → x, qu/c/k → k, y → i, z → s, letra dobrada vira uma só.
 * Recebe texto já passado por `plano`. É aplicada igual dos dois lados
 * (pergunta e roteiro), então não precisa ser fonética de verdade: só
 * precisa levar grafias diferentes do mesmo nome para o mesmo lugar.
 */
export function som(t: string): string {
  return t
    .replace(/tch/g, 'x')
    .replace(/sh|ch/g, 'x')
    .replace(/ph/g, 'f')
    .replace(/qu/g, 'k')
    .replace(/q/g, 'k')
    .replace(/c(?=[ei])/g, 's')
    .replace(/c/g, 'k')
    .replace(/gu(?=[ei])/g, 'j')
    .replace(/g(?=[ei])/g, 'j')
    .replace(/y/g, 'i')
    .replace(/z/g, 's')
    .replace(/m(?=[bp])/g, 'n')
    .replace(/ou/g, 'o')
    .replace(/([a-z])\1+/g, '$1');
}

/** Distância de edição, com teto: devolve `max + 1` assim que passa dele. */
export function distancia(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev: number[] = [];
  for (let j = 0; j <= b.length; j++) prev.push(j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let menor = i;
    for (let j = 1; j <= b.length; j++) {
      const v = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      cur.push(v);
      if (v < menor) menor = v;
    }
    if (menor > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

/** Quantas letras de erro uma palavra aguenta: nenhuma até 3 letras, 1 até 7, 2 daí em diante. */
const tolerancia = (termo: string) => (termo.length < 4 ? 0 : termo.length < 8 ? 1 : 2);

// ── índice ──────────────────────────────────────────────────────────────────

interface Item {
  key: string;
  href: string;
  title: string;
  sub: string;
  tipo: TipoResultado;
  /** parada de onde este item saiu (comida): evita mostrar os dois */
  paradaKey?: string;
  /** texto corrido, com a marcação já tirada — é daqui que sai o trecho */
  corpo: string;
  nomePlano: string;
  nomeSom: string;
  tudoPlano: string;
  tudoSom: string;
}

interface Indice {
  itens: Item[];
  /** palavra pelo som → como ela aparece escrita no roteiro */
  vocabulario: Map<string, string>;
}

const PALAVRA = /[a-z0-9]+(?:['’-][a-z0-9]+)*/g;

const junta = (...partes: (string | undefined | false)[]) =>
  partes.filter((p): p is string => typeof p === 'string' && p.length > 0).join(' · ');

const textoDoTrecho = (l: Leg) => junta(l.line, l.board, l.alight, l.direction, l.note);

function montar(): Indice {
  const itens: Item[] = [];
  const vocabulario = new Map<string, string>();

  const anota = (texto: string) => {
    const baixo = leve(texto);
    PALAVRA.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = PALAVRA.exec(baixo))) {
      const original = texto.slice(m.index, m.index + m[0].length);
      const partes = m[0].split(/['’-]/);
      const formas =
        partes.length > 1
          ? [{ p: partes.join(''), o: original }, ...partes.map((p) => ({ p, o: original }))]
          : [{ p: m[0], o: original }];
      for (const { p, o } of formas) {
        if (p.length < 4 || !/[a-z]/.test(p)) continue;
        const chave = som(p);
        if (!vocabulario.has(chave)) vocabulario.set(chave, o);
      }
    }
  };

  const add = (
    base: Pick<Item, 'key' | 'href' | 'title' | 'sub' | 'tipo' | 'paradaKey'>,
    nome: string,
    corpo: string,
  ) => {
    const nomeLimpo = tiraMarcacao(nome);
    const corpoLimpo = tiraMarcacao(corpo);
    const nomePlano = plano(nomeLimpo);
    const tudoPlano = `${nomePlano} ${plano(corpoLimpo)}`;
    itens.push({
      ...base,
      corpo: corpoLimpo,
      nomePlano,
      nomeSom: som(nomePlano),
      tudoPlano,
      tudoSom: som(tudoPlano),
    });
    anota(nomeLimpo);
    anota(corpoLimpo);
  };

  const diaDaParada = new Map<string, { dayId: string; date: string; time: string; timeLabel?: string }>();

  // o roteiro primeiro, em ordem de data: no empate, vem antes o que acontece antes
  for (const day of ALL_DAYS) {
    add(
      {
        key: `dia:${day.id}`,
        href: `/roteiro/${day.id}`,
        title: day.title,
        sub: `${formatDayLabel(day.date)} · o dia`,
        tipo: 'dia',
      },
      day.title,
      junta(
        day.subtitle,
        day.chips.join(' · '),
        ...(day.notes ?? []).map((n) => `${n.label}: ${n.text}`),
        ...(day.lastReturn ?? []).map((r) => junta(r.label, r.from, r.note)),
        ...(START[day.id] ?? []).map(textoDoTrecho),
      ),
    );
    for (const stop of day.stops) {
      diaDaParada.set(stop.id, { dayId: day.id, date: day.date, time: stop.time, timeLabel: stop.timeLabel });
      add(
        {
          key: `parada:${stop.id}`,
          href: `/roteiro/${day.id}#${stop.id}`,
          title: stop.name,
          sub: `${formatDayLabel(day.date)} · ${stop.time}`,
          tipo: 'parada',
        },
        junta(stop.name, stop.jp),
        junta(
          stop.facts,
          ...(stop.paragraphs ?? []),
          ...(stop.history?.paragraphs ?? []),
          ...(stop.eat ?? []).flatMap((b) => b.items.map((i) => `${i.name}: ${i.note}`)),
          ...(LEGS[stop.id] ?? []).map(textoDoTrecho),
        ),
      );
    }
  }

  for (const c of COMIDA_ITENS) {
    const p = diaDaParada.get(c.stopId);
    if (!p) continue;
    add(
      {
        key: `comida:${c.id}`,
        href: `/roteiro/${p.dayId}#${c.stopId}`,
        title: c.nome,
        sub: junta('Comida', formatDayLabel(p.date), p.timeLabel ?? p.time),
        tipo: 'comida',
        paradaKey: `parada:${c.stopId}`,
      },
      junta(c.nome, c.jp),
      junta(c.nota, c.bairro, (c.estilo ?? []).join(', ')),
    );
  }

  for (const map of PLACE_MAPS) {
    for (const h of map.hotspots) {
      add(
        {
          key: `mapa:${map.id}/${h.id}`,
          href: `/lugar/${map.id}`,
          title: h.title,
          sub: `Mapa ilustrado · ${map.title}`,
          tipo: 'mapa',
        },
        junta(h.title, h.jp, h.label),
        junta(h.facts, ...h.paragraphs),
      );
    }
  }

  for (const h of RESERVAS_HOTEL) {
    add(
      {
        key: `hotel:${h.name}`,
        href: '/mais/hoteis',
        title: h.name,
        sub: junta('Hotel reservado', h.datas),
        tipo: 'hotel',
      },
      junta(h.name, h.jp, h.city),
      junta(h.datas, h.acao),
    );
  }

  for (const i of INGRESSOS) {
    add(
      {
        key: `ingresso:${i.id}`,
        href: '/mais/ingressos',
        title: i.title,
        sub: junta('Ingressos e reservas', formatDayLabel(i.date)),
        tipo: 'ingresso',
      },
      junta(i.title, i.jp),
      junta(i.action, i.when, i.where, i.cost, i.note),
    );
  }

  for (const g of SHOPPING_GUIDES) {
    const corpo = g.blocks.map((b) => {
      if (b.type === 'p') return b.text;
      if (b.type === 'bullets') return b.items.join(' · ');
      if (b.type === 'note') return junta(b.note.label, ...(b.note.paragraphs ?? []), ...(b.note.bullets ?? []));
      return junta(b.table.title, ...b.table.rows.map((r) => r.join(' · ')));
    });
    add(
      { key: `compras:${g.id}`, href: '/mais/compras', title: g.title, sub: 'Guia de compras', tipo: 'compras' },
      g.title,
      junta(...corpo),
    );
  }
  for (const c of COMPRAS_ITEMS) {
    add(
      { key: `lista:${c.id}`, href: '/mais/compras', title: c.title, sub: 'Lista de compras', tipo: 'compras' },
      c.title,
      c.subtitle,
    );
  }

  for (const k of KONBINI_ITEMS) {
    add(
      { key: `konbini:${k.id}`, href: '/mais/konbini', title: k.title, sub: 'Konbini', tipo: 'konbini' },
      junta(k.title, k.jp, k.romaji),
      junta(k.where, ...k.paragraphs, k.tip),
    );
  }

  for (const h of HACKS) {
    add(
      { key: `truque:${h.id}`, href: '/mais/hacks', title: h.title, sub: junta('Truques', h.para), tipo: 'truque' },
      junta(h.title, h.jp, h.romaji),
      junta(h.para, h.onde, ...h.paragraphs, h.como, h.aviso),
    );
  }

  return { itens, vocabulario };
}

let indice: Indice | null = null;
const pegaIndice = () => (indice ??= montar());

/** Monta o índice antes da primeira letra (ao tocar na caixa), para a digitação não engasgar. */
export function aquecerBusca() {
  try {
    pegaIndice();
  } catch {
    /* a busca avisa na hora de buscar */
  }
}

// ── busca ───────────────────────────────────────────────────────────────────

interface Termo {
  plano: string;
  som: string;
  /** palavras do roteiro (pelo som) aceitas no lugar deste termo */
  alternativas: string[];
}

/**
 * A chave pelo som encolhe ("xx" vira "x"), e uma chave de uma letra só bate
 * em tudo. Abaixo de duas letras ela não vale: fica só o texto como escrito.
 */
const pelosom = (texto: string, t: Termo) => t.som.length >= 2 && texto.includes(t.som);

const bateNoNome = (it: Item, t: Termo) =>
  it.nomePlano.includes(t.plano) ||
  pelosom(it.nomeSom, t) ||
  t.alternativas.some((a) => it.nomeSom.includes(a));

const bate = (it: Item, t: Termo) =>
  it.tudoPlano.includes(t.plano) ||
  pelosom(it.tudoSom, t) ||
  t.alternativas.some((a) => it.tudoSom.includes(a));

/** Onde, no corpo, o termo aparece — olhando palavra por palavra, para valer nos três níveis. */
function trechoDe(corpo: string, t: Termo): Trecho | undefined {
  const baixo = leve(corpo);
  let inicio = -1;
  let tamanho = 0;

  PALAVRA.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = PALAVRA.exec(baixo))) {
    const p = cola(m[0]);
    const s = som(p);
    if (p.includes(t.plano) || pelosom(s, t) || t.alternativas.some((a) => s.includes(a))) {
      inicio = m.index;
      tamanho = m[0].length;
      break;
    }
  }
  if (inicio < 0) {
    // japonês, ou um termo que atravessa palavras
    inicio = baixo.indexOf(t.plano);
    tamanho = t.plano.length;
  }
  if (inicio < 0) return undefined;

  const de = Math.max(0, inicio - 40);
  const ate = Math.min(corpo.length, inicio + tamanho + 60);
  return {
    antes: (de > 0 ? '…' : '') + corpo.slice(de, inicio),
    achado: corpo.slice(inicio, inicio + tamanho),
    depois: corpo.slice(inicio + tamanho, ate) + (ate < corpo.length ? '…' : ''),
  };
}

const VAZIA: RespostaBusca = { resultados: [], total: 0, parecidos: [] };

export function buscar(pergunta: string): RespostaBusca {
  const termosPlanos = plano(pergunta.trim().slice(0, 80))
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6);
  if (termosPlanos.join('').length < 2) return VAZIA;

  const { itens, vocabulario } = pegaIndice();
  const termos: Termo[] = termosPlanos.map((p) => ({ plano: p, som: som(p), alternativas: [] }));

  let achados = itens.filter((it) => termos.every((t) => bate(it, t)));
  const parecidos: string[] = [];

  if (achados.length === 0) {
    // nada como escrito, nem pelo som: aceita palavras a uma ou duas letras de distância
    for (const t of termos) {
      const max = tolerancia(t.som);
      // só para a palavra que não existe em lugar nenhum: as outras ficam como foram escritas
      if (max === 0 || itens.some((it) => bate(it, t))) continue;
      vocabulario.forEach((_, chave) => {
        if (distancia(t.som, chave, max) <= max) t.alternativas.push(chave);
      });
    }
    if (termos.some((t) => t.alternativas.length > 0)) {
      achados = itens.filter((it) => termos.every((t) => bate(it, t)));
      const usadas = new Set<string>();
      for (const t of termos) {
        for (const a of t.alternativas) {
          if (achados.some((it) => it.tudoSom.includes(a))) usadas.add(vocabulario.get(a) ?? a);
        }
      }
      parecidos.push(...Array.from(usadas).slice(0, 4));
    }
  }
  if (achados.length === 0) return VAZIA;

  const pontuados = achados.map((it, ordem) => ({
    it,
    ordem,
    noNome: termos.every((t) => bateNoNome(it, t)),
    pontos: termos.reduce((s, t) => s + (bateNoNome(it, t) ? 2 : 1), 0),
  }));

  // um prato do catálogo já aponta para a parada: se a parada só bateu no texto, ela é repetição
  const paradasCobertas = new Set(pontuados.map((p) => p.it.paradaKey).filter(Boolean));
  const semRepeticao = pontuados.filter((p) => !(paradasCobertas.has(p.it.key) && !p.noNome));

  semRepeticao.sort((a, b) => b.pontos - a.pontos || a.ordem - b.ordem);

  const resultados = semRepeticao.slice(0, MAX_RESULTADOS).map(({ it }) => {
    const fora = termos.find((t) => !bateNoNome(it, t));
    return {
      key: it.key,
      href: it.href,
      title: it.title,
      sub: it.sub,
      tipo: it.tipo,
      trecho: fora ? trechoDe(it.corpo, fora) : undefined,
    };
  });

  return { resultados, total: semRepeticao.length, parecidos };
}

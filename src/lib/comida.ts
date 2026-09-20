import { ALL_DAYS } from '@/data/days';
import {
  COMIDA_CATS,
  COMIDA_ITENS,
  type Aviso,
  type ComidaCatId,
  type ComidaItem,
  type Formato,
  GLOSSARIO,
  type GlossarioTermo,
} from '@/data/comida';
import { bairroDe, cidadeDe, itemMapsUrl, itemPhotosUrl } from '@/lib/places';

/** Um item do catálogo já cruzado com a parada de onde ele veio */
export interface ComidaResolvida extends ComidaItem {
  dayId: string;
  /** '2026-11-19' */
  data: string;
  /** '19/11' */
  dataCurta: string;
  /** 'jantar', 'almoço', 'mercado'… — o timeLabel da parada */
  refeicao: string;
  /** 'Akihabara', 'Gion' — para o agrupamento por lugar */
  bairro: string;
  /** '19:00' */
  hora: string;
  cidade: string;
  mapsUrl: string;
  fotosUrl: string;
  /** formato + avisos + "especialidade local" numa lista só, para filtrar */
  rotulos: string[];
}

/**
 * Todos os rótulos de um item numa lista só, para filtrar. A ordem é a da
 * leitura: o que está no prato, onde se come, o que atrapalha, e se é a
 * especialidade da cidade.
 */
export function rotulosDe(item: ComidaItem): string[] {
  return [
    ...(item.estilo ?? []),
    ...item.formato,
    ...(item.avisos ?? []),
    ...(item.local ? ['especialidade local'] : []),
    ...(item.pedido ? ['a pedido'] : []),
  ];
}

/**
 * Cruza `COMIDA_ITENS` com o roteiro. Um `stopId` que não existe mais é erro
 * de build, e não um cartão mudo na tela: é assim que a página avisa que o
 * roteiro mudou embaixo dela.
 */
export function comidaResolvida(): ComidaResolvida[] {
  const indice = new Map<string, { dayId: string; date: string; time: string; timeLabel?: string }>();
  for (const day of ALL_DAYS) {
    for (const stop of day.stops) {
      indice.set(stop.id, {
        dayId: day.id,
        date: day.date,
        time: stop.time,
        timeLabel: stop.timeLabel,
      });
    }
  }

  return COMIDA_ITENS.map((item) => {
    const parada = indice.get(item.stopId);
    if (!parada) {
      throw new Error(
        `comida.ts: o item "${item.id}" aponta para a parada "${item.stopId}", que não existe no roteiro.`,
      );
    }
    const busca = item.busca ?? item.nome;
    return {
      ...item,
      dayId: parada.dayId,
      data: parada.date,
      dataCurta: `${parada.date.slice(8)}/${parada.date.slice(5, 7)}`,
      refeicao: parada.timeLabel ?? 'parada',
      hora: parada.time,
      cidade: cidadeDe(item.stopId, parada.dayId),
      bairro: bairroDe(item.stopId, item.bairro),
      rotulos: rotulosDe(item),
      mapsUrl: itemMapsUrl(busca, item.stopId, parada.dayId),
      fotosUrl: itemPhotosUrl(busca, item.stopId, parada.dayId),
    };
  }).sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));
}

export interface CatResumo {
  id: ComidaCatId;
  titulo: string;
  jp: string;
  resumo: string;
  total: number;
  /** 'omakase 2 · kaiten 3 · rede 2' — o que dá para ler de relance */
  quebra: { rotulo: string; n: number }[];
}

/** O placar do topo: quantos lugares por categoria e de que tipo cada um é */
export function resumoPorCategoria(itens: ComidaResolvida[]): CatResumo[] {
  return COMIDA_CATS.map((cat) => {
    const doGrupo = itens.filter((i) => i.cat === cat.id);
    const conta = (pega: (i: ComidaResolvida) => string[]) => {
      const mapa = new Map<string, number>();
      for (const item of doGrupo) {
        for (const r of pega(item)) mapa.set(r, (mapa.get(r) ?? 0) + 1);
      }
      return [...mapa.entries()]
        .map(([rotulo, n]) => ({ rotulo, n }))
        .sort((a, b) => b.n - a.n || a.rotulo.localeCompare(b.rotulo));
    };
    // o prato vem antes do lugar: é o que se quer saber primeiro
    const quebra = [...conta((i) => i.estilo ?? []), ...conta((i) => i.formato)];
    const locais = doGrupo.filter((i) => i.local).length;
    if (locais) quebra.push({ rotulo: 'especialidade local', n: locais });
    return { ...cat, total: doGrupo.length, quebra };
  }).filter((c) => c.total > 0);
}

/** Os rótulos que existem de fato, com a contagem — viram os chips de filtro */
export function rotulosDisponiveis(itens: ComidaResolvida[]): { rotulo: string; n: number }[] {
  const contagem = new Map<string, number>();
  for (const item of itens) {
    for (const r of item.rotulos) contagem.set(r, (contagem.get(r) ?? 0) + 1);
  }
  return [...contagem.entries()]
    .map(([rotulo, n]) => ({ rotulo, n }))
    .sort((a, b) => b.n - a.n || a.rotulo.localeCompare(b.rotulo));
}

export const AVISOS: Aviso[] = ['fila', 'reserva', 'sem reserva', 'esgota cedo', 'só almoço', '24h'];

export function ehAviso(rotulo: string): rotulo is Aviso {
  return (AVISOS as string[]).includes(rotulo);
}

export function ehFormato(rotulo: string): rotulo is Formato {
  return !ehAviso(rotulo) && rotulo !== 'especialidade local' && rotulo !== 'a pedido';
}

/** Um termo do glossário já sabendo onde ele aparece no roteiro */
export interface TermoResolvido extends GlossarioTermo {
  /** quantos lugares do catálogo servem isto */
  n: number;
}

export interface GrupoGlossario {
  cat: ComidaCatId;
  titulo: string;
  jp: string;
  termos: TermoResolvido[];
}

/**
 * O glossário, agrupado por categoria e contado contra o catálogo.
 *
 * Um `estilo` sem verbete é erro de build, pelo mesmo motivo que um `stopId`
 * órfão é: prato novo no roteiro tem que ganhar explicação, senão a página
 * promete um glossário completo e entrega um furo.
 */
export function glossarioResolvido(itens: ComidaResolvida[]): GrupoGlossario[] {
  const uso = new Map<string, number>();
  for (const item of itens) {
    for (const e of item.estilo ?? []) uso.set(e, (uso.get(e) ?? 0) + 1);
  }

  const verbetes = new Set(GLOSSARIO.map((g) => g.termo));
  const semVerbete = [...uso.keys()].filter((e) => !verbetes.has(e));
  if (semVerbete.length > 0) {
    throw new Error(
      `comida.ts: estes pratos aparecem em \`estilo\` mas não têm verbete no GLOSSARIO: ${semVerbete.join(', ')}.`,
    );
  }

  return COMIDA_CATS.map((cat) => ({
    cat: cat.id,
    titulo: cat.titulo,
    jp: cat.jp,
    termos: GLOSSARIO.filter((g) => g.cat === cat.id)
      .map((g) => ({ ...g, n: uso.get(g.termo) ?? 0 }))
      .sort((a, b) => b.n - a.n || a.termo.localeCompare(b.termo)),
  })).filter((g) => g.termos.length > 0);
}

export interface BairroResumo {
  bairro: string;
  cidade: string;
  total: number;
  /** 'Sushi 3 · Ramen 2' — o que dá para comer ali */
  quebra: { rotulo: string; n: number }[];
  /** quantos já estão marcados no roteiro */
  marcados: number;
  /** as datas em que vocês passam por ali */
  datas: string[];
}

/**
 * O mesmo catálogo agrupado por bairro, para a pergunta do meio da rua:
 * "estou aqui, o lugar do roteiro fechou, o que mais tem por perto?".
 *
 * Ordena pelo número de endereços, porque um bairro com oito opções é o que
 * resolve a emergência e um com uma só não resolve nada.
 */
export function resumoPorBairro(itens: ComidaResolvida[]): BairroResumo[] {
  const grupos = new Map<string, ComidaResolvida[]>();
  for (const item of itens) {
    const lista = grupos.get(item.bairro);
    if (lista) lista.push(item);
    else grupos.set(item.bairro, [item]);
  }

  return [...grupos.entries()]
    .map(([bairro, doGrupo]) => {
      const porCat = new Map<string, number>();
      for (const i of doGrupo) porCat.set(i.cat, (porCat.get(i.cat) ?? 0) + 1);
      return {
        bairro,
        cidade: doGrupo[0].cidade,
        total: doGrupo.length,
        marcados: doGrupo.filter((i) => i.plano === 'marcado').length,
        datas: [...new Set(doGrupo.map((i) => i.dataCurta))].sort(),
        quebra: [...porCat.entries()]
          .map(([id, n]) => ({ rotulo: COMIDA_CATS.find((c) => c.id === id)?.titulo ?? id, n }))
          .sort((a, b) => b.n - a.n || a.rotulo.localeCompare(b.rotulo)),
      };
    })
    .sort((a, b) => b.total - a.total || a.bairro.localeCompare(b.bairro));
}

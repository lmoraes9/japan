import { ALL_DAYS, stopById } from '@/data/days';
import { LEGS, START } from '@/data/legs';
import type { Day, Stop } from '@/data/types';
import type { MapaEstacoes, Ponto } from '@/data/estacoes/types';
import { stopsEmOrdem } from '@/lib/now';

export interface DiaMapa {
  dayId: string;
  /** número do dia na viagem, 1 a 16 */
  n: number;
  date: string;
  /** '19/11' */
  data: string;
  titulo: string;
  cor: string;
}

/** cores dos dias dentro de um mapa — distintas entre si, não por etapa */
const CORES = ['#C2402A', '#1F6FB2', '#2E8B57', '#B9861A', '#6B4A7A', '#D2691E', '#008B8B', '#8B1E3F', '#4F6349'];

const curta = (iso: string) => `${iso.slice(8)}/${iso.slice(5, 7)}`;

/** Os dias que aparecem num mapa: os das paradas penduradas nele, na ordem da viagem. */
export function diasDoMapa(mapa: MapaEstacoes): DiaMapa[] {
  const ids = new Set<string>();
  for (const p of mapa.pontos) {
    if (!p.stopId) continue;
    const r = stopById(p.stopId);
    if (r) ids.add(r.day.id);
  }
  return ALL_DAYS.map((d, i) => ({ d, i }))
    .filter(({ d }) => ids.has(d.id))
    .map(({ d, i }, k) => ({
      dayId: d.id,
      n: i + 1,
      date: d.date,
      data: curta(d.date),
      titulo: d.title,
      cor: CORES[k % CORES.length],
    }));
}

export interface InfoParada {
  day: Day;
  stop: Stop;
  /** ordem da parada no dia, começando em 1 */
  n: number;
  /** a parada anterior no dia, se houver */
  anterior?: Stop;
}

/** Dia, parada e ordem de um ponto do roteiro. */
export function infoDaParada(p: Ponto): InfoParada | undefined {
  if (!p.stopId) return undefined;
  const r = stopById(p.stopId);
  if (!r) return undefined;
  const ordem = stopsEmOrdem(r.day.stops);
  const i = ordem.findIndex((s) => s.id === r.stop.id);
  return { day: r.day, stop: r.stop, n: i + 1, anterior: i > 0 ? ordem[i - 1] : undefined };
}

/**
 * As linhas do mapa que os trechos de um dia usam — é o que acende quando se
 * escolhe o dia. Lê legs.ts, então acompanha o roteiro sozinho.
 */
export function linhasDoDia(mapa: MapaEstacoes, dayId: string): Set<string> {
  const day = ALL_DAYS.find((d) => d.id === dayId);
  const usadas = new Set<string>();
  if (!day) return usadas;
  const trechos = [...(START[dayId] ?? []), ...day.stops.flatMap((s) => LEGS[s.id] ?? [])];
  for (const t of trechos) {
    const texto = `${t.mode} ${t.line ?? ''}`;
    for (const l of mapa.linhas) {
      if (l.casa?.test(texto)) usadas.add(l.id);
    }
  }
  return usadas;
}

import type { Day, Stop } from '@/data/types';
import { placeMapByStopId } from '@/data/placeMaps';
import { stopsEmOrdem } from '@/lib/now';
import { pontoDe } from '@/lib/mapsLinks';

export interface PontoDoDia {
  nome: string;
  jp?: string;
  nota?: string;
  /** como o Google Maps acha: 'lat,lng' ou uma busca */
  destino: string;
}

export interface ParadaDoDia {
  stop: Stop;
  destino: string;
  pontos: PontoDoDia[];
}

const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const lugar = (c?: { lat: number; lng: number }) => (c ? `${c.lat},${c.lng}` : undefined);

/**
 * O dia inteiro, na ordem em que se anda: cada parada e, dentro dela, os
 * pontos de detalhe. Os pontos vêm de `stop.pontos` ou, nas paradas com mapa
 * ilustrado, dos marcadores do mapa, na ordem dos números.
 */
export function paradasDoDia(day: Day): ParadaDoDia[] {
  return stopsEmOrdem(day.stops).map((stop) => {
    let pontos: PontoDoDia[] = [];
    if (stop.pontos?.length) {
      pontos = stop.pontos.map((p) => ({ nome: p.name, jp: p.jp, nota: p.note, destino: lugar(p.coords) ?? p.query }));
    } else {
      const mapa = placeMapByStopId(stop.id);
      if (mapa) {
        // o mapa de Miyajima cobre a ilha toda: o que já é parada própria do
        // dia (Daishō-in, Momijidani, Misen) fica na parada dele, não aqui
        const outras = day.stops.filter((s) => s.id !== stop.id).map((s) => norm(s.name));
        const repete = (rotulo: string) => outras.some((o) => o.includes(norm(rotulo)));
        pontos = [...mapa.hotspots]
          .sort((a, b) => a.n - b.n)
          .filter((h) => !repete(h.label))
          .map((h) => ({ nome: h.title, jp: h.jp, destino: lugar(h.coords) ?? h.mapQuery ?? `${h.title} ${mapa.title}` }));
      }
    }
    return { stop, destino: pontoDe(stop), pontos };
  });
}

/** rota do Google Maps saindo de onde a pessoa está (sem origin = localização atual) */
export function irAte(destino: string, modo: 'transit' | 'walking'): string {
  return `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', destination: destino, travelmode: modo })}`;
}

/**
 * A caminhada por dentro de uma parada, em pedaços: no celular o Google Maps
 * aceita no máximo 3 paradas intermediárias por link, então cada pedaço tem
 * até 5 pontos (saída, 3 no meio, chegada) e o seguinte começa onde o
 * anterior terminou.
 */
export function caminhadas(pontos: string[]): string[] {
  const links: string[] = [];
  for (let i = 0; i < pontos.length - 1; i += 4) {
    const trecho = pontos.slice(i, i + 5);
    if (trecho.length < 2) break;
    const p = new URLSearchParams({ api: '1', origin: trecho[0], destination: trecho[trecho.length - 1], travelmode: 'walking' });
    if (trecho.length > 2) p.set('waypoints', trecho.slice(1, -1).join('|'));
    links.push(`https://www.google.com/maps/dir/?${p}`);
  }
  return links;
}

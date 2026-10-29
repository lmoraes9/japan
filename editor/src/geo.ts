/** Dados de mapa: mundo (world-atlas, Natural Earth) e Japão por província (dataofjapan/land). */
import { feature, mesh } from 'topojson-client';
import { geoBounds } from 'd3-geo';
import type { Feature, FeatureCollection, MultiLineString } from 'geojson';
import land110 from 'world-atlas/land-110m.json';
import countries110 from 'world-atlas/countries-110m.json';
import countries50 from 'world-atlas/countries-50m.json';
import japao from '../dados/japao.geo.json';

const topo = (x: unknown) => x as any;

export const terraGlobo = feature(topo(land110), topo(land110).objects.land) as unknown as Feature;
export const divisasGlobo = mesh(topo(countries110), topo(countries110).objects.countries, (a: unknown, b: unknown) => a !== b) as MultiLineString;

type ComCaixa = { f: Feature; caixa: [[number, number], [number, number]] };
const comCaixa = (fs: Feature[]): ComCaixa[] => fs.map((f) => ({ f, caixa: geoBounds(f as any) as ComCaixa['caixa'] }));

/** países vizinhos (Coreia, China, Rússia…) em 1:50m, sem o Japão — o Japão vem detalhado à parte */
export const vizinhos = comCaixa(
  (feature(topo(countries50), topo(countries50).objects.countries) as unknown as FeatureCollection).features.filter((f) => String(f.id) !== '392'),
);
export const provincias = comCaixa((japao as unknown as FeatureCollection).features);

/** só o que cruza a caixa visível: o mapa do Japão tem 80 mil pontos */
export function visiveis(lista: ComCaixa[], [[x0, y0], [x1, y1]]: [[number, number], [number, number]]): Feature[] {
  return lista.filter(({ caixa: [[a0, b0], [a1, b1]] }) => a1 >= x0 && a0 <= x1 && b1 >= y0 && b0 <= y1).map((c) => c.f);
}

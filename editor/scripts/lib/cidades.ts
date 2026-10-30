/**
 * Nome da cidade pelo GPS, sem internet: as cidades com 1000+ habitantes do
 * GeoNames (pacote all-the-cities). Serve para o que fica fora do roteiro.
 */
import { createRequire } from 'node:module';
import { distM } from './lugares.ts';

interface Cidade {
  name: string;
  featureCode: string;
  population: number;
  loc: { coordinates: [number, number] };
}

const require = createRequire(import.meta.url);
// PPLX são bairros: no GeoNames eles ficam longe de onde deveriam
const CIDADES = (require('all-the-cities') as Cidade[]).filter((c) => c.featureCode !== 'PPLX');

/**
 * A cidade "mais forte" por perto: distância dividida pela raiz quarta da
 * população. Assim Asakusa dá Tokyo, e não Urayasu, que fica à mesma distância
 * do outro lado do rio; e Miyajima continua Miyajima.
 */
export function cidadePerto(p: { lat: number; lng: number }): string | undefined {
  let melhor: { nome: string; nota: number } | undefined;
  for (const c of CIDADES) {
    const [lng, lat] = c.loc.coordinates;
    if (Math.abs(lat - p.lat) > 0.5 || Math.abs(lng - p.lng) > 0.6) continue;
    const nota = distM(p, { lat, lng }) / Math.pow(Math.max(c.population, 1000), 0.25);
    if (!melhor || nota < melhor.nota) melhor = { nome: c.name, nota };
  }
  return melhor?.nome;
}

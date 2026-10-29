/**
 * O motor dos mapas, sem aparência: quando a ponta da rota chega a cada ponto,
 * por onde a linha passa e como a câmera enquadra. Os estilos só desenham.
 */
import { geoDistance, geoInterpolate, geoMercator } from 'd3-geo';
import type { Ponto } from './plano.ts';
import { H, W } from './tema.ts';

export type LngLat = [number, number];
export type Escala = 'globo' | 'regiao' | 'local';

export const RAIO_TERRA = 6371;
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const ll = (p: Ponto): LngLat => [p.lng, p.lat];
export const perto = (a: [number, number] | null, b: [number, number], px: number) => !!a && Math.hypot(a[0] - b[0], a[1] - b[1]) < px;

/** área útil do mapa, entre o título e a legenda */
export interface Area {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}
export const AREA: Area = { x0: 110, x1: W - 110, y0: 560, y1: H - 600 };
export const centroDe = (a: Area): [number, number] => [(a.x0 + a.x1) / 2, (a.y0 + a.y1) / 2];

// ─── a rota no tempo ─────────────────────────────────────────────────────

export interface Perna {
  a: Ponto;
  b: Ponto;
  km: number;
  curva: number;
}

export interface Agenda {
  pernas: Perna[];
  /** quadro em que a ponta chega a cada ponto */
  chegada: number[];
  /** posição da ponta no quadro f: perna e fração */
  ponta: (f: number) => { perna: number; u: number; km: number };
  kmTotal: number;
}

export function montarAgenda(pontos: Ponto[], escala: Escala, inicio: number, fim: number, fps: number): Agenda {
  const pernas: Perna[] = pontos.slice(1).map((b, i) => ({
    a: pontos[i],
    b,
    km: geoDistance(ll(pontos[i]), ll(b)) * RAIO_TERRA,
    curva: escala === 'globo' ? 0 : (escala === 'regiao' ? 0.2 : 0.1) * (i % 2 ? -1 : 1),
  }));
  // pausa nos pontos que não são só de passagem (e onde tem foto)
  const pausa = Math.round(0.45 * fps);
  const para = pontos.map((p, k) => k > 0 && k < pontos.length - 1 && (!p.passagem || !!p.foto));
  // trechos corridos entre pausas
  const trechos: { de: number; ate: number; km: number }[] = [];
  let de = 0;
  for (let i = 0; i < pernas.length; i++) {
    if (i === pernas.length - 1 || para[i + 1]) {
      trechos.push({ de, ate: i, km: pernas.slice(de, i + 1).reduce((n, p) => n + p.km, 0) });
      de = i + 1;
    }
  }
  const pausas = para.filter(Boolean).length * pausa;
  const livre = Math.max(1, fim - inicio - pausas);
  const pesos = trechos.map((t) => Math.pow(Math.max(t.km, 0.01), 0.6));
  const somaPesos = pesos.reduce((a, b) => a + b, 0);
  const dur = pesos.map((p) => (p / somaPesos) * livre);

  const kmAntes = pernas.map((_, i) => pernas.slice(0, i).reduce((n, p) => n + p.km, 0));
  const kmTotal = pernas.reduce((n, p) => n + p.km, 0);
  const chegada = pontos.map(() => inicio);
  const janelas: { f0: number; f1: number; t: (typeof trechos)[number] }[] = [];
  let f = inicio;
  trechos.forEach((t, j) => {
    janelas.push({ f0: f, f1: f + dur[j], t });
    // chegada a cada ponto dentro do trecho, pela distância percorrida
    let acc = 0;
    for (let i = t.de; i <= t.ate; i++) {
      acc += pernas[i].km;
      const frac = t.km > 0 ? acc / t.km : 1;
      // inverte o easing aproximando por busca
      let lo = 0;
      let hi = 1;
      for (let n = 0; n < 24; n++) {
        const mid = (lo + hi) / 2;
        if (suave(mid) < frac) lo = mid;
        else hi = mid;
      }
      chegada[i + 1] = f + hi * dur[j];
    }
    f += dur[j] + (para[t.ate + 1] ? pausa : 0);
  });

  const ponta = (q: number) => {
    if (q <= inicio) return { perna: 0, u: 0, km: 0 };
    for (const jan of janelas) {
      if (q < jan.f0) break;
      const s = q >= jan.f1 ? 1 : suave((q - jan.f0) / (jan.f1 - jan.f0));
      if (q < jan.f1 || jan === janelas[janelas.length - 1]) {
        let alvo = s * jan.t.km;
        for (let i = jan.t.de; i <= jan.t.ate; i++) {
          if (alvo <= pernas[i].km || i === jan.t.ate) {
            const u = pernas[i].km > 0 ? Math.min(1, alvo / pernas[i].km) : 1;
            return { perna: i, u, km: kmAntes[i] + u * pernas[i].km };
          }
          alvo -= pernas[i].km;
        }
      }
    }
    // numa pausa: parado no fim do trecho anterior
    const ultima = [...janelas].reverse().find((j) => q >= j.f1)!;
    return { perna: ultima.t.ate, u: 1, km: kmAntes[ultima.t.ate] + pernas[ultima.t.ate].km };
  };

  return { pernas, chegada, ponta, kmTotal };
}

/** ponto da perna na fração u: arco de círculo máximo no globo, curva suave no plano */
export function naPerna(p: Perna, u: number, escala: Escala): LngLat {
  if (escala === 'globo') return geoInterpolate(ll(p.a), ll(p.b))(u) as LngLat;
  const [x0, y0] = ll(p.a);
  const [x2, y2] = ll(p.b);
  const dx = x2 - x0;
  const dy = y2 - y0;
  const cx = (x0 + x2) / 2 - dy * p.curva;
  const cy = (y0 + y2) / 2 + dx * p.curva;
  const v = 1 - u;
  return [v * v * x0 + 2 * v * u * cx + u * u * x2, v * v * y0 + 2 * v * u * cy + u * u * y2];
}

export function rotaAte(ag: Agenda, perna: number, u: number, escala: Escala): LngLat[] {
  const out: LngLat[] = [];
  for (let i = 0; i <= perna; i++) {
    const fim = i < perna ? 1 : u;
    const n = Math.max(2, Math.ceil(64 * fim));
    for (let k = 0; k <= n; k++) out.push(naPerna(ag.pernas[i], (k / n) * fim, escala));
  }
  return out;
}

// ─── câmera ──────────────────────────────────────────────────────────────

export interface Vista {
  c: LngLat;
  k: number;
}

export function enquadrar(pts: LngLat[], spanMin: number, area: Area = AREA): Vista {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const [x, y] of pts) {
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
  }
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const sx = Math.max(x1 - x0, spanMin) / 2;
  const sy = Math.max(y1 - y0, spanMin * 0.8) / 2;
  const caixa = { type: 'MultiPoint', coordinates: [[cx - sx, cy - sy], [cx + sx, cy + sy]] } as const;
  const p = geoMercator().fitExtent([[area.x0, area.y0], [area.x1, area.y1]], caixa as any);
  return { c: p.invert!(centroDe(area)) as LngLat, k: p.scale() };
}

export const misturar = (a: Vista, b: Vista, t: number): Vista => ({
  c: [a.c[0] + (b.c[0] - a.c[0]) * t, a.c[1] + (b.c[1] - a.c[1]) * t],
  k: Math.exp(Math.log(a.k) + (Math.log(b.k) - Math.log(a.k)) * t),
});

export const mercator = (v: Vista, area: Area = AREA) => geoMercator().center(v.c).scale(v.k).translate(centroDe(area));

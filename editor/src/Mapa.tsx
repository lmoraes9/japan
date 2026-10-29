/**
 * O mapinha do trajeto: globo para os voos, Japão para o trem bala, cidade
 * para o que se faz no mesmo dia. A rota se desenha da origem ao destino, o
 * selo do transporte vai na ponta, e as fotos do caminho aparecem como polaroid.
 */
import React, { useMemo } from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { geoDistance, geoGraticule10, geoInterpolate, geoMercator, geoOrthographic, geoPath, type GeoProjection } from 'd3-geo';
import { divisasGlobo, provincias, terraGlobo, visiveis, vizinhos } from './geo.ts';
import { IconeHtml, Selo } from './icones.tsx';
import type { Modo, Ponto } from './plano.ts';
import { COR, FONTE, H, SEGURO, W } from './tema.ts';

type LngLat = [number, number];
type Escala = 'globo' | 'regiao' | 'local';

const RAIO_TERRA = 6371;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const ll = (p: Ponto): LngLat => [p.lng, p.lat];
const perto = (a: [number, number] | null, b: [number, number], px: number) => !!a && Math.hypot(a[0] - b[0], a[1] - b[1]) < px;

/** área útil do mapa, entre o título e a legenda */
const AREA = { x0: 110, x1: W - 110, y0: 560, y1: H - 600 };
const CENTRO: [number, number] = [W / 2, (AREA.y0 + AREA.y1) / 2];

// ─── a rota no tempo ─────────────────────────────────────────────────────

interface Perna {
  a: Ponto;
  b: Ponto;
  km: number;
  curva: number;
}

interface Agenda {
  pernas: Perna[];
  /** quadro em que a ponta chega a cada ponto */
  chegada: number[];
  /** posição da ponta no quadro f: perna e fração */
  ponta: (f: number) => { perna: number; u: number; km: number };
  kmTotal: number;
}

function montarAgenda(pontos: Ponto[], escala: Escala, inicio: number, fim: number, fps: number): Agenda {
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
function naPerna(p: Perna, u: number, escala: Escala): LngLat {
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

function rotaAte(ag: Agenda, perna: number, u: number, escala: Escala): LngLat[] {
  const out: LngLat[] = [];
  for (let i = 0; i <= perna; i++) {
    const fim = i < perna ? 1 : u;
    const n = Math.max(2, Math.ceil(64 * fim));
    for (let k = 0; k <= n; k++) out.push(naPerna(ag.pernas[i], (k / n) * fim, escala));
  }
  return out;
}

// ─── câmera ──────────────────────────────────────────────────────────────

interface Vista {
  c: LngLat;
  k: number;
}

function enquadrar(pts: LngLat[], spanMin: number): Vista {
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
  const p = geoMercator().fitExtent([[AREA.x0, AREA.y0], [AREA.x1, AREA.y1]], caixa as any);
  return { c: p.invert!(CENTRO) as LngLat, k: p.scale() };
}

const misturar = (a: Vista, b: Vista, t: number): Vista => ({
  c: [a.c[0] + (b.c[0] - a.c[0]) * t, a.c[1] + (b.c[1] - a.c[1]) * t],
  k: Math.exp(Math.log(a.k) + (Math.log(b.k) - Math.log(a.k)) * t),
});

const mercator = (v: Vista) => geoMercator().center(v.c).scale(v.k).translate(CENTRO);

// ─── componentes ─────────────────────────────────────────────────────────

const Rotulo: React.FC<{ x: number; y: number; p: Ponto; aparece: number; cinza?: boolean }> = ({ x, y, p, aparece, cinza }) => {
  const esquerda = x > W * 0.62;
  const pequeno = p.passagem || cinza;
  return (
    <div
      style={{
        position: 'absolute',
        left: esquerda ? undefined : x + (pequeno ? 22 : 34),
        right: esquerda ? W - x + (pequeno ? 22 : 34) : undefined,
        top: y - (pequeno ? 20 : 34),
        textAlign: esquerda ? 'right' : 'left',
        opacity: aparece,
        transform: `translateY(${(1 - aparece) * 12}px)`,
        whiteSpace: 'nowrap',
        textShadow: '0 2px 10px rgba(0,0,0,0.7)',
      }}
    >
      <div style={{ fontSize: pequeno ? 26 : 40, fontWeight: pequeno ? 500 : 900, color: cinza ? COR.cinza : COR.texto, lineHeight: 1.1 }}>
        {p.nome}
        {p.jp && !pequeno ? <span style={{ fontSize: 26, fontWeight: 500, color: COR.rotaClara, marginLeft: 12 }}>{p.jp}</span> : null}
      </div>
      {p.sub && !cinza ? <div style={{ fontSize: pequeno ? 20 : 26, fontWeight: 500, color: COR.textoSuave, marginTop: 4 }}>{p.sub}</div> : null}
    </div>
  );
};

const Polaroid: React.FC<{ x: number; y: number; foto: string; legenda: string; f: number; fps: number; lado: number }> = ({ x, y, foto, legenda, f, fps, lado }) => {
  const s = spring({ frame: f, fps, config: { damping: 14, mass: 0.6 } });
  if (f < 0) return null;
  const w = 250;
  const left = Math.min(W - w - 50, Math.max(50, x + (lado > 0 ? 40 : -w - 40)));
  const top = Math.min(AREA.y1 - 330, Math.max(SEGURO.topo + 200, y - 440));
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: w,
        padding: '12px 12px 0',
        background: COR.papel,
        borderRadius: 4,
        boxShadow: '0 18px 40px rgba(0,0,0,0.55)',
        transform: `rotate(${lado * 5}deg) scale(${s})`,
        transformOrigin: lado > 0 ? 'bottom left' : 'bottom right',
      }}
    >
      <Img src={staticFile(foto)} style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }} />
      <div style={{ fontSize: 22, color: '#2a2a2a', padding: '10px 2px 12px', fontWeight: 700, textAlign: 'center' }}>{legenda}</div>
    </div>
  );
};

export interface MapaProps {
  escala: Escala;
  pontos: Ponto[];
  modos: Modo[];
  contexto?: Ponto[];
  /** fração do segmento em que a rota começa e termina de se desenhar */
  janela?: [number, number];
  /** aproxima do destino no fim (desligado no resumo) */
  chegarPerto?: boolean;
  /** desenha o contador de km */
  km?: boolean;
  children?: (estado: { kmAteAgora: number; kmTotal: number }) => React.ReactNode;
}

export const MapaCena: React.FC<MapaProps> = ({ escala, pontos, modos, contexto = [], janela = [0.16, 0.8], chegarPerto = true, children }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: N } = useVideoConfig();
  const inicio = Math.round(N * janela[0]);
  const fimRota = Math.round(N * janela[1]);
  const ag = useMemo(() => montarAgenda(pontos, escala, inicio, fimRota, fps), [pontos, escala, inicio, fimRota, fps]);
  const { perna, u, km } = ag.ponta(f);
  const cabeca = naPerna(ag.pernas[perna], u, escala);
  const modo = modos[Math.min(perna, modos.length - 1)] ?? 'trem';

  // ── projeção do quadro ──
  let proj: GeoProjection;
  if (escala === 'globo') {
    // a câmera segue um pouco atrás da ponta, para o avião ir na frente
    const atras = ag.ponta(Math.max(0, f - fps * 0.5));
    const alvo = naPerna(ag.pernas[atras.perna], atras.u, escala);
    const zoom = interpolate(f, [0, inicio], [0.9, 1], { ...clamp, easing: suave });
    proj = geoOrthographic()
      .scale(465 * zoom)
      .translate([W / 2, 985])
      .rotate([-alvo[0], -Math.max(-20, Math.min(32, alvo[1] * 0.55))])
      .clipAngle(90)
      .precision(0.4);
  } else {
    const todos = pontos.map(ll);
    const spanPerto = escala === 'regiao' ? 3.2 : 0.018;
    const geral = enquadrar(todos, escala === 'regiao' ? 4.5 : 0.03);
    const origem = enquadrar([todos[0]], spanPerto);
    const destino = enquadrar([todos[todos.length - 1]], spanPerto);
    let v = geral;
    if (f < inicio) v = misturar(origem, geral, suave(f / inicio));
    else if (chegarPerto && f > fimRota) v = misturar(geral, destino, 0.55 * suave((f - fimRota) / Math.max(1, N - fimRota)));
    proj = mercator(v);
  }
  const caminho = geoPath(proj);
  const xy = (p: LngLat) => proj(p) as [number, number] | null;
  const visivel = (p: LngLat) => escala !== 'globo' || geoDistance(p, (proj.rotate().map((r) => -r) as LngLat)) < Math.PI / 2 - 0.08;

  // ── rota ──
  const feita = rotaAte(ag, perna, u, escala);
  const inteira = rotaAte(ag, ag.pernas.length - 1, 1, escala);
  const linha = (pts: LngLat[]) => {
    if (escala === 'globo') return caminho({ type: 'LineString', coordinates: pts }) ?? '';
    return pts.map((p, i) => `${i ? 'L' : 'M'}${xy(p)!.join(',')}`).join('');
  };

  // ── direção do selo (para o avião apontar) ──
  const frente = naPerna(ag.pernas[perna], Math.min(1, u + 0.02), escala);
  const pa = xy(cabeca);
  const pb = xy(frente);
  const giro = pa && pb ? (Math.atan2(pb[1] - pa[1], pb[0] - pa[0]) * 180) / Math.PI + 90 : 0;
  const andando = f >= inicio && f <= fimRota + fps * 0.3;

  // ── terra ──
  let terra: React.ReactNode;
  if (escala === 'globo') {
    terra = (
      <>
        <path d={caminho({ type: 'Sphere' }) ?? ''} fill={COR.mar} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
        <path d={caminho(geoGraticule10()) ?? ''} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1.2} />
        <path d={caminho(terraGlobo as any) ?? ''} fill={COR.terra} stroke={COR.terraBorda} strokeWidth={1.4} />
        <path d={caminho(divisasGlobo) ?? ''} fill="none" stroke={COR.divisa} strokeWidth={1} />
      </>
    );
  } else {
    const a = proj.invert!([0, 0])!;
    const b = proj.invert!([W, H])!;
    const caixa: [[number, number], [number, number]] = [[Math.min(a[0], b[0]), Math.min(a[1], b[1])], [Math.max(a[0], b[0]), Math.max(a[1], b[1])]];
    terra = (
      <>
        {visiveis(vizinhos, caixa).map((ft, i) => (
          <path key={`v${i}`} d={caminho(ft as any) ?? ''} fill={COR.terra} stroke={COR.terraBorda} strokeWidth={1.2} opacity={0.75} />
        ))}
        {visiveis(provincias, caixa).map((ft, i) => (
          <path key={`p${i}`} d={caminho(ft as any) ?? ''} fill={COR.terra} stroke={COR.divisa} strokeWidth={1.2} />
        ))}
      </>
    );
  }

  const aparece = (q: number) => interpolate(f, [q - 4, q + 8], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 48%, ${COR.fundo2} 0%, ${COR.fundo} 70%)`, fontFamily: FONTE }}>
      <svg width={W} height={H} style={{ position: 'absolute' }}>
        <defs>
          <radialGradient id="atmosfera">
            <stop offset="0.86" stopColor="#5fb4ff" stopOpacity={0} />
            <stop offset="0.93" stopColor="#5fb4ff" stopOpacity={0.18} />
            <stop offset="1" stopColor="#5fb4ff" stopOpacity={0} />
          </radialGradient>
          <filter id="brilho" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          {escala === 'local' ? (
            <pattern id="quadras" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
              <path d="M0 0H46M0 0V46" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
            </pattern>
          ) : null}
        </defs>
        {escala === 'globo' ? <circle cx={W / 2} cy={985} r={465 * 1.08 * interpolate(f, [0, inicio], [0.9, 1], { ...clamp, easing: suave })} fill="url(#atmosfera)" /> : null}
        {terra}
        {escala === 'local' ? <rect width={W} height={H} fill="url(#quadras)" /> : null}

        {/* contexto: as próximas cidades, discretas */}
        {contexto.map((p, i) => {
          const q = xy(ll(p));
          return q && visivel(ll(p)) ? <circle key={i} cx={q[0]} cy={q[1]} r={7} fill={COR.cinza} /> : null;
        })}

        {/* rota inteira, tracejada, e a parte já percorrida, sólida e brilhante */}
        <path d={linha(inteira)} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" />
        {f >= inicio ? (
          <>
            <path d={linha(feita)} fill="none" stroke={COR.rota} strokeWidth={14} opacity={0.5} filter="url(#brilho)" />
            <path d={linha(feita)} fill="none" stroke={COR.rota} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : null}

        {/* pinos */}
        {pontos.map((p, k) => {
          const q = xy(ll(p));
          if (!q || !visivel(ll(p))) return null;
          const s = spring({ frame: f - ag.chegada[k] + (k === 0 ? inicio : 0), fps, config: { damping: 12 } });
          const r = p.passagem ? 9 : 15;
          return (
            <g key={k} transform={`translate(${q[0]},${q[1]}) scale(${s})`}>
              <circle r={r + 10} fill={COR.rota} opacity={0.25} />
              <circle r={r} fill="#fff" stroke={COR.rota} strokeWidth={p.passagem ? 4 : 6} />
            </g>
          );
        })}

        {andando && pa && visivel(cabeca) ? <Selo modo={modo} x={pa[0]} y={pa[1]} giro={giro} /> : null}
      </svg>

      {/* rótulos e polaroids em HTML (texto mais bonito) */}
      {contexto.map((p, i) => {
        const q = xy(ll(p));
        return q && visivel(ll(p)) ? <Rotulo key={`c${i}`} x={q[0]} y={q[1]} p={p} aparece={0.9} cinza /> : null;
      })}
      {pontos.map((p, k) => {
        const q = xy(ll(p));
        if (!q || !visivel(ll(p))) return null;
        if (p.passagem && pontos.some((o) => !o.passagem && perto(xy(ll(o)), q, 150))) return null;
        const chegou = k === 0 ? 0 : ag.chegada[k];
        return <Rotulo key={`r${k}`} x={q[0]} y={q[1]} p={p} aparece={aparece(chegou)} />;
      })}
      {pontos.map((p, k) => {
        if (!p.foto) return null;
        const q = xy(ll(p));
        if (!q || !visivel(ll(p))) return null;
        return <Polaroid key={`f${k}`} x={q[0]} y={q[1]} foto={p.foto} legenda={p.nome} f={f - (k === 0 ? Math.round(inicio * 0.3) : ag.chegada[k])} fps={fps} lado={q[0] > W / 2 ? -1 : 1} />;
      })}

      {children?.({ kmAteAgora: km, kmTotal: ag.kmTotal })}
    </AbsoluteFill>
  );
};

// ─── o segmento de mapa com título e legenda ─────────────────────────────

// sem toLocaleString: o Chrome do render nem sempre traz os dados de locale
const fmtKm = (km: number) => (km >= 100 ? String(Math.round(km)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : km.toFixed(1).replace('.', ','));

export const Cabecalho: React.FC<{ quando?: string; titulo?: string }> = ({ quando, titulo }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [2, 16], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', top: SEGURO.topo, left: SEGURO.esquerda, right: SEGURO.esquerda, opacity: a, transform: `translateY(${(1 - a) * -20}px)` }}>
      {quando ? (
        <div
          style={{
            display: 'inline-block',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 3,
            color: COR.texto,
            border: '2px solid rgba(245,241,234,0.35)',
            borderRadius: 999,
            padding: '8px 22px',
            marginBottom: 18,
          }}
        >
          {quando}
        </div>
      ) : null}
      {titulo ? <div style={{ fontSize: 66, fontWeight: 900, color: COR.texto, lineHeight: 1.08, textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>{titulo}</div> : null}
    </div>
  );
};

export const Legenda: React.FC<{ modos: Modo[]; texto?: string; km?: number }> = ({ modos, texto, km }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [10, 24], [0, 1], clamp);
  const unicos = modos.filter((m, i) => modos.indexOf(m) === i);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: SEGURO.base + 20,
        left: SEGURO.esquerda,
        right: SEGURO.esquerda,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        opacity: a,
        transform: `translateY(${(1 - a) * 20}px)`,
      }}
    >
      <div style={{ display: 'flex', gap: 10 }}>
        {unicos.map((m) => (
          <div key={m} style={{ width: 60, height: 60, borderRadius: 30, background: COR.rota, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconeHtml modo={m} tam={34} />
          </div>
        ))}
      </div>
      <div style={{ flex: 1, fontSize: 32, fontWeight: 700, color: COR.texto, lineHeight: 1.2 }}>{texto}</div>
      {km !== undefined ? (
        <div style={{ fontSize: 44, fontWeight: 900, color: COR.texto, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {fmtKm(km)}
          <span style={{ fontSize: 26, fontWeight: 700, color: COR.textoSuave, marginLeft: 6 }}>km</span>
        </div>
      ) : null}
    </div>
  );
};

/**
 * Estilo "mapa ao vivo": a tela se divide. Em cima, o vídeo; embaixo, um mapa
 * só, contínuo do começo ao fim do Reel, que nunca corta: abre na rua, sobe até
 * o globo para os voos, desce até a cidade, e vai acumulando a rota inteira da
 * viagem. Nos trechos de deslocamento o mapa toma a tela toda. Um painel mostra
 * onde vocês estão, o dia e os km rodados até ali.
 */
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/900.css';
import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { geoCentroid, geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from 'd3-geo';
import { divisasGlobo, provincias, terraGlobo, visiveis, vizinhos } from '../geo.ts';
import { IconeHtml } from '../icones.tsx';
import { Midia } from '../Midia.tsx';
import { fmtKm } from '../Mapa.tsx';
import { inicios, quadrosDe, type Modo, type Plano, type Ponto, type SegClipe, type Segmento } from '../plano.ts';
import { clamp, ll, montarAgenda, naPerna, rotaAte, suave, type Agenda, type Escala, type LngLat } from '../rota.ts';
import { FONTE, H, SEGURO, W } from '../tema.ts';
import { ReelPadrao, type SegProps } from './base.tsx';

const C = {
  mar: '#cfe2ee',
  terra: '#f6f4ef',
  costa: '#b9c7cf',
  divisa: '#e2ddd2',
  rota: '#ff4f3a',
  gps: '#2f7cf6',
  tinta: '#14181f',
  suave: '#6b7480',
};
const SANS = '"Inter", "Zen Kaku Gothic New", sans-serif';
/** onde a tela se divide nos trechos de vídeo */
const DIVISAO = 1060;
/**
 * zooms: durante os vídeos, a região em volta (≈ 150 km: a baía, as ilhas);
 * no máximo, a rua (≈ 11 km), para os trajetos dentro da cidade; e o globo
 */
const K_REGIAO = 45_000;
const K_MAX = 600_000;
const K_GLOBO = 430;
const ANIMA = 14;

// ─── o modelo da viagem inteira, em quadros absolutos ────────────────────

interface Trecho {
  i: number;
  ini: number;
  dur: number;
  escala: Escala;
  pontos: Ponto[];
  modos: Modo[];
  ag: Agenda;
  /** km já rodados antes deste trecho */
  kmAntes: number;
}

interface Modelo {
  ini: number[];
  trechos: Trecho[];
  /** pontos de todo o Japão visitados, para o fecho */
  japao: Ponto[];
}

function montarModelo(plano: Plano, fps: number): Modelo {
  const ini = inicios(plano);
  const trechos: Trecho[] = [];
  let km = 0;
  plano.segmentos.forEach((s, i) => {
    if (s.tipo !== 'mapa') return;
    const dur = quadrosDe(s);
    const ag = montarAgenda(s.pontos, s.escala, ini[i] + Math.round(dur * 0.16), ini[i] + Math.round(dur * 0.8), fps);
    trechos.push({ i, ini: ini[i], dur, escala: s.escala, pontos: s.pontos, modos: s.modos, ag, kmAntes: km });
    km += ag.kmTotal;
  });
  const japao = trechos.flatMap((t) => t.pontos).filter((p) => !p.passagem && p.lng > 120 && p.lng < 150);
  return { ini, trechos, japao };
}

/** segmento em curso no quadro f (na sobreposição da transição, já conta o seguinte) */
const segAtual = (ini: number[], f: number) => {
  let j = 0;
  ini.forEach((q, i) => {
    if (f >= q) j = i;
  });
  return j;
};

interface Camera {
  c: LngLat;
  k: number;
}
const misturarCam = (a: Camera, b: Camera, t: number): Camera => ({
  c: geoInterpolate(a.c, b.c)(t) as LngLat,
  k: Math.exp(Math.log(a.k) + (Math.log(b.k) - Math.log(a.k)) * t),
});

/** enquadra um conjunto de pontos: centro esférico e zoom para caber na tela */
function enquadrar(pts: LngLat[], meiaLargura: number, minK = 3000, maxK = K_MAX): Camera {
  const c = (pts.length === 1 ? pts[0] : geoCentroid({ type: 'MultiPoint', coordinates: pts })) as LngLat;
  const ang = Math.max(...pts.map((p) => geoDistance(c, p)), 1e-6);
  return { c, k: Math.max(minK, Math.min(maxK, meiaLargura / ang)) };
}

const rua = (p: LngLat): Camera => ({ c: p, k: K_REGIAO });

/** onde se está durante o segmento i: o lugar do vídeo, ou o fim do último deslocamento */
function posicao(m: Modelo, plano: Plano, i: number): LngLat {
  const s = plano.segmentos[i];
  if (s?.tipo === 'clipe' && s.lugar?.lat !== undefined && s.lugar.lng !== undefined) return [s.lugar.lng, s.lugar.lat];
  const ultimo = m.trechos.filter((t) => t.i < i).pop();
  return ultimo ? ll(ultimo.pontos[ultimo.pontos.length - 1]) : ll(m.trechos[0].pontos[0]);
}

function estado(m: Modelo, plano: Plano, f: number, fps: number) {
  const j = segAtual(m.ini, f);
  const s = plano.segmentos[j];
  const anteriores = m.trechos.filter((t) => t.i < j);
  const atual = m.trechos.find((t) => t.i === j);
  const ultimo = anteriores[anteriores.length - 1];
  const aqui = posicao(m, plano, j);

  let cam: Camera = rua(aqui);
  let gps: LngLat = aqui;
  let km = ultimo ? ultimo.kmAntes + ultimo.ag.kmTotal : 0;
  let tela = 0; // 0 = dividida, 1 = mapa em tela cheia

  if (atual) {
    const { perna, u, km: kmAqui } = atual.ag.ponta(f);
    gps = naPerna(atual.ag.pernas[perna], u, atual.escala);
    km = atual.kmAntes + kmAqui;
    // começa onde o segmento anterior deixou a câmera e termina onde o próximo vai estar
    const origem = rua(j > 0 ? posicao(m, plano, j - 1) : ll(atual.pontos[0]));
    const destino = rua(plano.segmentos[j + 1]?.tipo === 'clipe' ? posicao(m, plano, j + 1) : ll(atual.pontos[atual.pontos.length - 1]));
    let geral: Camera;
    if (atual.escala === 'globo') {
      // segue o avião um pouco atrás
      const atras = atual.ag.ponta(Math.max(atual.ini, f - fps * 0.5));
      const alvo = naPerna(atual.ag.pernas[atras.perna], atras.u, 'globo');
      geral = { c: [alvo[0], Math.max(-20, Math.min(32, alvo[1] * 0.55))], k: K_GLOBO };
    } else {
      geral = enquadrar(atual.pontos.map(ll), 380, atual.escala === 'regiao' ? 2500 : 40_000);
    }
    const t0 = atual.ini + atual.dur * 0.16;
    const t1 = atual.ini + atual.dur * 0.8;
    if (f < t0) cam = misturarCam(origem, geral, suave((f - atual.ini) / (t0 - atual.ini)));
    else if (f > t1) cam = misturarCam(geral, destino, suave((f - t1) / (atual.ini + atual.dur - t1)));
    else cam = geral;
    tela = interpolate(f, [atual.ini, atual.ini + ANIMA], [j > 0 && plano.segmentos[j - 1].tipo === 'clipe' ? 0 : 1, 1], clamp);
  } else if (s.tipo === 'fim') {
    const todos = m.japao.map(ll);
    cam = misturarCam(rua(posicao(m, plano, j - 1)), enquadrar(todos, 400, 1500), suave(interpolate(f, [m.ini[j], m.ini[j] + quadrosDe(s) * 0.5], [0, 1], clamp)));
    tela = interpolate(f, [m.ini[j], m.ini[j] + ANIMA], [0, 1], clamp);
  } else {
    // vídeo: câmera parada na região de onde vocês estão
    cam = rua(aqui);
    tela = interpolate(f, [m.ini[j], m.ini[j] + ANIMA], [j > 0 && plano.segmentos[j - 1].tipo !== 'clipe' ? 1 : 0, 0], clamp);
  }
  return { j, s, atual, cam, gps, km, tela: suave(tela), anteriores };
}

// ─── o mapa ──────────────────────────────────────────────────────────────

const PainelMapa: React.FC<{ plano: Plano; m: Modelo }> = ({ plano, m }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = estado(m, plano, f, fps);
  const topo = DIVISAO * (1 - e.tela);
  // centro do mapa: meio da tela inteira, ou meio da faixa visível embaixo do vídeo
  const cy = interpolate(e.tela, [0, 1], [(DIVISAO + (H - SEGURO.base)) / 2, H / 2]);
  const proj = geoOrthographic()
    .rotate([-e.cam.c[0], -e.cam.c[1]])
    .scale(e.cam.k)
    .translate([W / 2, cy])
    .clipAngle(90)
    .precision(e.cam.k > 5000 ? 0.15 : 0.5);
  const caminho = geoPath(proj);

  let terra: React.ReactNode;
  if (e.cam.k < 1500) {
    terra = (
      <>
        <path d={caminho({ type: 'Sphere' }) ?? ''} fill={C.mar} stroke="#a9bfcc" strokeWidth={2} />
        <path d={caminho(geoGraticule10()) ?? ''} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
        <path d={caminho(terraGlobo as any) ?? ''} fill={C.terra} stroke={C.costa} strokeWidth={1.4} />
        <path d={caminho(divisasGlobo) ?? ''} fill="none" stroke={C.divisa} strokeWidth={1} />
      </>
    );
  } else {
    const cantos = [[0, topo], [W, topo], [0, H], [W, H], [W / 2, cy]].map((p) => proj.invert!(p as [number, number])).filter(Boolean) as LngLat[];
    const xs = cantos.map((p) => p[0]);
    const ys = cantos.map((p) => p[1]);
    const caixa: [[number, number], [number, number]] = [[Math.min(...xs), Math.min(...ys)], [Math.max(...xs), Math.max(...ys)]];
    const provs = visiveis(provincias, caixa);
    terra = (
      <>
        <rect width={W} height={H} fill={C.mar} />
        {visiveis(vizinhos, caixa).map((ft, i) => (
          <path key={`v${i}`} d={caminho(ft as any) ?? ''} fill={C.terra} stroke={C.costa} strokeWidth={1.2} />
        ))}
        {provs.map((ft, i) => (
          <path key={`c${i}`} d={caminho(ft as any) ?? ''} fill="none" stroke={C.costa} strokeWidth={3} />
        ))}
        {provs.map((ft, i) => (
          <path key={`p${i}`} d={caminho(ft as any) ?? ''} fill={C.terra} stroke={C.divisa} strokeWidth={1.2} />
        ))}
      </>
    );
  }

  // a rota de toda a viagem até agora: trechos completos + o atual até a ponta
  const linhas: LngLat[][] = e.anteriores.map((t) => rotaAte(t.ag, t.ag.pernas.length - 1, 1, t.escala));
  if (e.atual) {
    const { perna, u } = e.atual.ag.ponta(f);
    if (f >= e.atual.ag.chegada[0]) linhas.push(rotaAte(e.atual.ag, perna, u, e.atual.escala));
  }
  const d = linhas.map((pts) => caminho({ type: 'LineString', coordinates: pts }) ?? '').join(' ');
  const visitados = [...e.anteriores.flatMap((t) => t.pontos), ...(e.atual ? e.atual.pontos.filter((_, k) => f >= e.atual!.ag.chegada[k]) : [])].filter((p) => !p.passagem);
  const g = proj(e.gps);
  const pulso = (f % 36) / 36;

  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: topo, bottom: 0, overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 50%, #f3f7fa 0%, #dfe8ef 100%)', boxShadow: '0 -10px 30px rgba(0,0,0,0.35)', borderTop: e.tela < 0.99 ? '4px solid #fff' : undefined }}>
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: -topo }}>
        {terra}
        <path d={d} fill="none" stroke="#fff" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke={C.rota} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        {visitados.map((p, k) => {
          const q = proj(ll(p));
          return q && geoDistance(ll(p), e.cam.c) < Math.PI / 2 - 0.05 ? <circle key={k} cx={q[0]} cy={q[1]} r={9} fill="#fff" stroke={C.rota} strokeWidth={5} /> : null;
        })}
        {g && geoDistance(e.gps, e.cam.c) < Math.PI / 2 - 0.05 ? (
          <g transform={`translate(${g[0]},${g[1]})`}>
            <circle r={18 + pulso * 46} fill={C.gps} opacity={0.35 * (1 - pulso)} />
            <circle r={24} fill={C.gps} opacity={0.18} />
            <circle r={14} fill={C.gps} stroke="#fff" strokeWidth={5} />
          </g>
        ) : null}
      </svg>
      {/* rótulos dos pontos do trecho em curso */}
      {e.atual
        ? e.atual.pontos.map((p, k) => {
            const q = proj(ll(p));
            if (!q || p.passagem || geoDistance(ll(p), e.cam.c) > Math.PI / 2 - 0.08) return null;
            const a = interpolate(f, [e.atual!.ag.chegada[k] - 4, e.atual!.ag.chegada[k] + 8], [0, 1], clamp);
            const esq = q[0] > W * 0.62;
            return (
              <div key={k} style={{ position: 'absolute', top: q[1] - topo - 26, left: esq ? undefined : q[0] + 24, right: esq ? W - q[0] + 24 : undefined, opacity: k === 0 ? 1 : a, background: '#fff', borderRadius: 12, padding: '6px 14px', boxShadow: '0 6px 16px rgba(0,0,0,0.15)', fontFamily: SANS, fontSize: 28, fontWeight: 700, color: C.tinta, whiteSpace: 'nowrap' }}>
                {p.nome}
                {p.jp ? <span style={{ color: C.rota, marginLeft: 8, fontFamily: FONTE }}>{p.jp}</span> : null}
              </div>
            );
          })
        : null}
    </div>
  );
};

// ─── os painéis de informação ────────────────────────────────────────────

const Cartao: React.FC<{ style: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: 'absolute', background: 'rgba(255,255,255,0.94)', borderRadius: 26, boxShadow: '0 12px 30px rgba(20,30,50,0.18)', fontFamily: SANS, color: C.tinta, ...style }}>{children}</div>
);

const diaDe = (linha?: string) => {
  const d = Number(linha?.match(/(\d+) nov/)?.[1]);
  return d ? (d >= 18 ? `DIA ${d - 17}` : 'A CAMINHO') : '';
};

const Painel: React.FC<{ plano: Plano; m: Modelo }> = ({ plano, m }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = estado(m, plano, f, fps);
  const s: Segmento = e.s;
  const kmBox = (
    <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.suave, letterSpacing: 2 }}>KM RODADOS</div>
      <div style={{ fontSize: 48, fontWeight: 900, fontVariantNumeric: 'tabular-nums', lineHeight: 1.05 }}>{fmtKm(e.km)}</div>
    </div>
  );

  if (s.tipo === 'clipe') {
    const a = interpolate(f, [m.ini[e.j] + 6, m.ini[e.j] + 18], [0, 1], clamp);
    return (
      <Cartao style={{ left: 40, right: 40, top: DIVISAO + 30, padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 20, opacity: a }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.gps, letterSpacing: 2 }}>● AO VIVO · {diaDe(s.lugar?.linha)}</div>
          <div style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {s.lugar?.nome}
            {s.lugar?.jp ? <span style={{ fontFamily: FONTE, fontSize: 32, color: C.rota, marginLeft: 12 }}>{s.lugar.jp}</span> : null}
          </div>
          <div style={{ fontSize: 24, fontWeight: 500, color: C.suave }}>{s.lugar?.linha}</div>
        </div>
        {kmBox}
      </Cartao>
    );
  }

  const titulo = s.tipo === 'mapa' ? s.titulo : s.titulo;
  const quando = s.tipo === 'mapa' ? s.quando : s.sub;
  const legenda = s.tipo === 'mapa' ? s.legenda : undefined;
  const modos = s.tipo === 'mapa' ? s.modos.filter((x, i, arr) => arr.indexOf(x) === i) : [];
  const a = interpolate(f, [m.ini[e.j] + 4, m.ini[e.j] + 16], [0, 1], clamp);
  return (
    <>
      <Cartao style={{ left: 40, right: 40, top: SEGURO.topo - 20, padding: '20px 26px', opacity: a }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.rota, letterSpacing: 2 }}>{quando?.toUpperCase()}</div>
        <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.08 }}>{titulo}</div>
      </Cartao>
      <Cartao style={{ left: 40, right: 40, bottom: SEGURO.base + 10, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16, opacity: a }}>
        {modos.map((x) => (
          <div key={x} style={{ width: 56, height: 56, borderRadius: 28, background: C.rota, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconeHtml modo={x} tam={32} />
          </div>
        ))}
        <div style={{ flex: 1, fontSize: 28, fontWeight: 700 }}>{legenda ?? (s.tipo === 'fim' ? s.numeros?.join(' · ') : '')}</div>
        {kmBox}
      </Cartao>
    </>
  );
};

// ─── vídeo na metade de cima ─────────────────────────────────────────────

const Nota: React.FC<{ titulo?: string; texto: string }> = ({ titulo, texto }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: n } = useVideoConfig();
  const a = interpolate(f, [fps * 0.7, fps * 1.05], [0, 1], clamp) * interpolate(f, [n - fps * 0.4, n - fps * 0.1], [1, 0], clamp);
  return (
    <div style={{ position: 'absolute', left: 40, right: SEGURO.direita - 40, bottom: H - DIVISAO + 30, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderRadius: 22, padding: '16px 22px 18px', opacity: a, transform: `translateY(${(1 - a) * 16}px)`, fontFamily: SANS, boxShadow: '0 10px 24px rgba(0,0,0,0.25)' }}>
      <div style={{ fontSize: 19, fontWeight: 900, color: C.rota, letterSpacing: 2, marginBottom: 4 }}>HISTÓRIA{titulo ? ` · ${titulo.toUpperCase()}` : ''}</div>
      <div style={{ fontSize: 29, fontWeight: 500, color: C.tinta, lineHeight: 1.35 }}>{texto}</div>
    </div>
  );
};

const VideoCima: React.FC<{ seg: SegClipe }> = ({ seg }) => (
  <AbsoluteFill>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: DIVISAO, overflow: 'hidden' }}>
      <Midia seg={seg} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 25%)' }} />
    </div>
    {seg.nota ? <Nota {...seg.nota} /> : null}
  </AbsoluteFill>
);

const Segm: React.FC<SegProps> = ({ s }) => (s.tipo === 'clipe' ? <VideoCima seg={s} /> : <AbsoluteFill />);

const FONTES = ['500 40px "Inter"', '700 40px "Inter"', '900 40px "Inter"', '700 40px "Zen Kaku Gothic New"'];

export const ReelAoVivo: React.FC<Plano> = (plano) => {
  const { fps } = useVideoConfig();
  const m = useMemo(() => montarModelo(plano, fps), [plano, fps]);
  return (
    <ReelPadrao
      plano={plano}
      fontes={FONTES}
      Segmento={Segm}
      fundo="#0d1117"
      sobre={
        <>
          <PainelMapa plano={plano} m={m} />
          <Painel plano={plano} m={m} />
        </>
      }
    />
  );
};

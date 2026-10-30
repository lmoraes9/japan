/**
 * Estilo "globinho": as fotos e vídeos ocupam a tela inteira o tempo todo, e
 * no canto de baixo à direita um globo 3D flutua por cima da imagem, sem caixa
 * nem fundo. O avião e o trem andam pelo globo enquanto as fotos trocam atrás;
 * quando a viagem chega perto do chão, o globo vira uma lente redonda com o
 * mapa da região. Ao lado, as informações do lugar ou do trajeto.
 *
 * Com o tempero do estilo outono: tom quente nas imagens, mincho, rota carmim
 * e umas poucas folhas de bordo caindo.
 */
import '@fontsource/shippori-mincho/500.css';
import '@fontsource/shippori-mincho/700.css';
import '@fontsource/shippori-mincho/800.css';
import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming, type TransitionPresentation } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { geoCentroid, geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from 'd3-geo';
import { divisasGlobo, provincias, terraGlobo, visiveis, vizinhos } from '../geo.ts';
import { Icone } from '../icones.tsx';
import { Midia } from '../Midia.tsx';
import { fmtKm } from '../Mapa.tsx';
import { TRANSICAO, type Modo, type Plano, type SegClipe, type SegFim } from '../plano.ts';
import { clamp, ll, montarAgenda, naPerna, rotaAte, suave, type Agenda, type LngLat } from '../rota.ts';
import { SEGURO, W } from '../tema.ts';
import { useFontes } from './base.tsx';
import { Folhas } from './folhas.tsx';
import { linhaGlobinho, type LinhaGlobinho, type Viagem } from './globinhoTempo.ts';
import { MidiaCheia } from './noite.tsx';

const SERIFA = '"Shippori Mincho", "Hiragino Mincho ProN", serif';
const C = {
  carmim: '#c8321f',
  creme: '#fff6e6',
  cremeSuave: 'rgba(255,246,230,0.82)',
  ambar: '#ffc98a',
  terra: '#f4ead6',
  costa: '#a9876a',
  marCentro: '#2f6f8f',
  marBorda: '#0d2b40',
};
const GRADE_QUENTE = 'sepia(0.18) saturate(1.22) contrast(1.04) brightness(1.02)';

/** onde o globo fica: no canto, e no fecho, grande no meio */
const CANTO = { cx: 792, cy: 1288, r: 172 };
const CENTRO = { cx: 540, cy: 1060, r: 330 };

/**
 * zoom relativo ao raio do globo: 1 = o globo inteiro cabe no círculo;
 * LUGAR ≈ a região em volta (uns 35 km de largura)
 */
const Z_GLOBO = 1;
const Z_LUGAR = 350;
const Z_MAX = 3000;

const MODO_JP: Record<Modo, string> = {
  aviao: '飛行機',
  shinkansen: '新幹線',
  trem: '電車',
  metro: '地下鉄',
  bonde: '路面電車',
  onibus: 'バス',
  balsa: 'フェリー',
  teleferico: 'ロープウェイ',
  taxi: 'タクシー',
  ape: '徒歩',
};

interface Camera {
  c: LngLat;
  z: number;
}
const misturar = (a: Camera, b: Camera, t: number): Camera => ({
  c: geoInterpolate(a.c, b.c)(t) as LngLat,
  z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t),
});
function enquadrar(pts: LngLat[], folga = 0.72): Camera {
  const c = (pts.length === 1 ? pts[0] : geoCentroid({ type: 'MultiPoint', coordinates: pts })) as LngLat;
  const ang = Math.max(...pts.map((p) => geoDistance(c, p)), 1e-6);
  return { c, z: Math.max(Z_GLOBO, Math.min(Z_MAX, folga / ang)) };
}

// ─── o modelo: viagens com agenda, km acumulado, onde se está ────────────

interface ViagemComAgenda extends Viagem {
  ag: Agenda;
  /** desenho da rota: começa a andar em a, chega em b */
  a: number;
  b: number;
  kmAntes: number;
}

function montar(l: LinhaGlobinho, fps: number) {
  let km = 0;
  const viagens: ViagemComAgenda[] = l.viagens.map((v) => {
    const len = v.fim - v.ini;
    const a = v.ini + Math.round(len * 0.2);
    const b = v.ini + Math.round(len * 0.8);
    const ag = montarAgenda(v.seg.pontos, v.seg.escala, a, b, fps);
    const out = { ...v, ag, a, b, kmAntes: km };
    km += ag.kmTotal;
    return out;
  });
  return { ...l, viagens };
}
type Modelo = ReturnType<typeof montar>;

const itemEm = (m: Modelo, f: number) => {
  let k = 0;
  m.itens.forEach((it, i) => {
    if (f >= it.ini) k = i;
  });
  return k;
};

/** onde se está no quadro f (fora de viagem): o lugar do item de fundo, ou o fim da última viagem */
function posicaoEm(m: Modelo, f: number): LngLat {
  const it = m.itens[itemEm(m, f)];
  if (it?.pos) return it.pos;
  const ultima = m.viagens.filter((v) => v.ini <= f).pop() ?? m.viagens[0];
  return ll(ultima.seg.pontos[ultima.seg.pontos.length - 1]);
}

function estado(m: Modelo, f: number, fps: number) {
  const ativa = m.viagens.find((v) => f >= v.ini && f <= v.fim);
  const feitas = m.viagens.filter((v) => v.fim < f);
  let cam: Camera = { c: posicaoEm(m, f), z: Z_LUGAR };
  let ponta: { pos: LngLat; modo: Modo; giro: LngLat } | undefined;
  let km = feitas.length ? feitas[feitas.length - 1].kmAntes + feitas[feitas.length - 1].ag.kmTotal : 0;

  if (ativa) {
    const { perna, u, km: kmAqui } = ativa.ag.ponta(f);
    km = ativa.kmAntes + kmAqui;
    const pos = naPerna(ativa.ag.pernas[perna], u, ativa.seg.escala);
    const frente = naPerna(ativa.ag.pernas[perna], Math.min(1, u + 0.03), ativa.seg.escala);
    const modo = ativa.seg.modos[Math.min(perna, ativa.seg.modos.length - 1)] ?? 'trem';
    if (f >= ativa.a - 2 && f <= ativa.b + 4) ponta = { pos, modo, giro: frente };

    const primeira = ativa.ini === 0;
    const antes: Camera = primeira ? { c: ll(ativa.seg.pontos[0]), z: ativa.seg.escala === 'globo' ? Z_GLOBO : Z_LUGAR } : { c: posicaoEm(m, ativa.ini - TRANSICAO - 1), z: Z_LUGAR };
    const depois: Camera = { c: posicaoEm(m, ativa.fim + 1), z: Z_LUGAR };
    let geral: Camera;
    if (ativa.seg.escala === 'globo') {
      const atras = ativa.ag.ponta(Math.max(ativa.ini, f - fps * 0.6));
      const alvo = naPerna(ativa.ag.pernas[atras.perna], atras.u, 'globo');
      geral = { c: [alvo[0], Math.max(-25, Math.min(40, alvo[1] * 0.7))], z: Z_GLOBO };
    } else {
      geral = enquadrar(ativa.seg.pontos.map(ll));
    }
    if (f < ativa.a) cam = misturar(antes, geral, suave((f - ativa.ini) / (ativa.a - ativa.ini)));
    else if (f > ativa.b) cam = misturar(geral, depois, suave((f - ativa.b) / (ativa.fim - ativa.b)));
    else cam = geral;
  } else if (m.fecho && f >= m.fecho.ini) {
    const japao = m.viagens.flatMap((v) => v.seg.pontos).filter((p) => !p.passagem && p.lng > 120 && p.lng < 150).map(ll);
    const t = suave(interpolate(f, [m.fecho.ini, m.fecho.ini + m.fecho.dur * 0.45], [0, 1], clamp));
    cam = misturar({ c: posicaoEm(m, m.fecho.ini - 1), z: Z_LUGAR }, enquadrar(japao, 0.8), t);
  }
  return { ativa, feitas, cam, ponta, km };
}

// ─── o globo ─────────────────────────────────────────────────────────────

const Globo: React.FC<{ m: Modelo }> = ({ m }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = estado(m, f, fps);
  const tf = m.fecho ? suave(interpolate(f, [m.fecho.ini, m.fecho.ini + 24], [0, 1], clamp)) : 0;
  const cx = CANTO.cx + (CENTRO.cx - CANTO.cx) * tf;
  const cy = CANTO.cy + (CENTRO.cy - CANTO.cy) * tf;
  const r = CANTO.r + (CENTRO.r - CANTO.r) * tf;
  const k = e.cam.z * r;
  const proj = geoOrthographic()
    .rotate([-e.cam.c[0], -e.cam.c[1]])
    .scale(k)
    .translate([cx, cy])
    .clipAngle(90)
    .precision(e.cam.z > 20 ? 0.15 : 0.5);
  const caminho = geoPath(proj);
  const naFrente = (p: LngLat) => geoDistance(p, e.cam.c) < Math.PI / 2 - 0.02;

  // terra: mundo simplificado de longe, províncias do Japão de perto
  let terra: React.ReactNode;
  if (e.cam.z < 8) {
    terra = (
      <>
        {e.cam.z < 4 ? <path d={caminho(geoGraticule10()) ?? ''} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1} /> : null}
        <path d={caminho(terraGlobo as any) ?? ''} fill={C.terra} stroke={C.costa} strokeWidth={1} />
        <path d={caminho(divisasGlobo) ?? ''} fill="none" stroke="rgba(169,135,106,0.45)" strokeWidth={0.8} />
      </>
    );
  } else {
    const cantos = [[cx - r, cy - r], [cx + r, cy - r], [cx - r, cy + r], [cx + r, cy + r], [cx, cy]].map((p) => proj.invert!(p as [number, number])).filter(Boolean) as LngLat[];
    const xs = cantos.map((p) => p[0]);
    const ys = cantos.map((p) => p[1]);
    const caixa: [[number, number], [number, number]] = [[Math.min(...xs), Math.min(...ys)], [Math.max(...xs), Math.max(...ys)]];
    const provs = visiveis(provincias, caixa);
    terra = (
      <>
        {visiveis(vizinhos, caixa).map((ft, i) => (
          <path key={`v${i}`} d={caminho(ft as any) ?? ''} fill={C.terra} stroke={C.costa} strokeWidth={1} />
        ))}
        {provs.map((ft, i) => (
          <path key={`c${i}`} d={caminho(ft as any) ?? ''} fill="none" stroke={C.costa} strokeWidth={2.4} />
        ))}
        {provs.map((ft, i) => (
          <path key={`p${i}`} d={caminho(ft as any) ?? ''} fill={C.terra} stroke="rgba(169,135,106,0.35)" strokeWidth={0.8} />
        ))}
      </>
    );
  }

  // a rota da viagem inteira até aqui
  const linhas: LngLat[][] = e.feitas.map((v) => rotaAte(v.ag, v.ag.pernas.length - 1, 1, v.seg.escala));
  if (e.ativa && f >= e.ativa.a) {
    const { perna, u } = e.ativa.ag.ponta(f);
    linhas.push(rotaAte(e.ativa.ag, perna, u, e.ativa.seg.escala));
  }
  const d = linhas.map((pts) => caminho({ type: 'LineString', coordinates: pts }) ?? '').join(' ');
  const visitados = [...e.feitas.flatMap((v) => v.seg.pontos), ...(e.ativa ? e.ativa.seg.pontos.filter((_, i) => f >= e.ativa!.ag.chegada[i]) : [])].filter((p) => !p.passagem);
  const esc = r / CANTO.r;

  const pa = e.ponta ? proj(e.ponta.pos) : null;
  const pb = e.ponta ? proj(e.ponta.giro) : null;
  const giro = pa && pb ? (Math.atan2(pb[1] - pa[1], pb[0] - pa[0]) * 180) / Math.PI + 90 : 0;

  return (
    <svg width={W} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <defs>
        <clipPath id="lente">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <radialGradient id="oceano" cx="42%" cy="38%" r="70%">
          <stop offset="0" stopColor={C.marCentro} stopOpacity={0.86} />
          <stop offset="1" stopColor={C.marBorda} stopOpacity={0.9} />
        </radialGradient>
        <radialGradient id="brilho" cx="34%" cy="28%" r="45%">
          <stop offset="0" stopColor="#fff" stopOpacity={0.42} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="borda" cx="50%" cy="50%" r="50%">
          <stop offset="0.62" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.45} />
        </radialGradient>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0.86" stopColor="#ffe3b8" stopOpacity={0} />
          <stop offset="0.92" stopColor="#ffe3b8" stopOpacity={0.35} />
          <stop offset="1" stopColor="#ffe3b8" stopOpacity={0} />
        </radialGradient>
        <filter id="sombraGlobo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={14 * esc} />
        </filter>
      </defs>

      {/* sombra e brilho da atmosfera, fora do círculo */}
      <ellipse cx={cx + 10 * esc} cy={cy + r * 0.92} rx={r * 0.8} ry={r * 0.14} fill="#000" opacity={0.35} filter="url(#sombraGlobo)" />
      <circle cx={cx} cy={cy} r={r * 1.1} fill="url(#halo)" />

      <g clipPath="url(#lente)">
        {e.cam.z <= 1.02 ? <path d={caminho({ type: 'Sphere' }) ?? ''} fill="url(#oceano)" /> : <circle cx={cx} cy={cy} r={r} fill="url(#oceano)" />}
        {terra}
        <path d={d} fill="none" stroke={C.creme} strokeWidth={7 * Math.max(0.8, esc)} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
        <path d={d} fill="none" stroke={C.carmim} strokeWidth={4 * Math.max(0.8, esc)} strokeLinecap="round" strokeLinejoin="round" />
        {visitados.map((p, i) => {
          const q = proj(ll(p));
          return q && naFrente(ll(p)) ? <circle key={i} cx={q[0]} cy={q[1]} r={5.5 * esc} fill={C.creme} stroke={C.carmim} strokeWidth={3 * esc} /> : null;
        })}
        {/* sombreado de esfera: borda escura e reflexo de luz */}
        <circle cx={cx} cy={cy} r={r} fill="url(#borda)" />
        <circle cx={cx} cy={cy} r={r} fill="url(#brilho)" />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,240,215,0.55)" strokeWidth={2} />

      {/* parado num lugar: pontinho pulsando onde vocês estão */}
      {!e.ponta && !(m.fecho && f >= m.fecho.ini)
        ? (() => {
            const aqui = posicaoEm(m, f);
            const q = proj(aqui);
            const pulso = (f % 40) / 40;
            return q && naFrente(aqui) ? (
              <g transform={`translate(${q[0]},${q[1]}) scale(${esc})`}>
                <circle r={8 + pulso * 22} fill="none" stroke={C.carmim} strokeWidth={3} opacity={1 - pulso} />
                <circle r={8} fill={C.carmim} stroke={C.creme} strokeWidth={3} />
              </g>
            ) : null;
          })()
        : null}

      {pa && e.ponta && naFrente(e.ponta.pos) ? (
        <g transform={`translate(${pa[0]},${pa[1]}) scale(${esc})`}>
          <circle r={19} fill={C.carmim} stroke={C.creme} strokeWidth={3} />
          <Icone modo={e.ponta.modo} tam={22} cor={C.creme} giro={e.ponta.modo === 'aviao' ? giro : 0} />
        </g>
      ) : null}
    </svg>
  );
};

// ─── as informações ao lado do globo ─────────────────────────────────────

const Info: React.FC<{ m: Modelo }> = ({ m }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = estado(m, f, fps);
  if (m.fecho && f >= m.fecho.ini) return null;
  const it = m.itens[itemEm(m, f)];
  // durante a viagem fala do trajeto; depois de chegar, do lugar
  const v = e.ativa && f < e.ativa.fim - 4 ? e.ativa : undefined;
  const desde = v ? v.ini : Math.max(it.ini, ...m.viagens.filter((x) => x.fim <= f && x.fim >= it.ini).map((x) => x.fim - 4));
  const a = interpolate(f - desde, [0, 10], [0, 1], clamp);
  const lugar = it.seg.lugar;
  if (!v && !lugar) return null;
  const modos = v ? v.seg.modos.filter((x, i, arr) => arr.indexOf(x) === i) : [];
  return (
    <div
      style={{
        position: 'absolute',
        right: W - (CANTO.cx + CANTO.r),
        bottom: 1920 - (CANTO.cy - CANTO.r - 22),
        maxWidth: 820,
        textAlign: 'right',
        fontFamily: SERIFA,
        opacity: a,
        transform: `translateY(${(1 - a) * 14}px)`,
        textShadow: '0 2px 12px rgba(30,10,0,0.85), 0 0 3px rgba(30,10,0,0.6)',
      }}
    >
      {v ? (
        <>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.ambar, letterSpacing: 4 }}>
            {modos.map((x) => MODO_JP[x]).join('・')} · {v.seg.quando}
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, color: C.creme, lineHeight: 1.08 }}>{v.seg.titulo}</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: C.cremeSuave, marginTop: 6 }}>
            {v.seg.legenda}
            {v.seg.escala === 'globo' ? <span style={{ color: C.ambar, fontWeight: 700 }}> · {fmtKm(e.km)} km</span> : null}
          </div>
        </>
      ) : (
        <>
          {lugar?.jp ? <div style={{ fontSize: 32, fontWeight: 700, color: C.ambar, letterSpacing: 6 }}>{lugar.jp}</div> : null}
          <div style={{ fontSize: 62, fontWeight: 800, color: C.creme, lineHeight: 1.06 }}>{lugar?.nome}</div>
          {lugar?.linha ? <div style={{ fontSize: 28, fontWeight: 500, color: C.cremeSuave, marginTop: 6, fontStyle: 'italic' }}>{lugar.linha}</div> : null}
        </>
      )}
    </div>
  );
};

// ─── fundo: os vídeos e fotos em sequência ───────────────────────────────

const Nota: React.FC<{ titulo?: string; texto: string }> = ({ titulo, texto }) => {
  const f = useCurrentFrame();
  const { durationInFrames: n, fps } = useVideoConfig();
  const entra = interpolate(f, [fps * 0.7, fps * 1.1], [0, 1], clamp);
  const sai = interpolate(f, [n - fps * 0.45, n - fps * 0.1], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        top: SEGURO.topo,
        left: SEGURO.esquerda,
        right: SEGURO.direita,
        padding: '18px 26px 22px',
        background: 'rgba(250,243,228,0.9)',
        borderRadius: 6,
        boxShadow: '0 12px 30px rgba(40,15,0,0.35)',
        fontFamily: SERIFA,
        opacity: entra * sai,
        transform: `translateY(${(1 - entra) * -16}px)`,
      }}
    >
      <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: 4, color: C.carmim, marginBottom: 6 }}>
        歴史 · HISTÓRIA{titulo ? <span style={{ color: 'rgba(58,36,22,0.62)', letterSpacing: 1, marginLeft: 10, fontStyle: 'italic' }}>{titulo}</span> : null}
      </div>
      <div style={{ fontSize: 30, fontWeight: 500, color: '#3a2416', lineHeight: 1.4 }}>{texto}</div>
    </div>
  );
};

const Fundo: React.FC<{ seg: SegClipe }> = ({ seg }) => (
  <AbsoluteFill style={{ background: '#1a0d06' }}>
    <MidiaCheia seg={seg} filtro={GRADE_QUENTE} />
    {/* escurece só o canto do globo e o topo, para o texto ler sem precisar de caixa */}
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 74% 66%, rgba(25,10,2,0.6) 0%, rgba(25,10,2,0.25) 28%, rgba(0,0,0,0) 48%)' }} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(40,15,2,0.35) 0%, rgba(0,0,0,0) 22%)' }} />
    {seg.nota ? <Nota {...seg.nota} /> : null}
  </AbsoluteFill>
);

/** fecho: mosaico com todos os lugares, o globo grande no meio e o título */
const Mosaico: React.FC<{ seg: SegFim; clipes: SegClipe[] }> = ({ seg, clipes }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [8, 26], [0, 1], clamp);
  const tiles = clipes.slice(0, 6);
  return (
    <AbsoluteFill style={{ background: '#1a0d06' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)' }}>
        {tiles.map((c, i) => (
          <div key={i} style={{ position: 'relative', overflow: 'hidden', filter: GRADE_QUENTE }}>
            <Midia seg={c} />
          </div>
        ))}
      </div>
      <AbsoluteFill style={{ background: 'rgba(25,10,2,0.55)' }} />
      <div style={{ position: 'absolute', top: SEGURO.topo, left: 0, right: 0, textAlign: 'center', fontFamily: SERIFA, opacity: a, textShadow: '0 2px 16px rgba(30,10,0,0.8)' }}>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 12, color: C.ambar }}>日本の秋</div>
        <div style={{ fontSize: 84, fontWeight: 800, color: C.creme, lineHeight: 1.05, marginTop: 6 }}>{seg.titulo}</div>
        {seg.sub ? <div style={{ fontSize: 30, fontWeight: 500, color: C.cremeSuave, marginTop: 8, fontStyle: 'italic' }}>{seg.sub} · outono de 2026</div> : null}
      </div>
      {seg.numeros ? (
        <div style={{ position: 'absolute', bottom: SEGURO.base + 10, left: SEGURO.esquerda, right: SEGURO.esquerda, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', fontFamily: SERIFA }}>
          {seg.numeros.map((n, i) => (
            <div key={i} style={{ fontSize: 28, fontWeight: 700, color: C.creme, border: `2px solid ${C.ambar}`, background: 'rgba(30,10,0,0.45)', borderRadius: 999, padding: '8px 22px', opacity: interpolate(f, [30 + i * 6, 40 + i * 6], [0, 1], clamp) }}>
              {n}
            </div>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const FONTES = ['500 40px "Shippori Mincho"', '700 40px "Shippori Mincho"', '800 40px "Shippori Mincho"'];

export const ReelGlobinho: React.FC<Plano> = (plano) => {
  useFontes(plano, FONTES);
  const { fps } = useVideoConfig();
  const m = useMemo(() => montar(linhaGlobinho(plano), fps), [plano, fps]);
  const clipes = plano.segmentos.filter((s): s is SegClipe => s.tipo === 'clipe');
  const transicao = fade() as TransitionPresentation<Record<string, unknown>>;
  return (
    <AbsoluteFill style={{ background: '#1a0d06' }}>
      <TransitionSeries>
        {m.itens.flatMap((it, i) => [
          ...(i > 0 ? [<TransitionSeries.Transition key={`t${i}`} presentation={transicao} timing={linearTiming({ durationInFrames: TRANSICAO })} />] : []),
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={it.dur}>
            <Fundo seg={it.seg} />
          </TransitionSeries.Sequence>,
        ])}
        {m.fecho
          ? [
              <TransitionSeries.Transition key="tf" presentation={transicao} timing={linearTiming({ durationInFrames: TRANSICAO })} />,
              <TransitionSeries.Sequence key="sf" durationInFrames={m.fecho.dur}>
                <Mosaico seg={m.fecho.seg} clipes={clipes} />
              </TransitionSeries.Sequence>,
            ]
          : null}
      </TransitionSeries>
      <Folhas quantas={4} />
      <Globo m={m} />
      <Info m={m} />
    </AbsoluteFill>
  );
};

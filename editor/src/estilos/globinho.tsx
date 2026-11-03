/**
 * Estilo "globinho": as fotos e vídeos ocupam a tela inteira o tempo todo, e
 * no canto de baixo à direita um globo 3D flutua por cima da imagem, sem caixa
 * nem fundo. O avião e o trem andam pelo globo enquanto as fotos trocam atrás;
 * quando a viagem chega perto do chão, o globo vira uma lente redonda com o
 * mapa da região. Ao lado, as informações do lugar ou do trajeto.
 *
 * Com o tempero do estilo outono: tom quente nas imagens, mincho, rota carmim
 * e umas poucas folhas de bordo caindo.
 *
 * Variante "globinho-viagem": a cada mudança de lugar o globo vem para o meio
 * da tela, maior, e faz o trajeto em três tempos: mergulha nas ruas do lugar de
 * saída (OpenStreetMap), abre para mostrar o caminho inteiro, mergulha nas ruas
 * da chegada e volta para o canto.
 */
import '@fontsource/shippori-mincho/500.css';
import '@fontsource/shippori-mincho/700.css';
import '@fontsource/shippori-mincho/800.css';
import React, { useEffect, useMemo, useState } from 'react';
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming, type TransitionPresentation } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { geoCentroid, geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from 'd3-geo';
import { divisasGlobo, provincias, terraGlobo, visiveis, vizinhos } from '../geo.ts';
import { Icone } from '../icones.tsx';
import { Midia } from '../Midia.tsx';
import { fmtKm } from '../Mapa.tsx';
import { TRANSICAO, type Modo, type Plano, type SegClipe, type SegFim } from '../plano.ts';
import type { Ruas } from '../ruas.ts';
import { clamp, ll, montarAgenda, naPerna, rotaAte, suave, type Agenda, type LngLat } from '../rota.ts';
import { SEGURO, W } from '../tema.ts';
import { useFontes } from './base.tsx';
import { Particulas, TEMAS, TemaProvider, useTema, type Tema } from './globinhoTemas.tsx';
import { linhaGlobinho, type LinhaGlobinho, type Viagem } from './globinhoTempo.ts';
import { MidiaCheia } from './noite.tsx';


/**
 * onde o globo fica: no canto, e no fecho, grande no meio. O canto depende do
 * formato: no Reels fica baixo, por cima do comecinho da legenda (pedido do Leonardo), nos
 * Stories só a caixa de resposta (≈250 px); para a família não há nada por cima.
 */
interface Lente {
  cx: number;
  cy: number;
  r: number;
}
const CANTOS: Record<Plano['formato'], Lente> = {
  reel: { cx: 792, cy: 1560, r: 172 },
  story: { cx: 792, cy: 1490, r: 172 },
  familia: { cx: 844, cy: 1648, r: 172 },
};
const CENTRO: Lente = { cx: 540, cy: 1060, r: 330 };

/**
 * zoom relativo ao raio do globo: 1 = o globo inteiro cabe no círculo;
 * LUGAR ≈ a região em volta (uns 35 km de largura)
 */
const Z_GLOBO = 1;
const Z_LUGAR = 350;
const Z_MAX = 3000;
/** as ruas do bairro: uns 3 km de largura no globo */
const Z_RUA = 4200;

/**
 * globinho-viagem, em fração do trajeto: o globo cresce enquanto mergulha nas
 * ruas da saída, abre para o caminho inteiro, o veículo anda, mergulha nas ruas
 * da chegada e encolhe de volta para o canto
 */
const T = { cresceu: 0.15, abre: 0.3, aberto: 0.42, anda: 0.62, desce: 0.74, encolhe: 0.86 };

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

function montar(l: LinhaGlobinho, fps: number, plano: Plano) {
  let km = 0;
  const viagens: ViagemComAgenda[] = l.viagens.map((v) => {
    const len = v.fim - v.ini;
    const noMeio = plano.estilo === 'globinho-viagem';
    const a = v.ini + Math.round(len * (noMeio ? T.aberto : 0.2));
    const b = v.ini + Math.round(len * (noMeio ? T.anda : 0.8));
    const ag = montarAgenda(v.seg.pontos, v.seg.escala, a, b, fps);
    const out = { ...v, ag, a, b, kmAntes: km };
    km += ag.kmTotal;
    return out;
  });
  // globinho-viagem: a cada viagem o globo vem para o meio da tela e depois volta
  return { ...l, viagens, canto: CANTOS[plano.formato] ?? CANTOS.reel, viagemNoMeio: plano.estilo === 'globinho-viagem' };
}
type Modelo = ReturnType<typeof montar>;

/** 0 = globo no canto, 1 = no meio da tela (no fecho e, no globinho-viagem, durante cada viagem) */
function noMeio(m: Modelo, f: number): number {
  if (m.fecho && f >= m.fecho.ini) return suave(interpolate(f, [m.fecho.ini, m.fecho.ini + 24], [0, 1], clamp));
  const v = m.viagemNoMeio ? m.viagens.find((x) => f >= x.ini && f <= x.fim) : undefined;
  if (!v) return 0;
  const t = (f - v.ini) / (v.fim - v.ini);
  return suave(interpolate(t, [0, T.cresceu], [0, 1], clamp)) * (1 - suave(interpolate(t, [T.encolhe, 1], [0, 1], clamp)));
}

function lente(m: Modelo, f: number): Lente {
  const t = noMeio(m, f);
  const a = m.canto;
  return { cx: a.cx + (CENTRO.cx - a.cx) * t, cy: a.cy + (CENTRO.cy - a.cy) * t, r: a.r + (CENTRO.r - a.r) * t };
}

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
    const t = (f - ativa.ini) / (ativa.fim - ativa.ini);
    // no globinho-viagem o veículo já espera na rua de saída e fica na de chegada
    if (m.viagemNoMeio ? t >= 0.08 && t <= 0.9 : f >= ativa.a - 2 && f <= ativa.b + 4) ponta = { pos, modo, giro: frente };

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
      // globo grande no meio: de perto demais só se vê terra; um pouco mais longe aparece a costa
      if (m.viagemNoMeio) geral.z = Math.min(geral.z, Z_LUGAR);
    }
    if (m.viagemNoMeio && ativa.seg.escala !== 'globo') {
      const ps = ativa.seg.pontos;
      const ruaA: Camera = { c: ll(ps[0]), z: Z_RUA };
      const ruaB: Camera = { c: ll(ps[ps.length - 1]), z: Z_RUA };
      const fase = (x: number, y: number) => suave(interpolate(t, [x, y], [0, 1], clamp));
      if (t < T.cresceu) cam = misturar(antes, ruaA, fase(0, T.cresceu));
      else if (t < T.abre) cam = ruaA;
      else if (t < T.aberto) cam = misturar(ruaA, geral, fase(T.abre, T.aberto));
      else if (t < T.anda) cam = geral;
      else if (t < T.desce) cam = misturar(geral, ruaB, fase(T.anda, T.desce));
      else if (t < T.encolhe) cam = ruaB;
      else cam = misturar(ruaB, depois, fase(T.encolhe, 1));
    } else if (f < ativa.a) cam = misturar(antes, geral, suave((f - ativa.ini) / (ativa.a - ativa.ini)));
    else if (f > ativa.b) cam = misturar(geral, depois, suave((f - ativa.b) / (ativa.fim - ativa.b)));
    else cam = geral;
  } else if (m.fecho && f >= m.fecho.ini) {
    const paradas = m.viagens.flatMap((v) => v.seg.pontos).filter((p) => !p.passagem);
    const noJapao = paradas.filter((p) => p.lng > 120 && p.lng < 150);
    // fora do Japão (teste em casa) o fecho enquadra o que houver
    const japao = (noJapao.length ? noJapao : paradas).map(ll);
    const t = suave(interpolate(f, [m.fecho.ini, m.fecho.ini + m.fecho.dur * 0.45], [0, 1], clamp));
    cam = misturar({ c: posicaoEm(m, m.fecho.ini - 1), z: Z_LUGAR }, enquadrar(japao, 0.8), t);
  }
  return { ativa, feitas, cam, ponta, km };
}

// ─── o globo ─────────────────────────────────────────────────────────────

const Globo: React.FC<{ m: Modelo; ruas: Ruas }> = ({ m, ruas }) => {
  const C = useTema();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = estado(m, f, fps);
  const { cx, cy, r } = lente(m, f);
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
        <path d={caminho(divisasGlobo) ?? ''} fill="none" stroke={C.divisa} strokeWidth={0.8} />
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
          <path key={`p${i}`} d={caminho(ft as any) ?? ''} fill={C.terra} stroke={C.divisa} strokeWidth={0.8} />
        ))}
      </>
    );
  }

  // de muito perto, as ruas do bairro (OpenStreetMap) por cima da terra
  const opRuas = interpolate(Math.log(e.cam.z), [Math.log(1100), Math.log(3000)], [0, 1], clamp);
  let bairro: React.ReactNode = null;
  if (opRuas > 0) {
    const perto = Object.entries(ruas).filter(([k]) => {
      const [lat, lng] = k.split('_').map(Number);
      return geoDistance([lng, lat], e.cam.c) < 3 / e.cam.z;
    });
    const linhas = (tipo: 'grandes' | 'pequenas' | 'trilhos') => caminho({ type: 'MultiLineString', coordinates: perto.flatMap(([, r]) => r[tipo]) }) ?? '';
    bairro = (
      <g opacity={opRuas}>
        <path d={linhas('pequenas')} fill="none" stroke={C.ruaPequena} strokeWidth={1.8} strokeLinecap="round" />
        <path d={linhas('grandes')} fill="none" stroke={C.ruaGrandeBorda} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <path d={linhas('grandes')} fill="none" stroke={C.ruaGrande} strokeWidth={3.8} strokeLinecap="round" strokeLinejoin="round" />
        <path d={linhas('trilhos')} fill="none" stroke={C.trilho} strokeWidth={2.4} strokeDasharray="10 6" />
      </g>
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
  const esc = r / m.canto.r;

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
          <stop offset="0.86" stopColor={C.halo} stopOpacity={0} />
          <stop offset="0.92" stopColor={C.halo} stopOpacity={0.35} />
          <stop offset="1" stopColor={C.halo} stopOpacity={0} />
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
        {bairro}
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
      {bairro ? (
        <text x={cx} y={cy + r + 26} textAnchor="middle" fontFamily="sans-serif" fontSize={15} fill={C.cremeSuave} opacity={opRuas * 0.8}>
          © OpenStreetMap
        </text>
      ) : null}

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
  const C = useTema();
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
  // globinho-viagem: o trajeto aparece centrado em cima do globo grande, quando ele chega ao meio
  const g = lente(m, f);
  const centrado = m.viagemNoMeio && !!v;
  const op = centrado ? interpolate(noMeio(m, f), [0.55, 1], [0, 1], clamp) : a;
  const lugarDoTexto: React.CSSProperties = centrado
    ? { left: SEGURO.esquerda, right: SEGURO.esquerda, bottom: 1920 - (g.cy - g.r - 26), textAlign: 'center' }
    : { right: W - (m.canto.cx + m.canto.r), bottom: 1920 - (m.canto.cy - m.canto.r - 22), maxWidth: 820, textAlign: 'right' };
  return (
    <div
      style={{
        position: 'absolute',
        ...lugarDoTexto,
        fontFamily: C.fonte,
        opacity: op,
        transform: `translateY(${(1 - op) * 14}px)`,
        textShadow: `0 2px 12px rgba(${C.sombra},0.85), 0 0 3px rgba(${C.sombra},0.6)`,
      }}
    >
      {v ? (
        <>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.ambar, letterSpacing: 4 }}>
            {modos.map((x) => MODO_JP[x]).join('・')} · {v.seg.quando}
          </div>
          <div style={{ fontSize: 58, fontWeight: 800, color: C.creme, lineHeight: 1.08, ...alta(C) }}>{v.seg.titulo}</div>
          <div style={{ fontSize: 28, fontWeight: 500, color: C.cremeSuave, marginTop: 6 }}>
            {v.seg.legenda}
            {v.seg.escala === 'globo' ? <span style={{ color: C.ambar, fontWeight: 700 }}> · {fmtKm(e.km)} km</span> : null}
          </div>
        </>
      ) : (
        <>
          {lugar?.jp ? <div style={{ fontSize: 32, fontWeight: 700, color: C.ambar, letterSpacing: 6 }}>{lugar.jp}</div> : null}
          <div style={{ fontSize: 62, fontWeight: 800, color: C.creme, lineHeight: 1.06, ...alta(C) }}>{lugar?.nome}</div>
          {lugar?.linha ? <div style={{ fontSize: 28, fontWeight: 500, color: C.cremeSuave, marginTop: 6, fontStyle: 'italic' }}>{lugar.linha}</div> : null}
        </>
      )}
    </div>
  );
};

// ─── fundo: os vídeos e fotos em sequência ───────────────────────────────

const Nota: React.FC<{ titulo?: string; texto: string }> = ({ titulo, texto }) => {
  const C = useTema();
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
        background: C.notaFundo,
        borderRadius: 6,
        boxShadow: '0 12px 30px rgba(40,15,0,0.35)',
        fontFamily: C.fonte,
        opacity: entra * sai,
        transform: `translateY(${(1 - entra) * -16}px)`,
      }}
    >
      <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: 4, color: C.carmim, marginBottom: 6 }}>
        歴史 · HISTÓRIA{titulo ? <span style={{ color: C.notaTexto, opacity: 0.62, letterSpacing: 1, marginLeft: 10, fontStyle: 'italic' }}>{titulo}</span> : null}
      </div>
      <div style={{ fontSize: 30, fontWeight: 500, color: C.notaTexto, lineHeight: 1.4 }}>{texto}</div>
    </div>
  );
};

const Fundo: React.FC<{ seg: SegClipe; canto: Lente }> = ({ seg, canto }) => {
  const C = useTema();
  return (
  <AbsoluteFill style={{ background: C.fundo }}>
    <MidiaCheia seg={seg} filtro={C.grade} />
    {C.veu ? <AbsoluteFill style={{ background: C.veu }} /> : null}
    {/* escurece só o canto do globo e o topo, para o texto ler sem precisar de caixa */}
    <AbsoluteFill style={{ background: `radial-gradient(circle at ${canto.cx + 7}px ${canto.cy - 21}px, rgba(${C.sombra},0.6) 0%, rgba(${C.sombra},0.25) 28%, rgba(0,0,0,0) 48%)` }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(${C.sombra},0.35) 0%, rgba(0,0,0,0) 22%)` }} />
  </AbsoluteFill>
  );
};

/** fecho: mosaico com todos os lugares, o globo grande no meio e o título */
const Mosaico: React.FC<{ seg: SegFim; clipes: SegClipe[] }> = ({ seg, clipes }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [8, 26], [0, 1], clamp);
  const tiles = clipes.slice(0, 6);
  const C = useTema();
  return (
    <AbsoluteFill style={{ background: C.fundo }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)' }}>
        {tiles.map((c, i) => (
          <div key={i} style={{ position: 'relative', overflow: 'hidden', filter: C.grade }}>
            <Midia seg={c} />
          </div>
        ))}
      </div>
      <AbsoluteFill style={{ background: `rgba(${C.sombra},0.55)` }} />
      <div style={{ position: 'absolute', top: SEGURO.topo, left: 0, right: 0, textAlign: 'center', fontFamily: C.fonte, opacity: a, textShadow: `0 2px 16px rgba(${C.sombra},0.8)` }}>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 12, color: C.ambar }}>{C.selo}</div>
        <div style={{ fontSize: 84, fontWeight: 800, color: C.creme, lineHeight: 1.05, marginTop: 6, ...alta(C) }}>{seg.titulo}</div>
        {seg.sub ? <div style={{ fontSize: 30, fontWeight: 500, color: C.cremeSuave, marginTop: 8, fontStyle: 'italic' }}>{seg.sub} · outono de 2026</div> : null}
      </div>
      {seg.numeros ? (
        <div style={{ position: 'absolute', bottom: SEGURO.base + 10, left: SEGURO.esquerda, right: SEGURO.esquerda, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', fontFamily: C.fonte }}>
          {seg.numeros.map((n, i) => (
            <div key={i} style={{ fontSize: 28, fontWeight: 700, color: C.creme, border: `2px solid ${C.ambar}`, background: `rgba(${C.sombra},0.45)`, borderRadius: 999, padding: '8px 22px', opacity: interpolate(f, [30 + i * 6, 40 + i * 6], [0, 1], clamp) }}>
              {n}
            </div>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * as notas de história ficam o tempo de ler (2 s + 1 s a cada 18 letras), mesmo
 * que as fotos troquem atrás; se o globo estiver no meio, esperam ele voltar
 */
const Notas: React.FC<{ m: Modelo }> = ({ m }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {m.itens.map((it, i) => {
        if (!it.seg.nota) return null;
        const v = m.viagemNoMeio ? m.viagens.find((x) => x.ini <= it.ini + fps && x.fim > it.ini) : undefined;
        const entra = Math.max(it.ini + Math.round(fps * 0.7), v ? v.ini + Math.round((v.fim - v.ini) * T.encolhe) : 0);
        const ler = Math.round(fps * (2 + it.seg.nota.texto.length / 18));
        const proxima = Math.min(...m.viagens.filter((x) => x.ini > entra).map((x) => x.ini), m.fecho?.ini ?? Infinity);
        const de = entra - Math.round(fps * 0.7);
        return (
          <Sequence key={i} from={de} durationInFrames={Math.min(entra + ler, proxima) - de} layout="none">
            <Nota {...it.seg.nota} />
          </Sequence>
        );
      })}
    </>
  );
};

/** globinho-viagem: escurece as fotos enquanto o globo está no meio, para o trajeto saltar aos olhos */
const Escurece: React.FC<{ m: Modelo }> = ({ m }) => {
  const C = useTema();
  const f = useCurrentFrame();
  const t = m.fecho && f >= m.fecho.ini ? 0 : noMeio(m, f);
  return t > 0 ? <AbsoluteFill style={{ background: `rgba(${C.sombra},${0.4 * t})` }} /> : null;
};

/** títulos em caixa alta nos temas que pedem (jazz) */
const alta = (C: Tema): React.CSSProperties => (C.caixaAlta ? { textTransform: 'uppercase', letterSpacing: 1 } : {});

export const ReelGlobinho: React.FC<Plano> = (plano) => {
  const tema = TEMAS[plano.tema ?? 'outono'];
  useFontes(plano, tema.fontes);
  const { fps, durationInFrames: n } = useVideoConfig();
  const m = useMemo(() => montar(linhaGlobinho(plano), fps, plano), [plano, fps]);
  // ruas.json: o render baixa as ruas em volta das paradas (scripts/lib/ruas.ts)
  const [ruas, setRuas] = useState<Ruas>({});
  const [espera] = useState(() => delayRender('ruas'));
  useEffect(() => {
    fetch(staticFile('ruas.json'))
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}))
      .then((j) => {
        setRuas(j as Ruas);
        continueRender(espera);
      });
  }, [espera]);
  // a música some nos últimos 2 s em vez de cortar seco
  const volumeTrilha = (f: number) => 0.8 * interpolate(f, [n - 2 * fps, n - 1], [1, 0], clamp);
  const clipes = plano.segmentos.filter((s): s is SegClipe => s.tipo === 'clipe');
  const transicao = fade() as TransitionPresentation<Record<string, unknown>>;
  return (
    <TemaProvider value={tema}>
    <AbsoluteFill style={{ background: tema.fundo }}>
      <TransitionSeries>
        {m.itens.flatMap((it, i) => [
          ...(i > 0 ? [<TransitionSeries.Transition key={`t${i}`} presentation={transicao} timing={linearTiming({ durationInFrames: TRANSICAO })} />] : []),
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={it.dur}>
            <Fundo seg={it.seg} canto={m.canto} />
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
      <Escurece m={m} />
      <Notas m={m} />
      {plano.semParticulas ? null : <Particulas />}
      <Globo m={m} ruas={ruas} />
      <Info m={m} />
      {plano.trilha ? <Audio src={staticFile(plano.trilha)} volume={volumeTrilha} trimBefore={Math.round((plano.trilhaDe ?? 0) * fps)} /> : null}
    </AbsoluteFill>
    </TemaProvider>
  );
};

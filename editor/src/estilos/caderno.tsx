/**
 * Estilo "caderno de viagem": tudo numa página de caderno quadriculado.
 * Mapa desenhado à caneta com aquarela, fotos e vídeos colados com fita washi,
 * carimbo de estação (eki stamp) em cada lugar, notas escritas à mão e um
 * fecho com a coleção de carimbos da semana.
 */
import '@fontsource/caveat/500.css';
import '@fontsource/caveat/700.css';
import '@fontsource/klee-one/400.css';
import '@fontsource/klee-one/600.css';
import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { Icone, IconeHtml } from '../icones.tsx';
import { MapaCena, fmtKm, type PinoProps, type PolaroidProps, type RotuloProps, type VisualMapa } from '../Mapa.tsx';
import { Midia } from '../Midia.tsx';
import type { Modo, Plano, SegClipe, SegFim, Segmento } from '../plano.ts';
import { AREA, clamp } from '../rota.ts';
import { H, SEGURO, W } from '../tema.ts';
import { ReelPadrao, type SegProps } from './base.tsx';
import { Carimbo } from './carimbo.tsx';

const C = {
  papel: '#f7f2e7',
  grade: 'rgba(120,160,205,0.28)',
  margem: 'rgba(222,90,90,0.55)',
  caneta: '#1f3f8f',
  tinta: '#2a2a33',
  lapis: 'rgba(60,60,70,0.55)',
  aquarela: 'rgba(160,200,130,0.42)',
  aquarelaMar: 'rgba(150,190,220,0.35)',
  vermelho: '#c8322c',
  postit: '#fff1a1',
};
const MAO = '"Caveat", "Klee One", cursive';
const CANETA = '"Klee One", "Caveat", sans-serif';

/** a página: papel quadriculado com a margem vermelha */
export const Pagina: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      backgroundColor: C.papel,
      backgroundImage: `linear-gradient(${C.grade} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grade} 1.5px, transparent 1.5px)`,
      backgroundSize: '54px 54px',
      backgroundPosition: '-2px -2px',
    }}
  >
    <div style={{ position: 'absolute', left: 96, top: 0, bottom: 0, width: 3, background: C.margem }} />
    {children}
  </AbsoluteFill>
);

/** grão de papel por cima de tudo */
const Grao: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.35 }}>
    <svg width={W} height={H}>
      <filter id="grao">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="2" seed="5" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.32  0 0 0 0.18 0" />
      </filter>
      <rect width={W} height={H} filter="url(#grao)" />
    </svg>
  </AbsoluteFill>
);

// ─── mapa ────────────────────────────────────────────────────────────────

const Rotulo: React.FC<RotuloProps> = ({ x, y, p, aparece, cinza }) => {
  const esquerda = x > W * 0.62;
  const pequeno = p.passagem || cinza;
  return (
    <div
      style={{
        position: 'absolute',
        left: esquerda ? undefined : x + (pequeno ? 18 : 30),
        right: esquerda ? W - x + (pequeno ? 18 : 30) : undefined,
        top: y - (pequeno ? 22 : 42),
        textAlign: esquerda ? 'right' : 'left',
        opacity: aparece,
        whiteSpace: 'nowrap',
        transform: `rotate(${esquerda ? 2 : -2}deg)`,
      }}
    >
      <div style={{ fontFamily: MAO, fontSize: pequeno ? 34 : 56, fontWeight: 700, color: cinza ? C.lapis : C.caneta, lineHeight: 1 }}>
        {p.nome}
        {p.jp && !pequeno ? <span style={{ fontFamily: CANETA, fontSize: 28, fontWeight: 600, color: C.vermelho, marginLeft: 10 }}>{p.jp}</span> : null}
      </div>
      {p.sub && !cinza ? <div style={{ fontFamily: CANETA, fontSize: pequeno ? 20 : 24, color: C.lapis, marginTop: 2 }}>{p.sub}</div> : null}
    </div>
  );
};

const Pino: React.FC<PinoProps> = ({ p, s }) => (
  <g transform={`scale(${s})`} fill="none" stroke={C.caneta} strokeLinecap="round">
    {p.passagem ? (
      <circle r={7} strokeWidth={3.5} fill={C.papel} />
    ) : (
      <>
        <path d="M -14 2 C -14 -12, 12 -16, 14 -2 C 16 12, -10 16, -13 4" strokeWidth={4} fill={C.papel} />
        <circle r={4} fill={C.vermelho} stroke="none" />
      </>
    )}
  </g>
);

/** foto colada com fita washi */
const FotoColada: React.FC<PolaroidProps> = ({ x, y, foto, legenda, f, fps, lado }) => {
  const s = spring({ frame: f, fps, config: { damping: 16, mass: 0.7 } });
  if (f < 0) return null;
  const w = 260;
  const left = Math.min(W - w - 50, Math.max(110, x + (lado > 0 ? 40 : -w - 40)));
  const top = Math.min(AREA.y1 - 340, Math.max(SEGURO.topo + 200, y - 450));
  return (
    <div style={{ position: 'absolute', left, top, width: w, transform: `rotate(${lado * 4}deg) scale(${0.6 + 0.4 * s})`, opacity: s }}>
      <div style={{ background: '#fff', padding: 10, boxShadow: '0 8px 18px rgba(40,30,10,0.25)' }}>
        <Img src={staticFile(foto)} style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }} />
      </div>
      <Fita x={w / 2 - 70} y={-18} giro={-4} cor="rgba(232,150,150,0.75)" />
      <div style={{ fontFamily: MAO, fontSize: 34, fontWeight: 700, color: C.caneta, textAlign: 'center', marginTop: 4 }}>{legenda}</div>
    </div>
  );
};

/** tira de fita washi, semitransparente e listrada */
const Fita: React.FC<{ x: number; y: number; giro: number; cor: string; largura?: number }> = ({ x, y, giro, cor, largura = 140 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: largura,
      height: 38,
      background: `repeating-linear-gradient(45deg, ${cor} 0 10px, rgba(255,255,255,0.35) 10px 20px)`,
      transform: `rotate(${giro}deg)`,
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      clipPath: 'polygon(2% 0, 98% 4%, 100% 50%, 97% 100%, 1% 96%, 0 50%)',
    }}
  />
);

const CADERNO: VisualMapa = {
  fundo: 'transparent',
  fonte: MAO,
  globo: { mar: C.aquarelaMar, borda: C.tinta, grade: 'rgba(42,42,51,0.12)', terra: C.aquarela, terraBorda: C.tinta, divisa: 'rgba(42,42,51,0.25)', atmosfera: 'none' },
  mar: undefined,
  terra: C.aquarela,
  terraBorda: C.tinta,
  divisa: 'rgba(42,42,51,0.12)',
  costa: 1.4,
  larguraBorda: 1.8,
  vizinhosOpacidade: 0.9,
  filtro: 'url(#tremido)',
  rota: { cor: C.caneta, largura: 5, tracejado: '16 11', futura: 'rgba(60,60,70,0.3)', futuraTracejado: '2 10' },
  defs: (
    <filter id="tremido">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="8" />
      <feDisplacementMap in="SourceGraphic" scale="6" />
    </filter>
  ),
  Pino,
  Rotulo,
  Selo: ({ modo, x, y, giro }) => (
    <g transform={`translate(${x},${y})`}>
      <circle r={30} fill={C.papel} stroke={C.caneta} strokeWidth={3} />
      <Icone modo={modo} tam={36} cor={C.caneta} giro={modo === 'aviao' ? giro : 0} />
    </g>
  ),
  Polaroid: FotoColada,
};

const Cabecalho: React.FC<{ quando?: string; titulo?: string }> = ({ quando, titulo }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [2, 16], [0, 1], clamp);
  const sublinhado = interpolate(f, [10, 30], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', top: SEGURO.topo - 20, left: 130, right: 60, opacity: a }}>
      {quando ? <div style={{ fontFamily: CANETA, fontSize: 30, color: C.vermelho, marginBottom: 2 }}>{quando}</div> : null}
      {titulo ? <div style={{ fontFamily: MAO, fontSize: 92, fontWeight: 700, color: C.tinta, lineHeight: 1 }}>{titulo}</div> : null}
      <svg width={560} height={26} style={{ display: 'block', marginTop: 4 }}>
        <path d="M 4 14 C 80 4, 160 22, 240 12 S 400 6, 552 14" fill="none" stroke={C.vermelho} strokeWidth={5} strokeLinecap="round" strokeDasharray={600} strokeDashoffset={600 * (1 - sublinhado)} />
      </svg>
    </div>
  );
};

/** post-it amarelo com o transporte */
const Legenda: React.FC<{ modos: Modo[]; texto?: string; km?: number }> = ({ modos, texto, km }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f - 8, fps, config: { damping: 14 } });
  const unicos = modos.filter((m, i) => modos.indexOf(m) === i);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: SEGURO.base + 10,
        left: 150,
        width: 700,
        padding: '22px 28px 26px',
        background: C.postit,
        boxShadow: '0 10px 18px rgba(60,50,0,0.22)',
        transform: `rotate(-1.5deg) scale(${s})`,
        transformOrigin: 'top left',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {unicos.map((m) => (
          <IconeHtml key={m} modo={m} tam={40} cor={C.caneta} />
        ))}
        <div style={{ fontFamily: MAO, fontSize: 44, fontWeight: 700, color: C.caneta, lineHeight: 1.05, flex: 1 }}>{texto}</div>
      </div>
      {km !== undefined ? <div style={{ fontFamily: MAO, fontSize: 40, color: C.vermelho, marginTop: 4 }}>≈ {fmtKm(km)} km voando!</div> : null}
    </div>
  );
};

// ─── clipe: foto colada na página ────────────────────────────────────────

const Clipe: React.FC<{ seg: SegClipe; i: number }> = ({ seg, i }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames: n } = useVideoConfig();
  const lado = i % 4 === 1 ? -1 : 1;
  const cai = spring({ frame: f, fps, config: { damping: 15, mass: 0.8 } });
  const carimbo = spring({ frame: f - Math.round(fps * 0.55), fps, config: { damping: 9, mass: 0.5 } });
  const nota = interpolate(f, [fps * 0.9, fps * 1.3], [0, 1], clamp);
  const sai = interpolate(f, [n - fps * 0.3, n], [1, 0], clamp);
  const data = seg.lugar?.linha?.match(/(\d+) nov/)?.[1];
  const W0 = 820;
  const H0 = 1025;
  return (
    <Pagina>
      {/* a foto */}
      <div
        style={{
          position: 'absolute',
          left: (W - W0) / 2 + 20,
          top: 250,
          width: W0,
          transform: `rotate(${lado * 1.6}deg) scale(${1.08 - 0.08 * cai})`,
          opacity: cai,
        }}
      >
        <div style={{ background: '#fff', padding: 18, boxShadow: '0 16px 30px rgba(40,30,10,0.28)' }}>
          <div style={{ width: W0 - 36, height: H0, overflow: 'hidden', position: 'relative' }}>
            <Midia seg={seg} />
          </div>
        </div>
        <Fita x={-40} y={-14} giro={-32} cor="rgba(126,178,160,0.8)" largura={190} />
        <Fita x={W0 - 150} y={-14} giro={30} cor="rgba(240,180,90,0.8)" largura={190} />
      </div>

      {/* carimbo da estação, batido no canto da foto */}
      {seg.lugar && f > fps * 0.5 ? (
        <div style={{ position: 'absolute', right: 34, top: 1050, transform: `scale(${1.5 - 0.5 * carimbo})`, opacity: Math.min(1, carimbo * 1.2) }}>
          <Carimbo jp={seg.lugar.jp} nome={seg.lugar.nome} data={data ? `2026 · ${data} NOV` : '2026'} tam={300} giro={lado * -10} fonteJp={CANETA} fonte={CANETA} opacidade={0.92} />
        </div>
      ) : null}

      {/* legenda à mão embaixo da foto */}
      {seg.lugar ? (
        <div style={{ position: 'absolute', left: 140, right: 60, top: 1335, transform: `rotate(${lado * -1}deg)`, opacity: cai }}>
          <span style={{ fontFamily: MAO, fontSize: 76, fontWeight: 700, color: C.caneta }}>{seg.lugar.nome}</span>
          {seg.lugar.linha ? <span style={{ fontFamily: CANETA, fontSize: 26, color: C.lapis, marginLeft: 18 }}>{seg.lugar.linha}</span> : null}
        </div>
      ) : null}

      {/* nota de história: papelzinho preso por cima da foto */}
      {seg.nota ? (
        <div
          style={{
            position: 'absolute',
            left: 70,
            width: 660,
            top: 1010,
            padding: '20px 26px 22px',
            background: '#fffdf6',
            backgroundImage: `linear-gradient(transparent 46px, rgba(120,160,205,0.35) 46px)`,
            backgroundSize: '100% 48px',
            boxShadow: '0 10px 20px rgba(40,30,10,0.25)',
            transform: `rotate(${lado * -2.2}deg) translateY(${(1 - nota) * 30}px)`,
            opacity: nota * sai,
          }}
        >
          <Fita x={250} y={-22} giro={3} cor="rgba(200,120,170,0.7)" largura={130} />
          <div style={{ fontFamily: MAO, fontSize: 30, fontWeight: 700, color: C.vermelho }}>{seg.nota.titulo ?? 'história'} ✎</div>
          <div style={{ fontFamily: MAO, fontSize: 40, fontWeight: 500, color: C.tinta, lineHeight: 1.18 }}>{seg.nota.texto}</div>
        </div>
      ) : null}
    </Pagina>
  );
};

// ─── fecho: a coleção de carimbos ────────────────────────────────────────

const Fim: React.FC<{ seg: SegFim; plano: Plano }> = ({ seg, plano }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lugares = plano.segmentos.filter((s): s is SegClipe => s.tipo === 'clipe' && !!s.lugar?.jp).map((s) => s.lugar!);
  const unicos = lugares.filter((l, i) => lugares.findIndex((o) => o.nome === l.nome) === i).slice(0, 6);
  const a = interpolate(f, [2, 16], [0, 1], clamp);
  return (
    <Pagina>
      <div style={{ position: 'absolute', top: SEGURO.topo - 20, left: 130, right: 60, opacity: a }}>
        <div style={{ fontFamily: CANETA, fontSize: 30, color: C.vermelho }}>{seg.sub}</div>
        <div style={{ fontFamily: MAO, fontSize: 104, fontWeight: 700, color: C.tinta, lineHeight: 1 }}>{seg.titulo} ✓</div>
        <div style={{ fontFamily: MAO, fontSize: 42, color: C.caneta, marginTop: 6 }}>carimbos da semana:</div>
      </div>
      <div style={{ position: 'absolute', top: 560, left: 120, right: 60, display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
        {unicos.map((l, i) => {
          const s = spring({ frame: f - 10 - i * 7, fps, config: { damping: 9, mass: 0.5 } });
          const data = l.linha?.match(/(\d+) nov/)?.[1];
          return (
            <div key={i} style={{ width: 270, height: 290, transform: `scale(${f < 10 + i * 7 ? 0 : 1.5 - 0.5 * s}) translateY(${(i % 2) * 30}px)`, opacity: Math.min(1, s * 1.3) }}>
              <Carimbo jp={l.jp} nome={l.nome} data={data ? `2026 · ${data} NOV` : '2026'} tam={260} giro={((i * 37) % 24) - 12} cor={i % 3 === 1 ? '#2b55a8' : '#c8322c'} fonteJp={CANETA} fonte={CANETA} />
            </div>
          );
        })}
      </div>
      {seg.numeros ? (
        <div style={{ position: 'absolute', bottom: SEGURO.base + 10, left: 140, right: 60, fontFamily: MAO, fontSize: 44, color: C.caneta, lineHeight: 1.15 }}>
          {seg.numeros.map((n, i) => (
            <div key={i} style={{ opacity: interpolate(f, [40 + i * 6, 50 + i * 6], [0, 1], clamp) }}>
              — {n}
            </div>
          ))}
        </div>
      ) : null}
    </Pagina>
  );
};

// ─── virar a página ──────────────────────────────────────────────────────

const VirarPagina: React.FC<TransitionPresentationComponentProps<Record<string, unknown>>> = ({ children, presentationDirection, presentationProgress }) => {
  if (presentationDirection === 'entering') return <AbsoluteFill>{children}</AbsoluteFill>;
  const ang = -presentationProgress * 100;
  return (
    <AbsoluteFill style={{ perspective: 2400, zIndex: 2 }}>
      <AbsoluteFill style={{ transform: `rotateY(${ang}deg)`, transformOrigin: 'left center', backfaceVisibility: 'hidden', boxShadow: `${20 * presentationProgress}px 0 60px rgba(0,0,0,${0.35 * presentationProgress})` }}>
        {children}
        <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,0) 40%, rgba(0,0,0,${0.25 * presentationProgress}) 100%)` }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
const virarPagina = (): TransitionPresentation<Record<string, unknown>> => ({ component: VirarPagina, props: {} });

// ─── o reel ──────────────────────────────────────────────────────────────

const Segm: React.FC<SegProps> = ({ s, i, plano }) => {
  if (s.tipo === 'clipe') return <Clipe seg={s} i={i} />;
  if (s.tipo === 'fim') return <Fim seg={s} plano={plano} />;
  return (
    <Pagina>
      <MapaCena visual={CADERNO} escala={s.escala} pontos={s.pontos} modos={s.modos} contexto={s.contexto}>
        {({ kmAteAgora }) => (
          <>
            <Cabecalho quando={s.quando} titulo={s.titulo} />
            <Legenda modos={s.modos} texto={s.legenda} km={s.escala === 'globo' ? kmAteAgora : undefined} />
          </>
        )}
      </MapaCena>
    </Pagina>
  );
};

const FONTES = ['500 40px "Caveat"', '700 40px "Caveat"', '400 40px "Klee One"', '600 40px "Klee One"'];

export const ReelCaderno: React.FC<Plano> = (plano) => (
  <ReelPadrao plano={plano} fontes={FONTES} Segmento={Segm} fundo={C.papel} transicao={(_de: Segmento, _para: Segmento) => virarPagina()} sobre={<Grao />} />
);

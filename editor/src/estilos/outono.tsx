/**
 * Estilo "outono" (紅葉, kōyō): mapas em papel creme como mapa antigo, rota
 * carmim, tipografia mincho (serifada japonesa), folhas de bordo caindo e uma
 * rajada de folhas em cada troca de cena. Vídeos com um leve tom quente.
 */
import '@fontsource/shippori-mincho/500.css';
import '@fontsource/shippori-mincho/700.css';
import '@fontsource/shippori-mincho/800.css';
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { IconeHtml, Selo } from '../icones.tsx';
import { MapaCena, fmtKm, type PinoProps, type RotuloProps, type VisualMapa } from '../Mapa.tsx';
import { inicios, type Modo, type Plano, type SegClipe, type SegFim } from '../plano.ts';
import { clamp } from '../rota.ts';
import { SEGURO, W } from '../tema.ts';
import { ReelPadrao, type SegProps } from './base.tsx';
import { Folha, Folhas, Galho } from './folhas.tsx';
import { MidiaCheia, Polaroid } from './noite.tsx';

const C = {
  papel: '#f7efdc',
  mar: '#e9d6b2',
  costa: '#8f5d3b',
  divisa: '#e6d3ad',
  tinta: '#3a2416',
  tintaSuave: 'rgba(58,36,22,0.62)',
  carmim: '#b3261e',
  laranja: '#e0702a',
};
const SERIFA = '"Shippori Mincho", "Hiragino Mincho ProN", "Yu Mincho", serif';

// ─── mapa ────────────────────────────────────────────────────────────────

const Rotulo: React.FC<RotuloProps> = ({ x, y, p, aparece, cinza }) => {
  const esquerda = x > W * 0.62;
  const pequeno = p.passagem || cinza;
  return (
    <div
      style={{
        position: 'absolute',
        left: esquerda ? undefined : x + (pequeno ? 20 : 34),
        right: esquerda ? W - x + (pequeno ? 20 : 34) : undefined,
        top: y - (pequeno ? 20 : 36),
        textAlign: esquerda ? 'right' : 'left',
        opacity: aparece,
        transform: `translateY(${(1 - aparece) * 12}px)`,
        whiteSpace: 'nowrap',
        fontFamily: SERIFA,
        textShadow: `0 0 8px ${C.papel}, 0 0 14px ${C.papel}`,
      }}
    >
      <div style={{ fontSize: pequeno ? 26 : 42, fontWeight: pequeno ? 500 : 800, color: cinza ? 'rgba(58,36,22,0.4)' : C.tinta, lineHeight: 1.1 }}>
        {p.nome}
        {p.jp && !pequeno ? <span style={{ fontSize: 28, fontWeight: 700, color: C.carmim, marginLeft: 12 }}>{p.jp}</span> : null}
      </div>
      {p.sub && !cinza ? <div style={{ fontSize: pequeno ? 20 : 26, fontWeight: 500, color: C.tintaSuave, marginTop: 4, fontStyle: 'italic' }}>{p.sub}</div> : null}
    </div>
  );
};

const Pino: React.FC<PinoProps> = ({ p, s }) =>
  p.passagem ? (
    <circle r={8 * s} fill={C.papel} stroke={C.carmim} strokeWidth={4} />
  ) : (
    <g transform={`scale(${s})`}>
      <circle r={12} fill={C.papel} stroke={C.carmim} strokeWidth={5} />
      <g transform="translate(16,-20)">
        <Folha tam={38} cor={C.carmim} giro={-20} />
      </g>
    </g>
  );

export const OUTONO: VisualMapa = {
  fundo: `radial-gradient(ellipse at 50% 45%, #efdfbf 0%, ${C.mar} 60%, #dcc196 100%)`,
  fonte: SERIFA,
  globo: { mar: C.mar, borda: C.costa, grade: 'rgba(143,93,59,0.16)', terra: C.papel, terraBorda: C.costa, divisa: 'rgba(143,93,59,0.3)', atmosfera: 'none' },
  terra: C.papel,
  terraBorda: C.costa,
  divisa: C.divisa,
  costa: 1.6,
  larguraBorda: 1.6,
  vizinhosOpacidade: 1,
  rota: { cor: C.carmim, largura: 7, futura: 'rgba(179,38,30,0.35)', futuraTracejado: '3 12' },
  texturaLocal: 'url(#hachura)',
  sobre: <Galho x={W + 10} y={-30} escala={1.15} />,
  defs: (
    <pattern id="hachura" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <path d="M0 0V22" stroke="rgba(143,93,59,0.06)" strokeWidth="2" />
    </pattern>
  ),
  Pino,
  Rotulo,
  Selo: ({ modo, x, y, giro }) => <Selo modo={modo} x={x} y={y} giro={giro} cor={C.carmim} corIcone={C.papel} borda={C.papel} halo={false} />,
  Polaroid: (p) => <Polaroid {...p} papel="#fffaf0" tinta={C.tinta} fonte={SERIFA} />,
};

const Cabecalho: React.FC<{ quando?: string; titulo?: string }> = ({ quando, titulo }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [2, 18], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', top: SEGURO.topo, left: SEGURO.esquerda, right: SEGURO.esquerda, opacity: a, fontFamily: SERIFA }}>
      {quando ? (
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 5, color: C.carmim, marginBottom: 10 }}>
          紅葉 <span style={{ color: C.tintaSuave, margin: '0 10px' }}>·</span> {quando}
        </div>
      ) : null}
      {titulo ? <div style={{ fontSize: 68, fontWeight: 800, color: C.tinta, lineHeight: 1.08, transform: `translateY(${(1 - a) * 14}px)` }}>{titulo}</div> : null}
      <div style={{ width: 120 * a, height: 3, background: C.carmim, marginTop: 18 }} />
    </div>
  );
};

const Legenda: React.FC<{ modos: Modo[]; texto?: string; km?: number }> = ({ modos, texto, km }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [10, 26], [0, 1], clamp);
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
        fontFamily: SERIFA,
        background: 'rgba(247,239,220,0.85)',
        border: `2px solid ${C.costa}`,
        borderRadius: 8,
        padding: '16px 22px',
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        {unicos.map((m) => (
          <div key={m} style={{ width: 54, height: 54, borderRadius: 27, background: C.carmim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconeHtml modo={m} tam={30} cor={C.papel} />
          </div>
        ))}
      </div>
      <div style={{ flex: 1, fontSize: 31, fontWeight: 700, color: C.tinta, lineHeight: 1.2 }}>{texto}</div>
      {km !== undefined ? (
        <div style={{ fontSize: 42, fontWeight: 800, color: C.carmim, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {fmtKm(km)}
          <span style={{ fontSize: 24, color: C.tintaSuave, marginLeft: 6 }}>km</span>
        </div>
      ) : null}
    </div>
  );
};

// ─── clipe ───────────────────────────────────────────────────────────────

const Etiqueta: React.FC<{ nome: string; jp?: string; linha?: string }> = ({ nome, jp, linha }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [6, 22], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', top: SEGURO.topo, left: SEGURO.esquerda, right: SEGURO.direita, opacity: a, fontFamily: SERIFA, textShadow: '0 2px 16px rgba(40,15,0,0.75)' }}>
      {jp ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 700, color: '#ffd8a8', letterSpacing: 6 }}>
          <svg width={40} height={40} viewBox="-1.1 -1.1 2.2 2.2" style={{ transform: `rotate(${(1 - a) * -90}deg)` }}>
            <Folha tam={2} cor="#ff8a4c" />
          </svg>
          {jp}
        </div>
      ) : null}
      <div style={{ fontSize: 62, fontWeight: 800, color: '#fff8ec', lineHeight: 1.08, marginTop: 4, transform: `translateY(${(1 - a) * 16}px)` }}>{nome}</div>
      {linha ? <div style={{ fontSize: 28, fontWeight: 500, color: 'rgba(255,248,236,0.8)', marginTop: 10, fontStyle: 'italic' }}>{linha}</div> : null}
    </div>
  );
};

const Nota: React.FC<{ titulo?: string; texto: string }> = ({ titulo, texto }) => {
  const f = useCurrentFrame();
  const { durationInFrames: n, fps } = useVideoConfig();
  const entra = interpolate(f, [fps * 0.7, fps * 1.15], [0, 1], clamp);
  const sai = interpolate(f, [n - fps * 0.45, n - fps * 0.1], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: SEGURO.esquerda,
        right: SEGURO.direita,
        bottom: SEGURO.base + 10,
        padding: '22px 30px 26px',
        background: 'rgba(250,243,228,0.92)',
        borderRadius: 6,
        boxShadow: '0 14px 34px rgba(40,15,0,0.35)',
        fontFamily: SERIFA,
        opacity: entra * sai,
        transform: `translateY(${(1 - entra) * 24}px) rotate(-0.6deg)`,
      }}
    >
      <svg width={54} height={54} viewBox="-1.1 -1.1 2.2 2.2" style={{ position: 'absolute', right: 18, top: -22, transform: 'rotate(18deg)' }}>
        <Folha tam={2} cor={C.laranja} />
      </svg>
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, color: C.carmim, marginBottom: 8 }}>
        歴史 · HISTÓRIA{titulo ? <span style={{ color: C.tintaSuave, letterSpacing: 1, marginLeft: 10, fontStyle: 'italic' }}>{titulo}</span> : null}
      </div>
      <div style={{ fontSize: 32, fontWeight: 500, color: C.tinta, lineHeight: 1.42 }}>{texto}</div>
    </div>
  );
};

const Clipe: React.FC<{ seg: SegClipe }> = ({ seg }) => (
  <AbsoluteFill style={{ background: '#1a0d06' }}>
    <MidiaCheia seg={seg} filtro="sepia(0.18) saturate(1.22) contrast(1.04) brightness(1.02)" />
    {/* vinheta quente */}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(70,25,5,0.5) 100%)' }} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(50,18,2,0.55) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 65%, rgba(50,18,2,0.5) 100%)' }} />
    {seg.lugar ? <Etiqueta {...seg.lugar} /> : null}
    {seg.nota ? <Nota {...seg.nota} /> : null}
  </AbsoluteFill>
);

// ─── fecho ───────────────────────────────────────────────────────────────

const Fim: React.FC<{ seg: SegFim }> = ({ seg }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [4, 22], [0, 1], clamp);
  return (
    <MapaCena visual={OUTONO} escala="regiao" pontos={seg.pontos} modos={['trem']} janela={[0.05, 0.55]} chegarPerto={false}>
      {() => (
        <>
          <div style={{ position: 'absolute', top: SEGURO.topo, left: 0, right: 0, textAlign: 'center', opacity: a, fontFamily: SERIFA }}>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 14, color: C.carmim }}>日本の秋</div>
            <div style={{ fontSize: 86, fontWeight: 800, color: C.tinta, lineHeight: 1.05, marginTop: 8 }}>{seg.titulo}</div>
            {seg.sub ? <div style={{ fontSize: 32, fontWeight: 500, color: C.tintaSuave, marginTop: 12, fontStyle: 'italic' }}>{seg.sub} · outono de 2026</div> : null}
          </div>
          {seg.numeros ? (
            <div style={{ position: 'absolute', bottom: SEGURO.base + 20, left: SEGURO.esquerda, right: SEGURO.esquerda, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', fontFamily: SERIFA }}>
              {seg.numeros.map((n, i) => {
                const b = interpolate(f, [18 + i * 6, 30 + i * 6], [0, 1], clamp);
                return (
                  <div key={i} style={{ fontSize: 30, fontWeight: 700, color: C.tinta, background: 'rgba(247,239,220,0.9)', border: `2px solid ${C.carmim}`, borderRadius: 999, padding: '10px 24px', opacity: b, transform: `scale(${0.9 + 0.1 * b})` }}>
                    {n}
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      )}
    </MapaCena>
  );
};

// ─── o reel ──────────────────────────────────────────────────────────────

const Segm: React.FC<SegProps> = ({ s }) => {
  if (s.tipo === 'clipe') return <Clipe seg={s} />;
  if (s.tipo === 'fim') return <Fim seg={s} />;
  return (
    <MapaCena visual={OUTONO} escala={s.escala} pontos={s.pontos} modos={s.modos} contexto={s.contexto}>
      {({ kmAteAgora }) => (
        <>
          <Cabecalho quando={s.quando} titulo={s.titulo} />
          <Legenda modos={s.modos} texto={s.legenda} km={s.escala === 'globo' ? kmAteAgora : undefined} />
        </>
      )}
    </MapaCena>
  );
};

const FONTES = ['500 40px "Shippori Mincho"', '700 40px "Shippori Mincho"', '800 40px "Shippori Mincho"'];

export const ReelOutono: React.FC<Plano> = (plano) => {
  // rajada de folhas em toda troca entre mapa e vídeo
  const ini = inicios(plano);
  const rajadas = plano.segmentos.map((s, i) => (i > 0 && s.tipo !== plano.segmentos[i - 1].tipo ? ini[i] : -1)).filter((q) => q > 0);
  return <ReelPadrao plano={plano} fontes={FONTES} Segmento={Segm} fundo="#1a0d06" sobre={<Folhas quantas={8} rajadas={rajadas} />} />;
};

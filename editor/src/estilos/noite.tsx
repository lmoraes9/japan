/**
 * Estilo "noite": azul-marinho, rota vermelha brilhante, tipografia sem serifa.
 * Foi o primeiro protótipo.
 */
import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { IconeHtml, Selo } from '../icones.tsx';
import { MapaCena, fmtKm, type PinoProps, type PolaroidProps, type RotuloProps, type VisualMapa } from '../Mapa.tsx';
import { Midia, deitado } from '../Midia.tsx';
import type { Modo, Plano, SegClipe, SegFim } from '../plano.ts';
import { AREA, clamp } from '../rota.ts';
import { COR, FONTE, SEGURO, W } from '../tema.ts';
import { ReelPadrao, type SegProps } from './base.tsx';

// ─── mapa ────────────────────────────────────────────────────────────────

const Rotulo: React.FC<RotuloProps> = ({ x, y, p, aparece, cinza }) => {
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

export const Polaroid: React.FC<PolaroidProps & { papel?: string; tinta?: string; fonte?: string }> = ({ x, y, foto, legenda, f, fps, lado, papel = COR.papel, tinta = '#2a2a2a', fonte }) => {
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
        background: papel,
        borderRadius: 4,
        boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
        transform: `rotate(${lado * 5}deg) scale(${s})`,
        transformOrigin: lado > 0 ? 'bottom left' : 'bottom right',
      }}
    >
      <Img src={staticFile(foto)} style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }} />
      <div style={{ fontSize: 22, color: tinta, padding: '10px 2px 12px', fontWeight: 700, textAlign: 'center', fontFamily: fonte }}>{legenda}</div>
    </div>
  );
};

const Pino: React.FC<PinoProps> = ({ p, s }) => {
  const r = p.passagem ? 9 : 15;
  return (
    <g transform={`scale(${s})`}>
      <circle r={r + 10} fill={COR.rota} opacity={0.25} />
      <circle r={r} fill="#fff" stroke={COR.rota} strokeWidth={p.passagem ? 4 : 6} />
    </g>
  );
};

export const NOITE: VisualMapa = {
  fundo: `radial-gradient(ellipse at 50% 48%, ${COR.fundo2} 0%, ${COR.fundo} 70%)`,
  fonte: FONTE,
  globo: { mar: COR.mar, borda: 'rgba(255,255,255,0.12)', grade: 'rgba(255,255,255,0.05)', terra: COR.terra, terraBorda: COR.terraBorda, divisa: COR.divisa },
  terra: COR.terra,
  terraBorda: COR.terraBorda,
  divisa: COR.divisa,
  rota: { cor: COR.rota, largura: 7, brilho: true, futura: 'rgba(255,255,255,0.22)' },
  texturaLocal: 'url(#quadras)',
  defs: (
    <pattern id="quadras" width="46" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
      <path d="M0 0H46M0 0V46" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
    </pattern>
  ),
  Pino,
  Rotulo,
  Selo: ({ modo, x, y, giro }) => <Selo modo={modo} x={x} y={y} giro={giro} />,
  Polaroid,
};

export const Cabecalho: React.FC<{ quando?: string; titulo?: string }> = ({ quando, titulo }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [2, 16], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', top: SEGURO.topo, left: SEGURO.esquerda, right: SEGURO.esquerda, opacity: a, transform: `translateY(${(1 - a) * -20}px)` }}>
      {quando ? (
        <div style={{ display: 'inline-block', fontSize: 28, fontWeight: 700, letterSpacing: 3, color: COR.texto, border: '2px solid rgba(245,241,234,0.35)', borderRadius: 999, padding: '8px 22px', marginBottom: 18 }}>
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
    <div style={{ position: 'absolute', bottom: SEGURO.base + 20, left: SEGURO.esquerda, right: SEGURO.esquerda, display: 'flex', alignItems: 'center', gap: 18, opacity: a, transform: `translateY(${(1 - a) * 20}px)` }}>
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

// ─── clipe ───────────────────────────────────────────────────────────────

const Etiqueta: React.FC<{ nome: string; jp?: string; linha?: string }> = ({ nome, jp, linha }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [6, 20], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', top: SEGURO.topo, left: SEGURO.esquerda, paddingLeft: 22, borderLeft: `6px solid ${COR.rota}`, opacity: a, transform: `translateX(${(1 - a) * -30}px)`, textShadow: '0 2px 14px rgba(0,0,0,0.65)' }}>
      {jp ? <div style={{ fontSize: 30, fontWeight: 700, color: COR.rotaClara, letterSpacing: 4, marginBottom: 2 }}>{jp}</div> : null}
      <div style={{ fontSize: 56, fontWeight: 900, color: COR.texto, lineHeight: 1.05 }}>{nome}</div>
      {linha ? <div style={{ fontSize: 28, fontWeight: 500, color: COR.textoSuave, marginTop: 8 }}>{linha}</div> : null}
    </div>
  );
};

const Nota: React.FC<{ titulo?: string; texto: string }> = ({ titulo, texto }) => {
  const f = useCurrentFrame();
  const { durationInFrames: n, fps } = useVideoConfig();
  const entra = interpolate(f, [fps * 0.7, fps * 1.1], [0, 1], clamp);
  const sai = interpolate(f, [n - fps * 0.45, n - fps * 0.1], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: SEGURO.esquerda,
        right: SEGURO.direita,
        bottom: SEGURO.base + 10,
        padding: '22px 28px 24px',
        borderRadius: 22,
        background: 'rgba(8,12,20,0.52)',
        backdropFilter: 'blur(14px)',
        borderLeft: `5px solid ${COR.rota}`,
        opacity: entra * sai,
        transform: `translateY(${(1 - entra) * 24}px)`,
      }}
    >
      <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: 4, color: COR.rotaClara, marginBottom: 8 }}>
        HISTÓRIA{titulo ? <span style={{ color: COR.textoSuave, letterSpacing: 1, marginLeft: 12 }}>· {titulo}</span> : null}
      </div>
      <div style={{ fontSize: 32, fontWeight: 500, color: COR.texto, lineHeight: 1.38 }}>{texto}</div>
    </div>
  );
};

/** vídeo em tela cheia; se for deitado, com fundo desfocado */
export const MidiaCheia: React.FC<{ seg: SegClipe; filtro?: string }> = ({ seg, filtro }) => {
  const d = deitado(seg);
  return (
    <AbsoluteFill style={{ filter: filtro }}>
      {d ? (
        <AbsoluteFill style={{ filter: 'blur(40px) brightness(0.6)', transform: 'scale(1.2)' }}>
          <Midia seg={seg} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill>
        <Midia seg={seg} style={{ objectFit: d ? 'contain' : 'cover' }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Clipe: React.FC<{ seg: SegClipe }> = ({ seg }) => (
  <AbsoluteFill style={{ background: '#000', fontFamily: FONTE }}>
    <MidiaCheia seg={seg} />
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.55) 100%)' }} />
    {seg.lugar ? <Etiqueta {...seg.lugar} /> : null}
    {seg.nota ? <Nota {...seg.nota} /> : null}
  </AbsoluteFill>
);

// ─── fecho ───────────────────────────────────────────────────────────────

const Fim: React.FC<{ seg: SegFim }> = ({ seg }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [4, 20], [0, 1], clamp);
  return (
    <MapaCena visual={NOITE} escala="regiao" pontos={seg.pontos} modos={['trem']} janela={[0.05, 0.55]} chegarPerto={false}>
      {() => (
        <>
          <div style={{ position: 'absolute', top: SEGURO.topo, left: 0, right: 0, textAlign: 'center', opacity: a }}>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 12, color: COR.rotaClara }}>日本 2026</div>
            <div style={{ fontSize: 84, fontWeight: 900, color: COR.texto, lineHeight: 1.05, marginTop: 6 }}>{seg.titulo}</div>
            {seg.sub ? <div style={{ fontSize: 32, fontWeight: 500, color: COR.textoSuave, marginTop: 12 }}>{seg.sub}</div> : null}
          </div>
          {seg.numeros ? (
            <div style={{ position: 'absolute', bottom: SEGURO.base + 20, left: SEGURO.esquerda, right: SEGURO.esquerda, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              {seg.numeros.map((n, i) => {
                const b = interpolate(f, [18 + i * 6, 30 + i * 6], [0, 1], clamp);
                return (
                  <div key={i} style={{ fontSize: 30, fontWeight: 700, color: COR.texto, background: 'rgba(255,90,54,0.18)', border: `2px solid ${COR.rota}`, borderRadius: 999, padding: '10px 24px', opacity: b, transform: `scale(${0.9 + 0.1 * b})` }}>
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
    <MapaCena visual={NOITE} escala={s.escala} pontos={s.pontos} modos={s.modos} contexto={s.contexto}>
      {({ kmAteAgora }) => (
        <>
          <Cabecalho quando={s.quando} titulo={s.titulo} />
          <Legenda modos={s.modos} texto={s.legenda} km={s.escala === 'globo' ? kmAteAgora : undefined} />
        </>
      )}
    </MapaCena>
  );
};

const FONTES = ['500 40px "Zen Kaku Gothic New"', '700 40px "Zen Kaku Gothic New"', '900 40px "Zen Kaku Gothic New"'];

export const ReelNoite: React.FC<Plano> = (plano) => <ReelPadrao plano={plano} fontes={FONTES} Segmento={Segm} />;

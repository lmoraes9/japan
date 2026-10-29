/**
 * Um trecho de vídeo (ou uma foto) com a etiqueta do lugar em cima e, quando
 * o lugar tem história, uma notinha discreta embaixo, dentro da área que o
 * Instagram não cobre.
 */
import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FPS, type SegClipe } from './plano.ts';
import { COR, FONTE, SEGURO } from './tema.ts';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const Etiqueta: React.FC<{ nome: string; jp?: string; linha?: string }> = ({ nome, jp, linha }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [6, 20], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        top: SEGURO.topo,
        left: SEGURO.esquerda,
        paddingLeft: 22,
        borderLeft: `6px solid ${COR.rota}`,
        opacity: a,
        transform: `translateX(${(1 - a) * -30}px)`,
        textShadow: '0 2px 14px rgba(0,0,0,0.65)',
      }}
    >
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
        WebkitBackdropFilter: 'blur(14px)',
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

export const Clipe: React.FC<{ seg: SegClipe }> = ({ seg }) => {
  const f = useCurrentFrame();
  const { durationInFrames: n } = useVideoConfig();
  const src = staticFile(seg.arquivo);
  const foto = seg.de === undefined;
  const deitado = (seg.largura ?? 9) > (seg.altura ?? 16);
  // foto parada ganha um zoom lento (Ken Burns)
  const kb = foto ? interpolate(f, [0, n], [1.0, 1.08]) : 1;
  const midia = (estilo: React.CSSProperties) =>
    foto ? (
      <Img src={src} style={{ width: '100%', height: '100%', ...estilo }} />
    ) : (
      <OffthreadVideo src={src} trimBefore={Math.round((seg.de ?? 0) * FPS)} volume={seg.volume ?? 1} style={{ width: '100%', height: '100%', ...estilo }} />
    );

  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONTE }}>
      {deitado ? <AbsoluteFill style={{ filter: 'blur(40px) brightness(0.6)', transform: 'scale(1.2)' }}>{midia({ objectFit: 'cover' })}</AbsoluteFill> : null}
      <AbsoluteFill style={{ transform: `scale(${kb})` }}>{midia({ objectFit: deitado ? 'contain' : 'cover' })}</AbsoluteFill>
      {/* sombras em cima e embaixo, para o texto ler em qualquer imagem */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.55) 100%)' }} />
      {seg.lugar ? <Etiqueta {...seg.lugar} /> : null}
      {seg.nota ? <Nota {...seg.nota} /> : null}
    </AbsoluteFill>
  );
};

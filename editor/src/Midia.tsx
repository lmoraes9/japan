/** O vídeo (cortado no trecho do plano) ou a foto (com zoom lento) de um clipe. */
import React from 'react';
import { Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { FPS, type SegClipe } from './plano.ts';

export const Midia: React.FC<{ seg: SegClipe; style?: React.CSSProperties; kenBurns?: boolean }> = ({ seg, style, kenBurns = true }) => {
  const f = useCurrentFrame();
  const { durationInFrames: n } = useVideoConfig();
  const src = staticFile(seg.arquivo);
  const css: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', ...style };
  if (seg.de === undefined) {
    const kb = kenBurns ? interpolate(f, [0, n], [1.0, 1.08]) : 1;
    return <Img src={src} style={{ ...css, transform: `${css.transform ?? ''} scale(${kb})` }} />;
  }
  return <OffthreadVideo src={src} trimBefore={Math.round(seg.de * FPS)} volume={seg.volume ?? 1} style={css} />;
};

/** true quando a mídia é mais larga que alta (vai precisar de fundo desfocado ou moldura) */
export const deitado = (seg: SegClipe) => (seg.largura ?? 9) > (seg.altura ?? 16);

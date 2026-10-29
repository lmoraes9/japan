/** Peças comuns aos estilos: carregar fontes e encadear os segmentos com transições. */
import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Audio, continueRender, delayRender, staticFile } from 'remotion';
import { TransitionSeries, linearTiming, type TransitionPresentation } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { TRANSICAO, quadrosDe, type Plano, type Segmento } from '../plano.ts';

/**
 * Segura a renderização até as fontes carregarem, com os caracteres que o plano
 * usa (as fontes japonesas vêm fatiadas por faixa de caracteres).
 * `fontes`: descrições CSS, ex. '700 40px "Shippori Mincho"'.
 */
export function useFontes(plano: Plano, fontes: string[]) {
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const texto = JSON.stringify(plano) + 'km0123456789·→←ABCDEFGHIJKLMNOPQRSTUVWXYZ次は終点発車番線行旅日本紅葉秋';
    Promise.all(fontes.map((f) => document.fonts.load(f, texto)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(h));
  }, [h, plano, fontes]);
}

export interface SegProps {
  s: Segmento;
  i: number;
  plano: Plano;
}

export const ReelPadrao: React.FC<{
  plano: Plano;
  fontes: string[];
  Segmento: React.FC<SegProps>;
  transicao?: (de: Segmento, para: Segmento) => TransitionPresentation<Record<string, unknown>>;
  fundo?: string;
  /** camada por cima do vídeo inteiro (folhas caindo, grão de papel) */
  sobre?: React.ReactNode;
}> = ({ plano, fontes, Segmento, transicao, fundo = '#000', sobre }) => {
  useFontes(plano, fontes);
  return (
    <AbsoluteFill style={{ background: fundo }}>
      <TransitionSeries>
        {plano.segmentos.flatMap((s, i) => [
          ...(i > 0
            ? [
                <TransitionSeries.Transition
                  key={`t${i}`}
                  presentation={transicao ? transicao(plano.segmentos[i - 1], s) : (fade() as TransitionPresentation<Record<string, unknown>>)}
                  timing={linearTiming({ durationInFrames: TRANSICAO })}
                />,
              ]
            : []),
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={quadrosDe(s)}>
            <Segmento s={s} i={i} plano={plano} />
          </TransitionSeries.Sequence>,
        ])}
      </TransitionSeries>
      {sobre}
      {plano.trilha ? <Audio src={staticFile(plano.trilha)} volume={0.8} /> : null}
    </AbsoluteFill>
  );
};

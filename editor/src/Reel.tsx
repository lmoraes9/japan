import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Audio, continueRender, delayRender, staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { Clipe } from './Clipe.tsx';
import { Fim } from './Fim.tsx';
import { Cabecalho, Legenda, MapaCena } from './Mapa.tsx';
import { TRANSICAO, quadrosDe, type Plano, type Segmento } from './plano.ts';
import { FONTE } from './tema.ts';

/** segura a renderização até as fontes (com os caracteres japoneses) carregarem */
function useFontes(plano: Plano) {
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const texto = JSON.stringify(plano) + 'km0123456789·→';
    Promise.all([500, 700, 900].map((w) => document.fonts.load(`${w} 40px "Zen Kaku Gothic New"`, texto)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(h));
  }, [h, plano]);
}

const Segm: React.FC<{ s: Segmento }> = ({ s }) => {
  if (s.tipo === 'clipe') return <Clipe seg={s} />;
  if (s.tipo === 'fim') return <Fim seg={s} />;
  return (
    <MapaCena escala={s.escala} pontos={s.pontos} modos={s.modos} contexto={s.contexto}>
      {({ kmAteAgora }) => (
        <>
          <Cabecalho quando={s.quando} titulo={s.titulo} />
          <Legenda modos={s.modos} texto={s.legenda} km={s.escala === 'globo' ? kmAteAgora : undefined} />
        </>
      )}
    </MapaCena>
  );
};

export const Reel: React.FC<Plano> = (plano) => {
  useFontes(plano);
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONTE }}>
      <TransitionSeries>
        {plano.segmentos.flatMap((s, i) => [
          ...(i > 0 ? [<TransitionSeries.Transition key={`t${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: TRANSICAO })} />] : []),
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={quadrosDe(s)}>
            <Segm s={s} />
          </TransitionSeries.Sequence>,
        ])}
      </TransitionSeries>
      {plano.trilha ? <Audio src={staticFile(plano.trilha)} volume={0.8} /> : null}
    </AbsoluteFill>
  );
};

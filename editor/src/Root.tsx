import React from 'react';
import { Composition } from 'remotion';
import { Reel } from './Reel.tsx';
import { FPS, duracaoTotal, type Plano } from './plano.ts';
import { exemplo } from './exemplo.ts';

export const Root: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel as unknown as React.FC<Record<string, unknown>>}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={1}
    defaultProps={exemplo as unknown as Record<string, unknown>}
    calculateMetadata={({ props }) => ({ durationInFrames: duracaoTotal(props as unknown as Plano) })}
  />
);

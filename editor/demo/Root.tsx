import React from 'react';
import { Composition, Still } from 'remotion';
import { Aeroporto, Akihabara, Domo, Miyajima, Okonomiyaki, Sensoji, Yokocho } from './cenas.tsx';

const v = { width: 1080, height: 1920, fps: 30 };

export const DemoRoot: React.FC = () => (
  <>
    <Still id="aeroporto-gru" component={Aeroporto} defaultProps={{ variante: 'gru' as const }} width={1080} height={1920} />
    <Still id="aeroporto-jfk" component={Aeroporto} defaultProps={{ variante: 'jfk' as const }} width={1080} height={1920} />
    <Still id="okonomiyaki" component={Okonomiyaki} width={1080} height={1920} />
    <Composition id="yokocho" component={Yokocho} durationInFrames={7 * 30} {...v} />
    <Composition id="sensoji" component={Sensoji} durationInFrames={8 * 30} {...v} />
    <Composition id="akihabara" component={Akihabara} durationInFrames={6 * 30} {...v} />
    <Composition id="domo" component={Domo} durationInFrames={8 * 30} {...v} />
    <Composition id="miyajima" component={Miyajima} durationInFrames={8 * 30} {...v} />
  </>
);

/**
 * "Preparando o Natal": edit avulso, sem nada da viagem. Cartão vermelho com moldura creme,
 * letra de mão, neve caindo devagar. Fotos e vídeos em pé ocupam a moldura inteira; os deitados
 * viram uma polaroid inclinada sobre a própria imagem desfocada.
 *
 *   npm run natal -- trabalho/natal.json [--previa]
 */
import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { TransitionSeries, linearTiming, type TransitionPresentation } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import '@fontsource/caveat/500.css';
import '@fontsource/caveat/700.css';
import '@fontsource/shippori-mincho/500.css';
import '@fontsource/shippori-mincho/800.css';

export const FPS_NATAL = 30;
const TRANS = 12;
const INTRO = 2.6;
const FIM = 2.8;

export type ItemNatal = {
  arquivo: string;
  /** vídeo: segundo onde começa o trecho; foto: ausente */
  de?: number;
  dur: number;
  largura?: number;
  altura?: number;
  legenda?: string;
  volume?: number;
};
export type PlanoNatal = { titulo: string; subtitulo?: string; fim?: string; itens: ItemNatal[]; trilha?: string; /** segundo da música onde o vídeo começa */ trilhaDe?: number; /** segundos do cartão de abertura e do de fim */ intro?: number; fimDur?: number };

const VERMELHO = '#7d1622';
const CREME = '#f6ecd9';
const OURO = '#d9b26a';
const MOLDURA = 34;

export const duracaoNatal = (p: PlanoNatal) =>
  Math.round((p.intro ?? INTRO) * FPS_NATAL) + p.itens.reduce((s, i) => s + Math.round(i.dur * FPS_NATAL), 0) + Math.round((p.fimDur ?? FIM) * FPS_NATAL) - TRANS * (p.itens.length + 1);

const Neve: React.FC<{ n?: number }> = ({ n = 46 }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: n }, (_, k) => {
        const r = random(`neve${k}`);
        const v = 0.6 + random(`v${k}`) * 1.4;
        const tam = 3 + random(`t${k}`) * 7;
        const y = ((r * height + f * v * 2.2) % (height + 40)) - 20;
        const x = random(`x${k}`) * width + Math.sin(f / (40 + k) + k) * 18;
        return <div key={k} style={{ position: 'absolute', left: x, top: y, width: tam, height: tam, borderRadius: '50%', background: CREME, opacity: 0.35 + random(`o${k}`) * 0.4, filter: tam > 7 ? 'blur(1.5px)' : undefined }} />;
      })}
    </AbsoluteFill>
  );
};

const Midia: React.FC<{ item: ItemNatal; style?: React.CSSProperties }> = ({ item, style }) => {
  const f = useCurrentFrame();
  const { durationInFrames: n } = useVideoConfig();
  const css: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', ...style };
  const src = staticFile(item.arquivo);
  if (item.de === undefined) {
    const kb = interpolate(f, [0, n], [1.02, 1.1]);
    return <Img src={src} style={{ ...css, transform: `scale(${kb})` }} />;
  }
  return <OffthreadVideo src={src} trimBefore={Math.round(item.de * FPS_NATAL)} volume={item.volume ?? 0} style={css} />;
};

const Legenda: React.FC<{ texto: string; naPolaroid?: boolean }> = ({ texto, naPolaroid }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [8, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(f, [8, 22], [14, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: naPolaroid ? 14 : 150, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${y}px)` }}>
      <div style={{ fontFamily: 'Caveat', fontWeight: 700, fontSize: naPolaroid ? 72 : 84, color: naPolaroid ? VERMELHO : CREME, textShadow: naPolaroid ? undefined : '0 3px 18px rgba(0,0,0,.55)', transform: 'rotate(-2deg)' }}>{texto}</div>
    </div>
  );
};

const Cena: React.FC<{ item: ItemNatal }> = ({ item }) => {
  const deitado = (item.largura ?? 9) > (item.altura ?? 16);
  return (
    <AbsoluteFill style={{ background: VERMELHO }}>
      {deitado ? (
        <>
          <AbsoluteFill style={{ filter: 'blur(40px) brightness(.55)', transform: 'scale(1.2)' }}>
            <Midia item={item} />
          </AbsoluteFill>
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'relative', background: CREME, padding: '26px 26px 120px', transform: 'rotate(-2.5deg)', boxShadow: '0 30px 60px rgba(0,0,0,.45)', width: 960 }}>
              <div style={{ width: 908, height: 908 * ((item.altura ?? 9) / (item.largura ?? 16)), overflow: 'hidden' }}>
                <Midia item={item} />
              </div>
              {item.legenda && <Legenda texto={item.legenda} naPolaroid />}
            </div>
          </AbsoluteFill>
        </>
      ) : (
        <AbsoluteFill style={{ padding: MOLDURA, background: CREME }}>
          <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 26, position: 'relative' }}>
            <Midia item={item} style={{ filter: 'saturate(1.06) contrast(1.03)' }} />
            <AbsoluteFill style={{ background: 'linear-gradient(to top, rgba(40,6,10,.55), rgba(40,6,10,0) 35%)' }} />
          </div>
        </AbsoluteFill>
      )}
      {item.legenda && !deitado && <Legenda texto={item.legenda} />}
    </AbsoluteFill>
  );
};

const Estrela: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg width={size} height={size} viewBox="-10 -10 20 20" style={style}>
    <path d="M0,-10 L2.2,-2.2 L10,0 L2.2,2.2 L0,10 L-2.2,2.2 L-10,0 L-2.2,-2.2 Z" fill={OURO} />
  </svg>
);

const Cartao: React.FC<{ grande: string; pequeno?: string; serif?: boolean }> = ({ grande, pequeno, serif }) => {
  const f = useCurrentFrame();
  const o = (a: number) => interpolate(f, [a, a + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = (a: number) => interpolate(f, [a, a + 20], [24, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, #9a2230 0%, ${VERMELHO} 55%, #4e0c14 100%)`, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{ border: `3px solid ${OURO}`, margin: 46, borderRadius: 30, opacity: 0.55 }} />
      <div style={{ textAlign: 'center', color: CREME, padding: '0 90px' }}>
        <Estrela size={70} style={{ opacity: o(0), transform: `rotate(${f * 0.6}deg)` }} />
        <div
          style={{
            fontFamily: serif ? 'Shippori Mincho' : 'Caveat',
            fontWeight: serif ? 800 : 700,
            fontSize: serif ? 118 : 190,
            lineHeight: serif ? 1.12 : 1,
            letterSpacing: serif ? -1 : 0,
            marginTop: 30,
            whiteSpace: 'pre-line',
            opacity: o(4),
            transform: `translateY(${y(4)}px)`,
          }}
        >
          {grande}
        </div>
        {pequeno && <div style={{ fontFamily: 'Caveat', fontWeight: 500, fontSize: 76, color: OURO, marginTop: 34, opacity: o(14), transform: `translateY(${y(14)}px)` }}>{pequeno}</div>}
      </div>
    </AbsoluteFill>
  );
};

export const Natal: React.FC<PlanoNatal> = (p) => {
  const fade_ = fade() as TransitionPresentation<Record<string, unknown>>;
  const t = linearTiming({ durationInFrames: TRANS });
  return (
    <AbsoluteFill style={{ background: VERMELHO }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={Math.round((p.intro ?? INTRO) * FPS_NATAL)}>
          <Cartao grande={p.titulo} pequeno={p.subtitulo} serif />
        </TransitionSeries.Sequence>
        {p.itens.flatMap((item, i) => [
          <TransitionSeries.Transition key={`t${i}`} presentation={fade_} timing={t} />,
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={Math.round(item.dur * FPS_NATAL)}>
            <Cena item={item} />
          </TransitionSeries.Sequence>,
        ])}
        <TransitionSeries.Transition presentation={fade_} timing={t} />
        <TransitionSeries.Sequence durationInFrames={Math.round((p.fimDur ?? FIM) * FPS_NATAL)}>
          <Cartao grande={p.fim ?? 'Feliz Natal'} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Neve />
      {p.trilha && (
        <Sequence>
          <AudioTrilha src={p.trilha} de={p.trilhaDe ?? 0} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

const AudioTrilha: React.FC<{ src: string; de: number }> = ({ src, de }) => {
  const { durationInFrames: n } = useVideoConfig();
  return <Audio src={staticFile(src)} trimBefore={Math.round(de * FPS_NATAL)} volume={(f) => interpolate(f, [0, 15, n - 45, n], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />;
};

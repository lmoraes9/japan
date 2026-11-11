/**
 * Edit avulso de Natal, sem nada da viagem. Linguagem de Reels de decoração atual: tela cheia,
 * cortes secos na batida, um "punch" curto de zoom em cada corte, cor única e suave em tudo,
 * texto pequeno em minúsculas (palavra por palavra) e o horário de cada etapa num selo discreto.
 * Abre com o resultado (gancho) e segura a revelação no fim.
 *
 *   npm run natal -- trabalho/natal.json [--previa]
 */
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Series, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';

export const FPS_NATAL = 30;

export type ItemNatal = {
  arquivo: string;
  /** vídeo: segundo onde começa o trecho; foto: ausente */
  de?: number;
  /** quadros */
  q: number;
  legenda?: string;
  /** selo pequeno acima da legenda, ex. "10:20" */
  hora?: string;
  volume?: number;
};
export type PlanoNatal = {
  /** texto grande sobre a primeira cena (o gancho) */
  titulo?: string;
  subtitulo?: string;
  /** texto sobre a última cena */
  fim?: string;
  itens: ItemNatal[];
  trilha?: string;
  /** segundo da música onde o vídeo começa */
  trilhaDe?: number;
};

export const duracaoNatal = (p: PlanoNatal) => Math.max(1, p.itens.reduce((s, i) => s + i.q, 0));

const GRADE = 'contrast(1.07) saturate(0.9) sepia(0.07) brightness(1.02)';
const sai = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

const Cena: React.FC<{ item: ItemNatal }> = ({ item }) => {
  const f = useCurrentFrame();
  const { durationInFrames: n } = useVideoConfig();
  // zoom lento + punch de entrada (começa 6% mais perto e assenta em 5 quadros)
  const escala = interpolate(f, [0, n], [1.0, 1.045]) + 0.06 * (1 - sai(f, 0, 5));
  const css: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', filter: GRADE, transform: `scale(${escala})` };
  const src = staticFile(item.arquivo);
  return (
    <AbsoluteFill style={{ background: '#000', overflow: 'hidden' }}>
      {item.de === undefined ? <Img src={src} style={css} /> : <OffthreadVideo src={src} trimBefore={Math.round(item.de * FPS_NATAL)} volume={item.volume ?? 0} style={css} />}
      {/* vinheta leve e um véu escuro no alto, onde fica o texto */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 55%, rgba(0,0,0,.28) 100%)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,.46), rgba(0,0,0,.18) 18%, rgba(0,0,0,0) 34%)' }} />
    </AbsoluteFill>
  );
};

/** palavras entram uma a uma, subindo 12 px */
const Palavras: React.FC<{ texto: string; tam: number; peso: number; atraso?: number }> = ({ texto, tam, peso, atraso = 0 }) => {
  const f = useCurrentFrame();
  const linhas = texto.split('\n');
  let k = 0;
  return (
    <div style={{ fontFamily: 'Inter', fontWeight: peso, fontSize: tam, lineHeight: 1.12, letterSpacing: '-0.025em', color: '#fff', textAlign: 'center', textShadow: '0 1px 3px rgba(0,0,0,.45), 0 2px 18px rgba(0,0,0,.4)' }}>
      {linhas.map((l, i) => (
        <div key={i}>
          {l.split(' ').map((w, j) => {
            const a = atraso + 2 * k++;
            return (
              <span key={j} style={{ display: 'inline-block', opacity: sai(f, a, a + 6), transform: `translateY(${12 * (1 - sai(f, a, a + 8))}px)`, marginRight: '0.26em' }}>
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Selo: React.FC<{ texto: string }> = ({ texto }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'inline-block', opacity: sai(f, 0, 5), padding: '8px 20px', borderRadius: 40, background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,.35)', color: '#fff', fontFamily: 'Inter', fontWeight: 600, fontSize: 30, letterSpacing: '0.04em', fontVariantNumeric: 'tabular-nums', marginBottom: 22 }}>
      {texto}
    </div>
  );
};

/** texto na faixa segura do Reels: abaixo da barra do topo, longe dos botões de baixo e da direita */
const Texto: React.FC<{ item: ItemNatal; titulo?: string; subtitulo?: string; fim?: string }> = ({ item, titulo, subtitulo, fim }) => {
  if (!item.legenda && !item.hora && !titulo && !fim) return null;
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: titulo || fim ? 300 : 250, paddingLeft: 90, paddingRight: 120 }}>
      {item.hora && <Selo texto={item.hora} />}
      {subtitulo && (
        <div style={{ marginBottom: 18 }}>
          <Palavras texto={subtitulo} tam={30} peso={600} />
        </div>
      )}
      {(titulo || fim) && <Palavras texto={(titulo ?? fim)!} tam={74} peso={600} atraso={titulo ? 3 : 4} />}
      {item.legenda && <Palavras texto={item.legenda} tam={52} peso={600} atraso={item.hora ? 3 : 0} />}
    </AbsoluteFill>
  );
};

export const Natal: React.FC<PlanoNatal> = (p) => {
  const n = duracaoNatal(p);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Series>
        {p.itens.map((item, i) => (
          <Series.Sequence key={i} durationInFrames={item.q}>
            <Cena item={item} />
            <Texto item={item} titulo={i === 0 ? p.titulo : undefined} subtitulo={i === 0 ? p.subtitulo : undefined} fim={i === p.itens.length - 1 ? p.fim : undefined} />
          </Series.Sequence>
        ))}
      </Series>
      {p.trilha && (
        <Audio
          src={staticFile(p.trilha)}
          trimBefore={Math.round((p.trilhaDe ?? 0) * FPS_NATAL)}
          volume={(f) => interpolate(f, [0, 4, n - 40, n], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        />
      )}
    </AbsoluteFill>
  );
};

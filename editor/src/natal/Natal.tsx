/**
 * Edit avulso de Natal, sem nada da viagem. Segue um Reel de "receber em casa" que a Pri gosta:
 * cortes secos em cenas reais (sem timelapse), muito close de mão trabalhando, um empurrão lento
 * de câmera, cor dourada e quente em tudo. Texto só na abertura (serifa em caixa alta, em
 * escada, e uma linha cursiva embaixo) e no fim. Fecha com a mesa pronta, inclusive em tela
 * dividida (duas cenas empilhadas).
 *
 *   npm run natal -- trabalho/natal.json [--previa]
 */
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Series, interpolate, staticFile, useCurrentFrame } from 'remotion';
import '@fontsource/bodoni-moda/500.css';
import '@fontsource/sacramento/400.css';

export const FPS_NATAL = 30;

type Midia = {
  arquivo: string;
  /** vídeo: segundo onde começa o trecho; foto: ausente */
  de?: number;
};
export type ItemNatal = Midia & {
  /** quadros */
  q: number;
  /** tela dividida: esta cena vai para a metade de baixo */
  abaixo?: Midia;
};
export type PlanoNatal = {
  /** serifa em caixa alta sobre a primeira cena; cada linha entra deslocada (em escada) */
  titulo?: string;
  /** linha cursiva abaixo do título */
  subtitulo?: string;
  /** linha cursiva sobre a última cena */
  fim?: string;
  itens: ItemNatal[];
  trilha?: string;
  /** segundo da música onde o vídeo começa */
  trilhaDe?: number;
};

export const duracaoNatal = (p: PlanoNatal) => Math.max(1, p.itens.reduce((s, i) => s + i.q, 0));

/** dourado quente da referência: verdes e amarelos ricos, preto levemente aberto */
const GRADE = 'sepia(0.24) saturate(1.25) contrast(1.08) brightness(1.02) hue-rotate(-4deg)';
const CREME = '#FFF2C9';
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const sai = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

const Quadro: React.FC<{ m: Midia; q: number }> = ({ m, q }) => {
  const f = useCurrentFrame();
  const escala = interpolate(f, [0, q], [1.0, 1.04]);
  const css: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', filter: GRADE, transform: `scale(${escala})` };
  const src = staticFile(m.arquivo);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {m.de === undefined ? <Img src={src} style={css} /> : <OffthreadVideo src={src} trimBefore={Math.round(m.de * FPS_NATAL)} muted style={css} />}
    </AbsoluteFill>
  );
};

const Cena: React.FC<{ item: ItemNatal }> = ({ item }) => (
  <AbsoluteFill style={{ background: '#000' }}>
    {item.abaixo ? (
      <>
        <div style={{ position: 'absolute', inset: '0 0 50% 0' }}>
          <Quadro m={item} q={item.q} />
        </div>
        <div style={{ position: 'absolute', inset: '50% 0 0 0' }}>
          <Quadro m={item.abaixo} q={item.q} />
        </div>
      </>
    ) : (
      <Quadro m={item} q={item.q} />
    )}
    {/* calor por cima e vinheta bem leve */}
    <AbsoluteFill style={{ background: 'rgba(255,170,70,.16)', mixBlendMode: 'soft-light' }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,.22) 100%)' }} />
  </AbsoluteFill>
);

const sombra = '0 2px 14px rgba(60,30,0,.45), 0 1px 2px rgba(0,0,0,.35)';

const Cursiva: React.FC<{ texto: string; atraso: number; tam: number }> = ({ texto, atraso, tam }) => {
  const f = useCurrentFrame();
  // "escreve" da esquerda para a direita
  const r = sai(f, atraso, atraso + 22);
  return (
    <div
      style={{
        fontFamily: 'Sacramento',
        fontSize: tam,
        lineHeight: 1.1,
        color: CREME,
        textShadow: sombra,
        textAlign: 'center',
        marginTop: 6,
        clipPath: `inset(-20% ${100 - r * 100}% -20% 0)`,
      }}
    >
      {texto}
    </div>
  );
};

/** abertura: linhas em serifa entrando em escada + cursiva; some antes do corte */
const Titulo: React.FC<{ titulo: string; subtitulo?: string; q: number }> = ({ titulo, subtitulo, q }) => {
  const f = useCurrentFrame();
  const linhas = titulo.split('\n');
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 140, opacity: 1 - sai(f, q - 10, q - 2) }}>
      <div style={{ width: 760 }}>
        {linhas.map((l, i) => {
          const a = 4 + 7 * i;
          return (
            <div
              key={i}
              style={{
                fontFamily: 'Bodoni Moda',
                fontWeight: 500,
                fontSize: 104,
                lineHeight: 0.98,
                letterSpacing: '-0.01em',
                color: CREME,
                textShadow: sombra,
                textAlign: i % 2 ? 'right' : 'left',
                opacity: sai(f, a, a + 12),
                transform: `translateY(${16 * (1 - sai(f, a, a + 16))}px)`,
              }}
            >
              {l}
            </div>
          );
        })}
        {subtitulo && <Cursiva texto={subtitulo} atraso={4 + 7 * linhas.length + 4} tam={118} />}
      </div>
    </AbsoluteFill>
  );
};

export const Natal: React.FC<PlanoNatal> = (p) => {
  const n = duracaoNatal(p);
  const ultimo = p.itens.length - 1;
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Series>
        {p.itens.map((item, i) => (
          <Series.Sequence key={i} durationInFrames={item.q}>
            <Cena item={item} />
            {i === 0 && p.titulo && <Titulo titulo={p.titulo} subtitulo={p.subtitulo} q={item.q} />}
            {i === ultimo && p.fim && (
              <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 140 }}>
                <Cursiva texto={p.fim} atraso={8} tam={130} />
              </AbsoluteFill>
            )}
          </Series.Sequence>
        ))}
      </Series>
      {p.trilha && (
        <Audio
          src={staticFile(p.trilha)}
          trimBefore={Math.round((p.trilhaDe ?? 0) * FPS_NATAL)}
          volume={(f) => interpolate(f, [0, 4, n - 40, n], [0, 1, 1, 0], clamp)}
        />
      )}
    </AbsoluteFill>
  );
};

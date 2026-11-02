/**
 * Temas do globinho: o mesmo vídeo (globo, trajetos, notas) com cara de música
 * diferente. `plano.tema`; sem tema é o outono de sempre, com folhas de bordo.
 */
import '@fontsource/shippori-mincho/500.css';
import '@fontsource/shippori-mincho/700.css';
import '@fontsource/shippori-mincho/800.css';
import '@fontsource/zen-kaku-gothic-new/500.css';
import '@fontsource/zen-kaku-gothic-new/700.css';
import '@fontsource/zen-kaku-gothic-new/900.css';
import '@fontsource/zen-maru-gothic/500.css';
import '@fontsource/zen-maru-gothic/700.css';
import '@fontsource/zen-maru-gothic/900.css';
import '@fontsource/klee-one/400.css';
import '@fontsource/klee-one/600.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/900.css';
import React, { createContext, useContext } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { H, W } from '../tema.ts';
import type { NomeTema } from '../plano.ts';
import { Folhas } from './folhas.tsx';

export interface Tema {
  fonte: string;
  /** para segurar o render até carregar: '700 40px "Fonte"' */
  fontes: string[];
  /** títulos em caixa alta, com espaço entre as letras */
  caixaAlta?: boolean;
  /** rota, pontos, rótulo da nota */
  carmim: string;
  creme: string;
  cremeSuave: string;
  /** a linha de cima do texto (japonês, transporte) */
  ambar: string;
  terra: string;
  costa: string;
  divisa: string;
  marCentro: string;
  marBorda: string;
  halo: string;
  ruaPequena: string;
  ruaGrandeBorda: string;
  ruaGrande: string;
  trilho: string;
  /** filtro de cor das fotos */
  grade: string;
  /** cor (r,g,b) das sombras e do escurecido atrás do globo */
  sombra: string;
  fundo: string;
  notaFundo: string;
  notaTexto: string;
  /** véu de cor por cima das fotos (pôr do sol, vinheta) */
  veu?: string;
  particulas: 'folhas' | 'brilhos' | 'nada';
  corBrilho?: string;
  /** o selo em japonês em cima do título do fecho */
  selo: string;
}

const mincho = '"Shippori Mincho", "Hiragino Mincho ProN", serif';
const FONTES_MINCHO = ['500 40px "Shippori Mincho"', '700 40px "Shippori Mincho"', '800 40px "Shippori Mincho"'];

export const TEMAS: Record<NomeTema, Tema> = {
  outono: {
    fonte: mincho,
    fontes: FONTES_MINCHO,
    carmim: '#c8321f',
    creme: '#fff6e6',
    cremeSuave: 'rgba(255,246,230,0.82)',
    ambar: '#ffc98a',
    terra: '#f4ead6',
    costa: '#a9876a',
    divisa: 'rgba(169,135,106,0.35)',
    marCentro: '#2f6f8f',
    marBorda: '#0d2b40',
    halo: '#ffe3b8',
    ruaPequena: 'rgba(150,115,85,0.8)',
    ruaGrandeBorda: '#fffaf0',
    ruaGrande: '#c99a62',
    trilho: '#5a4636',
    grade: 'sepia(0.18) saturate(1.22) contrast(1.04) brightness(1.02)',
    sombra: '25,10,2',
    fundo: '#1a0d06',
    notaFundo: 'rgba(250,243,228,0.9)',
    notaTexto: '#3a2416',
    particulas: 'folhas',
    selo: '日本の秋',
  },
  // city pop dos anos 80: pôr do sol rosa, mar de piscina, gótica arredondada
  citypop: {
    fonte: '"Zen Maru Gothic", sans-serif',
    fontes: ['500 40px "Zen Maru Gothic"', '700 40px "Zen Maru Gothic"', '900 40px "Zen Maru Gothic"'],
    carmim: '#ff4f86',
    creme: '#fffaf3',
    cremeSuave: 'rgba(255,250,243,0.86)',
    ambar: '#ffd37a',
    terra: '#fff1e2',
    costa: '#e9939f',
    divisa: 'rgba(233,147,159,0.4)',
    marCentro: '#4cc6dc',
    marBorda: '#1c4f8a',
    halo: '#ffc2d6',
    ruaPequena: 'rgba(214,120,150,0.6)',
    ruaGrandeBorda: '#ffffff',
    ruaGrande: '#ffa86b',
    trilho: '#5b4b8a',
    grade: 'saturate(1.2) contrast(0.97) brightness(1.05) sepia(0.06) hue-rotate(-8deg)',
    sombra: '45,12,50',
    fundo: '#24102e',
    notaFundo: 'rgba(255,248,240,0.9)',
    notaTexto: '#3b2140',
    veu: 'linear-gradient(180deg, rgba(255,110,160,0.2) 0%, rgba(0,0,0,0) 32%, rgba(0,0,0,0) 68%, rgba(90,50,170,0.22) 100%)',
    particulas: 'nada',
    selo: '日本の旅',
  },
  // cidade à noite: azul-escuro, magenta e ciano, gótica pesada
  neon: {
    fonte: '"Zen Kaku Gothic New", sans-serif',
    fontes: ['500 40px "Zen Kaku Gothic New"', '700 40px "Zen Kaku Gothic New"', '900 40px "Zen Kaku Gothic New"'],
    carmim: '#ff2e88',
    creme: '#f4f7ff',
    cremeSuave: 'rgba(230,240,255,0.86)',
    ambar: '#3ef0ff',
    terra: '#1a1f45',
    costa: '#3ef0ff',
    divisa: 'rgba(62,240,255,0.25)',
    marCentro: '#0e1338',
    marBorda: '#03040d',
    halo: '#ff2e88',
    ruaPequena: 'rgba(62,240,255,0.4)',
    ruaGrandeBorda: 'rgba(255,46,136,0.35)',
    ruaGrande: '#ff6fb0',
    trilho: '#c5b8ff',
    grade: 'contrast(1.12) saturate(1.28) brightness(0.95) hue-rotate(-6deg)',
    sombra: '5,5,28',
    fundo: '#05060f',
    notaFundo: 'rgba(12,14,42,0.88)',
    notaTexto: '#f4f7ff',
    veu: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,0,60,0.5) 100%)',
    particulas: 'nada',
    selo: '日本の夜',
  },
  // cartaz de jazz: preto, mostarda e laranja, sem serifa em caixa alta
  jazz: {
    fonte: '"Inter", "Zen Kaku Gothic New", sans-serif',
    fontes: ['500 40px "Inter"', '700 40px "Inter"', '900 40px "Inter"', '700 40px "Zen Kaku Gothic New"'],
    caixaAlta: true,
    carmim: '#e8471c',
    creme: '#fff8ec',
    cremeSuave: 'rgba(255,248,236,0.86)',
    ambar: '#f2c230',
    terra: '#f6efe0',
    costa: '#1d1d1d',
    divisa: 'rgba(29,29,29,0.3)',
    marCentro: '#1f6f73',
    marBorda: '#0b2b2e',
    halo: '#f2c230',
    ruaPequena: 'rgba(29,29,29,0.45)',
    ruaGrandeBorda: '#1d1d1d',
    ruaGrande: '#f2c230',
    trilho: '#e8471c',
    grade: 'contrast(1.16) saturate(0.85) sepia(0.12)',
    sombra: '0,0,0',
    fundo: '#0d0d0d',
    notaFundo: '#f2c230',
    notaTexto: '#141414',
    particulas: 'nada',
    selo: '日本の旅',
  },
  // céu limpo: branco e azul, letra de caderno, pontinhos de luz subindo
  sereno: {
    fonte: '"Klee One", serif',
    fontes: ['400 40px "Klee One"', '600 40px "Klee One"'],
    carmim: '#2f63d0',
    creme: '#ffffff',
    cremeSuave: 'rgba(255,255,255,0.88)',
    ambar: '#bfe3ff',
    terra: '#f5f7f2',
    costa: '#8aa6b8',
    divisa: 'rgba(138,166,184,0.4)',
    marCentro: '#7cc0e8',
    marBorda: '#24548a',
    halo: '#d6ecff',
    ruaPequena: 'rgba(110,140,165,0.6)',
    ruaGrandeBorda: '#ffffff',
    ruaGrande: '#9cc3e6',
    trilho: '#43546b',
    grade: 'saturate(1.05) brightness(1.05) contrast(0.97) hue-rotate(5deg)',
    sombra: '10,25,50',
    fundo: '#0c1a2c',
    notaFundo: 'rgba(245,250,255,0.9)',
    notaTexto: '#1d3150',
    veu: 'linear-gradient(180deg, rgba(130,190,255,0.18) 0%, rgba(0,0,0,0) 30%)',
    particulas: 'brilhos',
    corBrilho: '#ffffff',
    selo: '日本の空',
  },
  // nanquim: preto e branco com vermelho de carimbo, brasas subindo
  sumi: {
    fonte: mincho,
    fontes: FONTES_MINCHO,
    carmim: '#d23a2a',
    creme: '#fbf7ef',
    cremeSuave: 'rgba(251,247,239,0.85)',
    ambar: '#f3c9a0',
    terra: '#f1ece2',
    costa: '#2b2b2b',
    divisa: 'rgba(43,43,43,0.3)',
    marCentro: '#4a4a4a',
    marBorda: '#121212',
    halo: '#ffffff',
    ruaPequena: 'rgba(43,43,43,0.5)',
    ruaGrandeBorda: '#fbf7ef',
    ruaGrande: '#2b2b2b',
    trilho: '#d23a2a',
    grade: 'saturate(0.68) contrast(1.12) brightness(0.98)',
    sombra: '0,0,0',
    fundo: '#0d0d0d',
    notaFundo: 'rgba(251,247,239,0.93)',
    notaTexto: '#1a1a1a',
    veu: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)',
    particulas: 'brilhos',
    corBrilho: '#ff9a52',
    selo: '日本の旅',
  },
  // ouro e preto, serifa, faíscas douradas
  ouro: {
    fonte: mincho,
    fontes: FONTES_MINCHO,
    carmim: '#d4a017',
    creme: '#fff8e1',
    cremeSuave: 'rgba(255,248,225,0.86)',
    ambar: '#f5d27a',
    terra: '#efe2bd',
    costa: '#8a6d2a',
    divisa: 'rgba(138,109,42,0.35)',
    marCentro: '#213547',
    marBorda: '#0a121a',
    halo: '#f5d27a',
    ruaPequena: 'rgba(138,109,42,0.6)',
    ruaGrandeBorda: '#fff8e1',
    ruaGrande: '#c9971c',
    trilho: '#3d2f12',
    grade: 'contrast(1.1) saturate(1.1) sepia(0.16)',
    sombra: '15,10,0',
    fundo: '#0f0b04',
    notaFundo: 'rgba(16,12,4,0.86)',
    notaTexto: '#fff8e1',
    veu: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(20,12,0,0.5) 100%)',
    particulas: 'brilhos',
    corBrilho: '#ffd36b',
    selo: '黄金の旅',
  },
};

const Ctx = createContext<Tema>(TEMAS.outono);
export const TemaProvider = Ctx.Provider;
export const useTema = () => useContext(Ctx);

const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** pontinhos de luz subindo devagar e piscando */
const Brilhos: React.FC<{ cor: string; quantos?: number }> = ({ cor, quantos = 22 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={W} height={H}>
        <defs>
          <radialGradient id="brilhoPart">
            <stop offset="0" stopColor={cor} stopOpacity={1} />
            <stop offset="0.35" stopColor={cor} stopOpacity={0.55} />
            <stop offset="1" stopColor={cor} stopOpacity={0} />
          </radialGradient>
        </defs>
        {Array.from({ length: quantos }, (_, i) => {
          const vel = 40 + rnd(i, 1) * 70;
          const ciclo = (H + 200) / vel;
          const fase = ((t + rnd(i, 2) * ciclo) % ciclo) / ciclo;
          const y = H + 100 - fase * (H + 200);
          const x = rnd(i, 3) * W + Math.sin(t * (0.5 + rnd(i, 4)) + i) * 40;
          const r = 6 + rnd(i, 5) * 14;
          const pisca = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (2 + rnd(i, 6) * 3) + i * 2));
          return <circle key={i} cx={x} cy={y} r={r} fill="url(#brilhoPart)" opacity={pisca * 0.8} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** a camada de enfeite do tema, por cima das fotos */
export const Particulas: React.FC = () => {
  const tema = useTema();
  if (tema.particulas === 'folhas') return <Folhas quantas={4} />;
  if (tema.particulas === 'brilhos') return <Brilhos cor={tema.corBrilho ?? '#fff'} />;
  return null;
};

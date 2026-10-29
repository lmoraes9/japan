/** Folhas de bordo (momiji) caindo: o enfeite do estilo outono. */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { H, W } from '../tema.ts';

/** folha de bordo japonês de 7 lóbulos, num quadrado de ~2×2 centrado no pé dos lóbulos */
function caminhoFolha(): string {
  const graus = [160, 194, 232, 270, 308, 346, 380];
  const comp = [0.55, 0.8, 0.94, 1, 0.94, 0.8, 0.55];
  const pt = (a: number, r: number) => {
    const t = (a * Math.PI) / 180;
    return `${(Math.cos(t) * r).toFixed(3)} ${(Math.sin(t) * r).toFixed(3)}`;
  };
  const partes = [`M ${pt(122, 0.16)}`];
  graus.forEach((a, i) => {
    const L = comp[i];
    partes.push(`L ${pt(a - 10, L * 0.62)}`, `L ${pt(a, L)}`, `L ${pt(a + 10, L * 0.62)}`);
    if (i < graus.length - 1) partes.push(`L ${pt((a + graus[i + 1]) / 2, 0.3)}`);
  });
  partes.push(`L ${pt(58, 0.16)}`, 'Z');
  return partes.join(' ');
}
export const FOLHA = caminhoFolha();

export const CORES_FOLHA = ['#b7281e', '#d1432a', '#e8762c', '#f0a830', '#8c4a22', '#c9361f'];

export const Folha: React.FC<{ tam: number; cor: string; giro?: number }> = ({ tam, cor, giro = 0 }) => (
  <g transform={`rotate(${giro}) scale(${tam / 2})`}>
    <path d={FOLHA} fill={cor} stroke={cor} strokeWidth={0.06} strokeLinejoin="round" />
    <path d="M0 0 L0 0.55" stroke={cor} strokeWidth={0.05} strokeLinecap="round" />
  </g>
);

/** número "aleatório" fixo por índice, para a animação ser igual em todo render */
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Camada de folhas por cima do vídeo: umas poucas caindo o tempo todo e uma
 * rajada atravessando a tela em cada `rajadas` (quadros de troca de cena).
 */
export const Folhas: React.FC<{ quantas?: number; rajadas?: number[] }> = ({ quantas = 9, rajadas = [] }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const folhas: React.ReactNode[] = [];

  for (let i = 0; i < quantas; i++) {
    const vel = 110 + rnd(i, 1) * 120;
    const ciclo = (H + 300) / vel;
    const fase = ((t + rnd(i, 2) * ciclo) % ciclo) / ciclo;
    const y = -150 + fase * (H + 300);
    const x = rnd(i, 3) * W + Math.sin(t * (0.8 + rnd(i, 4)) + i) * 70;
    const tam = 46 + rnd(i, 5) * 50;
    folhas.push(
      <g key={`c${i}`} transform={`translate(${x},${y})`} opacity={0.9}>
        <Folha tam={tam} cor={CORES_FOLHA[i % CORES_FOLHA.length]} giro={t * (40 + rnd(i, 6) * 80) * (i % 2 ? 1 : -1)} />
      </g>,
    );
  }

  rajadas.forEach((q, r) => {
    const d = (f - q + 14) / 34; // a rajada dura ~34 quadros, centrada na troca
    if (d < 0 || d > 1) return;
    for (let i = 0; i < 16; i++) {
      const atraso = rnd(i + r * 31, 7) * 0.35;
      const p = (d - atraso) / (1 - 0.35);
      if (p < 0 || p > 1) continue;
      const x0 = -120 - rnd(i + r, 8) * 200;
      const y0 = rnd(i + r * 7, 9) * H * 0.9;
      const x = x0 + p * (W + 400);
      const y = y0 + p * (260 + rnd(i, 10) * 300) + Math.sin(p * 6 + i) * 40;
      folhas.push(
        <g key={`r${r}-${i}`} transform={`translate(${x},${y})`}>
          <Folha tam={44 + rnd(i, 11) * 56} cor={CORES_FOLHA[(i + r) % CORES_FOLHA.length]} giro={p * 540 * (i % 2 ? 1 : -1)} />
        </g>,
      );
    }
  });

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={W} height={H} style={{ filter: 'drop-shadow(0 6px 6px rgba(60,20,0,0.25))' }}>
        {folhas}
      </svg>
    </AbsoluteFill>
  );
};

/** galho de folhas fixo para enfeitar um canto (desenha em torno de 0,0, crescendo para baixo e para a esquerda) */
export const Galho: React.FC<{ x: number; y: number; escala?: number; giro?: number }> = ({ x, y, escala = 1, giro = 0 }) => {
  const f = useCurrentFrame();
  const folhas: [number, number, number, number, string][] = [
    [-40, 60, 92, -30, '#b7281e'],
    [-130, 40, 78, 10, '#d1432a'],
    [-70, 150, 84, -60, '#e8762c'],
    [-190, 120, 64, 30, '#c9361f'],
    [-150, 210, 70, -10, '#f0a830'],
    [-10, 190, 60, -80, '#d1432a'],
  ];
  return (
    <g transform={`translate(${x},${y}) rotate(${giro}) scale(${escala})`}>
      <path d="M 40 -20 Q -60 60 -220 150" stroke="#5a2e14" strokeWidth={9} fill="none" strokeLinecap="round" />
      {folhas.map(([fx, fy, t, g, c], i) => (
        <g key={i} transform={`translate(${fx},${fy})`}>
          <Folha tam={t} cor={c} giro={g + Math.sin(f / 18 + i) * 4} />
        </g>
      ))}
    </g>
  );
};

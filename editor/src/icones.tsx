/** Ícones dos meios de transporte. Desenhos dos Material Icons (Apache 2.0), 24×24. */
import React from 'react';
import type { Modo } from './plano.ts';

const TREM = 'M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm2 0V6h5v4h-5zm3.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z';
const PATH: Record<Modo, string> = {
  aviao: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  shinkansen: TREM,
  trem: TREM,
  metro: TREM,
  bonde: TREM,
  onibus: 'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z',
  balsa: 'M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z',
  teleferico: 'M2 5.5 22 3v1.6l-9 1.1V8h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3V6l-9 1.1zM8 11v4h3.2v-4zm4.8 0v4H16v-4z',
  taxi: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
  ape: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9 7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7',
};

/** ícone solto, centrado em (0,0), num quadrado de `tam` px */
export const Icone: React.FC<{ modo: Modo; tam: number; cor: string; giro?: number }> = ({ modo, tam, cor, giro = 0 }) => (
  <g transform={`rotate(${giro}) scale(${tam / 24}) translate(-12,-12)`}>
    <path d={PATH[modo]} fill={cor} />
  </g>
);

/** o "selo" que anda na ponta da rota: círculo vermelho com o ícone branco */
export const Selo: React.FC<{ modo: Modo; x: number; y: number; giro?: number; escala?: number; cor?: string; corIcone?: string; borda?: string; halo?: boolean }> = ({
  modo,
  x,
  y,
  giro = 0,
  escala = 1,
  cor = '#ff5a36',
  corIcone = '#fff',
  borda = '#fff',
  halo = true,
}) => (
  <g transform={`translate(${x},${y}) scale(${escala})`}>
    {halo ? <circle r={40} fill={cor} opacity={0.25} /> : null}
    <circle r={31} fill={cor} stroke={borda} strokeWidth={4} />
    <Icone modo={modo} tam={36} cor={corIcone} giro={modo === 'aviao' ? giro : 0} />
  </g>
);

export const IconeHtml: React.FC<{ modo: Modo; tam?: number; cor?: string }> = ({ modo, tam = 34, cor = '#fff' }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d={PATH[modo]} fill={cor} />
  </svg>
);

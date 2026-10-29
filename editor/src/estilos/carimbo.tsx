/**
 * Carimbo de estação (eki stamp, 駅スタンプ): o círculo vermelho que toda
 * estação e templo do Japão tem num balcão para os viajantes carimbarem o
 * caderno. Aqui: nome em kanji no meio, nome e data em volta.
 */
import React from 'react';

let seq = 0;

export const Carimbo: React.FC<{
  jp?: string;
  nome: string;
  data?: string;
  tam?: number;
  cor?: string;
  giro?: number;
  opacidade?: number;
  fonteJp?: string;
  fonte?: string;
}> = ({ jp, nome, data, tam = 240, cor = '#c8322c', giro = -8, opacidade = 0.88, fonteJp, fonte }) => {
  // ids únicos por instância (vários carimbos no mesmo quadro)
  const [id] = React.useState(() => `cb${seq++}`);
  const r = 100;
  const meio = jp ?? nome;
  const kanjiTam = meio.length <= 2 ? 56 : meio.length === 3 ? 40 : meio.length === 4 ? 31 : 26;
  return (
    <svg width={tam} height={tam} viewBox="-120 -120 240 240" style={{ transform: `rotate(${giro}deg)`, opacity: opacidade, mixBlendMode: 'multiply', overflow: 'visible' }}>
      <defs>
        <path id={`${id}-cima`} d={`M ${-r + 32} 0 A ${r - 32} ${r - 32} 0 0 1 ${r - 32} 0`} />
        <path id={`${id}-baixo`} d={`M ${-r + 30} 0 A ${r - 30} ${r - 30} 0 0 0 ${r - 30} 0`} />
        {/* tinta falhada: ruído que apaga pedacinhos */}
        <filter id={`${id}-tinta`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={meio.length * 7} result="ruido" />
          <feColorMatrix in="ruido" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.3 1.45" result="mascara" />
          <feComposite in="SourceGraphic" in2="mascara" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${id}-tinta)`} fill={cor} stroke={cor}>
        <circle r={r} fill="none" strokeWidth={8} />
        <circle r={r - 14} fill="none" strokeWidth={3.5} />
        <text fontSize={19} fontWeight={700} letterSpacing={3} stroke="none" textAnchor="middle" fontFamily={fonte}>
          <textPath href={`#${id}-cima`} startOffset="50%">
            {nome.toUpperCase()}
          </textPath>
        </text>
        {data ? (
          <text fontSize={17} fontWeight={700} letterSpacing={2} stroke="none" textAnchor="middle" fontFamily={fonte} dominantBaseline="hanging">
            <textPath href={`#${id}-baixo`} startOffset="50%">
              {data}
            </textPath>
          </text>
        ) : null}
        <text y={kanjiTam * 0.36} fontSize={kanjiTam} fontWeight={700} textAnchor="middle" stroke="none" fontFamily={fonteJp}>
          {meio}
        </text>
        <circle cx={-r + 24} cy={0} r={4} stroke="none" />
        <circle cx={r - 24} cy={0} r={4} stroke="none" />
      </g>
    </svg>
  );
};

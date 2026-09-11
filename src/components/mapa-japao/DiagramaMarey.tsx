'use client';

import { ALL_DAYS } from '@/data/days';
import { DIA_LUGARES, LUGARES } from '@/lib/three/japao/lugares';

/**
 * O desenho da viagem no tempo e no espaço, à maneira de Marey: x é a
 * longitude real e linear, y é o dia. A diagonal de 23 de novembro cruza a
 * folha inteira; a de 27 quase não anda. É assim que se mostra, sem escrever
 * um número, que Kansai é apertada e o país é comprido. Inerte.
 */
export function DiagramaMarey({ largura }: { largura: number }) {
  const W = largura;
  const H = 320;
  const lngs = LUGARES.map((l) => l.lng);
  const min = Math.min(...lngs);
  const max = Math.max(...lngs);
  const x = (lng: number) => 10 + ((lng - min) / (max - min)) * (W - 42);
  const y = (i: number) => 26 + i * ((H - 46) / (ALL_DAYS.length - 1));
  const porId = Object.fromEntries(LUGARES.map((l) => [l.id, l]));

  const pontos: { x: number; y: number }[] = [];
  ALL_DAYS.forEach((d, i) => {
    const ls = DIA_LUGARES[d.id] ?? [];
    ls.forEach((id, k) => {
      const l = porId[id];
      if (!l) return;
      const frac = ls.length > 1 ? k / (ls.length - 1) : 0;
      pontos.push({ x: x(l.lng), y: y(i) + frac * 6 });
    });
  });

  const kansai = ['himeji', 'osaka', 'kyoto', 'nara'].map((id) => x(porId[id].lng));
  const kx0 = Math.min(...kansai) - 6;
  const kx1 = Math.max(...kansai) + 6;

  return (
    <svg width={W} height={H} className="pointer-events-none block" aria-hidden>
      <rect x={kx0} y={0} width={kx1 - kx0} height={H} fill="var(--accent)" opacity={0.07} />
      <text x={(kx0 + kx1) / 2} y={H - 4} textAnchor="middle" className="fill-muted" style={{ fontSize: 9, letterSpacing: 0.5 }}>
        KANSAI · 107 km
      </text>
      {LUGARES.map((l) => (
        <line key={l.id} x1={x(l.lng)} y1={22} x2={x(l.lng)} y2={H - 16} stroke="var(--hairline)" strokeWidth={1} />
      ))}
      <polyline
        points={pontos.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pontos.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.2} fill="var(--accent)" />
      ))}
      {/* nomes em duas alturas alternadas: em Kansai eles ficam a 4 px um do
          outro e, numa linha só, viravam uma mancha */}
      {[...LUGARES]
        .sort((a, b) => a.lng - b.lng)
        .map((l, i) => (
          <text
            key={l.id}
            x={x(l.lng)}
            y={i % 2 === 0 ? 7 : 16}
            textAnchor="middle"
            className="fill-muted"
            style={{ fontSize: 7.5 }}
          >
            {l.nome.slice(0, 5)}
          </text>
        ))}
      {ALL_DAYS.map((d, i) =>
        i % 3 === 0 ? (
          <text key={d.id} x={W - 26} y={y(i) + 3} className="fill-muted" style={{ fontSize: 8 }}>
            {d.date.slice(8)}/{d.date.slice(5, 7)}
          </text>
        ) : null,
      )}
    </svg>
  );
}

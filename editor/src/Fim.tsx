/** Fecho: a rota inteira até aqui no mapa do Japão, com o título e uns números. */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { MapaCena } from './Mapa.tsx';
import type { SegFim } from './plano.ts';
import { COR, SEGURO } from './tema.ts';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const Fim: React.FC<{ seg: SegFim }> = ({ seg }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [4, 20], [0, 1], clamp);
  return (
    <MapaCena escala="regiao" pontos={seg.pontos} modos={['trem']} janela={[0.05, 0.55]} chegarPerto={false}>
      {() => (
        <>
          <div style={{ position: 'absolute', top: SEGURO.topo, left: 0, right: 0, textAlign: 'center', opacity: a }}>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 12, color: COR.rotaClara }}>日本 2026</div>
            <div style={{ fontSize: 84, fontWeight: 900, color: COR.texto, lineHeight: 1.05, marginTop: 6 }}>{seg.titulo}</div>
            {seg.sub ? <div style={{ fontSize: 32, fontWeight: 500, color: COR.textoSuave, marginTop: 12 }}>{seg.sub}</div> : null}
          </div>
          {seg.numeros ? (
            <div style={{ position: 'absolute', bottom: SEGURO.base + 20, left: SEGURO.esquerda, right: SEGURO.esquerda, display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              {seg.numeros.map((n, i) => {
                const b = interpolate(f, [18 + i * 6, 30 + i * 6], [0, 1], clamp);
                return (
                  <div key={i} style={{ fontSize: 30, fontWeight: 700, color: COR.texto, background: 'rgba(255,90,54,0.18)', border: `2px solid ${COR.rota}`, borderRadius: 999, padding: '10px 24px', opacity: b, transform: `scale(${0.9 + 0.1 * b})` }}>
                    {n}
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      )}
    </MapaCena>
  );
};

'use client';

/**
 * Tudo que é ancorado no mundo 3D e é apenas tinta: a linha-guia do colchete
 * até a cidade selecionada, as linhas dos chips de região, o halo de Kansai e
 * o único rótulo de cidade por vez. O elemento raiz é `pointer-events: none`,
 * então esconder qualquer coisa aqui nunca destrói um alvo.
 */
export interface PontoTela {
  x: number;
  y: number;
  visivel: boolean;
}

export function TintaMundo({
  largura,
  altura,
  guia,
  regioes,
  halo,
  rotulo,
}: {
  largura: number;
  altura: number;
  /** do topo do colchete (fora da janela) até o marco selecionado */
  guia: PontoTela | null;
  /** linhas dos chips de região até o centroide, só no panorama */
  regioes: { id: string; ponto: PontoTela; yChip: number }[];
  halo: { ponto: PontoTela; linha1: string; linha2: string } | null;
  rotulo: { ponto: PontoTela; texto: string; sub?: string } | null;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg width={largura} height={altura} className="absolute inset-0">
        {halo?.ponto.visivel && (
          <>
            <circle cx={halo.ponto.x} cy={halo.ponto.y} r={46} fill="var(--accent)" opacity={0.14} />
            <circle cx={halo.ponto.x} cy={halo.ponto.y} r={46} fill="none" stroke="var(--accent)" strokeOpacity={0.5} strokeDasharray="4 5" />
          </>
        )}
        {regioes.map((r) =>
          r.ponto.visivel ? (
            <line
              key={r.id}
              x1={largura - 146}
              y1={r.yChip + 22}
              x2={r.ponto.x}
              y2={r.ponto.y}
              stroke="var(--rail)"
              strokeOpacity={0.35}
              strokeWidth={1}
            />
          ) : null,
        )}
        {guia?.visivel && (
          <line
            x1={largura / 2}
            y1={altura}
            x2={guia.x}
            y2={guia.y}
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeOpacity={0.85}
          />
        )}
      </svg>

      {halo?.ponto.visivel && (
        <div
          className="absolute text-center"
          style={{ left: halo.ponto.x - 90, top: halo.ponto.y + 52, width: 180 }}
        >
          <p className="text-[11px] font-semibold leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,.6)]">{halo.linha1}</p>
          <p className="text-[10.5px] leading-tight text-white/80 [text-shadow:0_1px_3px_rgba(0,0,0,.6)]">{halo.linha2}</p>
        </div>
      )}

      {rotulo?.ponto.visivel && (
        <div
          className="absolute -translate-x-1/2 rounded-full bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-sm"
          style={{
            left: Math.max(52, Math.min(largura - 52, rotulo.ponto.x)),
            top: Math.max(4, Math.min(altura - 44, rotulo.ponto.y - 54)),
          }}
        >
          <p className="whitespace-nowrap text-[13px] font-bold leading-tight text-rail">{rotulo.texto}</p>
          {rotulo.sub && <p className="font-jp whitespace-nowrap text-center text-[10px] leading-tight text-rail/60">{rotulo.sub}</p>}
        </div>
      )}
    </div>
  );
}

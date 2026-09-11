'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Box, RotateCcw, CalendarDays } from 'lucide-react';
import type { Casa } from '@/lib/mapa-japao/rota';
import { ALVO } from '@/lib/mapa-japao/layout';
import { lugarPorId } from '@/lib/three/japao/lugares';

/**
 * A ficha da casa sob o cursor. A geometria é a mesma para cidade e para
 * trecho, de propósito: um único conjunto de retângulos, provado disjunto,
 * serve aos dois conteúdos.
 */
export function Ficha({
  casa,
  onAnterior,
  onProximo,
  onExpandir,
  onRever,
  onPressionarMapa,
}: {
  casa: Casa;
  onAnterior: () => void;
  onProximo: () => void;
  onExpandir: () => void;
  onRever: () => void;
  onPressionarMapa: (mapaId: string | null) => void;
}) {
  const titulo =
    casa.tipo === 'visita'
      ? `${casa.lugar.nome.toUpperCase()} · ${casa.datas}`
      : `${lugarPorId(casa.de)?.nome.toUpperCase()} → ${lugarPorId(casa.para)?.nome.toUpperCase()}`;
  const sub = casa.tipo === 'visita' ? casa.lugar.jp : casa.trecho.trem;

  return (
    <div className="flex flex-col bg-surface" style={{ height: 180 }}>
      {/* cabeçalho: ◀ título ▶ — três irmãos numa flex row, nunca empilhados */}
      <div className="flex items-center px-3 pt-3" style={{ gap: 8 }}>
        <button
          type="button"
          onClick={onAnterior}
          aria-label="anterior"
          className="tappable flex items-center justify-center rounded-xl border border-hairline bg-surface-2"
          style={{ flex: `0 0 ${ALVO}px`, width: ALVO, height: ALVO, flexShrink: 0 }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={onExpandir}
          className="min-w-0 flex-1 rounded-xl px-2 text-left"
          style={{ height: ALVO }}
        >
          <span className="block truncate text-[14.5px] font-bold leading-tight">{titulo}</span>
          <span className="font-jp block truncate text-[11.5px] leading-tight text-muted">{sub}</span>
        </button>
        <button
          type="button"
          onClick={onProximo}
          aria-label="próximo"
          className="tappable flex items-center justify-center rounded-xl border border-hairline bg-surface-2"
          style={{ flex: `0 0 ${ALVO}px`, width: ALVO, height: ALVO, flexShrink: 0 }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* faixa de chips: uma fila, então não podem colidir */}
      <div className="no-scrollbar mt-1 flex items-center overflow-x-auto px-4" style={{ gap: 8, height: ALVO }}>
        {casa.tipo === 'visita' ? (
          (casa.lugar.mapas ?? []).map((m) => (
            <span
              key={m.id}
              className="flex overflow-hidden rounded-full border border-hairline bg-surface"
              style={{ flexShrink: 0, height: ALVO }}
            >
              <Link
                href={`/lugar/${m.id}`}
                onPointerDown={() => onPressionarMapa(m.id)}
                onPointerUp={() => onPressionarMapa(null)}
                onPointerCancel={() => onPressionarMapa(null)}
                className="flex items-center px-3.5 text-[13px] font-semibold"
                style={{ minWidth: 120 - ALVO, height: ALVO }}
              >
                {m.nome}
              </Link>
              <Link
                href={`/3d/${m.id}`}
                aria-label={`${m.nome} em 3D`}
                className="flex items-center justify-center border-l border-hairline text-accent"
                style={{ flex: `0 0 ${ALVO}px`, width: ALVO, height: ALVO, flexShrink: 0 }}
              >
                <Box size={16} />
              </Link>
            </span>
          ))
        ) : (
          <>
            <span className="pointer-events-none flex items-center rounded-full bg-surface-2 px-3.5 font-mono text-[13px] font-bold tabular-nums" style={{ flexShrink: 0, height: ALVO }}>
              {casa.trecho.duracao}
            </span>
            <span className="pointer-events-none flex items-center rounded-full bg-surface-2 px-3.5 font-mono text-[13px] font-bold tabular-nums" style={{ flexShrink: 0, height: ALVO }}>
              {casa.trecho.custo}
            </span>
            <button
              type="button"
              onClick={onRever}
              className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3.5 text-[13px] font-semibold"
              style={{ flexShrink: 0, height: ALVO, minWidth: 96 }}
            >
              <RotateCcw size={14} /> rever
            </button>
          </>
        )}
      </div>

      {/* botão largo: último filho da coluna, largura cheia */}
      <div className="px-4 pb-5 pt-2">
        {casa.tipo === 'visita' ? (
          casa.dias.length === 1 ? (
            <Link
              href={`/roteiro/${casa.dias[0].id}`}
              className="tappable flex w-full items-center justify-center gap-2 rounded-xl bg-rail text-[14px] font-semibold text-white dark:border dark:border-hairline dark:bg-surface-2 dark:text-foreground"
              style={{ height: 48 }}
            >
              <CalendarDays size={16} /> O dia aqui · {casa.datas}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onExpandir}
              className="tappable flex w-full items-center justify-center gap-2 rounded-xl bg-rail text-[14px] font-semibold text-white dark:border dark:border-hairline dark:bg-surface-2 dark:text-foreground"
              style={{ height: 48 }}
            >
              <CalendarDays size={16} /> Os {casa.dias.length} dias aqui
            </button>
          )
        ) : (
          <Link
            href={`/roteiro/${casa.dia.id}`}
            className="tappable flex w-full items-center rounded-xl border border-hairline bg-surface-2 px-3 text-left text-[12.5px] leading-snug"
            style={{ height: 48 }}
          >
            <span className="line-clamp-2">{casa.trecho.nota ?? `Ver o dia ${casa.dia.date.slice(8)}`}</span>
          </Link>
        )}
      </div>
    </div>
  );
}

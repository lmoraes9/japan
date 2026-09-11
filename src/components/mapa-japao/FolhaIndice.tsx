'use client';

import { X, MapPinned, CalendarDays, Route } from 'lucide-react';
import { LUGARES } from '@/lib/three/japao/lugares';
import { ALL_DAYS } from '@/data/days';
import { primeiraCasaDe, casaDoDia } from '@/lib/mapa-japao/rota';
import { DiagramaMarey } from './DiagramaMarey';
import { ALVO } from '@/lib/mapa-japao/layout';
import { mapCover } from '@/lib/covers';
import { placeMapById } from '@/data/placeMaps';

/**
 * O índice, em tela cheia e opaco. Enquanto está aberto, todo o resto fica
 * `inert`: nunca há dois conjuntos de alvos vivos ao mesmo tempo.
 */
export function FolhaIndice({
  largura,
  onFechar,
  onIr,
}: {
  largura: number;
  onFechar: () => void;
  onIr: (casa: number) => void;
}) {
  const cel = (largura - 48) / 3;
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-background">
      <div className="flex items-center justify-between px-4" style={{ height: 56 }}>
        <p className="text-[17px] font-bold">Índice</p>
        <button
          type="button"
          onClick={onFechar}
          aria-label="fechar"
          className="tappable flex items-center justify-center rounded-full bg-surface-2"
          style={{ width: ALVO, height: ALVO, flexShrink: 0 }}
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
        <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">
          <MapPinned size={13} /> Os {LUGARES.length} lugares
        </p>
        <div className="flex flex-wrap" style={{ gap: 8 }}>
          {LUGARES.map((l) => {
            const primeiro = l.mapas?.[0]?.id;
            const capa = primeiro ? mapCover(placeMapById(primeiro)!) : undefined;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onIr(primeiraCasaDe(l.id))}
                className="tappable relative overflow-hidden rounded-2xl bg-surface-2 text-left"
                style={{ flex: `0 0 ${cel}px`, width: cel, height: 96, flexShrink: 0 }}
              >
                {capa && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={capa.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10" />
                <span className="absolute inset-x-0 bottom-0 block p-2 text-white">
                  <span className="block text-[12.5px] font-bold leading-tight">{l.nome}</span>
                  <span className="font-jp block text-[9.5px] text-white/75">{l.jp}</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mb-2 mt-5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">
          <Route size={13} /> O desenho da viagem
        </p>
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface p-1">
          <DiagramaMarey largura={largura - 42} />
        </div>
        <p className="mt-1.5 text-[11.5px] leading-snug text-muted">
          Cada linha é um dia; o eixo horizontal é a longitude real. O traço de 23 de novembro atravessa
          o país inteiro num dia. O de 27 quase não sai do lugar: é Osaka para Kyoto.
        </p>

        <p className="mb-2 mt-5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">
          <CalendarDays size={13} /> Os {ALL_DAYS.length} dias
        </p>
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
          {ALL_DAYS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onIr(casaDoDia(d.id))}
              className="flex w-full items-center gap-3 border-b border-hairline px-3 text-left last:border-b-0 active:bg-surface-2"
              style={{ height: ALVO }}
            >
              <span className="w-12 shrink-0 font-mono text-[11px] text-muted">
                {d.date.slice(8)}/{d.date.slice(5, 7)}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{d.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

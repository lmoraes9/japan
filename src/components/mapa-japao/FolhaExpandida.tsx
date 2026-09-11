'use client';

import Link from 'next/link';
import { X, Box, BookOpen, TrainFront } from 'lucide-react';
import type { Casa } from '@/lib/mapa-japao/rota';
import { ALVO } from '@/lib/mapa-japao/layout';
import { lugarPorId } from '@/lib/three/japao/lugares';
import { dayCover, mapCover } from '@/lib/covers';
import { placeMapById } from '@/data/placeMaps';

/** A folha de detalhe da casa. Cobre o trilho inteiro; o resto fica inerte. */
export function FolhaExpandida({ casa, onFechar, onRever }: { casa: Casa; onFechar: () => void; onRever: () => void }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col rounded-t-3xl bg-surface shadow-2xl" style={{ height: '68%' }}>
      <div className="flex items-start justify-between px-4 pt-4">
        <div className="min-w-0">
          {casa.tipo === 'visita' ? (
            <>
              <p className="font-jp text-[12px] tracking-[0.25em] text-muted">{casa.lugar.jp}</p>
              <h2 className="text-[22px] font-bold leading-tight">{casa.lugar.nome}</h2>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{casa.datas}</p>
            </>
          ) : (
            <>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {lugarPorId(casa.de)?.nome} → {lugarPorId(casa.para)?.nome}
              </p>
              <h2 className="flex items-center gap-2 text-[19px] font-bold leading-tight">
                <TrainFront size={18} className="text-accent" /> {casa.trecho.trem}
              </h2>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={onFechar}
          aria-label="fechar"
          className="tappable flex shrink-0 items-center justify-center rounded-full bg-surface-2"
          style={{ width: ALVO, height: ALVO }}
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-3">
        {casa.tipo === 'visita' ? (
          <>
            <p className="text-[14px] leading-relaxed">{casa.lugar.resumo}</p>

            <p className="mb-2 mt-4 font-mono text-[10.5px] uppercase tracking-widest text-muted">
              {casa.dias.length === 1 ? 'O dia aqui' : `Os ${casa.dias.length} dias aqui`}
            </p>
            <div className="space-y-2">
              {casa.dias.map((d) => {
                const capa = dayCover(d);
                return (
                  <Link
                    key={d.id}
                    href={`/roteiro/${d.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-hairline bg-surface-2/60 p-2"
                    style={{ height: 72 }}
                  >
                    {capa && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={capa.src} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[10.5px] uppercase tracking-wider text-muted">
                        {d.date.slice(8)}/{d.date.slice(5, 7)}
                      </span>
                      <span className="block truncate text-[13.5px] font-semibold leading-snug">{d.title}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            {!!casa.lugar.mapas?.length && (
              <>
                <p className="mb-2 mt-4 font-mono text-[10.5px] uppercase tracking-widest text-muted">
                  {casa.lugar.mapas.length === 1 ? 'O mapa ilustrado' : `Os ${casa.lugar.mapas.length} mapas ilustrados`}
                </p>
                <div className="space-y-2">
                  {casa.lugar.mapas.map((m) => {
                    const mapa = placeMapById(m.id);
                    const capa = mapa ? mapCover(mapa) : undefined;
                    return (
                      <div key={m.id} className="flex items-center gap-2">
                        <Link
                          href={`/lugar/${m.id}`}
                          className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-hairline bg-surface-2/60 p-2"
                          style={{ height: 72 }}
                        >
                          {capa && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={capa.src} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-semibold leading-snug">{mapa?.title ?? m.nome}</span>
                            <span className="font-jp block truncate text-[11px] text-muted">{mapa?.jp}</span>
                          </span>
                        </Link>
                        <Link
                          href={`/3d/${m.id}`}
                          aria-label={`${m.nome} em 3D`}
                          className="flex items-center justify-center rounded-2xl border border-hairline bg-surface text-accent"
                          style={{ width: ALVO, height: ALVO, flexShrink: 0 }}
                        >
                          <Box size={17} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {casa.lugar.historiaId && (
              <Link
                href={`/mais/historia/${casa.lugar.historiaId}`}
                className="tappable mt-4 flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface text-[14px] font-semibold"
                style={{ height: 48 }}
              >
                <BookOpen size={16} /> A história de {casa.lugar.nome}
              </Link>
            )}
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <span className="flex-1 rounded-2xl bg-surface-2 p-3 text-center">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">duração</span>
                <span className="block font-mono text-[19px] font-bold tabular-nums">{casa.trecho.duracao}</span>
              </span>
              <span className="flex-1 rounded-2xl bg-surface-2 p-3 text-center">
                <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">preço</span>
                <span className="block font-mono text-[19px] font-bold tabular-nums">{casa.trecho.custo}</span>
              </span>
            </div>
            {casa.trecho.nota && <p className="mt-3 text-[14px] leading-relaxed">{casa.trecho.nota}</p>}
            <button
              type="button"
              onClick={onRever}
              className="tappable mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-surface text-[14px] font-semibold"
              style={{ height: 48 }}
            >
              <TrainFront size={16} /> Rever o trajeto
            </button>
            <Link
              href={`/roteiro/${casa.dia.id}`}
              className="tappable mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-rail text-[14px] font-semibold text-white dark:border dark:border-hairline dark:bg-surface-2 dark:text-foreground"
              style={{ height: 48 }}
            >
              O dia {casa.dia.date.slice(8)}/{casa.dia.date.slice(5, 7)}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

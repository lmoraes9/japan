import Link from 'next/link';
import { Navigation, ChevronRight, Footprints } from 'lucide-react';
import type { Stop } from '@/data/types';
import { Legs } from '@/components/Legs';
import { legsFrom, legsToFirst, legsMinutes } from '@/data/legs';
import { navigateUrl } from '@/lib/mapsLinks';
import { formatCountdown } from '@/lib/now';

/**
 * O cartão da próxima parada na tela Agora: enxuto de propósito. Andando
 * na rua o que se quer saber é a que horas, onde, e **qual trem pegar** —
 * não a história do templo, que fica a um toque de distância.
 */
export function ProximaParada({
  stop,
  dayId,
  fromStopId,
  minutesToNext,
}: {
  stop: Stop;
  dayId: string;
  /** parada atual, para achar o trecho até a próxima */
  fromStopId?: string;
  minutesToNext?: number;
}) {
  const legs = (fromStopId ? legsFrom(fromStopId) : undefined) ?? legsToFirst(dayId);
  const nav = navigateUrl(stop);
  // a que horas sair para chegar na hora
  const sairEm =
    legs && minutesToNext !== undefined ? minutesToNext - legsMinutes(legs) : undefined;

  return (
    <div className="overflow-hidden rounded-2xl border border-accent/50 bg-surface ring-1 ring-accent/25">
      <div className="flex items-start gap-3 px-4 pb-3 pt-3.5">
        <div className="shrink-0 text-center">
          <p className="font-mono text-[17px] font-bold leading-none tabular-nums">{stop.time}</p>
          {stop.timeLabel && (
            <p className="mt-1 font-mono text-[9.5px] uppercase tracking-wider text-muted">{stop.timeLabel}</p>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[16px] font-bold leading-snug">{stop.name}</p>
          {stop.jp && <p className="font-jp text-[13px] leading-snug text-muted">{stop.jp}</p>}
        </div>
        {minutesToNext !== undefined && (
          <span className="shrink-0 whitespace-nowrap rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[12px] font-bold text-accent">
            {formatCountdown(minutesToNext)}
          </span>
        )}
      </div>

      {sairEm !== undefined && sairEm > -30 && (
        <p className="px-4 pb-2.5 text-[13px] leading-snug">
          <Footprints size={13} className="mr-1 inline text-muted" />
          {sairEm > 0 ? (
            <>
              Saiam daqui em <strong>{formatCountdown(sairEm)}</strong> para chegar na hora.
            </>
          ) : (
            <strong className="text-accent">Hora de sair.</strong>
          )}
        </p>
      )}

      {legs && (
        <div className="px-4 pb-3">
          <Legs legs={legs} title="Como chegar lá" />
        </div>
      )}

      <div className="flex items-stretch border-t border-hairline">
        {nav && (
          <a
            href={nav}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 border-r border-hairline py-3 text-[13.5px] font-semibold text-accent active:bg-surface-2"
          >
            <Navigation size={15} /> Navegar
          </a>
        )}
        <Link
          href={`/roteiro/${dayId}#${stop.id}`}
          className="flex flex-1 items-center justify-center gap-1 py-3 text-[13.5px] font-medium active:bg-surface-2"
        >
          Ver tudo sobre <ChevronRight size={15} className="text-muted" />
        </Link>
      </div>
    </div>
  );
}

import { Footprints, TrainFront, TramFront, Bus, Ship, Car, CableCar, Plane, Zap } from 'lucide-react';
import type { Leg, LegMode } from '@/data/types';
import { legsMinutes } from '@/data/legs';

const ICON: Record<LegMode, typeof Footprints> = {
  walk: Footprints,
  train: TrainFront,
  metro: TrainFront,
  shinkansen: Zap,
  bus: Bus,
  tram: TramFront,
  ferry: Ship,
  taxi: Car,
  cable: CableCar,
  plane: Plane,
};
const LABEL: Record<LegMode, string> = {
  walk: 'a pé',
  train: 'trem',
  metro: 'metrô',
  shinkansen: 'Shinkansen',
  bus: 'ônibus',
  tram: 'bonde',
  ferry: 'balsa',
  taxi: 'táxi',
  cable: 'teleférico',
  plane: 'voo',
};

/**
 * Como ir daqui até o próximo lugar: um trecho por linha, com onde embarcar,
 * o sentido do painel, onde descer e quanto custa. `big` é para o modo rua.
 */
export function Legs({ legs, title, big }: { legs: Leg[]; title?: string; big?: boolean }) {
  if (!legs.length) return null;
  const total = legsMinutes(legs);
  return (
    <div className={`overflow-hidden rounded-2xl border border-hairline bg-surface ${big ? '' : 'text-[13px]'}`}>
      <div className="flex items-center justify-between border-b border-hairline bg-surface-2/70 px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{title ?? 'Como chegar'}</span>
        <span className="font-mono text-[11px] tabular-nums text-muted">~{total} min</span>
      </div>
      <ol className="divide-y divide-hairline">
        {legs.map((l, i) => {
          const Icon = ICON[l.mode];
          const transit = l.mode !== 'walk' && l.mode !== 'taxi';
          return (
            <li key={i} className={`flex gap-3 px-4 ${big ? 'py-3' : 'py-2.5'}`}>
              <span className={`mt-0.5 flex shrink-0 items-center justify-center rounded-full ${l.mode === 'walk' ? 'bg-surface-2 text-muted' : 'bg-accent-soft text-accent'} ${big ? 'h-9 w-9' : 'h-7 w-7'}`}>
                <Icon size={big ? 18 : 14} strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`leading-snug ${big ? 'text-[16px]' : 'text-[13px]'}`}>
                  <strong>{l.line ?? LABEL[l.mode]}</strong>
                  <span className="text-muted"> · {l.minutes} min{l.cost ? ` · ${l.cost}` : ''}</span>
                </p>
                {transit && (l.board || l.alight) && (
                  <p className={`mt-0.5 leading-snug ${big ? 'text-[15px]' : 'text-[12.5px]'}`}>
                    {l.board && (
                      <>
                        <span className="text-muted">embarcar em </span>
                        <span className="font-medium">{l.board}</span>
                      </>
                    )}
                    {l.direction && (
                      <>
                        <span className="text-muted"> · sentido </span>
                        <span className="font-medium">{l.direction}</span>
                      </>
                    )}
                    {l.alight && (
                      <>
                        <span className="text-muted"> · descer em </span>
                        <span className="font-medium">{l.alight}</span>
                      </>
                    )}
                  </p>
                )}
                {l.mode === 'taxi' && (l.board || l.alight) && (
                  <p className={`mt-0.5 leading-snug ${big ? 'text-[15px]' : 'text-[12.5px]'}`}>
                    {l.board && <span className="text-muted">pegar {l.board}</span>}
                    {l.alight && (
                      <>
                        <span className="text-muted"> · dizer </span>
                        <span className="font-medium">{l.alight}</span>
                      </>
                    )}
                  </p>
                )}
                {l.note && <p className={`mt-0.5 leading-snug text-muted ${big ? 'text-[14px]' : 'text-[12px]'}`}>{l.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

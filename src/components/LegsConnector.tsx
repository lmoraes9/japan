'use client';

import { useState } from 'react';
import { ChevronDown, Footprints, TrainFront, Bus, TramFront, Ship, Car, CableCar, Zap, Plane } from 'lucide-react';
import type { Leg, LegMode } from '@/data/types';
import { legsMinutes } from '@/data/legs';
import { Legs } from './Legs';

const ICON: Record<LegMode, typeof Footprints> = { walk: Footprints, train: TrainFront, metro: TrainFront, shinkansen: Zap, bus: Bus, tram: TramFront, ferry: Ship, taxi: Car, cable: CableCar, plane: Plane };

/** a linha fina entre duas paradas do roteiro: resumo do trajeto, toca para abrir o detalhe */
export function LegsConnector({ legs, title }: { legs: Leg[]; title: string }) {
  const [open, setOpen] = useState(false);
  const total = legsMinutes(legs);
  const main = legs.find((l) => l.mode !== 'walk') ?? legs[0];
  const Icon = ICON[main.mode];
  const summary = legs.length === 1 && legs[0].mode === 'walk' ? 'a pé' : legs.map((l) => (l.mode === 'walk' ? `${l.minutes} min a pé` : l.line ?? l.mode)).join(' → ');
  return (
    <div className="pl-5">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 border-l-2 border-dashed border-hairline py-1 pl-3 text-left"
      >
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${main.mode === 'walk' ? 'bg-surface-2 text-muted' : 'bg-accent-soft text-accent'}`}>
          <Icon size={13} strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1 truncate text-[12px] text-muted">
          <span className="font-mono tabular-nums text-foreground/80">{total} min</span> · {summary}
        </span>
        <ChevronDown size={14} className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-1 pl-3">
          <Legs legs={legs} title={title} />
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Landmark,
  DoorOpen,
  Torus,
  PawPrint,
  Gem,
  Waves,
  Eye,
  Mountain,
  Train,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import type { HotspotKind, PlaceMap } from '@/data/placeMaps';
import { MAP_COLORS, photoKey } from '@/data/placeMaps';
import { PLACE_PHOTOS } from '@/data/placePhotos.generated';
import { Rich } from './Rich';

const KIND_ICON: Record<HotspotKind, typeof Landmark> = {
  gate: DoorOpen,
  hall: Landmark,
  fox: PawPrint,
  torii: Torus,
  stone: Gem,
  water: Waves,
  view: Eye,
  peak: Mountain,
  station: Train,
  food: UtensilsCrossed,
};

export function PlaceMapView({ map }: { map: PlaceMap }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = map.hotspots.find((h) => h.id === selectedId) ?? null;
  const Icon = selected ? KIND_ICON[selected.kind] : Landmark;
  const photo = selected ? PLACE_PHOTOS[photoKey(map.id, selected.id)] : undefined;

  return (
    <div className={`space-y-3 ${selected ? 'pb-[46svh]' : ''}`}>
      <div className="rounded-2xl border border-hairline bg-surface p-2 overflow-hidden">
        <svg
          viewBox={map.viewBox}
          className={`mx-auto block w-auto max-w-full touch-manipulation transition-[height] ${
            selected ? 'h-[38svh]' : 'h-[62svh] max-h-[560px]'
          }`}
          role="img"
          aria-label={`Mapa ilustrado de ${map.title}`}
        >
          {map.scenery.map((s, i) => (
            <path
              key={i}
              d={s.d}
              fill={s.fill ?? 'none'}
              stroke={s.stroke ?? 'none'}
              strokeWidth={s.width}
              strokeDasharray={s.dash}
              strokeLinecap={s.round ? 'round' : undefined}
              strokeLinejoin={s.round ? 'round' : undefined}
              opacity={s.opacity}
            />
          ))}

          {map.hotspots.map((h) => {
            const active = h.id === selectedId;
            const labelX = h.side === 'right' ? h.x + 19 : h.x - 19;
            return (
              <g
                key={h.id}
                role="button"
                tabIndex={0}
                aria-label={h.title}
                aria-pressed={active}
                className="cursor-pointer outline-none"
                onClick={() => setSelectedId(active ? null : h.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedId(active ? null : h.id);
                  }
                }}
              >
                {/* alvo de toque generoso */}
                <circle cx={h.x} cy={h.y} r={20} fill="transparent" />
                {active && (
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={17}
                    fill={MAP_COLORS.vermilion}
                    opacity={0.22}
                  />
                )}
                <circle
                  cx={h.x}
                  cy={h.y}
                  r={12}
                  fill={active ? MAP_COLORS.vermilion : 'var(--surface)'}
                  stroke={MAP_COLORS.vermilion}
                  strokeWidth={2}
                />
                <text
                  x={h.x}
                  y={h.y + 4}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={700}
                  fill={active ? '#fff' : MAP_COLORS.vermilion}
                >
                  {h.n}
                </text>
                <text
                  x={labelX}
                  y={h.y + 4}
                  textAnchor={h.side === 'right' ? 'start' : 'end'}
                  fontSize={11}
                  fill={active ? MAP_COLORS.ink : MAP_COLORS.muted}
                  fontWeight={active ? 600 : 400}
                >
                  {h.label}
                </text>
              </g>
            );
          })}
        </svg>
        <p className="text-[10px] text-muted leading-snug px-2 pb-1 pt-1.5">
          {map.legend}
        </p>
      </div>

      {selected ? (
        <div
          className="fixed inset-x-0 z-40 px-4"
          style={{ bottom: 'calc(58px + env(safe-area-inset-bottom))' }}
        >
          <div className="mx-auto max-w-xl max-h-[46svh] overflow-y-auto overscroll-contain rounded-2xl border border-accent bg-surface p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <span className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon size={17} strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[16px] font-bold leading-snug">
                  {selected.title}
                  {selected.jp && (
                    <span className="font-jp font-normal text-muted text-[12px] ml-1.5">
                      {selected.jp}
                    </span>
                  )}
                </h2>
                {selected.facts && (
                  <p className="font-mono text-[11px] text-muted leading-relaxed mt-1">
                    <Rich text={selected.facts} />
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedId(null)}
                aria-label="Fechar"
                className="shrink-0 text-muted"
              >
                <X size={18} />
              </button>
            </div>
            {photo && (
              <figure className="mt-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={selected.photoCaption ?? selected.title}
                  loading="lazy"
                  className="max-h-[34svh] w-full rounded-xl border border-hairline bg-surface-2 object-cover"
                />
                <figcaption className="mt-1.5 text-[11px] leading-snug text-muted">
                  {selected.photoCaption && (
                    <span className="block text-foreground/80">
                      {selected.photoCaption}
                    </span>
                  )}
                  <a
                    href={photo.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-hairline underline-offset-2"
                  >
                    {photo.credit} · {photo.license} · Wikimedia Commons
                  </a>
                </figcaption>
              </figure>
            )}
            {selected.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-[13.5px] leading-relaxed mt-2.5 text-foreground/90"
              >
                <Rich text={p} />
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-[12px] text-muted px-6">
          Toquem em um número do mapa para ver o que é aquilo e a história.
        </p>
      )}

      <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
        <div className="px-4 py-2.5 border-b border-hairline bg-surface-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
            Na ordem da subida
          </span>
        </div>
        {map.hotspots.map((h) => {
          const HIcon = KIND_ICON[h.kind];
          const active = h.id === selectedId;
          return (
            <button
              key={h.id}
              onClick={() => setSelectedId(active ? null : h.id)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 border-b border-hairline last:border-b-0 text-left ${
                active ? 'bg-accent-soft' : ''
              }`}
            >
              <span className="font-mono text-[12px] font-semibold text-accent w-4 shrink-0 tabular-nums">
                {h.n}
              </span>
              <HIcon size={15} className="text-muted shrink-0" strokeWidth={1.7} />
              <span className="text-[13.5px] font-medium min-w-0 flex-1">
                {h.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

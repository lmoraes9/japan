'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Navigation,
  MapPin,
  ChevronDown,
  BookOpen,
  UtensilsCrossed,
  StickyNote,
  ExternalLink,
  Train,
  Landmark,
  ShoppingBag,
  Plane,
  Eye,
  Camera,
  BedDouble,
} from 'lucide-react';
import type { Stop, StopKind } from '@/data/types';
import { Rich } from './Rich';
import { navigateUrl } from '@/lib/mapsLinks';
import { useSyncStore } from '@/lib/store';

const KIND_ICON: Record<StopKind, typeof Landmark> = {
  sight: Camera,
  temple: Landmark,
  food: UtensilsCrossed,
  transit: Train,
  shopping: ShoppingBag,
  flight: Plane,
  hotel: BedDouble,
  view: Eye,
  note: StickyNote,
};

export function StopCard({
  stop,
  dayId,
  highlight,
}: {
  stop: Stop;
  dayId: string;
  highlight?: boolean;
}) {
  const [histOpen, setHistOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const fav = useSyncStore((s) => s.state.favorites[stop.id]?.fav ?? false);
  const toggleFavorite = useSyncStore((s) => s.toggleFavorite);
  const note = useSyncStore((s) => s.state.notes[stop.id]?.text ?? '');
  const setNote = useSyncStore((s) => s.setNote);

  const nav = navigateUrl(stop);
  const Icon = KIND_ICON[stop.kind] ?? Landmark;

  return (
    <div
      id={stop.id}
      className={`rounded-2xl border bg-surface p-4 ${
        highlight ? 'border-accent shadow-md' : 'border-hairline'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center shrink-0 w-12">
          <span className="font-mono text-sm font-semibold text-accent tabular-nums">
            {stop.time}
          </span>
          {stop.timeLabel && (
            <span className="text-[9px] uppercase tracking-wide text-muted mt-0.5">
              {stop.timeLabel}
            </span>
          )}
          <Icon size={16} className="text-muted mt-1.5" strokeWidth={1.6} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug text-[15px]">
              {stop.name}
              {stop.jp && (
                <span className="font-jp font-normal text-muted text-[12px] ml-1.5">
                  {stop.jp}
                </span>
              )}
            </h3>
            <button
              onClick={() => toggleFavorite(stop.id)}
              aria-label="Favoritar"
              className="shrink-0 mt-0.5"
            >
              <Star
                size={18}
                className={fav ? 'text-gold fill-current' : 'text-muted'}
              />
            </button>
          </div>

          {stop.facts && (
            <p className="font-mono text-[11px] text-muted leading-relaxed mt-1">
              <Rich text={stop.facts} />
            </p>
          )}

          {stop.paragraphs?.map((p, i) => (
            <p key={i} className="text-[13.5px] leading-relaxed mt-2 text-foreground/90">
              <Rich text={p} />
            </p>
          ))}

          {stop.history && (
            <div className="mt-3 border-l-2 border-accent/60 pl-3">
              <button
                onClick={() => setHistOpen(!histOpen)}
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent"
              >
                <BookOpen size={13} />
                {stop.history.label ?? 'História'}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${histOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {histOpen &&
                stop.history.paragraphs.map((p, i) => (
                  <p key={i} className="text-[13.5px] leading-relaxed mt-2 text-foreground/85">
                    <Rich text={p} />
                  </p>
                ))}
            </div>
          )}

          {stop.eat?.map((block, i) => (
            <div key={i} className="mt-3 rounded-xl bg-surface-2 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gold mb-2">
                {block.label}
              </p>
              <ul className="space-y-2">
                {block.items.map((item, j) => (
                  <li key={j} className="text-[13px] leading-snug">
                    <span className="font-semibold">{item.name}</span>
                    {item.specialty && (
                      <span className="ml-1.5 inline-block align-middle rounded-full bg-accent/15 text-accent text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5">
                        ⭐ especialidade local
                      </span>
                    )}
                    <span className="block text-[12px] text-muted mt-0.5">
                      <Rich text={item.note} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {nav && (
              <a
                href={nav}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent text-white text-[12px] font-medium px-3 py-1.5"
              >
                <Navigation size={13} />
                Navegar
              </a>
            )}
            {stop.coords && (
              <Link
                href={`/mapa?day=${dayId}&stop=${stop.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline text-[12px] font-medium px-3 py-1.5 text-foreground/80"
              >
                <MapPin size={13} />
                Ver no mapa
              </Link>
            )}
            {stop.links?.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline text-[12px] font-medium px-3 py-1.5 text-foreground/80"
              >
                <ExternalLink size={13} />
                {l.label}
              </a>
            ))}
            <button
              onClick={() => setNoteOpen(!noteOpen)}
              className={`inline-flex items-center gap-1.5 rounded-full border text-[12px] font-medium px-3 py-1.5 ${
                note
                  ? 'border-gold text-gold'
                  : 'border-hairline text-foreground/80'
              }`}
            >
              <StickyNote size={13} />
              {note ? 'Nota' : 'Anotar'}
            </button>
          </div>

          {noteOpen && (
            <textarea
              defaultValue={note}
              onBlur={(e) => {
                if (e.target.value !== note) setNote(stop.id, e.target.value);
              }}
              placeholder="Sua anotação (sincroniza entre os dois celulares)"
              rows={2}
              className="mt-2 w-full rounded-xl border border-hairline bg-surface-2 p-2.5 text-[13px] outline-none focus:border-accent"
            />
          )}
        </div>
      </div>
    </div>
  );
}

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
  Image as ImageIcon,
  Compass,
} from 'lucide-react';
import type { Stop, StopKind } from '@/data/types';
import { Rich } from './Rich';
import { EatBlocks } from './EatBlocks';
import { navigateUrl, photosUrl } from '@/lib/mapsLinks';
import { PLACE_PHOTOS } from '@/data/placePhotos.generated';
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
  // parada que é só escolha de refeição não tem "fotos do lugar" — cada item tem as suas
  const isPlace = stop.kind !== 'food' || !!stop.jp;
  // foto local do lugar; havendo uma, ela substitui o botão que abria o Google Fotos
  const photo = PLACE_PHOTOS[`stops/${stop.id}`];
  const photos = isPlace && !photo ? photosUrl(stop) : undefined;
  const extraLinks = stop.links?.filter((l) => l.label !== 'fotos');
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

          {photo && (
            <figure className="mt-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={stop.name}
                loading="lazy"
                decoding="async"
                className="photo-in aspect-[16/10] w-full rounded-xl border border-hairline bg-surface-2 object-cover"
              />
              <figcaption className="mt-1 text-[10px] leading-snug text-muted">
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

          {stop.eat && (
            <EatBlocks blocks={stop.eat} stopId={stop.id} dayId={dayId} />
          )}

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
            {stop.placeMapId && (
              <Link
                href={`/lugar/${stop.placeMapId}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft text-[12px] font-semibold px-3 py-1.5 text-accent ring-1 ring-accent/40"
              >
                <Compass size={13} />
                Mapa ilustrado
              </Link>
            )}
            {photos && (
              <a
                href={photos}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline text-[12px] font-medium px-3 py-1.5 text-foreground/80"
              >
                <ImageIcon size={13} />
                Fotos
              </a>
            )}
            {extraLinks?.map((l) => (
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

'use client';

import Link from 'next/link';
import { Star, StickyNote } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { ALL_DAYS, stopById } from '@/data/days';
import { useSyncStore } from '@/lib/store';
import { formatDayLabel } from '@/lib/now';

export default function FavoritosPage() {
  const favorites = useSyncStore((s) => s.state.favorites);
  const notes = useSyncStore((s) => s.state.notes);

  const favStops = ALL_DAYS.flatMap((day) =>
    day.stops.filter((s) => favorites[s.id]?.fav).map((stop) => ({ day, stop })),
  );

  const noteEntries = Object.entries(notes)
    .filter(([, v]) => v.text.trim())
    .map(([key, v]) => ({ key, text: v.text, who: v.who, at: v.updatedAt, found: stopById(key) }));

  return (
    <div className="space-y-4">
      <SubpageHeader title="Favoritos e notas" />

      <section className="space-y-2">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-gold flex items-center gap-1.5">
          <Star size={14} /> Favoritos
        </h2>
        {favStops.length === 0 && (
          <p className="text-[13px] text-muted">
            Nada favoritado ainda — toque na estrela de qualquer parada do
            roteiro.
          </p>
        )}
        {favStops.map(({ day, stop }) => (
          <Link
            key={stop.id}
            href={`/roteiro/${day.id}#${stop.id}`}
            className="block rounded-2xl border border-hairline bg-surface px-3.5 py-2.5"
          >
            <p className="text-[13.5px] font-semibold">{stop.name}</p>
            <p className="text-[11px] text-muted">
              {formatDayLabel(day.date)} · {stop.time}
            </p>
          </Link>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-matcha flex items-center gap-1.5 pt-2">
          <StickyNote size={14} /> Notas
        </h2>
        {noteEntries.length === 0 && (
          <p className="text-[13px] text-muted">
            Nenhuma nota ainda — use o botão &quot;Anotar&quot; nas paradas.
          </p>
        )}
        {noteEntries.map(({ key, text, who, at, found }) => (
          <Link
            key={key}
            href={found ? `/roteiro/${found.day.id}#${key}` : '/roteiro'}
            className="block rounded-2xl border border-hairline bg-surface px-3.5 py-2.5"
          >
            <p className="text-[12px] font-semibold text-muted">
              {found ? `${found.stop.name} · ${formatDayLabel(found.day.date)}` : key}
            </p>
            <p className="text-[13px] mt-0.5 whitespace-pre-wrap">{text}</p>
            <p className="mt-1 font-mono text-[10px] text-muted">
              {who === 'P' ? 'Priscila' : who === 'L' ? 'Leonardo' : ''}
              {who ? ' · ' : ''}
              {new Date(at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}

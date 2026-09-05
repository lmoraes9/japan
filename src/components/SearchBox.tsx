'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X, MapPinned } from 'lucide-react';
import { ALL_DAYS } from '@/data/days';
import { PLACE_MAPS } from '@/data/placeMaps';
import { formatDayLabel } from '@/lib/now';

interface Hit {
  key: string;
  href: string;
  title: string;
  sub: string;
  /** trecho do texto onde bateu */
  snippet?: string;
  kind: 'stop' | 'map';
}

const norm = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\*\*|\*|`/g, '');

/** trecho de ~90 caracteres em volta da primeira ocorrência */
function snippetOf(text: string, q: string): string | undefined {
  const i = norm(text).indexOf(q);
  if (i < 0) return undefined;
  const start = Math.max(0, i - 36);
  const end = Math.min(text.length, i + q.length + 54);
  return (start > 0 ? '…' : '') + text.slice(start, end).replace(/\*\*|\*|`/g, '') + (end < text.length ? '…' : '');
}

function buildIndex() {
  const items: { hit: Hit; haystack: string; strong: string; body: string }[] = [];
  for (const day of ALL_DAYS) {
    for (const stop of day.stops) {
      const eat = (stop.eat ?? []).flatMap((b) => b.items.map((i) => `${i.name} ${i.note}`));
      const body = [
        stop.facts ?? '',
        ...(stop.paragraphs ?? []),
        ...(stop.history?.paragraphs ?? []),
        ...eat,
      ].join(' ');
      const strong = `${stop.name} ${stop.jp ?? ''} ${day.title}`;
      items.push({
        hit: {
          key: stop.id,
          href: `/roteiro/${day.id}#${stop.id}`,
          title: stop.name,
          sub: `${formatDayLabel(day.date)} · ${stop.time}`,
          kind: 'stop',
        },
        haystack: norm(`${strong} ${body}`),
        strong: norm(strong),
        body,
      });
    }
  }
  for (const map of PLACE_MAPS) {
    for (const h of map.hotspots) {
      const body = [h.facts ?? '', ...h.paragraphs].join(' ');
      const strong = `${h.title} ${h.jp ?? ''} ${h.label} ${map.title}`;
      items.push({
        hit: {
          key: `${map.id}/${h.id}`,
          href: `/lugar/${map.id}`,
          title: h.title,
          sub: `Mapa ilustrado · ${map.title}`,
          kind: 'map',
        },
        haystack: norm(`${strong} ${body}`),
        strong: norm(strong),
        body,
      });
    }
  }
  return items;
}

export function SearchBox() {
  const [q, setQ] = useState('');
  const index = useMemo(buildIndex, []);
  const query = norm(q.trim());

  const hits = useMemo(() => {
    if (query.length < 2) return [];
    const terms = query.split(/\s+/);
    return index
      .filter((it) => terms.every((t) => it.haystack.includes(t)))
      .map((it) => ({
        ...it.hit,
        // bateu no nome pesa mais que bateu no texto
        score: terms.reduce((s, t) => s + (it.strong.includes(t) ? 2 : 1), 0),
        snippet: it.strong.includes(terms[0]) ? undefined : snippetOf(it.body, terms[0]),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
  }, [index, query]);

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2.5 rounded-2xl border border-hairline bg-surface px-3.5 py-2.5">
        <Search size={17} className="shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar no roteiro: ramen, Muji, torii, tax-free…"
          className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted/70"
          type="text"
          enterKeyHint="search"
        />
        {q && (
          <button onClick={() => setQ('')} aria-label="Limpar" className="text-muted">
            <X size={16} />
          </button>
        )}
      </label>

      {query.length >= 2 && (
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
          {hits.length === 0 && (
            <p className="px-4 py-3 text-[13px] text-muted">Nada com “{q.trim()}” no roteiro.</p>
          )}
          {hits.map((h) => (
            <Link
              key={h.key}
              href={h.href}
              className="flex items-start gap-3 border-b border-hairline px-4 py-2.5 last:border-b-0 active:bg-surface-2"
            >
              {h.kind === 'map' && <MapPinned size={15} className="mt-0.5 shrink-0 text-accent" />}
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-medium leading-snug">{h.title}</span>
                <span className="block text-[11px] text-muted">{h.sub}</span>
                {h.snippet && (
                  <span className="mt-0.5 block text-[12px] leading-snug text-foreground/70">{h.snippet}</span>
                )}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

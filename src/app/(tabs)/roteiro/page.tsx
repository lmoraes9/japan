'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronRight, MoonStar } from 'lucide-react';
import { ALL_DAYS } from '@/data/days';
import { STAGES } from '@/data/trip';
import { Rich } from '@/components/Rich';
import { itineraryDate } from '@/lib/now';
import { dayCover, stageCover } from '@/lib/covers';
import { placeMapByStopId } from '@/data/placeMaps';

function DayRow({ dayId }: { dayId: string }) {
  const day = ALL_DAYS.find((d) => d.id === dayId)!;
  const [, m, dd] = day.date.split('-');
  const weekday = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'Asia/Tokyo',
    weekday: 'short',
  }).format(new Date(`${day.date}T12:00:00+09:00`));
  const isToday = itineraryDate() === day.date;
  const cover = dayCover(day);
  const hasMap = day.stops.some((s) => placeMapByStopId(s.id));

  return (
    <Link
      href={`/roteiro/${day.id}`}
      className={`tappable flex items-stretch gap-3 overflow-hidden rounded-2xl border bg-surface ${
        isToday ? 'border-accent shadow-md' : 'border-hairline'
      }`}
    >
      <div className="flex w-14 shrink-0 flex-col items-center justify-center border-r border-hairline py-3">
        <span className="font-mono text-xl font-bold leading-none">{dd}</span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted">
          {m === '11' ? 'nov' : 'dez'}
        </span>
        <span className="font-mono text-[9px] text-accent">{weekday}</span>
      </div>
      <div className="min-w-0 flex-1 py-3">
        <p className="text-[14px] font-semibold leading-snug">{day.title}</p>
        <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted">{day.subtitle}</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {hasMap && (
            <span className="rounded border border-accent/50 bg-accent-soft px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-accent">
              mapa ilustrado
            </span>
          )}
          {day.chips.map((c) => (
            <span
              key={c}
              className="rounded border border-hairline px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-muted"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      {cover ? (
        <div className="relative w-24 shrink-0 self-stretch">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cover.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-surface to-transparent" />
        </div>
      ) : (
        <ChevronRight size={18} className="my-auto mr-3 shrink-0 text-muted" />
      )}
    </Link>
  );
}

function StageIntro({ stageId }: { stageId: string }) {
  const stage = STAGES.find((s) => s.id === stageId)!;
  const [open, setOpen] = useState(false);
  if (!stage.intro && !stage.hotelHint) return null;
  return (
    <div className="rounded-2xl bg-surface-2 p-3.5 text-[13px]">
      {stage.intro && (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent"
          >
            Por que {stage.name.split(',')[0].split(' &')[0]} é assim
            <ChevronDown
              size={14}
              className={`transition-transform ${open ? 'rotate-180' : ''}`}
            />
          </button>
          {open &&
            stage.intro.map((p, i) => (
              <p key={i} className="mt-2 leading-relaxed text-foreground/85">
                <Rich text={p} />
              </p>
            ))}
        </>
      )}
      {stage.hotelHint && (
        <p className="mt-2 text-[12px] text-muted flex gap-1.5">
          <MoonStar size={14} className="shrink-0 mt-0.5" />
          <span>
            <strong>Onde ficar:</strong> <Rich text={stage.hotelHint} />
          </span>
        </p>
      )}
    </div>
  );
}

export default function RoteiroPage() {
  return (
    <div className="space-y-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold">Roteiro</h1>
        <p className="text-[13px] text-muted">
          18 nov – 3 dez · 15 noites · 5 etapas
        </p>
      </header>

      {STAGES.map((stage) => {
        const days = ALL_DAYS.filter((d) => d.stageId === stage.id);
        const cover = stageCover(stage.id);
        return (
          <section key={stage.id} className="space-y-2.5">
            <div
              className="relative flex h-28 items-end overflow-hidden rounded-2xl text-white"
              style={{ background: stage.color }}
            >
              {cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
              )}
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to top, ${stage.color} 8%, ${stage.color}99 45%, ${stage.color}22 100%)` }}
              />
              <div className="relative flex w-full items-end justify-between px-4 pb-3">
                <div>
                  <p className="font-jp text-[11px] tracking-[0.3em] opacity-80">{stage.jp}</p>
                  <h2 className="text-xl font-bold leading-tight drop-shadow">{stage.name}</h2>
                </div>
                <p className="text-right font-mono text-[11px] leading-snug opacity-90">
                  {stage.start.slice(8)}/{stage.start.slice(5, 7)} –{' '}
                  {stage.end.slice(8)}/{stage.end.slice(5, 7)}
                  <br />
                  {stage.nights} noites
                </p>
              </div>
            </div>
            <StageIntro stageId={stage.id} />
            {days.map((d) => (
              <DayRow key={d.id} dayId={d.id} />
            ))}
          </section>
        );
      })}
    </div>
  );
}

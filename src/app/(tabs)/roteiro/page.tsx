'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronRight, MoonStar } from 'lucide-react';
import { ALL_DAYS } from '@/data/days';
import { STAGES } from '@/data/trip';
import { Rich } from '@/components/Rich';
import { itineraryDate } from '@/lib/now';

function DayRow({ dayId }: { dayId: string }) {
  const day = ALL_DAYS.find((d) => d.id === dayId)!;
  const [, m, dd] = day.date.split('-');
  const weekday = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'Asia/Tokyo',
    weekday: 'short',
  }).format(new Date(`${day.date}T12:00:00+09:00`));
  const isToday = itineraryDate() === day.date;

  return (
    <Link
      href={`/roteiro/${day.id}`}
      className={`flex items-center gap-3 rounded-2xl border bg-surface p-3.5 ${
        isToday ? 'border-accent' : 'border-hairline'
      }`}
    >
      <div className="flex flex-col items-center w-11 shrink-0 border-r border-hairline pr-3">
        <span className="font-mono text-lg font-bold leading-none">{dd}</span>
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted mt-1">
          {m === '11' ? 'nov' : 'dez'}
        </span>
        <span className="font-mono text-[9px] text-accent">{weekday}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold leading-snug">{day.title}</p>
        <p className="text-[12px] text-muted leading-snug mt-0.5 line-clamp-2">
          {day.subtitle}
        </p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {day.chips.map((c) => (
            <span
              key={c}
              className="text-[9px] font-mono uppercase tracking-wide border border-hairline rounded px-1.5 py-0.5 text-muted"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <ChevronRight size={18} className="text-muted shrink-0" />
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
        return (
          <section key={stage.id} className="space-y-2.5">
            <div
              className="rounded-2xl px-4 py-3 text-white flex items-center justify-between"
              style={{ background: stage.color }}
            >
              <div>
                <p className="font-jp text-[11px] opacity-75 tracking-[0.3em]">
                  {stage.jp}
                </p>
                <h2 className="font-semibold text-lg leading-tight">
                  {stage.name}
                </h2>
              </div>
              <p className="text-[11px] font-mono opacity-80 text-right leading-snug">
                {stage.start.slice(8)}/{stage.start.slice(5, 7)} –{' '}
                {stage.end.slice(8)}/{stage.end.slice(5, 7)}
                <br />
                {stage.nights} noites
              </p>
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

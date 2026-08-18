import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Map } from 'lucide-react';
import { ALL_DAYS } from '@/data/days';
import { STAGES } from '@/data/trip';
import { StopCard } from '@/components/StopCard';
import { Rich } from '@/components/Rich';

export function generateStaticParams() {
  return ALL_DAYS.map((d) => ({ dayId: d.id }));
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ dayId: string }>;
}) {
  const { dayId } = await params;
  const idx = ALL_DAYS.findIndex((d) => d.id === dayId);
  if (idx < 0) notFound();
  const day = ALL_DAYS[idx];
  const stage = STAGES.find((s) => s.id === day.stageId)!;
  const prev = ALL_DAYS[idx - 1];
  const next = ALL_DAYS[idx + 1];

  const dateLabel = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'Asia/Tokyo',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${day.date}T12:00:00+09:00`));

  return (
    <div className="space-y-4">
      <header className="pt-1">
        <div className="flex items-center justify-between">
          <Link
            href="/roteiro"
            className="inline-flex items-center gap-1 text-[13px] text-muted"
          >
            <ArrowLeft size={16} />
            Roteiro
          </Link>
          <Link
            href={`/mapa?day=${day.id}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent"
          >
            <Map size={15} />
            Ver dia no mapa
          </Link>
        </div>
        <p
          className="mt-3 text-[11px] font-mono uppercase tracking-widest"
          style={{ color: stage.color }}
        >
          {stage.name} · {dateLabel}
        </p>
        <h1 className="text-xl font-bold leading-tight mt-1">{day.title}</h1>
        <p className="text-[13px] text-muted mt-1">{day.subtitle}</p>
      </header>

      {day.notes?.map((n, i) => (
        <div
          key={i}
          className={`rounded-2xl border p-3.5 text-[13px] leading-relaxed ${
            n.tone === 'warn'
              ? 'border-accent/50 bg-accent-soft'
              : n.tone === 'ok'
                ? 'border-matcha/50 bg-matcha/10'
                : 'border-hairline bg-surface-2'
          }`}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 text-muted">
            {n.label}
          </p>
          {n.text.split('\n\n').map((p, j) => (
            <p key={j} className={j > 0 ? 'mt-2' : ''}>
              <Rich text={p} />
            </p>
          ))}
        </div>
      ))}

      <div className="space-y-3">
        {day.stops.map((stop) => (
          <StopCard key={stop.id} stop={stop} dayId={day.id} />
        ))}
      </div>

      <nav className="flex justify-between pt-2 pb-4 text-[13px] font-medium">
        {prev ? (
          <Link
            href={`/roteiro/${prev.id}`}
            className="inline-flex items-center gap-1 text-muted"
          >
            <ArrowLeft size={15} />
            {prev.date.slice(8)}/{prev.date.slice(5, 7)}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/roteiro/${next.id}`}
            className="inline-flex items-center gap-1 text-accent"
          >
            {next.date.slice(8)}/{next.date.slice(5, 7)}
            <ArrowRight size={15} />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

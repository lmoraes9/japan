import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Map } from 'lucide-react';
import { ALL_DAYS } from '@/data/days';
import { STAGES } from '@/data/trip';
import { StopCard } from '@/components/StopCard';
import { Rich } from '@/components/Rich';
import { dayCover } from '@/lib/covers';
import { DayConditions } from '@/components/DayConditions';
import { DayReservas } from '@/components/DayReservas';

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
  const cover = dayCover(day);

  const dateLabel = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'Asia/Tokyo',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${day.date}T12:00:00+09:00`));

  return (
    <div className="space-y-4">
      <header className="relative -mx-4 -mt-3 overflow-hidden bg-surface-2" style={{ minHeight: cover ? 250 : undefined }}>
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.src} alt="" fetchPriority="high" className="photo-in absolute inset-0 h-full w-full object-cover" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: cover
              ? `linear-gradient(to top, ${stage.color}f2 0%, ${stage.color}b3 35%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.35) 100%)`
              : `linear-gradient(to top, ${stage.color}, ${stage.color}cc)`,
          }}
        />
        <div className="relative flex items-center justify-between px-4 pt-3">
          <Link
            href="/roteiro"
            className="inline-flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur"
          >
            <ArrowLeft size={15} />
            Roteiro
          </Link>
          <Link
            href={`/mapa?day=${day.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur"
          >
            <Map size={14} />
            Ver no mapa
          </Link>
        </div>
        <div className="relative px-4 pb-4 pt-16 text-white">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
            {stage.name} · {dateLabel}
          </p>
          <h1 className="mt-1 text-[24px] font-bold leading-tight tracking-tight drop-shadow">{day.title}</h1>
          <p className="mt-1.5 text-[13px] leading-snug text-white/85">{day.subtitle}</p>
        </div>
      </header>

      <DayConditions date={day.date} stageId={day.stageId} />
      <DayReservas date={day.date} />

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

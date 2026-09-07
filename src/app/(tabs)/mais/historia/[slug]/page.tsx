import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { Rich } from '@/components/Rich';
import { CITY_HISTORIES, PLACE_HISTORIES } from '@/data/historia';
import { ALL_DAYS, dayById } from '@/data/days';
import { stopPhoto } from '@/lib/covers';

export function generateStaticParams() {
  return [...CITY_HISTORIES.map((c) => ({ slug: c.id })), ...Object.keys(PLACE_HISTORIES).map((slug) => ({ slug }))];
}

export default async function HistoriaDetalhe({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = CITY_HISTORIES.find((c) => c.id === slug);
  const place = PLACE_HISTORIES[slug];
  if (!city && !place) notFound();

  const stop = place ? ALL_DAYS.flatMap((d) => d.stops.map((s) => ({ s, d }))).find((x) => x.s.id === slug) : undefined;
  const photo = stop ? stopPhoto(stop.s) : undefined;
  const title = city ? city.name : place!.title;
  const jp = city ? city.jp : place!.jp;
  const paragraphs = city ? city.paragraphs : place!.paragraphs;

  return (
    <div className="space-y-4">
      <header className="relative -mx-4 -mt-3 overflow-hidden bg-surface-2" style={{ minHeight: photo ? 220 : 120 }}>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="relative px-4 pt-3">
          <Link href="/mais/historia" className="inline-flex items-center gap-1 rounded-full bg-black/35 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur">
            <ArrowLeft size={15} /> História
          </Link>
        </div>
        <div className="relative px-4 pb-4 pt-10 text-white">
          {jp && <p className="font-jp text-[14px] tracking-[0.3em] text-white/85">{jp}</p>}
          <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight drop-shadow">{title}</h1>
          {city && <p className="mt-1.5 text-[13px] leading-snug text-white/85">{city.lead}</p>}
        </div>
      </header>

      <div className="space-y-3 text-[14.5px] leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i}><Rich text={p} /></p>
        ))}
      </div>

      {city && (
        <section className="rounded-2xl border border-hairline bg-surface p-4">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted"><CalendarDays size={13} /> No roteiro</p>
          <ul className="space-y-1.5">
            {city.dayIds.map((id) => { const d = dayById(id); return d ? (
              <li key={id}><Link href={`/roteiro/${id}`} className="text-[13.5px] font-medium text-accent underline decoration-accent/30 underline-offset-2">{d.date.slice(8)}/{d.date.slice(5, 7)} · {d.title}</Link></li>
            ) : null; })}
          </ul>
        </section>
      )}
      {stop && (
        <Link href={`/roteiro/${stop.d.id}#${stop.s.id}`} className="tappable flex items-center justify-center gap-2 rounded-2xl border border-hairline bg-surface py-3 text-[14px] font-semibold">
          <CalendarDays size={16} /> Ver no roteiro · dia {stop.d.date.slice(8)}, {stop.s.time}
        </Link>
      )}
    </div>
  );
}

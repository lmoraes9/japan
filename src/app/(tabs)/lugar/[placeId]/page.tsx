import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Navigation, MapPinned } from 'lucide-react';
import { PLACE_MAPS, placeMapById } from '@/data/placeMaps';
import { dayById } from '@/data/days';
import { mapCover } from '@/lib/covers';
import { PlaceMapView } from '@/components/PlaceMapView';
import { Rich } from '@/components/Rich';
import { searchUrl } from '@/lib/mapsLinks';

export function generateStaticParams() {
  return PLACE_MAPS.map((m) => ({ placeId: m.id }));
}

export default async function PlaceMapPage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const { placeId } = await params;
  const map = placeMapById(placeId);
  if (!map) notFound();

  const cover = mapCover(map);
  const day = dayById(map.dayId);
  const dateLabel = day
    ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'Asia/Tokyo', day: 'numeric', month: 'long' }).format(
        new Date(`${day.date}T12:00:00+09:00`),
      )
    : null;
  const others = PLACE_MAPS.filter((m) => m.id !== map.id);

  return (
    <div className="space-y-4">
      {/* ── hero ─────────────────────────────────────────────────────── */}
      <header className="relative -mx-4 -mt-3 h-[260px] overflow-hidden bg-surface-2">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.src}
            alt=""
            className="photo-in absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-3">
          <Link
            href={`/roteiro/${map.dayId}#${map.stopId}`}
            className="inline-flex items-center gap-1 rounded-full bg-black/35 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur"
          >
            <ArrowLeft size={15} />
            Dia {dateLabel?.split(' de ')[0]}
          </Link>
          <a
            href={searchUrl(map.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur"
          >
            <Navigation size={14} />
            Maps
          </a>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-4 pb-4 text-white">
          <p className="font-jp text-[12px] tracking-[0.35em] text-white/80">{map.jp}</p>
          <h1 className="mt-0.5 text-[28px] font-bold leading-none tracking-tight drop-shadow">
            {map.title}
          </h1>
          <p className="mt-1.5 text-[13px] leading-snug text-white/85">{map.subtitle}</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-white/70">
            {map.hotspots.length} pontos{dateLabel ? ` · ${dateLabel}` : ''}
          </p>
        </div>
      </header>

      <div className="space-y-2 rounded-2xl border border-hairline bg-surface-2/70 p-3.5">
        {map.intro.map((p, i) => (
          <p key={i} className="text-[13px] leading-relaxed">
            <Rich text={p} />
          </p>
        ))}
      </div>

      <PlaceMapView map={map} />

      {/* ── outros mapas ─────────────────────────────────────────────── */}
      {others.length > 0 && (
        <section className="pt-2">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">
            <MapPinned size={13} />
            Outros mapas ilustrados
          </p>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {others.map((m) => {
              const c = mapCover(m);
              return (
                <Link
                  key={m.id}
                  href={`/lugar/${m.id}`}
                  className="tappable relative h-28 w-44 shrink-0 overflow-hidden rounded-2xl bg-surface-2"
                >
                  {c && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                    <p className="text-[13px] font-semibold leading-tight">{m.title}</p>
                    <p className="font-jp text-[10px] text-white/75">{m.jp}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

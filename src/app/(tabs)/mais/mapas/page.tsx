import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { PLACE_MAPS, thumbOf } from '@/data/placeMaps';
import { dayById } from '@/data/days';
import { mapCover } from '@/lib/covers';
import { PLACE_PHOTOS } from '@/data/placePhotos.generated';
import { photoKey } from '@/data/placeMaps';

export default function MapasPage() {
  // na ordem da viagem
  const maps = [...PLACE_MAPS].sort((a, b) => a.dayId.localeCompare(b.dayId));

  return (
    <div className="space-y-4">
      <SubpageHeader
        title="Mapas ilustrados"
        subtitle="Toque num ponto do mapa e ele conta o que é e a história"
      />

      <div className="space-y-3.5">
        {maps.map((map) => {
          const cover = mapCover(map);
          const day = dayById(map.dayId);
          const date = day
            ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'Asia/Tokyo', day: 'numeric', month: 'short' }).format(
                new Date(`${day.date}T12:00:00+09:00`),
              )
            : '';
          const thumbs = map.hotspots
            .map((h) => PLACE_PHOTOS[photoKey(map.id, h.id)])
            .filter(Boolean)
            .slice(0, 6);

          return (
            <Link
              key={map.id}
              href={`/lugar/${map.id}`}
              className="tappable block overflow-hidden rounded-3xl border border-hairline bg-surface shadow-sm"
            >
              <div className="relative h-44 bg-surface-2">
                {cover && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                  <div className="min-w-0">
                    <p className="font-jp text-[11px] tracking-[0.3em] text-white/80">{map.jp}</p>
                    <h2 className="text-[22px] font-bold leading-tight drop-shadow">{map.title}</h2>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/75">
                      {map.hotspots.length} pontos · {date}
                    </p>
                  </div>
                  <ChevronRight size={22} className="shrink-0 text-white/80" />
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex -space-x-2.5">
                  {thumbs.map((t, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={thumbOf(t!)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-9 w-9 rounded-full border-2 border-surface object-cover"
                    />
                  ))}
                </div>
                <p className="min-w-0 flex-1 truncate text-[12px] text-muted">{map.subtitle}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <p className="px-2 text-center text-[11px] leading-relaxed text-muted">
        Cada mapa é um desenho esquemático do lugar, na ordem em que vocês vão percorrer. Pinça para aproximar; toque duplo para voltar ao todo.
      </p>
    </div>
  );
}

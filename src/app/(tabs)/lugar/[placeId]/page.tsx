import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Navigation } from 'lucide-react';
import { PLACE_MAPS, placeMapById } from '@/data/placeMaps';
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

  return (
    <div className="space-y-4">
      <header className="pt-1">
        <div className="flex items-center justify-between">
          <Link
            href={`/roteiro/${map.dayId}#${map.stopId}`}
            className="inline-flex items-center gap-1 text-[13px] text-muted"
          >
            <ArrowLeft size={16} />
            Voltar ao dia
          </Link>
          <a
            href={searchUrl(map.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent"
          >
            <Navigation size={15} />
            Google Maps
          </a>
        </div>
        <h1 className="text-xl font-bold leading-tight mt-3">
          {map.title}
          <span className="font-jp font-normal text-muted text-[13px] ml-2">
            {map.jp}
          </span>
        </h1>
        <p className="text-[13px] text-muted mt-1">{map.subtitle}</p>
      </header>

      <div className="rounded-2xl border border-hairline bg-surface-2 p-3.5 space-y-2">
        {map.intro.map((p, i) => (
          <p key={i} className="text-[13px] leading-relaxed">
            <Rich text={p} />
          </p>
        ))}
      </div>

      <PlaceMapView map={map} />
    </div>
  );
}

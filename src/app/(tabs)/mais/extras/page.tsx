import { ExternalLink } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { Rich } from '@/components/Rich';
import { EXTRAS, EXTRAS_IN_ITINERARY } from '@/data/extras';
import { searchUrl } from '@/lib/mapsLinks';

export default function ExtrasPage() {
  return (
    <div className="space-y-4">
      <SubpageHeader
        title="Extras"
        subtitle="Trocas possíveis, se quiserem mexer no roteiro"
      />

      <div className="rounded-2xl border border-matcha/50 bg-matcha/10 p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-1.5">
          Já entraram no roteiro
        </p>
        <ul className="list-disc pl-4 space-y-1.5 text-[13px] leading-relaxed">
          {EXTRAS_IN_ITINERARY.map((e, i) => (
            <li key={i}>
              <Rich text={e} />
            </li>
          ))}
        </ul>
      </div>

      {EXTRAS.map((place) => (
        <div
          key={place.id}
          className="rounded-2xl border border-hairline bg-surface p-4"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-[16px] font-bold">{place.title}</h2>
              <p className="text-[12px] text-muted mt-0.5">{place.subtitle}</p>
            </div>
            {place.mapQuery && (
              <a
                href={searchUrl(place.mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-accent"
                aria-label="Ver no Google Maps"
              >
                <ExternalLink size={17} />
              </a>
            )}
          </div>
          {place.paragraphs.map((p, i) => (
            <p key={i} className="text-[13px] leading-relaxed mt-2 text-foreground/90">
              <Rich text={p} />
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

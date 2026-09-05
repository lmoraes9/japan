import { SubpageHeader } from '@/components/SubpageHeader';
import { ChecklistGroup } from '@/components/ChecklistGroup';
import { Rich } from '@/components/Rich';
import { KONBINI_CHECKLIST } from '@/data/checklist';
import { KONBINI_INTRO, KONBINI_ITEMS, KONBINI_PLAN, KONBINI_ITEM_BY_ID } from '@/data/konbini';
import { PLACE_PHOTOS } from '@/data/placePhotos.generated';
import { thumbOf } from '@/data/placeMaps';

export default function KonbiniPage() {
  return (
    <div className="space-y-4">
      <SubpageHeader
        title="Konbini"
        subtitle="Caça ao tesouro no 7-Eleven, espalhada pela viagem"
      />

      <div className="rounded-2xl border border-hairline bg-surface p-4 space-y-2.5">
        {KONBINI_INTRO.map((p, i) => (
          <p key={i} className="text-[13px] leading-relaxed text-foreground/90">
            <Rich text={p} />
          </p>
        ))}
      </div>

      <ChecklistGroup items={KONBINI_CHECKLIST} title="Os oito itens" />

      <div className="rounded-2xl border border-matcha/50 bg-matcha/10 p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-2">
          Onde cada um encaixa no roteiro
        </p>
        <div className="space-y-2.5">
          {KONBINI_PLAN.map((stop) => (
            <div key={stop.day} className="flex gap-3">
              <span className="font-mono text-[12px] font-semibold text-accent shrink-0 w-11 tabular-nums">
                {stop.day}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-snug">{stop.label}</p>
                <p className="text-[12px] text-muted leading-snug mt-0.5">
                  {stop.itemIds
                    .map((id) => KONBINI_ITEM_BY_ID[id]?.title ?? id)
                    .join(' · ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {KONBINI_ITEMS.map((item) => {
        const photo = PLACE_PHOTOS[`konbini/${item.id}`];
        return (
        <details
          key={item.id}
          className="rounded-2xl border border-hairline bg-surface p-4"
        >
          <summary className="flex cursor-pointer items-center gap-3">
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbOf(photo)} alt="" loading="lazy" decoding="async" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
            )}
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold leading-snug">{item.title}</span>
              <span className="font-jp text-[12px] text-muted">{item.jp}</span>
            </span>
          </summary>
          <p className="font-mono text-[11px] text-muted mt-2 leading-relaxed">
            {item.romaji} · {item.price} · {item.where}
          </p>
          {photo && (
            <figure className="mt-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={item.title} loading="lazy" decoding="async" className="photo-in aspect-[16/10] w-full rounded-xl border border-hairline object-cover" />
              <figcaption className="mt-1 text-[10px] text-muted">
                <a href={photo.source} target="_blank" rel="noopener noreferrer" className="underline decoration-hairline underline-offset-2">
                  {photo.credit} · {photo.license} · Wikimedia Commons
                </a>
              </figcaption>
            </figure>
          )}
          <div className="mt-2 space-y-2">
            {item.paragraphs.map((p, i) => (
              <p key={i} className="text-[13px] leading-relaxed text-foreground/90">
                <Rich text={p} />
              </p>
            ))}
            {item.tip && (
              <p className="text-[12px] leading-relaxed text-muted border-l-2 border-gold/60 pl-2.5">
                <Rich text={item.tip} />
              </p>
            )}
          </div>
        </details>
        );
      })}
    </div>
  );
}

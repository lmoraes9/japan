import { Image as ImageIcon, MapPin } from 'lucide-react';
import type { EatBlock } from '@/data/types';
import { Rich } from './Rich';
import { itemMapsUrl, itemPhotosUrl } from '@/lib/places';

/** Lista de sugestões (comida/lojas) com fotos e mapa POR ITEM */
export function EatBlocks({
  blocks,
  stopId,
  dayId,
}: {
  blocks: EatBlock[];
  stopId: string;
  dayId: string;
}) {
  return (
    <>
      {blocks.map((block, i) => (
        <div key={i} className="mt-3 rounded-xl bg-surface-2 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gold mb-2">
            {block.label}
          </p>
          <ul className="space-y-2.5">
            {block.items.map((item, j) => (
              <li key={j} className="text-[13px] leading-snug">
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="font-semibold">{item.name}</span>
                    {item.specialty && (
                      <span className="ml-1.5 inline-block align-middle rounded-full bg-accent/15 text-accent text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5">
                        ⭐ especialidade local
                      </span>
                    )}
                  </span>
                  <span className="flex gap-1 shrink-0">
                    <a
                      href={itemPhotosUrl(item.name, stopId, dayId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Fotos de ${item.name}`}
                      className="rounded-full border border-hairline p-1.5 text-muted"
                    >
                      <ImageIcon size={13} />
                    </a>
                    <a
                      href={itemMapsUrl(item.name, stopId, dayId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${item.name} no mapa`}
                      className="rounded-full border border-hairline p-1.5 text-muted"
                    >
                      <MapPin size={13} />
                    </a>
                  </span>
                </span>
                <span className="block text-[12px] text-muted mt-0.5">
                  <Rich text={item.note} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

import Link from 'next/link';
import { ChevronRight, BookOpen, Landmark, MapPinned, Scroll } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { Chapters } from '@/components/Chapters';
import { JAPAN_CHAPTERS, THEMES, CITY_HISTORIES, PLACE_HISTORIES } from '@/data/historia';
import { ALL_DAYS } from '@/data/days';

const stopName = (id: string) => ALL_DAYS.flatMap((d) => d.stops).find((s) => s.id === id);

export default function HistoriaPage() {
  const places = Object.entries(PLACE_HISTORIES);
  return (
    <div className="space-y-6">
      <SubpageHeader title="História" subtitle="Onze capítulos longos sobre o Japão, cada cidade e os lugares do roteiro, para ler no trem" />

      <section>
        <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted"><Scroll size={13} /> O Japão, do início a hoje</p>
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
          {JAPAN_CHAPTERS.map((c, i) => (
            <Link key={c.id} href={`/mais/historia/japao/${c.id}`} className="flex items-center gap-3 border-b border-hairline px-4 py-3 last:border-b-0 active:bg-surface-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-[12px] font-semibold tabular-nums text-accent">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[10.5px] uppercase tracking-wider text-muted">{c.years}</span>
                <span className="block text-[14px] font-semibold leading-snug">{c.title}</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-muted">{c.lead}</span>
              </span>
              <ChevronRight size={16} className="shrink-0 text-muted" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted"><Landmark size={13} /> As cidades</p>
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
          {CITY_HISTORIES.map((c) => (
            <Link key={c.id} href={`/mais/historia/${c.id}`} className="flex items-center gap-3 border-b border-hairline px-4 py-3 last:border-b-0 active:bg-surface-2">
              <span className="font-jp w-16 shrink-0 text-[15px] text-foreground/80">{c.jp}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold">{c.name}</span>
                <span className="block text-[12px] leading-snug text-muted">{c.lead}</span>
              </span>
              <ChevronRight size={16} className="shrink-0 text-muted" />
            </Link>
          ))}
        </div>
      </section>

      <section>
        <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted"><MapPinned size={13} /> Os lugares, em detalhe</p>
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
          {places.map(([id, p]) => {
            const s = stopName(id);
            return (
              <Link key={id} href={`/mais/historia/${id}`} className="flex items-center gap-3 border-b border-hairline px-4 py-2.5 last:border-b-0 active:bg-surface-2">
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-semibold leading-snug">{p.title}</span>
                  {s && <span className="block font-mono text-[10.5px] uppercase tracking-wider text-muted">dia {s.id.slice(1, 3)} · {s.time}</span>}
                </span>
                <ChevronRight size={16} className="shrink-0 text-muted" />
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted"><BookOpen size={13} /> Temas para entender o que se vê</p>
        <Chapters chapters={THEMES} />
      </section>
    </div>
  );
}

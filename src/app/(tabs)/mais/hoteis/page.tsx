import { Navigation, Star } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { HOTEIS } from '@/data/hoteis';
import { searchUrl } from '@/lib/mapsLinks';

export default function HoteisPage() {
  return (
    <div className="space-y-6">
      <SubpageHeader title="Hotéis sugeridos" subtitle="Por etapa, pensando em andar pouco com mala e sair cedo. Preços de fim de novembro, quarto duplo" />
      <div className="rounded-2xl border border-hairline bg-surface-2/70 p-3.5 text-[13px] leading-relaxed">
        A regra que usei: <strong>menos de 10 minutos a pé da estação que vocês usam de manhã</strong>, e a pé dos jantares. A estrela marca a escolha por etapa. Novembro é pico em Kyoto: reservem primeiro lá.
      </div>
      {HOTEIS.map((e) => (
        <section key={e.stageId}>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{e.nights}</p>
          <h2 className="mt-0.5 text-[18px] font-bold">{e.city}</h2>
          <p className="mb-3 mt-1 text-[13px] leading-relaxed text-muted">{e.criteria}</p>
          <div className="space-y-3">
            {e.hotels.map((h) => (
              <div key={h.name} className={`rounded-2xl border bg-surface p-4 ${h.pick ? 'border-accent/50 ring-1 ring-accent/30' : 'border-hairline'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold leading-snug">
                      {h.pick && <Star size={14} className="mr-1 inline text-accent" fill="currentColor" />}
                      {h.name}
                    </p>
                    {h.jp && <p className="font-jp text-[11px] text-muted">{h.jp}</p>}
                    <p className="mt-0.5 text-[12px] text-muted">{h.area}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[12px] font-semibold tabular-nums">{h.price}</span>
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed">{h.why}</p>
                <p className="mt-1.5 text-[12px] leading-snug text-muted"><strong className="text-foreground/80">A pé:</strong> {h.mobility}</p>
                {h.caveat && <p className="mt-1 text-[12px] leading-snug text-muted"><strong className="text-foreground/80">Contra:</strong> {h.caveat}</p>}
                <a href={searchUrl(h.mapQuery)} target="_blank" rel="noopener noreferrer" className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium">
                  <Navigation size={12} /> Ver no mapa
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

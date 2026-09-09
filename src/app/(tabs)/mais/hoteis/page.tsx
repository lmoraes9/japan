import { Navigation, Star, PiggyBank, Building2 } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { Rich } from '@/components/Rich';
import { HOTEIS, ECONOMIA, REDES } from '@/data/hoteis';
import { searchUrl } from '@/lib/mapsLinks';

export default function HoteisPage() {
  return (
    <div className="space-y-6">
      <SubpageHeader title="Hotéis sugeridos" subtitle="Rede econômica japonesa, sempre a pé da estação. Preços de fim de novembro, quarto duplo, por noite" />
      <div className="rounded-2xl border border-hairline bg-surface-2/70 p-3.5 text-[13px] leading-relaxed">
        Refeito para orçamento apertado: tudo aqui é <strong>business hotel de rede</strong>, entre ¥8.000 e ¥20.000 a diária do casal, sem perder a regra de <strong>menos de 10 minutos a pé da estação da manhã</strong>. As 15 noites saem por volta de <strong>¥190.000</strong>, contra uns ¥450.000 na lista anterior. A estrela marca a escolha por etapa. Novembro é pico em Kyoto: reservem primeiro lá.
      </div>

      <section className="rounded-2xl border border-hairline bg-surface p-4">
        <p className="mb-2.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted"><PiggyBank size={13} /> Onde o dinheiro é economizado</p>
        <ul className="space-y-2.5">
          {ECONOMIA.map((e) => (
            <li key={e.title} className="text-[13px] leading-relaxed">
              <strong className="block text-[13.5px]">{e.title}</strong>
              <Rich text={e.text} />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-hairline bg-surface p-4">
        <p className="mb-2.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted"><Building2 size={13} /> O que esperar de cada rede</p>
        <ul className="space-y-2.5">
          {REDES.map((r) => (
            <li key={r.name} className="text-[13px] leading-relaxed">
              <strong className="block text-[13.5px]">{r.name}</strong>
              <Rich text={r.text} />
            </li>
          ))}
        </ul>
      </section>
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
                <p className="mt-2 text-[13.5px] leading-relaxed"><Rich text={h.why} /></p>
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

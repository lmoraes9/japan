import { Navigation, Star, PiggyBank, Building2, BedDouble, CircleCheck, CircleAlert, RefreshCw } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { Rich } from '@/components/Rich';
import { HOTEIS, ECONOMIA, REDES, RESERVAS_HOTEL } from '@/data/hoteis';
import { searchUrl } from '@/lib/mapsLinks';

export default function HoteisPage() {
  return (
    <div className="space-y-6">
      <SubpageHeader title="Hotéis" subtitle="O que está reservado, o que falta decidir — e as sugestões que sobraram como alternativa" />

      <section>
        <p className="mb-2.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">
          <BedDouble size={13} /> As reservas de verdade
        </p>
        <div className="space-y-2.5">
          {RESERVAS_HOTEL.map((r) => {
            const cor =
              r.status === 'confirmada'
                ? 'border-matcha/45 bg-matcha/[0.06]'
                : r.status === 'refazer'
                  ? 'border-gold/50 bg-gold/[0.07]'
                  : 'border-accent/45 bg-accent/[0.05]';
            const Icone = r.status === 'confirmada' ? CircleCheck : r.status === 'refazer' ? RefreshCw : CircleAlert;
            const rotulo = r.status === 'confirmada' ? 'confirmada' : r.status === 'refazer' ? 'refazer' : 'decidir';
            return (
              <div key={r.name} className={`rounded-2xl border p-4 ${cor}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-bold leading-snug">{r.name}</p>
                    <p className="mt-0.5 font-mono text-[11.5px] text-muted">
                      {r.datas} · {r.noites} {r.noites === 1 ? 'noite' : 'noites'} · {r.city}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block font-mono text-[13px] font-semibold tabular-nums">{r.preco}</span>
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-surface/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                      <Icone size={11} /> {rotulo}
                    </span>
                  </div>
                </div>
                {r.acao && <p className="mt-2 text-[13px] leading-relaxed"><Rich text={r.acao} /></p>}
                {r.codigo && <p className="mt-1.5 font-mono text-[11.5px] text-muted">confirmação {r.codigo}</p>}
                <a href={searchUrl(r.mapQuery)} target="_blank" rel="noopener noreferrer" className="tappable mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface/70 px-3 py-1.5 text-[12px] font-medium">
                  <Navigation size={12} /> no mapa
                </a>
              </div>
            );
          })}
        </div>
        <div className="mt-3 rounded-2xl border border-hairline bg-surface-2/70 p-3.5 text-[13px] leading-relaxed">
          Três noites estão <strong>reservadas em dobro</strong> — os dois shukubō do dia 26 e os dois hotéis de Kyoto — e a de Osaka precisa encolher de duas para uma.
          Resolver isso devolve por volta de <strong>R$ 6.800</strong>, e o cancelamento grátis não dura para sempre: em Kōyasan o prazo costuma ser mais curto que o de hotel.
        </div>
      </section>

      <div className="rounded-2xl border border-hairline bg-surface-2/70 p-3.5 text-[13px] leading-relaxed">
        Abaixo, as sugestões que serviram de base para escolher: <strong>business hotel de rede</strong>, entre ¥8.000 e ¥20.000 a diária do casal, sempre a <strong>menos de 10 minutos a pé da estação da manhã</strong>. Servem de plano B se alguma reserva cair.
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

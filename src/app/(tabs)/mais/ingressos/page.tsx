import Link from 'next/link';
import { ExternalLink, CalendarDays } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { Rich } from '@/components/Rich';
import { INGRESSOS, STATUS_LABEL, type IngressoStatus } from '@/data/ingressos';
import { ALL_DAYS } from '@/data/days';

const TONE: Record<IngressoStatus, string> = {
  obrigatorio: 'bg-accent text-white',
  recomendado: 'bg-gold/20 text-foreground ring-1 ring-gold/50',
  'chegar-cedo': 'bg-surface-2 text-foreground/80',
  livre: 'bg-matcha/15 text-foreground/80',
};
const ORDER: IngressoStatus[] = ['obrigatorio', 'recomendado', 'chegar-cedo', 'livre'];
const dayOf = (stopId?: string) => stopId && ALL_DAYS.find((d) => d.stops.some((s) => s.id === stopId));

export default function IngressosPage() {
  return (
    <div className="space-y-5">
      <SubpageHeader title="Ingressos e reservas" subtitle="O que precisa ser comprado antes, o que só convém, e o que é chegar e entrar" />
      <div className="rounded-2xl border border-hairline bg-surface-2/70 p-3.5 text-[13px] leading-relaxed">
        Conferido em setembro de 2026. Três coisas realmente esgotam: <strong>Shibuya Sky</strong> (abre 14 dias antes, some em minutos), os <strong>assentos de Shinkansen</strong> no fim de novembro, e o <strong>Torokko</strong> se decidirem fazer. O resto é fila, não falta de vaga.
      </div>
      {ORDER.map((status) => {
        const items = INGRESSOS.filter((i) => i.status === status).sort((a, b) => a.date.localeCompare(b.date));
        if (!items.length) return null;
        return (
          <section key={status}>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted">{STATUS_LABEL[status]}</p>
            <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
              {items.map((i) => {
                const day = dayOf(i.stopId);
                return (
                  <div key={i.id} className="border-b border-hairline px-4 py-3 last:border-b-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-semibold leading-snug">{i.title} {i.jp && <span className="font-jp text-[11px] font-normal text-muted">{i.jp}</span>}</p>
                        <p className="font-mono text-[10.5px] uppercase tracking-wider text-muted">{i.date.slice(8)}/{i.date.slice(5, 7)}{i.cost ? ` · ${i.cost}` : ''}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${TONE[i.status]}`}>{STATUS_LABEL[i.status].split(' ·')[0]}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed"><Rich text={i.action} /></p>
                    {(i.when || i.where) && (
                      <p className="mt-1 text-[12px] leading-snug text-muted">
                        {i.when && <><strong className="text-foreground/80">Quando:</strong> {i.when}. </>}
                        {i.where && <><strong className="text-foreground/80">Onde:</strong> {i.where}.</>}
                      </p>
                    )}
                    {i.note && <p className="mt-1 text-[12px] leading-snug text-muted">{i.note}</p>}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {i.url && <a href={i.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[12px] font-medium text-white"><ExternalLink size={12} /> Abrir o site</a>}
                      {day && i.stopId && <Link href={`/roteiro/${day.id}#${i.stopId}`} className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1 text-[12px] font-medium"><CalendarDays size={12} /> No roteiro</Link>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

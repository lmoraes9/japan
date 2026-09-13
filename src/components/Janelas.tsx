'use client';

import Link from 'next/link';
import { AlarmClock, ChevronRight, CircleAlert } from 'lucide-react';
import { janelasPendentes, janelaQuando, faltam } from '@/lib/janelas';
import { useSyncStore } from '@/lib/store';

/**
 * As compras que têm hora marcada para abrir: Shinkansen, Torokko.
 * Fica na tela Agora porque perder a janela é o único erro desta viagem
 * que não tem conserto.
 */
export function Janelas({ max = 3 }: { max?: number }) {
  const checklist = useSyncStore((s) => s.state.checklist);
  const pendentes = janelasPendentes(checklist);
  if (!pendentes.length) return null;
  const lista = pendentes.slice(0, max);
  const restantes = pendentes.length - lista.length;
  const urgente = lista.some((j) => j.estado === 'aberto' || j.minutesUntil < 2880);

  return (
    <section
      className={`overflow-hidden rounded-2xl border bg-surface ${
        urgente ? 'border-accent/50 ring-1 ring-accent/25' : 'border-hairline'
      }`}
    >
      <div className="flex items-center gap-1.5 border-b border-hairline bg-surface-2/70 px-4 py-2">
        <AlarmClock size={13} className={urgente ? 'text-accent' : 'text-muted'} />
        <span className={`font-mono text-[11px] uppercase tracking-widest ${urgente ? 'text-accent' : 'text-muted'}`}>
          Compras com hora marcada
        </span>
      </div>
      <ul className="divide-y divide-hairline">
        {lista.map(({ ingresso, opensAt, estado, minutesUntil }) => (
          <li key={ingresso.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 flex-1 text-[14px] font-semibold leading-snug">{ingresso.title}</p>
              {estado === 'aberto' ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                  <CircleAlert size={11} /> já abriu
                </span>
              ) : (
                <span
                  className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[12px] font-bold ${
                    minutesUntil < 2880 ? 'bg-accent-soft text-accent' : 'bg-surface-2 text-muted'
                  }`}
                >
                  {faltam(minutesUntil)}
                </span>
              )}
            </div>
            <p className="mt-1 text-[12px] leading-snug text-muted">
              {estado === 'aberto'
                ? `A venda abriu em ${janelaQuando(opensAt).split(' · ')[0]}. Comprar assim que der.`
                : `Abre ${janelaQuando(opensAt)}`}
            </p>
            {ingresso.where && (
              <p className="mt-0.5 text-[12px] leading-snug text-muted">Em {ingresso.where}</p>
            )}
            {ingresso.url && (
              <a
                href={ingresso.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block text-[12.5px] font-semibold text-accent underline decoration-accent/30 underline-offset-2"
              >
                Abrir o site
              </a>
            )}
          </li>
        ))}
      </ul>
      <Link
        href="/mais/ingressos"
        className="flex items-center justify-between px-4 py-2.5 text-[13px] font-medium active:bg-surface-2"
      >
        {restantes > 0 ? `Ver as outras ${restantes} e o resto dos ingressos` : 'Ver todos os ingressos e reservas'}
        <ChevronRight size={15} className="text-muted" />
      </Link>
    </section>
  );
}

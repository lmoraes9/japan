'use client';

import type { ChecklistItem } from '@/data/types';
import { useSyncStore } from '@/lib/store';
import { faltam } from '@/lib/janelas';

const dataCurta = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(new Date(iso));

/** 'até 23/10 · em 44 dias' ou 'passou do prazo (23/10)' */
function Prazo({ iso, checked }: { iso: string; checked: boolean }) {
  const minutos = Math.round((new Date(iso).getTime() - Date.now()) / 60000);
  if (checked) return null;
  const atrasado = minutos <= 0;
  const perto = !atrasado && minutos < 7 * 1440;
  return (
    <span
      className={`mt-1 inline-block rounded-full px-2 py-0.5 font-mono text-[10.5px] font-semibold ${
        atrasado
          ? 'bg-accent text-white'
          : perto
            ? 'bg-accent-soft text-accent'
            : 'bg-surface-2 text-muted'
      }`}
    >
      {atrasado ? `prazo era ${dataCurta(iso)}` : `até ${dataCurta(iso)} · ${faltam(minutos)}`}
    </span>
  );
}

export function ChecklistGroup({
  items,
  title,
}: {
  items: ChecklistItem[];
  title?: string;
}) {
  const checklist = useSyncStore((s) => s.state.checklist);
  const toggle = useSyncStore((s) => s.toggleChecklist);
  const done = items.filter((i) => checklist[i.id]?.checked).length;

  return (
    <div className="rounded-2xl border border-hairline bg-surface overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2.5 border-b border-hairline bg-surface-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
          {title ?? 'Checklist'}
        </span>
        <span className="text-[11px] font-mono text-muted">
          {done} de {items.length}
        </span>
      </div>
      {items.map((item) => {
        const checked = checklist[item.id]?.checked ?? false;
        return (
          <label
            key={item.id}
            className="flex items-start gap-3 px-4 py-3 border-b border-hairline last:border-b-0 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(item.id)}
              className="mt-0.5 w-[18px] h-[18px] shrink-0 accent-[var(--matcha)]"
            />
            <span className="min-w-0">
              <span
                className={`block text-[14px] font-medium leading-snug ${
                  checked ? 'line-through text-muted' : ''
                }`}
              >
                {item.title}
              </span>
              <span className="block text-[12px] text-muted leading-snug mt-0.5">
                {item.subtitle}
              </span>
              {item.dueAt && <Prazo iso={item.dueAt} checked={checked} />}
            </span>
          </label>
        );
      })}
    </div>
  );
}

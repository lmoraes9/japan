'use client';

import type { ChecklistItem } from '@/data/types';
import { useSyncStore } from '@/lib/store';

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
            </span>
          </label>
        );
      })}
    </div>
  );
}

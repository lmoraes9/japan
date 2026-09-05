'use client';

import { TrainFront, AlertTriangle } from 'lucide-react';
import type { LastReturn as LastReturnT } from '@/data/types';
import { formatCountdown } from '@/lib/now';

/**
 * Última conexão de volta dos bate-voltas. Com `nowMin` (minutos JST do dia)
 * mostra a contagem regressiva e fica vermelho quando falta menos de 1h.
 */
export function LastReturn({ items, nowMin }: { items: LastReturnT[]; nowMin?: number }) {
  if (!items.length) return null;
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
      <div className="border-b border-hairline bg-surface-2 px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Última volta do dia</span>
      </div>
      {items.map((r) => {
        const left = nowMin !== undefined ? toMin(r.time) - nowMin : undefined;
        const passed = left !== undefined && left < 0;
        const urgent = left !== undefined && left >= 0 && left < 60;
        return (
          <div
            key={r.label}
            className={`flex items-start gap-3 border-b border-hairline px-4 py-2.5 last:border-b-0 ${urgent ? 'bg-accent-soft' : ''}`}
          >
            <span className={`mt-0.5 shrink-0 ${r.critical ? 'text-accent' : 'text-rail'}`}>
              {r.critical ? <AlertTriangle size={16} /> : <TrainFront size={16} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[13px] font-semibold leading-snug ${passed ? 'text-muted line-through' : ''}`}>{r.label}</span>
              <span className="block text-[11.5px] leading-snug text-muted">
                de {r.from}
                {r.note ? ` · ${r.note}` : ''}
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className={`block font-mono text-[15px] font-bold tabular-nums ${urgent ? 'text-accent' : ''}`}>{r.time}</span>
              {left !== undefined && !passed && (
                <span className={`block font-mono text-[10px] ${urgent ? 'font-semibold text-accent' : 'text-muted'}`}>{formatCountdown(left)}</span>
              )}
              {passed && <span className="block font-mono text-[10px] text-muted">já passou</span>}
            </span>
          </div>
        );
      })}
    </div>
  );
}

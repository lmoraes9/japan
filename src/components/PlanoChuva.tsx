'use client';

import { useState } from 'react';
import { Umbrella, ArrowRight, Check } from 'lucide-react';
import type { StageId } from '@/data/types';
import { useForecast, forecastFor } from '@/lib/weather';
import { PLANO_CHUVA, IMPACTO_CHUVA, CHUVA_GERAL } from '@/data/chuva';
import { Rich } from './Rich';

/** a partir de quanto a previsão faz o bloco abrir sozinho */
const LIMIAR = 50;

/**
 * "Se chover" — o plano B do dia. Fica recolhido quando a previsão é boa, para
 * não ocupar a tela, e abre sozinho quando passa de 50% de chance de chuva.
 * Sem internet e sem cache de previsão ele continua aqui, só que fechado.
 */
export function PlanoChuva({ dayId, date, stageId }: { dayId: string; date: string; stageId: StageId }) {
  const plano = PLANO_CHUVA[dayId];
  const { days } = useForecast(stageId);
  const previsao = forecastFor(days, date);
  const provavel = previsao ? previsao.rain >= LIMIAR : false;
  // o usuário manda: depois de tocar, o estado é dele, não da previsão
  const [aberto, setAberto] = useState<boolean | null>(null);
  if (!plano) return null;
  const open = aberto ?? provavel;
  const imp = IMPACTO_CHUVA[plano.impacto];

  return (
    <details
      open={open}
      onToggle={(e) => setAberto((e.target as HTMLDetailsElement).open)}
      className={`rounded-2xl border bg-surface p-3.5 ${provavel ? 'border-accent/60' : 'border-hairline'}`}
    >
      <summary className="flex cursor-pointer items-center gap-2.5">
        <Umbrella size={17} className={provavel ? 'text-accent' : 'text-muted'} />
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] font-semibold leading-snug">Se chover</span>
          <span className={`block text-[11px] font-medium leading-snug ${imp.cor}`}>{imp.rotulo}</span>
        </span>
        {previsao && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold ${
              provavel ? 'bg-accent text-white' : 'bg-surface-2 text-muted'
            }`}
          >
            {previsao.rain}%
          </span>
        )}
      </summary>

      <div className="mt-3 space-y-2.5 text-[13px] leading-relaxed">
        <p className="text-foreground/90">
          <Rich text={plano.resumo} />
        </p>
        {plano.mantem && (
          <p className="flex gap-2 text-foreground/85">
            <Check size={14} className="mt-1 shrink-0 text-matcha" />
            <span>
              <span className="font-semibold text-matcha">Fica igual: </span>
              <Rich text={plano.mantem} />
            </span>
          </p>
        )}
        {plano.trocas?.map((t, i) => (
          <div key={i} className="rounded-xl bg-surface-2 p-2.5">
            <p className="text-[12px] leading-snug text-muted line-through decoration-muted/50">
              <Rich text={t.sai} />
            </p>
            <p className="mt-1 flex gap-1.5 text-[12.5px] font-medium leading-snug">
              <ArrowRight size={13} className="mt-0.5 shrink-0 text-accent" />
              <span>
                <Rich text={t.entra} />
              </span>
            </p>
          </div>
        ))}
        {plano.dica && (
          <p className="border-l-2 border-gold/60 pl-2.5 text-[12.5px] text-foreground/85">
            <Rich text={plano.dica} />
          </p>
        )}
        <details className="rounded-xl border border-hairline p-2.5">
          <summary className="cursor-pointer text-[11.5px] font-semibold uppercase tracking-wider text-muted">
            Vale para qualquer dia de chuva
          </summary>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[12px] leading-relaxed text-foreground/85">
            {CHUVA_GERAL.map((g, i) => (
              <li key={i}>
                <Rich text={g} />
              </li>
            ))}
          </ul>
        </details>
        <p className="text-[10.5px] leading-snug text-muted">
          Horários e o que abre em cada dia mudam: confirmem na véspera os lugares que não estão no roteiro.
        </p>
      </div>
    </details>
  );
}

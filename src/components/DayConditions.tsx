'use client';

import { Sunrise, Sunset, Umbrella } from 'lucide-react';
import type { StageId } from '@/data/types';
import { sunFor, STAGE_COORDS } from '@/lib/sun';
import { useForecast, forecastFor, describe } from '@/lib/weather';

/**
 * Nascer/pôr do sol (calculado, offline) e previsão do tempo (Open-Meteo,
 * com cache) para um dia da viagem. Compacto o bastante para o hero do dia
 * e para a tela Agora.
 */
export function DayConditions({ date, stageId, compact }: { date: string; stageId: StageId; compact?: boolean }) {
  const sun = sunFor(date, stageId);
  const { days, fetchedAt } = useForecast(stageId);
  const f = forecastFor(days, date);
  const w = f ? describe(f.code) : null;
  const rainy = !!f && f.rain >= 50;

  const dur = `${Math.floor(sun.dayMinutes / 60)}h${String(sun.dayMinutes % 60).padStart(2, '0')}`;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted">
        <span className="inline-flex items-center gap-1"><Sunrise size={12} /> {sun.sunrise}</span>
        <span className="inline-flex items-center gap-1"><Sunset size={12} /> {sun.sunset}</span>
        {f && w && (
          <span className={rainy ? 'text-accent' : ''}>
            {w.icon} {f.tMin}–{f.tMax} °C{f.rain > 0 ? ` · ${f.rain}% chuva` : ''}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-3.5 ${rainy ? 'border-accent/40 bg-accent-soft/40' : 'border-hairline bg-surface'}`}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {STAGE_COORDS[stageId].name} · sol e tempo
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
            <span className="inline-flex items-center gap-1.5"><Sunrise size={15} className="text-gold" /> nasce <strong>{sun.sunrise}</strong></span>
            <span className="inline-flex items-center gap-1.5"><Sunset size={15} className="text-accent" /> se põe <strong>{sun.sunset}</strong></span>
            <span className="text-muted">{dur} de luz</span>
          </div>
          {f && w ? (
            <p className="mt-1.5 text-[13px]">
              <span className="text-lg align-middle">{w.icon}</span>{' '}
              <span className="capitalize">{w.label}</span>, <strong>{f.tMin}</strong> a <strong>{f.tMax} °C</strong>
              {f.rain > 0 && (
                <span className={`ml-1.5 inline-flex items-center gap-1 ${rainy ? 'font-semibold text-accent' : 'text-muted'}`}>
                  <Umbrella size={13} /> {f.rain}% de chuva{rainy ? ' — levem guarda-chuva' : ''}
                </span>
              )}
            </p>
          ) : (
            <p className="mt-1.5 text-[12px] text-muted">
              {fetchedAt ? 'Previsão ainda não cobre este dia (16 dias à frente).' : 'Previsão aparece com internet (Open-Meteo), depois fica salva.'}
            </p>
          )}
          <p className="mt-1 text-[11px] text-muted">
            Escurece uns 25 min depois do pôr do sol. Fotos de fim de tarde: comece a caminhar para o lugar às {sun.sunset.replace(/(\d+):(\d+)/, (_, h, m) => `${String(Number(h) - (Number(m) < 45 ? 1 : 0)).padStart(2, '0')}:${String((Number(m) + 15) % 60).padStart(2, '0')}`)}.
          </p>
        </div>
      </div>
    </div>
  );
}

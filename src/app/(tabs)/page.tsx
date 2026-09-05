'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plane,
  TrainFront,
  AlarmClock,
  ArrowRight,
  Navigation,
  Wallet,
  ListChecks,
} from 'lucide-react';
import { resolvePosition, formatCountdown, type TripPosition } from '@/lib/now';
import { TRIP, STAGES } from '@/data/trip';
import { ALL_DAYS } from '@/data/days';
import { ALERTS } from '@/data/logistics';
import { PRETRIP_ITEMS, COMPRAS_ITEMS } from '@/data/checklist';
import { StopCard } from '@/components/StopCard';
import { Rich } from '@/components/Rich';
import { SyncBadge } from '@/components/SyncBadge';
import { useSyncStore, activeExpenses } from '@/lib/store';
import { useSettings, effectiveRate, fmtBrl, fmtJpy } from '@/lib/settings';
import { navigateUrl } from '@/lib/mapsLinks';
import { DayConditions } from '@/components/DayConditions';
import { DayReservas } from '@/components/DayReservas';
import { dayCover } from '@/lib/covers';
import { placeMapByStopId } from '@/data/placeMaps';
import { Compass, Sunrise } from 'lucide-react';
import { sunFor } from '@/lib/sun';

const sunriseOf = (date: string, stageId: Parameters<typeof sunFor>[1]) => sunFor(date, stageId).sunrise;

function useTripPosition(): TripPosition | null {
  const [pos, setPos] = useState<TripPosition | null>(null);
  useEffect(() => {
    const update = () => setPos(resolvePosition());
    update();
    const t = setInterval(update, 30_000);
    return () => clearInterval(t);
  }, []);
  return pos;
}

function Clocks({ pos }: { pos: TripPosition }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface border border-hairline px-4 py-3">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted">Japão</p>
        <p className="font-mono text-2xl font-bold tabular-nums">{pos.jst.time}</p>
        <p className="text-[11px] text-muted capitalize">{pos.jst.weekday}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-widest text-muted">Brasil</p>
        <p className="font-mono text-lg font-semibold tabular-nums text-muted">
          {pos.br.time}
        </p>
        <SyncBadge />
      </div>
    </div>
  );
}

function EventCountdown({ pos }: { pos: TripPosition }) {
  const e = pos.nextEvent;
  if (!e) return null;
  const Icon =
    e.kind === 'flight' ? Plane : e.kind === 'train' ? TrainFront : AlarmClock;
  return (
    <div className="rounded-2xl border border-gold/50 bg-gold/10 px-4 py-3 flex items-center gap-3">
      <Icon size={20} className="text-gold shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-snug">{e.label}</p>
        {e.detail && <p className="text-[11px] text-muted mt-0.5">{e.detail}</p>}
      </div>
      <span className="font-mono text-[13px] font-bold text-gold whitespace-nowrap">
        {formatCountdown(e.minutesUntil)}
      </span>
    </div>
  );
}

function RateWidget() {
  const settings = useSettings();
  const { rate, source } = effectiveRate(settings);
  return (
    <Link
      href="/mais/ajustes"
      className="rounded-2xl bg-surface border border-hairline px-4 py-3 flex items-center justify-between"
    >
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted">
          Cotação {source === 'manual' ? '(manual)' : source === 'fallback' ? '(aprox.)' : ''}
        </p>
        <p className="font-mono text-[15px] font-semibold">
          ¥1.000 = {fmtBrl(rate * 1000)}
        </p>
      </div>
      {settings.cachedRate && source === 'api' && (
        <p className="text-[10px] text-muted">de {settings.cachedRate.date}</p>
      )}
    </Link>
  );
}

function BeforeTrip({ pos }: { pos: TripPosition }) {
  const checklist = useSyncStore((s) => s.state.checklist);
  const done = PRETRIP_ITEMS.filter((i) => checklist[i.id]?.checked).length;
  const departure = new Date(TRIP.departureFromBrazil);
  const days = Math.ceil((departure.getTime() - Date.now()) / 86_400_000);

  return (
    <>
      <div className="rounded-3xl bg-rail text-white px-5 py-6 dark:bg-surface dark:border dark:border-hairline dark:text-foreground">
        <p className="font-jp text-[12px] tracking-[0.4em] opacity-70">紅葉の旅</p>
        <h1 className="text-2xl font-bold mt-1">Japão no fim do outono</h1>
        <p className="text-[13px] opacity-80 mt-1">
          Embarque em {departure.toLocaleDateString('pt-BR')} às 22:50 —{' '}
          <strong>{days > 0 ? `faltam ${days} dias` : 'é hoje!'}</strong>
        </p>
      </div>

      <EventCountdown pos={pos} />

      <Link
        href="/mais/logistica"
        className="rounded-2xl border border-hairline bg-surface px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <ListChecks size={20} className="text-matcha" />
          <div>
            <p className="text-[14px] font-semibold">Checklist pré-viagem</p>
            <p className="text-[12px] text-muted">
              {done} de {PRETRIP_ITEMS.length} itens prontos
            </p>
          </div>
        </div>
        <ArrowRight size={18} className="text-muted" />
      </Link>

      <section className="space-y-2.5">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-accent">
          Leia isto primeiro — 3 coisas mudaram
        </h2>
        {ALERTS.map((a) => (
          <details
            key={a.label}
            className="rounded-2xl border border-accent/40 bg-accent-soft p-3.5"
          >
            <summary className="text-[13px] font-semibold cursor-pointer">
              {a.label}
            </summary>
            <div className="mt-2 space-y-2 text-[13px] leading-relaxed">
              {a.paragraphs?.map((p, i) => (
                <p key={i}>
                  <Rich text={p} />
                </p>
              ))}
              {a.bullets && (
                <ul className="list-disc pl-4 space-y-1">
                  {a.bullets.map((b, i) => (
                    <li key={i}>
                      <Rich text={b} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        ))}
      </section>
    </>
  );
}

function DuringTrip({ pos }: { pos: TripPosition }) {
  if (!pos.day) {
    return (
      <p className="text-muted text-sm">
        Dia fora do roteiro — veja a aba Roteiro.
      </p>
    );
  }
  const stage = STAGES.find((s) => s.id === pos.day!.stageId)!;
  const nightNum =
    Math.round(
      (new Date(pos.day.date).getTime() - new Date(stage.start).getTime()) /
        86_400_000,
    ) + 1;
  const nav = pos.nextStop ? navigateUrl(pos.nextStop) : undefined;
  const dayNum = (pos.dayIndex ?? 0) + 1;
  const tomorrow = ALL_DAYS[(pos.dayIndex ?? 0) + 1];
  // depois das 20h (e sem próxima parada) a tela vira "amanhã"
  const eveningMode = pos.jst.hour >= 20 && !pos.nextStop && !!tomorrow;
  const tomorrowFirst = tomorrow
    ? [...tomorrow.stops].sort((a, b) => a.time.localeCompare(b.time))[0]
    : undefined;
  const tomorrowMap = tomorrow?.stops.map((s) => placeMapByStopId(s.id)).find(Boolean);
  const tomorrowCover = tomorrow ? dayCover(tomorrow) : undefined;

  return (
    <>
      <div
        className="rounded-3xl px-5 py-5 text-white"
        style={{ background: stage.color }}
      >
        <p className="font-jp text-[11px] tracking-[0.35em] opacity-75">
          {stage.jp}
        </p>
        <h1 className="text-xl font-bold leading-tight mt-0.5">
          Você está em: {stage.name.split(',').pop()?.trim()}
        </h1>
        <p className="text-[12px] opacity-85 mt-1">
          Dia {dayNum} de {ALL_DAYS.length} · noite {Math.min(nightNum, stage.nights)} de{' '}
          {stage.nights} · {pos.day.title}
        </p>
      </div>

      <EventCountdown pos={pos} />

      <DayConditions date={pos.day.date} stageId={pos.day.stageId} />
      <DayReservas date={pos.day.date} />

      {eveningMode && tomorrow && (
        <section className="space-y-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-accent">Amanhã</h2>
          <Link
            href={`/roteiro/${tomorrow.id}`}
            className="tappable relative block overflow-hidden rounded-3xl bg-surface-2 text-white"
            style={{ minHeight: 170 }}
          >
            {tomorrowCover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tomorrowCover.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
            <div className="relative flex h-full min-h-[170px] flex-col justify-end p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/75">
                {new Intl.DateTimeFormat('pt-BR', { timeZone: 'Asia/Tokyo', weekday: 'long', day: 'numeric' }).format(new Date(`${tomorrow.date}T12:00:00+09:00`))}
              </p>
              <p className="text-[18px] font-bold leading-tight drop-shadow">{tomorrow.title}</p>
              <p className="mt-1 text-[12.5px] text-white/85">{tomorrow.subtitle}</p>
              <div className="mt-2.5 flex flex-wrap gap-2 font-mono text-[11px]">
                {tomorrowFirst && (
                  <span className="rounded-full bg-white/15 px-2.5 py-1">
                    primeira parada {tomorrowFirst.time} · {tomorrowFirst.name}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1">
                  <Sunrise size={11} /> sol {sunriseOf(tomorrow.date, tomorrow.stageId)}
                </span>
                {tomorrowMap && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/80 px-2.5 py-1">
                    <Compass size={11} /> mapa ilustrado: {tomorrowMap.title}
                  </span>
                )}
              </div>
            </div>
          </Link>
          {tomorrow.notes?.map((n, i) => (
            <div key={i} className="rounded-2xl border border-hairline bg-surface-2 p-3.5 text-[13px] leading-relaxed">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted">{n.label}</p>
              <Rich text={n.text.split('\n\n')[0]} />
            </div>
          ))}
          <DayReservas date={tomorrow.date} prevDate={pos.day.date} />
        </section>
      )}

      {pos.nextStop && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-semibold uppercase tracking-wider text-accent">
              Próxima parada{' '}
              {pos.minutesToNext !== undefined &&
                `· ${formatCountdown(pos.minutesToNext)}`}
            </h2>
            {nav && (
              <a
                href={nav}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[12px] font-medium text-accent"
              >
                <Navigation size={13} />
                Navegar
              </a>
            )}
          </div>
          <StopCard stop={pos.nextStop} dayId={pos.day.id} highlight />
        </section>
      )}

      {pos.currentStop && (
        <section className="space-y-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-muted">
            Agora · desde {pos.currentStop.time}
          </h2>
          <StopCard stop={pos.currentStop} dayId={pos.day.id} />
        </section>
      )}

      <Link
        href={`/roteiro/${pos.day.id}`}
        className="flex items-center justify-center gap-1.5 rounded-2xl border border-hairline bg-surface py-3 text-[13px] font-medium"
      >
        Ver o dia completo
        <ArrowRight size={15} />
      </Link>
    </>
  );
}

function AfterTrip() {
  const state = useSyncStore((s) => s.state);
  const settings = useSettings();
  const expenses = activeExpenses(state);
  const totalJpy = expenses.reduce((acc, e) => acc + e.amountJpy, 0);
  const comprasDone = COMPRAS_ITEMS.filter(
    (i) => state.checklist[i.id]?.checked,
  ).length;

  return (
    <div className="rounded-3xl bg-surface border border-hairline px-5 py-6 space-y-3">
      <p className="font-jp text-[12px] tracking-[0.4em] text-muted">
        おかえりなさい
      </p>
      <h1 className="text-2xl font-bold">Bem-vindos de volta!</h1>
      <p className="text-[14px] flex items-center gap-2">
        <Wallet size={16} className="text-gold" />
        Total gasto: <strong>{fmtJpy(totalJpy)}</strong> (
        {fmtBrl(totalJpy * effectiveRate(settings).rate)})
      </p>
      <p className="text-[14px] flex items-center gap-2">
        <ListChecks size={16} className="text-matcha" />
        Compras concluídas: {comprasDone} de {COMPRAS_ITEMS.length}
      </p>
    </div>
  );
}

export default function AgoraPage() {
  const pos = useTripPosition();
  if (!pos) {
    return <div className="pt-10 text-center text-muted text-sm">Carregando…</div>;
  }

  return (
    <div className="space-y-4">
      <Clocks pos={pos} />
      {pos.phase === 'before' && <BeforeTrip pos={pos} />}
      {pos.phase === 'during' && <DuringTrip pos={pos} />}
      {pos.phase === 'after' && <AfterTrip />}
      <RateWidget />
    </div>
  );
}

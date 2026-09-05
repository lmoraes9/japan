'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, Navigation, Compass, Clock, Footprints, LocateFixed } from 'lucide-react';
import { ALL_DAYS } from '@/data/days';
import { placeMapByStopId, thumbOf } from '@/data/placeMaps';
import { resolvePosition, formatCountdown } from '@/lib/now';
import { navigateUrl } from '@/lib/mapsLinks';
import { stopPhoto } from '@/lib/covers';
import { Rich } from '@/components/Rich';
import { LastReturn } from '@/components/LastReturn';

const KIND_LABEL: Record<string, string> = {
  sight: 'lugar',
  temple: 'templo',
  food: 'comida',
  transit: 'trem',
  shopping: 'compras',
  flight: 'voo',
  hotel: 'hotel',
  view: 'vista',
  note: 'nota',
};

function toMin(t: string) {
  const [h, m] = t.split(':').map(Number);
  return (h < 4 ? h + 24 : h) * 60 + m;
}

function Rua() {
  const params = useSearchParams();
  const router = useRouter();
  const pos = useMemo(() => resolvePosition(), []);

  // dia: da URL, senão o de hoje, senão o primeiro
  const day = ALL_DAYS.find((d) => d.id === params.get('day')) ?? pos.day ?? ALL_DAYS[0];
  const stops = useMemo(() => [...day.stops].sort((a, b) => toMin(a.time) - toMin(b.time)), [day]);
  const isToday = pos.day?.id === day.id;

  // parada inicial: da URL, senão a próxima de hoje, senão a primeira
  const initial = (() => {
    const fromUrl = stops.findIndex((s) => s.id === params.get('stop'));
    if (fromUrl >= 0) return fromUrl;
    if (isToday && pos.nextStop) return Math.max(0, stops.findIndex((s) => s.id === pos.nextStop!.id));
    if (isToday && pos.currentStop) return Math.max(0, stops.findIndex((s) => s.id === pos.currentStop!.id));
    return 0;
  })();
  const [i, setI] = useState(initial);
  const stop = stops[i];
  const next = stops[i + 1];

  // relógio ao vivo, para a contagem regressiva
  const [now, setNow] = useState(() => resolvePosition());
  useEffect(() => {
    const t = setInterval(() => setNow(resolvePosition()), 30_000);
    return () => clearInterval(t);
  }, []);
  const nowMin = now.jst.hour < 4 ? (now.jst.hour + 24) * 60 + now.jst.minute : now.jst.hour * 60 + now.jst.minute;
  const delta = isToday ? toMin(stop.time) - nowMin : undefined;

  // teclado e gestos simples
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setI((v) => Math.min(stops.length - 1, v + 1));
      if (e.key === 'ArrowLeft') setI((v) => Math.max(0, v - 1));
      if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [stops.length, router]);
  const [touchX, setTouchX] = useState<number | null>(null);

  // mantém a tela acesa enquanto estiver aberto (onde o navegador deixa)
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    (navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } }).wakeLock
      ?.request('screen')
      .then((l) => { lock = l; })
      .catch(() => {});
    return () => { void lock?.release(); };
  }, []);

  const nav = navigateUrl(stop);
  const map = placeMapByStopId(stop.id);
  const photo = stopPhoto(stop);
  const eat = stop.eat?.[0]?.items.slice(0, 3);

  return (
    <div
      className="flex min-h-[100svh] flex-col bg-background"
      onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (dx < -60) setI((v) => Math.min(stops.length - 1, v + 1));
        if (dx > 60) setI((v) => Math.max(0, v - 1));
        setTouchX(null);
      }}
    >
      {/* topo: relógio, dia, sair */}
      <div className="flex items-center justify-between px-5 pb-2 pt-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 14px)' }}>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
            {new Intl.DateTimeFormat('pt-BR', { timeZone: 'Asia/Tokyo', weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${day.date}T12:00:00+09:00`))}
            {' · '}{i + 1} de {stops.length}
          </p>
          <p className="font-mono text-[30px] font-bold leading-none tabular-nums">{now.jst.time}</p>
        </div>
        <Link href={`/roteiro/${day.id}#${stop.id}`} aria-label="Sair do modo rua" className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-surface">
          <X size={22} />
        </Link>
      </div>

      {/* a parada */}
      <div className="flex flex-1 flex-col px-5">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[44px] font-bold leading-none tabular-nums text-accent">{stop.time}</span>
          <span className="font-mono text-[12px] uppercase tracking-widest text-muted">{stop.timeLabel ?? KIND_LABEL[stop.kind]}</span>
          {delta !== undefined && (
            <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[12px] font-semibold ${delta < 0 ? 'bg-surface-2 text-muted' : delta < 30 ? 'bg-accent text-white' : 'bg-surface-2'}`}>
              <Clock size={12} /> {delta < 0 ? 'começou' : formatCountdown(delta)}
            </span>
          )}
        </div>

        <h1 className="mt-3 text-[30px] font-bold leading-[1.1] tracking-tight">{stop.name}</h1>
        {stop.jp && <p className="mt-1.5 font-jp text-[28px] leading-snug text-foreground/85">{stop.jp}</p>}

        {stop.facts && (
          <p className="mt-3 font-mono text-[14px] leading-relaxed text-foreground/80">
            <Rich text={stop.facts} />
          </p>
        )}

        {eat && eat.length > 0 && (
          <ul className="mt-3 space-y-1 text-[15px] leading-snug">
            {eat.map((it) => (
              <li key={it.name}>
                <strong>{it.name}</strong>
                <span className="text-muted"> · {it.note.split('·')[0].trim()}</span>
              </li>
            ))}
          </ul>
        )}

        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbOf(photo)} alt="" className="mt-4 h-20 w-20 rounded-2xl object-cover" />
        )}

        <div className="mt-4 flex flex-wrap gap-2.5">
          {nav && (
            <a href={nav} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-accent px-5 py-3.5 text-[17px] font-semibold text-white shadow-md">
              <Navigation size={19} /> Navegar
            </a>
          )}
          {map && (
            <Link href={`/lugar/${map.id}`} className="inline-flex items-center gap-2 rounded-2xl border-2 border-accent px-5 py-3.5 text-[17px] font-semibold text-accent">
              <Compass size={19} /> Mapa
            </Link>
          )}
        </div>

        {next && (
          <p className="mt-5 text-[14px] text-muted">
            Depois: <strong className="text-foreground">{next.time}</strong> · {next.name}
          </p>
        )}

        {isToday && day.lastReturn && now.jst.hour >= 14 && (
          <div className="mt-4">
            <LastReturn items={day.lastReturn} nowMin={now.jst.hour * 60 + now.jst.minute} />
          </div>
        )}
      </div>

      {/* rodapé: anterior / próximo */}
      <div className="flex items-center gap-3 px-5 pb-6 pt-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}>
        <button
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="flex h-14 flex-1 items-center justify-center gap-1 rounded-2xl border border-hairline bg-surface text-[15px] font-semibold disabled:opacity-30"
        >
          <ChevronLeft size={20} /> Anterior
        </button>
        <button
          onClick={() => setI((v) => Math.min(stops.length - 1, v + 1))}
          disabled={i === stops.length - 1}
          className="flex h-14 flex-1 items-center justify-center gap-1 rounded-2xl bg-foreground text-[15px] font-semibold text-background disabled:opacity-30"
        >
          Próxima <ChevronRight size={20} />
        </button>
      </div>
      <p className="pb-3 text-center text-[11px] text-muted">
        <Footprints size={11} className="mr-1 inline" />
        deslize para os lados · <LocateFixed size={11} className="mx-1 inline" />
        a tela fica acesa enquanto isto estiver aberto
      </p>
    </div>
  );
}

export default function RuaPage() {
  return (
    <Suspense fallback={<div className="pt-10 text-center text-sm text-muted">Carregando…</div>}>
      <Rua />
    </Suspense>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';
import { Navigation, X, WifiOff, Image as ImageIcon, Star } from 'lucide-react';
import Link from 'next/link';
import { ALL_DAYS } from '@/data/days';
import { STAGES } from '@/data/trip';
import type { Day, Stop } from '@/data/types';
import { itineraryDate, stopsEmOrdem } from '@/lib/now';
import { navigateUrl, photosUrl } from '@/lib/mapsLinks';
import { comidaResolvida, type ComidaResolvida } from '@/lib/comida';
import { cidadeDe } from '@/lib/places';
import { Rich } from './Rich';
import { EatBlocks } from './EatBlocks';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID';

function DaySelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
      {ALL_DAYS.map((d) => {
        const stage = STAGES.find((s) => s.id === d.stageId)!;
        const active = d.id === selected;
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-mono font-medium transition-colors ${
              active ? 'text-white' : 'bg-surface text-muted border-hairline'
            }`}
            style={
              active
                ? { background: stage.color, borderColor: stage.color }
                : undefined
            }
          >
            {d.date.slice(8)}/{d.date.slice(5, 7)}
          </button>
        );
      })}
    </div>
  );
}

function FitBounds({ stops, focus }: { stops: Stop[]; focus?: Stop }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (focus?.coords) {
      map.panTo(focus.coords);
      map.setZoom(16);
      return;
    }
    const pts = stops.filter((s) => s.coords);
    if (pts.length === 0) return;
    if (pts.length === 1) {
      map.panTo(pts[0].coords!);
      map.setZoom(14);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    pts.forEach((s) => bounds.extend(s.coords!));
    map.fitBounds(bounds, 48);
  }, [map, stops, focus]);
  return null;
}

/**
 * A ficha de um lugar de comer do catálogo, aberta pela estrela. Diz de que dia
 * ele é — porque a graça das estrelas é justamente mostrar, no mapa de hoje, o
 * que estava marcado para outro dia e fica aqui perto.
 */
function ComidaSheet({ item, onClose }: { item: ComidaResolvida; onClose: () => void }) {
  return (
    <div className="absolute bottom-0 inset-x-0 z-10 rounded-t-3xl bg-surface border-t border-hairline p-4 shadow-2xl max-h-[70%] overflow-y-auto">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold font-semibold">
            ★ {item.cat} · {item.bairro}
          </p>
          <h3 className="font-semibold text-[15px] leading-snug">
            {item.nome}
            {item.jp && <span className="font-jp font-normal text-muted text-[12px] ml-1.5">{item.jp}</span>}
          </h3>
        </div>
        <button onClick={onClose} aria-label="Fechar" className="text-muted">
          <X size={18} />
        </button>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {item.rotulos.map((r) => (
          <span
            key={r}
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium leading-tight ${
              r === 'a pedido'
                ? 'border-matcha/50 bg-matcha/15 text-matcha'
                : r === 'especialidade local'
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-hairline bg-surface-2 text-muted'
            }`}
          >
            {r === 'especialidade local' ? `⭐ ${r}` : r === 'a pedido' ? `✋ ${r}` : r}
          </span>
        ))}
        {item.preco && <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] font-semibold text-gold">{item.preco}</span>}
      </div>
      <p className="text-[13px] leading-relaxed mt-2 text-foreground/90">
        <Rich text={item.nota} />
      </p>
      <p className="mt-2 text-[11px] text-muted">
        No roteiro em{' '}
        <Link href={`/roteiro/${item.dayId}#${item.stopId}`} className="font-medium text-accent">
          {item.dataCurta} · {item.refeicao}
        </Link>
        {item.plano === 'marcado' ? ' — está marcado' : item.plano === 'plano B' ? ' — plano B' : ' — uma das opções'}
      </p>
      <div className="mt-3 flex gap-2">
        <a href={item.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-accent text-white text-[13px] font-medium px-4 py-2">
          <Navigation size={14} />
          Navegar até aqui
        </a>
        <a href={item.fotosUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-hairline text-[13px] font-medium px-4 py-2">
          <ImageIcon size={14} />
          Fotos
        </a>
      </div>
    </div>
  );
}

function StopSheet({
  stop,
  dayId,
  onClose,
}: {
  stop: Stop;
  dayId: string;
  onClose: () => void;
}) {
  const nav = navigateUrl(stop);
  const photos = stop.kind !== 'food' || stop.jp ? photosUrl(stop) : undefined;
  return (
    <div className="absolute bottom-0 inset-x-0 z-10 rounded-t-3xl bg-surface border-t border-hairline p-4 shadow-2xl max-h-[70%] overflow-y-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[12px] text-accent font-semibold">
            {stop.time}
            {stop.timeLabel ? ` · ${stop.timeLabel}` : ''}
          </p>
          <h3 className="font-semibold text-[15px] leading-snug">
            {stop.name}
            {stop.jp && (
              <span className="font-jp font-normal text-muted text-[12px] ml-1.5">
                {stop.jp}
              </span>
            )}
          </h3>
        </div>
        <button onClick={onClose} aria-label="Fechar" className="text-muted">
          <X size={18} />
        </button>
      </div>
      {stop.facts && (
        <p className="font-mono text-[11px] text-muted mt-1.5">
          <Rich text={stop.facts} />
        </p>
      )}
      {stop.paragraphs?.[0] && (
        <p className="text-[13px] leading-relaxed mt-2 text-foreground/90">
          <Rich text={stop.paragraphs[0]} />
        </p>
      )}
      {stop.eat && <EatBlocks blocks={stop.eat} stopId={stop.id} dayId={dayId} />}
      <div className="mt-3 flex gap-2">
        {nav && (
          <a
            href={nav}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent text-white text-[13px] font-medium px-4 py-2"
          >
            <Navigation size={14} />
            Navegar até aqui
          </a>
        )}
        {photos && (
          <a
            href={photos}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-hairline text-[13px] font-medium px-4 py-2 text-foreground/80"
          >
            <ImageIcon size={14} />
            Fotos
          </a>
        )}
      </div>
    </div>
  );
}

function OfflineList({ day }: { day: Day }) {
  return (
    <div className="space-y-2.5">
      <div className="rounded-2xl border border-hairline bg-surface-2 p-3.5 flex items-center gap-2.5 text-[13px]">
        <WifiOff size={16} className="text-muted shrink-0" />
        O mapa precisa de internet. Aqui está a lista do dia — os botões
        funcionam assim que a conexão voltar.
      </div>
      {stopsEmOrdem(day.stops).map((s, i) => {
        const nav = navigateUrl(s);
        return (
          <div
            key={s.id}
            className="rounded-2xl border border-hairline bg-surface p-3.5 flex items-center gap-3"
          >
            <span className="w-6 h-6 rounded-full bg-accent text-white text-[12px] font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold leading-snug">
                {s.time} · {s.name}
              </p>
            </div>
            {nav && (
              <a
                href={nav}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent shrink-0"
                aria-label="Navegar"
              >
                <Navigation size={17} />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function MapScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [online, setOnline] = useState(true);

  const defaultDay = useMemo(() => {
    const q = searchParams.get('day');
    if (q && ALL_DAYS.some((d) => d.id === q)) return q;
    const today = ALL_DAYS.find((d) => d.date === itineraryDate());
    return today?.id ?? ALL_DAYS[0].id;
  }, [searchParams]);

  const [dayId, setDayId] = useState(defaultDay);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [selectedComida, setSelectedComida] = useState<ComidaResolvida | null>(null);
  const [estrelas, setEstrelas] = useState(true);
  const comida = useMemo(() => comidaResolvida(), []);

  const day = ALL_DAYS.find((d) => d.id === dayId)!;
  const stage = STAGES.find((s) => s.id === day.stageId)!;
  const pinStops = day.stops.filter((s) => s.coords);
  // as estrelas: todo lugar de comer do catálogo na cidade deste dia, de
  // qualquer dia — é o que responde "o lugar de hoje fechou, o que tem aqui perto?"
  const cidadeDoDia = cidadeDe('', day.id);
  const estrelasDoDia = estrelas ? comida.filter((c) => c.coords && c.cidade === cidadeDoDia) : [];

  const focusStopId = searchParams.get('stop');
  const focusStop = focusStopId
    ? day.stops.find((s) => s.id === focusStopId)
    : undefined;

  useEffect(() => {
    setDayId(defaultDay);
  }, [defaultDay]);

  useEffect(() => {
    if (focusStop) setSelectedStop(focusStop);
  }, [focusStop]);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const selectDay = (id: string) => {
    setDayId(id);
    setSelectedStop(null);
    setSelectedComida(null);
    router.replace(`/mapa?day=${id}`, { scroll: false });
  };

  const showMap = online && API_KEY;

  return (
    <div className="space-y-3 flex flex-col" style={{ minHeight: 'calc(100dvh - 140px)' }}>
      <header className="flex items-center justify-between gap-3 pt-1">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">Mapa</h1>
          <p className="truncate text-[12px] text-muted">{day.title}</p>
        </div>
        <button
          type="button"
          aria-pressed={estrelas}
          onClick={() => {
            setEstrelas((v) => !v);
            setSelectedComida(null);
          }}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold ${
            estrelas ? 'border-gold bg-gold text-white' : 'border-hairline bg-surface text-muted'
          }`}
        >
          <Star size={13} fill={estrelas ? 'currentColor' : 'none'} />
          comida por perto
        </button>
      </header>
      <DaySelector selected={dayId} onSelect={selectDay} />

      {!API_KEY && online && (
        <div className="rounded-2xl border border-gold/50 bg-gold/10 p-3.5 text-[13px]">
          Falta configurar a <strong>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</strong> —
          veja o README. Enquanto isso, a lista abaixo funciona com deep links
          para o app do Google Maps.
        </div>
      )}

      {showMap ? (
        <div className="relative flex-1 rounded-3xl overflow-hidden border border-hairline min-h-[420px]">
          <APIProvider apiKey={API_KEY}>
            <GoogleMap
              mapId={MAP_ID}
              defaultCenter={{ lat: 35.68, lng: 139.75 }}
              defaultZoom={12}
              gestureHandling="greedy"
              disableDefaultUI
              className="w-full h-full absolute inset-0"
            >
              <FitBounds stops={pinStops} focus={focusStop} />
              {estrelasDoDia.map((c) => (
                <AdvancedMarker
                  key={c.id}
                  position={c.coords!}
                  title={c.nome}
                  onClick={() => {
                    setSelectedStop(null);
                    setSelectedComida(c);
                  }}
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-white shadow-md"
                    style={{ background: c.pedido ? 'var(--matcha)' : 'var(--gold)' }}
                  >
                    <Star size={12} fill="currentColor" />
                  </div>
                </AdvancedMarker>
              ))}
              {pinStops.map((s, i) => (
                <AdvancedMarker
                  key={s.id}
                  position={s.coords!}
                  onClick={() => {
                    setSelectedComida(null);
                    setSelectedStop(s);
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full text-white text-[12px] font-bold flex items-center justify-center border-2 border-white shadow-md"
                    style={{ background: stage.color }}
                  >
                    {day.stops.indexOf(s) + 1}
                  </div>
                </AdvancedMarker>
              ))}
            </GoogleMap>
          </APIProvider>
          {selectedStop && (
            <StopSheet
              stop={selectedStop}
              dayId={day.id}
              onClose={() => setSelectedStop(null)}
            />
          )}
          {selectedComida && !selectedStop && (
            <ComidaSheet item={selectedComida} onClose={() => setSelectedComida(null)} />
          )}
          {estrelas && !selectedStop && !selectedComida && estrelasDoDia.length > 0 && (
            <p className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[11px] text-white backdrop-blur">
              ★ {estrelasDoDia.length} lugares de comer em {cidadeDoDia}, de todos os dias
            </p>
          )}
        </div>
      ) : (
        <OfflineList day={day} />
      )}
    </div>
  );
}

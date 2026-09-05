'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Landmark,
  DoorOpen,
  Torus,
  PawPrint,
  Gem,
  Waves,
  Eye,
  Mountain,
  Train,
  UtensilsCrossed,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Maximize2,
  Navigation,
  Footprints,
} from 'lucide-react';
import type { HotspotKind, PlaceHotspot, PlaceMap } from '@/data/placeMaps';
import { MAP_COLORS, photoKey, thumbOf } from '@/data/placeMaps';
import { PLACE_PHOTOS } from '@/data/placePhotos.generated';
import { searchUrl } from '@/lib/mapsLinks';
import { Rich } from './Rich';

const KIND_ICON: Record<HotspotKind, typeof Landmark> = {
  gate: DoorOpen,
  temple: Landmark,
  hall: Landmark,
  fox: PawPrint,
  torii: Torus,
  stone: Gem,
  water: Waves,
  view: Eye,
  peak: Mountain,
  station: Train,
  food: UtensilsCrossed,
};

/** raio do marcador com foto, em unidades do viewBox */
const R = 15;
const K_MIN = 1;
const K_MAX = 4;

interface View {
  k: number;
  tx: number;
  ty: number;
}

export function PlaceMapView({ map }: { map: PlaceMap }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<View>({ k: 1, tx: 0, ty: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const [vx, vy, vw, vh] = useMemo(
    () => map.viewBox.split(' ').map(Number) as [number, number, number, number],
    [map.viewBox],
  );

  const index = map.hotspots.findIndex((h) => h.id === selectedId);
  const selected = index >= 0 ? map.hotspots[index] : null;
  const photoOf = useCallback(
    (h: PlaceHotspot) => PLACE_PHOTOS[photoKey(map.id, h.id)],
    [map.id],
  );

  // ── zoom e pan ──────────────────────────────────────────────────────────
  const clamp = useCallback(
    (v: View): View => {
      const k = Math.min(K_MAX, Math.max(K_MIN, v.k));
      // o conteúdo nunca sai da janela do viewBox
      const tx = Math.min(vx * (1 - k), Math.max((vx + vw) * (1 - k), v.tx));
      const ty = Math.min(vy * (1 - k), Math.max((vy + vh) * (1 - k), v.ty));
      return { k, tx, ty };
    },
    [vx, vy, vw, vh],
  );

  /**
   * Geometria do "meet": o viewBox é escalado pelo menor fator e centralizado
   * no elemento. ratio = unidades do viewBox por pixel; ox/oy = margem que sobra.
   */
  const geometry = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return { rect, r: 1, ox: 0, oy: 0 };
    const scale = Math.min(rect.width / vw, rect.height / vh);
    return {
      rect,
      r: 1 / scale,
      ox: (rect.width - vw * scale) / 2,
      oy: (rect.height - vh * scale) / 2,
    };
  };
  const ratio = () => geometry().r;

  /** ponto de tela (px) → coordenada da janela do viewBox (antes da transformação) */
  const toWindow = (clientX: number, clientY: number) => {
    const { rect, r, ox, oy } = geometry();
    if (!rect) return { x: vx + vw / 2, y: vy + vh / 2 };
    return { x: vx + (clientX - rect.left - ox) * r, y: vy + (clientY - rect.top - oy) * r };
  };

  const zoomAbout = useCallback(
    (px: number, py: number, k2: number, base: View) => {
      const k = Math.min(K_MAX, Math.max(K_MIN, k2));
      const f = k / base.k;
      return clamp({ k, tx: px - (px - base.tx) * f, ty: py - (py - base.ty) * f });
    },
    [clamp],
  );

  const zoomStep = (dir: 1 | -1) => {
    setView((v) => zoomAbout(vx + vw / 2, vy + vh / 2, v.k * (dir > 0 ? 1.5 : 1 / 1.5), v));
  };
  const reset = () => {
    autoZoom.current = false;
    setView({ k: 1, tx: 0, ty: 0 });
  };

  /** zoom que o próprio app deu ao selecionar um ponto — desfeito ao fechar */
  const autoZoom = useRef(false);

  /** aproxima e centraliza um ponto (o painel cobre a metade de baixo da tela) */
  const focusOn = useCallback(
    (h: PlaceHotspot) => {
      setView((v) => {
        if (v.k <= 1.01) autoZoom.current = true;
        const k = Math.max(v.k, 1.8);
        // centro um pouco acima do meio, porque o painel toma o rodapé
        return clamp({ k, tx: vx + vw / 2 - h.x * k, ty: vy + vh * 0.46 - h.y * k });
      });
    },
    [clamp, vx, vy, vw, vh],
  );

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinchStart = useRef<{ dist: number; view: View } | null>(null);
  const moved = useRef(false);
  const lastTap = useRef<{ t: number; x: number; y: number } | null>(null);
  const viewRef = useRef(view);
  viewRef.current = view;

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = false;
    if (pointers.current.size === 1) {
      panStart.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
      pinchStart.current = null;
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), view: viewRef.current };
      panStart.current = null;
    }
    // só captura quando vamos de fato arrastar: com zoom 1, o dedo é do scroll da página
    if (view.k > 1.01 || pointers.current.size === 2) {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    }
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = toWindow((a.x + b.x) / 2, (a.y + b.y) / 2);
      const { dist: d0, view: v0 } = pinchStart.current;
      moved.current = true;
      setView(zoomAbout(mid.x, mid.y, v0.k * (dist / d0), v0));
      return;
    }

    if (pointers.current.size === 1 && panStart.current && viewRef.current.k > 1.01) {
      const r = ratio();
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      if (Math.hypot(dx, dy) > 4) moved.current = true;
      setView((v) =>
        clamp({ k: v.k, tx: panStart.current!.tx + dx * r, ty: panStart.current!.ty + dy * r }),
      );
    }
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) {
      panStart.current = null;
      // toque duplo: aproxima no ponto, ou volta ao todo
      if (!moved.current && e.pointerType === 'touch') {
        const now = Date.now();
        const last = lastTap.current;
        if (last && now - last.t < 320 && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 24) {
          const p = toWindow(e.clientX, e.clientY);
          setView((v) => (v.k > 1.01 ? { k: 1, tx: 0, ty: 0 } : zoomAbout(p.x, p.y, 2.2, v)));
          lastTap.current = null;
          return;
        }
        lastTap.current = { t: now, x: e.clientX, y: e.clientY };
      }
    }
  };

  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    // no desktop, só com Ctrl/⌘ — a rodinha sozinha continua rolando a página
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const p = toWindow(e.clientX, e.clientY);
    setView((v) => zoomAbout(p.x, p.y, v.k * (e.deltaY < 0 ? 1.15 : 1 / 1.15), v));
  };

  const select = useCallback(
    (h: PlaceHotspot | null) => {
      setSelectedId(h?.id ?? null);
      if (h) focusOn(h);
      else if (autoZoom.current) {
        autoZoom.current = false;
        setView({ k: 1, tx: 0, ty: 0 });
      }
    },
    [focusOn],
  );

  const step = (dir: 1 | -1) => {
    if (index < 0) return;
    const next = map.hotspots[(index + dir + map.hotspots.length) % map.hotspots.length];
    select(next);
  };

  // setas do teclado navegam entre os pontos; Esc fecha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selected) return;
      if (e.key === 'Escape') select(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, index]);

  const zoomed = view.k > 1.01;
  const Icon = selected ? KIND_ICON[selected.kind] : Landmark;
  const selectedPhoto = selected ? photoOf(selected) : undefined;
  const navQuery = selected
    ? (selected.mapQuery ?? `${selected.title.split(' — ')[0]} ${map.title}`)
    : '';

  return (
    <div className={`space-y-3 ${selected ? 'pb-[46svh]' : ''}`}>
      {/* ── o mapa ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface shadow-sm">
        <svg
          ref={svgRef}
          viewBox={map.viewBox}
          role="img"
          aria-label={`Mapa ilustrado de ${map.title}`}
          className={`block w-full select-none transition-[height] duration-300 ${
            selected ? 'h-[40svh]' : 'h-[64svh] max-h-[600px]'
          }`}
          preserveAspectRatio="xMidYMid meet"
          style={{ touchAction: zoomed ? 'none' : 'pan-y' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
        >
          <defs>
            <radialGradient id="paper" cx="50%" cy="45%" r="75%">
              <stop offset="0%" style={{ stopColor: 'var(--surface)' }} />
              <stop offset="100%" style={{ stopColor: 'var(--surface-2)' }} />
            </radialGradient>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.6" floodColor="#000" floodOpacity="0.22" />
            </filter>
            <filter id="marker-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.35" />
            </filter>
            <symbol id="tree" viewBox="-10 -24 20 26">
              <line x1="0" y1="0" x2="0" y2="-7" stroke="var(--matcha)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="0" cy="-12" r="7.5" fill="var(--matcha)" />
              <circle cx="-4.5" cy="-8" r="5.5" fill="var(--matcha)" />
              <circle cx="4.5" cy="-8.5" r="5.5" fill="var(--matcha)" />
              <circle cx="-2" cy="-14" r="3" fill="var(--surface)" opacity="0.35" />
            </symbol>
          </defs>

          {/* o papel vai além do viewBox para preencher as laterais do card */}
          <rect x={vx - 2000} y={vy - 2000} width={vw + 4000} height={vh + 4000} fill="url(#paper)" />

          <g
            style={{
              transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.k})`,
              transition: pinchStart.current || panStart.current ? 'none' : 'transform 220ms ease-out',
            }}
          >
            {map.scenery.map((s, i) => (
              <path
                key={i}
                d={s.d}
                fill={s.fill ?? 'none'}
                stroke={s.stroke ?? 'none'}
                strokeWidth={s.width}
                strokeDasharray={s.dash}
                strokeLinecap={s.round ? 'round' : undefined}
                strokeLinejoin={s.round ? 'round' : undefined}
                opacity={s.opacity}
                filter={s.stroke && (s.width ?? 0) >= 8 && !s.dash ? 'url(#soft)' : undefined}
              />
            ))}

            {map.trees?.map((t, i) => (
              <use
                key={i}
                href="#tree"
                x={t.x - t.s * 0.5}
                y={t.y - t.s * 1.1}
                width={t.s}
                height={t.s * 1.3}
                opacity={0.55}
              />
            ))}

            {map.hotspots.map((h) => {
              const active = h.id === selectedId;
              const photo = photoOf(h);
              const labelX = h.side === 'right' ? h.x + R + 8 : h.x - R - 8;
              const clipId = `clip-${map.id}-${h.id}`;
              return (
                <g
                  key={h.id}
                  role="button"
                  tabIndex={0}
                  aria-label={h.title}
                  aria-pressed={active}
                  className="cursor-pointer outline-none"
                  onClick={() => {
                    if (moved.current) return;
                    select(active ? null : h);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      select(active ? null : h);
                    }
                  }}
                >
                  <text
                    x={labelX}
                    y={h.y + 4}
                    textAnchor={h.side === 'right' ? 'start' : 'end'}
                    fontSize={11.5}
                    fontWeight={active ? 700 : 500}
                    fill={active ? MAP_COLORS.ink : MAP_COLORS.muted}
                    paintOrder="stroke"
                    stroke="var(--surface)"
                    strokeWidth={3.5}
                    strokeLinejoin="round"
                  >
                    {h.label}
                  </text>

                  <g
                    style={{
                      transform: `translate(${h.x}px, ${h.y}px) scale(${active ? 1.3 : 1})`,
                      transition: 'transform 200ms ease-out',
                    }}
                  >
                    {active && (
                      <circle r={R + 4} fill="none" stroke={MAP_COLORS.vermilion} strokeWidth={2} opacity={0.6}>
                        <animate attributeName="r" values={`${R + 4};${R + 14};${R + 4}`} dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                    )}
                    {/* alvo de toque generoso */}
                    <circle r={R + 10} fill="transparent" />
                    <circle r={R + 3} fill="var(--surface)" filter="url(#marker-shadow)" />
                    {photo ? (
                      <>
                        <clipPath id={clipId}>
                          <circle r={R} />
                        </clipPath>
                        <image
                          href={thumbOf(photo)}
                          x={-R}
                          y={-R}
                          width={R * 2}
                          height={R * 2}
                          clipPath={`url(#${clipId})`}
                          preserveAspectRatio="xMidYMid slice"
                        />
                      </>
                    ) : (
                      <circle r={R} fill={active ? MAP_COLORS.vermilion : 'var(--surface-2)'} />
                    )}
                    <circle
                      r={R}
                      fill="none"
                      stroke={active ? MAP_COLORS.vermilion : 'var(--surface)'}
                      strokeWidth={active ? 2.5 : 1.5}
                    />
                    {/* número */}
                    <circle cx={R * 0.72} cy={-R * 0.72} r={7.5} fill={MAP_COLORS.vermilion} stroke="var(--surface)" strokeWidth={1.5} />
                    <text
                      x={R * 0.72}
                      y={-R * 0.72 + 3}
                      textAnchor="middle"
                      fontSize={8.5}
                      fontWeight={700}
                      fill="#fff"
                    >
                      {h.n}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* controles de zoom */}
        <div className="absolute right-2.5 top-2.5 flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface/90 shadow-sm backdrop-blur">
          <button onClick={() => zoomStep(1)} aria-label="Aproximar" className="flex h-9 w-9 items-center justify-center text-foreground/80 active:bg-surface-2">
            <Plus size={16} />
          </button>
          <button onClick={() => zoomStep(-1)} aria-label="Afastar" className="flex h-9 w-9 items-center justify-center border-t border-hairline text-foreground/80 active:bg-surface-2">
            <Minus size={16} />
          </button>
          <button onClick={reset} aria-label="Ver o mapa inteiro" className={`flex h-9 w-9 items-center justify-center border-t border-hairline active:bg-surface-2 ${zoomed ? 'text-accent' : 'text-muted'}`}>
            <Maximize2 size={15} />
          </button>
        </div>

        <p className="px-3.5 pb-2.5 pt-2 text-[10px] leading-snug text-muted">
          {map.legend}
          {' · '}
          <span className="text-foreground/60">pinça para aproximar, toque duplo para voltar</span>
        </p>
      </div>

      {/* ── painel do ponto ────────────────────────────────────────────── */}
      {selected ? (
        <div
          className="fixed inset-x-0 z-40 px-3 sheet-in"
          style={{ bottom: 'calc(58px + env(safe-area-inset-bottom))' }}
        >
          <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-hairline bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-hairline bg-surface-2/70 px-2 py-1.5">
              <button onClick={() => step(-1)} aria-label="Ponto anterior" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 active:bg-surface-2">
                <ChevronLeft size={20} />
              </button>
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                {index + 1} de {map.hotspots.length}
                {selected.walk && (
                  <span className="ml-2 normal-case tracking-normal text-foreground/60">· {selected.walk} a pé do anterior</span>
                )}
              </span>
              <div className="flex items-center">
                <button onClick={() => step(1)} aria-label="Próximo ponto" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 active:bg-surface-2">
                  <ChevronRight size={20} />
                </button>
                <button onClick={() => select(null)} aria-label="Fechar" className="flex h-9 w-9 items-center justify-center rounded-full text-muted active:bg-surface-2">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[42svh] overflow-y-auto overscroll-contain px-4 pb-4 pt-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon size={17} strokeWidth={1.8} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[16px] font-bold leading-snug">
                    {selected.title}
                    {selected.jp && (
                      <span className="ml-1.5 font-jp text-[12px] font-normal text-muted">{selected.jp}</span>
                    )}
                  </h2>
                  {selected.facts && (
                    <p className="mt-1 font-mono text-[11px] leading-relaxed text-muted">
                      <Rich text={selected.facts} />
                    </p>
                  )}
                </div>
              </div>

              {selectedPhoto && (
                <figure className="mt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPhoto.src}
                    alt={selected.photoCaption ?? selected.title}
                    loading="lazy"
                    decoding="async"
                    className="max-h-[32svh] w-full rounded-2xl border border-hairline bg-surface-2 object-cover"
                  />
                  <figcaption className="mt-1.5 text-[11px] leading-snug text-muted">
                    {selected.photoCaption && (
                      <span className="block text-foreground/80">{selected.photoCaption}</span>
                    )}
                    <a href={selectedPhoto.source} target="_blank" rel="noopener noreferrer" className="underline decoration-hairline underline-offset-2">
                      {selectedPhoto.credit} · {selectedPhoto.license} · Wikimedia Commons
                    </a>
                  </figcaption>
                </figure>
              )}

              {selected.paragraphs.map((p, i) => (
                <p key={i} className="mt-2.5 text-[13.5px] leading-relaxed text-foreground/90">
                  <Rich text={p} />
                </p>
              ))}

              <div className="mt-3.5 flex flex-wrap gap-2">
                <a
                  href={searchUrl(navQuery)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[12px] font-medium text-white"
                >
                  <Navigation size={13} />
                  Navegar até aqui
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="px-6 text-center text-[12px] text-muted">
          Toquem numa foto do mapa para ver o que é aquilo e a história.
        </p>
      )}

      {/* ── lista, na ordem do percurso ────────────────────────────────── */}
      <div className="overflow-hidden rounded-3xl border border-hairline bg-surface">
        <div className="border-b border-hairline bg-surface-2 px-4 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Na ordem do percurso</span>
        </div>
        {map.hotspots.map((h) => {
          const HIcon = KIND_ICON[h.kind];
          const photo = photoOf(h);
          const active = h.id === selectedId;
          return (
            <div key={h.id}>
              {h.walk && (
                <div className="flex items-center gap-1.5 border-b border-hairline bg-surface-2/50 px-4 py-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                  <Footprints size={11} />
                  {h.walk} a pé
                </div>
              )}
            <button
              onClick={() => select(active ? null : h)}
              className={`flex w-full items-center gap-3 border-b border-hairline px-3 py-2 text-left active:bg-surface-2 ${
                active ? 'bg-accent-soft/60' : ''
              }`}
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumbOf(photo)} alt="" loading="lazy" decoding="async" className="h-11 w-11 shrink-0 rounded-xl object-cover" />
              ) : (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-muted">
                  <HIcon size={18} strokeWidth={1.7} />
                </span>
              )}
              <span className="w-5 shrink-0 font-mono text-[12px] font-semibold tabular-nums text-accent">{h.n}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium">{h.title}</span>
                {h.jp && <span className="block font-jp text-[11px] text-muted">{h.jp}</span>}
              </span>
              <ChevronRight size={16} className="shrink-0 text-muted" />
            </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

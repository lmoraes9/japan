'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface View {
  k: number;
  tx: number;
  ty: number;
}

/**
 * Zoom e pan de um svg com viewBox fixo: pinça, arrasto (só quando há zoom),
 * toque duplo, roda com Ctrl, e enquadramentos programáticos. O mesmo motor
 * do mapa ilustrado, compartilhado pelo mapa das estações e pelos interiores.
 *
 * O clique nos filhos continua funcionando porque o svg só captura o ponteiro
 * quando o arrasto de fato começa — capturar já no toque faria o clique parar
 * no svg, e nenhum pino abriria.
 */
export function usePanZoom(viewBox: string, kMax = 4.5) {
  const [vx, vy, vw, vh] = useMemo(() => viewBox.split(' ').map(Number) as [number, number, number, number], [viewBox]);
  const [view, setView] = useState<View>({ k: 1, tx: 0, ty: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // trocar de mapa volta ao todo
  useEffect(() => {
    setView({ k: 1, tx: 0, ty: 0 });
  }, [viewBox]);

  const clamp = useCallback(
    (v: View): View => {
      const k = Math.min(kMax, Math.max(1, v.k));
      const tx = Math.min(vx * (1 - k), Math.max((vx + vw) * (1 - k), v.tx));
      const ty = Math.min(vy * (1 - k), Math.max((vy + vh) * (1 - k), v.ty));
      return { k, tx, ty };
    },
    [vx, vy, vw, vh, kMax],
  );

  const geometry = useCallback(() => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return { rect, r: 1, ox: 0, oy: 0 };
    const scale = Math.min(rect.width / vw, rect.height / vh);
    return { rect, r: 1 / scale, ox: (rect.width - vw * scale) / 2, oy: (rect.height - vh * scale) / 2 };
  }, [vw, vh]);

  const toWindow = useCallback(
    (clientX: number, clientY: number) => {
      const { rect, r, ox, oy } = geometry();
      if (!rect) return { x: vx + vw / 2, y: vy + vh / 2 };
      return { x: vx + (clientX - rect.left - ox) * r, y: vy + (clientY - rect.top - oy) * r };
    },
    [geometry, vx, vy, vw, vh],
  );

  const zoomAbout = useCallback(
    (px: number, py: number, k2: number, base: View) => {
      const k = Math.min(kMax, Math.max(1, k2));
      const f = k / base.k;
      return clamp({ k, tx: px - (px - base.tx) * f, ty: py - (py - base.ty) * f });
    },
    [clamp, kMax],
  );

  const zoomStep = useCallback(
    (dir: 1 | -1) => setView((v) => zoomAbout(vx + vw / 2, vy + vh / 2, v.k * (dir > 0 ? 1.5 : 1 / 1.5), v)),
    [zoomAbout, vx, vy, vw, vh],
  );
  const reset = useCallback(() => setView({ k: 1, tx: 0, ty: 0 }), []);

  /** enquadra uma caixa; `centroY` é a fração da altura onde o centro cai (0.44 deixa lugar para um painel embaixo) */
  const enquadrar = useCallback(
    (x0: number, y0: number, x1: number, y1: number, centroY = 0.5, margem = 70) => {
      const w = Math.max(60, x1 - x0 + margem * 2);
      const h = Math.max(60, y1 - y0 + margem * 2);
      const k = Math.min(kMax, Math.max(1, Math.min(vw / w, vh / h)));
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      setView(clamp({ k, tx: vx + vw / 2 - cx * k, ty: vy + vh * centroY - cy * k }));
    },
    [clamp, vx, vy, vw, vh, kMax],
  );

  /** aproxima um ponto, sem afastar se já está mais perto */
  const centrarEm = useCallback(
    (x: number, y: number, kMinimo = 2.2, centroY = 0.44) => {
      setView((v) => {
        const k = Math.max(v.k, kMinimo);
        return clamp({ k, tx: vx + vw / 2 - x * k, ty: vy + vh * centroY - y * k });
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
      panStart.current = { x: e.clientX, y: e.clientY, tx: viewRef.current.tx, ty: viewRef.current.ty };
      pinchStart.current = null;
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), view: viewRef.current };
      panStart.current = null;
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
      const r = geometry().r;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      if (Math.hypot(dx, dy) > 4 && !moved.current) {
        moved.current = true;
        (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      }
      setView((v) => clamp({ k: v.k, tx: panStart.current!.tx + dx * r, ty: panStart.current!.ty + dy * r }));
    }
  };
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) {
      panStart.current = null;
      if (!moved.current && e.pointerType === 'touch') {
        const now = Date.now();
        const last = lastTap.current;
        if (last && now - last.t < 320 && Math.hypot(e.clientX - last.x, e.clientY - last.y) < 24) {
          const p = toWindow(e.clientX, e.clientY);
          setView((v) => (v.k > 1.01 ? { k: 1, tx: 0, ty: 0 } : zoomAbout(p.x, p.y, 2.4, v)));
          lastTap.current = null;
          return;
        }
        lastTap.current = { t: now, x: e.clientX, y: e.clientY };
      }
    }
  };
  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const p = toWindow(e.clientX, e.clientY);
    setView((v) => zoomAbout(p.x, p.y, v.k * (e.deltaY < 0 ? 1.15 : 1 / 1.15), v));
  };

  const zoomed = view.k > 1.01;
  const arrastando = !!(pinchStart.current || panStart.current);

  return {
    view,
    setView,
    svgRef,
    box: { vx, vy, vw, vh },
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onWheel },
    zoomStep,
    reset,
    enquadrar,
    centrarEm,
    /** true enquanto o último gesto foi um arrasto — os cliques devem ignorar */
    moved,
    zoomed,
    arrastando,
    /** estilo do grupo transformado */
    transform: {
      transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.k})`,
      transition: arrastando ? 'none' : 'transform 240ms ease-out',
    } as const,
  };
}

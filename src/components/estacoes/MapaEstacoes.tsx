'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BedDouble, CalendarDays, ExternalLink, Maximize2, Minus, Navigation, Plus, Star, TrainFront } from 'lucide-react';
import { MAPAS_ESTACOES, mapaEstacoesById, desejoById } from '@/data/estacoes';
import type { Estacao, Linha, MapaEstacoes as Mapa, Ponto } from '@/data/estacoes/types';
import { STAGES } from '@/data/trip';
import { START, LEGS } from '@/data/legs';
import { formatDayLabel, itineraryDate } from '@/lib/now';
import { ALL_DAYS } from '@/data/days';
import { baseDaManha, navigateUrl, searchUrl } from '@/lib/mapsLinks';
import { diasDoMapa, infoDaParada, linhasDoDia, type DiaMapa } from '@/lib/estacoes/dias';
import { Legs } from '../Legs';
import { Rich } from '../Rich';
import { EatBlocks } from '../EatBlocks';
import { FolhaPonto, type AlturaFolha } from '../FolhaPonto';

const K_MIN = 1;
const K_MAX = 4.5;
/** raio do pino de um ponto */
const RP = 8;

interface View {
  k: number;
  tx: number;
  ty: number;
}

type Escolha = { tipo: 'ponto'; id: string } | { tipo: 'estacao'; id: string } | null;

const LARGURA: Record<Linha['modo'], number> = {
  jr: 8,
  shinkansen: 8,
  metro: 7,
  privada: 7,
  bonde: 5,
  onibus: 3.5,
  balsa: 4,
  cabo: 4,
  taxi: 2.5,
};

const TRACO: Partial<Record<Linha['modo'], string>> = {
  onibus: '7 5',
  balsa: '9 6',
  cabo: '3 5',
  taxi: '2 5',
};

/** que mapa abrir: o da etapa de hoje, ou Tóquio */
function mapaDeHoje(): string {
  const hoje = itineraryDate();
  const dia = ALL_DAYS.find((d) => d.date === hoje);
  if (!dia) return MAPAS_ESTACOES[0].id;
  return MAPAS_ESTACOES.find((m) => m.stageIds.includes(dia.stageId))?.id ?? MAPAS_ESTACOES[0].id;
}

const meio = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

export function MapaEstacoes() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const inicial = useMemo(() => {
    const q = searchParams.get('cidade');
    return q && mapaEstacoesById(q) ? q : mapaDeHoje();
  }, [searchParams]);

  const [cidadeId, setCidadeId] = useState(inicial);
  const mapa = mapaEstacoesById(cidadeId) ?? MAPAS_ESTACOES[0];
  const dias = useMemo(() => diasDoMapa(mapa), [mapa]);
  const hojeId = useMemo(() => {
    const hoje = itineraryDate();
    return ALL_DAYS.find((d) => d.date === hoje)?.id ?? null;
  }, []);

  const [diaId, setDiaId] = useState<string | null>(() => (dias.some((d) => d.dayId === hojeId) ? hojeId : null));
  const [escolha, setEscolha] = useState<Escolha>(null);
  const [altura, setAltura] = useState<AlturaFolha>('meia');
  const [view, setView] = useState<View>({ k: 1, tx: 0, ty: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const [vx, vy, vw, vh] = useMemo(() => mapa.viewBox.split(' ').map(Number) as [number, number, number, number], [mapa.viewBox]);

  const estacoes = useMemo(() => new Map(mapa.estacoes.map((e) => [e.id, e])), [mapa]);
  const ponto = useCallback((p: string | [number, number]) => {
    if (typeof p === 'string') {
      const e = estacoes.get(p);
      if (!e) throw new Error(`estação desconhecida no traçado: ${p}`);
      return { x: e.x, y: e.y };
    }
    return { x: p[0], y: p[1] };
  }, [estacoes]);

  /** o caminho de uma linha: reto entre estações, arredondado nas curvas sem estação */
  const caminho = useCallback(
    (l: Linha) => {
      const pts = l.tracado.map((p) => ({ ...ponto(p), curva: typeof p !== 'string' }));
      if (pts.length === 0) return '';
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        if (p.curva && i < pts.length - 1) {
          const m1 = meio(pts[i - 1], p);
          const m2 = meio(p, pts[i + 1]);
          d += ` L ${m1.x} ${m1.y} Q ${p.x} ${p.y} ${m2.x} ${m2.y}`;
        } else {
          d += ` L ${p.x} ${p.y}`;
        }
      }
      if (l.fechada) d += ' Z';
      return d;
    },
    [ponto],
  );

  /** cor da estação = cor da primeira linha que passa nela */
  const corDaEstacao = useCallback(
    (id: string) => mapa.linhas.find((l) => l.tracado.includes(id) && l.modo !== 'taxi')?.cor ?? 'var(--muted)',
    [mapa],
  );
  const linhasDaEstacao = useCallback((id: string) => mapa.linhas.filter((l) => l.tracado.includes(id) && l.modo !== 'taxi'), [mapa]);

  // ── o dia escolhido: o que acende e o que apaga ────────────────────────────
  const corDoDia = useMemo(() => new Map(dias.map((d) => [d.dayId, d.cor])), [dias]);
  const infoPonto = useMemo(() => new Map(mapa.pontos.map((p) => [p.id, infoDaParada(p)])), [mapa]);
  const diaDoPonto = (p: Ponto) => infoPonto.get(p.id)?.day.id ?? null;

  const linhasAcesas = useMemo(() => (diaId ? linhasDoDia(mapa, diaId) : null), [mapa, diaId]);
  const estacoesAcesas = useMemo(() => {
    if (!diaId) return null;
    const s = new Set<string>();
    for (const p of mapa.pontos) if (diaDoPonto(p) === diaId) s.add(p.estacaoId);
    const dia = ALL_DAYS.find((d) => d.id === diaId);
    for (const b of mapa.bases) if (dia && b.stageId === dia.stageId) s.add(b.estacaoId);
    return s;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapa, diaId, infoPonto]);

  const pontosVisiveis = useMemo(
    () => (diaId ? mapa.pontos.filter((p) => diaDoPonto(p) === diaId || p.desejoId) : mapa.pontos),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapa, diaId, infoPonto],
  );

  // ── zoom e pan (a mesma mecânica do mapa ilustrado) ────────────────────────
  const clamp = useCallback(
    (v: View): View => {
      const k = Math.min(K_MAX, Math.max(K_MIN, v.k));
      const tx = Math.min(vx * (1 - k), Math.max((vx + vw) * (1 - k), v.tx));
      const ty = Math.min(vy * (1 - k), Math.max((vy + vh) * (1 - k), v.ty));
      return { k, tx, ty };
    },
    [vx, vy, vw, vh],
  );

  const geometry = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return { rect, r: 1, ox: 0, oy: 0 };
    const scale = Math.min(rect.width / vw, rect.height / vh);
    return { rect, r: 1 / scale, ox: (rect.width - vw * scale) / 2, oy: (rect.height - vh * scale) / 2 };
  };
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
  const zoomStep = (dir: 1 | -1) => setView((v) => zoomAbout(vx + vw / 2, vy + vh / 2, v.k * (dir > 0 ? 1.5 : 1 / 1.5), v));
  const reset = () => setView({ k: 1, tx: 0, ty: 0 });

  /** enquadra uma caixa do viewBox; o painel toma o rodapé, então o centro sobe um pouco */
  const enquadrar = useCallback(
    (x0: number, y0: number, x1: number, y1: number, comPainel: boolean) => {
      const m = 70;
      const w = Math.max(60, x1 - x0 + m * 2);
      const h = Math.max(60, y1 - y0 + m * 2);
      const k = Math.min(K_MAX, Math.max(K_MIN, Math.min(vw / w, vh / h)));
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      setView(clamp({ k, tx: vx + vw / 2 - cx * k, ty: vy + vh * (comPainel ? 0.44 : 0.5) - cy * k }));
    },
    [clamp, vx, vy, vw, vh],
  );

  const posicaoDoPonto = useCallback(
    (p: Ponto) => {
      const e = estacoes.get(p.estacaoId);
      if (!e) throw new Error(`estação desconhecida no ponto ${p.id}: ${p.estacaoId}`);
      return { x: e.x + p.dx, y: e.y + p.dy, ex: e.x, ey: e.y };
    },
    [estacoes],
  );

  const enquadrarDia = useCallback(
    (id: string | null) => {
      if (!id) {
        setView({ k: 1, tx: 0, ty: 0 });
        return;
      }
      const xs: number[] = [];
      const ys: number[] = [];
      for (const p of mapa.pontos) {
        if (infoPonto.get(p.id)?.day.id !== id) continue;
        const { x, y, ex, ey } = posicaoDoPonto(p);
        xs.push(x, ex);
        ys.push(y, ey);
      }
      if (xs.length === 0) return;
      enquadrar(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), false);
    },
    [mapa, infoPonto, posicaoDoPonto, enquadrar],
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
    // dois dedos é sempre pinça; com um dedo, só se captura quando o arrasto de fato começa
    // (capturar já no toque faria o clique parar no svg, e o pino nunca abriria)
    if (pointers.current.size === 2) (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
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

  // ── escolhas ───────────────────────────────────────────────────────────────
  const escolherCidade = (id: string) => {
    if (id === cidadeId) return;
    const m = mapaEstacoesById(id);
    if (!m) return;
    const ds = diasDoMapa(m);
    setCidadeId(id);
    setDiaId(ds.some((d) => d.dayId === hojeId) ? hojeId : null);
    setEscolha(null);
    setView({ k: 1, tx: 0, ty: 0 });
    router.replace(`/mais/estacoes?cidade=${id}`, { scroll: false });
  };

  const escolherDia = (id: string | null) => {
    setDiaId(id);
    setEscolha(null);
    enquadrarDia(id);
  };

  const escolherPonto = useCallback(
    (p: Ponto | null) => {
      if (!p) {
        setEscolha(null);
        return;
      }
      setEscolha({ tipo: 'ponto', id: p.id });
      const { x, y } = posicaoDoPonto(p);
      setView((v) => {
        const k = Math.max(v.k, 2.2);
        return clamp({ k, tx: vx + vw / 2 - x * k, ty: vy + vh * 0.44 - y * k });
      });
    },
    [posicaoDoPonto, clamp, vx, vy, vw, vh],
  );

  const escolherEstacao = (e: Estacao) => {
    setEscolha({ tipo: 'estacao', id: e.id });
    setView((v) => {
      const k = Math.max(v.k, 2.2);
      return clamp({ k, tx: vx + vw / 2 - e.x * k, ty: vy + vh * 0.44 - e.y * k });
    });
  };

  const fechar = () => setEscolha(null);

  const indice = escolha?.tipo === 'ponto' ? pontosVisiveis.findIndex((p) => p.id === escolha.id) : -1;
  const passo = (d: 1 | -1) => {
    if (pontosVisiveis.length === 0) return;
    const i = indice < 0 ? 0 : (indice + d + pontosVisiveis.length) % pontosVisiveis.length;
    escolherPonto(pontosVisiveis[i]);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!escolha) return;
      if (e.key === 'Escape') fechar();
      if (e.key === 'ArrowRight') passo(1);
      if (e.key === 'ArrowLeft') passo(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escolha, indice]);

  const zoomed = view.k > 1.01;
  const mostrarNomesMenores = view.k >= 1.6;
  const pontoEscolhido = escolha?.tipo === 'ponto' ? mapa.pontos.find((p) => p.id === escolha.id) ?? null : null;
  const estacaoEscolhida = escolha?.tipo === 'estacao' ? estacoes.get(escolha.id) ?? null : null;
  const arrastando = !!(pinchStart.current || panStart.current);

  const rotuloDia = (id: string) => dias.find((d) => d.dayId === id);

  return (
    <div className={`space-y-3 ${escolha ? (altura === 'cheia' ? 'pb-[92svh]' : 'pb-[60svh]') : ''}`}>
      {/* ── cidade ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-0.5">
        {MAPAS_ESTACOES.map((m) => {
          const ativo = m.id === cidadeId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => escolherCidade(m.id)}
              className={`tappable shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold ${
                ativo ? 'border-rail bg-rail text-white' : 'border-hairline bg-surface text-foreground/80'
              }`}
            >
              {m.titulo}
            </button>
          );
        })}
      </div>

      {/* ── dias ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-0.5">
        <button
          type="button"
          onClick={() => escolherDia(null)}
          className={`tappable shrink-0 rounded-full border px-3 py-1.5 font-mono text-[12px] font-medium ${
            diaId === null ? 'border-foreground bg-foreground text-background' : 'border-hairline bg-surface text-muted'
          }`}
        >
          todos os dias
        </button>
        {dias.map((d) => {
          const ativo = d.dayId === diaId;
          const hoje = d.dayId === hojeId;
          return (
            <button
              key={d.dayId}
              type="button"
              onClick={() => escolherDia(ativo ? null : d.dayId)}
              aria-label={`dia ${d.n}, ${d.titulo}`}
              className={`tappable flex shrink-0 items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 font-mono text-[12px] font-medium ${
                ativo ? 'text-white' : 'bg-surface text-muted border-hairline'
              } ${hoje ? 'ring-2 ring-accent/60' : ''}`}
              style={ativo ? { background: d.cor, borderColor: d.cor } : undefined}
            >
              <span
                className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{ background: ativo ? 'rgba(255,255,255,0.28)' : d.cor }}
              >
                {d.n}
              </span>
              {d.data}
            </button>
          );
        })}
      </div>

      {/* ── o mapa ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface shadow-sm">
        <svg
          ref={svgRef}
          viewBox={mapa.viewBox}
          role="img"
          aria-label={`Mapa das estações de ${mapa.titulo}`}
          className={`block w-full select-none transition-[height] duration-300 ${
            escolha ? (altura === 'cheia' ? 'h-[22svh]' : 'h-[36svh]') : 'h-[66svh] max-h-[640px]'
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
            <filter id="est-sombra" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="#000" floodOpacity="0.28" />
            </filter>
          </defs>

          <rect x={vx - 2000} y={vy - 2000} width={vw + 4000} height={vh + 4000} fill="var(--surface)" />

          <g
            style={{
              transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.k})`,
              transition: arrastando ? 'none' : 'transform 240ms ease-out',
            }}
          >
            {/* água */}
            {mapa.agua?.map((a, i) => (
              <g key={i}>
                <path d={a.d} fill={a.d.trim().endsWith('Z') ? 'var(--rail)' : 'none'} stroke="var(--rail)" strokeWidth={a.d.trim().endsWith('Z') ? 0 : 9} opacity={0.13} strokeLinecap="round" />
                {a.nome && a.x !== undefined && a.y !== undefined && (
                  <text x={a.x} y={a.y} fontSize={9} fontStyle="italic" fill="var(--rail)" opacity={0.6} textAnchor="middle">
                    {a.nome}
                  </text>
                )}
              </g>
            ))}

            {/* caixas: Kamakura, Nara, Kōyasan */}
            {mapa.caixas?.map((c) => (
              <g key={c.titulo}>
                <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={12} fill="var(--surface-2)" stroke="var(--hairline)" strokeWidth={1.5} />
                <text x={c.x + 12} y={c.y + 15} fontSize={9.5} fontWeight={700} fill="var(--muted)" letterSpacing={0.5}>
                  {c.titulo.toUpperCase()}
                </text>
              </g>
            ))}

            {/* linhas */}
            {mapa.linhas.map((l) => {
              const apagada = linhasAcesas ? !linhasAcesas.has(l.id) : false;
              const w = LARGURA[l.modo];
              return (
                <g key={l.id} opacity={apagada ? 0.22 : 1} style={{ transition: 'opacity 240ms' }}>
                  {(l.modo === 'jr' || l.modo === 'shinkansen') && (
                    <path d={caminho(l)} fill="none" stroke="var(--surface)" strokeWidth={w + 3} strokeLinejoin="round" strokeLinecap="round" />
                  )}
                  <path
                    d={caminho(l)}
                    fill="none"
                    stroke={l.modo === 'taxi' ? 'var(--muted)' : l.cor}
                    strokeWidth={w}
                    strokeDasharray={TRACO[l.modo]}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {l.modo === 'shinkansen' && (
                    <path d={caminho(l)} fill="none" stroke="#fff" strokeWidth={2.2} strokeDasharray="12 9" strokeLinecap="butt" opacity={0.9} />
                  )}
                  {l.rotulos?.map((r, i) => (
                    <text
                      key={i}
                      x={r.x}
                      y={r.y}
                      fontSize={8}
                      fontWeight={600}
                      fill={l.modo === 'taxi' ? 'var(--muted)' : l.cor}
                      textAnchor={r.ancora ?? 'start'}
                      paintOrder="stroke"
                      stroke="var(--surface)"
                      strokeWidth={3}
                      strokeLinejoin="round"
                    >
                      {r.texto}
                    </text>
                  ))}
                </g>
              );
            })}

            {/* estações */}
            {mapa.estacoes.map((e) => {
              const cor = corDaEstacao(e.id);
              const acesa = estacoesAcesas ? estacoesAcesas.has(e.id) : true;
              const ativa = estacaoEscolhida?.id === e.id;
              const mostrarNome = e.destaque || acesa || mostrarNomesMenores || ativa;
              const lado = e.lado ?? 'r';
              const r = e.troca ? 7.5 : e.tipo === 'onibus' || e.tipo === 'cabo' ? 4.5 : 5;
              const dist = r + 5;
              const lx = lado === 'l' ? e.x - dist : lado === 'r' ? e.x + dist : e.x;
              const ly = (lado === 't' ? e.y - dist - 1 : lado === 'b' ? e.y + dist + 8 : e.y + 3.5) + (e.rotuloDy ?? 0);
              const anchor = lado === 'l' ? 'end' : lado === 'r' ? 'start' : 'middle';
              return (
                <g
                  key={e.id}
                  role="button"
                  tabIndex={0}
                  aria-label={e.nome}
                  className="cursor-pointer outline-none"
                  opacity={estacoesAcesas && !acesa && !e.destaque ? 0.45 : 1}
                  style={{ transition: 'opacity 240ms' }}
                  onClick={() => {
                    if (moved.current) return;
                    if (ativa) fechar();
                    else escolherEstacao(e);
                  }}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault();
                      escolherEstacao(e);
                    }
                  }}
                >
                  <circle cx={e.x} cy={e.y} r={r + 8} fill="transparent" />
                  {ativa && <circle cx={e.x} cy={e.y} r={r + 6} fill="none" stroke="var(--accent)" strokeWidth={2} opacity={0.7} />}
                  {e.tipo === 'onibus' || e.tipo === 'cabo' ? (
                    <rect x={e.x - r} y={e.y - r} width={r * 2} height={r * 2} rx={2} fill="var(--surface)" stroke={cor} strokeWidth={2} />
                  ) : e.troca ? (
                    <circle cx={e.x} cy={e.y} r={r} fill="var(--surface)" stroke="var(--foreground)" strokeWidth={2.8} filter="url(#est-sombra)" />
                  ) : (
                    <circle cx={e.x} cy={e.y} r={r} fill="var(--surface)" stroke={cor} strokeWidth={2.4} />
                  )}
                  <text
                    x={lx}
                    y={ly}
                    fontSize={e.destaque ? 11.5 : 9.5}
                    fontWeight={e.destaque || ativa ? 700 : 500}
                    fill={ativa ? 'var(--accent)' : 'var(--foreground)'}
                    textAnchor={anchor}
                    opacity={mostrarNome ? 1 : 0}
                    style={{ transition: 'opacity 200ms' }}
                    paintOrder="stroke"
                    stroke="var(--surface)"
                    strokeWidth={3}
                    strokeLinejoin="round"
                  >
                    {e.nome}
                  </text>
                </g>
              );
            })}

            {/* camas */}
            {mapa.bases.map((b) => {
              const e = estacoes.get(b.estacaoId);
              if (!e) return null;
              const x = e.x + b.dx;
              const y = e.y + b.dy;
              const cor = STAGES.find((s) => s.id === b.stageId)?.color ?? 'var(--rail)';
              const apagada = diaId ? ALL_DAYS.find((d) => d.id === diaId)?.stageId !== b.stageId : false;
              return (
                <g key={b.stageId} opacity={apagada ? 0.35 : 1} style={{ transition: 'opacity 240ms' }}>
                  <line x1={e.x} y1={e.y} x2={x} y2={y} stroke={cor} strokeWidth={1.2} strokeDasharray="2 3" opacity={0.8} />
                  <rect x={x - 11} y={y - 11} width={22} height={22} rx={7} fill={cor} filter="url(#est-sombra)" />
                  <BedDouble x={x - 7} y={y - 7} width={14} height={14} color="#fff" strokeWidth={2.2} />
                  <text
                    x={x}
                    y={y - 15}
                    fontSize={8.5}
                    fontWeight={700}
                    fill={cor}
                    textAnchor="middle"
                    paintOrder="stroke"
                    stroke="var(--surface)"
                    strokeWidth={3}
                    strokeLinejoin="round"
                  >
                    {b.nome}
                  </text>
                </g>
              );
            })}

            {/* pontos do roteiro e desejos */}
            {mapa.pontos.map((p) => {
              const { x, y, ex, ey } = posicaoDoPonto(p);
              const info = infoPonto.get(p.id);
              const desejo = p.desejoId ? desejoById(p.desejoId) : undefined;
              const dia = info?.day.id ?? null;
              const cor = desejo ? 'var(--gold)' : (dia && corDoDia.get(dia)) || 'var(--muted)';
              const noDia = !diaId || dia === diaId;
              const ativo = pontoEscolhido?.id === p.id;
              // com um dia escolhido, os desejos ficam visíveis mas discretos: o dia é o assunto
              const opacidade = ativo ? 1 : noDia ? 1 : desejo ? 0.55 : 0.3;
              const mostrarNome = ativo || (diaId ? noDia : mostrarNomesMenores);
              const lado = p.lado ?? 'r';
              return (
                <g
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  aria-label={p.nome}
                  aria-pressed={ativo}
                  className="cursor-pointer outline-none"
                  opacity={opacidade}
                  style={{ transition: 'opacity 240ms' }}
                  onClick={() => {
                    if (moved.current) return;
                    escolherPonto(ativo ? null : p);
                  }}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault();
                      escolherPonto(ativo ? null : p);
                    }
                  }}
                >
                  <line x1={ex} y1={ey} x2={x} y2={y} stroke={cor} strokeWidth={1.3} opacity={0.75} />
                  <text
                    x={lado === 'r' ? x + RP + 4 : x - RP - 4}
                    y={y + 3.2}
                    fontSize={8.5}
                    fontWeight={ativo ? 700 : 500}
                    fill="var(--foreground)"
                    textAnchor={lado === 'r' ? 'start' : 'end'}
                    opacity={mostrarNome ? 1 : 0}
                    style={{ transition: 'opacity 200ms' }}
                    paintOrder="stroke"
                    stroke="var(--surface)"
                    strokeWidth={3}
                    strokeLinejoin="round"
                  >
                    {p.nome}
                  </text>
                  <g style={{ transform: `translate(${x}px, ${y}px) scale(${ativo ? 1.35 : 1})`, transition: 'transform 200ms ease-out' }}>
                    {ativo && (
                      <circle r={RP + 3} fill="none" stroke="var(--accent)" strokeWidth={2} opacity={0.7}>
                        <animate attributeName="r" values={`${RP + 3};${RP + 11};${RP + 3}`} dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.7;0;0.7" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle r={RP + 7} fill="transparent" />
                    <circle r={RP} fill={cor} stroke="var(--surface)" strokeWidth={1.8} filter="url(#est-sombra)" />
                    {desejo ? (
                      <Star x={-5} y={-5} width={10} height={10} color="#fff" fill="#fff" strokeWidth={2} />
                    ) : (
                      <text y={3} fontSize={8.5} fontWeight={700} fill="#fff" textAnchor="middle">
                        {info?.n ?? '·'}
                      </text>
                    )}
                  </g>
                </g>
              );
            })}
          </g>
        </svg>

        {/* controles */}
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

        <p className="px-3.5 pb-2.5 pt-2 text-[10.5px] leading-snug text-muted">
          {diaId ? (
            <>
              <strong className="text-foreground/80">Dia {rotuloDia(diaId)?.n}</strong> · {rotuloDia(diaId)?.titulo}. As linhas acesas são as que vocês pegam nesse dia; o número no pino é a ordem da parada.
            </>
          ) : (
            <>Cada pino é uma parada do roteiro, na estação onde se desce; a cor é o dia. Toque num dia para acender só as linhas dele. Pinça para aproximar.</>
          )}
        </p>
      </div>

      {/* ── legenda ────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-hairline bg-surface p-3.5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Linhas deste mapa</p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
          {mapa.linhas
            .filter((l) => l.modo !== 'taxi')
            .map((l) => {
              const apagada = linhasAcesas ? !linhasAcesas.has(l.id) : false;
              return (
                <span key={l.id} className={`inline-flex items-center gap-1.5 text-[12px] ${apagada ? 'opacity-40' : ''}`}>
                  <span
                    className="inline-block h-[5px] w-5 rounded-full"
                    style={{
                      background: l.cor,
                      backgroundImage: TRACO[l.modo] ? `repeating-linear-gradient(90deg, ${l.cor} 0 5px, transparent 5px 8px)` : undefined,
                    }}
                  />
                  {l.nome}
                </span>
              );
            })}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[11.5px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3.5 w-3.5 rounded-full border-[2.5px] border-foreground bg-surface" /> baldeação
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-[3px] border-2 border-muted bg-surface" /> parada de ônibus
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-[6px] bg-rail text-white">
              <BedDouble size={10} />
            </span>{' '}
            hotel
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gold text-white">
              <Star size={9} fill="#fff" />
            </span>{' '}
            desejo fora do roteiro
          </span>
        </div>
        {mapa.oficiais && mapa.oficiais.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {mapa.oficiais.map((o) => (
              <a
                key={o.url}
                href={o.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1 text-[12px] text-foreground/80"
              >
                <ExternalLink size={12} /> {o.nome}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── a folha ────────────────────────────────────────────────────────── */}
      {pontoEscolhido && (
        <FolhaPonto indice={Math.max(0, indice)} total={pontosVisiveis.length} passo={passo} aoFechar={fechar} altura={altura} aoMudarAltura={setAltura}>
          <FolhaDoPonto ponto={pontoEscolhido} mapa={mapa} corDoDia={corDoDia} />
        </FolhaPonto>
      )}
      {estacaoEscolhida && (
        <FolhaPonto indice={Math.max(0, indice)} total={pontosVisiveis.length} passo={passo} aoFechar={fechar} altura={altura} aoMudarAltura={setAltura}>
          <FolhaDaEstacao
            estacao={estacaoEscolhida}
            linhas={linhasDaEstacao(estacaoEscolhida.id)}
            pontos={mapa.pontos.filter((p) => p.estacaoId === estacaoEscolhida.id)}
            bases={mapa.bases.filter((b) => b.estacaoId === estacaoEscolhida.id)}
            corDoDia={corDoDia}
            aoEscolher={escolherPonto}
          />
        </FolhaPonto>
      )}
    </div>
  );
}

function Facilidade({ nivel }: { nivel: 'fácil' | 'médio' | 'difícil' }) {
  const cls = nivel === 'fácil' ? 'bg-matcha/15 text-matcha' : nivel === 'médio' ? 'bg-gold/15 text-gold' : 'bg-accent-soft text-accent';
  return <span className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] font-bold uppercase tracking-wider ${cls}`}>{nivel}</span>;
}

function FolhaDoPonto({ ponto, mapa, corDoDia }: { ponto: Ponto; mapa: Mapa; corDoDia: Map<string, string> }) {
  const estacao = mapa.estacoes.find((e) => e.id === ponto.estacaoId);
  const desejo = ponto.desejoId ? desejoById(ponto.desejoId) : undefined;
  const info = infoDaParada(ponto);

  if (desejo) {
    const categoria = desejo.categoria === 'comer' ? 'para comer' : desejo.categoria === 'comprar' ? 'para comprar' : 'para jogar';
    return (
      <div className="space-y-3">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-gold">
            <Star size={12} fill="currentColor" /> desejo · {categoria}
          </p>
          <h3 className="mt-1 text-[17px] font-bold leading-snug">
            {desejo.nome}
            {desejo.jp && <span className="font-jp ml-1.5 text-[12px] font-normal text-muted">{desejo.jp}</span>}
          </h3>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
            <Facilidade nivel={desejo.facilidade} />
            <span>{desejo.veredito}</span>
          </p>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-2xl bg-surface-2/70 p-3 text-[12.5px]">
          <dt className="font-mono text-[10.5px] uppercase tracking-wider text-muted">onde</dt>
          <dd><Rich text={desejo.onde} /></dd>
          <dt className="font-mono text-[10.5px] uppercase tracking-wider text-muted">quando</dt>
          <dd><Rich text={desejo.quando} /></dd>
          {desejo.horario && (
            <>
              <dt className="font-mono text-[10.5px] uppercase tracking-wider text-muted">horário</dt>
              <dd><Rich text={desejo.horario} /></dd>
            </>
          )}
          {desejo.preco && (
            <>
              <dt className="font-mono text-[10.5px] uppercase tracking-wider text-muted">preço</dt>
              <dd><Rich text={desejo.preco} /></dd>
            </>
          )}
          {estacao && (
            <>
              <dt className="font-mono text-[10.5px] uppercase tracking-wider text-muted">estação</dt>
              <dd className="inline-flex items-center gap-1"><TrainFront size={12} className="text-muted" /> {estacao.nome}</dd>
            </>
          )}
        </dl>
        {desejo.paragrafos.map((t, i) => (
          <p key={i} className="text-[13.5px] leading-relaxed text-foreground/90">
            <Rich text={t} />
          </p>
        ))}
        <div className="flex flex-wrap gap-2">
          <a href={searchUrl(desejo.mapQuery)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-white">
            <Navigation size={14} /> Abrir no Google Maps
          </a>
          {desejo.fonte && (
            <a href={desejo.fonte} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2 text-[13px] font-medium text-foreground/80">
              <ExternalLink size={13} /> Site
            </a>
          )}
        </div>
      </div>
    );
  }

  if (!info) return <p className="text-[13px] text-muted">Esta parada não está mais no roteiro.</p>;

  const { day, stop, n, anterior } = info;
  const cor = corDoDia.get(day.id) ?? 'var(--accent)';
  const dias = ALL_DAYS.findIndex((d) => d.id === day.id) + 1;
  const legs = anterior ? LEGS[anterior.id] ?? [] : START[day.id] ?? [];
  const origem = anterior ? anterior.mapQuery ?? anterior.name : baseDaManha(day.id, day.stageId);
  const destino = stop.mapQuery ?? stop.name;
  const nav = navigateUrl(stop);

  return (
    <div className="space-y-3">
      <div>
        <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest" style={{ color: cor }}>
          <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] text-white" style={{ background: cor }}>
            {n}
          </span>
          dia {dias} · {formatDayLabel(day.date)} · {stop.time}
          {stop.timeLabel ? ` · ${stop.timeLabel}` : ''}
        </p>
        <h3 className="mt-1 text-[17px] font-bold leading-snug">
          {stop.name}
          {stop.jp && <span className="font-jp ml-1.5 text-[12px] font-normal text-muted">{stop.jp}</span>}
        </h3>
        {estacao && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-[12.5px] text-muted">
            <TrainFront size={13} /> {estacao.nome}
            {estacao.nota ? ` · ${estacao.nota}` : ''}
          </p>
        )}
      </div>
      {stop.facts && (
        <p className="font-mono text-[11px] leading-relaxed text-muted">
          <Rich text={stop.facts} />
        </p>
      )}
      {stop.paragraphs?.[0] && (
        <p className="text-[13.5px] leading-relaxed text-foreground/90">
          <Rich text={stop.paragraphs[0]} />
        </p>
      )}
      {legs.length > 0 && <Legs legs={legs} title={anterior ? `De ${anterior.name.split(' — ')[0]} até aqui` : 'Do hotel até aqui'} origem={origem} destino={destino} />}
      {stop.eat && <EatBlocks blocks={stop.eat} stopId={stop.id} dayId={day.id} />}
      <div className="flex flex-wrap gap-2">
        <Link href={`/roteiro/${day.id}#${stop.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-4 py-2 text-[13px] font-medium text-foreground/80">
          <CalendarDays size={14} /> Ver no roteiro
        </Link>
        {nav && (
          <a href={nav} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-medium text-white">
            <Navigation size={14} /> Navegar até aqui
          </a>
        )}
      </div>
    </div>
  );
}

function FolhaDaEstacao({
  estacao,
  linhas,
  pontos,
  bases,
  corDoDia,
  aoEscolher,
}: {
  estacao: Estacao;
  linhas: Linha[];
  pontos: Ponto[];
  bases: Mapa['bases'];
  corDoDia: Map<string, string>;
  aoEscolher: (p: Ponto) => void;
}) {
  const tipo =
    estacao.tipo === 'onibus' ? 'parada de ônibus' : estacao.tipo === 'bonde' ? 'parada de bonde' : estacao.tipo === 'cabo' ? 'teleférico' : estacao.tipo === 'pier' || estacao.tipo === 'balsa' ? 'píer' : 'estação';
  return (
    <div className="space-y-3">
      <div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">{tipo}</p>
        <h3 className="mt-1 text-[17px] font-bold leading-snug">
          {estacao.nome}
          {estacao.jp && <span className="font-jp ml-1.5 text-[12px] font-normal text-muted">{estacao.jp}</span>}
        </h3>
        {estacao.nota && <p className="mt-1 text-[12.5px] text-muted">{estacao.nota}</p>}
      </div>
      {linhas.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {linhas.map((l) => (
            <span key={l.id} className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-2.5 py-1 text-[12px]">
              <span className="inline-block h-[5px] w-4 rounded-full" style={{ background: l.cor }} />
              {l.nome}
            </span>
          ))}
        </div>
      )}
      {bases.map((b) => (
        <p key={b.stageId} className="inline-flex items-center gap-2 rounded-2xl bg-surface-2/70 px-3 py-2 text-[12.5px]">
          <BedDouble size={14} className="text-rail" /> {b.nome} — vocês dormem aqui
        </p>
      ))}
      {pontos.length > 0 ? (
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-wider text-muted">o que se faz descendo aqui</p>
          <ul className="mt-1.5 divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline">
            {pontos.map((p) => {
              const info = infoDaParada(p);
              const desejo = p.desejoId ? desejoById(p.desejoId) : undefined;
              const cor = desejo ? 'var(--gold)' : info ? corDoDia.get(info.day.id) ?? 'var(--muted)' : 'var(--muted)';
              return (
                <li key={p.id}>
                  <button type="button" onClick={() => aoEscolher(p)} className="tappable flex w-full items-center gap-3 px-3 py-2.5 text-left">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: cor }}>
                      {desejo ? <Star size={11} fill="#fff" /> : info?.n ?? '·'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium">{desejo ? desejo.nome : info?.stop.name ?? p.nome}</span>
                      <span className="block text-[11.5px] text-muted">
                        {desejo ? `desejo · ${desejo.facilidade}` : info ? `dia ${ALL_DAYS.findIndex((d) => d.id === info.day.id) + 1} · ${formatDayLabel(info.day.date)} · ${info.stop.time}` : ''}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="text-[12.5px] text-muted">Só de passagem: nenhuma parada do roteiro desce aqui.</p>
      )}
    </div>
  );
}

export type { DiaMapa };

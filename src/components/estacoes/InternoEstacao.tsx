'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ExternalLink, HelpCircle, Maximize2, Minus, Plus } from 'lucide-react';
import type { AreaInterna, Interno, TipoArea } from '@/data/estacoes/internos/types';
import { ALL_DAYS } from '@/data/days';
import { formatDayLabel } from '@/lib/now';
import { usePanZoom } from '@/lib/estacoes/usePanZoom';
import { Rich } from '../Rich';

/** cor e rótulo de cada tipo de área */
const TIPO: Record<TipoArea, { cor: string; rotulo: string }> = {
  plataforma: { cor: 'var(--rail)', rotulo: 'plataforma' },
  catraca: { cor: '#C2402A', rotulo: 'catraca' },
  saida: { cor: '#2E8B57', rotulo: 'saída' },
  loja: { cor: '#B9861A', rotulo: 'loja' },
  comida: { cor: '#D2691E', rotulo: 'comida' },
  passagem: { cor: '#8A8F98', rotulo: 'passagem' },
  armario: { cor: '#6B4A7A', rotulo: 'armários' },
  onibus: { cor: '#008B8B', rotulo: 'ônibus' },
  taxi: { cor: '#555', rotulo: 'táxi' },
  hotel: { cor: '#16324A', rotulo: 'hotel' },
  balcao: { cor: '#8B1E3F', rotulo: 'balcão' },
  rua: { cor: '#9CA3AF', rotulo: 'rua' },
};

export function InternoEstacao({ interno }: { interno: Interno }) {
  const [areaId, setAreaId] = useState<string | null>(null);
  const [usoIdx, setUsoIdx] = useState<number | null>(null);
  const pz = usePanZoom(interno.viewBox, 4);
  const { vx, vy, vw, vh } = pz.box;

  const areas = useMemo(() => new Map(interno.areas.map((a) => [a.id, a])), [interno]);
  const area = areaId ? areas.get(areaId) ?? null : null;
  const uso = usoIdx !== null ? interno.usos[usoIdx] : null;
  const acesas = useMemo(() => (uso?.areas ? new Set(uso.areas) : null), [uso]);

  const centro = (a: AreaInterna) => ({ x: a.x + a.w / 2, y: a.y + a.h / 2 });

  const escolherArea = (a: AreaInterna) => {
    if (pz.moved.current) return;
    setAreaId((atual) => (atual === a.id ? null : a.id));
  };

  const escolherUso = (i: number) => {
    const novo = usoIdx === i ? null : i;
    setUsoIdx(novo);
    setAreaId(null);
    if (novo === null) {
      pz.reset();
      return;
    }
    const ids = interno.usos[novo].areas ?? [];
    const pts = ids.map((id) => areas.get(id)).filter((a): a is AreaInterna => !!a);
    if (pts.length === 0) return;
    const x0 = Math.min(...pts.map((a) => a.x));
    const y0 = Math.min(...pts.map((a) => a.y));
    const x1 = Math.max(...pts.map((a) => a.x + a.w));
    const y1 = Math.max(...pts.map((a) => a.y + a.h));
    pz.enquadrar(x0, y0, x1, y1, 0.5, 40);
  };

  const diaDe = (dayId?: string) => {
    if (!dayId) return null;
    const i = ALL_DAYS.findIndex((d) => d.id === dayId);
    if (i < 0) return null;
    return { n: i + 1, label: formatDayLabel(ALL_DAYS[i].date) };
  };

  return (
    <div className="space-y-3">
      {/* ── o desenho ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-hairline bg-surface shadow-sm">
        <svg
          ref={pz.svgRef}
          viewBox={interno.viewBox}
          role="img"
          aria-label={`${interno.nome} por dentro`}
          className="block h-[58svh] max-h-[620px] w-full select-none"
          preserveAspectRatio="xMidYMid meet"
          style={{ touchAction: pz.zoomed ? 'none' : 'pan-y' }}
          {...pz.handlers}
        >
          <defs>
            <marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--foreground)" opacity={0.7} />
            </marker>
            <filter id="int-sombra" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000" floodOpacity="0.18" />
            </filter>
          </defs>
          <rect x={vx - 2000} y={vy - 2000} width={vw + 4000} height={vh + 4000} fill="var(--surface)" />

          <g style={pz.transform}>
            {/* andares: faixas horizontais, do alto para o subsolo */}
            {interno.andares.map((f, i) => (
              <g key={f.id}>
                <rect x={vx + 6} y={f.y} width={vw - 12} height={f.h} rx={14} fill={i % 2 === 0 ? 'var(--surface-2)' : 'var(--surface)'} stroke="var(--hairline)" strokeWidth={1.5} />
                <text x={vx + 18} y={f.y + 16} fontSize={10} fontWeight={800} fill="var(--muted)" letterSpacing={0.6}>
                  {f.nome.toUpperCase()}
                </text>
                {f.nota && (
                  <text x={vx + 18} y={f.y + 29} fontSize={8} fontStyle="italic" fill="var(--muted)">
                    {f.nota}
                  </text>
                )}
              </g>
            ))}

            {/* ligações: setas entre áreas */}
            {interno.ligacoes?.map((l, i) => {
              const a = areas.get(l.de);
              const b = areas.get(l.para);
              if (!a || !b) return null;
              const ca = centro(a);
              const cb = centro(b);
              const apagada = acesas ? !(acesas.has(l.de) && acesas.has(l.para)) : false;
              return (
                <g key={i} opacity={apagada ? 0.2 : 0.8}>
                  <line x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y} stroke="var(--foreground)" strokeWidth={1.4} strokeDasharray="4 3" markerEnd="url(#seta)" />
                  {l.nota && (
                    <text x={(ca.x + cb.x) / 2} y={(ca.y + cb.y) / 2 - 4} fontSize={7.5} fill="var(--foreground)" textAnchor="middle" paintOrder="stroke" stroke="var(--surface)" strokeWidth={3}>
                      {l.nota}
                    </text>
                  )}
                </g>
              );
            })}

            {/* áreas */}
            {interno.areas.map((a) => {
              const t = TIPO[a.tipo];
              const cor = a.cor ?? t.cor;
              const ativa = a.id === areaId;
              const apagada = acesas ? !acesas.has(a.id) : false;
              const plataforma = a.tipo === 'plataforma';
              return (
                <g
                  key={a.id}
                  role="button"
                  tabIndex={0}
                  aria-label={a.nome}
                  className="cursor-pointer outline-none"
                  opacity={apagada ? 0.28 : 1}
                  style={{ transition: 'opacity 240ms' }}
                  onClick={() => escolherArea(a)}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault();
                      escolherArea(a);
                    }
                  }}
                >
                  <rect
                    x={a.x}
                    y={a.y}
                    width={a.w}
                    height={a.h}
                    rx={plataforma ? 3 : 8}
                    fill={plataforma ? cor : 'var(--surface)'}
                    stroke={ativa ? 'var(--accent)' : cor}
                    strokeWidth={ativa ? 3 : 2}
                    filter="url(#int-sombra)"
                  />
                  {!plataforma && <rect x={a.x} y={a.y} width={5} height={a.h} rx={2.5} fill={cor} />}
                  <text
                    x={plataforma ? a.x + a.w / 2 : a.x + 10}
                    y={a.y + a.h / 2 + 3.5}
                    fontSize={plataforma ? 8.5 : 9}
                    fontWeight={700}
                    fill={plataforma ? '#fff' : 'var(--foreground)'}
                    textAnchor={plataforma ? 'middle' : 'start'}
                  >
                    {a.nome}
                  </text>
                  {!plataforma && (
                    <text x={a.x + a.w - 6} y={a.y + 10} fontSize={6.5} fontWeight={600} fill={cor} textAnchor="end" letterSpacing={0.4}>
                      {t.rotulo.toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        <div className="absolute right-2.5 top-2.5 flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface/90 shadow-sm backdrop-blur">
          <button onClick={() => pz.zoomStep(1)} aria-label="Aproximar" className="flex h-9 w-9 items-center justify-center text-foreground/80 active:bg-surface-2">
            <Plus size={16} />
          </button>
          <button onClick={() => pz.zoomStep(-1)} aria-label="Afastar" className="flex h-9 w-9 items-center justify-center border-t border-hairline text-foreground/80 active:bg-surface-2">
            <Minus size={16} />
          </button>
          <button onClick={pz.reset} aria-label="Ver tudo" className={`flex h-9 w-9 items-center justify-center border-t border-hairline active:bg-surface-2 ${pz.zoomed ? 'text-accent' : 'text-muted'}`}>
            <Maximize2 size={15} />
          </button>
        </div>

        {/* o que foi tocado */}
        <div className="border-t border-hairline px-3.5 py-2.5 text-[12.5px] leading-snug">
          {area ? (
            <p>
              <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: area.cor ?? TIPO[area.tipo].cor }}>
                {TIPO[area.tipo].rotulo}
              </span>
              <span className="mt-0.5 block font-semibold">{area.nome}</span>
              {area.nota && (
                <span className="mt-0.5 block text-foreground/85">
                  <Rich text={area.nota} />
                </span>
              )}
            </p>
          ) : (
            <p className="text-muted">Cada faixa é um andar; toque num bloco para saber o que é. Escolha um dia abaixo para acender só o caminho daquele dia.</p>
          )}
        </div>
      </div>

      {/* ── os usos, dia a dia ─────────────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="px-1 font-mono text-[10px] uppercase tracking-widest text-muted">Como vocês usam esta estação</p>
        {interno.usos.map((u, i) => {
          const dia = diaDe(u.dayId);
          const aberto = usoIdx === i;
          return (
            <div key={i} className={`overflow-hidden rounded-2xl border bg-surface ${aberto ? 'border-rail/60' : 'border-hairline'}`}>
              <button type="button" onClick={() => escolherUso(i)} className="tappable flex w-full items-center gap-3 px-3.5 py-3 text-left">
                {dia ? (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rail font-mono text-[11px] font-bold text-white">{dia.n}</span>
                ) : (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted">
                    <HelpCircle size={15} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-semibold leading-snug">{u.titulo}</span>
                  {dia && <span className="block text-[11px] text-muted">{dia.label}</span>}
                </span>
                <span className="text-[11px] text-muted">{aberto ? 'fechar' : 'abrir'}</span>
              </button>
              {aberto && (
                <ol className="space-y-2 border-t border-hairline px-3.5 py-3">
                  {u.passos.map((p, k) => (
                    <li key={k} className="flex gap-2.5 text-[13px] leading-relaxed">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-[10px] font-bold text-foreground/70">{k + 1}</span>
                      <span>
                        <Rich text={p} />
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          );
        })}
      </div>

      {interno.avisos && interno.avisos.length > 0 && (
        <div className="rounded-2xl border border-gold/50 bg-gold/10 p-3.5 text-[12.5px] leading-relaxed">
          {interno.avisos.map((a, i) => (
            <p key={i} className="flex gap-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-gold" />
              <span>
                <Rich text={a} />
              </span>
            </p>
          ))}
        </div>
      )}

      {(interno.oficiais?.length || interno.incertezas?.length) && (
        <div className="rounded-2xl border border-hairline bg-surface p-3.5">
          {interno.oficiais && interno.oficiais.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interno.oficiais.map((o) => (
                <a key={o.url} href={o.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1 text-[12px] text-foreground/80">
                  <ExternalLink size={12} /> {o.nome}
                </a>
              ))}
            </div>
          )}
          {interno.incertezas && interno.incertezas.length > 0 && (
            <ul className="mt-3 space-y-1 text-[11.5px] leading-snug text-muted">
              {interno.incertezas.map((t, i) => (
                <li key={i}>· {t}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="px-2 text-center text-[11px] text-muted">
        Esquema, não planta: as posições são relativas. Na dúvida, a placa da estação manda.{' '}
        <Link href={`/mais/estacoes?cidade=${interno.mapaId}`} className="text-rail underline">
          Voltar ao mapa das linhas
        </Link>
      </p>
    </div>
  );
}

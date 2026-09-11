'use client';

import { useEffect, useRef } from 'react';
import { TrainFront, ArrowLeftRight } from 'lucide-react';
import { CASAS, type Casa } from '@/lib/mapa-japao/rota';
import { LADRILHO_CIDADE, LADRILHO_TRECHO, LADRILHO_ALTURA, GAP_TRILHO, metricaTrilho, centrosDasCasas } from '@/lib/mapa-japao/layout';
import { dayCover } from '@/lib/covers';

/**
 * A fita de 25 ladrilhos. Aqui mora a garantia de tocabilidade: cada ladrilho
 * é irmão numa flex row de largura fixa, e irmãos em fluxo normal ocupam
 * caixas disjuntas por definição do modelo de caixas — em qualquer tela, com
 * qualquer câmera, e por mais que Kyoto e Nara estejam juntas no mapa.
 */
export function Trilho({
  cursor,
  hojeDayId,
  onCursor,
  onRolagem,
  onAssentou,
}: {
  cursor: number;
  hojeDayId: string | null;
  onCursor: (i: number) => void;
  /** fração contínua da fita, 0..24, a cada quadro em que rola */
  onRolagem: (posicaoContinua: number) => void;
  onAssentou: (i: number) => void;
}) {
  const fitaRef = useRef<HTMLDivElement>(null);
  const larguraRef = useRef(390);
  const rolandoRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursorRef = useRef(cursor);
  const onRolagemRef = useRef(onRolagem);
  const onAssentouRef = useRef(onAssentou);
  cursorRef.current = cursor;
  onRolagemRef.current = onRolagem;
  onAssentouRef.current = onAssentou;

  /** posição contínua na fita a partir da rolagem */
  const posicaoDe = (scrollLeft: number, w: number) => {
    const centros = centrosDasCasas(w);
    const x = scrollLeft + w / 2;
    if (x <= centros[0]) return 0;
    if (x >= centros[centros.length - 1]) return centros.length - 1;
    let i = 0;
    while (i < centros.length - 1 && centros[i + 1] < x) i++;
    const t = (x - centros[i]) / (centros[i + 1] - centros[i]);
    return i + t;
  };

  // lê scrollLeft uma vez por quadro, nunca no evento de rolagem
  useEffect(() => {
    let raf = 0;
    const laco = () => {
      raf = requestAnimationFrame(laco);
      const el = fitaRef.current;
      if (!el) return;
      const w = el.clientWidth || 390;
      larguraRef.current = w;
      onRolagemRef.current(posicaoDe(el.scrollLeft, w));
    };
    raf = requestAnimationFrame(laco);
    return () => cancelAnimationFrame(raf);
  }, []);

  // assentamento do snap: scrollend quando existe, senão 120 ms sem rolar
  useEffect(() => {
    const el = fitaRef.current;
    if (!el) return;
    const assentar = () => {
      rolandoRef.current = false;
      const i = Math.round(posicaoDe(el.scrollLeft, el.clientWidth || 390));
      onAssentouRef.current(i);
    };
    const aoRolar = () => {
      rolandoRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(assentar, 120);
    };
    el.addEventListener('scroll', aoRolar, { passive: true });
    if ('onscrollend' in el) el.addEventListener('scrollend', assentar);
    return () => {
      el.removeEventListener('scroll', aoRolar);
      if ('onscrollend' in el) el.removeEventListener('scrollend', assentar);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /** leva a fita até uma casa (usado quando o cursor muda por fora) */
  useEffect(() => {
    const el = fitaRef.current;
    if (!el || rolandoRef.current) return;
    const w = el.clientWidth || 390;
    const centros = centrosDasCasas(w);
    const alvo = centros[cursor] - w / 2;
    if (Math.abs(el.scrollLeft - alvo) < 2) return;
    el.scrollTo({ left: alvo, behavior: 'smooth' });
  }, [cursor]);

  const irPara = (i: number) => {
    const el = fitaRef.current;
    onCursor(i);
    if (!el) return;
    const w = el.clientWidth || 390;
    el.scrollTo({ left: centrosDasCasas(w)[i] - w / 2, behavior: 'smooth' });
  };

  const { folga } = metricaTrilho(larguraRef.current);

  return (
    <div className="relative" style={{ height: 148 }}>
      <div
        ref={fitaRef}
        className="no-scrollbar absolute inset-x-0 flex items-start overflow-x-auto"
        style={{
          top: 10,
          height: LADRILHO_ALTURA,
          gap: GAP_TRILHO,
          scrollSnapType: 'x mandatory',
          overscrollBehaviorX: 'contain',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: folga,
          paddingRight: folga,
        }}
      >
        {CASAS.map((c) => (
          <Ladrilho key={c.i} casa={c} ativo={c.i === cursor} hojeDayId={hojeDayId} onEscolher={() => irPara(c.i)} />
        ))}
      </div>

      {/* colchete do cursor: pintura, nunca alvo */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{ left: 'calc(50% - 64px)', top: 2, width: 128, height: 140 }}
      >
        <div className="absolute inset-x-0 top-0 h-[3px] rounded-full bg-accent" />
        <div className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-accent" />
        <div className="absolute left-0 top-0 h-3 w-[3px] rounded-full bg-accent" />
        <div className="absolute right-0 top-0 h-3 w-[3px] rounded-full bg-accent" />
        <div className="absolute bottom-0 left-0 h-3 w-[3px] rounded-full bg-accent" />
        <div className="absolute bottom-0 right-0 h-3 w-[3px] rounded-full bg-accent" />
      </div>
    </div>
  );
}

function Ladrilho({ casa, ativo, hojeDayId, onEscolher }: { casa: Casa; ativo: boolean; hojeDayId: string | null; onEscolher: () => void }) {
  const largura = casa.tipo === 'visita' ? LADRILHO_CIDADE : LADRILHO_TRECHO;
  const ehHoje = casa.tipo === 'visita' && !!hojeDayId && casa.dias.some((d) => d.id === hojeDayId);
  return (
    <button
      type="button"
      onClick={onEscolher}
      aria-current={ativo ? 'true' : undefined}
      className="relative overflow-hidden rounded-2xl text-left transition-transform"
      style={{
        flex: `0 0 ${largura}px`,
        width: largura,
        height: LADRILHO_ALTURA,
        flexShrink: 0,
        scrollSnapAlign: 'center',
        transform: ativo ? 'translateY(-6px)' : undefined,
        opacity: ativo ? 1 : 0.55,
        filter: ativo ? undefined : 'saturate(0.7)',
        boxShadow: ativo ? '0 0 0 2px var(--accent)' : undefined,
      }}
    >
      {casa.tipo === 'visita' ? <CorpoCidade casa={casa} ehHoje={ehHoje} /> : <CorpoTrecho casa={casa} />}
    </button>
  );
}

function CorpoCidade({ casa, ehHoje }: { casa: Extract<Casa, { tipo: 'visita' }>; ehHoje: boolean }) {
  const capa = dayCover(casa.dias[0]);
  return (
    <span className="absolute inset-0 block bg-surface-2">
      {capa && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={capa.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
      <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: casa.cor }} />
      {ehHoje && (
        <span className="absolute right-1.5 top-2 rounded-full bg-accent px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-wider text-white">
          HOJE
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 block p-2 text-white">
        <span className="block text-[13px] font-bold leading-tight">{casa.lugar.nome}</span>
        <span className="font-jp block text-[10px] leading-tight text-white/80">{casa.lugar.jp}</span>
        <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-wider text-white/70">{casa.datas}</span>
      </span>
    </span>
  );
}

function CorpoTrecho({ casa }: { casa: Extract<Casa, { tipo: 'trecho' }> }) {
  return (
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-surface-2 px-1.5 text-center">
      <span className="flex items-center gap-1 text-muted">
        {casa.volta ? <ArrowLeftRight size={15} /> : <TrainFront size={15} />}
      </span>
      <span className="block font-mono text-[12px] font-bold tabular-nums leading-tight">{casa.trecho.duracao}</span>
      <span className="block font-mono text-[10.5px] leading-tight text-muted">{casa.trecho.custo}</span>
      {casa.volta && <span className="block font-mono text-[8.5px] uppercase tracking-wider text-muted">a volta</span>}
    </span>
  );
}

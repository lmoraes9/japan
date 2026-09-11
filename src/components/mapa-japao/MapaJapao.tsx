'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, List, Maximize2, Gauge } from 'lucide-react';
import { Janela3D, type MotorJanela } from './Janela3D';
import { TintaMundo, type PontoTela } from './TintaMundo';
import { Trilho } from './Trilho';
import { Ficha } from './Ficha';
import { FolhaIndice } from './FolhaIndice';
import { FolhaExpandida } from './FolhaExpandida';
import { CASAS, VISITAS, casaMaisProxima, casaDoDia } from '@/lib/mapa-japao/rota';
import { REGIOES, regiaoDe, regiaoPorId, type RegiaoId } from '@/lib/mapa-japao/regioes';
import { hojeNaViagem } from '@/lib/mapa-japao/hoje';
import { alturaJanela, ALTURA_BAIXO, ALVO, retangulos } from '@/lib/mapa-japao/layout';
import { ALL_DAYS } from '@/data/days';

type Folha = 'nenhuma' | 'indice' | 'expandida';

/**
 * A viagem inteira: o Japão como figura, e o trilho como seletor.
 *
 * A regra desta tela, que é o conserto das duas versões anteriores: nenhum
 * alvo de toque vive no espaço 3D. Toda posição tocável é índice na fita ou
 * constante ancorada numa borda, e por isso a não sobreposição é um teorema
 * do modelo de caixas, não um ajuste que a geografia pode quebrar.
 */
export function MapaJapao() {
  const [tam, setTam] = useState({ w: 390, h: 780 });
  const [qualidade, setQualidade] = useState<'alta' | 'leve'>('alta');
  const [cursor, setCursor] = useState(0);
  const [folha, setFolha] = useState<Folha>('nenhuma');
  const [, forcarQuadro] = useState(0);

  const motorRef = useRef<MotorJanela | null>(null);
  const cursorRef = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const tintaRef = useRef<{ guia: PontoTela | null; regioes: { id: string; ponto: PontoTela; yChip: number }[]; halo: PontoTela | null; rotulo: PontoTela | null }>({
    guia: null, regioes: [], halo: null, rotulo: null,
  });
  cursorRef.current = cursor;

  const hoje = useMemo(() => hojeNaViagem(), []);
  const hojeDayId = hoje.fase === 'durante' ? hoje.dayId : null;
  const casa = CASAS[Math.max(0, Math.min(CASAS.length - 1, cursor))];
  const jh = alturaJanela(tam.h);

  // o enquadramento inicial depende de onde a viagem está
  useEffect(() => {
    if (hoje.fase === 'durante') setCursor(casaDoDia(hoje.dayId));
    else if (hoje.fase === 'depois') setCursor(CASAS.length - 1);
  }, [hoje]);

  useEffect(() => {
    const medir = () => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setTam({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    medir();
    const ro = new ResizeObserver(medir);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, []);

  /** a câmera acompanha o cursor quando ele assenta */
  const enquadrarCursor = useCallback((i: number, imediato = false) => {
    const m = motorRef.current;
    if (!m) return;
    const c = CASAS[i];
    if (!c) return;
    if (c.tipo === 'visita') {
      m.definir({ tipo: 'cidade', lugarId: c.lugarId }, imediato);
      m.anel(c.lugarId);
    } else {
      const iDe = VISITAS.findIndex((v) => v.i === c.i - 1);
      const iPara = VISITAS.findIndex((v) => v.i === c.i + 1);
      m.definir({ tipo: 'travelling', de: Math.max(0, iDe), para: Math.max(0, iPara) }, imediato);
      m.anel(null);
    }
  }, []);

  const onPronto = useCallback((m: MotorJanela) => {
    motorRef.current = m;
    const i = cursorRef.current;
    const c = CASAS[i];
    if (c?.tipo === 'visita' && hoje.fase === 'durante') {
      m.definir({ tipo: 'cidade', lugarId: c.lugarId }, true);
      m.anel(c.lugarId);
    } else {
      m.definir({ tipo: 'panorama' }, true);
    }
  }, [hoje.fase]);

  /** toque curto na janela: mira grossa, nunca alvo fino */
  const onMira = useCallback((x: number, y: number) => {
    const m = motorRef.current;
    if (!m) return;
    const c = CASAS[cursorRef.current];
    const lugarAtual = c?.tipo === 'visita' ? c.lugarId : c?.de;
    const r = lugarAtual ? regiaoDe(lugarAtual) : undefined;
    // no panorama resolve para região; dentro de uma região, para cidade
    const regiaoAtual = r?.id;
    const dentroDeRegiao = regiaoAtual && CASAS[cursorRef.current]?.tipo === 'visita';
    if (!dentroDeRegiao) {
      const id = m.regiaoMaisProxima(x, y) as RegiaoId | null;
      if (id) irParaRegiao(id);
      return;
    }
    const reg = regiaoPorId(regiaoAtual!);
    const escolhido = reg ? m.lugarMaisProximo(x, y, reg.lugares) : null;
    if (escolhido) setCursor(casaMaisProxima(escolhido, cursorRef.current));
    else if (regiaoAtual) irParaRegiao(regiaoAtual);
  }, []);

  const irParaRegiao = (id: RegiaoId) => {
    const m = motorRef.current;
    const reg = regiaoPorId(id);
    if (!m || !reg) return;
    m.definir({ tipo: 'regiao', lugares: reg.lugares });
    m.anel(null);
    const primeiro = VISITAS.find((v) => reg.lugares.includes(v.lugarId));
    if (primeiro) setCursor(primeiro.i);
  };

  /** o trilho comanda o trem em tempo real; a câmera não se mexe */
  const onRolagem = useCallback((pos: number) => {
    const m = motorRef.current;
    if (!m) return;
    const i = Math.floor(pos);
    const t = pos - i;
    const uDaVisita = (iCasa: number) => {
      const k = VISITAS.findIndex((v) => v.i === iCasa);
      return k < 0 ? 0 : k;
    };
    let u: number;
    if (i % 2 === 0) u = uDaVisita(i);
    else u = uDaVisita(i - 1) + t;
    const total = VISITAS.length - 1;
    m.trem(total > 0 ? Math.max(0, Math.min(1, u / total)) : 0);
  }, []);

  const onAssentou = useCallback((i: number) => {
    if (i === cursorRef.current) return;
    setCursor(i);
  }, []);

  useEffect(() => {
    if (folha !== 'nenhuma') return;
    enquadrarCursor(cursor);
  }, [cursor, folha, enquadrarCursor]);

  /** a camada de tinta é recalculada por quadro, e é só tinta */
  const aoQuadro = useCallback(() => {
    const m = motorRef.current;
    if (!m) return;
    const c = CASAS[cursorRef.current];
    const lugarId = c?.tipo === 'visita' ? c.lugarId : undefined;
    tintaRef.current.guia = lugarId ? m.projetar(lugarId) : null;
    tintaRef.current.halo = m.projetarRegiao('kansai');
    tintaRef.current.rotulo = lugarId ? m.projetar(lugarId) : null;
    forcarQuadro((n) => (n + 1) % 1000);
  }, []);

  const rects = retangulos(tam.w, tam.h, folha === 'indice' ? 'indice' : folha === 'expandida' ? 'expandida' : 'panorama');
  const noPanorama = folha === 'nenhuma';
  const inerte = folha !== 'nenhuma';

  const rotuloTexto = casa?.tipo === 'visita' ? casa.lugar.nome : undefined;
  const rotuloSub = casa?.tipo === 'visita' ? casa.lugar.jp : undefined;

  return (
    <div ref={rootRef} className="relative h-full w-full overflow-hidden bg-[#dfe6ea]">
      {/* ── janela ─────────────────────────────────────────────────────── */}
      <div className="relative" style={{ height: jh }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#cfe0ee 0%,#e8eef3 55%,#dfe6ea 100%)' }} />
        <Janela3D altura={jh} qualidade={qualidade} onPronto={onPronto} onMira={onMira} aoQuadro={aoQuadro} />

        <TintaMundo
          largura={tam.w}
          altura={jh}
          guia={tintaRef.current.guia}
          regioes={noPanorama ? [] : []}
          halo={
            tintaRef.current.halo
              ? {
                  ponto: tintaRef.current.halo,
                  linha1: 'Osaka, Kyoto e Nara · 44 km entre as três',
                  linha2: 'Tóquio fica a 365 km daqui',
                }
              : null
          }
          rotulo={tintaRef.current.rotulo && rotuloTexto ? { ponto: tintaRef.current.rotulo, texto: rotuloTexto, sub: rotuloSub } : null}
        />

        {/* com uma folha aberta, nenhum alvo daqui existe: inert e fora da
            árvore de acessibilidade. Nunca há dois conjuntos vivos. */}
        <div inert={inerte} aria-hidden={inerte || undefined}>
          {/* título: pintura */}
          <div className="pointer-events-none absolute" style={{ left: 12, top: 8, width: Math.min(258, tam.w - 120) }}>
            <p className="font-jp text-[10px] tracking-[0.3em] text-rail/70">日本一周</p>
            <p className="text-[15px] font-bold leading-tight text-rail">A viagem inteira</p>
            <p className="text-[11px] leading-tight text-rail/70">{VISITAS.length} paradas · {ALL_DAYS.length} dias</p>
          </div>

          {/* dois botões no topo direito: irmãos numa flex row */}
          <div className="absolute flex" style={{ right: 8, top: 4, gap: 8 }}>
            <button
              type="button"
              onClick={() => setFolha('indice')}
              aria-label="índice"
              className="tappable flex items-center justify-center rounded-full bg-white/85 text-rail backdrop-blur"
              style={{ width: ALVO, height: ALVO, flexShrink: 0 }}
            >
              <List size={19} />
            </button>
            <button
              type="button"
              onClick={() => { motorRef.current?.definir({ tipo: 'panorama' }); motorRef.current?.anel(null); }}
              aria-label="Japão inteiro"
              className="tappable flex items-center justify-center rounded-full bg-white/85 text-rail backdrop-blur"
              style={{ width: ALVO, height: ALVO, flexShrink: 0 }}
            >
              <Maximize2 size={17} />
            </button>
          </div>

          {/* fila de regiões na base: gasta altura, que sobra, e não largura */}
          <div className="absolute flex" style={{ left: 8, right: 8, top: jh - 116, gap: 8 }}>
            {REGIOES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => irParaRegiao(r.id)}
                className="tappable flex flex-1 items-center justify-center rounded-xl bg-white/85 text-[12.5px] font-bold text-rail backdrop-blur"
                style={{ height: ALVO, minWidth: 0 }}
              >
                {r.nome}
              </button>
            ))}
          </div>

          {/* voltar e hoje, no rodapé da janela */}
          <Link
            href="/mais/mapas"
            aria-label="voltar aos mapas"
            className="tappable absolute flex items-center justify-center rounded-full bg-black/35 text-white backdrop-blur"
            style={{ left: 8, top: jh - 56, width: ALVO, height: ALVO }}
          >
            <ArrowLeft size={18} />
          </Link>
          <button
            type="button"
            onClick={() => {
              if (hoje.fase === 'durante') setCursor(casaDoDia(hoje.dayId));
              else if (hoje.fase === 'depois') setCursor(CASAS.length - 1);
              else setCursor(0);
            }}
            className={`tappable absolute flex flex-col items-center justify-center rounded-full text-white ${hoje.fase === 'durante' ? 'bg-accent' : 'bg-rail/80'} backdrop-blur`}
            style={{ left: 64, top: jh - 56, width: ALVO, height: ALVO }}
          >
            {hoje.fase === 'antes' ? (
              <>
                <span className="font-mono text-[13px] font-bold leading-none">{hoje.dias}</span>
                <span className="text-[8px] leading-none opacity-80">dias</span>
              </>
            ) : hoje.fase === 'durante' ? (
              <span className="text-[9px] font-bold leading-none">HOJE</span>
            ) : (
              <span className="text-[9px] leading-none">fim</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setQualidade((q) => (q === 'alta' ? 'leve' : 'alta'))}
            className="tappable absolute flex items-center justify-center gap-1 rounded-full bg-white/85 px-2.5 font-mono text-[11px] font-semibold text-rail backdrop-blur"
            style={{ right: 8, top: jh - 56, height: 28 }}
          >
            <Gauge size={11} /> {qualidade}
          </button>
        </div>
      </div>

      {/* ── trilho e ficha ─────────────────────────────────────────────── */}
      <div style={{ height: ALTURA_BAIXO }} inert={inerte} aria-hidden={inerte || undefined}>
        <Trilho cursor={cursor} hojeDayId={hojeDayId} onCursor={setCursor} onRolagem={onRolagem} onAssentou={onAssentou} />
        {casa && (
          <Ficha
            casa={casa}
            onAnterior={() => setCursor((i) => Math.max(0, i - 1))}
            onProximo={() => setCursor((i) => Math.min(CASAS.length - 1, i + 1))}
            onExpandir={() => setFolha('expandida')}
            onRever={() => enquadrarCursor(cursorRef.current)}
            onPressionarMapa={(id) => motorRef.current?.destacarMapa(id)}
          />
        )}
      </div>

      {/* ── folhas ─────────────────────────────────────────────────────── */}
      {folha === 'indice' && (
        <FolhaIndice
          largura={tam.w}
          onFechar={() => setFolha('nenhuma')}
          onIr={(i) => { setFolha('nenhuma'); setCursor(i); }}
        />
      )}
      {folha === 'expandida' && casa && (
        <FolhaExpandida casa={casa} onFechar={() => setFolha('nenhuma')} onRever={() => { setFolha('nenhuma'); enquadrarCursor(cursorRef.current); }} />
      )}

      {/* marcador para a simulação de toque conferir a tabela de retângulos */}
      <span hidden data-alvos={Object.keys(rects).length} />
    </div>
  );
}

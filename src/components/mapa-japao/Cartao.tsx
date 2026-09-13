'use client';

import Link from 'next/link';
import { BedDouble, BookOpen, ChevronRight, Crosshair, Map as MapIcon, TrainFront } from 'lucide-react';
import { PLACE_MAPS } from '@/data/placeMaps';
import type { Base } from '@/lib/mapa-japao/bases';
import type { DiaMapa } from '@/lib/mapa-japao/dias';
import type { Foco } from '@/lib/mapa-japao/foco';
import { faixa, numero, type No } from '@/lib/mapa-japao/hierarquia';
import { MOVIMENTOS } from '@/lib/mapa-japao/rota';

const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const diaDaSemana = (iso: string) => SEMANA[new Date(`${iso}T12:00:00+09:00`).getUTCDay()];

/** '18–23/nov' ou '27/nov – 1/dez' */
function noites(b: Base): string {
  const [da, ma] = [Number(b.inicio.slice(8)), Number(b.inicio.slice(5, 7)) - 1];
  const [db, mb] = [Number(b.fim.slice(8)), Number(b.fim.slice(5, 7)) - 1];
  return ma === mb ? `${da}–${db}/${MES[ma]}` : `${da}/${MES[ma]} – ${db}/${MES[mb]}`;
}

interface Props {
  foco: Foco;
  corDe: (d: DiaMapa) => string;
  /** leva a câmera ao que está escolhido: abre o grupo, ou centra o dia ou a cama */
  onLocalizar: () => void;
  onEscolherDia: (dayId: string) => void;
}

const CHIP =
  'tappable flex shrink-0 items-center gap-1 rounded-full bg-rail/10 px-2.5 py-1 text-[11px] font-semibold text-rail';
const LINHA = 'flex items-center gap-2 p-1.5';
const TITULO = 'min-w-0 flex-1 truncate text-[12.5px] font-bold text-rail';
const DATA = 'shrink-0 font-mono text-[10px] text-rail/65';
const CHIPS = 'flex gap-1.5 overflow-x-auto px-1.5 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

function Bolha({ n, cor }: { n: number | string; cor: string }) {
  return (
    <span
      className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold text-white"
      style={{ background: cor }}
    >
      {n}
    </span>
  );
}

/**
 * O cartão do que está escolhido no mapa: uma linha com o nome e a data e,
 * abaixo, o que se abre a partir dali. Para um dia, o trem, o roteiro, os
 * mapas ilustrados e a história da cidade; para um grupo, os dias dele;
 * para uma cama, o hotel e as noites. É fino de propósito — a tela é o
 * mapa, e o cartão é a legenda.
 */
export function Cartao({ foco, corDe, onLocalizar, onEscolherDia }: Props) {
  const localizar = (
    <button
      type="button"
      onClick={onLocalizar}
      aria-label="ver no mapa"
      className="tappable flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rail/10 text-rail"
    >
      <Crosshair size={15} />
    </button>
  );
  const caixa = 'mx-3 mb-2 rounded-2xl bg-white/93 shadow-md ring-1 ring-black/5 backdrop-blur';

  if (foco.tipo === 'base') {
    const b = foco.base;
    return (
      <div className={caixa}>
        <div className={LINHA}>
          <span
            className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-white"
            style={{ background: b.cor }}
          >
            <BedDouble size={14} />
          </span>
          <span className={TITULO}>
            {b.nome} <span className="font-normal text-rail/70">· {b.cidade}</span>
          </span>
          <span className={DATA}>
            {b.noites} {b.noites === 1 ? 'noite' : 'noites'} · {noites(b)}
          </span>
          {localizar}
        </div>
        <div className={CHIPS}>
          <Link href="/mais/hoteis" className={CHIP}>
            <BedDouble size={12} /> Reservas de hotel
          </Link>
        </div>
      </div>
    );
  }

  const no: No = foco.no;
  const d = no.principal;
  if (no.dias.length === 1) {
    const trem = MOVIMENTOS[d.dayId];
    return (
      <div className={caixa}>
        <div className={LINHA}>
          <Link href={`/roteiro/${d.dayId}`} className="tappable flex min-w-0 flex-1 items-center gap-2">
            <Bolha n={d.n} cor={corDe(d)} />
            <span className={TITULO}>
              {d.titulo}
              {d.cidade !== d.titulo && <span className="font-normal text-rail/70"> · {d.cidade}</span>}
            </span>
            <span className={DATA}>
              {diaDaSemana(d.day.date)} {d.data}
            </span>
            <ChevronRight size={16} className="shrink-0 text-accent" />
          </Link>
          {localizar}
        </div>
        <div className={CHIPS}>
          {trem && (
            <Link href={`/roteiro/${d.dayId}`} className={CHIP}>
              <TrainFront size={12} /> {trem.trem} · {trem.duracao} · {trem.custo}
            </Link>
          )}
          {PLACE_MAPS.filter((m) => m.dayId === d.dayId).map((m) => (
            <Link key={m.id} href={`/lugar/${m.id}`} className={CHIP}>
              <MapIcon size={12} /> {m.title}
            </Link>
          ))}
          <Link href={`/mais/historia/${d.cidadeId}`} className={CHIP}>
            <BookOpen size={12} /> História de {d.cidade}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={caixa}>
      <div className={LINHA}>
        <Bolha n={numero(no)} cor={corDe(d)} />
        <span className={TITULO}>
          {no.nome} <span className="font-normal text-rail/70">· {no.dias.length} dias</span>
        </span>
        <span className={DATA}>{faixa(no)}</span>
        {localizar}
      </div>
      <div className={CHIPS}>
        {no.nivel === 'lugar'
          ? // o mesmo lugar em dias diferentes: cada dia abre o seu roteiro
            no.dias.map((x) => (
              <Link key={x.dayId} href={`/roteiro/${x.dayId}`} className={CHIP}>
                <span className="font-mono" style={{ color: corDe(x) }}>{x.n}</span> {x.titulo}
                <ChevronRight size={12} className="text-accent" />
              </Link>
            ))
          : // um grupo: tocar num dia escolhe o dia e leva o mapa até ele
            no.dias.map((x) => (
              <button key={x.dayId} type="button" onClick={() => onEscolherDia(x.dayId)} className={CHIP}>
                <span className="font-mono" style={{ color: corDe(x) }}>{x.n}</span> {x.titulo}
              </button>
            ))}
      </div>
    </div>
  );
}

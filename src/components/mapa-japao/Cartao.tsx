'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, Crosshair, Map as MapIcon } from 'lucide-react';
import { PLACE_MAPS } from '@/data/placeMaps';
import type { DiaMapa } from '@/lib/mapa-japao/dias';
import { faixa, numero, type No } from '@/lib/mapa-japao/hierarquia';

const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const diaDaSemana = (iso: string) => SEMANA[new Date(`${iso}T12:00:00+09:00`).getUTCDay()];

interface Props {
  no: No;
  corDe: (d: DiaMapa) => string;
  /** leva a câmera ao que está escolhido: abre o grupo, ou centra o dia */
  onLocalizar: () => void;
  onEscolherDia: (dayId: string) => void;
}

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
 * abaixo, o que se abre a partir dali. Para um dia, o roteiro, os mapas
 * ilustrados e a história da cidade; para um grupo, os dias dele. É fino
 * de propósito — a tela é o mapa, e o cartão é a legenda.
 */
export function Cartao({ no, corDe, onLocalizar, onEscolherDia }: Props) {
  const umDia = no.dias.length === 1;
  const d = no.principal;
  const chip =
    'tappable flex shrink-0 items-center gap-1 rounded-full bg-rail/10 px-2.5 py-1 text-[11px] font-semibold text-rail';
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

  return (
    <div className="mx-3 mb-2 rounded-2xl bg-white/93 shadow-md ring-1 ring-black/5 backdrop-blur">
      {umDia ? (
        <div className="flex items-center gap-2 p-1.5">
          <Link href={`/roteiro/${d.dayId}`} className="tappable flex min-w-0 flex-1 items-center gap-2">
            <Bolha n={d.n} cor={corDe(d)} />
            <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-rail">
              {d.titulo}
              {d.cidade !== d.titulo && <span className="font-normal text-rail/70"> · {d.cidade}</span>}
            </span>
            <span className="shrink-0 font-mono text-[10px] text-rail/65">
              {diaDaSemana(d.day.date)} {d.data}
            </span>
            <ChevronRight size={16} className="shrink-0 text-accent" />
          </Link>
          {localizar}
        </div>
      ) : (
        <div className="flex items-center gap-2 p-1.5">
          <Bolha n={numero(no)} cor={corDe(d)} />
          <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-rail">
            {no.nome} <span className="font-normal text-rail/70">· {no.dias.length} dias</span>
          </span>
          <span className="shrink-0 font-mono text-[10px] text-rail/65">{faixa(no)}</span>
          {localizar}
        </div>
      )}
      <div className="flex gap-1.5 overflow-x-auto px-1.5 pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {umDia ? (
          <>
            {PLACE_MAPS.filter((m) => m.dayId === d.dayId).map((m) => (
              <Link key={m.id} href={`/lugar/${m.id}`} className={chip}>
                <MapIcon size={12} /> {m.title}
              </Link>
            ))}
            <Link href={`/mais/historia/${d.cidadeId}`} className={chip}>
              <BookOpen size={12} /> História de {d.cidade}
            </Link>
          </>
        ) : no.nivel === 'lugar' ? (
          // o mesmo lugar em dias diferentes: cada dia abre o seu roteiro
          no.dias.map((x) => (
            <Link key={x.dayId} href={`/roteiro/${x.dayId}`} className={chip}>
              <span className="font-mono" style={{ color: corDe(x) }}>{x.n}</span> {x.titulo}
              <ChevronRight size={12} className="text-accent" />
            </Link>
          ))
        ) : (
          // um grupo: tocar num dia escolhe o dia e leva o mapa até ele
          no.dias.map((x) => (
            <button key={x.dayId} type="button" onClick={() => onEscolherDia(x.dayId)} className={chip}>
              <span className="font-mono" style={{ color: corDe(x) }}>{x.n}</span> {x.titulo}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

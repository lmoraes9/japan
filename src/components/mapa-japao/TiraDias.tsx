'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { DiaMapa } from '@/lib/mapa-japao/dias';

const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const diaDaSemana = (iso: string) => SEMANA[new Date(`${iso}T12:00:00+09:00`).getUTCDay()];

interface Props {
  dias: DiaMapa[];
  /** o dia de hoje na viagem, ou o primeiro dia enquanto ela não começa */
  hojeId: string | null;
  /** os dias antes deste já passaram e ficam apagados */
  passadoAte: number;
  /** o dia escolhido na tira, que ganha a legenda e vem para o meio */
  focoId: string | null;
  corDe: (d: DiaMapa) => string;
  onEscolher: (dayId: string) => void;
}

/**
 * A tira dos dias: dezesseis casas numeradas, na ordem da viagem, roláveis.
 * Tocar numa casa leva o mapa até aquele dia. É o caminho direto que o zoom
 * não dá — o dia 12 mora dentro de Kyoto, que mora dentro do Kansai, e
 * ninguém precisa saber disso para chegar lá.
 */
export function TiraDias({ dias, hojeId, passadoAte, focoId, corDe, onEscolher }: Props) {
  const trilhoRef = useRef<HTMLDivElement>(null);

  // a casa em foco vem para o meio da tira
  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho || !focoId) return;
    const casa = trilho.querySelector<HTMLElement>(`[data-dia="${focoId}"]`);
    if (!casa) return;
    trilho.scrollTo({ left: casa.offsetLeft - (trilho.clientWidth - casa.offsetWidth) / 2, behavior: 'smooth' });
  }, [focoId]);

  const foco = dias.find((d) => d.dayId === focoId);

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/30 to-transparent pt-6"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {foco && (
        <Link
          href={`/roteiro/${foco.dayId}`}
          className="tappable mx-3 mb-2 flex items-center gap-2 rounded-full bg-white/93 py-1.5 pl-1.5 pr-3 shadow-md ring-1 ring-black/5 backdrop-blur"
        >
          <span
            className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold text-white"
            style={{ background: corDe(foco) }}
          >
            {foco.n}
          </span>
          <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-rail">
            {foco.titulo}
            {foco.cidade !== foco.titulo && <span className="font-normal text-rail/70"> · {foco.cidade}</span>}
          </span>
          <span className="shrink-0 font-mono text-[10px] text-rail/65">
            {diaDaSemana(foco.day.date)} {foco.data}
          </span>
          <ChevronRight size={16} className="shrink-0 text-accent" />
        </Link>
      )}
      <div
        ref={trilhoRef}
        className="flex snap-x gap-1.5 overflow-x-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {dias.map((d) => {
          const hoje = d.dayId === hojeId;
          const emFoco = d.dayId === focoId;
          const passado = d.n < passadoAte;
          return (
            <button
              key={d.dayId}
              type="button"
              data-dia={d.dayId}
              onClick={() => onEscolher(d.dayId)}
              aria-label={`dia ${d.n}, ${d.titulo}, ${d.data}`}
              className={`tappable flex w-[52px] shrink-0 snap-center flex-col items-center gap-1 rounded-2xl py-1.5 backdrop-blur ${
                emFoco ? 'bg-rail text-white' : 'bg-white/90 text-rail'
              } ${hoje ? 'ring-2 ring-accent' : ''} ${passado ? 'opacity-60' : ''}`}
            >
              <span
                className="flex h-[26px] w-[26px] items-center justify-center rounded-full font-mono text-[11px] font-bold text-white"
                style={{ background: corDe(d) }}
              >
                {d.n}
              </span>
              <span className="font-mono text-[9px] leading-none">{d.data}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

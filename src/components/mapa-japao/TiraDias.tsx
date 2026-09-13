'use client';

import { useEffect, useRef } from 'react';
import type { DiaMapa } from '@/lib/mapa-japao/dias';

interface Props {
  dias: DiaMapa[];
  /** o dia de hoje na viagem, ou o primeiro dia enquanto ela não começa */
  hojeId: string | null;
  /** os dias antes deste já passaram e ficam apagados */
  passadoAte: number;
  /** os dias do que está escolhido: um só, ou todos os de um grupo */
  focoDias: string[];
  corDe: (d: DiaMapa) => string;
  onEscolher: (dayId: string) => void;
}

/**
 * A tira dos dias: dezesseis casas numeradas, na ordem da viagem, roláveis.
 * Tocar numa casa leva o mapa até aquele dia. É o caminho direto que o zoom
 * não dá — o dia 12 mora dentro de Kyoto, que mora dentro do Kansai, e
 * ninguém precisa saber disso para chegar lá.
 */
export function TiraDias({ dias, hojeId, passadoAte, focoDias, corDe, onEscolher }: Props) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const primeiro = focoDias[0] ?? null;

  // a primeira casa escolhida vem para o meio da tira
  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho || !primeiro) return;
    const casa = trilho.querySelector<HTMLElement>(`[data-dia="${primeiro}"]`);
    if (!casa) return;
    trilho.scrollTo({ left: casa.offsetLeft - (trilho.clientWidth - casa.offsetWidth) / 2, behavior: 'smooth' });
  }, [primeiro]);

  return (
    <div
      ref={trilhoRef}
      className="flex snap-x gap-1.5 overflow-x-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {dias.map((d) => {
        const hoje = d.dayId === hojeId;
        const emFoco = focoDias.includes(d.dayId);
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
  );
}

'use client';

import { useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import type { FotoDeLugar } from '@/lib/fotos';

/**
 * O carrossel de fotos de uma parada.
 *
 * É uma faixa com scroll-snap horizontal: o dedo arrasta e a foto encaixa, que
 * é o gesto que a pessoa já espera. As setas existem para o mouse e para quem
 * prefere tocar; os pontinhos dizem quantas fotos há, porque uma foto só nunca
 * dá noção de um lugar como o Meiji Jingū.
 */
export function Carrossel({ fotos, alt }: { fotos: FotoDeLugar[]; alt: string }) {
  const faixaRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);

  const aoRolar = useCallback(() => {
    const el = faixaRef.current;
    if (!el) return;
    const largura = el.clientWidth || 1;
    const atual = Math.round(el.scrollLeft / largura);
    setI((antes) => (antes === atual ? antes : Math.max(0, Math.min(fotos.length - 1, atual))));
  }, [fotos.length]);

  const irPara = useCallback((n: number) => {
    const el = faixaRef.current;
    if (!el) return;
    const alvo = Math.max(0, Math.min(fotos.length - 1, n));
    el.scrollTo({ left: alvo * el.clientWidth, behavior: 'smooth' });
  }, [fotos.length]);

  if (!fotos.length) return null;
  const atual = fotos[Math.min(i, fotos.length - 1)];
  const varias = fotos.length > 1;

  return (
    <figure className="mt-2.5">
      <div className="relative">
        <div
          ref={faixaRef}
          onScroll={aoRolar}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-xl"
          style={{ scrollbarWidth: 'none' }}
        >
          {fotos.map((f, n) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={f.photo.src}
              src={f.photo.src}
              alt={f.legenda ?? alt}
              loading={n === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              className="photo-in aspect-[16/10] w-full shrink-0 snap-center snap-always border border-hairline bg-surface-2 object-cover"
            />
          ))}
        </div>

        {varias && (
          <>
            <span className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur">
              <Images size={10} />
              {i + 1}/{fotos.length}
            </span>
            {i > 0 && (
              <button
                type="button"
                onClick={() => irPara(i - 1)}
                aria-label="Foto anterior"
                className="tappable absolute left-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur"
              >
                <ChevronLeft size={17} />
              </button>
            )}
            {i < fotos.length - 1 && (
              <button
                type="button"
                onClick={() => irPara(i + 1)}
                aria-label="Próxima foto"
                className="tappable absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur"
              >
                <ChevronRight size={17} />
              </button>
            )}
          </>
        )}
      </div>

      {varias && (
        <div className="mt-1.5 flex justify-center gap-1.5">
          {fotos.map((f, n) => (
            <button
              key={f.photo.src}
              type="button"
              onClick={() => irPara(n)}
              aria-label={`Foto ${n + 1}`}
              aria-current={n === i}
              className={`h-1.5 rounded-full transition-all ${n === i ? 'w-4 bg-accent' : 'w-1.5 bg-rail/30'}`}
            />
          ))}
        </div>
      )}

      <figcaption className="mt-1 text-[10px] leading-snug text-muted">
        {atual.legenda && <span className="block text-foreground/80">{atual.legenda}</span>}
        <a
          href={atual.photo.source}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-hairline underline-offset-2"
        >
          {atual.photo.credit} · {atual.photo.license} · Wikimedia Commons
        </a>
      </figcaption>
    </figure>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Rich } from './Rich';
import type { GrupoGlossario } from '@/lib/comida';

/**
 * "O que é cada prato" — para não ter que pesquisar no meio do cardápio.
 *
 * Os verbetes são os mesmos termos que rotulam os lugares na lista acima, e a
 * contagem à direita diz em quantos endereços do roteiro aquilo aparece: um
 * prato com 5 é coisa que vocês vão encontrar toda hora, um com 1 é a
 * especialidade de um lugar só.
 */
export function Glossario({ grupos }: { grupos: GrupoGlossario[] }) {
  const [busca, setBusca] = useState('');

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return grupos;
    return grupos
      .map((g) => ({
        ...g,
        termos: g.termos.filter(
          (t) =>
            t.termo.toLowerCase().includes(q) ||
            t.jp?.includes(busca.trim()) ||
            t.texto.toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.termos.length > 0);
  }, [grupos, busca]);

  const total = grupos.reduce((s, g) => s + g.termos.length, 0);
  const achados = filtrados.reduce((s, g) => s + g.termos.length, 0);

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 px-0.5">
        <h2 className="text-[15px] font-semibold">O que é cada prato</h2>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {busca ? `${achados} de ${total}` : `${total} pratos`}
        </span>
      </div>

      <div className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="tsukemen, 握り, prensado…"
          aria-label="Buscar um prato"
          className="w-full rounded-2xl border border-hairline bg-surface py-2.5 pl-9 pr-9 text-[13px] outline-none placeholder:text-muted focus:border-accent/50"
        />
        {busca && (
          <button
            type="button"
            onClick={() => setBusca('')}
            aria-label="Limpar busca"
            className="tappable absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted active:bg-surface-2"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {filtrados.length === 0 && (
        <p className="rounded-2xl border border-hairline bg-surface p-4 text-[13px] text-muted">
          Nenhum prato com esse nome. Tente pelo que está no prato — <em>porco</em>, <em>alga</em>,{' '}
          <em>prensado</em>.
        </p>
      )}

      {filtrados.map((grupo) => (
        <div key={grupo.cat} className="overflow-hidden rounded-2xl border border-hairline bg-surface">
          <div className="flex items-baseline gap-2 border-b border-hairline bg-surface-2/70 px-4 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              {grupo.titulo}
            </span>
            <span className="font-jp text-[11px] text-muted/70">{grupo.jp}</span>
          </div>
          <dl className="divide-y divide-hairline">
            {grupo.termos.map((t) => (
              <div key={t.termo} className="px-4 py-3">
                <dt className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-[14px] font-semibold">{t.termo}</span>
                  {t.jp && <span className="font-jp text-[13px] text-muted">{t.jp}</span>}
                  {t.n > 0 && (
                    <span className="ml-auto shrink-0 font-mono text-[10px] text-muted">
                      {t.n} {t.n === 1 ? 'lugar' : 'lugares'}
                    </span>
                  )}
                </dt>
                <dd className="mt-1 text-[12.5px] leading-relaxed text-foreground/85">
                  <Rich text={t.texto} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </section>
  );
}

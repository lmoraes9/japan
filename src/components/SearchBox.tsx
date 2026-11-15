'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X, MapPinned, CalendarDays, UtensilsCrossed, BedDouble, TicketCheck, ShoppingBag, Sandwich, Pill } from 'lucide-react';
import { aquecerBusca, buscar, MAX_RESULTADOS, TIPO_ROTULO, type RespostaBusca, type TipoResultado } from '@/lib/busca';

const ICONE: Record<TipoResultado, typeof Search> = {
  parada: CalendarDays,
  dia: CalendarDays,
  comida: UtensilsCrossed,
  mapa: MapPinned,
  hotel: BedDouble,
  ingresso: TicketCheck,
  compras: ShoppingBag,
  konbini: Sandwich,
  truque: Pill,
};

/** As paradas e os dias são "o roteiro"; o resto é página de apoio. */
const NO_ROTEIRO: TipoResultado[] = ['parada', 'dia', 'comida', 'mapa'];

/**
 * Busca no roteiro e nas páginas de apoio. A lógica mora em `lib/busca`; aqui
 * é só a caixa e a lista. Um erro na busca vira uma linha de aviso, e nunca
 * derruba a tela onde a caixa está.
 */
export function SearchBox() {
  const [q, setQ] = useState('');
  const pergunta = q.trim();
  const ativa = pergunta.length >= 2;

  const resposta = useMemo((): RespostaBusca | 'erro' | null => {
    if (!ativa) return null;
    try {
      return buscar(pergunta);
    } catch {
      return 'erro';
    }
  }, [ativa, pergunta]);

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2.5 rounded-2xl border border-hairline bg-surface px-3.5 py-2.5">
        <Search size={17} className="shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setTimeout(aquecerBusca, 0)}
          placeholder="Tem no roteiro? Nishiki, ramen, Muji…"
          aria-label="Buscar no roteiro"
          className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted/70"
          type="text"
          enterKeyHint="search"
          maxLength={80}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
        />
        {q && (
          <button type="button" onClick={() => setQ('')} aria-label="Limpar" className="text-muted">
            <X size={16} />
          </button>
        )}
      </label>

      {resposta === 'erro' && (
        <p className="rounded-2xl border border-hairline bg-surface px-4 py-3 text-[13px] text-muted">
          A busca falhou desta vez. O roteiro continua aí embaixo, dia por dia.
        </p>
      )}

      {resposta && resposta !== 'erro' && (
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
          {resposta.total === 0 ? (
            <p className="px-4 py-3 text-[13px] leading-snug text-muted">
              <strong className="font-semibold text-foreground">Não tem “{pergunta}”</strong> no roteiro nem nas
              páginas de apoio. Vale tentar só um pedaço do nome.
            </p>
          ) : (
            <p className="border-b border-hairline bg-surface-2 px-4 py-2 text-[12px] leading-snug text-muted">
              {resposta.parecidos.length > 0 ? (
                <>
                  Nada escrito “{pergunta}”. O mais parecido é{' '}
                  <strong className="font-semibold text-foreground">{resposta.parecidos.join(', ')}</strong>:
                </>
              ) : resposta.resultados.some((r) => NO_ROTEIRO.includes(r.tipo)) ? (
                <>
                  <strong className="font-semibold text-foreground">Tem no roteiro.</strong>{' '}
                  {resposta.total === 1 ? '1 lugar' : `${resposta.total} lugares`}
                  {resposta.total > MAX_RESULTADOS && `, os ${MAX_RESULTADOS} primeiros abaixo`}
                </>
              ) : (
                <>
                  Não aparece nos dias do roteiro, mas está nas páginas de apoio (
                  {resposta.total === 1 ? '1 lugar' : `${resposta.total} lugares`})
                </>
              )}
            </p>
          )}

          {resposta.resultados.map((r) => {
            const Icone = ICONE[r.tipo];
            return (
              <Link
                key={r.key}
                href={r.href}
                className="flex items-start gap-3 border-b border-hairline px-4 py-2.5 last:border-b-0 active:bg-surface-2"
              >
                <Icone size={15} className="mt-0.5 shrink-0 text-accent" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-medium leading-snug">{r.title}</span>
                  <span className="block text-[11px] text-muted">
                    {r.tipo === 'parada' || r.tipo === 'dia' ? `${TIPO_ROTULO[r.tipo]} · ${r.sub}` : r.sub}
                  </span>
                  {r.trecho && (
                    <span className="mt-0.5 block text-[12px] leading-snug text-foreground/70">
                      {r.trecho.antes}
                      <mark className="rounded bg-accent-soft px-0.5 font-semibold text-foreground">
                        {r.trecho.achado}
                      </mark>
                      {r.trecho.depois}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

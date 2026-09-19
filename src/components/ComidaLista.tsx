'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Image as ImageIcon, MapPin, X } from 'lucide-react';
import { Rich } from './Rich';
import type { CatResumo, ComidaResolvida } from '@/lib/comida';

const AVISOS = new Set(['fila', 'reserva', 'sem reserva', 'esgota cedo', 'só almoço', '24h']);

/** quantos chips de filtro cabem antes de a lista virar parede */
const ROTULOS_VISIVEIS = 16;

/** Pílula de rótulo — a cor diz de que espécie de rótulo se trata */
function Pilula({
  rotulo,
  estilo,
  ativo,
  onClick,
}: {
  rotulo: string;
  /** rótulo do prato, não do lugar — ganha peso porque é o que se lê primeiro */
  estilo?: boolean;
  ativo: boolean;
  onClick: () => void;
}) {
  const local = rotulo === 'especialidade local';
  const aviso = AVISOS.has(rotulo);
  const cor = ativo
    ? 'border-accent bg-accent text-white'
    : local
      ? 'border-accent/40 bg-accent/10 text-accent'
      : aviso
        ? 'border-gold/40 bg-gold/10 text-gold'
        : estilo
          ? 'border-hairline bg-surface font-semibold text-foreground'
          : 'border-hairline bg-surface text-muted';
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium leading-tight ${cor}`}
    >
      {local ? `⭐ ${rotulo}` : rotulo}
    </button>
  );
}

function Cartao({
  item,
  rotuloAtivo,
  onRotulo,
}: {
  item: ComidaResolvida;
  rotuloAtivo: string | null;
  onRotulo: (r: string) => void;
}) {
  return (
    <article className="rounded-xl border border-hairline bg-surface-2 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-[13.5px] font-semibold leading-snug">{item.nome}</h3>
          {item.jp && <p className="font-jp text-[11px] text-muted leading-tight">{item.jp}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {item.preco && (
            <span className="font-mono text-[11px] font-semibold text-gold tabular-nums">
              {item.preco}
            </span>
          )}
          <a
            href={item.fotosUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Fotos de ${item.nome}`}
            className="rounded-full border border-hairline p-1.5 text-muted"
          >
            <ImageIcon size={13} />
          </a>
          <a
            href={item.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.nome} no mapa`}
            className="rounded-full border border-hairline p-1.5 text-muted"
          >
            <MapPin size={13} />
          </a>
        </div>
      </div>

      <div className="mt-1.5 flex flex-wrap gap-1">
        {item.plano !== 'escolha' && (
          <span
            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-tight ${
              item.plano === 'marcado'
                ? 'border-matcha/50 bg-matcha/15 text-matcha'
                : 'border-hairline bg-surface text-muted'
            }`}
          >
            {item.plano === 'marcado' ? 'no roteiro' : item.plano}
          </span>
        )}
        {item.rotulos.map((r) => (
          <Pilula
            key={r}
            rotulo={r}
            estilo={item.estilo?.includes(r)}
            ativo={rotuloAtivo === r}
            onClick={() => onRotulo(r)}
          />
        ))}
      </div>

      <p className="mt-1.5 text-[12px] leading-snug text-muted">
        <Rich text={item.nota} />
      </p>

      <Link
        href={`/roteiro/${item.dayId}#${item.stopId}`}
        className="mt-2 inline-flex items-center gap-0.5 text-[11px] font-medium text-accent"
      >
        <span className="font-mono tabular-nums">{item.dataCurta}</span>
        <span className="mx-1 text-muted">·</span>
        {item.refeicao} em {item.cidade}
        <ChevronRight size={12} />
      </Link>
    </article>
  );
}

export function ComidaLista({
  itens,
  cats,
  rotulos,
}: {
  itens: ComidaResolvida[];
  cats: CatResumo[];
  rotulos: { rotulo: string; n: number }[];
}) {
  const [cat, setCat] = useState<string | null>(null);
  const [rotulo, setRotulo] = useState<string | null>(null);
  const [todosRotulos, setTodosRotulos] = useState(false);

  const filtrados = itens.filter(
    (i) => (!cat || i.cat === cat) && (!rotulo || i.rotulos.includes(rotulo)),
  );
  const filtrando = cat !== null || rotulo !== null;

  const alternaRotulo = (r: string) => setRotulo((atual) => (atual === r ? null : r));

  // um rótulo escolhido pela pílula de um cartão pode estar fora dos 16 primeiros:
  // nesse caso a lista abre sozinha, senão o filtro ativo não aparece em lugar nenhum —
  // e aí o botão de recolher some, porque recolher esconderia justamente o filtro ativo
  const abertaPeloFiltro =
    !todosRotulos && rotulos.findIndex((r) => r.rotulo === rotulo) >= ROTULOS_VISIVEIS;
  const mostrarTodos = todosRotulos || abertaPeloFiltro;

  return (
    <div className="space-y-4">
      {/* Estado do filtro */}
      {filtrando && (
        <div className="sticky top-2 z-10 flex items-center justify-between gap-2 rounded-2xl border border-accent/40 bg-accent-soft px-4 py-2.5">
          <p className="min-w-0 text-[12.5px] leading-snug">
            <span className="font-semibold">{filtrados.length}</span>
            {filtrados.length === 1 ? ' lugar' : ' lugares'}
            {cat && <> · {cats.find((c) => c.id === cat)?.titulo}</>}
            {rotulo && <> · {rotulo}</>}
          </p>
          <button
            type="button"
            onClick={() => {
              setCat(null);
              setRotulo(null);
            }}
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-hairline bg-surface px-2.5 py-1 text-[11px] font-medium"
          >
            <X size={12} />
            limpar
          </button>
        </div>
      )}

      {/* O placar: bater o olho e saber o que tem */}
      <section className="rounded-2xl border border-hairline bg-surface p-4">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
          {itens.length} endereços, por tipo de comida
        </p>
        <ul className="divide-y divide-hairline">
          {cats.map((c) => {
            const ativo = cat === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => setCat(ativo ? null : c.id)}
                  className="flex w-full items-start gap-3 py-2 text-left"
                >
                  <span
                    className={`mt-0.5 w-7 shrink-0 text-right font-mono text-[15px] font-bold tabular-nums ${
                      ativo ? 'text-accent' : 'text-foreground'
                    }`}
                  >
                    {c.total}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[13.5px] font-semibold leading-snug ${
                        ativo ? 'text-accent' : ''
                      }`}
                    >
                      {c.titulo}
                      <span className="ml-1.5 whitespace-nowrap font-jp text-[11px] font-normal text-muted">
                        {c.jp}
                      </span>
                    </span>
                    {c.quebra.length > 0 && (
                      <span className="mt-0.5 block text-[11px] leading-snug text-muted">
                        {c.quebra.map((q) => `${q.n} ${q.rotulo}`).join(' · ')}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Filtro por rótulo */}
      <section className="rounded-2xl border border-hairline bg-surface p-4">
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
          Filtrar por rótulo
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(mostrarTodos ? rotulos : rotulos.slice(0, ROTULOS_VISIVEIS)).map(({ rotulo: r, n }) => (
            <button
              key={r}
              type="button"
              aria-pressed={rotulo === r}
              onClick={() => alternaRotulo(r)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium leading-tight ${
                rotulo === r
                  ? 'border-accent bg-accent text-white'
                  : 'border-hairline bg-surface-2 text-muted'
              }`}
            >
              {r === 'especialidade local' ? `⭐ ${r}` : r}
              <span className="ml-1 font-mono tabular-nums opacity-60">{n}</span>
            </button>
          ))}
          {rotulos.length > ROTULOS_VISIVEIS && !abertaPeloFiltro && (
            <button
              type="button"
              onClick={() => setTodosRotulos((v) => !v)}
              className="inline-flex items-center gap-0.5 rounded-full border border-hairline bg-surface px-2.5 py-1 text-[11px] font-semibold leading-tight text-accent"
            >
              {todosRotulos ? 'menos' : `mais ${rotulos.length - ROTULOS_VISIVEIS}`}
              <ChevronDown
                size={12}
                className={todosRotulos ? 'rotate-180 transition-transform' : 'transition-transform'}
              />
            </button>
          )}
        </div>
      </section>

      {filtrando && filtrados.length === 0 && (
        <p className="rounded-2xl border border-hairline bg-surface p-4 text-[13px] text-muted">
          Nada com essa combinação. Tente só a categoria ou só o rótulo.
        </p>
      )}

      {/* As seções */}
      {cats.map((c) => {
        const doGrupo = filtrados.filter((i) => i.cat === c.id);
        if (doGrupo.length === 0) return null;
        return (
          <section
            key={c.id}
            id={`cat-${c.id}`}
            className="scroll-mt-16 rounded-2xl border border-hairline bg-surface p-4"
          >
            <header className="mb-3">
              <h2 className="text-[16px] font-bold leading-tight">
                {c.titulo}
                <span className="ml-2 font-mono text-[12px] font-semibold text-muted tabular-nums">
                  {doGrupo.length}
                  {doGrupo.length !== c.total && `/${c.total}`}
                </span>
              </h2>
              <p className="font-jp text-[11px] text-muted">{c.jp}</p>
              <p className="mt-1 text-[12px] leading-snug text-muted">{c.resumo}</p>
            </header>
            <div className="space-y-2.5">
              {doGrupo.map((item) => (
                <Cartao
                  key={item.id}
                  item={item}
                  rotuloAtivo={rotulo}
                  onRotulo={alternaRotulo}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

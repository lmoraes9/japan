import Link from 'next/link';
import { Sandwich, ChevronRight } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { ComidaLista } from '@/components/ComidaLista';
import { Glossario } from '@/components/Glossario';
import { Rich } from '@/components/Rich';
import { PLANO_LEGENDA, PRECO_LEGENDA, type Plano, type Preco } from '@/data/comida';
import { comidaResolvida, glossarioResolvido, resumoPorCategoria, rotulosDisponiveis } from '@/lib/comida';

const INTRO = [
  'Todo lugar de comer do roteiro, reorganizado **por tipo de comida** em vez de por dia. O placar abaixo diz de relance quantos endereços tem cada categoria e de que tipo cada um é.',
  'Toque numa linha do placar para ver só aquela categoria, ou num rótulo para cruzar tudo — *todo lugar com fila*, *tudo que é especialidade da cidade*. Cada cartão volta para o dia em que aquilo acontece.',
  'No fim da página, **o que é cada prato**: os mesmos rótulos dos cartões, explicados um a um, para não ter que pesquisar no meio do cardápio.',
];

export default function ComidaPage() {
  const itens = comidaResolvida();
  const cats = resumoPorCategoria(itens);
  const rotulos = rotulosDisponiveis(itens);
  const glossario = glossarioResolvido(itens);
  const marcados = itens.filter((i) => i.plano === 'marcado').length;
  const locais = itens.filter((i) => i.local).length;

  return (
    <div className="space-y-4">
      <SubpageHeader
        title="Comida"
        subtitle={`${itens.length} endereços em ${cats.length} categorias — ${marcados} já marcados no roteiro, ${locais} são especialidade da cidade`}
      />

      <div className="space-y-2.5 rounded-2xl border border-hairline bg-surface p-4">
        {INTRO.map((p, i) => (
          <p key={i} className="text-[13px] leading-relaxed text-foreground/90">
            <Rich text={p} />
          </p>
        ))}
      </div>

      <ComidaLista itens={itens} cats={cats} rotulos={rotulos} />

      <Glossario grupos={glossario} />

      <section className="rounded-2xl border border-hairline bg-surface-2 p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
          Como ler os cartões
        </p>
        <dl className="space-y-1.5 text-[12px] leading-snug">
          {(Object.entries(PRECO_LEGENDA) as [Preco, string][]).map(([preco, texto]) => (
            <div key={preco} className="flex gap-2">
              <dt className="w-12 shrink-0 font-mono font-semibold text-gold">{preco}</dt>
              <dd className="text-muted">{texto}, por pessoa</dd>
            </div>
          ))}
          {(Object.entries(PLANO_LEGENDA) as [Plano, string][]).map(([plano, texto]) => (
            <div key={plano} className="flex gap-2">
              <dt className="w-12 shrink-0 text-[11px] font-semibold">
                {plano === 'marcado' ? 'no roteiro' : plano === 'escolha' ? 'sem selo' : plano}
              </dt>
              <dd className="text-muted">{texto}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2.5 text-[12px] leading-snug text-muted">
          <Rich text="Os ícones à direita de cada nome abrem **fotos** e o **mapa** com a busca já pronta, com a cidade certa embutida." />
        </p>
      </section>

      <Link
        href="/mais/konbini"
        className="tappable flex items-center gap-3.5 rounded-2xl border border-hairline bg-surface p-4"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-accent">
          <Sandwich size={20} strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14.5px] font-semibold">Konbini</span>
          <span className="block text-[12px] leading-snug text-muted">
            Os oito itens do 7-Eleven, com checklist e plano por dia
          </span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-muted" />
      </Link>
    </div>
  );
}

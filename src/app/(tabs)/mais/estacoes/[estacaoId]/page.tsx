import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, TrainFront } from 'lucide-react';
import { INTERNOS, internoById } from '@/data/estacoes/internos';
import { mapaEstacoesById } from '@/data/estacoes';
import { InternoEstacao } from '@/components/estacoes/InternoEstacao';
import { Rich } from '@/components/Rich';

export function generateStaticParams() {
  return INTERNOS.map((i) => ({ estacaoId: i.estacaoId }));
}

export default async function InternoPage({ params }: { params: Promise<{ estacaoId: string }> }) {
  const { estacaoId } = await params;
  const interno = internoById(estacaoId);
  if (!interno) notFound();
  const mapa = mapaEstacoesById(interno.mapaId);

  return (
    <div className="space-y-4">
      <header className="pt-1">
        <Link href={`/mais/estacoes?cidade=${interno.mapaId}`} className="inline-flex items-center gap-1 text-[13px] text-muted">
          <ArrowLeft size={16} />
          Mapa das estações{mapa ? ` · ${mapa.titulo}` : ''}
        </Link>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-bold">
          <TrainFront size={22} className="text-rail" />
          {interno.nome}
          {interno.jp && <span className="font-jp text-[14px] font-normal text-muted">{interno.jp}</span>}
        </h1>
        {interno.bussola && <p className="mt-1 font-mono text-[11.5px] text-rail">{interno.bussola}</p>}
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          <Rich text={interno.resumo} />
        </p>
      </header>
      <InternoEstacao interno={interno} />
    </div>
  );
}

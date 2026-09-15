import { Suspense } from 'react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { MapaEstacoes } from '@/components/estacoes/MapaEstacoes';

export const metadata = { title: 'Mapa das estações' };

export default function EstacoesPage() {
  return (
    <div className="space-y-4">
      <SubpageHeader
        title="Mapa das estações"
        subtitle="As linhas que vocês pegam, as estações onde descem e o que há em cada uma"
      />
      <Suspense fallback={<div className="pt-10 text-center text-sm text-muted">Carregando…</div>}>
        <MapaEstacoes />
      </Suspense>
    </div>
  );
}

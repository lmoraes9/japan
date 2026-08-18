'use client';

import { Suspense } from 'react';
import { MapScreen } from '@/components/MapView';

export default function MapaPage() {
  return (
    <Suspense
      fallback={<div className="pt-10 text-center text-muted text-sm">Carregando…</div>}
    >
      <MapScreen />
    </Suspense>
  );
}

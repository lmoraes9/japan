'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { RotateCw, Siren, CalendarDays } from 'lucide-react';

/**
 * Qualquer rota que quebre cai aqui, dentro do layout (a barra de abas continua).
 * Nesta versão do Next o botão recebe `retry`, não `reset`.
 *
 * O que importa na rua é não ficar preso: as duas saídas oferecidas são as
 * páginas que o service worker já guardou para uso offline.
 */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4 pt-10 text-center">
      <p className="text-4xl">🏯</p>
      <h1 className="text-xl font-bold">Esta tela travou</h1>
      <p className="mx-auto max-w-xs text-[13px] leading-relaxed text-muted">
        Foi só esta página, o resto do app está inteiro. Tentar de novo costuma resolver; se não, as duas saídas abaixo funcionam sem internet.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="tappable mx-auto inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-white"
      >
        <RotateCw size={15} /> Tentar de novo
      </button>
      <div className="mx-auto flex max-w-xs flex-col gap-2 pt-2">
        <Link href="/roteiro" className="tappable flex items-center justify-center gap-2 rounded-2xl border border-hairline bg-surface py-3 text-[13px] font-medium">
          <CalendarDays size={15} /> Abrir o roteiro
        </Link>
        <Link href="/mais/emergencia" className="tappable flex items-center justify-center gap-2 rounded-2xl border border-accent/40 bg-accent-soft py-3 text-[13px] font-medium text-accent">
          <Siren size={15} /> Emergência e documentos
        </Link>
      </div>
      {error.digest && <p className="font-mono text-[10px] text-muted/70">código {error.digest}</p>}
    </div>
  );
}

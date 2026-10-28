import Link from 'next/link';
import { Compass, CalendarDays, Menu } from 'lucide-react';

export const metadata = { title: 'Página não encontrada' };

/** Rota inexistente, ou um dia/lugar que saiu do roteiro (links antigos salvos nos favoritos). */
export default function NotFound() {
  return (
    <div className="space-y-4 px-4 pt-16 text-center">
      <p className="text-4xl">🗾</p>
      <h1 className="text-xl font-bold">Esse endereço não existe mais</h1>
      <p className="mx-auto max-w-xs text-[13px] leading-relaxed text-muted">
        O roteiro mudou bastante e um link guardado pode ter ficado para trás. Qualquer uma destas leva ao que está valendo:
      </p>
      <div className="mx-auto flex max-w-xs flex-col gap-2 pt-1">
        <Link href="/" className="tappable flex items-center justify-center gap-2 rounded-2xl bg-accent py-3 text-[14px] font-semibold text-white">
          <Compass size={16} /> Agora
        </Link>
        <Link href="/roteiro" className="tappable flex items-center justify-center gap-2 rounded-2xl border border-hairline bg-surface py-3 text-[13px] font-medium">
          <CalendarDays size={15} /> Roteiro dia a dia
        </Link>
        <Link href="/mais" className="tappable flex items-center justify-center gap-2 rounded-2xl border border-hairline bg-surface py-3 text-[13px] font-medium">
          <Menu size={15} /> Tudo em Mais
        </Link>
      </div>
    </div>
  );
}

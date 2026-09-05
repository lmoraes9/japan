'use client';

import Link from 'next/link';
import { Ticket, BedDouble, ChevronRight } from 'lucide-react';
import { useReservas, hotelFor, reservasOf } from '@/lib/reservas';
import { RESERVA_KIND_LABEL } from '@/data/reservas';

/** hotel da noite + reservas do dia (trens, ingressos, mesas), num bloco compacto */
export function DayReservas({ date, prevDate }: { date: string; prevDate?: string }) {
  const reservas = useReservas();
  const hotelHoje = hotelFor(reservas, date);
  // no bloco "amanhã", não repetir o hotel se for o mesmo de hoje
  const hotel = prevDate && hotelFor(reservas, prevDate)?.id === hotelHoje?.id ? undefined : hotelHoje;
  const doDia = reservasOf(reservas, date).filter((r) => r.kind !== 'voo');
  if (!hotel && doDia.length === 0) return null;

  return (
    <Link href="/mais/reservas" className="tappable block overflow-hidden rounded-2xl border border-hairline bg-surface">
      {hotel && (
        <div className="flex items-center gap-3 border-b border-hairline px-4 py-2.5">
          <BedDouble size={16} className="shrink-0 text-rail" />
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold leading-snug">{hotel.title}</span>
            <span className="block truncate text-[11.5px] text-muted">
              {hotel.addressJp || hotel.address || hotel.time || 'endereço ainda não preenchido'}
            </span>
          </span>
          <ChevronRight size={16} className="shrink-0 text-muted" />
        </div>
      )}
      {doDia.map((r) => (
        <div key={r.id} className="flex items-center gap-3 border-b border-hairline px-4 py-2.5 last:border-b-0">
          <Ticket size={16} className={`shrink-0 ${r.done ? 'text-matcha' : 'text-gold'}`} />
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-semibold leading-snug">
              {RESERVA_KIND_LABEL[r.kind].emoji} {r.title}
            </span>
            <span className="block truncate font-mono text-[11px] text-muted">
              {r.time ?? ''}{r.code ? ` · ${r.code}` : ''}{!r.done ? ' · sem confirmação' : ''}
            </span>
          </span>
        </div>
      ))}
    </Link>
  );
}

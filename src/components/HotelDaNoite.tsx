'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BedDouble, Navigation, Maximize2, ChevronRight } from 'lucide-react';
import { useReservas, hotelFor } from '@/lib/reservas';
import { searchUrl } from '@/lib/mapsLinks';
import { MostrarReserva } from './MostrarReserva';

/**
 * O fim do dia: o hotel onde se dorme nesta noite, depois do último trecho
 * "De volta ao hotel". Sem ele o roteiro terminava no restaurante ou no
 * konbini, e o endereço para o táxi ficava escondido em Reservas.
 */
export function HotelDaNoite({ date }: { date: string }) {
  const reservas = useReservas();
  const hotel = hotelFor(reservas, date);
  const [mostrar, setMostrar] = useState(false);
  if (!hotel) return null;
  const checkin = hotel.date === date;

  return (
    <section className="overflow-hidden rounded-2xl border border-rail/40 bg-surface">
      <div className="flex items-center gap-2 border-b border-hairline bg-rail/10 px-4 py-2">
        <BedDouble size={14} className="text-rail" />
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-foreground/80">
          Fim do dia · {checkin ? 'check-in hoje' : 'hotel'}
        </span>
      </div>
      <div className="space-y-1 px-4 py-3">
        <p className="text-[15px] font-semibold leading-snug">{hotel.title}</p>
        {hotel.addressJp && <p className="font-jp text-[13px] leading-snug">{hotel.addressJp}</p>}
        {hotel.address && <p className="text-[12px] leading-snug text-muted">{hotel.address}</p>}
        {checkin && hotel.time && <p className="font-mono text-[11.5px] text-muted">{hotel.time}</p>}
        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href={searchUrl(hotel.address || hotel.addressJp || hotel.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="tappable inline-flex items-center gap-1.5 rounded-full bg-rail px-3 py-1.5 text-[12px] font-semibold text-white"
          >
            <Navigation size={13} /> Abrir no Maps
          </a>
          <button
            type="button"
            onClick={() => setMostrar(true)}
            className="tappable inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium"
          >
            <Maximize2 size={13} /> Endereço e reserva em tela cheia
          </button>
          <Link
            href={`/mais/reservas#${hotel.id}`}
            className="tappable inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium text-muted"
          >
            Reserva <ChevronRight size={13} />
          </Link>
        </div>
      </div>
      {mostrar && <MostrarReserva r={hotel} onClose={() => setMostrar(false)} />}
    </section>
  );
}

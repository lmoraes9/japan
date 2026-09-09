import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MapaJapao } from '@/components/MapaJapao';

export const metadata = { title: 'A viagem inteira · mapa do Japão' };

export default function MapaJapaoPage() {
  return (
    <div className="min-h-dvh bg-[#dfe6ea] px-4 pt-3">
      <Link
        href="/mais/mapas"
        className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-1 rounded-full bg-black/40 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur"
      >
        <ArrowLeft size={15} /> Mapas
      </Link>
      <MapaJapao />
    </div>
  );
}

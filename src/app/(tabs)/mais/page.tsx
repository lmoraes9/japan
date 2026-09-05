import Link from 'next/link';
import {
  ShoppingBag,
  MessageSquareText,
  Plane,
  MapPinPlus,
  Sandwich,
  MapPinned,
  Ticket,
  Siren,
  Luggage,
  Settings,
  ChevronRight,
  Star,
} from 'lucide-react';

const ITEMS = [
  {
    href: '/mais/mapas',
    icon: MapPinned,
    title: 'Mapas ilustrados',
    subtitle: 'Sensō-ji, Miyajima, Fushimi Inari e Nara, ponto a ponto, com foto e história',
    highlight: true,
  },
  {
    href: '/mais/reservas',
    icon: Ticket,
    title: 'Reservas',
    subtitle: 'Voos, hotéis, trens e ingressos — com o endereço para mostrar ao taxista',
  },
  {
    href: '/mais/emergencia',
    icon: Siren,
    title: 'Emergência e documentos',
    subtitle: 'Consulado, 110/119, hospitais com inglês, seguro e passaporte',
  },
  {
    href: '/mais/mala',
    icon: Luggage,
    title: 'Mala',
    subtitle: 'O que levar para 5 a 15 °C — e o que deixar em casa para a volta',
  },
  {
    href: '/mais/compras',
    icon: ShoppingBag,
    title: 'Compras',
    subtitle: 'Checklist sincronizada + guias de compra e tax-free',
  },
  {
    href: '/mais/konbini',
    icon: Sandwich,
    title: 'Konbini',
    subtitle: 'Os oito itens do 7-Eleven, com checklist e plano por dia',
  },
  {
    href: '/mais/frases',
    icon: MessageSquareText,
    title: 'Frases em japonês',
    subtitle: 'Por situação, com tela grande para mostrar ao atendente',
  },
  {
    href: '/mais/logistica',
    icon: Plane,
    title: 'Logística',
    subtitle: 'Voos, trens, takuhaibin, checklist pré-viagem',
  },
  {
    href: '/mais/favoritos',
    icon: Star,
    title: 'Favoritos e notas',
    subtitle: 'Tudo que vocês marcaram no roteiro',
  },
  {
    href: '/mais/extras',
    icon: MapPinPlus,
    title: 'Extras',
    subtitle: 'Nikkō, Kōyasan, Uji, Kobe e Shimanami Kaidō',
  },
  {
    href: '/mais/ajustes',
    icon: Settings,
    title: 'Ajustes',
    subtitle: 'Código da viagem, cotação, orçamento, tema',
  },
];

export default function MaisPage() {
  return (
    <div className="space-y-4">
      <header className="pt-2">
        <h1 className="text-2xl font-bold">Mais</h1>
      </header>
      <div className="space-y-2.5">
        {ITEMS.map(({ href, icon: Icon, title, subtitle, highlight }) => (
          <Link
            key={href}
            href={href}
            className={`tappable flex items-center gap-3.5 rounded-2xl border bg-surface p-4 ${
              highlight ? 'border-accent/40 bg-accent-soft/40' : 'border-hairline'
            }`}
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${highlight ? 'bg-accent text-white' : 'bg-surface-2 text-accent'}`}>
              <Icon size={20} strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-semibold">{title}</p>
              <p className="text-[12px] text-muted leading-snug">{subtitle}</p>
            </div>
            <ChevronRight size={18} className="text-muted shrink-0" />
          </Link>
        ))}
      </div>
      <p className="text-center text-[11px] text-muted pt-4 font-jp tracking-[0.3em]">
        道中ご無事で
      </p>
    </div>
  );
}

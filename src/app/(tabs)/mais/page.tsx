import Link from 'next/link';
import {
  ShoppingBag,
  MessageSquareText,
  Plane,
  MapPinPlus,
  Settings,
  ChevronRight,
  Star,
} from 'lucide-react';

const ITEMS = [
  {
    href: '/mais/compras',
    icon: ShoppingBag,
    title: 'Compras',
    subtitle: 'Checklist sincronizada + guias de compra e tax-free',
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
        {ITEMS.map(({ href, icon: Icon, title, subtitle }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3.5 rounded-2xl border border-hairline bg-surface p-4"
          >
            <Icon size={22} className="text-accent shrink-0" strokeWidth={1.8} />
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

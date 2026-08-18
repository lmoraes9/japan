'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, CalendarDays, Map, Wallet, Menu } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Agora', icon: Compass },
  { href: '/roteiro', label: 'Roteiro', icon: CalendarDays },
  { href: '/mapa', label: 'Mapa', icon: Map },
  { href: '/gastos', label: 'Gastos', icon: Wallet },
  { href: '/mais', label: 'Mais', icon: Menu },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-lg border-t border-hairline">
      <div
        className="mx-auto max-w-xl grid grid-cols-5"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {TABS.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                active ? 'text-accent' : 'text-muted'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

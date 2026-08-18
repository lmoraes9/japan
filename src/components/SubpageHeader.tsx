import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function SubpageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="pt-1">
      <Link
        href="/mais"
        className="inline-flex items-center gap-1 text-[13px] text-muted"
      >
        <ArrowLeft size={16} />
        Mais
      </Link>
      <h1 className="text-2xl font-bold mt-2">{title}</h1>
      {subtitle && <p className="text-[13px] text-muted mt-0.5">{subtitle}</p>}
    </header>
  );
}

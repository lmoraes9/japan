import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import { Rich } from '@/components/Rich';
import { JAPAN_CHAPTERS } from '@/data/historiaJapao';

export function generateStaticParams() {
  return JAPAN_CHAPTERS.map((c) => ({ id: c.id }));
}

/** Um capítulo da história do Japão, em versão longa, com seções e navegação. */
export default async function CapituloPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idx = JAPAN_CHAPTERS.findIndex((c) => c.id === id);
  if (idx < 0) notFound();
  const ch = JAPAN_CHAPTERS[idx];
  const prev = JAPAN_CHAPTERS[idx - 1];
  const next = JAPAN_CHAPTERS[idx + 1];
  const words = ch.sections.reduce((n, s) => n + s.paragraphs.join(' ').split(/\s+/).length, 0);
  const minutes = Math.max(3, Math.round(words / 200));

  return (
    <div className="space-y-5">
      <header className="-mx-4 -mt-3 bg-surface-2 px-4 pb-5 pt-3">
        <Link href="/mais/historia" className="inline-flex items-center gap-1 text-[13px] font-medium text-accent">
          <ArrowLeft size={15} /> História
        </Link>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-muted">
          Capítulo {idx + 1} de {JAPAN_CHAPTERS.length} · {ch.years} · ~{minutes} min de leitura
        </p>
        <p className="font-jp mt-2 text-[15px] tracking-[0.25em] text-foreground/75">{ch.jp}</p>
        <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight">{ch.title}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">{ch.lead}</p>
      </header>

      <nav className="rounded-2xl border border-hairline bg-surface px-4 py-3">
        <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-widest text-muted">Neste capítulo</p>
        <ol className="space-y-1">
          {ch.sections.map((s, i) => (
            <li key={i}>
              <a href={`#s${i + 1}`} className="flex gap-2 text-[13.5px] leading-snug">
                <span className="w-5 shrink-0 font-mono text-[11px] tabular-nums text-muted">{i + 1}.</span>
                <span className="text-accent underline decoration-accent/30 underline-offset-2">{s.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {ch.sections.map((s, i) => (
        <section key={i} id={`s${i + 1}`} className="scroll-mt-4">
          <h2 className="mb-2 text-[19px] font-bold leading-tight tracking-tight">
            <span className="mr-2 font-mono text-[12px] font-normal text-muted">{i + 1}</span>
            {s.title}
          </h2>
          <div className="space-y-3 text-[15px] leading-relaxed">
            {s.paragraphs.map((p, j) => (
              <p key={j}><Rich text={p} /></p>
            ))}
          </div>
        </section>
      ))}

      {ch.noRoteiro.length > 0 && (
        <section className="rounded-2xl border border-hairline bg-surface p-4">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted"><CalendarDays size={13} /> No roteiro</p>
          <ul className="space-y-1.5">
            {ch.noRoteiro.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href} className="text-[13.5px] font-medium text-accent underline decoration-accent/30 underline-offset-2">{l.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid grid-cols-2 gap-2 pb-2">
        {prev ? (
          <Link href={`/mais/historia/japao/${prev.id}`} className="tappable rounded-2xl border border-hairline bg-surface px-3 py-3">
            <span className="flex items-center gap-1 font-mono text-[10.5px] uppercase tracking-widest text-muted"><ArrowLeft size={12} /> Capítulo {idx}</span>
            <span className="mt-1 block text-[13.5px] font-semibold leading-snug">{prev.title}</span>
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/mais/historia/japao/${next.id}`} className="tappable rounded-2xl border border-hairline bg-surface px-3 py-3 text-right">
            <span className="flex items-center justify-end gap-1 font-mono text-[10.5px] uppercase tracking-widest text-muted">Capítulo {idx + 2} <ArrowRight size={12} /></span>
            <span className="mt-1 block text-[13.5px] font-semibold leading-snug">{next.title}</span>
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}

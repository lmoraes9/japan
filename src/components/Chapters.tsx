'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, MapPin } from 'lucide-react';
import type { Chapter } from '@/data/historia';
import { Rich } from './Rich';

/** capítulos em sanfona: título, anos, frase de abertura; toca para ler */
export function Chapters({ chapters, numbered }: { chapters: Chapter[]; numbered?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
      {chapters.map((c, i) => {
        const isOpen = open === c.id;
        return (
          <div key={c.id} className="border-b border-hairline last:border-b-0">
            <button onClick={() => setOpen(isOpen ? null : c.id)} aria-expanded={isOpen} className="flex w-full items-start gap-3 px-4 py-3 text-left active:bg-surface-2">
              {numbered && <span className="mt-0.5 w-6 shrink-0 font-mono text-[12px] tabular-nums text-accent">{String(i + 1).padStart(2, '0')}</span>}
              <span className="min-w-0 flex-1">
                {c.years && <span className="block font-mono text-[10.5px] uppercase tracking-wider text-muted">{c.years}</span>}
                <span className="block text-[14.5px] font-semibold leading-snug">{c.title} {c.jp && <span className="font-jp text-[11px] font-normal text-muted">{c.jp}</span>}</span>
                {!isOpen && <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{c.lead}</span>}
              </span>
              <ChevronDown size={16} className={`mt-1 shrink-0 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="space-y-3 px-4 pb-4 text-[14px] leading-relaxed">
                <p className="italic text-foreground/80">{c.lead}</p>
                {c.paragraphs.map((p, k) => <p key={k}><Rich text={p} /></p>)}
                {c.noRoteiro && (
                  <ul className="space-y-1 rounded-xl bg-surface-2/70 p-3">
                    {c.noRoteiro.map((l) => (
                      <li key={l.href}><Link href={l.href} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-accent"><MapPin size={12} /> {l.label}</Link></li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

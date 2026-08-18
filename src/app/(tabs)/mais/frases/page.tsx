'use client';

import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { PHRASES, SITUATIONS } from '@/data/phrases';
import type { Phrase, PhraseSituation } from '@/data/types';

function LargePrintSheet({
  phrase,
  onClose,
}: {
  phrase: Phrase;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-white text-black flex flex-col items-center justify-center p-8"
      onClick={onClose}
    >
      <button className="absolute top-5 right-5 text-black/50" aria-label="Fechar">
        <X size={28} />
      </button>
      <p className="font-jp text-[clamp(28px,9vw,64px)] font-semibold leading-snug text-center">
        {phrase.jp}
      </p>
      <p className="mt-8 text-[15px] text-black/60 text-center">{phrase.romaji}</p>
      <p className="mt-2 text-[14px] text-black/40 text-center">{phrase.pt}</p>
      <p className="mt-10 text-[12px] text-black/30">toque para fechar</p>
    </div>
  );
}

export default function FrasesPage() {
  const [situation, setSituation] = useState<PhraseSituation>('restaurante');
  const [bigPhrase, setBigPhrase] = useState<Phrase | null>(null);

  const list = PHRASES.filter((p) => p.situation === situation);

  return (
    <div className="space-y-4">
      <SubpageHeader
        title="Frases"
        subtitle="Toque no ícone de expandir para mostrar a frase ao atendente"
      />

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4">
        {SITUATIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSituation(s.id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${
              situation === s.id
                ? 'border-accent bg-accent text-white'
                : 'border-hairline bg-surface text-foreground/80'
            }`}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {list.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-hairline bg-surface p-3.5 flex items-start gap-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-muted leading-snug">{p.pt}</p>
              <p className="font-jp text-[17px] font-semibold mt-1.5 leading-snug">
                {p.jp}
              </p>
              <p className="text-[12px] text-accent font-medium mt-1">
                {p.romaji}
              </p>
            </div>
            <button
              onClick={() => setBigPhrase(p)}
              className="shrink-0 rounded-full border border-hairline p-2 text-muted"
              aria-label="Mostrar em tela cheia"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {bigPhrase && (
        <LargePrintSheet phrase={bigPhrase} onClose={() => setBigPhrase(null)} />
      )}
    </div>
  );
}

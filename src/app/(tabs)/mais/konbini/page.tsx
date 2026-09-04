import { SubpageHeader } from '@/components/SubpageHeader';
import { ChecklistGroup } from '@/components/ChecklistGroup';
import { Rich } from '@/components/Rich';
import { KONBINI_CHECKLIST } from '@/data/checklist';
import { KONBINI_INTRO, KONBINI_ITEMS, KONBINI_PLAN, KONBINI_ITEM_BY_ID } from '@/data/konbini';

export default function KonbiniPage() {
  return (
    <div className="space-y-4">
      <SubpageHeader
        title="Konbini"
        subtitle="Caça ao tesouro no 7-Eleven, espalhada pela viagem"
      />

      <div className="rounded-2xl border border-hairline bg-surface p-4 space-y-2.5">
        {KONBINI_INTRO.map((p, i) => (
          <p key={i} className="text-[13px] leading-relaxed text-foreground/90">
            <Rich text={p} />
          </p>
        ))}
      </div>

      <ChecklistGroup items={KONBINI_CHECKLIST} title="Os oito itens" />

      <div className="rounded-2xl border border-matcha/50 bg-matcha/10 p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted mb-2">
          Onde cada um encaixa no roteiro
        </p>
        <div className="space-y-2.5">
          {KONBINI_PLAN.map((stop) => (
            <div key={stop.day} className="flex gap-3">
              <span className="font-mono text-[12px] font-semibold text-accent shrink-0 w-11 tabular-nums">
                {stop.day}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-snug">{stop.label}</p>
                <p className="text-[12px] text-muted leading-snug mt-0.5">
                  {stop.itemIds
                    .map((id) => KONBINI_ITEM_BY_ID[id]?.title ?? id)
                    .join(' · ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {KONBINI_ITEMS.map((item) => (
        <details
          key={item.id}
          className="rounded-2xl border border-hairline bg-surface p-4"
        >
          <summary className="cursor-pointer">
            <span className="text-[14px] font-semibold">{item.title}</span>
            <span className="font-jp text-[12px] text-muted ml-1.5">{item.jp}</span>
          </summary>
          <p className="font-mono text-[11px] text-muted mt-1.5 leading-relaxed">
            {item.romaji} · {item.price} · {item.where}
          </p>
          <div className="mt-2 space-y-2">
            {item.paragraphs.map((p, i) => (
              <p key={i} className="text-[13px] leading-relaxed text-foreground/90">
                <Rich text={p} />
              </p>
            ))}
            {item.tip && (
              <p className="text-[12px] leading-relaxed text-muted border-l-2 border-gold/60 pl-2.5">
                <Rich text={item.tip} />
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

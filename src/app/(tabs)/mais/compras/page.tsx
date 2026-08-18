import { SubpageHeader } from '@/components/SubpageHeader';
import { ChecklistGroup } from '@/components/ChecklistGroup';
import { NoteCard, DataTable } from '@/components/InfoBlocks';
import { Rich } from '@/components/Rich';
import { COMPRAS_ITEMS } from '@/data/checklist';
import {
  SHOPPING_GUIDES,
  TAXFREE_TABLE,
  TAXFREE_FOOTNOTE,
} from '@/data/shopping';

export default function ComprasPage() {
  return (
    <div className="space-y-4">
      <SubpageHeader
        title="Compras"
        subtitle="A lista sincroniza entre os dois celulares"
      />

      <ChecklistGroup items={COMPRAS_ITEMS} title="Checklist de compras" />

      <details className="rounded-2xl border border-hairline bg-surface p-4" open>
        <summary className="text-[14px] font-semibold cursor-pointer">
          Como funciona o novo tax-free
        </summary>
        <div className="mt-3 space-y-3">
          <DataTable table={TAXFREE_TABLE} />
          <p className="text-[12px] text-muted leading-relaxed">
            <Rich text={TAXFREE_FOOTNOTE} />
          </p>
        </div>
      </details>

      {SHOPPING_GUIDES.map((guide) => (
        <details
          key={guide.id}
          className="rounded-2xl border border-hairline bg-surface p-4"
        >
          <summary className="text-[14px] font-semibold cursor-pointer">
            {guide.title}
          </summary>
          <div className="mt-3 space-y-3">
            {guide.blocks.map((block, i) => {
              if (block.type === 'p') {
                return (
                  <p key={i} className="text-[13px] leading-relaxed">
                    <Rich text={block.text} />
                  </p>
                );
              }
              if (block.type === 'note') {
                return <NoteCard key={i} note={block.note} />;
              }
              if (block.type === 'table') {
                return <DataTable key={i} table={block.table} />;
              }
              return (
                <ul key={i} className="list-disc pl-4 space-y-1.5 text-[13px]">
                  {block.items.map((item, j) => (
                    <li key={j}>
                      <Rich text={item} />
                    </li>
                  ))}
                </ul>
              );
            })}
          </div>
        </details>
      ))}
    </div>
  );
}

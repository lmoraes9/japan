import { SubpageHeader } from '@/components/SubpageHeader';
import { ChecklistGroup } from '@/components/ChecklistGroup';
import { NoteCard } from '@/components/InfoBlocks';
import { MALA_ITEMS } from '@/data/checklist';
import { CLIMATE } from '@/data/logistics';

const REGRAS = [
  'A mala **volta cheia**: MacBook, roupa de cama, facas, presentes. Ir com ela pela metade não é economia, é planejamento.',
  'Roupa para **4 ou 5 dias**, não 16. Camiseta e meia se compram no dia 19 e lavam no hotel; casaco bom, um só.',
  'Tudo que é **eletrônico com bateria** vai na mão: power bank, câmera, o MacBook novo na volta.',
  'Facas e o que for cortante, **despachado**. Líquido acima de 100 ml, despachado.',
];

export default function MalaPage() {
  return (
    <div className="space-y-4">
      <SubpageHeader title="Mala" subtitle="O que levar para 5 a 15 °C em novembro" />

      <ul className="list-disc space-y-1.5 rounded-2xl bg-surface-2 p-4 pl-8 text-[13px] leading-relaxed">
        {REGRAS.map((r, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: r.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') }} />
        ))}
      </ul>

      <ChecklistGroup items={MALA_ITEMS} title="Na mala" />

      <NoteCard note={CLIMATE} />
    </div>
  );
}

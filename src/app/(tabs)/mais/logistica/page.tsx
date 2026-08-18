import { SubpageHeader } from '@/components/SubpageHeader';
import { NoteCard, DataTable } from '@/components/InfoBlocks';
import { ChecklistGroup } from '@/components/ChecklistGroup';
import { Rich } from '@/components/Rich';
import { PRETRIP_ITEMS } from '@/data/checklist';
import {
  ALERTS,
  FLIGHTS_TABLE,
  FLIGHT_NOTES,
  TRAINS_INTRO,
  TRAINS_TABLE,
  TRAINS_NOTES,
  TAKUHAIBIN,
  CLIMATE,
  KEY_DATES,
} from '@/data/logistics';

export default function LogisticaPage() {
  return (
    <div className="space-y-4">
      <SubpageHeader
        title="Logística"
        subtitle="Voos, trens, malas e o que decidir antes de embarcar"
      />

      <ChecklistGroup items={PRETRIP_ITEMS} title="Antes de embarcar" />

      <section className="space-y-2.5">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-accent pt-2">
          Os voos
        </h2>
        <DataTable table={FLIGHTS_TABLE} />
        {FLIGHT_NOTES.map((n) => (
          <NoteCard key={n.label} note={n} />
        ))}
      </section>

      <section className="space-y-2.5">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-accent pt-2">
          Trens
        </h2>
        {TRAINS_INTRO.map((p, i) => (
          <p key={i} className="text-[13px] leading-relaxed">
            <Rich text={p} />
          </p>
        ))}
        <DataTable table={TRAINS_TABLE} />
        {TRAINS_NOTES.map((n) => (
          <NoteCard key={n.label} note={n} />
        ))}
      </section>

      <section className="space-y-2.5">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-accent pt-2">
          Malas, clima e datas
        </h2>
        <NoteCard note={TAKUHAIBIN} />
        <NoteCard note={CLIMATE} />
        <NoteCard note={KEY_DATES} />
      </section>

      <section className="space-y-2.5">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-accent pt-2">
          Os 3 alertas
        </h2>
        {ALERTS.map((a) => (
          <NoteCard key={a.label} note={a} />
        ))}
      </section>
    </div>
  );
}

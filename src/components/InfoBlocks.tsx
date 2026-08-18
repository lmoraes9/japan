import type { InfoBlock, TableBlock } from '@/data/logistics';
import { Rich } from './Rich';

export function NoteCard({ note }: { note: InfoBlock }) {
  const cls =
    note.tone === 'warn'
      ? 'border-accent/50 bg-accent-soft'
      : note.tone === 'ok'
        ? 'border-matcha/50 bg-matcha/10'
        : 'border-hairline bg-surface-2';
  return (
    <div className={`rounded-2xl border p-3.5 text-[13px] leading-relaxed ${cls}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5 text-muted">
        {note.label}
      </p>
      {note.paragraphs?.map((p, i) => (
        <p key={i} className={i > 0 ? 'mt-2' : ''}>
          <Rich text={p} />
        </p>
      ))}
      {note.bullets && (
        <ul className="list-disc pl-4 space-y-1.5 mt-2">
          {note.bullets.map((b, i) => (
            <li key={i}>
              <Rich text={b} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DataTable({ table }: { table: TableBlock }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface overflow-x-auto">
      {table.title && (
        <p className="px-3.5 pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted">
          {table.title}
        </p>
      )}
      <table className="w-full text-[12.5px]">
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th
                key={i}
                className="text-left font-mono text-[10px] uppercase tracking-wider text-muted px-3.5 py-2.5 border-b border-hairline"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className={i > 0 ? 'border-t border-hairline' : ''}>
              {row.map((cell, j) => (
                <td key={j} className="px-3.5 py-2.5 align-top leading-snug">
                  <Rich text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

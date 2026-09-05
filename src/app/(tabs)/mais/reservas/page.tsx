'use client';

import { useState } from 'react';
import { Pencil, Check, X, Plus, Trash2, Car, Copy, Navigation } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { RESERVA_SEEDS, RESERVA_KIND_LABEL, RESERVA_KINDS } from '@/data/reservas';
import type { Reserva, ReservaKind } from '@/data/types';
import { useSyncStore } from '@/lib/store';
import { useReservas } from '@/lib/reservas';
import { formatDayLabel } from '@/lib/now';
import { searchUrl } from '@/lib/mapsLinks';

const FIELDS: { key: keyof Reserva; label: string; placeholder: string; multiline?: boolean; jp?: boolean }[] = [
  { key: 'title', label: 'Nome', placeholder: 'ex.: Hotel Gracery Shinjuku' },
  { key: 'time', label: 'Horário', placeholder: 'ex.: check-in 15:00 · check-out 11:00' },
  { key: 'code', label: 'Código / localizador', placeholder: 'ex.: ABC123' },
  { key: 'address', label: 'Endereço', placeholder: 'ex.: 1-19-1 Kabukicho, Shinjuku-ku' },
  { key: 'addressJp', label: 'Endereço em japonês (para o taxista)', placeholder: 'ex.: 新宿区歌舞伎町1-19-1', jp: true },
  { key: 'phone', label: 'Telefone', placeholder: 'ex.: +81 3-1234-5678' },
  { key: 'notes', label: 'Observações', placeholder: 'o que for útil na hora', multiline: true },
];

function TaxiCard({ r, onClose }: { r: Reserva; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white p-7 text-black" onClick={onClose}>
      <button className="absolute right-5 top-5 text-black/50" aria-label="Fechar">
        <X size={28} />
      </button>
      <p className="text-[13px] uppercase tracking-widest text-black/40">この住所までお願いします</p>
      <p className="mt-6 text-center font-jp text-[clamp(26px,7.5vw,54px)] font-semibold leading-snug">{r.addressJp || r.title}</p>
      {r.addressJp && <p className="mt-6 text-center text-[20px] font-semibold">{r.title}</p>}
      {r.address && <p className="mt-2 text-center text-[15px] text-black/60">{r.address}</p>}
      {r.phone && <p className="mt-4 font-mono text-[15px] text-black/60">{r.phone}</p>}
      <p className="mt-10 text-[12px] text-black/30">"Por favor, me leve a este endereço" · toque para fechar</p>
    </div>
  );
}

function ReservaCard({ r }: { r: Reserva }) {
  const upsert = useSyncStore((s) => s.upsertReserva);
  const remove = useSyncStore((s) => s.removeReserva);
  const [editing, setEditing] = useState(false);
  const [taxi, setTaxi] = useState(false);
  const [draft, setDraft] = useState<Reserva>(r);
  const [copied, setCopied] = useState(false);
  const meta = RESERVA_KIND_LABEL[r.kind];
  const seed = RESERVA_SEEDS.find((s) => s.id === r.id);
  const filled = !!(r.code || r.address || r.addressJp);

  const save = () => {
    upsert({ ...draft, updatedAt: Date.now() });
    setEditing(false);
  };

  const copy = async (t: string) => {
    try {
      await navigator.clipboard.writeText(t);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  if (editing) {
    return (
      <div className="space-y-2.5 rounded-2xl border border-accent bg-surface p-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            {meta.emoji} {meta.label} · {formatDayLabel(r.date)}
          </p>
          <div className="flex gap-1">
            <button onClick={() => { setDraft(r); setEditing(false); }} className="rounded-full p-2 text-muted" aria-label="Cancelar">
              <X size={17} />
            </button>
            <button onClick={save} className="rounded-full bg-accent p-2 text-white" aria-label="Salvar">
              <Check size={17} />
            </button>
          </div>
        </div>
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="text-[11px] font-medium text-muted">{f.label}</span>
            {f.multiline ? (
              <textarea
                value={(draft[f.key] as string) ?? ''}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                rows={2}
                className="mt-0.5 w-full rounded-xl border border-hairline bg-surface-2 p-2.5 text-[13px] outline-none focus:border-accent"
              />
            ) : (
              <input
                value={(draft[f.key] as string) ?? ''}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className={`mt-0.5 w-full rounded-xl border border-hairline bg-surface-2 p-2.5 text-[13px] outline-none focus:border-accent ${f.jp ? 'font-jp' : ''}`}
              />
            )}
          </label>
        ))}
        <label className="flex items-center gap-2 text-[13px]">
          <input type="checkbox" checked={!!draft.done} onChange={(e) => setDraft({ ...draft, done: e.target.checked })} className="h-[18px] w-[18px] accent-[var(--matcha)]" />
          Confirmada / comprada
        </label>
        {!seed && (
          <button onClick={() => { remove(r.id); setEditing(false); }} className="flex items-center gap-1.5 text-[12px] text-accent">
            <Trash2 size={13} /> Apagar esta reserva
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border bg-surface p-4 ${r.done ? 'border-matcha/50' : 'border-hairline'}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl leading-none">{meta.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted">
            {formatDayLabel(r.date)}
            {r.dateEnd ? ` → ${formatDayLabel(r.dateEnd)}` : ''}
            {r.done && <span className="ml-2 text-matcha">✓ confirmada</span>}
          </p>
          <h2 className="text-[15px] font-semibold leading-snug">{r.title}</h2>
          {r.time && <p className="mt-0.5 font-mono text-[12px] text-muted">{r.time}</p>}
          {r.code && (
            <button onClick={() => copy(r.code!)} className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2 py-1 font-mono text-[13px] font-semibold">
              {r.code} <Copy size={12} className="text-muted" />
              {copied && <span className="text-[10px] font-sans font-normal text-matcha">copiado</span>}
            </button>
          )}
          {r.address && <p className="mt-1.5 text-[12.5px] leading-snug text-foreground/85">{r.address}</p>}
          {r.addressJp && <p className="font-jp text-[12.5px] leading-snug text-muted">{r.addressJp}</p>}
          {r.phone && <p className="mt-0.5 font-mono text-[12px] text-muted">{r.phone}</p>}
          {r.notes && <p className="mt-1.5 text-[12.5px] leading-snug text-muted">{r.notes}</p>}
          {!filled && seed?.hint && (
            <p className="mt-1.5 text-[12px] italic text-accent/80">Falta preencher: {seed.hint}</p>
          )}
        </div>
        <button onClick={() => { setDraft(r); setEditing(true); }} className="shrink-0 rounded-full border border-hairline p-2 text-muted" aria-label="Editar">
          <Pencil size={15} />
        </button>
      </div>

      {(r.addressJp || r.address) && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => setTaxi(true)} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12px] font-medium text-white">
            <Car size={13} /> Mostrar ao taxista
          </button>
          <a href={searchUrl(r.address || r.addressJp || r.title)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium text-foreground/80">
            <Navigation size={13} /> Maps
          </a>
        </div>
      )}
      {taxi && <TaxiCard r={r} onClose={() => setTaxi(false)} />}
    </div>
  );
}

function NewReserva({ onDone }: { onDone: () => void }) {
  const upsert = useSyncStore((s) => s.upsertReserva);
  const [kind, setKind] = useState<ReservaKind>('ingresso');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-11-18');
  const save = () => {
    if (!title.trim()) return;
    upsert({ id: `r${Date.now()}`, kind, title: title.trim(), date, updatedAt: Date.now() });
    onDone();
  };
  return (
    <div className="space-y-2.5 rounded-2xl border border-accent bg-surface p-4">
      <p className="text-[14px] font-semibold">Nova reserva</p>
      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
        {RESERVA_KINDS.map((k) => (
          <button key={k} onClick={() => setKind(k)} className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium ${kind === k ? 'border-accent bg-accent text-white' : 'border-hairline bg-surface-2'}`}>
            {RESERVA_KIND_LABEL[k].emoji} {RESERVA_KIND_LABEL[k].label}
          </button>
        ))}
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nome (ex.: teamLab Planets)" className="w-full rounded-xl border border-hairline bg-surface-2 p-2.5 text-[13px] outline-none focus:border-accent" />
      <input type="date" value={date} min="2026-11-16" max="2026-12-04" onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-hairline bg-surface-2 p-2.5 text-[13px] outline-none focus:border-accent" />
      <div className="flex gap-2">
        <button onClick={onDone} className="flex-1 rounded-xl border border-hairline py-2.5 text-[13px] font-medium">Cancelar</button>
        <button onClick={save} disabled={!title.trim()} className="flex-1 rounded-xl bg-accent py-2.5 text-[13px] font-semibold text-white disabled:opacity-40">Criar</button>
      </div>
    </div>
  );
}

export default function ReservasPage() {
  const reservas = useReservas();
  const [adding, setAdding] = useState(false);
  const pendentes = reservas.filter((r) => !r.done).length;

  return (
    <div className="space-y-3.5">
      <SubpageHeader
        title="Reservas"
        subtitle={`${reservas.length} itens · ${pendentes} ainda sem confirmação · sincroniza entre os dois celulares`}
      />

      <p className="rounded-2xl bg-surface-2 p-3.5 text-[12.5px] leading-relaxed text-muted">
        Toque no lápis para preencher nome, código e <strong>endereço em japonês</strong>. O botão "Mostrar ao taxista" abre o endereço em letra grande. Tudo fica disponível offline.
      </p>

      {adding ? (
        <NewReserva onDone={() => setAdding(false)} />
      ) : (
        <button onClick={() => setAdding(true)} className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-hairline py-2.5 text-[13px] font-medium text-muted">
          <Plus size={15} /> Adicionar reserva
        </button>
      )}

      {reservas.map((r) => (
        <ReservaCard key={r.id} r={r} />
      ))}
    </div>
  );
}

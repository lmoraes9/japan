'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { Expense, ExpenseCategory } from '@/data/types';
import { COMPRAS_ITEMS } from '@/data/checklist';
import { useSyncStore, activeExpenses } from '@/lib/store';
import {
  useSettings,
  effectiveRate,
  fmtBrl,
  fmtJpy,
} from '@/lib/settings';
import { getJstParts } from '@/lib/now';

const CATEGORIES: { id: ExpenseCategory; label: string; emoji: string }[] = [
  { id: 'comida', label: 'Comida', emoji: '🍜' },
  { id: 'transporte', label: 'Transporte', emoji: '🚄' },
  { id: 'compras', label: 'Compras', emoji: '🛍️' },
  { id: 'hospedagem', label: 'Hospedagem', emoji: '🏨' },
  { id: 'outros', label: 'Outros', emoji: '📦' },
];

const catLabel = (id: string) =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[4];

function ExpenseForm({ onClose }: { onClose: () => void }) {
  const upsert = useSyncStore((s) => s.upsertExpense);
  const who = useSettings((s) => s.who);
  const settings = useSettings();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('comida');
  const [note, setNote] = useState('');
  const [checklistItemId, setChecklistItemId] = useState('');

  const amountJpy = parseInt(amount.replace(/\D/g, ''), 10) || 0;
  const { rate } = effectiveRate(settings);

  const save = () => {
    if (amountJpy <= 0) return;
    const e: Expense = {
      id: `e${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      amountJpy,
      category,
      note: note.trim(),
      date: getJstParts().date,
      who,
      checklistItemId: checklistItemId || undefined,
      updatedAt: Date.now(),
    };
    upsert(e);
    onClose();
  };

  return (
    <div className="rounded-3xl border border-accent bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[15px]">Novo gasto</h2>
        <button onClick={onClose} className="text-muted" aria-label="Fechar">
          <X size={18} />
        </button>
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-muted">¥</span>
          <input
            autoFocus
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-transparent text-3xl font-bold font-mono outline-none placeholder:text-muted/40"
          />
        </div>
        <p className="text-[12px] text-muted mt-1">
          ≈ {fmtBrl(amountJpy * rate)}
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-medium ${
              category === c.id
                ? 'border-accent bg-accent text-white'
                : 'border-hairline bg-surface-2 text-foreground/80'
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <input
        placeholder="Nota (opcional) — ex.: ramen no Ichiran"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full rounded-xl border border-hairline bg-surface-2 p-2.5 text-[13px] outline-none focus:border-accent"
      />

      {category === 'compras' && (
        <select
          value={checklistItemId}
          onChange={(e) => setChecklistItemId(e.target.value)}
          className="w-full rounded-xl border border-hairline bg-surface-2 p-2.5 text-[13px] outline-none"
        >
          <option value="">Vincular a item da lista (opcional)</option>
          {COMPRAS_ITEMS.map((i) => (
            <option key={i.id} value={i.id}>
              {i.title}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={save}
        disabled={amountJpy <= 0}
        className="w-full rounded-2xl bg-accent text-white font-semibold py-3 disabled:opacity-40"
      >
        Salvar {amountJpy > 0 && fmtJpy(amountJpy)}
      </button>
    </div>
  );
}

export default function GastosPage() {
  const state = useSyncStore((s) => s.state);
  const remove = useSyncStore((s) => s.removeExpense);
  const settings = useSettings();
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const expenses = useMemo(() => activeExpenses(state), [state]);
  const { rate, source } = effectiveRate(settings);
  const total = expenses.reduce((a, e) => a + e.amountJpy, 0);

  const byCategory = CATEGORIES.map((c) => ({
    ...c,
    total: expenses
      .filter((e) => e.category === c.id)
      .reduce((a, e) => a + e.amountJpy, 0),
  })).filter((c) => c.total > 0);

  const comprasTotal =
    byCategory.find((c) => c.id === 'compras')?.total ?? 0;
  const budget = settings.budgetJpy;

  const byDate = useMemo(() => {
    const groups: Record<string, Expense[]> = {};
    expenses.forEach((e) => {
      (groups[e.date] ??= []).push(e);
    });
    return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [expenses]);

  return (
    <div className="space-y-4">
      <header className="pt-2 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gastos</h1>
          <p className="text-[13px] text-muted">
            {fmtJpy(total)} · {fmtBrl(total * rate)}
            {source !== 'api' && (
              <span className="text-gold"> · cotação {source === 'manual' ? 'manual' : 'aprox.'}</span>
            )}
          </p>
        </div>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="rounded-full bg-accent text-white p-3 shadow-md"
            aria-label="Novo gasto"
          >
            <Plus size={20} />
          </button>
        )}
      </header>

      {formOpen && <ExpenseForm onClose={() => setFormOpen(false)} />}

      {budget != null && budget > 0 && (
        <div className="rounded-2xl border border-hairline bg-surface p-3.5">
          <div className="flex justify-between text-[12px] mb-1.5">
            <span className="font-medium">Orçamento de compras</span>
            <span className="text-muted">
              {fmtJpy(comprasTotal)} de {fmtJpy(budget)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                comprasTotal > budget ? 'bg-accent' : 'bg-matcha'
              }`}
              style={{ width: `${Math.min(100, (comprasTotal / budget) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {byCategory.length > 0 && (
        <div className="rounded-2xl border border-hairline bg-surface p-3.5 space-y-2">
          {byCategory.map((c) => (
            <div key={c.id} className="flex items-center gap-2.5 text-[13px]">
              <span className="w-6">{c.emoji}</span>
              <span className="flex-1">{c.label}</span>
              <span className="font-mono font-medium">{fmtJpy(c.total)}</span>
              <span className="text-muted text-[11px] w-20 text-right">
                {fmtBrl(c.total * rate)}
              </span>
            </div>
          ))}
        </div>
      )}

      {expenses.length === 0 && !formOpen && (
        <p className="text-center text-muted text-[13px] pt-8">
          Nenhum gasto ainda. Toque em + para registrar o primeiro.
        </p>
      )}

      {byDate.map(([date, list]) => (
        <section key={date} className="space-y-1.5">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-muted">
            {new Intl.DateTimeFormat('pt-BR', {
              timeZone: 'Asia/Tokyo',
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            }).format(new Date(`${date}T12:00:00+09:00`))}
            {' · '}
            {fmtJpy(list.reduce((a, e) => a + e.amountJpy, 0))}
          </h2>
          {list.map((e) => (
            <div
              key={e.id}
              className="rounded-2xl border border-hairline bg-surface px-3.5 py-2.5 flex items-center gap-3"
            >
              <span className="text-lg">{catLabel(e.category).emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium leading-snug">
                  {e.note || catLabel(e.category).label}
                </p>
                <p className="text-[11px] text-muted">
                  {e.who ? `${e.who} · ` : ''}
                  {fmtBrl(e.amountJpy * rate)}
                </p>
              </div>
              <span className="font-mono text-[14px] font-semibold">
                {fmtJpy(e.amountJpy)}
              </span>
              {confirmDelete === e.id ? (
                <button
                  onClick={() => {
                    remove(e.id);
                    setConfirmDelete(null);
                  }}
                  className="text-[11px] font-semibold text-white bg-accent rounded-full px-2.5 py-1.5"
                >
                  Apagar?
                </button>
              ) : (
                <button
                  onClick={() => setConfirmDelete(e.id)}
                  onBlur={() => setConfirmDelete(null)}
                  className="text-muted"
                  aria-label="Apagar gasto"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

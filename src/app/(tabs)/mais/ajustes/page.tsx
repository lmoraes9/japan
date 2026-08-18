'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { SyncBadge } from '@/components/SyncBadge';
import { useSettings, effectiveRate, fmtBrl } from '@/lib/settings';
import { useSyncStore } from '@/lib/store';
import { flush } from '@/lib/sync';
import { refreshRate } from '@/lib/rate';
import type { Theme } from '@/lib/settings';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
        {label}
      </p>
      {children}
    </div>
  );
}

export default function AjustesPage() {
  const settings = useSettings();
  const lastSyncAt = useSyncStore((s) => s.lastSyncAt);
  const [code, setCode] = useState(settings.tripCode);
  const { rate, source } = effectiveRate(settings);

  return (
    <div className="space-y-3.5">
      <SubpageHeader title="Ajustes" />

      <Field label="Código da viagem (igual nos dois celulares)">
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 rounded-xl border border-hairline bg-surface-2 p-2.5 text-[14px] font-mono outline-none focus:border-accent"
          />
          <button
            onClick={() => {
              settings.setTripCode(code);
              void flush();
            }}
            className="rounded-xl bg-accent text-white px-4 text-[13px] font-semibold"
          >
            Salvar
          </button>
        </div>
        <p className="text-[11px] text-muted mt-2">
          Checklists, favoritos, notas e gastos são compartilhados entre quem
          usa o mesmo código.
        </p>
      </Field>

      <Field label="Quem está usando este celular">
        <div className="flex gap-2">
          {(['L', 'P'] as const).map((w) => (
            <button
              key={w}
              onClick={() => settings.setWho(w)}
              className={`flex-1 rounded-xl border py-2.5 text-[14px] font-semibold ${
                settings.who === w
                  ? 'border-accent bg-accent text-white'
                  : 'border-hairline bg-surface-2'
              }`}
            >
              {w === 'L' ? 'Leonardo' : 'Priscila'}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Orçamento de compras (¥)">
        <input
          inputMode="numeric"
          placeholder="ex.: 400000"
          defaultValue={settings.budgetJpy ?? ''}
          onBlur={(e) => {
            const v = parseInt(e.target.value.replace(/\D/g, ''), 10);
            settings.setBudgetJpy(Number.isFinite(v) && v > 0 ? v : null);
          }}
          className="w-full rounded-xl border border-hairline bg-surface-2 p-2.5 text-[14px] font-mono outline-none focus:border-accent"
        />
        <p className="text-[11px] text-muted mt-2">
          Aparece como barra de progresso na aba Gastos (categoria compras).
        </p>
      </Field>

      <Field label="Cotação ¥ → R$">
        <p className="text-[13px] mb-2">
          Atual: <strong>¥1.000 = {fmtBrl(rate * 1000)}</strong>{' '}
          <span className="text-muted">
            ({source === 'manual' ? 'manual' : source === 'api' ? `automática, ${settings.cachedRate?.date}` : 'aproximada'})
          </span>
        </p>
        <div className="flex gap-2 items-center">
          <input
            inputMode="decimal"
            placeholder="R$ por ¥1 — ex.: 0.036"
            defaultValue={settings.rateOverride ?? ''}
            onBlur={(e) => {
              const v = parseFloat(e.target.value.replace(',', '.'));
              settings.setRateOverride(Number.isFinite(v) && v > 0 ? v : null);
            }}
            className="flex-1 rounded-xl border border-hairline bg-surface-2 p-2.5 text-[14px] font-mono outline-none focus:border-accent"
          />
          <button
            onClick={() => void refreshRate()}
            className="rounded-xl border border-hairline p-2.5 text-muted"
            aria-label="Atualizar cotação"
          >
            <RefreshCw size={17} />
          </button>
        </div>
        <p className="text-[11px] text-muted mt-2">
          Deixe vazio para usar a cotação automática (atualiza quando online).
        </p>
      </Field>

      <Field label="Tema">
        <div className="flex gap-2">
          {(
            [
              ['auto', 'Automático'],
              ['light', 'Claro'],
              ['dark', 'Escuro'],
            ] as [Theme, string][]
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => settings.setTheme(t)}
              className={`flex-1 rounded-xl border py-2.5 text-[13px] font-semibold ${
                settings.theme === t
                  ? 'border-accent bg-accent text-white'
                  : 'border-hairline bg-surface-2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Sincronização">
        <div className="flex items-center justify-between">
          <SyncBadge />
          <button
            onClick={() => void flush()}
            className="rounded-xl border border-hairline px-3.5 py-2 text-[13px] font-medium"
          >
            Forçar sincronização
          </button>
        </div>
        {lastSyncAt && (
          <p className="text-[11px] text-muted mt-2">
            Última sincronização:{' '}
            {new Date(lastSyncAt).toLocaleTimeString('pt-BR')}
          </p>
        )}
      </Field>

      <Field label="Instalar no iPhone">
        <p className="text-[13px] leading-relaxed">
          No Safari: <strong>Compartilhar → Adicionar à Tela de Início</strong>.
          O app abre em tela cheia e o roteiro inteiro funciona offline (mapa
          precisa de internet).
        </p>
      </Field>
    </div>
  );
}

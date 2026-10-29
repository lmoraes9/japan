'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Pencil, Check, X, Plus, Trash2, Car, Copy, Navigation, ExternalLink, ChevronDown, Phone, Circle, CheckCircle2, Clock,
} from 'lucide-react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { Rich } from '@/components/Rich';
import { AnexosReserva } from '@/components/AnexosReserva';
import { GUIAS, PRIORIDADE, type GuiaReserva, type Prioridade } from '@/data/comoReservar';
import { RESERVA_SEEDS, RESERVA_KIND_LABEL, RESERVA_KINDS } from '@/data/reservas';
import type { Reserva, ReservaKind } from '@/data/types';
import { useSyncStore } from '@/lib/store';
import { useReservas, useMarcarFeita } from '@/lib/reservas';
import { faltam } from '@/lib/janelas';
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

const dataBr = (iso: string) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date(iso));

type Urgencia = { texto: string; tom: 'agora' | 'perto' | 'calmo' | 'atrasado' };

/** o que diz o selo de prazo de uma reserva ainda pendente */
function urgenciaDe(g: GuiaReserva | undefined): Urgencia | null {
  if (!g || g.prioridade === 'na-hora') return null;
  const agora = Date.now();
  const min = (iso: string) => Math.round((new Date(iso).getTime() - agora) / 60000);
  if (g.abreEm && min(g.abreEm) > 0) {
    const m = min(g.abreEm);
    return { texto: `venda abre ${dataBr(g.abreEm)} · ${faltam(m)}`, tom: m < 2 * 1440 ? 'agora' : 'calmo' };
  }
  if (g.ate) {
    const m = min(g.ate);
    if (m <= 0) return { texto: `prazo era ${dataBr(g.ate)}`, tom: 'atrasado' };
    return { texto: `reservar até ${dataBr(g.ate)} · ${faltam(m)}`, tom: m < 7 * 1440 ? 'perto' : 'calmo' };
  }
  if (g.abreEm) return { texto: `venda aberta desde ${dataBr(g.abreEm)}`, tom: 'perto' };
  return null;
}

const TOM: Record<Urgencia['tom'], string> = {
  agora: 'bg-accent text-white',
  atrasado: 'bg-accent text-white',
  perto: 'bg-accent-soft text-accent',
  calmo: 'bg-surface-2 text-muted',
};

const ORDEM: Record<Prioridade, number> = { antes: 0, vale: 1, 'na-hora': 2 };
/** o que não tem guia (hotel, táxi, reserva sua) entra junto do "vale reservar" */
const prioridadeDe = (r: Reserva): Prioridade => GUIAS[r.id]?.prioridade ?? 'vale';

/** a chave de ordenação das pendentes: o que vence ou abre primeiro vem primeiro */
function chaveUrgencia(r: Reserva): number {
  const g = GUIAS[r.id];
  const iso = g?.ate ?? g?.abreEm;
  return iso ? new Date(iso).getTime() : new Date(`${r.date}T12:00:00-03:00`).getTime() + 1e12;
}

const porUrgencia = (a: Reserva, b: Reserva) => chaveUrgencia(a) - chaveUrgencia(b);

function Guia({ g }: { g: GuiaReserva }) {
  return (
    <div className="mt-3 space-y-3 rounded-xl border border-hairline bg-surface-2/60 p-3.5 text-[12.5px] leading-relaxed">
      <p className="font-medium text-foreground"><Rich text={g.oQue} /></p>
      <p className="text-foreground/85">
        <Rich text={g.quando} />
        {g.custo && <> · <span className="font-mono text-[12px]">{g.custo}</span></>}
      </p>

      <ol className="space-y-2">
        {g.passos.map((p, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white">
              {i + 1}
            </span>
            <span className="min-w-0 text-foreground/90"><Rich text={p} /></span>
          </li>
        ))}
      </ol>

      {g.telefone && (
        <div className="space-y-2 rounded-xl bg-surface p-3">
          <a href={`tel:${g.telefone.numero.replace(/[^+\d]/g, '')}`} className="tappable inline-flex items-center gap-1.5 font-mono text-[13px] font-semibold text-accent">
            <Phone size={13} /> {g.telefone.numero}
          </a>
          {g.telefone.contato && <p className="text-muted"><Rich text={g.telefone.contato} /></p>}
          <ul className="space-y-1.5">
            {g.telefone.frases.map((f, i) => (
              <li key={i}>
                <span className="block font-jp text-[14px] leading-snug">{f.jp}</span>
                <span className="block text-[11.5px] italic text-muted">{f.leitura}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(g.telefone ? g.links.length > 0 : g.links.length > 1) && (
        <div className="flex flex-wrap gap-1.5">
          {(g.telefone ? g.links : g.links.slice(1)).map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="tappable inline-flex items-center gap-1 rounded-full border border-hairline px-2.5 py-1 text-[12px] font-medium">
              <ExternalLink size={11} /> {l.label}{l.nota ? ` · ${l.nota}` : ''}
            </a>
          ))}
        </div>
      )}

      {g.planoB && (
        <p className="rounded-xl border border-dashed border-hairline p-2.5 text-foreground/85">
          <span className="font-semibold">Plano B · </span><Rich text={g.planoB} />
        </p>
      )}
      {g.cuidado && (
        <p className="rounded-xl bg-accent-soft p-2.5 text-accent">
          <span className="font-semibold">Atenção · </span><Rich text={g.cuidado} />
        </p>
      )}
      <p className="text-muted"><span className="font-semibold">Depois de reservar · </span><Rich text={g.depois} /></p>
    </div>
  );
}

function ReservaCard({ r, marcar, aberta }: { r: Reserva; marcar: (r: Reserva, done: boolean) => void; aberta?: boolean }) {
  const upsert = useSyncStore((s) => s.upsertReserva);
  const remove = useSyncStore((s) => s.removeReserva);
  const [editing, setEditing] = useState(false);
  const [taxi, setTaxi] = useState(false);
  const [draft, setDraft] = useState<Reserva>(r);
  const [copied, setCopied] = useState(false);
  const guia = GUIAS[r.id];
  const [guiaAberto, setGuiaAberto] = useState(!!aberta);
  useEffect(() => { if (aberta) setGuiaAberto(true); }, [aberta]);
  const urg = !r.done ? urgenciaDe(guia) : null;
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
    <div id={r.id} className={`scroll-mt-4 rounded-2xl border bg-surface p-4 ${r.done ? 'border-matcha/50' : 'border-hairline'}`}>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => marcar(r, !r.done)}
          aria-pressed={!!r.done}
          aria-label={r.done ? 'Desmarcar como feita' : 'Marcar como feita'}
          className="tappable -m-1 mt-0 shrink-0 rounded-full p-1"
        >
          {r.done ? <CheckCircle2 size={26} className="text-matcha" /> : <Circle size={26} className="text-muted/60" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-mono uppercase tracking-wider text-muted">
            {formatDayLabel(r.date)}
            {r.dateEnd ? ` → ${formatDayLabel(r.dateEnd)}` : ''}
            {r.done && <span className="ml-2 text-matcha">✓ feita</span>}
          </p>
          <h2 className="text-[15px] font-semibold leading-snug"><span className="mr-1">{meta.emoji}</span>{r.title}</h2>
          {guia && (
            <span className={`mt-1 mr-1.5 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${PRIORIDADE[guia.prioridade].pill}`}>
              {r.done ? PRIORIDADE[guia.prioridade].curto : PRIORIDADE[guia.prioridade].titulo}
            </span>
          )}
          {urg && (
            <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10.5px] font-semibold ${TOM[urg.tom]}`}>
              <Clock size={10} /> {urg.texto}
            </span>
          )}
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
          {guia && !r.done && (
            <div className="mt-2 space-y-1 rounded-xl bg-surface-2 p-2.5 text-[12.5px] leading-snug">
              <p className="text-foreground/90">{guia.porque}</p>
              {guia.flex && <p className="text-muted"><span className="font-semibold">Flexibilidade · </span>{guia.flex}</p>}
            </div>
          )}
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
      {guia && (
        <div className="mt-3 flex flex-wrap gap-2">
          {!r.done && guia.prioridade !== 'na-hora' && guia.telefone && (
            <a href={`tel:${guia.telefone.numero.replace(/[^+\d]/g, '')}`} className="tappable inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[12.5px] font-semibold text-white">
              <Phone size={13} /> Ligar para reservar
            </a>
          )}
          {!r.done && guia.prioridade !== 'na-hora' && !guia.telefone && guia.links[0] && (
            <a href={guia.links[0].url} target="_blank" rel="noopener noreferrer" className="tappable inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[12.5px] font-semibold text-white">
              <ExternalLink size={13} /> Reservar agora
            </a>
          )}
          <button
            type="button"
            onClick={() => setGuiaAberto((v) => !v)}
            aria-expanded={guiaAberto}
            className="tappable inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[12.5px] font-medium"
          >
            {guia.prioridade === 'na-hora' ? 'Como comprar na hora' : 'Passo a passo'} <ChevronDown size={13} className={guiaAberto ? 'rotate-180' : ''} />
          </button>
        </div>
      )}
      {guia && guiaAberto && <Guia g={guia} />}

      <AnexosReserva reservaId={r.id} />
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

type Filtro = 'faltam' | 'feitas' | 'todas';

export default function ReservasPage() {
  const reservas = useReservas();
  const marcar = useMarcarFeita(reservas);
  const [adding, setAdding] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>('faltam');
  const [alvo, setAlvo] = useState<string | null>(null);

  const feitas = reservas.filter((r) => r.done).length;
  const pendentes = reservas.length - feitas;
  // o que se compra na hora não conta como "falta": antecipar não é o objetivo
  const naHoraPendentes = reservas.filter((r) => !r.done && prioridadeDe(r) === 'na-hora').length;
  const contam = reservas.length - naHoraPendentes;

  const lista = useMemo(() => {
    const base = filtro === 'faltam' ? reservas.filter((r) => !r.done) : filtro === 'feitas' ? reservas.filter((r) => r.done) : reservas;
    if (filtro !== 'faltam') return base;
    return [...base].sort((a, b) => ORDEM[prioridadeDe(a)] - ORDEM[prioridadeDe(b)] || porUrgencia(a, b));
  }, [reservas, filtro]);

  const porTier = (t: Prioridade) => reservas.filter((r) => !r.done && prioridadeDe(r) === t).length;

  // link de fora ("Como reservar →" na checklist) cai direto no cartão, com o guia aberto
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    setFiltro('todas');
    setAlvo(id);
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 120);
    return () => clearTimeout(t);
  }, []);

  const chips: { k: Filtro; label: string; n: number }[] = [
    { k: 'faltam', label: 'Falta fazer', n: pendentes },
    { k: 'feitas', label: 'Feitas', n: feitas },
    { k: 'todas', label: 'Todas', n: reservas.length },
  ];

  return (
    <div className="space-y-3.5">
      <SubpageHeader
        title="Reservas"
        subtitle={`${feitas} de ${contam} feitas · ${naHoraPendentes} ficam para comprar na hora · o status sincroniza entre os celulares, os anexos ficam em cada um`}
      />

      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={feitas} aria-valuemax={contam}>
        <div className="h-full rounded-full bg-matcha transition-all" style={{ width: `${contam ? Math.min(100, (feitas / contam) * 100) : 0}%` }} />
      </div>

      <div className="space-y-2 rounded-2xl border border-hairline bg-surface p-3.5">
        <p className="text-[13px] font-semibold">Quanto antes comprar? Cada cartão diz qual é o caso.</p>
        {(['antes', 'vale', 'na-hora'] as Prioridade[]).map((t) => (
          <div key={t} className="flex items-start gap-2.5">
            <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${PRIORIDADE[t].pill}`}>
              {PRIORIDADE[t].titulo} · {porTier(t)}
            </span>
            <span className="text-[12.5px] leading-snug text-muted">{PRIORIDADE[t].explica}</span>
          </div>
        ))}
      </div>

      <p className="rounded-2xl bg-surface-2 p-3.5 text-[12.5px] leading-relaxed text-muted">
        Toque no <strong>círculo</strong> para marcar como feita, em <strong>Passo a passo</strong> para ver como reservar, e em <strong>Anexar</strong> para guardar o print do QR ou o PDF da confirmação, que depois abrem sem internet. O lápis edita nome, código e <strong>endereço em japonês</strong> para o taxista.
      </p>

      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1">
        {chips.map((c) => (
          <button
            key={c.k}
            type="button"
            onClick={() => setFiltro(c.k)}
            aria-pressed={filtro === c.k}
            className={`tappable shrink-0 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium ${filtro === c.k ? 'border-accent bg-accent text-white' : 'border-hairline bg-surface'}`}
          >
            {c.label} <span className="font-mono opacity-80">{c.n}</span>
          </button>
        ))}
      </div>

      {adding ? (
        <NewReserva onDone={() => setAdding(false)} />
      ) : (
        <button onClick={() => setAdding(true)} className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-hairline py-2.5 text-[13px] font-medium text-muted">
          <Plus size={15} /> Adicionar reserva
        </button>
      )}

      {lista.length === 0 && (
        <p className="rounded-2xl border border-hairline bg-surface p-5 text-center text-[13px] text-muted">
          {filtro === 'faltam' ? 'Tudo feito. Boa viagem!' : 'Nada marcado como feito ainda.'}
        </p>
      )}

      {lista.map((r, i) => {
        // no "Falta fazer" os cartões vêm em três blocos, cada um com o seu cabeçalho
        const tier = prioridadeDe(r);
        const abreBloco = filtro === 'faltam' && (i === 0 || prioridadeDe(lista[i - 1]) !== tier);
        return (
          <div key={r.id} className="space-y-3.5">
            {abreBloco && (
              <div className="pt-1.5">
                <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted">
                  <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${PRIORIDADE[tier].pill}`}>{PRIORIDADE[tier].titulo}</span>
                  {porTier(tier)} {porTier(tier) === 1 ? 'item' : 'itens'}
                </p>
                <p className="mt-1 text-[12.5px] leading-snug text-muted">{PRIORIDADE[tier].explica}</p>
              </div>
            )}
            <ReservaCard r={r} marcar={marcar} aberta={alvo === r.id} />
          </div>
        );
      })}
    </div>
  );
}

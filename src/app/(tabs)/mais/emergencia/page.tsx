'use client';

import { Phone, Navigation, ExternalLink, Camera, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SubpageHeader } from '@/components/SubpageHeader';
import { Rich } from '@/components/Rich';
import { NUMEROS_JAPAO, CONSULADO, HOSPITAIS, CARTOES, COMO_AGIR, DOC_FIELDS } from '@/data/emergencia';
import { useSyncStore } from '@/lib/store';
import { searchUrl } from '@/lib/mapsLinks';

const tel = (p: string) => `tel:${p.replace(/[^\d+]/g, '')}`;

function PhoneRow({ label, phone, note, jp }: { label: string; phone: string; note?: string; jp?: string }) {
  return (
    <a href={tel(phone)} className="flex items-center gap-3 border-b border-hairline px-4 py-3 last:border-b-0 active:bg-surface-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Phone size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold leading-snug">
          {label}
          {jp && <span className="ml-1.5 font-jp text-[11px] font-normal text-muted">{jp}</span>}
        </span>
        {note && <span className="block text-[11.5px] leading-snug text-muted">{note}</span>}
      </span>
      <span className="shrink-0 font-mono text-[15px] font-bold tabular-nums">{phone}</span>
    </a>
  );
}

/**
 * Fotos de documento ficam só neste celular (IndexedDB não; localStorage em
 * base64 comprimido pelo canvas). Não vão para o servidor de sincronização.
 */
const DOC_PHOTO_KEY = 'japao2026:docfotos';
type DocPhotos = Record<string, string>;

function useDocPhotos() {
  const [photos, setPhotos] = useState<DocPhotos>({});
  useEffect(() => {
    try {
      setPhotos(JSON.parse(localStorage.getItem(DOC_PHOTO_KEY) ?? '{}'));
    } catch {}
  }, []);
  const save = (next: DocPhotos) => {
    setPhotos(next);
    try {
      localStorage.setItem(DOC_PHOTO_KEY, JSON.stringify(next));
    } catch {
      alert('Sem espaço para guardar a foto neste celular.');
    }
  };
  const add = (key: string, file: File) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 1400;
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
      save({ ...photos, [key]: c.toDataURL('image/jpeg', 0.8) });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };
  const remove = (key: string) => {
    const next = { ...photos };
    delete next[key];
    save(next);
  };
  return { photos, add, remove };
}

const DOC_PHOTO_SLOTS = [
  { key: 'passaporte-l', label: 'Passaporte Leonardo' },
  { key: 'passaporte-p', label: 'Passaporte Priscila' },
  { key: 'seguro', label: 'Cartão do seguro' },
  { key: 'visto', label: 'Visto / ESTA' },
];

export default function EmergenciaPage() {
  const docs = useSyncStore((s) => s.state.docs);
  const setDoc = useSyncStore((s) => s.setDoc);
  const { photos, add, remove } = useDocPhotos();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <SubpageHeader title="Emergência" subtitle="Tudo aqui funciona offline. Toque num número para ligar." />

      <section className="overflow-hidden rounded-2xl border border-accent/40 bg-surface">
        {NUMEROS_JAPAO.map((c) => (
          <PhoneRow key={c.phone} {...c} />
        ))}
      </section>

      <section className="rounded-2xl border border-hairline bg-surface p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Consulado</p>
        <h2 className="mt-1 text-[15px] font-semibold">{CONSULADO.title}</h2>
        <p className="mt-1 text-[12.5px] leading-snug">{CONSULADO.address}</p>
        <p className="font-jp text-[12px] text-muted">{CONSULADO.addressJp}</p>
        <p className="mt-2 text-[12px] leading-relaxed text-muted">{CONSULADO.note}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={tel(CONSULADO.phone)} className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12px] font-medium text-white">
            <Phone size={13} /> {CONSULADO.phone}
          </a>
          <a href={searchUrl(CONSULADO.maps)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium">
            <Navigation size={13} /> Maps
          </a>
          <a href={CONSULADO.site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[12px] font-medium">
            <ExternalLink size={13} /> Site
          </a>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wider text-accent">Hospitais com inglês</h2>
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
          {HOSPITAIS.map((h) => (
            <div key={h.name} className="border-b border-hairline px-4 py-3 last:border-b-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{h.city}</p>
              <p className="text-[13.5px] font-semibold leading-snug">
                {h.name} <span className="ml-1 font-jp text-[11px] font-normal text-muted">{h.jp}</span>
              </p>
              <p className="mt-0.5 text-[12px] leading-snug text-muted">{h.note}</p>
              <div className="mt-2 flex gap-2">
                {h.phone && (
                  <a href={tel(h.phone)} className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-2.5 py-1 font-mono text-[12px]">
                    <Phone size={12} /> {h.phone}
                  </a>
                )}
                <a href={searchUrl(h.maps)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-2.5 py-1 text-[12px]">
                  <Navigation size={12} /> Maps
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wider text-accent">Cartões</h2>
        <div className="overflow-hidden rounded-2xl border border-hairline bg-surface">
          {CARTOES.map((c) => (
            <PhoneRow key={c.phone} {...c} />
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wider text-accent">Se acontecer</h2>
        {COMO_AGIR.map((c) => (
          <details key={c.label} className="rounded-2xl border border-hairline bg-surface p-4" open={open === c.label} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open ? c.label : null)}>
            <summary className="cursor-pointer text-[14px] font-semibold">{c.label}</summary>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-[13px] leading-relaxed">
              {c.steps.map((s, i) => (
                <li key={i}>
                  <Rich text={s} />
                </li>
              ))}
            </ol>
          </details>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="px-1 text-[13px] font-semibold uppercase tracking-wider text-accent">Seus dados</h2>
        <p className="px-1 text-[12px] text-muted">Texto sincroniza entre os dois celulares. As fotos ficam só neste aparelho.</p>
        <div className="space-y-2.5 rounded-2xl border border-hairline bg-surface p-4">
          {DOC_FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="text-[11px] font-medium text-muted">{f.label}</span>
              {f.multiline ? (
                <textarea
                  defaultValue={docs[f.key]?.text ?? ''}
                  onBlur={(e) => { if (e.target.value !== (docs[f.key]?.text ?? '')) setDoc(f.key, e.target.value); }}
                  placeholder={f.placeholder}
                  rows={2}
                  className="mt-0.5 w-full rounded-xl border border-hairline bg-surface-2 p-2.5 text-[13px] outline-none focus:border-accent"
                />
              ) : (
                <input
                  defaultValue={docs[f.key]?.text ?? ''}
                  onBlur={(e) => { if (e.target.value !== (docs[f.key]?.text ?? '')) setDoc(f.key, e.target.value); }}
                  placeholder={f.placeholder}
                  className="mt-0.5 w-full rounded-xl border border-hairline bg-surface-2 p-2.5 text-[13px] outline-none focus:border-accent"
                />
              )}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {DOC_PHOTO_SLOTS.map((slot) => {
            const src = photos[slot.key];
            return (
              <div key={slot.key} className="overflow-hidden rounded-2xl border border-hairline bg-surface">
                {src ? (
                  <a href={src} target="_blank" rel="noopener noreferrer" className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={slot.label} className="aspect-[4/3] w-full object-cover" />
                  </a>
                ) : (
                  <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 text-muted">
                    <Camera size={22} />
                    <span className="text-[11px]">Fotografar</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) add(slot.key, f); }} />
                  </label>
                )}
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-[12px] font-medium">{slot.label}</span>
                  {src && (
                    <button onClick={() => remove(slot.key)} className="text-muted" aria-label="Apagar foto">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

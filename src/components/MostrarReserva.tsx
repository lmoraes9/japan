'use client';

import { useEffect, useState } from 'react';
import { X, Copy, ExternalLink, FileText } from 'lucide-react';
import type { Reserva } from '@/data/types';
import { RESERVA_KIND_LABEL } from '@/data/reservas';
import { useAnexos, type Anexo } from '@/lib/anexos';
import { formatDayLabel } from '@/lib/now';

/** o anexo em tamanho de leitura: imagem inteira, PDF como botão */
function AnexoGrande({ a }: { a: Anexo }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const u = URL.createObjectURL(a.blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [a.blob]);
  if (!url) return null;
  if (a.tipo.startsWith('image/')) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt={a.nome} className="w-full rounded-xl border border-black/10" />;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" download={a.nome} className="flex items-center gap-2 rounded-xl border border-black/15 p-3 text-[14px] font-medium">
      <FileText size={18} /> {a.nome}
    </a>
  );
}

/**
 * A reserva em tela cheia, fundo branco, para virar o celular para o
 * funcionário: nome, data, o código grande e o QR anexado, sem precisar
 * procurar nada no balcão.
 */
export function MostrarReserva({ r, onClose }: { r: Reserva; onClose: () => void }) {
  const { anexos } = useAnexos(r.id);
  const [copiado, setCopiado] = useState(false);
  const meta = RESERVA_KIND_LABEL[r.kind];

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const copiar = async () => {
    if (!r.code) return;
    try {
      await navigator.clipboard.writeText(r.code);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1200);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-white text-black" role="dialog" aria-modal="true" aria-label={r.title}>
      <div className="mx-auto max-w-lg space-y-5 px-5 pb-12 pt-5">
        <div className="flex items-start justify-between gap-3">
          <p className="pt-1.5 font-mono text-[12px] uppercase tracking-widest text-black/45">
            {meta.emoji} {meta.label} · {formatDayLabel(r.date)}
            {r.dateEnd ? ` → ${formatDayLabel(r.dateEnd)}` : ''}
          </p>
          <button type="button" onClick={onClose} className="-mr-2 rounded-full p-2 text-black/50" aria-label="Fechar">
            <X size={28} />
          </button>
        </div>

        <div>
          <h2 className="text-[24px] font-bold leading-tight">{r.title}</h2>
          {r.time && <p className="mt-1 font-mono text-[14px] text-black/60">{r.time}</p>}
          {r.addressJp && <p className="mt-2 font-jp text-[17px] leading-snug">{r.addressJp}</p>}
        </div>

        {r.code ? (
          <button type="button" onClick={copiar} className="block w-full rounded-2xl border-2 border-black/80 px-4 py-4 text-left">
            <span className="block text-[11px] font-semibold uppercase tracking-widest text-black/45">
              Número da reserva · 予約番号 {copiado ? '· copiado' : ''}
            </span>
            <span className="mt-1 flex items-center gap-2 break-words font-mono text-[clamp(22px,7vw,34px)] font-bold leading-tight">
              {r.code} <Copy size={18} className="shrink-0 text-black/35" />
            </span>
          </button>
        ) : (
          <p className="rounded-2xl border border-dashed border-black/25 p-4 text-[14px] text-black/55">
            Sem número de reserva cadastrado. Toquem no lápis do cartão para preencher.
          </p>
        )}

        {r.comoMostrar && (
          <div className="rounded-2xl bg-black/[0.05] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-black/45">Como apresentar</p>
            <p className="mt-1 text-[15px] leading-relaxed">{r.comoMostrar}</p>
          </div>
        )}

        {r.link && (
          <a href={r.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-black py-3.5 text-[15px] font-semibold text-white">
            <ExternalLink size={16} /> Abrir o ingresso / a reserva
          </a>
        )}

        {anexos.length > 0 && (
          <div className="space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-black/45">QR e comprovantes ({anexos.length})</p>
            {anexos.map((a) => <AnexoGrande key={a.id} a={a} />)}
          </div>
        )}

        {r.notes && <p className="text-[13px] leading-relaxed text-black/60">{r.notes}</p>}
        {r.phone && (
          <a href={`tel:${r.phone.replace(/[^+\d]/g, '')}`} className="block font-mono text-[14px] text-black/60 underline">
            {r.phone}
          </a>
        )}
      </div>
    </div>
  );
}

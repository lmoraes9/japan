'use client';

import { useEffect, useRef, useState } from 'react';
import { Paperclip, FileText, Trash2, X, Plus } from 'lucide-react';
import { useAnexos, type Anexo } from '@/lib/anexos';

const kb = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/** Um anexo: miniatura se é imagem, cartão de arquivo se é PDF. Toque abre. */
function Item({ a, onAbrir, onApagar }: { a: Anexo; onAbrir: (url: string, a: Anexo) => void; onApagar: () => void }) {
  const [url, setUrl] = useState<string | null>(null);
  const imagem = a.tipo.startsWith('image/');

  useEffect(() => {
    const u = URL.createObjectURL(a.blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [a.blob]);

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-hairline bg-surface-2 p-2">
      {imagem && url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
          <FileText size={20} />
        </span>
      )}
      {url && imagem ? (
        <button type="button" onClick={() => onAbrir(url, a)} className="min-w-0 flex-1 text-left">
          <span className="block truncate text-[12.5px] font-medium">{a.nome}</span>
          <span className="block font-mono text-[10.5px] text-muted">{kb(a.tamanho)} · toque para abrir</span>
        </button>
      ) : (
        <a href={url ?? undefined} target="_blank" rel="noopener noreferrer" download={a.nome} className="min-w-0 flex-1">
          <span className="block truncate text-[12.5px] font-medium">{a.nome}</span>
          <span className="block font-mono text-[10.5px] text-muted">{kb(a.tamanho)} · toque para abrir</span>
        </a>
      )}
      <button type="button" onClick={onApagar} aria-label={`Apagar ${a.nome}`} className="shrink-0 rounded-full p-2 text-muted active:bg-surface">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

/**
 * Os anexos de uma reserva. A frase de rodapé não é enfeite: ela avisa que
 * os arquivos ficam neste aparelho, que é a coisa que o usuário não adivinha.
 */
export function AnexosReserva({ reservaId }: { reservaId: string }) {
  const { anexos, adicionar, remover, erro, indisponivel } = useAnexos(reservaId);
  const entrada = useRef<HTMLInputElement>(null);
  const [visto, setVisto] = useState<{ url: string; nome: string } | null>(null);

  if (indisponivel) {
    return (
      <p className="mt-3 rounded-xl border border-dashed border-hairline p-3 text-[12px] leading-snug text-muted">
        Este navegador não deixa guardar arquivos (aba privada?). Abram o app normalmente para anexar.
      </p>
    );
  }

  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
          <Paperclip size={12} /> Anexos {anexos.length > 0 && <span className="font-mono">({anexos.length})</span>}
        </p>
        <button
          type="button"
          onClick={() => entrada.current?.click()}
          className="tappable inline-flex items-center gap-1 rounded-full border border-hairline px-2.5 py-1 text-[12px] font-medium"
        >
          <Plus size={13} /> Anexar
        </button>
        <input
          ref={entrada}
          type="file"
          accept="image/*,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => {
            // a FileList é viva: zerar o input a esvazia, então copia antes
            const escolhidos = Array.from(e.target.files ?? []);
            e.target.value = '';
            if (escolhidos.length) void adicionar(escolhidos);
          }}
        />
      </div>

      {anexos.length === 0 ? (
        <p className="text-[12px] leading-snug text-muted">
          Print do QR, PDF da confirmação, foto do voucher. Tudo que for preciso mostrar no balcão fica aqui, sem internet.
        </p>
      ) : (
        <div className="space-y-1.5">
          {anexos.map((a) => (
            <Item
              key={a.id}
              a={a}
              onAbrir={(url, an) => setVisto({ url, nome: an.nome })}
              onApagar={() => {
                if (window.confirm(`Apagar "${a.nome}" deste aparelho?`)) void remover(a.id);
              }}
            />
          ))}
        </div>
      )}
      {erro && <p className="mt-1.5 text-[12px] text-accent">{erro}</p>}
      <p className="mt-1.5 text-[10.5px] leading-snug text-muted">Ficam só neste aparelho. A Priscila anexa no dela.</p>

      {visto && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/90" onClick={() => setVisto(null)}>
          <div className="flex items-center justify-between p-4 text-white">
            <span className="min-w-0 truncate text-[13px]">{visto.nome}</span>
            <button type="button" aria-label="Fechar" className="p-1">
              <X size={24} />
            </button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={visto.url} alt={visto.nome} className="min-h-0 flex-1 object-contain p-2" />
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { CloudDownload, Check, CircleAlert } from 'lucide-react';
import { todasAsRotas } from '@/lib/rotas';

type Estado = 'parado' | 'baixando' | 'pronto' | 'erro';

/**
 * Baixa todas as páginas do app para o cache do service worker. As fotos já
 * entram no cache na instalação; as páginas não entravam, e sem isso um dia
 * do roteiro que vocês não tivessem aberto não abria sem internet.
 */
export function BaixarOffline() {
  const [estado, setEstado] = useState<Estado>('parado');
  const [feitas, setFeitas] = useState(0);
  const [erro, setErro] = useState('');
  const rotas = todasAsRotas();

  async function baixar() {
    setEstado('baixando');
    setFeitas(0);
    setErro('');
    let ok = 0;
    try {
      // de 4 em 4 para não estourar a rede do hotel
      for (let i = 0; i < rotas.length; i += 4) {
        const lote = rotas.slice(i, i + 4);
        await Promise.all(
          lote.map(async (r) => {
            try {
              await fetch(r, { credentials: 'same-origin' });
              ok += 1;
            } catch {
              /* uma rota que falha não derruba o resto */
            }
          }),
        );
        setFeitas(Math.min(i + lote.length, rotas.length));
      }
      if (ok === 0) throw new Error('nenhuma página baixou');
      setEstado('pronto');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'falhou');
      setEstado('erro');
    }
  }

  const pct = Math.round((feitas / rotas.length) * 100);

  return (
    <div className="rounded-2xl border border-hairline bg-surface p-4">
      <div className="flex items-start gap-3">
        <CloudDownload size={20} className="mt-0.5 shrink-0 text-accent" />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold">Deixar o app inteiro no telefone</p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
            As {rotas.length} páginas do app ficam guardadas por 45 dias. As fotos já vêm na
            instalação. Façam isso no Wi-Fi antes de viajar: depois, o roteiro, a história e
            os mapas ilustrados abrem sem internet nenhuma.
          </p>
        </div>
      </div>

      {estado === 'baixando' && (
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 font-mono text-[11px] text-muted">
            {feitas} de {rotas.length} páginas
          </p>
        </div>
      )}

      {estado === 'pronto' && (
        <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-matcha">
          <Check size={15} /> Pronto — {rotas.length} páginas guardadas
        </p>
      )}

      {estado === 'erro' && (
        <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-accent">
          <CircleAlert size={15} /> Não deu ({erro}). Tentem de novo com internet.
        </p>
      )}

      {estado !== 'baixando' && (
        <button
          type="button"
          onClick={baixar}
          className="tappable mt-3 w-full rounded-xl bg-accent px-4 py-2.5 text-[14px] font-semibold text-white"
        >
          {estado === 'pronto' ? 'Baixar de novo' : 'Baixar tudo agora'}
        </button>
      )}
    </div>
  );
}

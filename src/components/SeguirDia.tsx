import { Footprints, MapPinned, Navigation } from 'lucide-react';
import type { Day } from '@/data/types';
import { caminhadas, irAte, paradasDoDia } from '@/lib/seguirDia';

/**
 * O dia inteiro no Google Maps: cada parada com o seu "Ir" (rota saindo de
 * onde vocês estão) e, dentro dela, cada ponto de detalhe — o pinheiro, o
 * portão, a casa de chá — na ordem em que se anda.
 */
export function SeguirDia({ day }: { day: Day }) {
  const paradas = paradasDoDia(day);
  const totalPontos = paradas.reduce((n, p) => n + p.pontos.length, 0);
  if (!paradas.length) return null;
  return (
    <details className="group overflow-hidden rounded-2xl border border-hairline bg-surface">
      <summary className="tappable flex cursor-pointer list-none items-center gap-2.5 px-4 py-3">
        <MapPinned size={18} className="shrink-0 text-accent" />
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold">Seguir o dia no Google Maps</span>
          <span className="block text-[12px] text-muted">
            {paradas.length} paradas{totalPontos ? ` · ${totalPontos} pontos de detalhe` : ''}, na ordem em que se anda
          </span>
        </span>
        <span className="text-[12px] font-medium text-accent group-open:hidden">abrir</span>
        <span className="hidden text-[12px] font-medium text-muted group-open:inline">fechar</span>
      </summary>
      <div className="border-t border-hairline px-4 pb-3 pt-2">
        <p className="mb-2 text-[12px] leading-snug text-muted">
          Toquem em <strong className="text-foreground">Ir</strong>: o Google Maps abre a rota saindo de onde vocês estão. Dentro de cada parada, sigam os pontos de cima para baixo.
        </p>
        <ol className="space-y-3">
          {paradas.map(({ stop, destino, pontos }, i) => {
            const aPe = pontos.length ? caminhadas([destino, ...pontos.map((p) => p.destino)]) : [];
            return (
              <li key={stop.id}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[12px] font-semibold text-white">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[10.5px] uppercase tracking-wider text-muted">{stop.time}{stop.timeLabel ? ` · ${stop.timeLabel}` : ''}</span>
                    <span className="block text-[14px] font-semibold leading-snug">{stop.name}</span>
                  </span>
                  <a
                    href={irAte(destino, 'transit')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tappable inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-[12px] font-semibold text-white"
                  >
                    <Navigation size={12} /> Ir
                  </a>
                </div>
                {pontos.length > 0 && (
                  <div className="ml-[13px] mt-1.5 border-l-2 border-hairline pl-4">
                    <ol className="space-y-1.5">
                      {pontos.map((p, k) => (
                        <li key={k} className="flex items-center gap-2">
                          <span className="w-8 shrink-0 font-mono text-[11px] text-muted">{i + 1}.{k + 1}</span>
                          <span className="min-w-0 flex-1 text-[13px] leading-snug">
                            {p.nome}
                            {p.jp && <span className="ml-1 text-[11.5px] text-muted">{p.jp}</span>}
                            {p.nota && <span className="block text-[11.5px] text-muted">{p.nota}</span>}
                          </span>
                          <a
                            href={irAte(p.destino, 'walking')}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Ir a pé até ${p.nome}`}
                            className="tappable inline-flex shrink-0 items-center gap-1 rounded-full border border-hairline bg-surface-2 px-2.5 py-1 text-[11.5px] font-medium text-accent"
                          >
                            <Footprints size={11} /> Ir
                          </a>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {aPe.map((href, k) => (
                        <a
                          key={k}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tappable inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-[11.5px] font-semibold text-accent"
                        >
                          <Footprints size={11} /> Rota a pé por dentro{aPe.length > 1 ? ` · parte ${k + 1}/${aPe.length}` : ''}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </details>
  );
}

'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export type AlturaFolha = 'meia' | 'cheia';

/**
 * A folha que abre quando se toca num ponto do mapa — no mapa ilustrado e no 3D.
 *
 * Ela nasce alta (metade boa da tela) e sobe até quase o topo quando se arrasta
 * a alça para cima, porque o conteúdo de um ponto é texto de verdade: ler três
 * parágrafos numa janelinha de 38% da tela, rolando uma linha por vez, é o que
 * a versão anterior pedia. Arrastar para baixo desde o topo volta para a meia
 * altura; desde a meia altura, fecha.
 */
export function FolhaPonto({
  indice,
  total,
  passo,
  aoFechar,
  caminhada,
  altura,
  aoMudarAltura,
  flutuante,
  children,
}: {
  indice: number;
  total: number;
  passo: (d: 1 | -1) => void;
  aoFechar: () => void;
  /** '4 min', quando há caminhada desde o ponto anterior */
  caminhada?: string;
  altura: AlturaFolha;
  aoMudarAltura: (a: AlturaFolha) => void;
  /** no mapa 3D a folha flutua sobre a cena; no ilustrado ela fica acima da barra de abas */
  flutuante?: boolean;
  children: ReactNode;
}) {
  const arraste = useRef<{ y0: number; ativo: boolean } | null>(null);
  const [puxando, setPuxando] = useState(0);

  const onDown = useCallback((e: React.PointerEvent) => {
    arraste.current = { y0: e.clientY, ativo: true };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!arraste.current?.ativo) return;
    setPuxando(e.clientY - arraste.current.y0);
  }, []);

  const onUp = useCallback(() => {
    const d = puxando;
    arraste.current = null;
    setPuxando(0);
    if (d < -40) aoMudarAltura('cheia');
    else if (d > 40) {
      if (altura === 'cheia') aoMudarAltura('meia');
      else aoFechar();
    }
  }, [puxando, altura, aoMudarAltura, aoFechar]);

  const maxAltura = altura === 'cheia' ? '88svh' : '56svh';

  return (
    <div
      className={`sheet-in z-40 px-2 ${flutuante ? 'absolute inset-x-0 bottom-0' : 'fixed inset-x-0'}`}
      style={
        flutuante
          ? { paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }
          : { bottom: 'calc(58px + env(safe-area-inset-bottom))' }
      }
    >
      <div
        className="mx-auto flex max-w-xl flex-col overflow-hidden rounded-3xl border border-hairline bg-surface shadow-2xl transition-[max-height] duration-300"
        style={{ maxHeight: maxAltura, transform: puxando > 0 ? `translateY(${Math.min(puxando, 120)}px)` : undefined }}
      >
        {/* a alça: arrasta para subir, arrasta para baixo para voltar ou fechar */}
        <div
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onClick={() => aoMudarAltura(altura === 'cheia' ? 'meia' : 'cheia')}
          role="button"
          tabIndex={0}
          aria-label={altura === 'cheia' ? 'Diminuir o painel' : 'Ampliar o painel'}
          className="flex cursor-grab touch-none justify-center pb-1 pt-2 active:cursor-grabbing"
        >
          <span className="h-1 w-10 rounded-full bg-rail/30" />
        </div>

        <div className="flex shrink-0 items-center justify-between border-b border-hairline bg-surface-2/70 px-2 py-1">
          <button onClick={() => passo(-1)} aria-label="Ponto anterior" className="tappable flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 active:bg-surface-2">
            <ChevronLeft size={20} />
          </button>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
            {indice + 1} de {total}
            {caminhada && <span className="ml-2 normal-case tracking-normal text-foreground/60">· {caminhada} a pé</span>}
          </span>
          <div className="flex items-center">
            <button onClick={() => passo(1)} aria-label="Próximo ponto" className="tappable flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 active:bg-surface-2">
              <ChevronRight size={20} />
            </button>
            <button onClick={aoFechar} aria-label="Fechar" className="tappable flex h-9 w-9 items-center justify-center rounded-full text-muted active:bg-surface-2">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-3">{children}</div>
      </div>
    </div>
  );
}

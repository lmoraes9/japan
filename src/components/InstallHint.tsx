'use client';

import { useEffect, useState } from 'react';
import { Share, X } from 'lucide-react';
import { useSettings } from '@/lib/settings';

/** iOS não tem beforeinstallprompt — mostra instrução manual uma vez */
export function InstallHint() {
  const dismissed = useSettings((s) => s.installHintDismissed);
  const dismiss = useSettings((s) => s.dismissInstallHint);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isIos && !standalone) {
      const t = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(t);
    }
  }, [dismissed]);

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-20 inset-x-4 z-50 mx-auto max-w-xl">
      <div className="rounded-2xl bg-surface border border-hairline shadow-lg p-4 flex items-start gap-3">
        <Share size={20} className="text-accent mt-0.5 shrink-0" />
        <p className="text-sm leading-snug">
          <strong>Instale o app:</strong> toque em{' '}
          <strong>Compartilhar</strong> e depois em{' '}
          <strong>Adicionar à Tela de Início</strong>. Assim o roteiro funciona
          offline, como um app de verdade.
        </p>
        <button
          onClick={() => {
            setShow(false);
            dismiss();
          }}
          className="text-muted shrink-0"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

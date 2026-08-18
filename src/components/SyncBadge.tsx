'use client';

import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { useSyncStore } from '@/lib/store';
import { flush } from '@/lib/sync';

export function SyncBadge() {
  const pending = useSyncStore((s) => s.pending.length);
  const online = useSyncStore((s) => s.online);
  const syncing = useSyncStore((s) => s.syncing);

  let icon = <Cloud size={14} />;
  let label = 'sincronizado';
  let cls = 'text-matcha';
  if (syncing) {
    icon = <RefreshCw size={14} className="animate-spin" />;
    label = 'sincronizando…';
    cls = 'text-muted';
  } else if (!online) {
    icon = <CloudOff size={14} />;
    label = pending > 0 ? `offline · ${pending} pendente${pending > 1 ? 's' : ''}` : 'offline';
    cls = 'text-muted';
  } else if (pending > 0) {
    icon = <RefreshCw size={14} />;
    label = `${pending} pendente${pending > 1 ? 's' : ''}`;
    cls = 'text-gold';
  }

  return (
    <button
      onClick={() => void flush()}
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${cls}`}
    >
      {icon}
      {label}
    </button>
  );
}

import { alertasIcs } from '@/lib/alertas';

// gerado no build: os prazos saem de checklist.ts e ingressos.ts
export const dynamic = 'force-static';

export function GET() {
  return new Response(alertasIcs(), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="japao-2026-prazos.ics"',
    },
  });
}

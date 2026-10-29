import { CHECKLIST } from '@/data/checklist';
import { INGRESSOS } from '@/data/ingressos';

/**
 * Os prazos da viagem como calendário (.ics): cada abertura de venda e cada
 * "até quando" da checklist vira um evento com alarme. Importado no iPhone,
 * o aviso chega pelo próprio Calendário — não depende do app aberto, do
 * computador ligado nem de internet na hora.
 *
 * Sai dos mesmos dados do app: prazo novo em checklist.ts ou ingressos.ts
 * entra aqui sozinho no próximo deploy.
 */

export interface Alerta {
  id: string;
  titulo: string;
  /** início do evento, ISO com fuso */
  quando: string;
  minutos: number;
  descricao: string;
  url?: string;
  /** antecedências dos avisos, em minutos */
  avisos: number[];
}

const semMarkdown = (s: string) => s.replace(/\*\*/g, '').replace(/\*/g, '');

/**
 * O dia do prazo, às 9h — um 23:59 no calendário não ajuda ninguém. Antes do
 * embarque são 9h de Brasília; com vocês já no Japão (do dia 17 em diante),
 * 9h de Tóquio, senão o aviso chega às 21h, tarde demais para ligar.
 */
function manhaDoPrazo(iso: string): string {
  const brasilia = new Date(new Date(iso).getTime() - 3 * 3600_000);
  const dia = brasilia.toISOString().slice(0, 10);
  return dia >= '2026-11-17' ? `${dia}T09:00:00+09:00` : `${dia}T09:00:00-03:00`;
}

const dataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' });

export function alertas(agora: Date = new Date()): Alerta[] {
  const lista: Alerta[] = [];
  const cobertos = new Set<string>();

  // aberturas de venda: o aviso tem de chegar antes, porque esgota
  for (const i of INGRESSOS) {
    if (!i.opensAt || new Date(i.opensAt) <= agora) continue;
    if (i.checklistItemId) cobertos.add(i.checklistItemId);
    lista.push({
      id: `venda-${i.id}`,
      titulo: `🎟️ Abre a venda: ${semMarkdown(i.title)}`,
      quando: i.opensAt,
      minutos: 30,
      descricao: [semMarkdown(i.action), i.when && `Quando: ${semMarkdown(i.when)}`, i.where && `Onde: ${semMarkdown(i.where)}`, i.cost && `Custo: ${semMarkdown(i.cost)}`]
        .filter(Boolean)
        .join('\n'),
      url: i.url,
      avisos: [24 * 60, 60, 0],
    });
  }

  // prazos da checklist que ainda não estão cobertos por uma abertura de venda
  for (const c of CHECKLIST) {
    if (!c.dueAt || cobertos.has(c.id) || /FEITO/.test(c.title)) continue;
    if (new Date(c.dueAt) <= agora) continue;
    lista.push({
      id: `prazo-${c.id}`,
      titulo: `⏰ ${semMarkdown(c.title)} — até ${dataCurta(c.dueAt)}`,
      quando: manhaDoPrazo(c.dueAt),
      minutos: 15,
      descricao: semMarkdown(c.subtitle),
      avisos: [3 * 24 * 60, 0],
    });
  }

  return lista.sort((a, b) => +new Date(a.quando) - +new Date(b.quando));
}

/* ── o arquivo .ics ─────────────────────────────────────────────────────── */

const utc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escapar = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** linhas de no máximo 75 octetos, continuadas com espaço (RFC 5545) */
function dobrar(linha: string): string {
  const bytes = new TextEncoder();
  const partes: string[] = [];
  let atual = '';
  for (const ch of linha) {
    if (bytes.encode(atual + ch).length > (partes.length ? 74 : 75)) {
      partes.push(atual);
      atual = ch;
    } else atual += ch;
  }
  partes.push(atual);
  return partes.join('\r\n ');
}

export function alertasIcs(lista: Alerta[] = alertas()): string {
  const carimbo = utc(new Date());
  const linhas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//japao2026//alertas//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Japão 2026 · prazos',
  ];
  for (const a of lista) {
    const inicio = new Date(a.quando);
    const fim = new Date(inicio.getTime() + a.minutos * 60_000);
    linhas.push(
      'BEGIN:VEVENT',
      `UID:${a.id}@japan-travel-gold`,
      `DTSTAMP:${carimbo}`,
      `DTSTART:${utc(inicio)}`,
      `DTEND:${utc(fim)}`,
      `SUMMARY:${escapar(a.titulo)}`,
      `DESCRIPTION:${escapar(a.descricao)}`,
      ...(a.url ? [`URL:${a.url}`] : []),
    );
    for (const m of a.avisos) {
      linhas.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escapar(a.titulo)}`, `TRIGGER:-PT${m}M`, 'END:VALARM');
    }
    linhas.push('END:VEVENT');
  }
  linhas.push('END:VCALENDAR');
  return linhas.map(dobrar).join('\r\n') + '\r\n';
}

import { INGRESSOS, type Ingresso } from '@/data/ingressos';

export type JanelaEstado = 'futuro' | 'aberto' | 'feito';

export interface Janela {
  ingresso: Ingresso;
  opensAt: Date;
  estado: JanelaEstado;
  /** minutos até abrir (negativo se já abriu) */
  minutesUntil: number;
}

const fmt = (d: Date, tz: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: tz,
  }).format(d);

/** '23/10 às 10:00 no Japão · 22/10 às 22:00 em Brasília' */
export function janelaQuando(d: Date): string {
  return `${fmt(d, 'Asia/Tokyo')} no Japão · ${fmt(d, 'America/Sao_Paulo')} em Brasília`;
}

/** 'em 44 dias', 'em 6 h', 'em 40 min' */
export function faltam(minutes: number): string {
  if (minutes <= 0) return 'agora';
  const dias = Math.floor(minutes / 1440);
  if (dias >= 2) return `em ${dias} dias`;
  const horas = Math.floor(minutes / 60);
  if (horas >= 2) return `em ${horas} h`;
  return `em ${minutes} min`;
}

/**
 * As compras com hora marcada (Shinkansen, Shibuya Sky, Torokko…), com o
 * estado de cada uma. `checklist` é o mapa de itens marcados: uma janela cujo
 * item da checklist já foi marcado sai da lista.
 */
export function janelas(
  checklist: Record<string, { checked?: boolean } | undefined>,
  now: Date = new Date(),
): Janela[] {
  return INGRESSOS.filter((i) => i.opensAt)
    .map((ingresso) => {
      const opensAt = new Date(ingresso.opensAt!);
      const minutesUntil = Math.round((opensAt.getTime() - now.getTime()) / 60000);
      const feito = !!(ingresso.checklistItemId && checklist[ingresso.checklistItemId]?.checked);
      const estado: JanelaEstado = feito ? 'feito' : minutesUntil > 0 ? 'futuro' : 'aberto';
      return { ingresso, opensAt, estado, minutesUntil };
    })
    .sort((a, b) => a.opensAt.getTime() - b.opensAt.getTime());
}

/**
 * O que ainda exige ação, na ordem em que dá para agir: o que já abriu e é
 * obrigatório, depois o que vai abrir (pela data), e por último o que já
 * abriu mas é só recomendado — esse pode esperar sem risco.
 */
export function janelasPendentes(
  checklist: Record<string, { checked?: boolean } | undefined>,
  now: Date = new Date(),
): Janela[] {
  const todas = janelas(checklist, now).filter((j) => j.estado !== 'feito');
  const abertaUrgente = (j: Janela) => j.estado === 'aberto' && j.ingresso.status === 'obrigatorio';
  return [
    ...todas.filter(abertaUrgente),
    ...todas.filter((j) => j.estado === 'futuro'),
    ...todas.filter((j) => j.estado === 'aberto' && !abertaUrgente(j)),
  ];
}

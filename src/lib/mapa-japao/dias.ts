import { ALL_DAYS } from '@/data/days';
import type { Day } from '@/data/types';

/**
 * Um marcador por dia da viagem, no lugar principal daquele dia.
 *
 * O mapa geral é só isto: dezesseis ícones numerados. Quando dois ficam perto
 * demais na tela eles viram um só, com o intervalo de datas na etiqueta; ao
 * aproximar, o agrupamento se desfaz sozinho e cada dia reaparece no seu
 * lugar. Não há trilho, trem nem ficha: a tela é um mapa, não um painel.
 */
export interface DiaMapa {
  /** 1 a 16, a ordem da viagem */
  n: number;
  dayId: string;
  day: Day;
  /** '18/nov' */
  data: string;
  /** o nome do lugar principal do dia, para a etiqueta quando separado */
  titulo: string;
  /** a cidade, para a etiqueta quando agrupado */
  cidade: string;
  cidadeId: string;
  /** o modelo 3D que representa o dia */
  icone: string;
  /**
   * O nome do lugar quando dois dias caem exatamente no mesmo ponto — a
   * chegada e a volta por Haneda são o mesmo aeroporto, e no mapa precisam
   * ser um marcador só, com as duas datas.
   */
  lugar?: string;
  lat: number;
  lng: number;
}

const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const dataCurta = (iso: string) => `${Number(iso.slice(8))}/${MES[Number(iso.slice(5, 7)) - 1]}`;

/** O lugar que resume cada dia, com a coordenada real e o ícone. */
const TABELA: Omit<DiaMapa, 'n' | 'day' | 'data'>[] = [
  { dayId: 'd2026-11-18', titulo: 'Chegada em Haneda', cidade: 'Tóquio', cidadeId: 'tokyo', icone: 'aviao', lugar: 'Haneda', lat: 35.5494, lng: 139.7798 },
  { dayId: 'd2026-11-19', titulo: 'Sensō-ji', cidade: 'Tóquio', cidadeId: 'tokyo', icone: 'sensoji', lat: 35.7148, lng: 139.7967 },
  { dayId: 'd2026-11-20', titulo: 'Kamakura', cidade: 'Kamakura', cidadeId: 'kamakura', icone: 'kamakura', lat: 35.317, lng: 139.5357 },
  { dayId: 'd2026-11-21', titulo: 'Tsukiji e Ginza', cidade: 'Tóquio', cidadeId: 'tokyo', icone: 'mercado', lat: 35.6655, lng: 139.7708 },
  { dayId: 'd2026-11-22', titulo: 'Meiji Jingū', cidade: 'Tóquio', cidadeId: 'tokyo', icone: 'meiji-jingu', lat: 35.6764, lng: 139.6993 },
  { dayId: 'd2026-11-23', titulo: 'Parque da Paz', cidade: 'Hiroshima', cidadeId: 'hiroshima', icone: 'parque-da-paz', lat: 34.3955, lng: 132.4536 },
  { dayId: 'd2026-11-24', titulo: 'Miyajima', cidade: 'Miyajima', cidadeId: 'miyajima', icone: 'miyajima', lat: 34.296, lng: 132.3197 },
  { dayId: 'd2026-11-25', titulo: 'Castelo de Himeji', cidade: 'Himeji', cidadeId: 'himeji', icone: 'himeji', lat: 34.8394, lng: 134.6939 },
  { dayId: 'd2026-11-26', titulo: 'Kōyasan', cidade: 'Kōyasan', cidadeId: 'koyasan', icone: 'koyasan', lat: 34.2131, lng: 135.5847 },
  { dayId: 'd2026-11-27', titulo: 'Fushimi Inari', cidade: 'Kyoto', cidadeId: 'kyoto', icone: 'fushimi-inari', lat: 34.9671, lng: 135.7727 },
  { dayId: 'd2026-11-28', titulo: 'Higashiyama', cidade: 'Kyoto', cidadeId: 'kyoto', icone: 'higashiyama', lat: 34.9949, lng: 135.785 },
  { dayId: 'd2026-11-29', titulo: 'Kinkaku-ji', cidade: 'Kyoto', cidadeId: 'kyoto', icone: 'kinkakuji', lat: 35.0394, lng: 135.7292 },
  { dayId: 'd2026-11-30', titulo: 'Nara', cidade: 'Nara', cidadeId: 'nara', icone: 'nara', lat: 34.689, lng: 135.8398 },
  { dayId: 'd2026-12-01', titulo: 'Tōfuku-ji', cidade: 'Kyoto', cidadeId: 'kyoto', icone: 'tofukuji', lat: 34.9761, lng: 135.7743 },
  { dayId: 'd2026-12-02', titulo: 'Akihabara', cidade: 'Tóquio', cidadeId: 'tokyo', icone: 'cidade', lat: 35.6984, lng: 139.7731 },
  { dayId: 'd2026-12-03', titulo: 'Volta por Haneda', cidade: 'Tóquio', cidadeId: 'tokyo', icone: 'aviao', lugar: 'Haneda', lat: 35.5494, lng: 139.7798 },
];

export const DIAS_MAPA: DiaMapa[] = TABELA.map((t, i) => {
  const day = ALL_DAYS.find((d) => d.id === t.dayId);
  if (!day) throw new Error(`dia desconhecido no mapa: ${t.dayId}`);
  return { ...t, n: i + 1, day, data: dataCurta(day.date) };
});

export const diaPorId = (dayId: string) => DIAS_MAPA.find((d) => d.dayId === dayId);

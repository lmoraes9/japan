/**
 * O plano de edição: a lista de segmentos que o vídeo vai ter, na ordem.
 * O rascunho sai de `npm run rascunho`; o Claude revisa olhando os quadros,
 * escolhe os cortes, escreve as notas, e o `npm run render` transforma em mp4.
 */
export type Modo = 'aviao' | 'shinkansen' | 'trem' | 'metro' | 'bonde' | 'onibus' | 'balsa' | 'teleferico' | 'taxi' | 'ape';

export interface Ponto {
  nome: string;
  /** linha de baixo do rótulo: 'GRU · 16 nov' */
  sub?: string;
  jp?: string;
  lat: number;
  lng: number;
  /** foto que aparece como polaroid quando a rota chega aqui (caminho em entrada/) */
  foto?: string;
  /** ponto de passagem: bolinha menor, rótulo discreto */
  passagem?: boolean;
}

export interface SegMapa {
  tipo: 'mapa';
  /** globo = voos; regiao = Japão inteiro (trem bala); local = dentro da cidade */
  escala: 'globo' | 'regiao' | 'local';
  pontos: Ponto[];
  /** um modo por perna (pontos.length - 1); se vier um só, vale para todas */
  modos: Modo[];
  /** chip de cima: '16 → 18 nov' */
  quando?: string;
  /** título grande: 'São Paulo → Tóquio' */
  titulo?: string;
  /** linha de baixo: 'Shinkansen Nozomi · 3h55' */
  legenda?: string;
  /** cidades que ainda vêm pela frente, em cinza, para dar contexto */
  contexto?: Ponto[];
  segundos: number;
}

export interface SegClipe {
  tipo: 'clipe';
  /** caminho em editor/: 'entrada/pri-iphone/IMG_4315.MOV' */
  arquivo: string;
  /** vídeo: trecho escolhido, em segundos do arquivo original */
  de?: number;
  ate?: number;
  /** foto: quanto tempo fica na tela */
  segundos?: number;
  largura?: number;
  altura?: number;
  /** lat/lng: onde foi gravado (o estilo mapa ao vivo usa para o pontinho azul) */
  lugar?: { nome: string; jp?: string; linha?: string; lat?: number; lng?: number };
  /** a notinha de história, discreta, embaixo */
  nota?: { titulo?: string; texto: string };
  /** volume do som ambiente (0–1); padrão 1 */
  volume?: number;
}

export interface SegFim {
  tipo: 'fim';
  titulo: string;
  sub?: string;
  /** a rota inteira até aqui, no mapa do Japão */
  pontos: Ponto[];
  numeros?: string[];
  segundos: number;
}

export type Segmento = SegMapa | SegClipe | SegFim;

export type Estilo = 'noite' | 'outono' | 'caderno' | 'ukiyoe' | 'linha' | 'aovivo';

export interface Plano {
  titulo: string;
  formato: 'reel' | 'story' | 'familia';
  /** o visual (src/estilos/); padrão: noite */
  estilo?: Estilo;
  segmentos: Segmento[];
  /** trilha opcional (arquivo em entrada/ ou dados/); no Instagram a música entra pelo app */
  trilha?: string;
}

export const FPS = 30;
/** quadros de sobreposição entre um segmento e o seguinte */
export const TRANSICAO = 10;

export function segundosDe(s: Segmento): number {
  if (s.tipo === 'clipe') return s.de !== undefined && s.ate !== undefined ? s.ate - s.de : (s.segundos ?? 3);
  return s.segundos;
}

export const quadrosDe = (s: Segmento) => Math.round(segundosDe(s) * FPS);

export function duracaoTotal(p: Plano): number {
  const soma = p.segmentos.reduce((n, s) => n + quadrosDe(s), 0);
  return soma - TRANSICAO * Math.max(0, p.segmentos.length - 1);
}

/** quadro em que cada segmento começa no vídeo final (já descontadas as transições) */
export function inicios(p: Plano): number[] {
  let q = 0;
  return p.segmentos.map((s) => {
    const ini = q;
    q += quadrosDe(s) - TRANSICAO;
    return ini;
  });
}

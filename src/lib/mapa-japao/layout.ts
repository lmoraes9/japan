/**
 * A geometria da tela, como função pura de (largura, altura, estado).
 *
 * Este arquivo não conhece Three.js, nem projeção, nem latitude. É essa
 * ignorância que dá a garantia: se nenhuma posição de alvo pode ser função da
 * geografia, dois alvos não podem se sobrepor por causa dela. O teste em
 * `scripts/verifica-mapa.mjs` percorre toda a matriz de aparelhos e estados e
 * exige interseção zero entre retângulos tocáveis.
 */

export type EstadoTela = 'panorama' | 'regiao' | 'cidade' | 'indice' | 'expandida';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** false = pintura, não recebe toque (entra no relatório, não na proibição) */
  tocavel: boolean;
}

/** alturas fixas das duas faixas de baixo */
export const ALTURA_TRILHO = 148;
export const ALTURA_FICHA = 180;
export const ALTURA_BAIXO = ALTURA_TRILHO + ALTURA_FICHA;

/** o mínimo confortável para o dedo */
export const ALVO = 44;

export const LADRILHO_CIDADE = 112;
export const LADRILHO_TRECHO = 76;
export const LADRILHO_ALTURA = 124;
export const GAP_TRILHO = 8;

export const alturaJanela = (h: number) => Math.max(240, h - ALTURA_BAIXO);

/** largura total da fita e folga das pontas, para o 1º e o último centrarem */
export function metricaTrilho(w: number) {
  const nCidades = 13;
  const nTrechos = 12;
  const conteudo =
    nCidades * LADRILHO_CIDADE + nTrechos * LADRILHO_TRECHO + (nCidades + nTrechos - 1) * GAP_TRILHO;
  const folga = Math.round(w / 2 - LADRILHO_CIDADE / 2);
  return { conteudo, folga, total: conteudo + folga * 2, rolagemMax: conteudo + folga * 2 - w };
}

/** centro de cada casa dentro da fita (coordenada de rolagem) */
export function centrosDasCasas(w: number): number[] {
  const { folga } = metricaTrilho(w);
  const centros: number[] = [];
  let x = folga;
  for (let i = 0; i < 25; i++) {
    const larg = i % 2 === 0 ? LADRILHO_CIDADE : LADRILHO_TRECHO;
    centros.push(x + larg / 2);
    x += larg + GAP_TRILHO;
  }
  return centros;
}

/**
 * Todos os retângulos declarados da tela. As chaves são estáveis: o script de
 * verificação e a simulação de toque se referem a elas pelo nome.
 */
export function retangulos(w: number, h: number, estado: EstadoTela): Record<string, Rect> {
  const jh = alturaJanela(w === 0 ? 1 : h);
  const r: Record<string, Rect> = {};
  const toque = (x: number, y: number, lw: number, lh: number): Rect => ({ x, y, w: lw, h: lh, tocavel: true });
  const tinta = (x: number, y: number, lw: number, lh: number): Rect => ({ x, y, w: lw, h: lh, tocavel: false });

  if (estado === 'indice') {
    r['indice.fechar'] = toque(w - 56, 6, ALVO, ALVO);
    const cel = (w - 48) / 3;
    for (let k = 0; k < 3; k++) r[`indice.coluna${k}`] = toque(16 + k * (cel + GAP_TRILHO), 70, cel, 96);
    return r;
  }

  if (estado === 'expandida') {
    r['expandida.fechar'] = toque(w - 56, Math.round(h * 0.32) + 6, ALVO, ALVO);
    return r;
  }

  // ── janela ──────────────────────────────────────────────────────────────
  r['janela.titulo'] = tinta(12, 8, Math.min(258, w - 120), 48);
  r['janela.voltar'] = toque(8, jh - 56, ALVO, ALVO);
  r['janela.indice'] = toque(w - 104, 4, ALVO, ALVO);
  r['janela.tudo'] = toque(w - 52, 4, ALVO, ALVO);
  r['janela.hoje'] = toque(64, jh - 56, ALVO, ALVO);
  if (jh >= 420) r['janela.minimapa'] = tinta(w - 80, jh - 92, 72, 80);

  if (estado === 'panorama') {
    // fila horizontal na base: a largura é a dimensão escassa deste mapa
    // (a viagem é uma faixa leste-oeste), então os atalhos de região gastam
    // altura, que sobra, e não largura, que falta
    const cw = (w - 16 - 3 * GAP_TRILHO) / 4;
    for (let k = 0; k < 4; k++) r[`janela.regiao${k}`] = toque(8 + k * (cw + GAP_TRILHO), jh - 116, cw, ALVO);
  }

  // ── trilho ──────────────────────────────────────────────────────────────
  r['trilho.fita'] = toque(0, jh + 10, w, LADRILHO_ALTURA);
  r['trilho.colchete'] = tinta(Math.round(w / 2 - 64), jh + 2, 128, 140);
  r['trilho.regua'] = tinta(16, jh + LADRILHO_ALTURA + 16, w - 32, 3);

  // ── ficha ───────────────────────────────────────────────────────────────
  const yCab = h - 168;
  r['ficha.anterior'] = toque(12, yCab, ALVO, ALVO);
  r['ficha.cabecalho'] = toque(64, yCab, w - 128, ALVO);
  r['ficha.proximo'] = toque(w - 56, yCab, ALVO, ALVO);
  r['ficha.chips'] = toque(16, h - 120, w - 32, ALVO);
  r['ficha.botao'] = toque(16, h - 68, w - 32, 48);

  return r;
}

export function seIntersectam(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

/** Pares de alvos que se sobrepõem. Vazio é a condição de correção da tela. */
export function colisoes(w: number, h: number, estado: EstadoTela): [string, string][] {
  const rs = Object.entries(retangulos(w, h, estado)).filter(([, v]) => v.tocavel);
  const ruins: [string, string][] = [];
  for (let i = 0; i < rs.length; i++) {
    for (let j = i + 1; j < rs.length; j++) {
      if (seIntersectam(rs[i][1], rs[j][1])) ruins.push([rs[i][0], rs[j][0]]);
    }
  }
  return ruins;
}

/** Alvos menores que o mínimo do dedo. */
export function pequenos(w: number, h: number, estado: EstadoTela): string[] {
  return Object.entries(retangulos(w, h, estado))
    .filter(([, v]) => v.tocavel && (v.w < ALVO || v.h < ALVO))
    .map(([k]) => k);
}

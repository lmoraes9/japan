import { DIAS_MAPA, type DiaMapa } from './dias';

/**
 * Quem aparece no mapa, e com que nome.
 *
 * O mapa tem três níveis fixos — região, cidade, dia — e a única coisa que o
 * zoom decide é até onde descer. De longe o Kansai é um ícone só; ao
 * aproximar ele vira Kyoto, Osaka, Nara e Himeji; aproximando mais, os dias
 * de Kyoto se separam em Fushimi Inari, Higashiyama, Kinkaku-ji e Tōfuku-ji.
 *
 * A regra para descer é simples: um nó só se abre quando os filhos couberem
 * na tela sem se cobrirem. Como a conta é feita com o tamanho real da
 * etiqueta, duas etiquetas irmãs nunca se sobrepõem — não por ajuste, mas
 * porque o nó só abriu depois de haver espaço. O que sobra (galhos
 * diferentes que se cruzam) é resolvido subindo o nó mais fundo de volta ao
 * pai, e o que ainda assim insistir ganha um desvio vertical com haste.
 *
 * Cada nó mora na posição do seu dia principal, nunca na média dos filhos.
 * Assim, quando um grupo se abre, o ícone que já estava na tela fica parado
 * e os irmãos aparecem em volta dele, em vez de todo mundo saltar de lugar.
 */

export interface Ponto {
  x: number;
  y: number;
  visivel: boolean;
}

export type Nivel = 'regiao' | 'cidade' | 'lugar' | 'dia';

export interface No {
  id: string;
  nivel: Nivel;
  /** o que vai na etiqueta */
  nome: string;
  /** todos os dias sob este nó, em ordem de viagem */
  dias: DiaMapa[];
  /** o dia que dá o ícone e a posição */
  principal: DiaMapa;
  filhos: No[];
  pai?: No;
  profundidade: number;
}

/** a primeira cidade de cada região é a que dá o ícone e a posição */
const REGIOES: { id: string; nome: string; cidades: string[] }[] = [
  { id: 'kanto', nome: 'Tóquio', cidades: ['tokyo', 'kamakura'] },
  { id: 'chugoku', nome: 'Hiroshima', cidades: ['hiroshima', 'miyajima'] },
  { id: 'kansai', nome: 'Kansai', cidades: ['kyoto', 'osaka', 'nara', 'himeji', 'koyasan'] },
];

/** o dia que representa cada cidade: o lugar pelo qual ela é conhecida */
const CIDADES: { id: string; nome: string; principal: string }[] = [
  { id: 'tokyo', nome: 'Tóquio', principal: 'd2026-11-19' },
  { id: 'kamakura', nome: 'Kamakura', principal: 'd2026-11-20' },
  { id: 'hiroshima', nome: 'Hiroshima', principal: 'd2026-11-23' },
  { id: 'miyajima', nome: 'Miyajima', principal: 'd2026-11-24' },
  { id: 'kyoto', nome: 'Kyoto', principal: 'd2026-11-27' },
  { id: 'osaka', nome: 'Osaka', principal: 'd2026-11-26' },
  { id: 'nara', nome: 'Nara', principal: 'd2026-11-30' },
  { id: 'himeji', nome: 'Himeji', principal: 'd2026-11-25' },
  { id: 'koyasan', nome: 'Kōyasan', principal: 'd2026-11-26' },
];

/** metade de um quilômetro, em graus: mais perto que isso é o mesmo lugar */
const MESMO_LUGAR = { lat: 0.004, lng: 0.005 };

/**
 * Os filhos de uma cidade. Dias em pontos diferentes viram um nó cada; dias
 * no mesmo ponto viram um nó só, com as duas datas — senão a cidade nunca se
 * abriria, porque dois marcadores no mesmo pixel não se separam com zoom
 * nenhum.
 */
function lugares(dias: DiaMapa[]): No[] {
  const grupos: DiaMapa[][] = [];
  for (const d of dias) {
    const junto = grupos.find(
      (g) => Math.abs(g[0].lat - d.lat) < MESMO_LUGAR.lat && Math.abs(g[0].lng - d.lng) < MESMO_LUGAR.lng,
    );
    if (junto) junto.push(d);
    else grupos.push([d]);
  }
  return grupos.map((g) => ({
    id: g.length === 1 ? `dia:${g[0].dayId}` : `lugar:${g[0].dayId}`,
    nivel: g.length === 1 ? ('dia' as const) : ('lugar' as const),
    nome: g.length === 1 ? g[0].titulo : g[0].lugar ?? g[0].cidade,
    dias: g,
    principal: g[0],
    filhos: [],
    profundidade: 2,
  }));
}

function montar(): No[] {
  const porCidade = new Map<string, DiaMapa[]>();
  for (const d of DIAS_MAPA) {
    const lista = porCidade.get(d.cidadeId);
    if (lista) lista.push(d);
    else porCidade.set(d.cidadeId, [d]);
  }

  return REGIOES.map((r) => {
    const filhosCidade: No[] = [];
    for (const idCidade of r.cidades) {
      const dias = porCidade.get(idCidade);
      if (!dias?.length) continue;
      const c = CIDADES.find((x) => x.id === idCidade);
      const principal = dias.find((d) => d.dayId === c?.principal) ?? dias[0];
      const noCidade: No = {
        id: `cidade:${idCidade}`,
        nivel: 'cidade',
        nome: c?.nome ?? dias[0].cidade,
        dias,
        principal,
        profundidade: 1,
        filhos: lugares(dias),
      };
      for (const f of noCidade.filhos) f.pai = noCidade;
      filhosCidade.push(noCidade);
    }
    const dias = filhosCidade.flatMap((c) => c.dias).sort((a, b) => a.n - b.n);
    const noRegiao: No = {
      id: `regiao:${r.id}`,
      nivel: 'regiao',
      nome: r.nome,
      dias,
      principal: filhosCidade[0].principal,
      filhos: filhosCidade,
      profundidade: 0,
    };
    for (const f of noRegiao.filhos) f.pai = noRegiao;
    return noRegiao;
  });
}

export const RAIZES: No[] = montar();

/** todos os dayIds sob um nó, para enquadrar */
export function diasDe(no: No): string[] {
  return no.dias.map((d) => d.dayId);
}

export interface Marcador {
  no: No;
  /** onde o pé do ícone está, em pixels */
  x: number;
  y: number;
  /** o centro da etiqueta: igual a x, menos quando ela encosta na borda */
  etiquetaX: number;
  /** o topo da etiqueta: normalmente acima do ícone, às vezes abaixo */
  topo: number;
  /** o tamanho da etiqueta — ou da bolha, quando a etiqueta não coube */
  larg: number;
  alt: number;
  /** false quando não houve lugar para a etiqueta: fica só a bolha com o número */
  etiqueta: boolean;
}

/** a bolha com o número, e o vão entre as bolhas de um lugar com dois dias */
const BOLHA = 26;
const BOLHA_VAO = 4;
/** a largura média de uma letra do nome, em negrito de 12,5 px */
const LETRA = 8;
/** o tamanho da bolha sozinha, quando a etiqueta não cabe */
const SO_BOLHA = 28;

/**
 * Quanto a etiqueta de um nó mede: as bolhas, o nome e as folgas. É com a
 * largura real de cada uma que a separação é decidida — 'Kansai' pede menos
 * espaço que 'Castelo de Himeji', e cabe onde a outra não caberia.
 */
export function larguraEtiqueta(no: No, extra = 0): number {
  const n = no.nivel === 'lugar' ? no.dias.length : 1;
  const bolhas = n * BOLHA + (n - 1) * BOLHA_VAO;
  return Math.min(220, 3 + bolhas + 6 + Math.round(no.nome.length * LETRA) + extra + 10 + 4);
}

/** quando a etiqueta vai para baixo, ela encosta logo abaixo do pé do ícone */
const ABAIXO = 12;

/** o retângulo que a etiqueta de um marcador ocupa */
function caixa(m: Marcador) {
  return { x0: m.etiquetaX - m.larg / 2, x1: m.etiquetaX + m.larg / 2, y0: m.topo, y1: m.topo + m.alt };
}

function bate(a: ReturnType<typeof caixa>, b: ReturnType<typeof caixa>) {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

function descendeDe(n: No, pai: No): boolean {
  for (let p: No | undefined = n; p; p = p.pai) if (p === pai) return true;
  return false;
}

/**
 * Decide quem aparece e onde a etiqueta de cada um fica.
 *
 * `larguraDe` dá a largura da etiqueta de cada nó, `alt` a altura e `acima`
 * a distância dela até o pé do ícone — é com esses números, e só com eles,
 * que a função garante que nada se cobre.
 */
export function marcadores(
  pontos: Record<string, Ponto>,
  tela: { largura: number; altura: number },
  larguraDe: (no: No) => number,
  alt: number,
  acima: number,
  icone: number,
): Marcador[] {
  const pos = (no: No) => pontos[no.principal.dayId];
  const separados = (a: No, b: No) => {
    const pa = pos(a);
    const pb = pos(b);
    if (!pa || !pb) return true;
    return Math.abs(pa.x - pb.x) >= (larguraDe(a) + larguraDe(b)) / 2 || Math.abs(pa.y - pb.y) >= alt;
  };

  // desce enquanto os irmãos couberem lado a lado
  const descer = (no: No): No[] => {
    if (!no.filhos.length) return [no];
    if (no.filhos.length > 1) {
      for (let i = 0; i < no.filhos.length; i++)
        for (let j = i + 1; j < no.filhos.length; j++)
          if (!separados(no.filhos[i], no.filhos[j])) return [no];
    }
    return no.filhos.flatMap(descer);
  };
  let atual = RAIZES.flatMap(descer);

  // galhos diferentes ainda podem se cruzar: o mais fundo volta para o pai
  for (let volta = 0; volta < 8; volta += 1) {
    let subiu = false;
    busca: for (let i = 0; i < atual.length; i += 1) {
      for (let j = i + 1; j < atual.length; j += 1) {
        const a = atual[i];
        const b = atual[j];
        if (separados(a, b)) continue;
        const fundo = a.profundidade >= b.profundidade ? a : b;
        const pai = fundo.pai;
        if (!pai) continue; // raízes: resolvidas com desvio, logo abaixo
        atual = atual.filter((n) => !descendeDe(n, pai));
        atual.push(pai);
        subiu = true;
        break busca;
      }
    }
    if (!subiu) break;
  }

  atual.sort((a, b) => a.dias[0].n - b.dias[0].n);

  // o que ainda colidir (só pode ser raiz com raiz) sobe a etiqueta e ganha haste
  const postos: Marcador[] = [];
  const borda = 8;
  // os ícones também ocupam espaço: uma etiqueta que cobre o ícone do vizinho
  // esconde justamente o que ela deveria ajudar a encontrar
  const caixasIcone = atual
    .map((no) => pos(no))
    .filter((p): p is Ponto => !!p && p.visivel)
    .map((p) => ({ x0: p.x - icone / 2, x1: p.x + icone / 2, y0: p.y - icone, y1: p.y + 2 }));
  const degrau = alt + 6;
  for (const no of atual) {
    const p = pos(no);
    if (!p || !p.visivel) continue;
    // o ícone precisa estar na tela: etiqueta sem ícone à vista só confunde
    if (p.x < borda || p.x > tela.largura - borda) continue;
    if (p.y < borda || p.y > tela.altura - borda) continue;
    const larg = larguraDe(no);
    // encostou na lateral, a etiqueta desliza para dentro e a haste aponta o ícone
    const meia = larg / 2 + borda;
    const base = Math.max(meia, Math.min(tela.largura - meia, p.x));
    const m: Marcador = { no, x: p.x, y: p.y, etiquetaX: base, topo: 0, larg, alt, etiqueta: true };
    // onde tentar pôr a etiqueta, em ordem: em cima do ícone, embaixo dele,
    // ao lado, e só então mais longe. Descer ou ir para o lado é melhor que
    // subir duas alturas — a etiqueta continua colada no seu ícone em vez
    // de flutuar acima do mapa.
    const aoLado = p.y - icone / 2 - alt / 2;
    const candidatos = [
      { x: base, topo: p.y - acima - alt },
      { x: base, topo: p.y + ABAIXO },
      { x: p.x + icone / 2 + larg / 2 + 6, topo: aoLado },
      { x: p.x - icone / 2 - larg / 2 - 6, topo: aoLado },
      { x: base, topo: p.y - acima - alt - degrau },
      { x: base, topo: p.y + ABAIXO + degrau },
      { x: base, topo: p.y - acima - alt - 2 * degrau },
      { x: base, topo: p.y + ABAIXO + 2 * degrau },
    ];
    let coube = false;
    for (const c of candidatos) {
      m.etiquetaX = c.x;
      m.topo = c.topo;
      const cx = caixa(m);
      if (cx.x0 < 4 || cx.x1 > tela.largura - 4 || cx.y0 < 4 || cx.y1 > tela.altura - 4) continue;
      if (caixasIcone.some((b) => bate(b, cx))) continue;
      if (postos.every((o) => !bate(caixa(o), cx))) {
        coube = true;
        break;
      }
    }
    if (!coube) {
      // sem lugar para a etiqueta, o ícone fica com a bolha do número: ele
      // continua no mapa, e o nome fica a um toque de distância
      m.etiqueta = false;
      m.larg = SO_BOLHA;
      m.alt = SO_BOLHA;
      m.etiquetaX = p.x;
      m.topo = p.y - icone - SO_BOLHA - 2;
      if (postos.some((o) => bate(caixa(o), caixa(m)))) m.topo = p.y + 4;
    }
    postos.push(m);
  }
  return postos;
}

const MES_CURTO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function diaMes(d: DiaMapa): [number, number] {
  const [, mes, dia] = d.dayId.slice(1).split('-').map(Number);
  return [dia, mes - 1];
}

/**
 * '19/nov', '18–22/nov', '30/nov – 1/dez' e, quando a estadia se parte em
 * duas (Tóquio no começo e no fim), '18–22/nov · 2–3/dez'.
 */
export function faixa(no: No): string {
  // dias seguidos viram um intervalo; um bate-volta no meio (Kamakura, entre
  // dois dias de Tóquio) não parte a estadia em duas
  let corridas: DiaMapa[][] = [];
  for (const d of no.dias) {
    const ultima = corridas[corridas.length - 1];
    if (ultima && d.n - ultima[ultima.length - 1].n <= 2) ultima.push(d);
    else corridas.push([d]);
  }
  // mais de dois trechos não cabem na etiqueta: vira um intervalo só
  if (corridas.length > 2) corridas = [no.dias];
  return corridas
    .map((c) => {
      const [da, ma] = diaMes(c[0]);
      const [db, mb] = diaMes(c[c.length - 1]);
      if (c.length === 1) return `${da}/${MES_CURTO[ma]}`;
      if (ma === mb) return `${da}–${db}/${MES_CURTO[ma]}`;
      return `${da}/${MES_CURTO[ma]} – ${db}/${MES_CURTO[mb]}`;
    })
    .join(' · ');
}

/** o número da sequência: o primeiro dia do nó, como o Leonardo pediu */
export function numero(no: No): string {
  return String(no.dias[0].n);
}

/** o nó folha em que um dia mora: o próprio dia, ou o lugar que ele divide com outro */
export function noDoDia(dayId: string): No | undefined {
  const busca = (no: No): No | undefined => {
    if (!no.filhos.length) return no.dias.some((d) => d.dayId === dayId) ? no : undefined;
    for (const f of no.filhos) {
      const achou = busca(f);
      if (achou) return achou;
    }
    return undefined;
  };
  for (const r of RAIZES) {
    const achou = busca(r);
    if (achou) return achou;
  }
  return undefined;
}

/**
 * Quem precisa se abrir para um nó aparecer sozinho: o ancestral mais fundo
 * com dois filhos ou mais. É o zoom em que os irmãos dele se separam que
 * tira o nó de dentro do grupo — um pai de filho único abre de graça.
 */
export function quemAbre(no: No): No {
  for (let p = no.pai; p; p = p.pai) if (p.filhos.length >= 2) return p;
  return no;
}

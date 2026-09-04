/**
 * Mapas ilustrados de lugares — SVG desenhado à mão, esquemático (não é escala
 * geográfica), com pontos clicáveis que abrem a explicação e a história.
 */

export type HotspotKind =
  | 'gate'
  | 'hall'
  | 'fox'
  | 'torii'
  | 'stone'
  | 'water'
  | 'view'
  | 'peak'
  | 'station'
  | 'food';

export interface PlaceHotspot {
  id: string;
  /** número mostrado no marcador */
  n: number;
  x: number;
  y: number;
  kind: HotspotKind;
  /** rótulo curto ao lado do marcador no mapa */
  label: string;
  /** de que lado do marcador o rótulo fica */
  side: 'left' | 'right';
  title: string;
  jp?: string;
  facts?: string;
  paragraphs: string[];
}

export interface SceneryShape {
  d: string;
  fill?: string;
  stroke?: string;
  width?: number;
  dash?: string;
  opacity?: number;
  /** arredondar pontas do traço */
  round?: boolean;
}

export interface PlaceMap {
  id: string;
  /** stop do roteiro a que este mapa pertence */
  stopId: string;
  dayId: string;
  title: string;
  jp: string;
  subtitle: string;
  intro: string[];
  viewBox: string;
  scenery: SceneryShape[];
  hotspots: PlaceHotspot[];
  legend: string;
}

/** cores resolvidas a partir das variáveis de tema (funcionam em claro e escuro) */
export const MAP_COLORS = {
  ink: 'var(--foreground)',
  muted: 'var(--muted)',
  paper: 'var(--surface-2)',
  vermilion: 'var(--accent)',
  forest: 'var(--matcha)',
  water: 'var(--rail)',
  gold: 'var(--gold)',
};

const fushimiInari: PlaceMap = {
  id: 'fushimi-inari',
  stopId: 'd27-fushimi-inari',
  dayId: 'd2026-11-27',
  title: 'Fushimi Inari Taisha',
  jp: '伏見稲荷大社',
  subtitle: 'Da estação ao cume, o que é cada coisa no caminho',
  intro: [
    'O mapa é **esquemático**: mostra a ordem das coisas na subida, não a escala real. Toquem em qualquer ponto para ver o que é e a história.',
    'Vocês chegam **15:30** e sobem enquanto todo mundo desce. Do portão até o **Yotsutsuji** (ponto 9) são 30–45 min de escada; o cume são mais 45. A volta pelo mesmo caminho é sempre mais rápida.',
  ],
  viewBox: '0 0 360 690',
  scenery: [
    // silhueta da montanha
    {
      d: 'M0 300 L60 220 L110 260 L170 130 L215 190 L262 120 L300 200 L360 150 L360 0 L0 0 Z',
      fill: MAP_COLORS.forest,
      opacity: 0.14,
    },
    {
      d: 'M0 340 L70 280 L130 320 L185 235 L240 290 L300 245 L360 300 L360 120 L0 120 Z',
      fill: MAP_COLORS.forest,
      opacity: 0.1,
    },
    // linha do trem, embaixo
    {
      d: 'M0 670 L360 670',
      stroke: MAP_COLORS.water,
      width: 3,
      opacity: 0.5,
    },
    {
      d: 'M0 670 L360 670',
      stroke: MAP_COLORS.paper,
      width: 3,
      dash: '4 10',
    },
    // caminho principal
    {
      d: 'M180 648 L180 606 C180 578 152 574 152 546 C152 512 206 508 206 466 C206 428 134 422 134 378 C134 336 198 328 198 292 C198 252 148 244 148 196 C148 152 160 118 166 88',
      stroke: MAP_COLORS.muted,
      width: 14,
      opacity: 0.35,
      round: true,
    },
    // trecho de torii (senbon torii → cume)
    {
      d: 'M206 466 C206 428 134 422 134 378 C134 336 198 328 198 292 C198 252 148 244 148 196 C148 152 160 118 166 88',
      stroke: MAP_COLORS.vermilion,
      width: 12,
      dash: '2.5 5.5',
      opacity: 0.9,
      round: true,
    },
    // lagoa Shin-ike
    {
      d: 'M232 292 C258 278 292 288 296 304 C300 322 268 336 246 328 C226 320 216 300 232 292 Z',
      fill: MAP_COLORS.water,
      opacity: 0.3,
    },
    // árvores
    {
      d: 'M64 470 l9 22 h-18 Z M92 508 l8 20 h-16 Z M52 546 l10 24 h-20 Z M290 500 l9 22 h-18 Z M312 552 l8 20 h-16 Z M268 592 l10 24 h-20 Z M96 380 l9 22 h-18 Z M286 402 l9 22 h-18 Z M74 240 l9 22 h-18 Z M282 210 l9 22 h-18 Z',
      fill: MAP_COLORS.forest,
      opacity: 0.35,
    },
  ],
  hotspots: [
    {
      id: 'estacao',
      n: 1,
      x: 180,
      y: 648,
      kind: 'station',
      label: 'Estação JR Inari',
      side: 'right',
      title: 'Estação JR Inari',
      jp: '稲荷駅',
      facts: 'JR Nara Line · **5 min** da Estação de Kyoto · ¥150',
      paragraphs: [
        'A estação é de **1879** e é uma das mais antigas do Japão em funcionamento — ela nasceu junto com a segunda ferrovia do país, entre Kyoto e Osaka. O prédio atual é uma homenagem ao santuário: vermelho, com lanternas.',
        'Vocês saem da plataforma e o primeiro torii está literalmente do outro lado da rua. Alternativa: **Keihan Fushimi-Inari**, 5 minutos a pé, útil se estiverem vindo do centro pelo lado do rio.',
      ],
    },
    {
      id: 'barracas',
      n: 2,
      x: 258,
      y: 612,
      kind: 'food',
      label: 'Barracas da alameda',
      side: 'left',
      title: 'As barracas da alameda',
      facts: 'Entre a estação e o portão · a maioria fecha ~17:00',
      paragraphs: [
        'Antes de entrar, a rua é uma fileira de barracas. Duas coisas aqui são específicas deste santuário: o **pardal grelhado** (*suzume no yakitori*) e a codorna. A explicação é agrícola — pardal come arroz, e o arroz é de Inari; comer o pardal era, na origem, proteger a colheita. É pequeno, salgado e crocante, e sim, come-se inteiro.',
        'Menos radical e igualmente típico: o **inari-zushi**, bolinho de arroz dentro de tofu frito adocicado, que leva esse nome porque o tofu frito é a comida favorita das raposas. E o **tsujiura senbei**, biscoito dobrado com um papelzinho de sorte dentro — a origem japonesa do biscoito da sorte, que emigrou para a Califórnia com padeiros japoneses no começo do século XX e virou "chinês" por lá.',
      ],
    },
    {
      id: 'romon',
      n: 3,
      x: 172,
      y: 588,
      kind: 'gate',
      label: 'Ichi-no-torii e Rōmon',
      side: 'right',
      title: 'Ichi-no-torii e o Rōmon',
      jp: '楼門',
      facts: 'O portão de dois andares, logo depois do torii de entrada',
      paragraphs: [
        'O **Rōmon** é de **1589** e foi doado por **Toyotomi Hideyoshi** — o homem que unificou o Japão. A versão registrada é que ele prometeu o portão se a mãe, gravemente doente, se recuperasse. É um dos maiores portões de santuário do país.',
        'Aqui começa a etiqueta: passem por baixo do torii **pelas laterais**, nunca pelo meio, que é o caminho do kami. No *temizuya* à direita, água na mão esquerda, depois na direita, depois um gole na mão (não na concha) e enxaguar o cabo.',
      ],
    },
    {
      id: 'kitsune',
      n: 4,
      x: 150,
      y: 546,
      kind: 'fox',
      label: 'As raposas de pedra',
      side: 'left',
      title: 'As raposas de pedra (kitsune)',
      jp: '狐',
      facts: 'Em pares, guardando cada portão e cada altar',
      paragraphs: [
        '**A raposa não é o deus.** Ela é a mensageira de Inari — *byakko*, a raposa branca, considerada invisível. Estão sempre em par, uma de cada lado, e a graça é reparar no que cada uma **segura na boca**, porque isso muda de estátua para estátua:',
        '**A chave** — do celeiro de arroz; é o objeto mais comum aqui e o mais direto: quem controla o celeiro controla a riqueza. **O feixe de espigas** — o arroz, a função original do deus. **A joia** (*nyoi-hōju*, a esfera com chama no topo) — o espírito de Inari e o poder de realizar desejos. **O pergaminho** — o saber, o segredo transmitido.',
        'Existem milhares delas na montanha, doadas em agradecimento como os torii. As mais velhas estão cobertas de musgo e são as mais bonitas de fotografar ao anoitecer, quando as lanternas acendem.',
      ],
    },
    {
      id: 'honden',
      n: 5,
      x: 178,
      y: 505,
      kind: 'hall',
      label: 'Honden',
      side: 'right',
      title: 'Honden — o salão principal',
      jp: '本殿',
      facts: 'De **1499** · Bem Cultural Importante · aberto 24h, grátis',
      paragraphs: [
        'O santuário foi fundado em **711** no alto da montanha. O prédio que vocês veem é de **1499**: o anterior foi queimado em 1468, durante a **Guerra Ōnin**, a guerra civil que destruiu boa parte de Kyoto e abriu o século e meio dos estados combatentes.',
        'O estilo é *nagare-zukuri*, com o telhado assimétrico que se prolonga sobre a escada da frente. Inari começou como deus do arroz; quando o Japão se comercializou, arroz virou dinheiro e Inari virou o **deus dos negócios** — por isso as doações vêm quase todas de empresas.',
        'Ritual: moeda na caixa, **duas reverências, duas palmas, uma reverência**. Pedido entre as palmas e a última reverência.',
      ],
    },
    {
      id: 'senbon',
      n: 6,
      x: 208,
      y: 464,
      kind: 'torii',
      label: 'Senbon Torii',
      side: 'left',
      title: 'Senbon Torii — os mil portões',
      jp: '千本鳥居',
      facts: 'Logo atrás do salão principal · o trecho mais fotografado do Japão',
      paragraphs: [
        'Aqui o caminho **se divide em dois túneis paralelos e bem estreitos**. Não é decoração de fotografia: é mão dupla — sobe-se pelo da direita e desce-se pelo da esquerda. Os dois se reencontram poucos metros adiante.',
        'Cada torii é um **recibo**. Foi doado por uma pessoa ou empresa em agradecimento por um pedido atendido, e o **nome do doador e a data estão pintados na coluna de trás** — por isso vocês só enxergam a escrita **ao descer**. O costume começou no período Edo. Um torii pequeno sai hoje por volta de ¥400.000; um grande passa de um milhão. São cerca de **10.000** na montanha inteira.',
        'Se quiserem a foto sem gente: sigam subindo. Depois do ponto 7 o fluxo cai a quase nada, e os corredores continuam iguais.',
      ],
    },
    {
      id: 'omokaru',
      n: 7,
      x: 158,
      y: 404,
      kind: 'stone',
      label: 'Okusha e a pedra',
      side: 'right',
      title: 'Okusha Hōhaisho e a omokaru-ishi',
      jp: '奥社奉拝所 · おもかる石',
      facts: 'Fim do Senbon Torii · lanternas de pedra à direita do altar',
      paragraphs: [
        'Este é o ponto onde a maioria dos turistas dá meia-volta, e é onde a montanha começa de verdade. É também onde ficam os **ema em forma de cara de raposa**: vocês compram a plaquinha em branco e desenham o rosto — cada um fica diferente, e a parede deles é ótima.',
        'À direita, duas lanternas de pedra com uma esfera solta no topo: a **omokaru-ishi**, a "pedra pesada-leve". Façam o pedido, e então levantem a esfera. **Se ela parecer mais leve do que vocês esperavam, o pedido se realiza**; mais pesada, vai custar. É um oráculo de expectativa, não de força — e por isso ele funciona tão bem.',
      ],
    },
    {
      id: 'shinike',
      n: 8,
      x: 200,
      y: 292,
      kind: 'water',
      label: 'Shin-ike, a lagoa do eco',
      side: 'left',
      title: 'Shin-ike — a lagoa do eco',
      jp: '新池 · こだまヶ池',
      facts: 'Meio caminho até o Yotsutsuji · à direita da trilha',
      paragraphs: [
        'A lagoa também é chamada **Kodama-ga-ike**, "a lagoa do eco". A crença local é bem específica: quem perdeu contato com alguém deve vir aqui, **bater palmas de frente para a água** — e a direção de onde o eco voltar é a direção em que a pessoa deve ser procurada.',
        'Ao lado fica o **Kumataka-sha**, um dos muitos pequenos altares particulares espalhados pela montanha. Do outro lado da água há um mirante baixo que rende a foto de fim de tarde com o vermelho refletido.',
      ],
    },
    {
      id: 'yotsutsuji',
      n: 9,
      x: 148,
      y: 226,
      kind: 'view',
      label: 'Yotsutsuji — a vista',
      side: 'right',
      title: 'Yotsutsuji — o cruzamento da vista',
      jp: '四ツ辻',
      facts: '**30–45 min** do portão · duas casas de chá · vista de Kyoto',
      paragraphs: [
        'O ponto de retorno certo. Daqui se vê **Kyoto inteira** — e às 16h45, em novembro, é quando o sol cai atrás das montanhas do oeste e a cidade acende. Vale sentar numa das duas casas de chá com um amazake quente.',
        'Aqui a trilha vira um **anel**: dá para dar a volta pelo topo e retornar a este mesmo ponto (uns 45 min). Se estiverem cansados, descer daqui não é desistir — 90% de quem chega ao Yotsutsuji faz exatamente isso.',
      ],
    },
    {
      id: 'cume',
      n: 10,
      x: 166,
      y: 90,
      kind: 'peak',
      label: 'Ichi-no-mine, o cume',
      side: 'left',
      title: 'Ichi-no-mine — o cume, 233 m',
      jp: '一ノ峰',
      facts: '~2h ida e volta desde o portão · sem vista no topo',
      paragraphs: [
        'Aviso honesto: **o cume não tem vista**. É uma clareira com um altar e centenas de mini-torii doados, cercada de árvores. Quem sobe esperando panorama desce decepcionado.',
        'O sentido é outro: **a montanha inteira é o objeto de culto**, não o prédio lá embaixo. Fushimi Inari não tem um "dentro" — tem uma subida. Os três picos (Ichi-no-mine, Ni-no-mine, San-no-mine) são os três kami, e o caminho entre eles é atravessado por altares particulares, alguns com velas acesas, praticamente sozinho depois das 17h.',
        'Se subirem, levem lanterna do celular — o trecho acima do Yotsutsuji é iluminado, mas fraco.',
      ],
    },
  ],
  legend: 'Linha clara = caminho de pedra · linha vermelha tracejada = túnel de torii · verde = mata da montanha Inari',
};

export const PLACE_MAPS: PlaceMap[] = [fushimiInari];

export const placeMapById = (id: string): PlaceMap | undefined =>
  PLACE_MAPS.find((m) => m.id === id);

export const placeMapByStopId = (stopId: string): PlaceMap | undefined =>
  PLACE_MAPS.find((m) => m.stopId === stopId);

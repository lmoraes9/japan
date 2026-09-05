/**
 * Mapas ilustrados de lugares — SVG desenhado à mão, esquemático (não é escala
 * geográfica), com pontos clicáveis que abrem a explicação e a história.
 */

export type HotspotKind =
  | 'gate'
  | 'temple'
  | 'hall'
  | 'fox'
  | 'torii'
  | 'stone'
  | 'water'
  | 'view'
  | 'peak'
  | 'station'
  | 'food';

/** foto de licença livre baixada por scripts/fetch-place-photos.mjs */
export interface PlacePhoto {
  /** caminho em /public */
  src: string;
  credit: string;
  license: string;
  /** página do arquivo no Wikimedia Commons */
  source: string;
  title: string;
}

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
  /** legenda da foto, quando ela existir */
  photoCaption?: string;
  /** busca no Google Maps para o botão Navegar; padrão: título + nome do lugar */
  mapQuery?: string;
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

export interface Tree {
  x: number;
  y: number;
  /** altura aproximada, em unidades do viewBox */
  s: number;
}

export interface PlaceMap {
  id: string;
  /** ponto cuja foto vira a capa do mapa (hero da página e card no hub) */
  coverHotspotId: string;
  /** stop do roteiro a que este mapa pertence */
  stopId: string;
  dayId: string;
  title: string;
  jp: string;
  subtitle: string;
  intro: string[];
  viewBox: string;
  scenery: SceneryShape[];
  /** árvores desenhadas com o símbolo do componente (mais bonitas que triângulos) */
  trees?: Tree[];
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
  coverHotspotId: 'senbon',
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
    // torii de entrada, desenhado
    {
      d: 'M104 606 L104 578 M148 606 L148 578 M94 580 L158 580 M98 570 C114 566 138 566 154 570 L154 574 C138 570 114 570 98 574 Z',
      stroke: MAP_COLORS.vermilion,
      width: 3.5,
      opacity: 0.9,
      round: true,
    },
    // telhado do salão principal
    {
      d: 'M96 502 L124 490 L152 502 M102 502 L102 518 L146 518 L146 502',
      stroke: MAP_COLORS.ink,
      width: 2.5,
      opacity: 0.45,
      round: true,
    },
    // lanterna de pedra do okusha
    {
      d: 'M104 430 l6 -6 6 6 M106 430 l0 8 l8 0 l0 -8 M110 438 l0 8 M104 446 l12 0',
      stroke: MAP_COLORS.ink,
      width: 2,
      opacity: 0.45,
      round: true,
    },
  ],
  trees: [
    { x: 64, y: 492, s: 22 },
    { x: 92, y: 528, s: 20 },
    { x: 52, y: 570, s: 24 },
    { x: 290, y: 522, s: 22 },
    { x: 312, y: 572, s: 20 },
    { x: 268, y: 616, s: 24 },
    { x: 96, y: 402, s: 22 },
    { x: 286, y: 424, s: 22 },
    { x: 74, y: 262, s: 22 },
    { x: 282, y: 232, s: 22 },
  ],
  hotspots: [
    {
      id: 'estacao',
      photoCaption: 'A estação, em vermelho de santuário, do outro lado da rua do primeiro torii.',
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
      photoCaption: 'A alameda de barracas entre a estação e o portão.',
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
      photoCaption: 'O Rōmon de 1589, doado por Hideyoshi.',
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
      photoCaption: 'Reparem no que a raposa segura na boca.',
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
      photoCaption: 'O salão principal, reconstruído em 1499.',
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
      photoCaption: 'O corredor duplo do Senbon Torii, logo atrás do salão.',
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
      photoCaption: 'A omokaru-ishi: a esfera de pedra no topo da lanterna.',
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
      photoCaption: 'A lagoa do eco, no meio da subida.',
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
      photoCaption: 'A vista de Kyoto do Yotsutsuji, no fim da tarde.',
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
      photoCaption: 'O cume: uma clareira de mini-torii, sem vista.',
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

const sensoji: PlaceMap = {
  id: 'sensoji',
  coverHotspotId: 'kaminarimon',
  stopId: 'd19-sensoji',
  dayId: 'd2026-11-19',
  title: 'Sensō-ji',
  jp: '浅草寺',
  subtitle: 'O eixo do templo mais antigo de Tóquio, do Kaminarimon ao salão principal',
  intro: [
    'O templo é um **eixo reto**: portão, rua de lojas, segundo portão, salão principal. Tudo que importa está nessa linha ou a poucos passos dela. Toquem nos pontos para ver o que é cada coisa.',
    'Vocês chegam **às 06:30**, e isso muda tudo: o recinto é **aberto 24h**, a Nakamise ainda está fechada e vocês vão ter o Kaminarimon e o salão praticamente sozinhos. As lojas abrem por volta das 09:00 — se quiserem comprar, o dia 2/12 volta aqui.',
  ],
  viewBox: '0 140 360 500',
  scenery: [
    { d: 'M36 150 L324 150 L324 630 L36 630 Z', fill: MAP_COLORS.forest, opacity: 0.07 },
    // eixo do templo (sandō)
    { d: 'M180 616 L180 210', stroke: MAP_COLORS.muted, width: 26, opacity: 0.22, round: true },
    // lojas dos dois lados da Nakamise
    { d: 'M154 570 L154 468 M206 570 L206 468', stroke: MAP_COLORS.gold, width: 7, dash: '9 6', opacity: 0.55 },
    // muro do recinto interno
    { d: 'M64 170 L296 170 L296 410 L64 410 Z', stroke: MAP_COLORS.ink, width: 1.5, opacity: 0.18 },
    // Kaminarimon
    { d: 'M156 616 L156 592 M204 616 L204 592 M146 594 L214 594 M150 584 C166 580 194 580 210 584 L210 588 C194 584 166 584 150 588 Z', stroke: MAP_COLORS.vermilion, width: 3.5, opacity: 0.9, round: true },
    // Hōzōmon
    { d: 'M158 452 L158 432 M202 452 L202 432 M150 434 L210 434', stroke: MAP_COLORS.vermilion, width: 3, opacity: 0.75, round: true },
    // salão principal
    { d: 'M126 236 C150 208 210 208 234 236 M136 236 L136 274 L224 274 L224 236', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.45, round: true },
    // pagode de cinco andares
    { d: 'M100 340 l0 -16 M88 324 l24 0 M92 312 l16 0 M88 300 l24 0 M92 288 l16 0 M100 288 l0 -12', stroke: MAP_COLORS.vermilion, width: 2.5, opacity: 0.7, round: true },
  ],
  trees: [
    { x: 50, y: 322, s: 22 },
    { x: 320, y: 362, s: 22 },
    { x: 52, y: 440, s: 20 },
    { x: 324, y: 480, s: 20 },
    { x: 44, y: 580, s: 20 },
  ],
  hotspots: [
    {
      id: 'kaminarimon',
      photoCaption: 'A lanterna de 700 kg do Kaminarimon, o cartão-postal de Asakusa.',
      n: 1,
      x: 180,
      y: 600,
      kind: 'gate',
      label: 'Kaminarimon',
      side: 'right',
      title: 'Kaminarimon — o portão do trovão',
      jp: '雷門',
      facts: 'A lanterna tem **3,9 m e ~700 kg** · aberto 24h',
      paragraphs: [
        'Nos dois nichos da frente estão **Fūjin, o deus do vento** (à direita, com o saco de ventos nas costas) e **Raijin, o deus do trovão** (à esquerda, com o anel de tambores). São eles que dão nome ao portão, e a função deles é meteorológica: proteger a cidade de tempestade e incêndio. Deu errado várias vezes — o portão queimou repetidamente.',
        'O portão atual é de **1960**, e quem pagou foi **Konosuke Matsushita**, o fundador da Panasonic. Ele se tratava de uma doença grave, rezou aqui, se recuperou e doou o portão e a lanterna. Por isso o nome "Matsushita Denki" está impresso no pé da lanterna — olhem por baixo dela ao passar: tem um **dragão esculpido em madeira** na base.',
      ],
    },
    {
      id: 'nakamise',
      photoCaption: 'A Nakamise-dōri, 250 metros de lojas até o segundo portão.',
      n: 2,
      x: 180,
      y: 520,
      kind: 'food',
      label: 'Nakamise-dōri',
      side: 'right',
      title: 'Nakamise-dōri — a rua de lojas',
      jp: '仲見世通り',
      facts: '**250 m · ~90 lojas** · abrem ~09:00–19:00 (às 6h30 estará fechada)',
      paragraphs: [
        'Uma das ruas comerciais mais antigas do Japão. No fim do século XVII, vizinhos que ajudavam a limpar o recinto do templo ganharam em troca o direito de vender ali — e nunca mais saíram. As lojas passam de geração em geração há mais de trezentos anos.',
        'O que vale comer: **ningyō-yaki** (bolinhos de massa recheados de feijão doce, assados na hora em formas de boneco), **age-manjū** (o manjū frito) e **kaminari-okoshi**, o doce crocante de arroz tufado que é a lembrança clássica daqui. Comam ali mesmo, na frente da loja — na rua não se come andando.',
        'Às 6h30 as portas de aço estão baixadas, e elas têm **pinturas das quatro estações** — a rua fechada é bonita de um jeito que a rua aberta não é.',
      ],
    },
    {
      id: 'hozomon',
      photoCaption: 'O Hōzōmon e as sandálias de palha penduradas atrás.',
      n: 3,
      x: 180,
      y: 440,
      kind: 'gate',
      label: 'Hōzōmon',
      side: 'right',
      title: 'Hōzōmon — o portão do tesouro',
      jp: '宝蔵門',
      facts: 'Dois andares · o de cima guarda sutras do século XIV',
      paragraphs: [
        'O nome é literal: o andar de cima é um **depósito de tesouro**, e guarda uma cópia do Sutra do Lótus da dinastia chinesa Song, tesouro nacional, que ninguém vê. Embaixo, dois **Niō** — os guardiões musculosos com cara de bravos, um de boca aberta ("a") e outro de boca fechada ("un"), o começo e o fim de tudo.',
        'Deem a volta e olhem a **parede de trás**: penduradas ali estão duas **sandálias de palha gigantes** (*waraji*), de 4,5 metros e 400 kg cada, trançadas por moradores de uma vila de Yamagata e trocadas a cada dez anos. A ideia é que um demônio que veja o tamanho do pé de quem mora ali desista de entrar.',
      ],
    },
    {
      id: 'pagode',
      photoCaption: 'O pagode de cinco andares, à esquerda de quem sobe.',
      n: 4,
      x: 100,
      y: 340,
      kind: 'view',
      label: 'Pagode',
      side: 'left',
      title: 'O pagode de cinco andares',
      jp: '五重塔',
      facts: '**53 m** · reconstruído em 1973 · fechado à visitação',
      paragraphs: [
        'O primeiro pagode aqui é de **942**. Este é de 1973, em concreto, depois que o bombardeio incendiário de março de 1945 destruiu quase tudo no recinto — e ele foi remontado do outro lado do eixo, não onde estava.',
        'No andar mais alto estão **relíquias do Buda vindas do Sri Lanka**, doadas em 1966. Os cinco andares dos pagodes japoneses são os cinco elementos: terra, água, fogo, vento e vazio, de baixo para cima.',
      ],
    },
    {
      id: 'jokoro',
      photoCaption: 'O incensário: a fumaça vai para onde dói.',
      n: 5,
      x: 180,
      y: 350,
      kind: 'stone',
      label: 'Jōkōrō',
      side: 'right',
      title: 'Jōkōrō — o caldeirão de incenso',
      jp: '常香炉',
      facts: 'No meio do pátio, antes da escada do salão',
      paragraphs: [
        'Compram-se os bastões (¥100), acendem-se, e então vem a parte que todo mundo faz sem saber por quê: **puxa-se a fumaça com a mão para a parte do corpo que precisa de cura**. Cabeça para estudar melhor, joelho que dói, ombro cansado. É um gesto de saúde, não de purificação.',
        'Regra prática: acender no seu próprio isqueiro, nunca no bastão de outra pessoa (transfere o azar), e apagar a chama abanando, nunca soprando.',
      ],
    },
    {
      id: 'omikuji',
      photoCaption: 'As gavetinhas do omikuji e a grade onde se amarra o azar.',
      n: 6,
      x: 272,
      y: 300,
      kind: 'stone',
      label: 'Omikuji',
      side: 'left',
      title: 'Omikuji — a sorte mais dura do Japão',
      jp: 'おみくじ',
      facts: '¥100 · tem texto em inglês · à direita do salão',
      paragraphs: [
        'O ritual: ¥100 na caixa, chacoalhar o cilindro de metal, sair um palito com um número, abrir a gaveta daquele número e ler o papel.',
        'O detalhe famoso: o Sensō-ji mantém a **proporção antiga**, e por isso cerca de **30% dos papéis são 凶 (kyō), "azar"** — muito mais que na maioria dos templos, que suavizaram o baralho para não desagradar o turista. Se tirarem azar, não é problema: **amarrem o papel na grade de metal ali do lado** e o azar fica no templo, não vai com vocês. Se tirar sorte, leva no bolso.',
      ],
    },
    {
      id: 'hondo',
      photoCaption: 'O salão principal; o teto tem dragões pintados.',
      n: 7,
      x: 180,
      y: 250,
      kind: 'hall',
      label: 'Hondō',
      side: 'right',
      title: 'Hondō — o salão principal',
      jp: '本堂',
      facts: '**06:00–17:00** (o pátio é 24h) · grátis',
      paragraphs: [
        'A lenda de fundação é de **628**: dois irmãos pescadores puxaram do rio Sumida uma estatueta dourada de **Kannon** presa na rede. Jogaram de volta; ela reapareceu. O chefe da aldeia converteu a própria casa em templo, e em 645 um monge construiu o santuário definitivo — o que faz do Sensō-ji **o templo mais antigo de Tóquio**, mais velho que a cidade em quase mil anos.',
        'E a estátua **ninguém nunca viu**. Ela é *hibutsu*, "buda oculto": fica lacrada, e nem os monges a contemplam. Uma inspeção do governo em 1869 concluiu que existe alguma coisa lá dentro, sem descrevê-la. O que se mostra ao público, uma vez por ano, é uma cópia.',
        'O prédio é de **1958**: o original, de 1649, virou cinza no bombardeio de 10 de março de 1945, a noite mais mortal da guerra em Tóquio. **Olhem para cima** ao entrar — o teto tem dois dragões e uma pintura de anjos celestiais.',
      ],
    },
    {
      id: 'asakusa-jinja',
      photoCaption: 'O santuário xintoísta ao lado, de 1649 — este sobreviveu à guerra.',
      n: 8,
      x: 272,
      y: 195,
      kind: 'torii',
      label: 'Asakusa-jinja',
      side: 'left',
      title: 'Asakusa-jinja — o santuário ao lado',
      jp: '浅草神社',
      facts: 'À direita do salão principal · de **1649**, original',
      paragraphs: [
        'Este prédio **não queimou em 1945**: é um dos poucos originais do período Edo em pé no recinto, construído pelo terceiro xogum Tokugawa Iemitsu. Passa quase despercebido entre os turistas, e é o edifício mais antigo que vocês vão ver aqui.',
        'Ele é xintoísta, dentro de um templo budista — a mistura era a regra no Japão até o governo Meiji separar as duas religiões à força em 1868. Os três kami venerados são os **dois pescadores e o chefe da aldeia** da lenda: gente comum promovida a divindade. A festa deles, o **Sanja Matsuri**, em maio, é a maior de Tóquio, com dois milhões de pessoas.',
      ],
    },
    {
      id: 'nitenmon',
      photoCaption: 'O Nitenmon, de 1618, à direita do recinto.',
      n: 9,
      x: 272,
      y: 380,
      kind: 'gate',
      label: 'Nitenmon',
      side: 'left',
      title: 'Nitenmon — o portão que escapou',
      jp: '二天門',
      facts: 'De **1618** · Bem Cultural Importante · saída leste',
      paragraphs: [
        'Mais um sobrevivente: construído em 1618 como portão do santuário Tōshō-gū que existia aqui, passou pelos incêndios de Edo, pelo terremoto de 1923 e pela guerra. É a estrutura mais antiga do recinto.',
        'Se saírem por aqui, caem direto no lado do rio e do **Sumida Park** — e é o caminho curto para a vista da Skytree com a margem do Sumida na frente.',
      ],
    },
    {
      id: 'hoppy',
      photoCaption: 'Hoppy Street: mesas na calçada e panela de cozido o dia inteiro.',
      n: 10,
      x: 86,
      y: 480,
      kind: 'food',
      label: 'Hoppy Street',
      side: 'right',
      title: 'Hoppy Street e o Asakusa que come',
      jp: 'ホッピー通り',
      facts: 'Oeste do templo · muitas mesas abrem **ao meio-dia**',
      paragraphs: [
        'Duas quadras a oeste do templo, uma rua inteira de botecos com mesa na calçada. O nome vem do **Hoppy**, uma bebida de malte quase sem álcool dos anos 1940, criada quando cerveja era caríssima: mistura-se com shōchū e sai um copo barato. Ainda se pede assim, "hoppy set".',
        'A comida é *nikomi* — cozido de miúdos e tofu fervendo desde de manhã — e espetinhos. Não é a parada do dia 19 de manhã, mas fica anotado: no dia **2/12**, quando voltarem a Asakusa, é aqui que se almoça sem reserva e sem cerimônia.',
      ],
    },
  ],
  legend: 'Faixa cinza = o eixo do templo · pontilhado dourado = as lojas da Nakamise · linhas finas = o muro do recinto',
};

const miyajima: PlaceMap = {
  id: 'miyajima',
  coverHotspotId: 'otorii',
  stopId: 'd24-itsukushima',
  dayId: 'd2026-11-24',
  title: 'Miyajima',
  jp: '宮島 · 厳島',
  subtitle: 'Da balsa ao cume do Monte Misen, na ordem em que a ilha se abre',
  intro: [
    'A ilha se percorre **da água para cima**: balsa, torii, santuário sobre o mar, depois os templos da encosta e o monte. Toquem nos pontos para ver o que é cada coisa.',
    '**A maré decide o dia.** Com maré alta o torii e o santuário ficam boiando; com maré baixa dá para caminhar até a base do torii. Os dois valem, são programas diferentes — confiram a tabela de marés na véspera e organizem a ordem do dia por ela.',
  ],
  viewBox: '0 160 360 480',
  scenery: [
    // mar
    { d: 'M0 640 L360 640 L360 470 L0 470 Z', fill: MAP_COLORS.water, opacity: 0.22 },
    { d: 'M0 520 C60 512 120 528 180 520 C240 512 300 528 360 520', stroke: MAP_COLORS.water, width: 1.5, opacity: 0.35 },
    { d: 'M0 600 C60 592 120 608 180 600 C240 592 300 608 360 600', stroke: MAP_COLORS.water, width: 1.5, opacity: 0.3 },
    // montanha
    { d: 'M0 470 L54 330 L110 396 L188 180 L246 300 L300 246 L360 372 L360 470 Z', fill: MAP_COLORS.forest, opacity: 0.18 },
    // caminho da orla até o cume
    { d: 'M104 470 L206 470 C252 468 264 444 250 418 C238 390 210 384 202 356 C194 326 222 310 234 288 C248 262 206 240 192 222', stroke: MAP_COLORS.muted, width: 12, opacity: 0.3, round: true },
    // teleférico
    { d: 'M240 292 L200 216', stroke: MAP_COLORS.ink, width: 1.5, dash: '5 5', opacity: 0.45 },
    // o grande torii, na água
    { d: 'M126 566 L126 518 M174 566 L174 518 M114 522 L186 522 M118 506 C138 500 162 500 182 506 L182 512 C162 506 138 506 118 512 Z', stroke: MAP_COLORS.vermilion, width: 4, opacity: 0.95, round: true },
    // corredores do santuário sobre a água
    { d: 'M198 486 L292 486 M208 486 L208 502 M234 486 L234 502 M262 486 L262 502 M288 486 L288 502', stroke: MAP_COLORS.vermilion, width: 2.5, opacity: 0.7, round: true },
  ],
  trees: [
    { x: 56, y: 452, s: 22 },
    { x: 96, y: 468, s: 20 },
    { x: 312, y: 446, s: 22 },
    { x: 116, y: 352, s: 22 },
    { x: 296, y: 362, s: 22 },
    { x: 60, y: 282, s: 22 },
  ],
  hotspots: [
    {
      id: 'balsa',
      photoCaption: 'A balsa da JR cruzando para a ilha.',
      n: 1,
      x: 90,
      y: 600,
      kind: 'station',
      label: 'A balsa',
      side: 'right',
      title: 'A balsa para a ilha',
      jp: '宮島フェリー',
      facts: '**10 min** · ¥200 · duas empresas saem do mesmo cais · **+¥100** de taxa de visitante',
      paragraphs: [
        'Peguem a **da JR**: em algumas travessias do dia ela faz um desvio e passa perto do grande torii, o que a outra empresa não faz. Sentem-se do lado direito na ida.',
        'Desde 2023 há uma **taxa de visitante de ¥100** por pessoa, cobrada junto com a passagem — é para a manutenção da ilha. Guardem o comprovante.',
      ],
    },
    {
      id: 'otorii',
      photoCaption: 'O grande torii: com maré alta parece flutuar.',
      n: 2,
      x: 150,
      y: 575,
      kind: 'torii',
      label: 'O grande torii',
      side: 'right',
      title: 'O-torii — o portão sobre a água',
      jp: '大鳥居',
      facts: '**16,6 m** de altura · cânfora · o atual é de **1875**',
      paragraphs: [
        'A parte que quase ninguém sabe: **ele não está enterrado**. O torii fica em pé apenas pelo **próprio peso**, cerca de 60 toneladas, sobre uma base de pedras soltas no fundo do mar. As duas colunas principais são troncos inteiros de cânfora com mais de 500 anos, e levaram décadas para serem encontrados quando a última reconstrução precisou deles.',
        'Os quatro pés menores nas laterais são estabilizadores, e a travessa de cima é **oca e cheia de pedras** — lastro para segurar contra o tufão. A grande restauração de 2019–2022 tirou o portão de cena por três anos; vocês o pegam recém-restaurado.',
        'Com **maré baixa** dá para caminhar até a base e tocar a madeira; procurem as moedas que as pessoas enfiam nas fendas. Com **maré alta** ele fica no meio da água, e ao anoitecer é iluminado.',
      ],
    },
    {
      id: 'itsukushima',
      photoCaption: 'Os corredores do santuário, construídos sobre a água.',
      n: 3,
      x: 250,
      y: 490,
      kind: 'hall',
      label: 'Santuário',
      side: 'right',
      title: 'Itsukushima-jinja — o santuário sobre o mar',
      jp: '厳島神社',
      facts: '**06:30–18:00** · ¥300 · Patrimônio Mundial',
      paragraphs: [
        'A forma atual é de **1168**, obra de **Taira no Kiyomori**, o guerreiro que virou o homem mais poderoso do Japão e escolheu esta ilha como santuário da família. São 300 metros de corredores de madeira sobre estacas, pintados de vermelhão.',
        'Por que sobre a água? Porque **a ilha inteira era o kami**. Pisar nela era profanar o sagrado, então o santuário foi construído sobre o mar, na faixa entre a terra e a água, para que os fiéis pudessem chegar de barco sem tocar o solo. A regra durou séculos: **era proibido nascer e morrer na ilha**; grávidas e doentes graves eram levados para o continente, e até 1878 não havia cemitério aqui.',
        'O piso tem frestas de propósito: quando a maré de tufão sobe, a água entra por baixo e alivia a pressão em vez de arrancar o assoalho. O prédio é projetado para ser inundado.',
      ],
    },
    {
      id: 'senjokaku',
      photoCaption: 'O salão inacabado de Hideyoshi e o pagode de cinco andares.',
      n: 4,
      x: 280,
      y: 420,
      kind: 'hall',
      label: 'Senjōkaku',
      side: 'left',
      title: 'Senjōkaku — o salão de mil tatames',
      jp: '豊国神社 千畳閣',
      facts: '**08:30–16:30** · ¥100 · o pagode ao lado é de **1407**',
      paragraphs: [
        'Toyotomi Hideyoshi mandou construir este salão gigante em **1587** para recitar sutras pelos mortos das suas guerras. Ele morreu em 1598 e a obra **parou no mesmo dia**: o teto nunca foi fechado, as paredes nunca foram levantadas. O que existe é um esqueleto de madeira aberto para os quatro lados — e é justamente por isso que é o lugar mais bonito e mais vazio da ilha.',
        'Tirem os sapatos, sentem-se na beirada de madeira e olhem o mar entre as colunas. Ao lado fica o **pagode de cinco andares de 1407**, de 27 metros, com estilo japonês por fora e chinês por dentro.',
      ],
    },
    {
      id: 'cervos',
      photoCaption: 'Os cervos da ilha, mais discretos que os de Nara.',
      n: 5,
      x: 150,
      y: 460,
      kind: 'fox',
      label: 'Os cervos',
      side: 'right',
      title: 'Os cervos de Miyajima',
      facts: 'Soltos por toda a orla · **não se alimenta** aqui',
      paragraphs: [
        'Como em Nara, são considerados mensageiros dos deuses, mas o regime é outro: em Miyajima **é proibido alimentá-los** desde 2008, e por isso eles são bem menos insistentes que os de Nara — vão passar ao lado de vocês sem parar.',
        'O que eles fazem é **comer papel**. Mapa no bolso de trás, ingresso na mão, saco de compras aberto: some. Guardem tudo antes de sacar a câmera.',
      ],
    },
    {
      id: 'daishoin',
      photoCaption: 'A escadaria do Daishō-in, com os cilindros de sutra no corrimão.',
      n: 6,
      x: 250,
      y: 380,
      kind: 'temple',
      label: 'Daishō-in',
      side: 'left',
      title: 'Daishō-in — o templo que quase ninguém sobe',
      jp: '大聖院',
      facts: '**08:00–17:00** · grátis · 10 min de subida do santuário',
      paragraphs: [
        'O templo budista mais importante da ilha, do ramo **Shingon**, fundado segundo a tradição por **Kūkai em 806**, ao voltar da China. A maioria dos turistas vai embora depois do torii e nunca chega aqui — o que é sorte de quem chega.',
        'Na escadaria de entrada, o corrimão é uma fileira de **cilindros de metal com sutras gravados**: girem todos ao subir, e conta como ter lido as escrituras inteiras. Adiante está a **Henjōkutsu**, uma caverna artificial iluminada por 88 lanternas, uma para cada templo da peregrinação de Shikoku — percorrer os 50 metros equivale a fazer os 1.200 km.',
        'E há as **500 estátuas de rakan** subindo a encosta, cada uma com um rosto diferente, muitas com gorro de tricô colocado pelos moradores. É o lugar mais estranho e mais humano da ilha.',
      ],
    },
    {
      id: 'momijidani',
      photoCaption: 'O vale dos bordos, no caminho do teleférico.',
      n: 7,
      x: 200,
      y: 330,
      kind: 'view',
      label: 'Momijidani',
      side: 'right',
      title: 'Momijidani — o vale dos bordos',
      jp: '紅葉谷公園',
      facts: 'Entre o santuário e o teleférico · **pico da folhagem: novembro**',
      paragraphs: [
        'Cerca de 200 bordos plantados num vale estreito com um riacho no meio. **Vocês chegam no dia 24 de novembro, que é o pico estatístico da folhagem aqui** — é a razão pela qual este dia está no roteiro nesta data.',
        'Foi este vale que deu origem ao **momiji manjū**, o bolinho em forma de folha de bordo recheado de feijão doce, criado por volta de 1906 numa hospedaria daqui. A versão frita, *age-momiji*, é outro nível.',
      ],
    },
    {
      id: 'teleferico',
      photoCaption: 'O teleférico sobre a floresta primária.',
      n: 8,
      x: 240,
      y: 280,
      kind: 'station',
      label: 'Teleférico',
      side: 'left',
      title: 'O teleférico do Misen',
      jp: '宮島ロープウエー',
      facts: '**09:00–17:00** · ¥2.000 ida e volta · duas trocas de cabine',
      paragraphs: [
        'Sobe em duas etapas e deixa vocês na estação Shishiiwa. **Atenção ao horário da última descida**: costuma ser por volta das 16:30–17:00 e não espera ninguém; quem perde desce a pé, o que leva mais de uma hora na escuridão.',
        'A floresta que passa debaixo da cabine **nunca foi cortada** — é mata primária protegida desde que a ilha virou sagrada, e é parte da inscrição na Unesco.',
      ],
    },
    {
      id: 'misen',
      photoCaption: 'O cume do Misen, com vista das ilhas do Mar Interior.',
      n: 9,
      x: 190,
      y: 210,
      kind: 'peak',
      label: 'Cume do Misen',
      side: 'right',
      title: 'Monte Misen — 535 m',
      jp: '弥山',
      facts: '**+30 min de caminhada** da estação do teleférico até o cume real',
      paragraphs: [
        'O teleférico **não chega ao topo**: da estação final ainda são 30 minutos de trilha com escada e pedra solta. Quem faz, ganha a vista de 360° sobre as ilhas do Mar Interior de Seto — e no caminho passa por rochas gigantes empilhadas de um jeito improvável, objeto de culto desde antes do budismo.',
        'No **Reikadō**, a sala da chama, arde um fogo que a tradição diz ter sido aceso por **Kūkai em 806 e nunca apagado desde então**. Foi dele que se tirou a chama que acendeu a **Chama da Paz de Hiroshima**, que vocês vão ver no dia anterior, no Parque da Paz. Vale ligar as duas coisas na cabeça: mesmo fogo.',
      ],
    },
    {
      id: 'omotesando',
      photoCaption: 'A rua de comércio da ilha, entre o cais e o santuário.',
      n: 10,
      x: 310,
      y: 620,
      kind: 'food',
      label: 'Rua de comércio',
      side: 'left',
      title: 'Omotesandō — ostra, anago e a colher gigante',
      jp: '表参道商店街',
      facts: 'Entre o cais e o santuário · a maioria fecha **~17:00**',
      paragraphs: [
        'Duas coisas para comer aqui e em nenhum outro lugar: **ostra grelhada na casca** (Hiroshima produz 60% das ostras do Japão, e novembro é o começo da temporada), e o **anago-meshi**, a enguia-do-mar grelhada sobre arroz — a versão local da unagi, mais delicada, servida em caixa de madeira. A **Ueno**, perto da estação de Miyajimaguchi, faz o mais famoso desde 1901.',
        'No meio da rua está a **maior colher de arroz do mundo**: 7,7 metros, 2,5 toneladas, 270 anos de madeira. A ilha inventou a *shakushi* de madeira no século XVIII, quando um monge sonhou com o instrumento e ensinou o ofício aos moradores como fonte de renda. Ainda é a lembrança oficial daqui.',
      ],
    },
  ],
  legend: 'Azul = o mar · verde = a mata primária do Misen · faixa cinza = o caminho da orla · pontilhado = o teleférico',
};

const nara: PlaceMap = {
  id: 'nara',
  coverHotspotId: 'daibutsu',
  stopId: 'd30-parque-nara',
  dayId: 'd2026-11-30',
  title: 'Parque de Nara',
  jp: '奈良公園',
  subtitle: 'Da estação ao Grande Buda e às lanternas de Kasuga, com os cervos no meio',
  intro: [
    'Tudo aqui cabe num parque só, e o caminho é praticamente reto: **estação → Kōfuku-ji → cervos → Tōdai-ji → Nigatsu-dō → Kasuga Taisha**, com Naramachi no fim. São uns 4 km de ponta a ponta, tudo plano menos a subida do Nigatsu-dō.',
    'Nara foi capital de **710 a 794** — antes de Kyoto. É o Japão mais antigo que ainda está em pé, e quase tudo que vocês vão ver aqui é anterior a qualquer coisa de Tóquio em mais de mil anos.',
  ],
  viewBox: '0 80 360 560',
  scenery: [
    { d: 'M24 90 L336 90 L336 630 L24 630 Z', fill: MAP_COLORS.forest, opacity: 0.1 },
    // floresta primária de Kasuga
    { d: 'M196 300 L250 110 L336 90 L336 300 Z', fill: MAP_COLORS.forest, opacity: 0.2 },
    // caminho principal
    { d: 'M110 616 L110 500 C110 472 138 464 168 464 L204 464 C234 462 240 434 238 396 L238 330 C238 272 254 240 268 214 C278 194 250 176 232 166', stroke: MAP_COLORS.muted, width: 14, opacity: 0.28, round: true },
    // desvio do Nigatsu-dō
    { d: 'M262 250 C288 244 296 240 296 240', stroke: MAP_COLORS.muted, width: 8, dash: '7 6', opacity: 0.35, round: true },
    // lago Sarusawa
    { d: 'M160 552 C190 542 226 552 230 568 C234 586 196 600 172 592 C150 584 142 562 160 552 Z', fill: MAP_COLORS.water, opacity: 0.3 },
    // pagode do Kōfuku-ji
    { d: 'M66 540 l0 -16 M54 524 l24 0 M58 512 l16 0 M54 500 l24 0 M58 488 l16 0 M66 488 l0 -12', stroke: MAP_COLORS.vermilion, width: 2.5, opacity: 0.7, round: true },
    // Daibutsuden
    { d: 'M154 330 C178 296 234 296 258 330 M164 330 L164 364 L248 364 L248 330', stroke: MAP_COLORS.ink, width: 3, opacity: 0.45, round: true },
    // Nandaimon
    { d: 'M154 412 L154 392 M192 412 L192 392 M146 394 L200 394', stroke: MAP_COLORS.vermilion, width: 2.5, opacity: 0.6, round: true },
    // torii de Kasuga
    { d: 'M160 170 L160 142 M204 170 L204 142 M152 144 L212 144 M156 132 C172 128 192 128 208 132 L208 137 C192 133 172 133 156 137 Z', stroke: MAP_COLORS.vermilion, width: 3, opacity: 0.85, round: true },
  ],
  trees: [
    { x: 60, y: 442, s: 22 },
    { x: 100, y: 400, s: 20 },
    { x: 310, y: 482, s: 22 },
    { x: 62, y: 322, s: 22 },
    { x: 120, y: 272, s: 22 },
    { x: 316, y: 400, s: 20 },
  ],
  hotspots: [
    {
      id: 'estacao',
      photoCaption: 'A estação Kintetsu de Nara, a 5 minutos do parque.',
      n: 1,
      x: 110,
      y: 600,
      kind: 'station',
      label: 'Kintetsu Nara',
      side: 'right',
      title: 'Estação Kintetsu Nara',
      jp: '近鉄奈良駅',
      facts: '**Kintetsu**, de Kyoto: ~45 min · a JR deixa mais longe do parque',
      paragraphs: [
        'Duas estações servem Nara e a diferença importa: a **Kintetsu** deixa vocês a **5 minutos a pé** da entrada do parque; a **JR** fica quase 1 km a oeste, com 20 minutos de caminhada sem graça. Se estiverem usando passe da JR, ainda assim vale considerar a Kintetsu.',
        'Saindo, é subir a rua principal e o parque começa sozinho — não há portão nem bilheteria. O parque é aberto e gratuito; só os prédios cobram entrada.',
      ],
    },
    {
      id: 'kofukuji',
      photoCaption: 'O pagode de cinco andares do Kōfuku-ji, refletido no lago.',
      n: 2,
      x: 110,
      y: 520,
      kind: 'temple',
      label: 'Kōfuku-ji',
      side: 'right',
      title: 'Kōfuku-ji e o pagode de cinco andares',
      jp: '興福寺',
      facts: 'Pagode: **50,1 m**, o segundo mais alto do Japão · museu **09:00–17:00**, ¥700',
      paragraphs: [
        'O templo da família **Fujiwara**, o clã que governou o Japão nos bastidores por três séculos casando as filhas com os imperadores. Foi transferido para cá em **710**, quando a capital mudou, e chegou a ter 175 edifícios — hoje restam poucos, mas a escala ainda se sente.',
        'O pagode é de **730**, reconstruído em **1426** depois do quinto incêndio. Na era Meiji, com a perseguição ao budismo, ele foi posto à venda por 250 ienes e quase demolido para se aproveitar o metal das pontas — não houve comprador, e é por isso que ele existe.',
        'Se entrarem em um prédio só, que seja o **Museu dos Tesouros Nacionais**: lá está o **Ashura**, uma estátua de 734 de um demônio de três rostos e seis braços, com cara de adolescente melancólico. É a escultura mais amada do Japão antigo, e o rosto dela não parece ter 1.300 anos.',
      ],
    },
    {
      id: 'sarusawa',
      photoCaption: 'O lago Sarusawa, com o pagode ao fundo.',
      n: 3,
      x: 190,
      y: 562,
      kind: 'water',
      label: 'Lago Sarusawa',
      side: 'left',
      title: 'Sarusawa-ike',
      jp: '猿沢池',
      facts: 'Logo abaixo do Kōfuku-ji · volta completa em 10 min',
      paragraphs: [
        'O lago artificial que existe desde o século VIII, com o pagode refletido na água — é **a fotografia clássica de Nara**, e funciona melhor no fim da tarde.',
        'A lenda que corre desde o período Nara: uma dama da corte, desprezada pelo imperador, se afogou aqui, e um pequeno santuário na margem foi erguido para acalmá-la — de costas para o lago, para que ela não veja a própria água. Está lá até hoje, virado ao contrário.',
      ],
    },
    {
      id: 'cervos',
      photoCaption: 'Os cervos do parque, que aprenderam a fazer reverência.',
      n: 4,
      x: 160,
      y: 460,
      kind: 'fox',
      label: 'Os cervos',
      side: 'right',
      title: 'Os cervos — 1.200 no parque',
      jp: '鹿',
      facts: 'Bolachas (*shika senbei*) **¥200** nas barracas · não dê outra comida',
      paragraphs: [
        'A origem: quando Nara virou capital, o clã Fujiwara trouxe o deus **Takemikazuchi** para o Kasuga Taisha, e a crença é que ele chegou **montado num cervo branco**. Os cervos viraram mensageiros divinos e, por séculos, **matar um era crime capital** — há registros de execuções por isso até o século XVII.',
        'Hoje são Monumento Natural do Japão, protegidos, mas oficialmente selvagens: não pertencem a ninguém e não são alimentados pelo parque. E aprenderam sozinhos a **fazer reverência** para pedir bolacha — inclinam a cabeça, você inclina de volta, eles inclinam de novo. É comportamento aprendido, transmitido entre eles.',
        'Regras práticas: comprem as bolachas nas barracas oficiais e **deem rápido** — se enrolar, eles cabeceiam, puxam a roupa e mordiscam. **Escondam o resto**, mostrem as mãos abertas para dizer que acabou (eles entendem esse gesto), e cuidado com papel no bolso. Em novembro os machos ainda estão em fase de cio e mais bravos; os chifres são serrados todo outubro por segurança.',
      ],
    },
    {
      id: 'nandaimon',
      photoCaption: 'O Nandaimon e os guardiões Niō de 8,4 metros.',
      n: 5,
      x: 210,
      y: 400,
      kind: 'gate',
      label: 'Nandaimon',
      side: 'right',
      title: 'Nandaimon e os dois guardiões',
      jp: '南大門',
      facts: 'De **1203** · as estátuas têm **8,4 m** · sempre aberto, grátis',
      paragraphs: [
        'Parem aqui antes de correr para o Grande Buda — quase todo mundo passa reto e perde a melhor escultura do Japão. Nos dois nichos estão os **Niō**, guardiões esculpidos por **Unkei e Kaikei** com sua equipe em **1203**.',
        'O dado que impressiona: as duas estátuas, de 8,4 metros e mais de 3.000 peças de madeira encaixadas, foram feitas em **69 dias**. Uma desmontagem nos anos 1990 encontrou os registros do canteiro dentro delas, com os nomes e as datas. Elas têm a musculatura exagerada e a torção do corpo que fizeram desta a escola que rompeu com o budismo sereno dos séculos anteriores.',
      ],
    },
    {
      id: 'daibutsuden',
      photoCaption: 'O Daibutsuden: mesmo reduzido, é imenso.',
      n: 6,
      x: 200,
      y: 340,
      kind: 'hall',
      label: 'Daibutsuden',
      side: 'right',
      title: 'Daibutsuden — o salão do Grande Buda',
      jp: '大仏殿',
      facts: '**08:00–17:00** (nov–mar) · ¥800 · Patrimônio Mundial',
      paragraphs: [
        'O prédio atual é de **1709** e tem **apenas dois terços da largura do original** — porque não havia mais no Japão árvores do tamanho necessário para as colunas. Mesmo assim, foi por mais de mil anos **a maior construção de madeira do mundo**, e ainda está entre as maiores.',
        'Ele já queimou duas vezes em guerra: em 1180 e em 1567. O que vocês veem é a terceira encarnação, financiada por doações populares recolhidas por um monge de porta em porta.',
      ],
    },
    {
      id: 'daibutsu',
      photoCaption: 'O Grande Buda de bronze, de 743.',
      n: 7,
      x: 252,
      y: 292,
      kind: 'hall',
      label: 'Grande Buda',
      side: 'right',
      title: 'O Grande Buda e o buraco da coluna',
      jp: '奈良の大仏',
      facts: '**15 m** · ~500 toneladas de bronze · fundido em **743–752**',
      paragraphs: [
        'Em 735–737, uma epidemia de **varíola matou entre um quarto e um terço da população do Japão**, incluindo os quatro irmãos Fujiwara que controlavam a corte. Houve revolta, seca e fome. O imperador **Shōmu** concluiu que o país estava sendo punido e, em 743, decretou a construção de um Buda de bronze do tamanho de um prédio, pedindo que "todos, até quem só puder doar um punhado de terra", participassem.',
        'Mais de dois milhões de pessoas trabalharam ou doaram. Consumiu **praticamente todo o bronze do Japão** e deixou o Estado à beira da falência — e o ouro do revestimento, aplicado com mercúrio, provavelmente envenenou boa parte dos artesãos. A cabeça atual é de 1692; partes do corpo e do pedestal ainda são as originais do século VIII.',
        'Atrás, à direita, procurem a **coluna com um buraco na base**: ele tem exatamente o tamanho de uma narina do Buda, e quem atravessa engatinhando ganha iluminação na próxima vida. Criança passa fácil; adulto passa com ajuda e alguma humilhação — que talvez seja o ponto.',
      ],
    },
    {
      id: 'nigatsudo',
      photoCaption: 'O terraço do Nigatsu-dō, com Nara inteira embaixo.',
      n: 8,
      x: 290,
      y: 228,
      kind: 'view',
      label: 'Nigatsu-dō',
      side: 'left',
      title: 'Nigatsu-dō — o terraço e o fogo',
      jp: '二月堂',
      facts: 'Subida de 5 min atrás do Daibutsuden · **24h · grátis**',
      paragraphs: [
        'A melhor vista de Nara, de graça, e quase sem gente — a maioria vai embora depois do Grande Buda. Da varanda de madeira suspensa na encosta vê-se o parque inteiro, o telhado do Daibutsuden e a cidade atrás. É o melhor lugar da cidade ao pôr do sol.',
        'O nome quer dizer "salão do segundo mês", e é por causa do **Omizutori**, um ritual de fogo e água realizado aqui **todo ano desde 752** — mil duzentos e setenta e poucos anos **sem uma única interrupção**, atravessando guerras civis, incêndios do próprio templo e a Segunda Guerra. Monges correm pela varanda com tochas de bambu de oito metros jogando brasas sobre a multidão, que se considera abençoada por elas.',
      ],
    },
    {
      id: 'kasuga',
      photoCaption: 'As lanternas de pedra ao longo do caminho de Kasuga.',
      n: 9,
      x: 228,
      y: 150,
      kind: 'torii',
      label: 'Kasuga Taisha',
      side: 'right',
      title: 'Kasuga Taisha — as três mil lanternas',
      jp: '春日大社',
      facts: '**06:30–17:30** · pátio grátis, salão interno ¥500',
      paragraphs: [
        'O santuário do clã Fujiwara, fundado em **768**. São cerca de **2.000 lanternas de pedra** ao longo dos caminhos e **1.000 de bronze** penduradas nos beirais, todas doadas por fiéis ao longo de mil anos. Duas vezes por ano acendem todas de uma vez; no resto do tempo, há uma **sala escura** dentro do santuário onde algumas ficam acesas entre espelhos, e é a coisa mais bonita daqui.',
        'Até 1863 o santuário era **inteiramente reconstruído a cada vinte anos**, prática que o Ise Jingū mantém até hoje: o prédio nunca envelhece, mas a forma tem 1.200 anos, e o conhecimento de como construí-la passa de geração em geração pelo próprio ato de refazer.',
        'O caminho até aqui atravessa a **floresta primária de Kasuga**, proibida de corte desde **841** — mil e duzentos anos sem machado, dentro de uma cidade. É Patrimônio Mundial junto com o santuário.',
      ],
    },
    {
      id: 'naramachi',
      photoCaption: 'Naramachi e o mochi socado na marreta da Nakatanidō.',
      n: 10,
      x: 300,
      y: 560,
      kind: 'food',
      label: 'Naramachi',
      side: 'left',
      title: 'Naramachi e o mochi mais rápido do Japão',
      jp: 'ならまち',
      facts: 'Sul do lago Sarusawa · a **Nakatanidō** faz a batida a cada ~30 min',
      paragraphs: [
        'O bairro antigo de comerciantes, de casas estreitas e compridas — largas o suficiente para pagar pouco imposto, que era cobrado pela testada. Hoje são cafés, lojas de artesanato e casas abertas à visita. É o contraponto perfeito ao dia de templos.',
        'A parada obrigatória é a **Nakatanidō**: dois homens socam o mochi de yomogi numa marreta em velocidade absurda, um batendo e outro virando a massa com a mão entre as marteladas, gritando o ritmo. Dura menos de um minuto, atrai multidão, e o **yomogi mochi com feijão doce** sai quente por ¥150. Se virem gente se juntando na porta, corram: a batida vai começar.',
      ],
    },
  ],
  legend: 'Verde escuro = a floresta primária de Kasuga · faixa cinza = o caminho principal · pontilhado = o desvio para o Nigatsu-dō',
};

export const PLACE_MAPS: PlaceMap[] = [sensoji, miyajima, nara, fushimiInari];

export const placeMapById = (id: string): PlaceMap | undefined =>
  PLACE_MAPS.find((m) => m.id === id);

/** miniatura quadrada gerada por scripts/optimize-photos.mjs */
export const thumbOf = (photo: PlacePhoto) => photo.src.replace(/\.jpg$/, '.thumb.jpg');

/** chave da foto no arquivo gerado: '<mapa>/<ponto>' */
export const photoKey = (mapId: string, hotspotId: string) => `${mapId}/${hotspotId}`;

export const placeMapByStopId = (stopId: string): PlaceMap | undefined =>
  PLACE_MAPS.find((m) => m.stopId === stopId);

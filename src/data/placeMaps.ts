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
  | 'food'
  | 'sight';

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
  /** caminhada desde o ponto anterior, ex.: '10 min' */
  walk?: string;
  /** posição real, para "você está perto do ponto X" */
  coords?: { lat: number; lng: number };
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
      coords: { lat: 34.966, lng: 135.7726 },
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
      coords: { lat: 34.9668, lng: 135.7715 },
      walk: '2 min',
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
      coords: { lat: 34.9672, lng: 135.7729 },
      walk: '3 min',
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
      coords: { lat: 34.9673, lng: 135.7732 },
      walk: '1 min',
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
      coords: { lat: 34.9674, lng: 135.7737 },
      walk: '2 min',
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
      coords: { lat: 34.9678, lng: 135.775 },
      walk: '3 min',
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
      coords: { lat: 34.9683, lng: 135.7767 },
      walk: '10 min',
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
      coords: { lat: 34.9679, lng: 135.7793 },
      walk: '15 min',
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
      coords: { lat: 34.9686, lng: 135.7828 },
      walk: '15 min',
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
      coords: { lat: 34.9678, lng: 135.7855 },
      walk: '25 min',
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
      coords: { lat: 35.7109, lng: 139.7963 },
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
      coords: { lat: 35.712, lng: 139.7963 },
      walk: '1 min',
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
      coords: { lat: 35.7133, lng: 139.7964 },
      walk: '4 min',
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
      coords: { lat: 35.7138, lng: 139.7955 },
      walk: '1 min',
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
      coords: { lat: 35.7143, lng: 139.7964 },
      walk: '1 min',
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
      coords: { lat: 35.7146, lng: 139.7967 },
      walk: '1 min',
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
      coords: { lat: 35.7148, lng: 139.7967 },
      walk: '1 min',
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
      coords: { lat: 35.7149, lng: 139.7977 },
      walk: '2 min',
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
      coords: { lat: 35.7143, lng: 139.7981 },
      walk: '2 min',
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
      coords: { lat: 35.7136, lng: 139.7938 },
      walk: '6 min',
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
    { d: 'M-2000 2600 L2360 2600 L2360 470 L-2000 470 Z', fill: MAP_COLORS.water, opacity: 0.22 },
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
      coords: { lat: 34.3115, lng: 132.3231 },
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
      coords: { lat: 34.2985, lng: 132.3187 },
      walk: '10 min',
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
      coords: { lat: 34.296, lng: 132.3198 },
      walk: '3 min',
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
      coords: { lat: 34.2975, lng: 132.321 },
      walk: '3 min',
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
      coords: { lat: 34.299, lng: 132.3215 },
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
      coords: { lat: 34.2935, lng: 132.3185 },
      walk: '10 min',
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
      coords: { lat: 34.296, lng: 132.323 },
      walk: '8 min',
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
      coords: { lat: 34.2955, lng: 132.3245 },
      walk: '10 min',
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
      coords: { lat: 34.2793, lng: 132.3199 },
      walk: '30 min',
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
      coords: { lat: 34.302, lng: 132.321 },
      walk: '15 min',
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
      coords: { lat: 34.6836, lng: 135.8286 },
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
      coords: { lat: 34.683, lng: 135.8318 },
      walk: '5 min',
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
      coords: { lat: 34.6816, lng: 135.8306 },
      walk: '2 min',
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
      coords: { lat: 34.6851, lng: 135.838 },
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
      coords: { lat: 34.6862, lng: 135.8397 },
      walk: '12 min',
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
      coords: { lat: 34.689, lng: 135.8398 },
      walk: '3 min',
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
      coords: { lat: 34.689, lng: 135.84 },
      walk: '1 min',
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
      coords: { lat: 34.6895, lng: 135.8445 },
      walk: '8 min',
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
      coords: { lat: 34.6815, lng: 135.8483 },
      walk: '15 min',
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
      coords: { lat: 34.6795, lng: 135.83 },
      walk: '25 min',
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

const higashiyama: PlaceMap = {
  id: 'higashiyama',
  coverHotspotId: 'kiyomizu',
  stopId: 'd28-kiyomizu',
  dayId: 'd2026-11-28',
  title: 'Higashiyama',
  jp: '東山',
  subtitle: 'De Kiyomizu-dera ao Pavilhão de Prata, a colina inteira de Kyoto a pé',
  intro: [
    'É o dia mais denso da viagem, e é **uma linha só**: começa no alto de Kiyomizu-dera, desce pelas ruas de pedra, atravessa Gion, sobe até Nanzen-ji e segue o canal do Caminho do Filósofo até Ginkaku-ji. Uns 7 km em tudo, com o sopé da montanha sempre à direita.',
    '**Ordem importa:** Kiyomizu às 6h da manhã é outro lugar (vazio, com névoa); às 10h é um shopping. E a iluminação noturna de Eikan-dō ou Kōdai-ji fecha o dia — os dois valem, escolham um.',
  ],
  viewBox: '0 0 360 700',
  scenery: [
    { d: 'M20 40 L340 40 L340 690 L20 690 Z', fill: MAP_COLORS.forest, opacity: 0.07 },
    // a montanha de Higashiyama, sempre à direita
    { d: 'M250 690 L262 560 L290 470 L272 380 L300 250 L280 120 L310 40 L340 40 L340 690 Z', fill: MAP_COLORS.forest, opacity: 0.2 },
    // o canal do Caminho do Filósofo
    { d: 'M214 250 C214 200 210 150 214 96', stroke: MAP_COLORS.water, width: 6, opacity: 0.45, round: true },
    // o caminho (sul → norte)
    { d: 'M232 660 C232 630 200 618 176 604 C150 590 142 560 140 530 C138 500 150 470 162 448 C176 424 186 392 176 366 C166 342 172 300 190 280 C204 264 212 232 214 200 C216 150 210 120 214 96', stroke: MAP_COLORS.muted, width: 14, opacity: 0.3, round: true },
    // palco de Kiyomizu (a plataforma sobre pilares)
    { d: 'M212 650 L262 650 M216 650 L216 668 M232 650 L232 668 M248 650 L248 668 M258 650 L258 668', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.5, round: true },
    // pagode Yasaka
    { d: 'M108 480 l0 -16 M96 464 l24 0 M100 452 l16 0 M96 440 l24 0 M100 428 l16 0 M108 428 l0 -12', stroke: MAP_COLORS.vermilion, width: 2.5, opacity: 0.7, round: true },
    // Sanmon de Nanzen-ji
    { d: 'M236 300 L236 278 M284 300 L284 278 M228 280 L292 280 M232 270 C248 266 272 266 288 270 L288 274 C272 270 248 270 232 274 Z', stroke: MAP_COLORS.ink, width: 3, opacity: 0.5, round: true },
    // telhado do Pavilhão de Prata
    { d: 'M252 100 C266 82 298 82 312 100 M258 100 L258 118 L306 118 L306 100', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.5, round: true },
  ],
  trees: [
    { x: 60, y: 640, s: 22 }, { x: 300, y: 610, s: 20 }, { x: 70, y: 380, s: 22 }, { x: 310, y: 330, s: 22 },
    { x: 60, y: 200, s: 20 }, { x: 260, y: 200, s: 22 }, { x: 250, y: 150, s: 18 }, { x: 80, y: 90, s: 22 },
  ],
  hotspots: [
    {
      id: 'kiyomizu',
      photoCaption: 'O palco de Kiyomizu, suspenso sobre a encosta sem um prego.',
      n: 1, x: 232, y: 660, kind: 'temple', label: 'Kiyomizu-dera', side: 'left',
      coords: { lat: 34.9949, lng: 135.7850 },
      title: 'Kiyomizu-dera — o palco sobre o vale',
      jp: '清水寺',
      facts: '**06:00–18:00** · ¥500 · Patrimônio Mundial · chegar às 6h',
      paragraphs: [
        'O salão principal é de **1633** e o palco de madeira avança 13 metros sobre a encosta, sustentado por **18 pilares de zelkova encaixados sem um único prego**. A expressão japonesa "pular do palco de Kiyomizu" significa tomar uma decisão irreversível — e no período Edo 234 pessoas pularam de fato, como voto; 85% sobreviveram, e a prática foi proibida em 1872.',
        'O nome quer dizer "templo da água pura", pela **cachoeira Otowa** logo abaixo do palco: três fios de água, e a fila é para beber de um deles com a concha de cabo comprido. Cada fio promete uma coisa (longevidade, estudos, amor) — mas beber dos três é ganância e anula tudo.',
        'Às 6h vocês têm o palco quase vazio, com a névoa ainda no vale e a cidade aparecendo aos poucos. É a única hora em que o lugar é o que a foto promete.',
      ],
    },
    {
      id: 'jishu',
      photoCaption: 'As duas pedras do amor, a 18 metros uma da outra.',
      n: 2, x: 196, y: 612, kind: 'stone', label: 'Jishu-jinja', side: 'right', walk: '1 min',
      coords: { lat: 34.9955, lng: 135.7848 },
      title: 'Jishu-jinja — as pedras do amor',
      jp: '地主神社',
      facts: 'Dentro do recinto de Kiyomizu, atrás do salão principal · pode estar em obras',
      paragraphs: [
        'O santuário do deus do casamento, mais velho que o templo em volta dele. A atração são as **duas pedras do amor**, a 18 metros uma da outra: quem vai de uma à outra **de olhos fechados** terá sorte no amor. Quem precisa que alguém guie, vai precisar de intermediário na vida real também.',
        'O santuário passou anos fechado para restauração; se estiver aberto, são 10 minutos. Se não, as pedras se veem por cima do muro.',
      ],
    },
    {
      id: 'sannenzaka',
      photoCaption: 'Sannenzaka: a ladeira de pedra que virou cartão-postal de Kyoto.',
      n: 3, x: 150, y: 560, kind: 'food', label: 'Sannenzaka', side: 'right', walk: '6 min',
      coords: { lat: 34.9973, lng: 135.7813 },
      title: 'Sannenzaka e Ninenzaka — as ladeiras de pedra',
      jp: '三年坂 · 二年坂',
      facts: 'Lojas abrem **~09:00** · às 7h estão vazias e são melhores',
      paragraphs: [
        'Duas ladeiras de pedra ladeadas por casas de madeira do período Edo, preservadas como bairro histórico desde 1976. Todo o cabeamento foi enterrado e as lojas seguem regras de fachada — é por isso que parece cenário.',
        'A superstição: **quem tropeça na Sannenzaka morre em três anos** (san-nen = três anos); na Ninenzaka, em dois. As lojas vendem amuletos de cabaça contra isso. Andem devagar, por via das dúvidas.',
        'Para comer, depois das 9h: **yatsuhashi** (o doce de canela de Kyoto, cru ou assado) nas lojas grandes, e o **sorvete de matcha** da Kasagiya, uma casa de chá de 1914 na Ninenzaka. A Starbucks de Ninenzaka, numa casa de 100 anos com tatame, é uma armadilha boa.',
      ],
    },
    {
      id: 'yasaka-pagoda',
      photoCaption: 'O pagode de Hōkan-ji entre os telhados.',
      n: 4, x: 108, y: 500, kind: 'view', label: 'Pagode Yasaka', side: 'right', walk: '4 min',
      coords: { lat: 34.9985, lng: 135.7796 },
      title: 'Pagode Yasaka (Hōkan-ji)',
      jp: '法観寺 八坂の塔',
      facts: '**46 m** · de 1440 · interior aberto em horário irregular, ¥400',
      paragraphs: [
        'O pagode de cinco andares que aparece **no fim de todas as ruas** deste bairro. O templo em volta praticamente sumiu; ficou a torre, de 1440, no lugar de uma anterior do século VI que a tradição atribui ao príncipe Shōtoku.',
        'A foto clássica de Kyoto é ele visto do alto da **Yasaka-dōri**, a rua que desce da Ninenzaka: o pagode enquadrado pelas casas de madeira. De manhã cedo, sem ninguém, dá para ficar no meio da rua.',
      ],
    },
    {
      id: 'kodaiji',
      photoCaption: 'O jardim de Kōdai-ji, feito para uma viúva.',
      n: 5, x: 140, y: 448, kind: 'temple', label: 'Kōdai-ji', side: 'right', walk: '5 min',
      coords: { lat: 35.0007, lng: 135.7813 },
      title: 'Kōdai-ji — o templo da viúva de Hideyoshi',
      jp: '高台寺',
      facts: '**09:00–17:30** · ¥600 · iluminação noturna no outono até ~21:30',
      paragraphs: [
        'Fundado em **1606** por **Nene**, a viúva de Toyotomi Hideyoshi, para rezar por ele — com dinheiro de Tokugawa Ieyasu, o homem que estava justamente acabando com a família Toyotomi. Política com incenso.',
        'O jardim é do mestre **Kobori Enshū**, com dois lagos e uma ponte coberta; o pavilhão do mausoléu tem lacas com ouro que deram nome a um estilo (Kōdai-ji maki-e). Há também duas casas de chá desenhadas por **Sen no Rikyū**, o homem que inventou a cerimônia do chá como vocês conhecem.',
        'No outono o templo faz **iluminação noturna com projeção no jardim de pedras** — polêmica entre puristas, incrível para o resto. É uma das duas opções para fechar o dia.',
      ],
    },
    {
      id: 'yasaka-jinja',
      photoCaption: 'O portão vermelho de Yasaka-jinja no fim da Shijō-dōri.',
      n: 6, x: 180, y: 392, kind: 'torii', label: 'Yasaka-jinja', side: 'left', walk: '8 min',
      coords: { lat: 35.0037, lng: 135.7787 },
      title: 'Yasaka-jinja e o parque Maruyama',
      jp: '八坂神社',
      facts: '**24h · grátis** · o portão vermelho no fim da avenida Shijō',
      paragraphs: [
        'O santuário de Gion, de 656, dono do **Gion Matsuri** — o festival de julho que existe desde 869, quando foi criado para afastar uma epidemia. As lanternas do salão de dança levam o nome dos doadores, quase todos casas de chá e restaurantes de Gion.',
        'Atravessando o recinto chega-se ao **parque Maruyama**, com a cerejeira-chorona mais famosa de Kyoto (sem flor em novembro, mas com bordos) e barracas de comida. É a passagem natural para Gion.',
      ],
    },
    {
      id: 'gion',
      photoCaption: 'Hanamikōji, a rua das casas de chá de Gion.',
      n: 7, x: 150, y: 336, kind: 'food', label: 'Gion', side: 'left', walk: '5 min',
      coords: { lat: 35.0031, lng: 135.7752 },
      title: 'Gion — Hanamikōji e as gueixas',
      jp: '祇園 花見小路',
      facts: 'Ruas laterais **fechadas para fotos** desde 2024 · fim de tarde é a hora',
      paragraphs: [
        'O bairro das **geiko** (é assim que Kyoto chama as gueixas) e das **maiko**, as aprendizes. A rua principal é a **Hanamikōji**, com as *ochaya* (casas de chá) de madeira escura e lanterna vermelha. Entre 17h30 e 18h30 elas saem para os compromissos — é a única hora em que se vê uma de verdade.',
        'Regras que viraram lei municipal: **não fotografar nas vielas privadas** (multa de ¥10.000), não tocar, não seguir. Uma maiko de dia com turista não é maiko: é gente que pagou pela fantasia. As verdadeiras andam rápido e não param.',
        'O **Gion Corner** apresenta cerimônia do chá, dança e teatro em 50 minutos para turista; vale se quiserem ver uma dança de maiko sem pagar o ¥50.000 de uma noite de ochaya.',
      ],
    },
    {
      id: 'nanzenji',
      photoCaption: 'O aqueduto de tijolo dentro de Nanzen-ji.',
      n: 8, x: 190, y: 290, kind: 'gate', label: 'Nanzen-ji', side: 'left', walk: '25 min (ou metrô até Keage)',
      coords: { lat: 35.0113, lng: 135.7941 },
      title: 'Nanzen-ji — o portão e o aqueduto',
      jp: '南禅寺',
      facts: 'Recinto **grátis** · Sanmon ¥600 (subir) · Hōjō ¥600',
      paragraphs: [
        'O templo zen mais importante do país, no topo da hierarquia dos "Cinco Montes". O **Sanmon**, o portão de 1628, tem 22 metros e um andar superior que se sobe por escada íngreme: a vista da cidade lá de cima é onde o ladrão Ishikawa Goemon, na peça de kabuki, diz "que vista magnífica" antes de ser preso e cozido vivo.',
        'A surpresa está atrás: um **aqueduto de tijolo vermelho de 1890**, estilo romano, cortando o recinto do templo. Faz parte do canal que trouxe água do lago Biwa para Kyoto depois que a capital foi para Tóquio e a cidade precisava se reinventar. Ainda funciona, e a água que corre nele é a mesma que vai formar o Caminho do Filósofo.',
      ],
    },
    {
      id: 'filosofo',
      photoCaption: 'O Caminho do Filósofo com os bordos de novembro.',
      n: 9, x: 214, y: 200, kind: 'water', label: 'Caminho do Filósofo', side: 'left', walk: '10 min',
      coords: { lat: 35.0195, lng: 135.7948 },
      title: 'Caminho do Filósofo e Eikan-dō',
      jp: '哲学の道 · 永観堂',
      facts: 'Caminho **2 km**, grátis · Eikan-dō ¥1.000 (noturno ¥600 à parte, 17:30–21:00)',
      paragraphs: [
        'Um caminho de pedra ao longo do canal, com cerejeiras (primavera) e bordos (agora). O nome vem de **Nishida Kitarō**, o filósofo da Escola de Kyoto, que fazia este trajeto todo dia até a universidade nos anos 1920, pensando.',
        'Logo no começo fica **Eikan-dō**, o templo que Kyoto inteira considera o melhor lugar de outono da cidade: 3.000 bordos em volta de um lago, e um Buda famoso por estar **olhando para trás por cima do ombro** (o *Mikaeri Amida*), como quem espera os retardatários. A iluminação noturna daqui é a outra opção para fechar o dia — mais bordos, menos projeção que Kōdai-ji.',
      ],
    },
    {
      id: 'ginkakuji',
      photoCaption: 'O Pavilhão de Prata, que nunca recebeu prata.',
      n: 10, x: 214, y: 96, kind: 'temple', label: 'Ginkaku-ji', side: 'left', walk: '30 min pelo canal',
      coords: { lat: 35.0270, lng: 135.7982 },
      title: 'Ginkaku-ji — o Pavilhão de Prata',
      jp: '銀閣寺',
      facts: '**08:30–17:00** (nov) · ¥500 · Patrimônio Mundial',
      paragraphs: [
        'Construído em **1482** pelo xogum Ashikaga Yoshimasa como vila de aposentadoria, no modelo do Pavilhão Dourado do avô — mas o país estava em guerra civil (a Guerra Ōnin, que destruiu Kyoto) e **a prata nunca foi aplicada**. Ficou de madeira escura, e séculos depois isso virou o ponto: a beleza do inacabado e do gasto, a estética *wabi-sabi* que nasceu justamente nesta casa.',
        'Yoshimasa foi um xogum desastroso e um mecenas genial: enquanto Kyoto queimava, ele reuniu aqui os mestres que criaram a cerimônia do chá, o ikebana e o teatro nō como se conhecem hoje. O **jardim de areia** com o cone (o "monte que olha a lua") e o mar de areia ondulado é rastelado toda manhã.',
        'Do alto da trilha no jardim de musgo vê-se o pavilhão, o cone e a cidade. Fim do percurso: ônibus 5 ou 17 de volta ao centro, ou táxi.',
      ],
    },
  ],
  legend: 'Verde escuro = a montanha de Higashiyama · azul = o canal do Caminho do Filósofo · faixa cinza = o percurso, de sul para norte',
};

const arashiyama: PlaceMap = {
  id: 'arashiyama',
  coverHotspotId: 'bambu',
  stopId: 'd29-bambu',
  dayId: 'd2026-11-29',
  title: 'Arashiyama',
  jp: '嵐山',
  subtitle: 'Do bambuzal às 7h ao rio, com o templo e a vila do ator no meio',
  intro: [
    'Arashiyama é pequeno e se anda em três horas: a estação fica a leste, o bambuzal e os templos sobem para o norte, o rio e a ponte ficam ao sul. A sequência do roteiro é a que evita a multidão: **bambu primeiro, antes das 8h**, depois Tenryū-ji na abertura e a vila Ōkōchi enquanto o bosque lota.',
    'O rio muda de nome na ponte: a montante é Hozu, a jusante é Katsura. O trem Torokko e os barcos descem o desfiladeiro do Hozu; em novembro as encostas ficam vermelhas.',
  ],
  viewBox: '0 0 360 640',
  scenery: [
    { d: 'M20 40 L340 40 L340 630 L20 630 Z', fill: MAP_COLORS.forest, opacity: 0.07 },
    // montanha Arashiyama, a oeste (esquerda)
    { d: 'M20 630 L20 300 L60 220 L110 300 L150 250 L180 330 L120 630 Z', fill: MAP_COLORS.forest, opacity: 0.2 },
    // o rio, embaixo
    { d: 'M-2000 2600 L2360 2600 L2360 540 C300 528 240 552 180 540 C120 528 60 552 -2000 540 Z', fill: MAP_COLORS.water, opacity: 0.22 },
    { d: 'M20 570 C80 562 140 578 200 570 C260 562 300 578 340 570', stroke: MAP_COLORS.water, width: 1.5, opacity: 0.35 },
    // ponte Togetsukyō
    { d: 'M90 540 L176 540 M100 540 L100 552 M126 540 L126 552 M152 540 L152 552 M172 540 L172 552', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.55, round: true },
    // caminho: estação → bambu → templos → rio
    { d: 'M300 470 C260 470 236 440 232 400 C228 360 200 340 176 310 C150 276 150 236 176 200 C196 172 236 176 252 210 C266 240 232 280 232 330 C232 380 256 420 250 470 C246 500 210 512 190 540', stroke: MAP_COLORS.muted, width: 13, opacity: 0.3, round: true },
    // o bambuzal: hastes
    { d: 'M150 300 L150 240 M162 296 L162 236 M174 292 L174 232 M138 304 L138 244 M186 290 L186 230', stroke: MAP_COLORS.forest, width: 3, opacity: 0.8, round: true },
    // telhado de Tenryū-ji
    { d: 'M264 350 C278 332 304 332 318 350 M270 350 L270 366 L312 366 L312 350', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.5, round: true },
    // trilho do Torokko (a noroeste)
    { d: 'M60 150 L200 110', stroke: MAP_COLORS.ink, width: 1.5, dash: '5 5', opacity: 0.45 },
  ],
  trees: [
    { x: 300, y: 300, s: 22 }, { x: 320, y: 360, s: 20 }, { x: 290, y: 240, s: 20 }, { x: 60, y: 480, s: 22 },
    { x: 100, y: 500, s: 18 }, { x: 300, y: 420, s: 20 }, { x: 240, y: 130, s: 20 },
  ],
  hotspots: [
    {
      id: 'estacao',
      photoCaption: 'A estação JR Saga-Arashiyama, a 15 minutos de Kyoto.',
      n: 1, x: 300, y: 430, kind: 'station', label: 'Saga-Arashiyama', side: 'left',
      coords: { lat: 35.0187, lng: 135.6813 },
      title: 'Estação JR Saga-Arashiyama',
      jp: '嵯峨嵐山駅',
      facts: 'JR Sagano Line, **15 min** da Estação de Kyoto, ¥240 · primeiro trem ~05:30',
      paragraphs: [
        'A estação certa para chegar cedo: da saída sul, o bambuzal fica a 10 minutos a pé em linha reta. A alternativa Hankyu deixa do outro lado do rio, e a Keifuku (o bonde Randen) chega no centro da vila — as duas servem para a volta.',
        'Ao lado, a estação do **Torokko** (o trem panorâmico) — o ponto 10 deste mapa.',
      ],
    },
    {
      id: 'bambu',
      photoCaption: 'O corredor de bambu às 7h da manhã, ainda vazio.',
      n: 2, x: 162, y: 270, kind: 'view', label: 'Bosque de bambu', side: 'right', walk: '10 min',
      coords: { lat: 35.0170, lng: 135.6717 },
      title: 'O bosque de bambu',
      jp: '嵯峨野竹林の小径',
      facts: '**24h · grátis** · o corredor tem ~400 m · vazio antes das 8h, intransitável às 10h',
      paragraphs: [
        'O bambu *moso* cresce até **um metro por dia** na primavera e o bosque é manejado há séculos: cada haste é cortada depois de 3 a 5 anos, e as cercas de galhos das laterais são feitas do próprio bambu. O som do vento nas hastes está na lista oficial dos **100 sons a preservar do Japão**.',
        'A parte famosa é o trecho entre Nonomiya-jinja e a entrada da vila Ōkōchi. Às 7h vocês têm o corredor para vocês; a partir das 9h30 é uma fila de gente andando. Se quiserem a foto sem ninguém, é agora ou nunca.',
      ],
    },
    {
      id: 'nonomiya',
      photoCaption: 'O torii de madeira crua de Nonomiya, dentro do bambuzal.',
      n: 3, x: 200, y: 318, kind: 'torii', label: 'Nonomiya-jinja', side: 'right', walk: '2 min',
      coords: { lat: 35.0165, lng: 135.6737 },
      title: 'Nonomiya-jinja — o torii de tronco cru',
      jp: '野宮神社',
      facts: 'Dentro do bambuzal · **09:00–17:00**, grátis',
      paragraphs: [
        'Repare no **torii preto, de tronco com casca**: é o *kuroki torii*, a forma mais antiga de torii do Japão, quase não existe mais. Aqui as princesas imperiais escolhidas para servir em Ise se purificavam por um ano antes de partir — a cena está no *Genji Monogatari*, do século XI.',
        'Hoje é santuário de casamento e de estudos. A **pedra que se esfrega** (*kame-ishi*, a tartaruga) promete o pedido em um ano.',
      ],
    },
    {
      id: 'tenryuji',
      photoCaption: 'O jardim de Tenryū-ji, com a montanha "emprestada" ao fundo.',
      n: 4, x: 232, y: 352, kind: 'temple', label: 'Tenryū-ji', side: 'left', walk: '3 min',
      coords: { lat: 35.0157, lng: 135.6737 },
      title: 'Tenryū-ji — o jardim que nunca mudou',
      jp: '天龍寺',
      facts: 'Jardim **08:30–17:00** ¥500 · Patrimônio Mundial · saída norte dá no bambuzal',
      paragraphs: [
        'Fundado em **1339** pelo xogum Ashikaga Takauji para apaziguar o espírito do imperador Go-Daigo, a quem ele havia traído e derrubado — e que acabara de morrer no exílio. Culpa transformada em arquitetura.',
        'O jardim **Sōgenchi**, do monge Musō Soseki, é o mais antigo de Kyoto que sobrevive na forma original: os prédios queimaram oito vezes, o jardim nunca mudou em quase 700 anos. Usa *shakkei*, "paisagem emprestada" — as montanhas de Arashiyama ao fundo são compostas como parte do jardim, sem cerca visível.',
        'No teto do salão Hattō há um **dragão de nuvens** pintado em 1997 que parece olhar para você de qualquer ponto da sala (¥500 à parte, só em fins de semana e feriados na maior parte do ano).',
      ],
    },
    {
      id: 'okochi',
      photoCaption: 'A vila Ōkōchi Sansō, com a cidade lá embaixo.',
      n: 5, x: 176, y: 200, kind: 'view', label: 'Ōkōchi Sansō', side: 'right', walk: '8 min',
      coords: { lat: 35.0186, lng: 135.6698 },
      title: 'Ōkōchi Sansō — a vila do ator',
      jp: '大河内山荘',
      facts: '**09:00–17:00** · ¥1.000 **com matcha e doce** · saída norte do bambuzal',
      paragraphs: [
        'A vila e os jardins que o ator de cinema mudo **Ōkōchi Denjirō** (o samurai dos filmes dos anos 1920–30) construiu ao longo de 30 anos com o próprio salário. Trilha em encosta com vistas do rio Hozu, da cidade e, num dia limpo, das montanhas de Higashiyama do outro lado de Kyoto.',
        'O ingresso inclui **matcha e um doce** na casa de chá — sentem-se no tatame, é a pausa do dia. Quase ninguém entra porque a entrada parece cara; é o melhor ¥1.000 de Arashiyama.',
      ],
    },
    {
      id: 'jojakkoji',
      photoCaption: 'O pagode de Jōjakkō-ji entre os bordos.',
      n: 6, x: 232, y: 250, kind: 'temple', label: 'Jōjakkō-ji', side: 'right', walk: '6 min',
      coords: { lat: 35.0213, lng: 135.6706 },
      title: 'Jōjakkō-ji — o templo dos bordos',
      jp: '常寂光寺',
      facts: '**09:00–17:00** · ¥500 · escadaria de 200 degraus',
      paragraphs: [
        'Um templo pequeno numa encosta inteira de **bordos**, com um pagode de dois andares no meio da mata e a escadaria coberta de folhas vermelhas em fim de novembro. É o lugar de outono de Arashiyama que os moradores escolhem, enquanto os turistas ficam no bambu.',
        'Do alto vê-se a planície de Sagano e a cidade. Não tem cerca: o portão de sapé fica aberto e o jardim é a montanha.',
      ],
    },
    {
      id: 'togetsukyo',
      photoCaption: 'A ponte Togetsukyō sobre o rio Katsura.',
      n: 7, x: 204, y: 540, kind: 'water', label: 'Togetsukyō', side: 'right', walk: '15 min',
      coords: { lat: 35.0128, lng: 135.6777 },
      title: 'Togetsukyō — a ponte que a lua atravessa',
      jp: '渡月橋',
      facts: '155 m · a atual é de **1934**, de concreto vestido de madeira',
      paragraphs: [
        'O nome vem de um imperador do século XIII que, vendo a lua se mover sobre o rio numa noite de barco, disse que ela "parecia atravessar a ponte". Há uma ponte aqui desde 836.',
        'Do meio da ponte, olhando para as montanhas, está a **vista clássica de Arashiyama**: o rio, os barcos, a encosta vermelha. A superstição local manda **não olhar para trás** ao atravessar depois de um rito de passagem (o Jūsan-mairi, dos 13 anos), senão se perde a sabedoria recém-ganha.',
      ],
    },
    {
      id: 'macacos',
      photoCaption: 'Os macacos de Iwatayama, com Kyoto ao fundo.',
      n: 8, x: 110, y: 590, kind: 'fox', label: 'Parque dos macacos', side: 'right', walk: '20 min (subida)',
      coords: { lat: 35.0094, lng: 135.6773 },
      title: 'Iwatayama — o parque dos macacos',
      jp: '嵐山モンキーパーク いわたやま',
      facts: '**09:00–16:00** (nov) · ¥800 · subida de 20 min · do outro lado da ponte',
      paragraphs: [
        'Uns **120 macacos japoneses** soltos no alto do morro, com a cidade inteira lá embaixo. A graça é a inversão: **as pessoas ficam dentro de uma cabana com grade** e alimentam os macacos por ela; do lado de fora, eles andam livres.',
        'Regras: não encarar, não agachar, não mostrar comida fora da cabana. A subida é de verdade (160 m), então é opcional para quem já fez o bambuzal e a vila — mas a vista do topo é a melhor de Arashiyama.',
      ],
    },
    {
      id: 'rua',
      photoCaption: 'A rua principal de Arashiyama, entre a ponte e a estação.',
      n: 9, x: 270, y: 500, kind: 'food', label: 'Rua principal', side: 'left', walk: '5 min',
      coords: { lat: 35.0152, lng: 135.6780 },
      title: 'A rua principal — o que comer',
      jp: '嵐山メインストリート',
      facts: 'Lojas **10:00–17:00** · tudo fecha cedo',
      paragraphs: [
        'Entre a ponte e a estação Keifuku, a rua de comida de Arashiyama. O que é daqui: **yudōfu** (tofu cozido, a comida dos templos zen — o Shigetsu, dentro de Tenryū-ji, faz o refinado), **croquete de wagyu** da Nakamuraya (fila, ¥300, vale), **yatsuhashi** e doces de matcha.',
        'O **% Arabica** de Arashiyama, na beira do rio, é o café mais fotografado do Japão. Fila de 30 minutos por um latte; a vista da janela é a razão.',
      ],
    },
    {
      id: 'torokko',
      photoCaption: 'O Torokko, o trem lento do desfiladeiro do Hozu.',
      n: 10, x: 200, y: 110, kind: 'station', label: 'Torokko / Hozugawa', side: 'left', walk: '10 min da estação',
      coords: { lat: 35.0187, lng: 135.6803 },
      title: 'Torokko e o desfiladeiro do Hozu',
      jp: '嵯峨野トロッコ列車 · 保津川',
      facts: '**25 min** · ¥880 · reservado · Saga → Kameoka; volta de trem comum ou de barco',
      paragraphs: [
        'O **Torokko** é um trem de madeira, aberto, que anda a 25 km/h por 7 km de desfiladeiro, na linha antiga que a JR abandonou. Em fins de novembro é o trecho de folhagem mais famoso de Kyoto. Sentem-se do **lado direito** na ida (o rio fica mais tempo desse lado); o vagão 5, "Rich", é todo aberto.',
        'Quem quiser fechar o circuito: de Kameoka, o **barco do Hozugawa** desce o rio de volta a Arashiyama em 2 horas de corredeiras leves (¥4.500). É caro e é a experiência mais bonita da região. Se o tempo estiver ruim, fica só o trem.',
      ],
    },
  ],
  legend: 'Verde escuro = a montanha · azul = o rio Katsura/Hozu · hastes verdes = o bambuzal · pontilhado = o Torokko',
};

const parqueDaPaz: PlaceMap = {
  id: 'parque-da-paz',
  coverHotspotId: 'domo',
  stopId: 'd23-parque-domo',
  dayId: 'd2026-11-23',
  title: 'Parque da Paz',
  jp: '平和記念公園',
  subtitle: 'O que há em cada ponto do parque, e por que ele foi construído onde foi',
  intro: [
    'O parque ocupa a ponta da ilha entre dois braços do rio Ōta, onde ficava o bairro comercial mais movimentado de Hiroshima — Nakajima, com 6.500 moradores, apagado inteiro às 8h15 do dia 6 de agosto de 1945. O parque não foi feito num lugar vazio: **ele é o lugar**.',
    'O desenho é de **Kenzō Tange** (1954) e tem um eixo: do museu, passando pelo cenotáfio e pela chama, a linha reta aponta para o Domo, do outro lado do rio. Percorram nessa ordem, do sul para o norte, e terminem no Domo com a luz baixa.',
  ],
  viewBox: '0 0 360 660',
  scenery: [
    { d: 'M20 40 L340 40 L340 650 L20 650 Z', fill: MAP_COLORS.forest, opacity: 0.06 },
    // os dois braços do rio em volta da ilha
    { d: 'M40 40 C60 200 40 400 70 650 L100 650 C80 400 100 200 80 40 Z', fill: MAP_COLORS.water, opacity: 0.25 },
    { d: 'M280 40 C300 200 300 400 270 650 L300 650 C330 400 330 200 310 40 Z', fill: MAP_COLORS.water, opacity: 0.25 },
    // o rio que corta ao norte, com o Domo do outro lado
    { d: 'M90 150 C160 130 220 130 290 150 L290 178 C220 158 160 158 90 178 Z', fill: MAP_COLORS.water, opacity: 0.25 },
    // ponte Aioi, em T
    { d: 'M100 164 L280 164 M188 164 L188 120', stroke: MAP_COLORS.ink, width: 4, opacity: 0.5, round: true },
    // o eixo de Tange: museu → cenotáfio → chama → domo
    { d: 'M188 600 L188 100', stroke: MAP_COLORS.vermilion, width: 2, dash: '6 6', opacity: 0.55 },
    // caminho
    { d: 'M188 610 C188 560 150 540 150 500 C150 460 188 440 188 400 C188 360 150 340 150 300 C150 260 188 240 188 200', stroke: MAP_COLORS.muted, width: 13, opacity: 0.3, round: true },
    // o Domo, desenhado: paredes e a cúpula de ferro
    { d: 'M232 118 L232 92 L276 92 L276 118 M238 92 C242 70 266 70 270 92 M242 84 L266 84 M254 70 L254 92', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.6, round: true },
    // cenotáfio, o arco
    { d: 'M170 420 C176 396 200 396 206 420', stroke: MAP_COLORS.ink, width: 3, opacity: 0.55, round: true },
    // museu, o bloco sobre pilotis
    { d: 'M120 600 L256 600 M126 600 L126 612 M160 600 L160 612 M216 600 L216 612 M250 600 L250 612', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.5, round: true },
  ],
  trees: [
    { x: 120, y: 260, s: 20 }, { x: 250, y: 280, s: 22 }, { x: 120, y: 360, s: 20 }, { x: 250, y: 380, s: 22 },
    { x: 125, y: 470, s: 20 }, { x: 250, y: 500, s: 20 }, { x: 240, y: 560, s: 18 },
  ],
  hotspots: [
    {
      id: 'museu',
      photoCaption: 'O museu de Kenzō Tange, o bloco sobre pilotis que abre o eixo.',
      n: 1, x: 188, y: 612, kind: 'hall', label: 'Museu da Paz', side: 'left',
      coords: { lat: 34.3915, lng: 132.4530 },
      title: 'Museu Memorial da Paz',
      jp: '広島平和記念資料館',
      facts: '**08:30–18:00** (nov) · ¥200 · **1h30 a 2h** · áudio-guia em inglês ¥400',
      paragraphs: [
        'Comecem por aqui, não terminem: o parque muda depois do museu. O prédio de **1955**, de Kenzō Tange, é um bloco erguido sobre pilotis para que a vista atravesse por baixo dele, em linha reta, até o Domo. Foi a primeira obra japonesa do pós-guerra a virar referência mundial de arquitetura.',
        'A exposição, renovada em 2019, tirou os manequins de cera e ficou com **objetos**: o relógio parado às 8h15, a lancheira carbonizada de um menino de 12 anos, a sombra de uma pessoa queimada no degrau do banco. É difícil e é para ser.',
        'Guardem 15 minutos no fim para a **sala dos sobreviventes**: vídeos de *hibakusha* contando, em inglês legendado. Depois, silêncio no parque por alguns minutos antes de seguir.',
      ],
    },
    {
      id: 'cenotafio',
      photoCaption: 'O cenotáfio: o arco enquadra a chama e, atrás, o Domo.',
      n: 2, x: 188, y: 420, kind: 'stone', label: 'Cenotáfio', side: 'right', walk: '3 min',
      coords: { lat: 34.3935, lng: 132.4525 },
      title: 'Cenotáfio — os nomes',
      jp: '原爆死没者慰霊碑',
      facts: 'O arco de pedra com o cofre embaixo · alinhado com a chama e o Domo',
      paragraphs: [
        'Debaixo do arco há um **cofre de pedra com os livros de nomes de todas as vítimas conhecidas**: mais de 340.000, e a lista cresce a cada 6 de agosto, quando os *hibakusha* que morreram no ano são acrescentados. A inscrição diz "Descansem em paz, pois o erro não se repetirá" — e a frase é deliberadamente sem sujeito: não diz quem errou.',
        'Fiquem um momento no ponto exato em frente ao arco: ele foi desenhado para **enquadrar a Chama da Paz e o Domo** numa única linha. É a fotografia mais conhecida do parque, e é intencional.',
      ],
    },
    {
      id: 'chama',
      photoCaption: 'A Chama da Paz, acesa desde 1964.',
      n: 3, x: 150, y: 380, kind: 'stone', label: 'Chama da Paz', side: 'right', walk: '1 min',
      coords: { lat: 34.3943, lng: 132.4527 },
      title: 'A Chama da Paz',
      jp: '平和の灯',
      facts: 'Acesa em **1964** · só vai apagar quando a última arma nuclear sumir',
      paragraphs: [
        'Arde sem interrupção desde 1º de agosto de 1964, e a promessa da cidade é que **só será apagada quando não existir mais nenhuma arma nuclear no mundo**. O pedestal é de Tange, com a forma de duas mãos abertas para o céu.',
        'O fogo foi trazido de várias fontes: fogos sagrados de templos e, entre eles, a **chama do Monte Misen, em Miyajima**, que a tradição diz arder desde Kūkai, em 806. Vocês vão vê-la amanhã, no cume — é o mesmo fogo.',
      ],
    },
    {
      id: 'criancas',
      photoCaption: 'O monumento das crianças, com Sadako no alto e os tsurus em volta.',
      n: 4, x: 188, y: 300, kind: 'stone', label: 'Sadako', side: 'right', walk: '2 min',
      coords: { lat: 34.3955, lng: 132.4527 },
      title: 'Monumento das crianças — Sadako e os mil tsurus',
      jp: '原爆の子の像',
      facts: 'A estátua da menina com o tsuru · vitrines de tsurus de papel em volta',
      paragraphs: [
        '**Sadako Sasaki** tinha 2 anos na bomba e desenvolveu leucemia aos 12. Acreditando na lenda de que quem dobra mil tsurus ganha um desejo, dobrou mais de mil no hospital, com papel de remédio, e morreu em outubro de 1955. Os colegas de escola levantaram dinheiro no país inteiro e o monumento é de 1958.',
        'Em volta, vitrines com **milhões de tsurus de papel** enviados de escolas do mundo todo — uns 10 milhões por ano. O sino embaixo da estátua tem um tsuru de badalo; toquem uma vez. Se quiserem deixar tsurus, há uma caixa para isso.',
      ],
    },
    {
      id: 'sino',
      photoCaption: 'O Sino da Paz, com o mapa-múndi sem fronteiras.',
      n: 5, x: 112, y: 250, kind: 'stone', label: 'Sino da Paz', side: 'right', walk: '2 min',
      coords: { lat: 34.3962, lng: 132.4520 },
      title: 'O Sino da Paz',
      jp: '平和の鐘',
      facts: 'Sob o pavilhão junto ao lago de lótus · pode tocar',
      paragraphs: [
        'Um sino de bronze de 1964 num pavilhão sobre um lago de lótus. O relevo é um **mapa-múndi sem fronteiras**, e o ponto onde o badalo bate é um **símbolo atômico**. Toquem: é permitido e é a intenção. O som está na lista dos 100 sons a preservar do Japão.',
      ],
    },
    {
      id: 'monte',
      photoCaption: 'O monte memorial: 70 mil pessoas sem nome, embaixo da grama.',
      n: 6, x: 256, y: 250, kind: 'stone', label: 'Monte memorial', side: 'right', walk: '1 min',
      coords: { lat: 34.3960, lng: 132.4535 },
      title: 'O monte memorial — os sem nome',
      jp: '原爆供養塔',
      facts: 'O morro de grama com o pagode pequeno no topo',
      paragraphs: [
        'Parece um jardim. Embaixo dele estão **as cinzas de cerca de 70.000 pessoas que nunca foram identificadas** — recolhidas dos escombros e das cremações improvisadas dos dias seguintes. Uma parte tem nome mas nunca foi reclamada; a lista fica afixada no lugar e o município ainda procura as famílias, oitenta anos depois.',
        'É o ponto do parque que menos gente nota, e o que mais explica onde vocês estão.',
      ],
    },
    {
      id: 'rest-house',
      photoCaption: 'O Rest House: o prédio que estava a 170 m do hipocentro.',
      n: 7, x: 262, y: 330, kind: 'hall', label: 'Rest House', side: 'right', walk: '2 min',
      coords: { lat: 34.3950, lng: 132.4538 },
      title: 'Rest House — o sobrevivente do porão',
      jp: 'レストハウス',
      facts: 'O prédio de informações turísticas, de 1929 · porão aberto à visita, grátis',
      paragraphs: [
        'Uma loja de quimonos de 1929, a **170 metros do hipocentro**. O prédio resistiu; das 37 pessoas dentro dele, sobreviveu **uma**, Eizō Nomura, que estava no porão buscando documentos. Ele viveu até os 84 anos.',
        'O porão foi mantido como estava e pode ser visitado. Hoje o térreo é o centro de informações turísticas do parque — e a loja de lembranças. Os dois usos convivem, e isso é Hiroshima.',
      ],
    },
    {
      id: 'aioi',
      photoCaption: 'A ponte Aioi, em T, o alvo escolhido pelo bombardeiro.',
      n: 8, x: 188, y: 164, kind: 'water', label: 'Ponte Aioi', side: 'right', walk: '3 min',
      coords: { lat: 34.3968, lng: 132.4530 },
      title: 'Ponte Aioi — o alvo',
      jp: '相生橋',
      facts: 'A ponte em forma de **T** sobre a bifurcação do rio',
      paragraphs: [
        'A tripulação do Enola Gay escolheu esta ponte como **ponto de mira** porque sua forma de T era inconfundível do ar, a 9.000 metros. A bomba explodiu 300 metros a sudeste e 600 metros acima — sobre o hospital Shima, hoje reconstruído no mesmo lugar, com uma placa discreta no muro.',
        'A ponte atual é de 1983; a original, torta pela explosão, ficou em uso até então. Do meio dela se tem a vista do Domo com o rio, que é a imagem para o fim da tarde.',
      ],
    },
    {
      id: 'domo',
      photoCaption: 'O Domo da Bomba Atômica, mantido como ficou em 1945.',
      n: 9, x: 188, y: 100, kind: 'hall', label: 'Domo', side: 'left', walk: '2 min',
      coords: { lat: 34.3955, lng: 132.4536 },
      title: 'O Domo da Bomba Atômica',
      jp: '原爆ドーム',
      facts: 'Patrimônio Mundial desde **1996** · iluminado à noite · só por fora',
      paragraphs: [
        'Era o **Salão de Promoção Industrial** da província, de 1915, obra de um arquiteto tcheco, Jan Letzel. A bomba explodiu **quase em cima dele** — 160 metros ao lado, 600 acima. Por isso ficou de pé: a onda de choque veio de cima, vertical, e não derrubou as paredes; queimou tudo o que havia dentro e matou todos que estavam lá.',
        'Nos anos 1960 a cidade debateu demolir. Uma menina que morreu de leucemia aos 16 escreveu num diário que "aquele Salão Industrial assustador" deveria ficar para sempre como aviso — e o diário decidiu a votação. O prédio passa por reforço estrutural a cada poucos anos para **continuar exatamente como está**, e a China e os EUA se opuseram à inscrição na Unesco.',
        'Vejam de dia e voltem à noite, iluminado, do outro lado do rio. Os dois são o Domo, e são diferentes.',
      ],
    },
    {
      id: 'okonomimura',
      photoCaption: 'Okonomimura: três andares de chapas de okonomiyaki.',
      n: 10, x: 300, y: 600, kind: 'food', label: 'Okonomimura', side: 'left', walk: '10 min',
      coords: { lat: 34.3924, lng: 132.4607 },
      title: 'Okonomimura — o prédio do okonomiyaki',
      jp: 'お好み村',
      facts: '**11:00–22:00** · 25 balcões em 3 andares · ~¥1.000–1.400 o prato',
      paragraphs: [
        'O okonomiyaki de Hiroshima **não se mistura**: é em camadas — massa fina, montanha de repolho, broto de feijão, bacon, e embaixo de tudo o **macarrão yakisoba**, com ovo por cima e o molho Otafuku, que é daqui. A briga com Osaka (que mistura tudo) é séria e antiga.',
        'O Okonomimura é um prédio com 25 balcões, cada um com sua chapa e seu cozinheiro. Todos são bons; escolham o que tiver lugar no balcão, sentem de frente para a chapa e peçam "soba iri" (com macarrão). A cerveja é da geladeira ao lado, você mesmo pega.',
      ],
    },
  ],
  legend: 'Azul = os braços do rio Ōta · tracejado vermelho = o eixo de Tange, do museu ao Domo · faixa cinza = o percurso',
};

const himeji: PlaceMap = {
  id: 'himeji',
  coverHotspotId: 'tenshu',
  stopId: 'd25-himeji',
  dayId: 'd2026-11-25',
  title: 'Castelo de Himeji',
  jp: '姫路城',
  subtitle: 'O labirinto de defesa em espiral, portão a portão, até o torreão',
  intro: [
    'Himeji não é um prédio: é um **sistema**. Da entrada ao torreão são 21 portões, e o caminho sobe em espiral, estreita, dobra em ângulo reto e às vezes desce de propósito, para desorientar quem invade e deixá-lo o maior tempo possível sob fogo das muralhas. Vocês vão percorrer o labirinto como ele foi desenhado para ser percorrido.',
    'A forma que está aí é de **1601–1609**, obra de Ikeda Terumasa, genro de Tokugawa Ieyasu. Nunca foi atacado, nunca queimou, escapou dos bombardeios de 1945 (uma bomba incendiária caiu no último andar e não explodiu). É o castelo japonês mais intacto que existe.',
  ],
  viewBox: '0 0 360 640',
  scenery: [
    { d: 'M20 40 L340 40 L340 630 L20 630 Z', fill: MAP_COLORS.forest, opacity: 0.06 },
    // fosso externo
    { d: 'M60 590 L300 590 L300 120 L60 120 Z', stroke: MAP_COLORS.water, width: 10, opacity: 0.35 },
    // muralhas em espiral (esquemáticas)
    { d: 'M90 560 L270 560 L270 180 L110 180 L110 460 L230 460 L230 250 L150 250 L150 400 L200 400', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.3, round: true },
    // caminho, em espiral até o torreão
    { d: 'M180 610 L180 560 C220 560 250 540 250 500 C250 470 200 470 170 470 C130 470 130 420 150 400 C170 380 210 380 214 350 C218 320 190 300 176 290', stroke: MAP_COLORS.muted, width: 12, opacity: 0.3, round: true },
    // o torreão, em silhueta (cinco telhados)
    { d: 'M150 290 L206 290 L206 270 L156 270 Z M158 270 L204 270 L200 250 L162 250 Z M164 250 L198 250 L194 232 L168 232 Z M170 232 L192 232 L188 216 L174 216 Z M176 216 L186 216 L181 204 Z', fill: MAP_COLORS.paper, stroke: MAP_COLORS.ink, width: 2, opacity: 0.7 },
    // Nishi-no-maru, o corredor comprido a oeste
    { d: 'M104 340 L104 240', stroke: MAP_COLORS.ink, width: 6, opacity: 0.35, round: true },
    // Kōko-en, o jardim ao lado, fora do fosso
    { d: 'M40 470 C50 440 90 440 100 470 C110 500 70 520 50 500 C40 490 36 480 40 470 Z', fill: MAP_COLORS.forest, opacity: 0.25 },
  ],
  trees: [
    { x: 300, y: 300, s: 20 }, { x: 320, y: 420, s: 22 }, { x: 60, y: 160, s: 20 }, { x: 300, y: 150, s: 20 },
    { x: 60, y: 560, s: 22 }, { x: 300, y: 560, s: 20 },
  ],
  hotspots: [
    {
      id: 'otemae',
      photoCaption: 'O castelo no fim da avenida, visto da estação.',
      n: 1, x: 180, y: 612, kind: 'station', label: 'Avenida Ōtemae', side: 'left',
      coords: { lat: 34.8262, lng: 134.6902 },
      title: 'Ōtemae-dōri — a avenida que mira o castelo',
      jp: '大手前通り',
      facts: 'Da estação ao portão: **15 min a pé** em linha reta, ou ônibus 100 (¥100)',
      paragraphs: [
        'Saindo da estação JR pela saída norte, o castelo já está lá, **branco, no fim da avenida**, a 1 km. A cidade foi replanejada depois de 1945 justamente para essa vista: nada mais alto na linha do olhar. A caminhada pela Ōtemae-dōri é o preâmbulo certo; o ônibus de ¥100 é para a volta, com as pernas mortas.',
        'O apelido é **Shirasagi-jō**, "castelo da garça branca", pelo reboco de cal que cobre tudo, inclusive as telhas, como proteção contra fogo. A restauração de 2009–2015 deixou-o tão branco que os moradores chamaram de "castelo do sabão em pó"; já escureceu um pouco desde então.',
      ],
    },
    {
      id: 'otemon',
      photoCaption: 'O portão Ōtemon, a entrada pelo fosso.',
      n: 2, x: 180, y: 560, kind: 'gate', label: 'Ōtemon', side: 'right', walk: '15 min',
      coords: { lat: 34.8330, lng: 134.6935 },
      title: 'Ōtemon — a entrada pelo fosso',
      jp: '大手門',
      facts: 'Recinto externo (Sannomaru) **grátis** · bilheteria do castelo lá dentro, ¥1.000 (¥1.050 com o jardim)',
      paragraphs: [
        'A ponte de madeira sobre o fosso e o portão de entrada. O que se vê daqui — o gramado imenso do **Sannomaru**, com o castelo ao fundo — é a área onde ficavam os palácios dos vassalos, demolidos na era Meiji. Sobrou o vazio, que hoje é o lugar da foto de corpo inteiro com o torreão.',
        'Em dias de pico (feriados, cerejeira) o castelo limita a entrada a 15.000 pessoas e distribui senhas por horário. Numa terça de fim de novembro, não haverá fila.',
      ],
    },
    {
      id: 'hishinomon',
      photoCaption: 'Hishi-no-mon, o maior portão, com o brasão de losango.',
      n: 3, x: 250, y: 500, kind: 'gate', label: 'Hishi-no-mon', side: 'right', walk: '5 min',
      coords: { lat: 34.8383, lng: 134.6928 },
      title: 'Hishi-no-mon — o portão do losango',
      jp: '菱の門',
      facts: 'O maior dos 21 portões · aqui começa o labirinto',
      paragraphs: [
        'O portão principal do recinto interno, o mais imponente dos 21, decorado com o **brasão de losango** (*hishi*) e janelas em arco no estilo dos palácios de Momoyama — o castelo queria intimidar e impressionar ao mesmo tempo. A partir daqui a arquitetura vira uma armadilha.',
        'Olhem para as paredes: as **aberturas** em círculo, triângulo e quadrado (*sama*) são seteiras para arcabuz e flecha, quase 1.000 no castelo inteiro, todas apontadas para o caminho onde vocês vão andar.',
      ],
    },
    {
      id: 'espiral',
      photoCaption: 'O caminho que estreita, dobra e sobe em zigue-zague.',
      n: 4, x: 170, y: 470, kind: 'gate', label: 'O labirinto', side: 'right', walk: '5 min',
      coords: { lat: 34.8388, lng: 134.6920 },
      title: 'Os portões I, Ro, Ha, Ni — o labirinto',
      jp: 'いの門・ろの門・はの門・にの門',
      facts: 'Os portões têm nomes de sílabas (i, ro, ha, ni…) na ordem do silabário antigo',
      paragraphs: [
        'Daqui ao torreão o caminho **parece ir para longe dele**: dobra à esquerda, estreita até caber uma pessoa, sobe uma escada que vira um portão baixo (o Ni-no-mon obriga a abaixar a cabeça, e quem abaixa a cabeça não vê o que vem de cima), e então desce — sim, desce — antes de subir de novo. Cada dobra é um lugar onde o invasor ficaria parado sob as seteiras.',
        'Os nomes dos portões seguem a ordem *i-ro-ha-ni-ho-he-to*, o "abc" japonês antigo, e a ordem física foi embaralhada de propósito. Entre o Hishi-no-mon e o torreão são 200 metros em linha reta; a pé, quase 800.',
      ],
    },
    {
      id: 'okiku',
      photoCaption: 'O poço de Okiku, o fantasma que conta pratos.',
      n: 5, x: 150, y: 400, kind: 'water', label: 'Poço de Okiku', side: 'right', walk: '3 min',
      coords: { lat: 34.8394, lng: 134.6928 },
      title: 'O poço de Okiku',
      jp: 'お菊井戸',
      facts: 'O poço fundo com grade, pouco antes do torreão',
      paragraphs: [
        'A lenda de fantasma mais famosa do Japão começa aqui. **Okiku**, uma criada, descobriu uma conspiração contra o senhor do castelo; o conspirador, para calá-la, escondeu um dos **dez pratos** de um jogo precioso e a acusou do sumiço. Torturada, foi jogada no poço. Desde então, à noite, ouve-se uma voz contar pratos: "um… dois… nove…" e um grito no lugar do décimo.',
        'A história virou peça de kabuki, filme, e uma menina saindo de um poço num filme de 1998 que vocês conhecem. O poço é real e tem 10 metros; a grade é para os pratos não sumirem.',
      ],
    },
    {
      id: 'tenshu',
      photoCaption: 'O torreão principal, seis andares por dentro, cinco por fora.',
      n: 6, x: 181, y: 292, kind: 'hall', label: 'Torreão', side: 'right', walk: '5 min',
      coords: { lat: 34.8394, lng: 134.6939 },
      title: 'O torreão principal — por dentro',
      jp: '大天守',
      facts: '**46 m** · 6 andares por dentro (parecem 5 por fora) · escadas íngremes, de meia',
      paragraphs: [
        'Tirem os sapatos e subam. Não há salões pintados nem tatames: o torreão **nunca foi residência**, era depósito de armas e último refúgio. O que se vê são as **duas colunas centrais** de abeto, com 25 metros cada e 400 anos, que atravessam o prédio inteiro; os suportes de lança nas paredes; e as *ishi-otoshi*, as aberturas no chão para jogar pedras em quem sobe.',
        'Cada andar é menor que o de baixo e as escadas ficam mais íngremes: a intenção é que um exército invasor, se chegasse até aqui, entrasse em fila indiana. Vocês vão entrar em fila indiana também.',
        'A restauração de 2009–2015 desmontou o telhado inteiro, 75.000 telhas, e remontou. A anterior, de 1956–64, tinha trocado as colunas. Um castelo de madeira é uma coisa que se reconstrói continuamente para continuar a mesma.',
      ],
    },
    {
      id: 'osakabe',
      photoCaption: 'O topo: o pequeno santuário e Himeji inteira embaixo.',
      n: 7, x: 214, y: 350, kind: 'view', label: 'Topo · Osakabe', side: 'right', walk: '6 andares',
      coords: { lat: 34.8395, lng: 134.6940 },
      title: 'O último andar e o santuário Osakabe',
      jp: '刑部神社',
      facts: 'Vista de 360° · o santuário no meio do andar',
      paragraphs: [
        'No topo há um santuário xintoísta minúsculo, o **Osakabe**, dedicado a uma deusa que a lenda diz morar no castelo desde antes dele existir — e que só o senhor do castelo podia encontrar, uma vez por ano. Quando o castelo foi construído, ela foi "convidada" a ficar no último andar para não sabotar a obra.',
        'A vista: a cidade inteira, o mar de Harima ao sul e, em dia limpo, as montanhas de Shikoku. Reparem nos **shachihoko** dos telhados, os peixes-tigre de terracota que "cospem água" contra incêndio.',
      ],
    },
    {
      id: 'nishinomaru',
      photoCaption: 'O corredor de 300 metros do Nishi-no-maru.',
      n: 8, x: 104, y: 290, kind: 'hall', label: 'Nishi-no-maru', side: 'left', walk: '10 min (descendo)',
      coords: { lat: 34.8386, lng: 134.6912 },
      title: 'Nishi-no-maru — o corredor da princesa',
      jp: '西の丸 百間廊下',
      facts: 'Corredor de **300 m** com os quartos das damas · incluído no ingresso',
      paragraphs: [
        'O recinto oeste foi construído para a **princesa Sen** (Senhime), neta de Ieyasu, que viveu aqui depois que o primeiro marido morreu no cerco de Osaka, em 1615. O corredor coberto de 300 metros conecta os quartos das damas de companhia — dezenas de cômodos de madeira, cada um com sua janela para o pátio.',
        'É a única parte do castelo onde alguém de fato morava, e é vazia de gente: quase todo mundo vai embora depois do torreão. A vista do torreão daqui, por cima das muralhas, é a melhor do recinto.',
      ],
    },
    {
      id: 'kokoen',
      photoCaption: 'Kōko-en, os nove jardins nas ruínas das casas dos samurais.',
      n: 9, x: 70, y: 480, kind: 'view', label: 'Kōko-en', side: 'right', walk: '5 min',
      coords: { lat: 34.8368, lng: 134.6893 },
      title: 'Kōko-en — os nove jardins',
      jp: '好古園',
      facts: '**09:00–17:00** · ¥310 (ou ¥50 a mais no ingresso do castelo) · casa de chá com matcha ¥500',
      paragraphs: [
        'Nove jardins murados no terreno onde ficavam as residências dos samurais, construídos em **1992** para os 100 anos da cidade — e feitos com tanta técnica que parecem ter 400. O maior tem o lago com carpas e a vista do castelo por cima do muro; há um jardim de bambu, um de pinheiros, um de chá.',
        'Em fim de novembro os bordos do jardim principal estão vermelhos, e o Kōko-en faz iluminação noturna. É onde se descansa depois do labirinto, com um matcha na casa de chá.',
      ],
    },
    {
      id: 'almoco',
      photoCaption: 'Oden de Himeji: com gengibre e molho de soja, o jeito daqui.',
      n: 10, x: 300, y: 610, kind: 'food', label: 'Oden de Himeji', side: 'left', walk: 'no caminho da estação',
      coords: { lat: 34.8290, lng: 134.6910 },
      title: 'O que comer — oden com gengibre',
      jp: '姫路おでん',
      facts: 'Na galeria coberta **Miyuki-dōri**, entre o castelo e a estação',
      paragraphs: [
        'A especialidade local é o **oden de Himeji**: os mesmos cozidos de rabanete, ovo e bolinho de peixe do resto do país, mas comidos com **molho de soja com gengibre ralado**, não com mostarda. Parece detalhe e muda tudo.',
        'A galeria Miyuki-dōri, coberta, liga a avenida do castelo à estação e concentra os restaurantes. Também daqui: **anagomeshi** (enguia-do-mar sobre arroz, a mesma de Miyajima) e o **almond butter toast** dos cafés da cidade, uma mania local desde os anos 1960.',
      ],
    },
  ],
  legend: 'Azul = o fosso · linhas finas = as muralhas em espiral · faixa cinza = o percurso pelos portões · verde = o jardim Kōko-en',
};

const meijiJingu: PlaceMap = {
  id: 'meiji-jingu',
  coverHotspotId: 'otorii',
  stopId: 'd22-meiji-jingu',
  dayId: 'd2026-11-22',
  title: 'Meiji Jingū',
  jp: '明治神宮',
  subtitle: 'A floresta artificial no meio de Tóquio, do portão de Harajuku ao salão',
  intro: [
    'Uma floresta de 70 hectares onde há 100 anos era pasto. Foi **plantada à mão** entre 1915 e 1920, com 100.000 árvores doadas de todo o país e um plano de 150 anos para virar mata nativa sozinha — e virou antes do prazo. O barulho de Harajuku some nos primeiros 50 metros.',
    'O trajeto é a alameda de cascalho do portão até o salão: **15 minutos** de caminhada por dentro da mata, com o santuário no fim. Domingo de manhã é quando aparecem os casamentos xintoístas, com o cortejo atravessando o pátio.',
  ],
  viewBox: '0 0 360 640',
  scenery: [
    { d: 'M20 40 L340 40 L340 630 L20 630 Z', fill: MAP_COLORS.forest, opacity: 0.16 },
    // clareira do santuário
    { d: 'M110 140 L250 140 L250 240 L110 240 Z', fill: MAP_COLORS.paper, opacity: 0.6 },
    // alameda de cascalho (curva de propósito: o salão não se vê da entrada)
    { d: 'M290 600 C240 590 200 560 180 520 C160 480 120 460 116 410 C112 360 150 330 180 300 C200 280 180 250 180 240', stroke: MAP_COLORS.muted, width: 16, opacity: 0.35, round: true },
    // trilhos da JR / Harajuku, à direita
    { d: 'M330 40 L330 630', stroke: MAP_COLORS.water, width: 4, opacity: 0.4 },
    { d: 'M330 40 L330 630', stroke: MAP_COLORS.paper, width: 4, dash: '4 10' },
    // o grande torii
    { d: 'M96 430 L96 396 M136 430 L136 396 M86 398 L146 398 M90 388 C104 384 128 384 142 388 L142 393 C128 389 104 389 90 393 Z', stroke: MAP_COLORS.ink, width: 3.5, opacity: 0.6, round: true },
    // barris de saquê (fileira)
    { d: 'M254 470 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M276 470 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M298 470 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M265 452 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M287 452 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0', stroke: MAP_COLORS.gold, width: 2, opacity: 0.6 },
    // salão principal
    { d: 'M150 200 C164 180 196 180 210 200 M156 200 L156 220 L204 220 L204 200', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.55, round: true },
    // lago do jardim interno
    { d: 'M60 300 C80 286 110 292 112 310 C114 328 84 340 66 330 C52 322 48 308 60 300 Z', fill: MAP_COLORS.water, opacity: 0.3 },
  ],
  trees: [
    { x: 50, y: 580, s: 22 }, { x: 90, y: 540, s: 20 }, { x: 240, y: 560, s: 22 }, { x: 60, y: 460, s: 22 },
    { x: 220, y: 380, s: 20 }, { x: 280, y: 320, s: 22 }, { x: 60, y: 200, s: 22 }, { x: 290, y: 200, s: 20 },
    { x: 120, y: 100, s: 22 }, { x: 250, y: 90, s: 20 }, { x: 60, y: 380, s: 18 }, { x: 290, y: 430, s: 20 },
  ],
  hotspots: [
    {
      id: 'harajuku',
      photoCaption: 'A estação de Harajuku, porta da floresta.',
      n: 1, x: 300, y: 600, kind: 'station', label: 'Estação Harajuku', side: 'left',
      coords: { lat: 35.6702, lng: 139.7027 },
      title: 'Estação Harajuku',
      jp: '原宿駅',
      facts: 'JR Yamanote · a entrada do santuário fica **colada** à saída oeste',
      paragraphs: [
        'A estação de madeira de 1924, com telhado inglês, foi demolida em 2020 e substituída pelo prédio de vidro — houve protesto e não adiantou. A saída oeste dá direto na ponte e no portão do santuário; a saída leste, na Takeshita-dōri, o outro Harajuku. Os dois mundos se separam aqui em 30 metros.',
      ],
    },
    {
      id: 'otorii',
      photoCaption: 'O grande torii, de uma cânfora de 1.500 anos.',
      n: 2, x: 116, y: 452, kind: 'torii', label: 'O grande torii', side: 'right', walk: '5 min',
      coords: { lat: 35.6738, lng: 139.6993 },
      title: 'O grande torii — a cânfora de Taiwan',
      jp: '大鳥居',
      facts: '**12 m** de altura · o maior torii de madeira do Japão · de **1975**',
      paragraphs: [
        'O primeiro torii, de 1920, foi partido por um raio em 1966. Não havia mais no Japão uma árvore do tamanho necessário para as colunas (1,2 m de diâmetro). Um empresário procurou por anos e achou uma **cânfora de 1.500 anos nas montanhas de Taiwan**, comprou, e o torii atual é ela, montado sem prego.',
        'Passem pelas laterais, com uma leve reverência: é o limiar entre a cidade e o recinto sagrado. A partir daqui a alameda de **cascalho** faz barulho de propósito — é para você ouvir seus próprios passos e desacelerar.',
      ],
    },
    {
      id: 'barris',
      photoCaption: 'A parede de barris de saquê, e do outro lado os de vinho da Borgonha.',
      n: 3, x: 226, y: 470, kind: 'stone', label: 'Barris de saquê', side: 'left', walk: '3 min',
      coords: { lat: 35.6752, lng: 139.7005 },
      title: 'Os barris — saquê de um lado, Borgonha do outro',
      jp: '奉納酒樽',
      facts: 'À direita da alameda · os de vinho ficam em frente',
      paragraphs: [
        'Uma parede de **barris de saquê** doados por produtores de todo o país, com os rótulos pintados. São *kazaridaru*, barris decorativos: estão vazios, o saquê de verdade é oferecido em garrafas. Os deuses recebem a bebida, e a bebida recebe a bênção.',
        'Do outro lado da alameda, **barris de vinho da Borgonha**, doados por produtores franceses em homenagem ao imperador Meiji — o homem que abriu o Japão ao Ocidente em 1868 e que gostava de vinho. Os dois lados juntos contam a história do lugar: tradição e abertura, uma em frente à outra.',
      ],
    },
    {
      id: 'floresta',
      photoCaption: 'A mata plantada há um século, hoje floresta de verdade.',
      n: 4, x: 116, y: 360, kind: 'view', label: 'A floresta', side: 'right', walk: '5 min',
      coords: { lat: 35.6758, lng: 139.6985 },
      title: 'A floresta que foi plantada para parecer eterna',
      jp: '明治神宮の森',
      facts: '**70 ha · ~100.000 árvores** · 3.000 espécies de bicho vivem aqui',
      paragraphs: [
        'Em 1915 a equipe de botânicos, liderada por Seiroku Honda, projetou a floresta em **quatro fases de 50 anos**: primeiro pinheiros de crescimento rápido, depois ciprestes, depois as folhosas nativas (cânfora, castanheiro-da-índia, carvalho), que dominariam por volta de 2070. Aconteceu em 2000. A ideia era que ninguém precisasse cuidar: **cair folha é proibido varrer**, para virar húmus.',
        'Reparem: o caminho **dobra em ângulo reto duas vezes** antes do salão. É intencional — o santuário não se vê da entrada, para que a chegada seja uma descoberta, e para que cada curva desacelere a cabeça mais um pouco.',
      ],
    },
    {
      id: 'kiyomasa',
      photoCaption: 'O poço de Kiyomasa, no jardim interno.',
      n: 5, x: 84, y: 300, kind: 'water', label: 'Jardim interno', side: 'right', walk: '5 min de desvio',
      coords: { lat: 35.6745, lng: 139.6968 },
      title: 'O jardim interno e o poço de Kiyomasa',
      jp: '御苑 · 清正井',
      facts: '**09:00–16:30** (nov) · ¥500 · desvio à esquerda da alameda',
      paragraphs: [
        'O único pedaço que já existia antes do santuário: um jardim de senhores feudais que o imperador Meiji redesenhou para a imperatriz Shōken, com um lago de íris (florescem em junho) e uma casa de chá. É por causa dele que o santuário foi construído aqui.',
        'No fundo fica o **poço de Kiyomasa**, de água cristalina, atribuído a Katō Kiyomasa, o general do século XVI. Em 2009 uma celebridade disse na TV que a foto do poço no celular dava sorte, e a fila chegou a 3 horas. Hoje é tranquilo, e a água é de verdade: 60 litros por minuto, a 15 °C o ano inteiro.',
      ],
    },
    {
      id: 'temizuya',
      photoCaption: 'O temizuya, para lavar as mãos antes de entrar.',
      n: 6, x: 180, y: 262, kind: 'stone', label: 'Temizuya', side: 'right', walk: '3 min',
      coords: { lat: 35.6762, lng: 139.6995 },
      title: 'Temizuya e o portão do sul',
      jp: '手水舎 · 南神門',
      facts: 'A fonte coberta à direita, antes do portão de madeira',
      paragraphs: [
        'O ritual: concha na mão direita, água na esquerda; troca, água na direita; concha na direita, água na esquerda para enxaguar a boca (a mão, não a concha); e por último inclinar a concha para a água escorrer pelo cabo. Tudo com **uma concha só de água**.',
        'O portão de cipreste à frente, o **Minami-shinmon**, é de 1920 e é o único prédio principal que sobreviveu ao bombardeio de 1945; o resto do santuário é de 1958.',
      ],
    },
    {
      id: 'honden',
      photoCaption: 'O pátio do salão principal, onde passam os cortejos de casamento.',
      n: 7, x: 180, y: 200, kind: 'hall', label: 'Salão principal', side: 'left', walk: '1 min',
      coords: { lat: 35.6764, lng: 139.6993 },
      title: 'O salão principal — e os casamentos de domingo',
      jp: '御社殿',
      facts: 'Do **nascer ao pôr do sol** · grátis · dedicado ao imperador Meiji e à imperatriz Shōken',
      paragraphs: [
        'O santuário venera o **imperador Meiji** (1852–1912), que assumiu aos 15 anos e em 45 de reinado viu o Japão sair do feudalismo para ganhar uma guerra contra a Rússia. Ele não está enterrado aqui (o túmulo é em Kyoto); o santuário é o espírito, e foi construído por 110.000 voluntários. Os prédios atuais são de 1958, de cipreste japonês, sem pintura.',
        'Domingo de manhã é quase certo que vocês cruzem com um **casamento xintoísta**: o cortejo atravessa o pátio em fila, com o sacerdote na frente, os noivos sob um guarda-sol vermelho e as famílias atrás, em silêncio. Pode fotografar de longe. Ritual para vocês: moeda, duas reverências, duas palmas, uma reverência.',
      ],
    },
    {
      id: 'meoto',
      photoCaption: 'As duas cânforas casadas, unidas pela corda sagrada.',
      n: 8, x: 250, y: 226, kind: 'fox', label: 'Meoto kusu', side: 'right', walk: '1 min',
      coords: { lat: 35.6762, lng: 139.6997 },
      title: 'Meoto kusu — as cânforas casadas',
      jp: '夫婦楠',
      facts: 'À esquerda do salão, as duas árvores ligadas por uma corda',
      paragraphs: [
        'Duas cânforas plantadas em 1920, unidas por uma **shimenawa**, a corda de palha de arroz que marca o que é sagrado. São o "casal de árvores" e o lugar onde se pede por casamento e harmonia na família — é aqui que os recém-casados param para a foto.',
        'Repare na forma: das duas nasce uma copa só. É o que um século de crescimento lado a lado faz.',
      ],
    },
    {
      id: 'museu',
      photoCaption: 'O Museu Meiji Jingū, de Kengo Kuma, dentro da mata.',
      n: 9, x: 250, y: 330, kind: 'hall', label: 'Museu', side: 'left', walk: '5 min',
      coords: { lat: 35.6742, lng: 139.7020 },
      title: 'Museu Meiji Jingū — Kengo Kuma na floresta',
      jp: '明治神宮ミュージアム',
      facts: '**10:00–16:30**, fecha quinta · ¥1.000 · no caminho de volta',
      paragraphs: [
        'Prédio de 2019 de **Kengo Kuma** (o mesmo do estádio olímpico), baixo, de madeira e vidro, feito para desaparecer entre as árvores. Dentro: a carruagem do imperador, os objetos pessoais do casal, e o vídeo da construção da floresta, com as fotos do pasto de 1915. Vale 40 minutos se vocês quiserem entender o que acabaram de atravessar.',
      ],
    },
    {
      id: 'takeshita',
      photoCaption: 'Takeshita-dōri, o outro lado da estação.',
      n: 10, x: 300, y: 540, kind: 'food', label: 'Takeshita-dōri', side: 'left', walk: '5 min',
      coords: { lat: 35.6713, lng: 139.7050 },
      title: 'Takeshita-dōri — o Harajuku dos crepes',
      jp: '竹下通り',
      facts: 'Do outro lado da estação · lojas **~10:00–20:00** · domingo é o auge',
      paragraphs: [
        'A rua de 350 metros que é o Harajuku das revistas: crepes enrolados de cone (**Marion Crêpes**, desde 1976), algodão-doce arco-íris, lojas de meia e de fantasia. Aos domingos é tão cheia que se anda em fila.',
        'É o contraste exato da floresta de onde vocês vêm, e é por isso que o dia está montado assim: santuário de manhã, Omotesandō (a avenida de árvores logo ao lado, com as lojas de arquitetos) e Shibuya no fim do dia. O roteiro passa por aqui só para atravessar; comprar de verdade é em Ginza.',
      ],
    },
  ],
  legend: 'Verde = a floresta plantada · faixa cinza = a alameda de cascalho · pontilhado azul = os trilhos da Yamanote',
};

const kamakura: PlaceMap = {
  id: 'kamakura',
  coverHotspotId: 'daibutsu',
  stopId: 'd20-engakuji',
  dayId: 'd2026-11-20',
  title: 'Kamakura',
  jp: '鎌倉',
  subtitle: 'Dos templos zen de Kita-Kamakura ao Grande Buda e ao mar',
  intro: [
    'Kamakura é uma cidade num anfiteatro: **montanhas de três lados, mar no quarto**. Foi por isso que os samurais a escolheram como capital em 1185 — só se entra por sete passagens cortadas na rocha. O dia atravessa o anfiteatro de norte a sul: os templos zen na entrada, o santuário no centro, o Grande Buda e o mar no fim.',
    'Descendo em **Kita-Kamakura** (uma estação antes) vocês fazem tudo a pé: Engaku-ji → Kenchō-ji → Hachimangū → Komachi → estação. Depois o **Enoden**, o bondinho, leva ao Grande Buda e à praia. Sem carro, sem táxi.',
  ],
  viewBox: '0 0 360 700',
  scenery: [
    { d: 'M20 40 L340 40 L340 690 L20 690 Z', fill: MAP_COLORS.forest, opacity: 0.07 },
    // montanhas dos dois lados (o anfiteatro)
    { d: 'M20 40 L20 480 L60 400 L90 300 L70 180 L100 40 Z', fill: MAP_COLORS.forest, opacity: 0.2 },
    { d: 'M340 40 L340 480 L300 400 L280 280 L300 180 L270 40 Z', fill: MAP_COLORS.forest, opacity: 0.2 },
    // o mar, embaixo
    { d: 'M-2000 2600 L2360 2600 L2360 610 C300 598 240 622 180 610 C120 598 60 622 -2000 610 Z', fill: MAP_COLORS.water, opacity: 0.22 },
    { d: 'M20 650 C80 642 140 658 200 650 C260 642 300 658 340 650', stroke: MAP_COLORS.water, width: 1.5, opacity: 0.35 },
    // a avenida Wakamiya-ōji (eixo do santuário até o mar)
    { d: 'M180 250 L180 600', stroke: MAP_COLORS.vermilion, width: 2, dash: '6 6', opacity: 0.5 },
    // caminho a pé, de Kita-Kamakura ao santuário e à estação
    { d: 'M180 80 C180 120 150 140 150 180 C150 220 180 230 180 250 C180 300 180 360 180 420', stroke: MAP_COLORS.muted, width: 13, opacity: 0.3, round: true },
    // Enoden (bondinho) da estação para oeste
    { d: 'M180 420 C140 420 110 440 90 470 C70 500 60 540 70 580', stroke: MAP_COLORS.ink, width: 2, dash: '5 5', opacity: 0.5 },
    // torii do Hachimangū
    { d: 'M158 236 L158 214 M202 236 L202 214 M150 216 L210 216 M154 206 C170 202 190 202 206 206 L206 211 C190 207 170 207 154 211 Z', stroke: MAP_COLORS.vermilion, width: 3, opacity: 0.85, round: true },
    // o Grande Buda (silhueta sentada)
    { d: 'M40 512 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M28 560 C28 536 76 536 76 560 Z', fill: MAP_COLORS.ink, opacity: 0.35 },
  ],
  trees: [
    { x: 120, y: 100, s: 22 }, { x: 240, y: 110, s: 22 }, { x: 110, y: 190, s: 20 }, { x: 250, y: 200, s: 22 },
    { x: 120, y: 330, s: 20 }, { x: 250, y: 330, s: 20 }, { x: 240, y: 470, s: 20 }, { x: 130, y: 470, s: 18 },
  ],
  hotspots: [
    {
      id: 'kita-kamakura',
      photoCaption: 'A estação de Kita-Kamakura, com o portão de Engaku-ji em frente.',
      n: 1, x: 180, y: 80, kind: 'station', label: 'Kita-Kamakura', side: 'right',
      coords: { lat: 35.3378, lng: 139.5451 },
      title: 'Estação Kita-Kamakura',
      jp: '北鎌倉駅',
      facts: 'JR Yokosuka Line, **~55 min** de Tóquio/Shinagawa · descer aqui, não em Kamakura',
      paragraphs: [
        'Uma estação de plataforma só, no meio da mata, com o portão de Engaku-ji do outro lado dos trilhos. É a entrada norte do anfiteatro — a passagem de **Kobukurozaka**, cortada na rocha, é uma das sete portas originais da cidade.',
        'Descendo aqui em vez de na estação de Kamakura, vocês fazem os dois templos zen e o santuário numa caminhada de 2,5 km sempre em leve descida.',
      ],
    },
    {
      id: 'engakuji',
      photoCaption: 'O portão Sanmon de Engaku-ji, entre os cedros.',
      n: 2, x: 150, y: 150, kind: 'temple', label: 'Engaku-ji', side: 'right', walk: '2 min',
      coords: { lat: 35.3375, lng: 139.5478 },
      title: 'Engaku-ji — o templo dos mongóis',
      jp: '円覚寺',
      facts: '**08:30–16:00** (nov) · ¥500 · Zen Rinzai, fundado em **1282**',
      paragraphs: [
        'Fundado em **1282** pelo regente Hōjō Tokimune para os mortos **dos dois lados** das invasões mongóis de 1274 e 1281 — inclusive os mongóis. O mestre fundador, Mugaku Sogen, veio da China; foi ele que ensinou o zen ao regente e o convenceu de que o exército mongol podia ser enfrentado. O tufão que afundou a frota mongol ganhou nome nessa época: *kamikaze*, "vento divino".',
        'A escadaria entre os cedros, o **Sanmon** de 1785 e o salão **Shariden**, tesouro nacional, que guarda um dente do Buda trazido da China. O sino de 1301, no alto de outra escadaria, é o maior de Kamakura, com uma casa de chá ao lado que tem a vista do vale.',
      ],
    },
    {
      id: 'kenchoji',
      photoCaption: 'O salão Butsuden de Kenchō-ji e os zimbros de 1250.',
      n: 3, x: 150, y: 200, kind: 'temple', label: 'Kenchō-ji', side: 'right', walk: '12 min',
      coords: { lat: 35.3317, lng: 139.5537 },
      title: 'Kenchō-ji — o número 1 dos Cinco Montes',
      jp: '建長寺',
      facts: '**08:30–16:30** · ¥500 · o mais antigo mosteiro zen do Japão, de **1253**',
      paragraphs: [
        'O templo zen nº 1 dos "Cinco Grandes" de Kamakura, fundado em 1253 — o **mais antigo mosteiro de treinamento zen do Japão**, e ainda funciona como tal: os monges em treinamento passam pelo pátio, e a cozinha do templo serve o *kenchin-jiru*, a sopa de legumes e tofu que nasceu aqui e virou prato nacional.',
        'Os **zimbros do pátio** foram plantados por volta de 1250, das sementes que o monge fundador, Rankei Dōryū, trouxe da China. São as mesmas árvores. No fundo, a trilha sobe 20 minutos até o **Hansōbō**, um santuário com estátuas de tengu na encosta e a vista de Kamakura e, em dia limpo, do Fuji.',
      ],
    },
    {
      id: 'hachimangu',
      photoCaption: 'A escadaria de Tsurugaoka Hachimangū e o ginkgo que caiu.',
      n: 4, x: 180, y: 262, kind: 'torii', label: 'Hachimangū', side: 'right', walk: '15 min',
      coords: { lat: 35.3260, lng: 139.5563 },
      title: 'Tsurugaoka Hachimangū — o coração da cidade',
      jp: '鶴岡八幡宮',
      facts: '**06:00–20:30** · grátis · no topo da avenida Wakamiya-ōji, que vai até o mar',
      paragraphs: [
        'O santuário que **Minamoto no Yoritomo**, o primeiro xogum, mudou para cá em 1180 e fez de eixo da capital: a avenida Wakamiya-ōji desce daqui em linha reta até a praia, e a cidade foi desenhada em volta dela. É onde os samurais juravam lealdade, e onde a política de Kamakura se decidia — inclusive a facadas.',
        'Na escadaria, o **ginkgo de mil anos** atrás do qual, em 1219, o sobrinho do xogum Sanetomo se escondeu para assassiná-lo, encerrando a dinastia Minamoto. A árvore caiu numa tempestade em 2010; do toco brotaram rebentos, e eles estão lá, cercados, crescendo.',
        'No mesmo recinto: o **lago Genpei** (lótus brancos de um lado, vermelhos do outro, as cores dos dois clãs da guerra), e o museu de tesouros. É também onde fica o começo da Komachi-dōri.',
      ],
    },
    {
      id: 'komachi',
      photoCaption: 'Komachi-dōri, a rua de comida entre o santuário e a estação.',
      n: 5, x: 180, y: 350, kind: 'food', label: 'Komachi-dōri', side: 'right', walk: '3 min',
      coords: { lat: 35.3210, lng: 139.5520 },
      title: 'Komachi-dōri — o que comer',
      jp: '小町通り',
      facts: 'Do santuário à estação, 360 m · **shirasu** é o prato daqui',
      paragraphs: [
        'A rua de comida, paralela à avenida grande. O prato de Kamakura é o **shirasu**, o filhote de sardinha branquinho, servido cru (*nama shirasu*, só quando há pesca no dia — em novembro a temporada está no fim) ou cozido sobre arroz, o *shirasu-don*. Em qualquer lugar da rua, ¥1.200–1.800.',
        'Para o lanche: **hato sabure**, o biscoito amanteigado em forma de pombo (Toshimaya, desde 1894, a caixa amarela é a lembrança oficial de Kamakura), e o **croquete de batata roxa** que se come andando — aqui pode, é uma das poucas ruas do Japão onde comer andando é a norma.',
      ],
    },
    {
      id: 'estacao',
      photoCaption: 'A estação de Kamakura e a plataforma do Enoden.',
      n: 6, x: 180, y: 420, kind: 'station', label: 'Estação Kamakura', side: 'right', walk: '3 min',
      coords: { lat: 35.3190, lng: 139.5503 },
      title: 'Estação de Kamakura e o Enoden',
      jp: '鎌倉駅 · 江ノ電',
      facts: 'Enoden: bondinho a cada 12 min · **Hase** é a 3ª parada (5 min, ¥200)',
      paragraphs: [
        'O **Enoden** é um bonde verde e creme de 1902 que sai da estação de Kamakura, passa entre os quintais das casas (chega a encostar nas paredes) e segue pela beira do mar até Enoshima e Fujisawa. É transporte de moradores, mas é também a experiência: sentem-se do **lado esquerdo** para ver o mar depois de Hase.',
        'O passe de um dia (*Noriorikun*, ¥800) compensa se vocês fizerem Hase e a praia; para só ir e voltar, passagem avulsa.',
      ],
    },
    {
      id: 'daibutsu',
      photoCaption: 'O Grande Buda de Kōtoku-in, ao ar livre desde 1498.',
      n: 7, x: 88, y: 540, kind: 'hall', label: 'O Grande Buda', side: 'right', walk: '5 min de Enoden + 8 a pé',
      coords: { lat: 35.3167, lng: 139.5358 },
      title: 'Kōtoku-in — o Grande Buda ao ar livre',
      jp: '高徳院 鎌倉大仏',
      facts: '**08:00–17:00** · ¥300 · entrar dentro dele, ¥50 · **11,3 m, 121 toneladas**',
      paragraphs: [
        'Fundido em **1252** em bronze, em partes soldadas que ainda se veem nas costas. Ficou dentro de um salão de madeira até **1498**, quando um tsunami levou o salão embora e deixou o Buda. Desde então está ao ar livre, há mais de 500 anos, e é o segundo maior do Japão depois do de Nara — só que este é o original, sem reconstruções.',
        'É Amida, o Buda da Terra Pura, com as mãos no gesto de meditação e os olhos semicerrados; a **inclinação leve para a frente** é proposital, para quem olha de baixo. Por ¥50 entra-se dentro dele e vê-se a técnica de fundição por dentro, camada por camada. As sandálias de palha gigantes na parede foram feitas por crianças de Ibaraki nos anos 1950, "para o Buda poder andar pelo Japão".',
      ],
    },
    {
      id: 'hasedera',
      photoCaption: 'O terraço de Hase-dera, com a baía embaixo.',
      n: 8, x: 100, y: 470, kind: 'temple', label: 'Hase-dera', side: 'right', walk: '7 min',
      coords: { lat: 35.3126, lng: 139.5330 },
      title: 'Hase-dera — a Kannon de onze cabeças e o mar',
      jp: '長谷寺',
      facts: '**08:00–16:30** (nov) · ¥400 · terraço com vista da baía',
      paragraphs: [
        'O templo da **Kannon de onze cabeças**, uma estátua de madeira dourada de 9 metros, a maior de madeira do Japão. A lenda diz que ela foi esculpida em 721 de metade de uma cânfora; a outra metade virou a Kannon de Nara, e esta foi jogada ao mar para "encontrar seu lugar" — e deu na praia de Kamakura em 736.',
        'A encosta é coberta de **estátuas de Jizō**, centenas, pequenas, com toucas e babadores vermelhos: são oferendas de pais por filhos que morreram, incluindo os não nascidos. É a parte silenciosa do templo. Do terraço, a vista da baía de Sagami e, no fim do dia, a luz baixa sobre o mar — o momento certo para estar aqui.',
      ],
    },
    {
      id: 'yuigahama',
      photoCaption: 'A praia de Yuigahama no fim da tarde de novembro.',
      n: 9, x: 160, y: 640, kind: 'water', label: 'Yuigahama', side: 'right', walk: '10 min',
      coords: { lat: 35.3097, lng: 139.5410 },
      title: 'Yuigahama — a praia no fim da avenida',
      jp: '由比ヶ浜',
      facts: 'Fim da avenida Wakamiya-ōji · pôr do sol **~16:35** em novembro',
      paragraphs: [
        'A praia onde a avenida do santuário termina — o eixo da cidade vai do Hachimangū ao mar sem interrupção. Em novembro está vazia, com os surfistas de roupa de borracha e Enoshima do lado direito; num dia limpo, o **Fuji** aparece atrás dela, ao fim da tarde, quando o sol se põe exatamente nessa direção.',
        'Foi aqui que em 1333 o exército de Nitta Yoshisada entrou por uma maré baixa e derrubou o xogunato de Kamakura, que tinha durado 150 anos. A cidade nunca mais foi capital. Voltem pelo Enoden ou pela avenida, 20 minutos a pé até a estação.',
      ],
    },
    {
      id: 'zeniarai',
      photoCaption: 'Zeniarai Benten: lavando dinheiro na gruta.',
      n: 10, x: 84, y: 300, kind: 'stone', label: 'Zeniarai Benten', side: 'right', walk: '25 min (opcional)',
      coords: { lat: 35.3245, lng: 139.5420 },
      title: 'Zeniarai Benten — lavar dinheiro (opcional)',
      jp: '銭洗弁財天',
      facts: '**08:00–16:30** · grátis · 25 min a pé da estação por uma ladeira',
      paragraphs: [
        'Um santuário dentro de uma gruta, onde se **lava dinheiro na água da nascente** com uma cestinha de bambu: o que se lava, multiplica. A tradição vem de um sonho do xogum Yoritomo em 1185. Funciona com notas também; lavem uma de ¥1.000 e guardem para gastar — o multiplicador está no gasto, não na guarda.',
        'Fica fora do eixo do dia (oeste da estação, subindo). Só se sobrar tempo e disposição; se não, é a razão para voltar a Kamakura.',
      ],
    },
  ],
  legend: 'Verde = as montanhas do anfiteatro · azul = a baía de Sagami · tracejado vermelho = a avenida do santuário ao mar · pontilhado = o Enoden',
};

const tofukuji: PlaceMap = {
  id: 'tofukuji',
  coverHotspotId: 'tsutenkyo',
  stopId: 'd01-tofukuji',
  dayId: 'd2026-12-01',
  title: 'Tōfuku-ji',
  jp: '東福寺',
  subtitle: 'O vale de bordos e a ponte coberta, na abertura, antes do Shinkansen',
  intro: [
    'Tōfuku-ji é o lugar de outono mais famoso de Kyoto por uma razão geográfica: o templo é cortado por um **vale estreito, o Sengyokukan, com 2.000 bordos no fundo**, e três pontes cobertas passam por cima dele. De cima da ponte se vê um mar de folhas vermelhas; de baixo, um teto.',
    'Vocês entram na **abertura, às 8h30**, e é a única jogada possível: às 10h a ponte Tsūten-kyō tem fila para entrar e proíbe fotos para a multidão andar. Depois do vale, o jardim de pedras moderno do Hōjō é o contraponto, e a estação fica a 10 minutos a pé para o Shinkansen das 13h20.',
  ],
  viewBox: '0 0 360 620',
  scenery: [
    { d: 'M20 40 L340 40 L340 610 L20 610 Z', fill: MAP_COLORS.forest, opacity: 0.07 },
    // o vale de bordos, atravessando o recinto
    { d: 'M20 330 C80 300 140 320 200 300 C260 280 300 300 340 280 L340 340 C300 360 260 340 200 360 C140 380 80 360 20 390 Z', fill: MAP_COLORS.vermilion, opacity: 0.18 },
    // riacho no fundo do vale
    { d: 'M20 360 C80 340 140 350 200 335 C260 320 300 330 340 310', stroke: MAP_COLORS.water, width: 3, opacity: 0.4, round: true },
    // caminho: estação → Gaunkyō → Sanmon → Hōjō → Tsūten-kyō → Kaisandō
    { d: 'M60 590 C90 560 130 540 160 520 C190 500 190 450 180 410 C172 380 176 340 190 320 C204 300 236 300 246 270 C254 246 240 220 232 200', stroke: MAP_COLORS.muted, width: 13, opacity: 0.3, round: true },
    // pontes cobertas sobre o vale
    { d: 'M96 322 L96 372 M104 322 L104 372 M92 322 L108 322', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.5, round: true },
    { d: 'M176 312 L176 368 M186 312 L186 368 M172 312 L190 312', stroke: MAP_COLORS.ink, width: 3, opacity: 0.6, round: true },
    { d: 'M290 292 L290 342 M298 292 L298 342 M286 292 L302 292', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.5, round: true },
    // Sanmon, o portão
    { d: 'M150 470 L150 448 M210 470 L210 448 M142 450 L218 450 M146 440 C164 436 196 436 214 440 L214 445 C196 441 164 441 146 445 Z', stroke: MAP_COLORS.ink, width: 3, opacity: 0.5, round: true },
    // Hōjō e o jardim de pedras (quadrícula)
    { d: 'M100 400 L150 400 L150 440 L100 440 Z M110 410 L120 410 M130 410 L140 410 M110 420 L120 420 M130 420 L140 420 M110 430 L120 430 M130 430 L140 430', stroke: MAP_COLORS.ink, width: 1.5, opacity: 0.4 },
  ],
  trees: [
    { x: 60, y: 480, s: 20 }, { x: 300, y: 500, s: 22 }, { x: 290, y: 420, s: 20 }, { x: 60, y: 240, s: 22 },
    { x: 300, y: 200, s: 20 }, { x: 120, y: 200, s: 20 }, { x: 60, y: 120, s: 22 }, { x: 280, y: 110, s: 20 },
  ],
  hotspots: [
    {
      id: 'estacao',
      photoCaption: 'A estação Tōfukuji, JR e Keihan, a 10 minutos do portão.',
      n: 1, x: 60, y: 590, kind: 'station', label: 'Estação Tōfukuji', side: 'right',
      coords: { lat: 34.9791, lng: 135.7715 },
      title: 'Estação Tōfukuji',
      jp: '東福寺駅',
      facts: 'JR Nara Line, **2 min** da Estação de Kyoto · também Keihan',
      paragraphs: [
        'Uma parada depois de Kyoto pela JR. Saindo, siga a multidão para o sul: é 10 minutos de caminhada por ruas de bairro até a ponte de entrada. Na volta, o mesmo trem deixa vocês na Estação de Kyoto com a mala e o Shinkansen.',
      ],
    },
    {
      id: 'gaunkyo',
      photoCaption: 'Gaun-kyō: a primeira ponte, de onde se vê a Tsūten-kyō sobre o vale.',
      n: 2, x: 96, y: 352, kind: 'view', label: 'Gaun-kyō', side: 'left', walk: '12 min',
      coords: { lat: 34.9774, lng: 135.7729 },
      title: 'Gaun-kyō — a ponte que olha a outra',
      jp: '臥雲橋',
      facts: 'Grátis, é rua pública · proibido parar para foto no pico (há placa e guarda)',
      paragraphs: [
        'A primeira das três pontes cobertas sobre o vale, e a única que é rua pública: passa-se por ela a caminho do templo. De dentro, olhando para a esquerda, está **a vista mais fotografada de Tōfuku-ji**: a ponte Tsūten-kyō suspensa sobre o vale vermelho, com o telhado do Kaisandō atrás.',
        'Em novembro o templo proíbe parar aqui para fotografar (a ponte é de madeira e não aguenta a multidão parada). Às 8h30 não há guarda e não há multidão.',
      ],
    },
    {
      id: 'sanmon',
      photoCaption: 'O Sanmon de 1425, o portão zen mais antigo do Japão.',
      n: 3, x: 180, y: 462, kind: 'gate', label: 'Sanmon', side: 'right', walk: '4 min',
      coords: { lat: 34.9764, lng: 135.7737 },
      title: 'Sanmon — o portão mais antigo do zen',
      jp: '三門',
      facts: 'De **1425** · Tesouro Nacional · 22 m · só se sobe em datas especiais',
      paragraphs: [
        'O templo foi fundado em **1236** pelo regente Kujō Michiie, que quis um templo em Kyoto do tamanho dos dois grandes de Nara: o nome é uma sílaba de cada um (**Tō**-daiji + Kō-**fuku**-ji). Queimou várias vezes; o Sanmon, de 1425, é o **portão de templo zen mais antigo do país** e o único prédio deste tamanho que sobrou do período Muromachi.',
        'Ao lado, o **Zendō** (salão de meditação) de 1347, o maior e mais antigo do Japão, onde ainda hoje monges em treinamento sentam por horas; e o banheiro medieval, o **Tōsu**, do século XIV, que era comunitário e tinha regras rígidas — o zen levava o cotidiano a sério.',
      ],
    },
    {
      id: 'hojo',
      photoCaption: 'O jardim de pedras do Hōjō, de 1939: o xadrez de musgo.',
      n: 4, x: 128, y: 420, kind: 'temple', label: 'Hōjō', side: 'left', walk: '3 min',
      coords: { lat: 34.9760, lng: 135.7745 },
      title: 'Hōjō — o jardim de xadrez',
      jp: '方丈庭園',
      facts: '**08:30–16:00** (nov) · ¥500 · quatro jardins em volta do salão do abade',
      paragraphs: [
        'Os jardins são de **1939**, do paisagista **Mirei Shigemori**, e foram um escândalo: ele usou as pedras de fundação de prédios demolidos, fez um jardim de pedras com **sete cilindros** representando a Ursa Maior, e no lado norte um **tabuleiro de xadrez de musgo e lajota** que some gradualmente na vegetação. Era o jardim zen entrando no século XX, e hoje é o mais citado do modernismo japonês.',
        'Deem a volta completa: sul (o oceano de cascalho e as pedras), oeste (o campo de arbustos em quadrados), norte (o xadrez, com o vale de bordos logo atrás da varanda) e leste (a Ursa Maior).',
      ],
    },
    {
      id: 'tsutenkyo',
      photoCaption: 'A ponte Tsūten-kyō, o teto de bordos sob os pés.',
      n: 5, x: 181, y: 340, kind: 'view', label: 'Tsūten-kyō', side: 'right', walk: '2 min',
      coords: { lat: 34.9769, lng: 135.7742 },
      title: 'Tsūten-kyō — a ponte para o céu',
      jp: '通天橋',
      facts: 'Ingresso do vale **¥1.000** em novembro (¥600 no resto do ano) · 100 m de comprimento',
      paragraphs: [
        'A ponte coberta que atravessa o vale a 12 metros de altura, construída em **1380** para os monges irem ao salão do fundador sem descer e subir a ravina. Do meio dela, o vale inteiro fica embaixo: 2.000 bordos, em novembro um tapete vermelho e laranja que parece ter chão.',
        'Os bordos daqui são em parte de uma variedade trazida da China no século XIV, a **tōkaede**, de folha pequena e três pontas, que amarela em vez de avermelhar — é a mistura de cores que faz a fama do vale. Uma escada no meio da ponte desce ao fundo: caminhem entre as árvores, é a parte silenciosa.',
      ],
    },
    {
      id: 'kaisando',
      photoCaption: 'O Kaisandō e seu jardim dividido ao meio.',
      n: 6, x: 236, y: 220, kind: 'hall', label: 'Kaisandō', side: 'right', walk: '5 min',
      coords: { lat: 34.9773, lng: 135.7755 },
      title: 'Kaisandō — o salão do fundador',
      jp: '開山堂',
      facts: 'Fim da ponte · o jardim tem dois estilos, um em cada metade',
      paragraphs: [
        'O salão que guarda a estátua de **Enni Ben\'en**, o monge fundador, que estudou na China e voltou em 1241 trazendo, além do zen, as sementes de chá que deram origem às plantações de Shizuoka — e a receita do udon, dizem em Fukuoka.',
        'O jardim na frente é **dividido ao meio**: metade cascalho rastelado em xadrez, metade lago com pedras e vegetação. Não é indecisão: é o Muromachi (o lago) e o Edo (o cascalho) lado a lado, um jardim que mostra dois séculos de ideia sobre o que é um jardim.',
      ],
    },
    {
      id: 'engetsukyo',
      photoCaption: 'A Engetsu-kyō, a terceira ponte, do lado de fora do ingresso.',
      n: 7, x: 300, y: 296, kind: 'view', label: 'Engetsu-kyō', side: 'left', walk: '6 min',
      coords: { lat: 34.9760, lng: 135.7768 },
      title: 'Engetsu-kyō — a ponte esquecida',
      jp: '偃月橋',
      facts: 'Bem Cultural Importante, de **1603** · grátis · quase ninguém vai',
      paragraphs: [
        'A terceira ponte coberta, a mais antiga das três (a Tsūten-kyō é uma reconstrução de 1961), a leste do recinto, fora do circuito pago. Leva ao subtemplo Sokushū-in e a nada mais, e por isso fica vazia enquanto as outras duas estão cheias.',
        'É a ponte para tirar a foto **da** ponte: com telhado de telha, corrimão de madeira escura e o vale embaixo, sem ninguém. Dez minutos de desvio que valem o dia.',
      ],
    },
    {
      id: 'komyoin',
      photoCaption: 'Kōmyō-in, o jardim de pedras e musgo onde nunca tem gente.',
      n: 8, x: 60, y: 200, kind: 'temple', label: 'Kōmyō-in', side: 'right', walk: '8 min',
      coords: { lat: 34.9748, lng: 135.7720 },
      title: 'Kōmyō-in — o outro jardim de Shigemori',
      jp: '光明院',
      facts: '**07:00–17:00** · ¥500 (caixa de contribuição) · subtemplo ao sul',
      paragraphs: [
        'Um subtemplo minúsculo com um jardim do mesmo Mirei Shigemori (1939): **musgo, cascalho e pedras em pé** apontando para o mesmo lugar, como raios de luz saindo de uma fonte — o nome é "templo da luz brilhante". Senta-se no tatame da varanda e não há mais nada a fazer.',
        'Está a 8 minutos a pé do templo principal, na direção da estação, e não entra em nenhum roteiro de ônibus. Se sobrar meia hora antes do trem, é a meia hora certa.',
      ],
    },
  ],
  legend: 'Vermelho = o vale de bordos · azul = o riacho no fundo · traços pretos = as três pontes cobertas · faixa cinza = o percurso',
};

const kinkakuji: PlaceMap = {
  id: 'kinkakuji',
  coverHotspotId: 'pavilhao',
  stopId: 'd29-kinkakuji',
  dayId: 'd2026-11-29',
  title: 'Kinkaku-ji e Ryōan-ji',
  jp: '金閣寺 · 龍安寺',
  subtitle: 'O Pavilhão Dourado e o jardim de quinze pedras, a 20 minutos um do outro',
  intro: [
    'Dois lugares que se fazem em sequência, no noroeste de Kyoto, depois de Arashiyama: o **Pavilhão Dourado**, que é uma volta de 30 minutos num circuito de mão única em torno do lago, e **Ryōan-ji**, o jardim de pedras mais famoso do mundo, onde a coisa a fazer é sentar.',
    'Entre os dois são 20 minutos a pé pela **Kinukake-no-michi**, a "estrada da seda", ou 5 minutos de ônibus 59. Se estiverem sem pernas, ônibus; se estiver bonito, a pé.',
  ],
  viewBox: '0 0 360 640',
  scenery: [
    { d: 'M20 40 L340 40 L340 630 L20 630 Z', fill: MAP_COLORS.forest, opacity: 0.08 },
    // o lago-espelho de Kinkaku-ji
    { d: 'M110 130 C170 110 260 120 280 160 C300 200 260 240 200 236 C140 232 90 200 110 130 Z', fill: MAP_COLORS.water, opacity: 0.3 },
    // ilhas do lago
    { d: 'M170 170 a8 6 0 1 0 16 0 a8 6 0 1 0 -16 0 M210 200 a6 4 0 1 0 12 0 a6 4 0 1 0 -12 0', fill: MAP_COLORS.forest, opacity: 0.5 },
    // o pavilhão, na margem (dourado)
    { d: 'M116 168 L152 168 L152 148 L120 148 Z M120 148 L148 148 L145 134 L123 134 Z M124 134 L144 134 L134 120 Z', fill: MAP_COLORS.gold, opacity: 0.85, stroke: MAP_COLORS.ink, width: 1, round: true },
    // circuito de mão única em volta do lago
    { d: 'M90 260 C60 200 90 110 160 96 C230 84 310 120 300 190 C292 240 240 270 190 268', stroke: MAP_COLORS.muted, width: 11, opacity: 0.3, round: true },
    // Kinukake-no-michi, a ligação
    { d: 'M190 268 C190 330 150 380 140 440', stroke: MAP_COLORS.muted, width: 9, dash: '10 8', opacity: 0.3, round: true },
    // Ryōan-ji: lago Kyōyōchi e o retângulo do jardim de pedras
    { d: 'M40 560 C70 520 150 520 190 550 C220 575 190 610 130 606 C80 602 30 590 40 560 Z', fill: MAP_COLORS.water, opacity: 0.3 },
    { d: 'M210 470 L320 470 L320 520 L210 520 Z', fill: MAP_COLORS.paper, stroke: MAP_COLORS.ink, width: 1.5, opacity: 0.8 },
    { d: 'M228 486 a5 4 0 1 0 10 0 a5 4 0 1 0 -10 0 M262 496 a4 3 0 1 0 8 0 a4 3 0 1 0 -8 0 M296 484 a4 3 0 1 0 8 0 a4 3 0 1 0 -8 0 M244 508 a3 2 0 1 0 6 0 a3 2 0 1 0 -6 0 M290 506 a3 2 0 1 0 6 0 a3 2 0 1 0 -6 0', fill: MAP_COLORS.ink, opacity: 0.55 },
  ],
  trees: [
    { x: 60, y: 90, s: 22 }, { x: 320, y: 90, s: 20 }, { x: 320, y: 260, s: 22 }, { x: 60, y: 320, s: 20 },
    { x: 260, y: 340, s: 22 }, { x: 80, y: 420, s: 20 }, { x: 250, y: 420, s: 18 }, { x: 40, y: 500, s: 20 }, { x: 310, y: 580, s: 22 },
  ],
  hotspots: [
    {
      id: 'entrada',
      photoCaption: 'O portão de Kinkaku-ji, com a fila de ônibus de excursão na frente.',
      n: 1, x: 90, y: 262, kind: 'gate', label: 'Entrada', side: 'right',
      coords: { lat: 35.0389, lng: 135.7285 },
      title: 'A entrada de Kinkaku-ji — e o ingresso que é um amuleto',
      jp: '金閣寺 総門',
      facts: '**09:00–17:00** · ¥500 · o ingresso é um **ofuda** caligrafado, guardem',
      paragraphs: [
        'O ingresso é uma tira de papel com caligrafia a pincel: é um **ofuda**, amuleto de proteção da casa, não um bilhete. Dobrem com cuidado, ele vai para a parede de casa. O nome oficial do templo é **Rokuon-ji**, "templo do jardim dos cervos"; Kinkaku-ji é o apelido pelo pavilhão.',
        'O circuito é de **mão única** e dura uns 30 minutos: lago, pavilhão de três ângulos, jardim, casa de chá, saída pelas lojas. Não dá para voltar, então a foto é na primeira curva.',
      ],
    },
    {
      id: 'pavilhao',
      photoCaption: 'O Pavilhão Dourado refletido no Kyōko-chi, o lago-espelho.',
      n: 2, x: 134, y: 100, kind: 'hall', label: 'Pavilhão Dourado', side: 'left', walk: '3 min',
      coords: { lat: 35.0394, lng: 135.7292 },
      title: 'O Pavilhão Dourado — a reconstrução de 1955',
      jp: '金閣',
      facts: 'Ouro em folha em dois dos três andares · Patrimônio Mundial · o original queimou em **1950**',
      paragraphs: [
        'Foi a vila de aposentadoria do xogum **Ashikaga Yoshimitsu**, construída em **1397** — o homem que unificou as duas cortes imperiais, negociou com a China e mandou construir a Kyoto do teatro nō e do chá. Virou templo quando ele morreu, em 1408. Cada andar é de um estilo: o térreo é palácio Heian, o meio é casa de samurai, o alto é templo zen chinês. Uma biografia em três pisos.',
        'Em **1950 um noviço de 21 anos incendiou o pavilhão** e tentou se matar em seguida. O caso virou o romance *O Pavilhão Dourado*, de Yukio Mishima. O prédio atual é de 1955, e em 1987 recebeu uma camada de ouro **cinco vezes mais grossa** que a original, com 20 kg de folha, para não descascar mais. A fênix de bronze no topo é a única peça que sobreviveu ao fogo — estava fora para restauro.',
        'O reflexo no **Kyōko-chi**, o lago-espelho, é a imagem. De manhã cedo, com o sol batendo do leste, o pavilhão dourado dobra na água; à tarde a luz vem de trás e ele vira silhueta.',
      ],
    },
    {
      id: 'lago',
      photoCaption: 'As ilhas e pedras do lago, cada uma doada por um senhor feudal.',
      n: 3, x: 250, y: 100, kind: 'water', label: 'O lago', side: 'left', walk: '2 min',
      coords: { lat: 35.0393, lng: 135.7297 },
      title: 'Kyōko-chi — o lago com as pedras dos senhores',
      jp: '鏡湖池',
      facts: 'Dez ilhas · as pedras têm nome e doador',
      paragraphs: [
        'O lago é um mapa do mundo budista em miniatura, com a **ilha maior representando o Japão** e as menores as ilhas dos imortais. As pedras isoladas foram **presentes de senhores feudais** ao xogum, e cada uma tem o nome do doador: a de Hosokawa, a de Akamatsu. Dar uma pedra bonita era política.',
        'Da margem oposta ao pavilhão, o ângulo com as ilhas na frente é o que os japoneses consideram a vista correta: a paisagem foi composta para ser vista dali, com o Monte Kinugasa "emprestado" ao fundo.',
      ],
    },
    {
      id: 'sekkatei',
      photoCaption: 'A casa de chá Sekkatei, no alto do jardim.',
      n: 4, x: 290, y: 200, kind: 'view', label: 'Sekkatei', side: 'left', walk: '8 min',
      coords: { lat: 35.0399, lng: 135.7305 },
      title: 'Sekkatei — a casa de chá e a vista de cima',
      jp: '夕佳亭',
      facts: 'No alto do circuito · matcha na casa ao lado, ¥500',
      paragraphs: [
        'O circuito sobe a encosta e chega a uma casa de chá do século XVII, a **Sekkatei**, "pavilhão do belo pôr do sol": foi construída para ver o pavilhão dourado com a luz da tarde, de cima. Tem um pilar de nandina, arbusto que raramente cresce até virar tronco.',
        'Na casa ao lado servem **matcha com um doce em forma de pavilhão**, sentados de frente para o jardim. Cinco minutos que o ônibus de excursão não tem.',
      ],
    },
    {
      id: 'kinukake',
      photoCaption: 'A Kinukake-no-michi, a estrada entre os três templos.',
      n: 5, x: 165, y: 350, kind: 'view', label: 'Kinukake-no-michi', side: 'right', walk: '5 min',
      coords: { lat: 35.0360, lng: 135.7240 },
      title: 'Kinukake-no-michi — a estrada da seda',
      jp: 'きぬかけの路',
      facts: '**20 min a pé** até Ryōan-ji, ou ônibus 59 (5 min) · Ninna-ji fica mais 10 min adiante',
      paragraphs: [
        'O nome vem de um imperador do século IX que, querendo ver neve no verão, mandou **cobrir a montanha Kinugasa de seda branca**. A estrada margeia essa montanha e liga três Patrimônios Mundiais em fila: Kinkaku-ji, Ryōan-ji e Ninna-ji.',
        'A pé são 20 minutos de calçada sem graça e com bordos; de ônibus, 5. Se sobrar tempo depois de Ryōan-ji, **Ninna-ji** (mais 10 min) tem um portão enorme e um pomar de cerejeiras anãs, e é sempre vazio.',
      ],
    },
    {
      id: 'ryoanji-lago',
      photoCaption: 'O lago Kyōyōchi de Ryōan-ji, com os bordos de novembro.',
      n: 6, x: 110, y: 560, kind: 'water', label: 'Lago de Ryōan-ji', side: 'right', walk: '20 min',
      coords: { lat: 35.0338, lng: 135.7186 },
      title: 'Ryōan-ji — o lago que veio antes do jardim',
      jp: '龍安寺 鏡容池',
      facts: '**08:00–17:00** · ¥600 · Patrimônio Mundial',
      paragraphs: [
        'Antes de ser templo zen, isto era a vila de um aristocrata, e o lago **Kyōyōchi** é do século XII — bem mais velho que o jardim famoso. Patos-mandarim, lótus no verão, bordos agora. A maioria passa reto, correndo para as pedras; a volta pelo lago é a parte bonita e vazia.',
        'O templo foi fundado em **1450** por Hosokawa Katsumoto, o general de um dos lados da Guerra Ōnin, que queimou o lugar oito anos depois. O jardim de pedras é de logo depois da reconstrução, por volta de 1500, e ninguém sabe quem o fez.',
      ],
    },
    {
      id: 'pedras',
      photoCaption: 'O jardim de pedras: quinze, e de nenhum lugar se veem todas.',
      n: 7, x: 265, y: 496, kind: 'stone', label: 'As quinze pedras', side: 'left', walk: '3 min',
      coords: { lat: 35.0345, lng: 135.7183 },
      title: 'O jardim de pedras — quinze, e nunca todas',
      jp: '石庭',
      facts: '25 m × 10 m · 15 pedras em 5 grupos · cascalho rastelado toda manhã',
      paragraphs: [
        'Um retângulo de cascalho branco, cinco grupos de pedras com musgo em volta, um muro de barro e nada mais. Não há árvore, água, nem explicação: o templo nunca disse o que o jardim representa, e essa recusa é parte do jardim. Tigres atravessando um rio, ilhas num oceano, montanhas na neblina — cada visitante traz a sua.',
        'O detalhe verificável: **de qualquer ponto da varanda só se veem 14 pedras**. Uma sempre fica escondida atrás de outra. A tradição diz que só quem atingiu a iluminação vê as quinze. O muro de barro, misturado com óleo de colza, escureceu de forma irregular em 500 anos e é considerado tão parte da obra quanto as pedras.',
        'O que fazer: sentar na varanda de madeira, no fim, onde a multidão rareia, e ficar 10 minutos. Não é para entender. Às 15h de um domingo de novembro vai ter gente; ainda assim, funciona.',
      ],
    },
    {
      id: 'tsukubai',
      photoCaption: 'A tsukubai de Ryōan-ji: "só sei que tenho o bastante".',
      n: 8, x: 320, y: 560, kind: 'stone', label: 'Tsukubai', side: 'left', walk: '2 min',
      coords: { lat: 35.0348, lng: 135.7188 },
      title: 'A tsukubai — a bacia que ensina a ler',
      jp: '知足の蹲踞',
      facts: 'Atrás do salão do abade, no caminho da saída · a original está guardada; esta é réplica',
      paragraphs: [
        'Uma bacia de pedra redonda com um quadrado escavado no centro, cheio de água. Em volta do quadrado, quatro caracteres: 五, 隹, 疋, 矢. Sozinhos não dizem nada. Mas se o quadrado do centro (que é o caractere 口, "boca") for lido como parte de cada um, viram **吾唯足知**: "só sei que tenho o bastante".',
        'É um trocadilho zen esculpido em pedra, e a frase é o templo inteiro resumido: o jardim não tem árvore, a bacia não tem enfeite, e é o suficiente. Foi doação de Tokugawa Mitsukuni, o senhor feudal que virou personagem de TV.',
      ],
    },
  ],
  legend: 'Azul = o lago-espelho e o lago de Ryōan-ji · dourado = o pavilhão · faixa cinza = o circuito de mão única · tracejado = a Kinukake-no-michi',
};

const sumiyoshi: PlaceMap = {
  id: 'sumiyoshi',
  coverHotspotId: 'sorihashi',
  stopId: 'd27-sumiyoshi',
  dayId: 'd2026-11-27',
  title: 'Sumiyoshi Taisha',
  jp: '住吉大社',
  subtitle: 'O santuário de antes do budismo, a ponte arqueada e as pedras da sorte',
  intro: [
    'Sumiyoshi é o santuário mais antigo de Osaka (**ano 211**, diz a tradição) e o mais estranho: os quatro salões principais são de um estilo **anterior à chegada do budismo**, sem curva no telhado, sem pintura chinesa, e olham para o oeste, para o mar que já não está ali. Entra-se pelo oeste, cruzando a ponte arqueada, e vai-se andando para dentro.',
    'É de manhã cedo, vazio e de graça: 40 minutos bem gastos. Toquem nos pontos para saber o que é cada coisa e não deixem de procurar as **três pedrinhas** no cascalho do Goshogozen.',
  ],
  viewBox: '0 0 360 620',
  scenery: [
    { d: 'M20 40 L340 40 L340 610 L20 610 Z', fill: MAP_COLORS.forest, opacity: 0.07 },
    // linha do bonde Hankai, ao longo da rua do oeste
    { d: 'M78 60 L78 600', stroke: MAP_COLORS.water, width: 3, dash: '10 6', opacity: 0.45 },
    // lago da ponte arqueada
    { d: 'M108 260 C130 250 160 250 182 260 C190 290 190 320 182 350 C160 360 130 360 108 350 C100 320 100 290 108 260 Z', fill: MAP_COLORS.water, opacity: 0.3 },
    // a ponte arqueada, em vermelho
    { d: 'M112 306 C130 268 160 268 178 306', stroke: MAP_COLORS.vermilion, width: 5, opacity: 0.8, round: true },
    // sandō: estação → ponte → torii → salões
    { d: 'M40 400 L40 306 L108 306 M182 306 L300 306', stroke: MAP_COLORS.muted, width: 14, opacity: 0.28, round: true },
    // caminho para o sul: Goshogozen, Nankun-sha, Ōtoshi-sha
    { d: 'M250 320 C250 380 220 420 200 460 C186 490 190 530 200 570', stroke: MAP_COLORS.muted, width: 10, opacity: 0.25, round: true },
    // torii de pedra (pilares quadrados)
    { d: 'M204 290 L204 322 M216 290 L216 322 M198 292 L222 292 M200 300 L220 300', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.6, round: true },
    // os quatro salões: três em fila (oeste-leste) e um ao lado
    { d: 'M272 292 L296 292 L296 320 L272 320 Z', fill: MAP_COLORS.paper, stroke: MAP_COLORS.ink, width: 1.5, opacity: 0.85 },
    { d: 'M302 292 L326 292 L326 320 L302 320 Z', fill: MAP_COLORS.paper, stroke: MAP_COLORS.ink, width: 1.5, opacity: 0.85 },
    { d: 'M242 292 L266 292 L266 320 L242 320 Z', fill: MAP_COLORS.paper, stroke: MAP_COLORS.ink, width: 1.5, opacity: 0.85 },
    { d: 'M242 328 L266 328 L266 356 L242 356 Z', fill: MAP_COLORS.paper, stroke: MAP_COLORS.ink, width: 1.5, opacity: 0.85 },
    // telhados retos, chifres em X
    { d: 'M270 290 L282 282 L298 290 M300 290 L312 282 L328 290 M240 290 L252 282 L268 290 M240 326 L252 318 L268 326', stroke: MAP_COLORS.ink, width: 1.5, opacity: 0.6, round: true },
    // cerca do Goshogozen
    { d: 'M228 396 L272 396 L272 432 L228 432 Z', stroke: MAP_COLORS.ink, width: 1.5, dash: '3 3', opacity: 0.5 },
  ],
  trees: [
    { x: 300, y: 100, s: 24 }, { x: 250, y: 140, s: 20 }, { x: 310, y: 200, s: 20 }, { x: 130, y: 180, s: 22 },
    { x: 130, y: 420, s: 22 }, { x: 300, y: 420, s: 20 }, { x: 310, y: 520, s: 22 }, { x: 120, y: 540, s: 20 },
  ],
  hotspots: [
    {
      id: 'estacao',
      photoCaption: 'A estação Sumiyoshitaisha da Nankai, a um quarteirão do torii.',
      n: 1, x: 40, y: 400, kind: 'station', label: 'Est. Sumiyoshitaisha', side: 'right',
      coords: { lat: 34.6121, lng: 135.4914 },
      title: 'Estação Sumiyoshitaisha',
      jp: '住吉大社駅',
      facts: 'Nankai Main Line, **10 min** de Namba (trem local) · saída leste',
      paragraphs: [
        'De Namba, qualquer trem local ou semi-expresso da Nankai para aqui; os expressos não. Saindo pela leste, o torii está a 3 minutos: é só atravessar a rua do bonde.',
        'Guardem a mala nos armários de Namba antes de vir, ou façam a visita com ela: o santuário é plano e de cascalho fino, e a manhã inteira tem 2 km de andança.',
      ],
    },
    {
      id: 'bonde',
      photoCaption: 'O bonde Hankai passando na frente do santuário.',
      n: 2, x: 78, y: 220, kind: 'station', label: 'Bonde Hankai', side: 'right', walk: '2 min',
      coords: { lat: 34.6126, lng: 135.4928 },
      title: 'O bonde Hankai — o último de Osaka',
      jp: '阪堺電車 · 住吉鳥居前',
      facts: 'Desde **1911** · ¥230 fixo · parada Sumiyoshi-toriimae, na porta do torii',
      paragraphs: [
        'A única linha de bonde que sobrou em Osaka, com carros dos anos 1950 e 60 ainda em serviço e alguns pintados com propaganda antiga. Passa rente ao torii principal, o que rende **a foto clássica do santuário**: bonde verde, torii de pedra, telhado reto atrás.',
        'Se sobrar tempo: o bonde vai até Tennōji em 25 minutos, sacolejando por bairros de casa baixa. É Osaka de outra época por ¥230.',
      ],
    },
    {
      id: 'sorihashi',
      photoCaption: 'A Sorihashi, a ponte arqueada que se atravessa para purificar.',
      n: 3, x: 145, y: 280, kind: 'water', label: 'Sorihashi', side: 'left', walk: '3 min',
      coords: { lat: 34.6127, lng: 135.4936 },
      title: 'Sorihashi — a ponte-arco',
      jp: '反橋 · 太鼓橋',
      facts: '20 m de vão, **inclinação de 48°** no ponto mais íngreme · laca vermelha · há corrimão',
      paragraphs: [
        'A "ponte de tambor" sobre o lago da entrada. Atravessá-la é considerado purificação antes de chegar aos deuses, e a forma é o motivo: a subida é tão íngreme que obriga a andar curvado, olhando os degraus, e a descida obriga a ir devagar. Quem chega ao outro lado chegou humilde.',
        'A atual é uma reconstrução em concreto de 1981 com a forma do original; a lenda diz que a primeira foi doada por **Yodo-dono**, a viúva de Hideyoshi, no início do século XVII. Vale a pena voltar e olhá-la de fora, do lado do lago: o arco refletido na água fecha um círculo.',
      ],
    },
    {
      id: 'torii',
      photoCaption: 'O torii de pilares quadrados, o "Sumiyoshi-torii".',
      n: 4, x: 210, y: 306, kind: 'torii', label: 'Torii', side: 'left', walk: '1 min',
      coords: { lat: 34.6126, lng: 135.4943 },
      title: 'O torii de pilares quadrados',
      jp: '住吉鳥居 · 角鳥居',
      facts: 'Estilo **sumiyoshi-torii**: pilares de seção quadrada, não redonda · pedra',
      paragraphs: [
        'Os torii do Japão inteiro têm pilares redondos. Estes são **quadrados**, e o estilo leva o nome do santuário. Não há explicação certa; a mais aceita é que seja simplesmente mais antigo, de quando ninguém tinha decidido ainda como se faz um torii.',
        'Dele em diante está-se dentro do recinto sagrado: os quatro salões ficam logo atrás, cada um dentro da própria cerca.',
      ],
    },
    {
      id: 'honden',
      photoCaption: 'Os salões em sumiyoshi-zukuri: telhado reto, madeira crua, chifres em X.',
      n: 5, x: 284, y: 344, kind: 'hall', label: 'Os 4 salões', side: 'left', walk: '2 min',
      coords: { lat: 34.6122, lng: 135.4948 },
      title: 'Os quatro salões — o Japão de antes',
      jp: '本宮 · 住吉造',
      facts: 'Tesouro Nacional · reconstruídos em **1810** · três em fila e um ao lado, todos olhando para o mar',
      paragraphs: [
        'O estilo se chama **sumiyoshi-zukuri** e é, com o de Ise e o de Izumo, um dos três mais antigos do país, de antes de o budismo chegar da China no século VI: **telhado reto** de casca de cipreste, nada de curva, paredes de madeira crua com faixas de laca vermelha, e os "chifres" cruzados (*chigi*) na cumeeira. Nada de dourado, nada de escultura: é um celeiro de arroz elevado à condição de casa de deus.',
        'São quatro, porque são quatro deuses: os três **Sumiyoshi**, protetores dos marinheiros e dos poetas, em fila, um atrás do outro como barcos numa frota; e a **Imperatriz Jingū**, a fundadora lendária, ao lado. Todos olham para o oeste, para o mar: o santuário ficava na praia quando foi construído, e Osaka aterrou 5 km entre ele e a água.',
        'Os prédios eram refeitos a cada 20 anos, como em Ise; os atuais são de 1810 e foram os últimos, o que os torna os salões desse estilo mais antigos que existem.',
      ],
    },
    {
      id: 'goshogozen',
      photoCaption: 'O Goshogozen: entre o cascalho há pedrinhas com um caractere escrito.',
      n: 6, x: 250, y: 414, kind: 'stone', label: 'Goshogozen', side: 'left', walk: '3 min',
      coords: { lat: 34.6116, lng: 135.4947 },
      title: 'Goshogozen — as pedras dos cinco poderes',
      jp: '五所御前 · 五大力',
      facts: 'Um cercado de pedra com cascalho · procurar **三 pedrinhas**: 五, 大 e 力',
      paragraphs: [
        'É o lugar onde, conta-se, os deuses desceram e o santuário foi fundado: um cercado de pedra com uma pedra em pé e cascalho em volta. E dentro do cascalho há pedrinhas com **um caractere pintado**: 五 (cinco), 大 (grande) e 力 (força). Quem acha as três e as guarda juntas num saquinho (¥300 no escritório do santuário) tem os "cinco grandes poderes": saúde, sabedoria, sorte, fortuna e longevidade.',
        'É uma caça ao tesouro real, agachados, e de manhã cedo é mais fácil porque ninguém revirou o cascalho ainda. Quando o desejo se realiza, a regra é devolver as três, com mais três novas, escritas por vocês: por isso sempre há pedrinhas.',
      ],
    },
    {
      id: 'nankun',
      photoCaption: 'Nankun-sha, o subsantuário dos gatos que acenam.',
      n: 7, x: 200, y: 472, kind: 'temple', label: 'Nankun-sha', side: 'right', walk: '3 min',
      coords: { lat: 34.6108, lng: 135.4938 },
      title: 'Nankun-sha — os gatos dos comerciantes',
      jp: '楠珺社',
      facts: 'Subsantuário em volta de um cânfora de **1.000 anos** · gatinhos de cerâmica, ¥500',
      paragraphs: [
        'Um santuário em torno de uma árvore de cânfora de mil anos, dedicado à prosperidade nos negócios. Os comerciantes de Osaka vêm no início de cada mês comprar um **gato de cerâmica** que acena: a pata esquerda levantada atrai clientes, a direita atrai dinheiro. A cada mês compra-se um gato pequeno; depois de 48 meses, os 48 gatos são trocados por um grande. Osaka é a cidade dos comerciantes, e as prateleiras daqui são a prova.',
        'É um dos lugares mais fotogênicos do recinto, com centenas de gatinhos enfileirados nas prateleiras de madeira.',
      ],
    },
    {
      id: 'omokaru',
      photoCaption: 'A omokaru-ishi, a pedra que fica leve ou pesada conforme o desejo.',
      n: 8, x: 200, y: 570, kind: 'stone', label: 'Omokaru-ishi', side: 'right', walk: '4 min',
      coords: { lat: 34.6096, lng: 135.4936 },
      title: 'Omokaru-ishi — a pedra que pesa o desejo',
      jp: 'おもかる石 · 大歳社',
      facts: 'No subsantuário Ōtoshi-sha, fora do recinto, ao sul · grátis',
      paragraphs: [
        'Três pedras redondas sobre um pedestal, no pequeno Ōtoshi-sha, do outro lado da rua ao sul. O ritual: levante uma pedra e sinta o peso; ponha de volta, faça o pedido, passe a mão nela e levante de novo. Se estiver **mais leve** que da primeira vez, o desejo se realiza; se estiver mais pesada, vai dar trabalho.',
        'É o mesmo ritual da pedra de Fushimi Inari, que vocês vão ver à tarde — mas aqui não tem fila. Dali, voltar à estação são 8 minutos pela rua do bonde.',
      ],
    },
  ],
  legend: 'Azul tracejado = o bonde Hankai · vermelho = a ponte arqueada · caixas = os quatro salões · faixa cinza = o percurso',
};

const casteloOsaka: PlaceMap = {
  id: 'castelo-osaka',
  coverHotspotId: 'tenshu',
  stopId: 'd26-castelo-osaka',
  dayId: 'd2026-11-26',
  title: 'Castelo de Osaka',
  jp: '大阪城',
  subtitle: 'Dois fossos, muralhas de 30 metros e uma pedra de 108 toneladas, na ordem de quem entra pelo oeste',
  intro: [
    'O castelo é um **alvo dentro de um alvo**: fosso externo, muralha, fosso interno, muralha, torreão. Tudo de pedra é do século XVII (o castelo Tokugawa, construído por cima do de Hideyoshi); o torreão é de 1931 e tem elevador. Entra-se pelo portão Ōtemon, a oeste, e o percurso natural sobe em espiral.',
    'A ordem sugerida: **Ōtemon → Nishinomaru (vista) → Sakuramon e a pedra-polvo → torreão → Hōkoku-jinja**, saindo pelo leste para a estação ou por Aoyamon. É uma manhã inteira caminhando; 2 h bastam para fazer tudo com calma.',
  ],
  viewBox: '0 0 360 640',
  scenery: [
    { d: 'M20 40 L340 40 L340 630 L20 630 Z', fill: MAP_COLORS.forest, opacity: 0.07 },
    // fosso externo
    { d: 'M40 120 L320 120 L320 600 L40 600 Z', stroke: MAP_COLORS.water, width: 16, opacity: 0.32, fill: 'none' },
    // fosso interno
    { d: 'M120 200 L300 200 L300 460 L120 460 Z', stroke: MAP_COLORS.water, width: 14, opacity: 0.32, fill: 'none' },
    // muralhas (linha escura logo dentro dos fossos)
    { d: 'M52 132 L308 132 L308 588 L52 588 Z', stroke: MAP_COLORS.ink, width: 2, opacity: 0.35, fill: 'none' },
    { d: 'M130 210 L290 210 L290 450 L130 450 Z', stroke: MAP_COLORS.ink, width: 2.5, opacity: 0.45, fill: 'none' },
    // Nishinomaru, o gramado a oeste
    { d: 'M60 260 L110 260 L110 440 L60 440 Z', fill: MAP_COLORS.forest, opacity: 0.2 },
    // o torreão (base branca, telhados verdes, topo dourado)
    { d: 'M190 296 L230 296 L230 330 L190 330 Z', fill: MAP_COLORS.paper, stroke: MAP_COLORS.ink, width: 1.5, opacity: 0.9 },
    { d: 'M186 296 L234 296 L226 288 L194 288 Z M192 288 L228 288 L222 278 L198 278 Z M198 278 L222 278 L216 268 L204 268 Z', fill: MAP_COLORS.forest, stroke: MAP_COLORS.ink, width: 1, opacity: 0.75, round: true },
    { d: 'M206 268 L214 268 L210 258 Z', fill: MAP_COLORS.gold, opacity: 0.95 },
    // percurso: Ōtemon → Nishinomaru → Sakuramon → torreão → Hōkoku → leste
    { d: 'M40 500 L86 500 C100 480 100 360 90 330 C120 330 170 340 200 380 L210 410 L210 340 M210 380 L260 380 C290 380 300 300 300 264 L320 264', stroke: MAP_COLORS.muted, width: 10, opacity: 0.28, round: true },
    // pontes sobre os fossos
    { d: 'M32 500 L58 500', stroke: MAP_COLORS.gold, width: 5, opacity: 0.7, round: true },
    { d: 'M210 452 L210 470', stroke: MAP_COLORS.gold, width: 5, opacity: 0.7, round: true },
    { d: 'M210 194 L210 212', stroke: MAP_COLORS.gold, width: 5, opacity: 0.7, round: true },
    { d: 'M292 264 L318 264', stroke: MAP_COLORS.gold, width: 5, opacity: 0.7, round: true },
    // linha do trem, a leste
    { d: 'M296 64 L340 110 L340 640', stroke: MAP_COLORS.water, width: 3, dash: '10 6', opacity: 0.45 },
  ],
  trees: [
    { x: 80, y: 180, s: 20 }, { x: 260, y: 170, s: 20 }, { x: 150, y: 560, s: 22 }, { x: 250, y: 560, s: 22 },
    { x: 80, y: 300, s: 18 }, { x: 80, y: 400, s: 18 }, { x: 150, y: 250, s: 16 }, { x: 270, y: 430, s: 16 },
  ],
  hotspots: [
    {
      id: 'otemon',
      photoCaption: 'Ōtemon, o portão principal de 1628, sobre o fosso externo.',
      n: 1, x: 44, y: 500, kind: 'gate', label: 'Ōtemon', side: 'right',
      coords: { lat: 34.6851, lng: 135.5222 },
      title: 'Ōtemon — o portão de 1628',
      jp: '大手門',
      facts: 'Bem Cultural Importante · o mais antigo do castelo · 12 min do metrô Tanimachi 4-chōme',
      paragraphs: [
        'O portão principal, de **1628**, com um segundo portão em ângulo reto logo atrás (a "caixa" *masugata*): quem entrasse à força ficava preso num pátio, alvejado de três lados. Todo castelo japonês tem essa entrada dobrada; esta é uma das que sobreviveram intactas.',
        'Reparem no pilar do portão interno: há um remendo de carpintaria em **encaixe impossível**, uma emenda de madeira sem prego que ninguém consegue explicar como foi feita — um enigma de carpinteiro de 1848.',
      ],
    },
    {
      id: 'nishinomaru',
      photoCaption: 'O torreão visto do jardim Nishinomaru, o ângulo clássico.',
      n: 2, x: 86, y: 350, kind: 'view', label: 'Nishinomaru', side: 'right', walk: '4 min',
      coords: { lat: 34.6858, lng: 135.5237 },
      title: 'Nishinomaru — a vista do torreão',
      jp: '西の丸庭園',
      facts: '**09:00–17:00** · ¥200 · gramado de 6,5 ha, bordo e ginkgo em novembro',
      paragraphs: [
        'O jardim ocidental, onde ficava a residência de **Nene**, a viúva de Hideyoshi. Hoje é um gramado enorme com o torreão inteiro à vista por cima do fosso interno e da muralha, sem prédio na frente: **a foto do castelo é daqui**. Em novembro os ginkgos ao redor ficam amarelos.',
        'Vale os ¥200 pelos 15 minutos de vista limpa; os 600 cerejeiras daqui são o motivo de o parque lotar em abril.',
      ],
    },
    {
      id: 'sakuramon',
      photoCaption: 'A Tako-ishi, a pedra-polvo de 108 toneladas, no portão Sakuramon.',
      n: 3, x: 210, y: 470, kind: 'stone', label: 'Sakuramon · Tako-ishi', side: 'right', walk: '6 min',
      coords: { lat: 34.6863, lng: 135.5256 },
      title: 'Sakuramon e a pedra-polvo',
      jp: '桜門 · 蛸石',
      facts: 'A maior pedra do castelo: **108 toneladas**, 5,5 × 11,7 m · veio da ilha de Shōdoshima',
      paragraphs: [
        'Passando o portão Sakuramon, na parede do pátio interno, está a **Tako-ishi**, "pedra-polvo", pelo desenho de mancha que parece um polvo no canto esquerdo. São 108 toneladas de granito, 60 m² de face, trazidas de barco de uma ilha a 100 km e arrastadas morro acima com troncos e cordas por milhares de homens.',
        'Cada daimyō do Japão foi obrigado a mandar pedras e homens para a reconstrução Tokugawa (1620–29). Era de propósito: gastar o dinheiro dos senhores feudais para que não sobrasse para exércitos. Os brasões gravados nas pedras das muralhas são as "assinaturas" de cada clã que entregou a sua cota.',
      ],
    },
    {
      id: 'tenshu',
      photoCaption: 'O torreão de 1931, cinco andares de concreto com tigres dourados.',
      n: 4, x: 210, y: 314, kind: 'hall', label: 'Torreão', side: 'right', walk: '3 min',
      coords: { lat: 34.6873, lng: 135.5262 },
      title: 'Tenshu — o torreão do povo',
      jp: '天守閣',
      facts: '**09:00–17:00** · ¥600 · 8 andares, **elevador até o 5º** · vista de 360° no 8º',
      paragraphs: [
        'O terceiro torreão neste lugar. O de Hideyoshi (1585) queimou no cerco de 1615; o Tokugawa (1626) foi atingido por um raio em 1665 e nunca reconstruído; este é de **1931**, de concreto armado, pago por doações da população de Osaka em plena crise mundial: 1,5 milhão de ienes arrecadados em seis meses. Sobreviveu aos bombardeios de 1945 que destruíram tudo em volta.',
        'É museu: por dentro, os andares contam a vida de Hideyoshi e o cerco de Osaka com um diorama de bonecos e uma reprodução do biombo da batalha. Suba de elevador, veja a vista no 8º (a cidade inteira, o rio Yodo, os prédios de Umeda) e desça pela escada, andar a andar.',
        'Os **tigres e as carpas douradas** dos telhados são do estilo de Hideyoshi, que gostava de ouro: o telhado dele era de telha dourada e, dizem, o interior tinha uma sala de chá inteira de ouro.',
      ],
    },
    {
      id: 'hokoku',
      photoCaption: 'Hōkoku-jinja, o santuário de Hideyoshi, com a estátua dele na frente.',
      n: 5, x: 262, y: 396, kind: 'temple', label: 'Hōkoku-jinja', side: 'left', walk: '4 min',
      coords: { lat: 34.6856, lng: 135.5268 },
      title: 'Hōkoku-jinja — Hideyoshi virou deus',
      jp: '豊國神社',
      facts: 'Santuário de **1879**, aqui desde 1961 · grátis · estátua de bronze na entrada',
      paragraphs: [
        'Hideyoshi foi deificado logo depois de morrer (1598), com o nome **Hōkoku Daimyōjin**; os Tokugawa, quando destruíram a família dele, proibiram o culto e fecharam o santuário. Só em 1868, com o fim do xogunato, o imperador Meiji o "reabilitou", e Osaka ganhou este santuário em 1879. É a cidade cuidando do fundador.',
        'A estátua na frente é dele com o leque de general. Como era **filho de camponês** e virou o homem mais poderoso do país, é o santuário da promoção no trabalho: os comerciantes de Osaka vêm pedir carreira.',
      ],
    },
    {
      id: 'gokurakubashi',
      photoCaption: 'A ponte Gokuraku-bashi sobre o fosso interno, ao norte do torreão.',
      n: 6, x: 210, y: 190, kind: 'water', label: 'Gokuraku-bashi', side: 'right', walk: '5 min',
      coords: { lat: 34.6887, lng: 135.5263 },
      title: 'Gokuraku-bashi — a ponte do paraíso',
      jp: '極楽橋',
      facts: 'Sobre o fosso interno · o torreão inteiro refletido na água · barco do fosso sai daqui',
      paragraphs: [
        'A ponte norte, o outro ângulo clássico: o torreão visto de perto por cima do fosso interno, com a muralha de **30 metros** de altura caindo reta na água. O fosso tem 6 m de profundidade e 90 m de largura no ponto mais largo; ninguém nunca atravessou.',
        'Saindo por ela, chega-se ao jardim de ameixeiras (floridas em fevereiro) e, à direita, à estação Ōsakajō-kōen da JR em 12 minutos: é a saída natural para continuar o dia.',
      ],
    },
    {
      id: 'aoyamon',
      photoCaption: 'A muralha do fosso interno, do lado leste, vista do portão Aoyamon.',
      n: 7, x: 318, y: 264, kind: 'gate', label: 'Aoyamon', side: 'left', walk: '3 min',
      coords: { lat: 34.6867, lng: 135.5289 },
      title: 'Aoyamon — a saída leste',
      jp: '青屋門',
      facts: 'Reconstruído em 1969 · caminho para Morinomiya e Ōsakajō-kōen',
      paragraphs: [
        'O portão leste, pelo qual se sai em direção às estações. Passando-o, olhem para trás: é o trecho onde a muralha do fosso interno é mais alta e mais reta, uma parede de pedra polida que dobra em curva perfeita, sem argamassa, há 400 anos.',
        'À frente, o parque do castelo: 106 hectares, ginkgos amarelos na avenida e, ao longe, o ginásio redondo do Osaka-jō Hall.',
      ],
    },
    {
      id: 'estacao',
      photoCaption: 'A estação Ōsakajō-kōen, na Loop Line da JR.',
      n: 8, x: 296, y: 64, kind: 'station', label: 'Est. Ōsakajō-kōen', side: 'left', walk: '12 min',
      coords: { lat: 34.6906, lng: 135.5342 },
      title: 'Estação Ōsakajō-kōen',
      jp: '大阪城公園駅',
      facts: 'JR Osaka Loop Line · **Osaka/Umeda em 10 min**, Tennōji em 12',
      paragraphs: [
        'A estação do parque, na linha circular da JR. Para chegar de manhã, o metrô **Tanimachi 4-chōme** (saída 1-B) deixa vocês mais perto do Ōtemon; para sair, esta ou **Morinomiya** (ao sul) são as mais práticas, ambas na Loop Line.',
      ],
    },
  ],
  legend: 'Azul = os dois fossos · linhas pretas = as muralhas · dourado = as pontes · verde = o torreão e o Nishinomaru · faixa cinza = o percurso',
};

const kurashiki: PlaceMap = {
  id: 'kurashiki',
  coverHotspotId: 'canal',
  stopId: 'd25-bikan',
  dayId: 'd2026-11-25',
  title: 'Kurashiki',
  jp: '倉敷美観地区',
  subtitle: 'O canal dos armazéns, o museu grego e a fiação de tijolo, em três horas a pé',
  intro: [
    'O Bairro Bikan é um **canal de 500 metros** com salgueiros, armazéns brancos de telha preta e um museu com fachada de templo grego no meio. Tudo cabe numa manhã e se faz a pé, do norte para o sul, descendo o canal.',
    'A ordem: **estação → subida ao Achi-jinja (vista) → museu Ōhara → o canal e os barcos → Ivy Square**, e de volta à estação pela rua coberta. Toquem nos pontos para ver o que é cada prédio.',
  ],
  viewBox: '0 0 360 620',
  scenery: [
    { d: 'M20 40 L340 40 L340 610 L20 610 Z', fill: MAP_COLORS.forest, opacity: 0.07 },
    // o morro Tsurugata, com o santuário em cima
    { d: 'M160 240 C200 150 300 150 330 240 Z', fill: MAP_COLORS.forest, opacity: 0.2 },
    // o canal
    { d: 'M150 262 C150 320 160 380 170 430 C176 460 178 490 180 520', stroke: MAP_COLORS.water, width: 16, opacity: 0.4, round: true },
    // salgueiros: traços verdes caindo na água
    { d: 'M138 300 c-4 10 -2 18 2 22 M162 340 c4 10 2 18 -2 22 M154 400 c-4 10 -2 18 2 22 M186 460 c4 10 2 18 -2 22', stroke: MAP_COLORS.forest, width: 2, opacity: 0.6, round: true },
    // percurso: estação → rua coberta → Achi → Ōhara → canal → Ivy Square
    { d: 'M60 70 C60 130 110 170 120 210 C150 200 220 190 250 200 M120 210 L130 270 C140 300 140 330 150 360 C160 400 170 440 200 470 C230 490 260 500 280 510', stroke: MAP_COLORS.muted, width: 10, opacity: 0.28, round: true },
    // armazéns brancos ao longo do canal (quadradinhos)
    { d: 'M116 290 L138 290 L138 314 L116 314 Z M166 300 L190 300 L190 324 L166 324 Z M124 350 L146 350 L146 374 L124 374 Z M176 372 L200 372 L200 396 L176 396 Z M138 420 L160 420 L160 444 L138 444 Z M196 430 L220 430 L220 454 L196 454 Z', fill: MAP_COLORS.paper, stroke: MAP_COLORS.ink, width: 1.2, opacity: 0.85 },
    // museu Ōhara: colunas
    { d: 'M100 258 L136 258 L136 284 L100 284 Z M106 262 L106 284 M114 262 L114 284 M122 262 L122 284 M130 262 L130 284 M98 258 L118 246 L138 258', stroke: MAP_COLORS.ink, width: 1.5, opacity: 0.6, fill: 'none' },
    // Ivy Square: bloco de tijolo
    { d: 'M250 480 L320 480 L320 540 L250 540 Z', fill: MAP_COLORS.vermilion, opacity: 0.22, stroke: MAP_COLORS.ink, width: 1.2 },
    // ponte de pedra Nakabashi
    { d: 'M156 402 L184 396', stroke: MAP_COLORS.ink, width: 4, opacity: 0.6, round: true },
    // linha do trem, no topo
    { d: 'M20 56 L340 56', stroke: MAP_COLORS.water, width: 3, dash: '10 6', opacity: 0.45 },
  ],
  trees: [
    { x: 240, y: 200, s: 18 }, { x: 280, y: 210, s: 16 }, { x: 60, y: 400, s: 22 }, { x: 60, y: 500, s: 20 },
    { x: 300, y: 380, s: 20 }, { x: 250, y: 300, s: 18 }, { x: 300, y: 590, s: 20 }, { x: 120, y: 580, s: 22 },
  ],
  hotspots: [
    {
      id: 'estacao',
      photoCaption: 'A estação de Kurashiki, JR Sanyō Line.',
      n: 1, x: 60, y: 70, kind: 'station', label: 'Estação Kurashiki', side: 'right',
      coords: { lat: 34.5989, lng: 133.7620 },
      title: 'Estação Kurashiki',
      jp: '倉敷駅',
      facts: 'JR Sanyō Line, **17 min** de Okayama · armários na saída sul · 12 min a pé até o canal',
      paragraphs: [
        'Saída sul, e o caminho é a **rua coberta Kurashiki Chūō-dōri** ou a galeria comercial paralela, reta até o bairro. Guardem a mochila no armário aqui: a manhã é toda a pé.',
        'Na volta, o Shinkansen sai de Okayama, não daqui; contem 17 minutos de trem local mais a troca.',
      ],
    },
    {
      id: 'achi',
      photoCaption: 'O Achi-jinja no alto do morro, com o bairro aos pés.',
      n: 2, x: 250, y: 200, kind: 'view', label: 'Achi-jinja', side: 'left', walk: '15 min',
      coords: { lat: 34.5964, lng: 133.7713 },
      title: 'Achi-jinja — a vista de cima',
      jp: '阿智神社',
      facts: 'No morro Tsurugata, **88 degraus** · grátis · vista dos telhados pretos',
      paragraphs: [
        'O santuário do bairro, no único morro da cidade, era **uma ilha**: até o século XVII tudo em volta era mar raso, e Kurashiki nasceu do aterro. As divindades daqui são as três deusas do mar, e a glicínia do pátio tem mais de 300 anos.',
        'Sobe-se pela escada de 88 degraus (o número da sorte para a velhice) e, do alto, vê-se o bairro inteiro: os telhados de telha preta em xadrez, o canal e a chaminé de tijolo da fiação. Dez minutos que organizam o resto da manhã.',
      ],
    },
    {
      id: 'ohara',
      photoCaption: 'O museu Ōhara, de 1930, o primeiro museu de arte ocidental do Japão.',
      n: 3, x: 118, y: 270, kind: 'hall', label: 'Museu Ōhara', side: 'right', walk: '8 min',
      coords: { lat: 34.5956, lng: 133.7714 },
      title: 'Museu Ōhara — El Greco entre os armazéns',
      jp: '大原美術館',
      facts: '**09:00–17:00**, fecha 2ª · ¥2.000 · Monet, Gauguin, El Greco, Picasso, Pollock',
      paragraphs: [
        'Um templo grego entre armazéns japoneses. **Magosaburō Ōhara**, herdeiro da fiação, mandou o pintor amigo Torajirō Kojima à Europa nos anos 1920 com dinheiro para comprar o que quisesse; Kojima voltou com um **El Greco** (a Anunciação, comprada em Paris em 1922 numa loja), Monet, Gauguin e Matisse. O museu abriu em **1930**, o primeiro do Japão dedicado a arte ocidental, numa cidade de 30 mil habitantes.',
        'É o museu que vocês veem no roteiro logo a seguir: o salão principal (os europeus), o anexo (arte japonesa moderna) e a ala de artesanato nos armazéns. A Anunciação de El Greco fica numa sala só dela.',
      ],
    },
    {
      id: 'yurinso',
      photoCaption: 'Yūrinsō, a villa de telhas verdes da família Ōhara, na margem do canal.',
      n: 4, x: 216, y: 312, kind: 'sight', label: 'Yūrinsō', side: 'right', walk: '2 min',
      coords: { lat: 34.5955, lng: 133.7721 },
      title: 'Yūrinsō — a casa das telhas verdes',
      jp: '有隣荘',
      facts: 'Villa de **1928** da família Ōhara · aberta só duas vezes por ano · vê-se de fora',
      paragraphs: [
        'Do outro lado do canal, em frente ao museu, a casa de telhas **verdes vitrificadas** que Magosaburō Ōhara construiu para a mulher, doente, em 1928. As telhas foram feitas sob encomenda em Kyoto e mudam de cor com a luz; a casa mistura sala japonesa, salão ocidental e jardim de um dos grandes paisagistas da época.',
        'Só abre em duas semanas do ano, na primavera e no outono, com exposições do museu. Em novembro pode calhar: se o portão estiver aberto, entrem.',
      ],
    },
    {
      id: 'canal',
      photoCaption: 'O canal de Kurashiki, com os barcos de fundo chato e os salgueiros.',
      n: 5, x: 150, y: 350, kind: 'water', label: 'O canal', side: 'left', walk: '2 min',
      coords: { lat: 34.5950, lng: 133.7716 },
      title: 'O canal e os barcos',
      jp: '倉敷川 · 川舟流し',
      facts: 'Passeio de barco **20 min, ¥700**, saída do posto de turismo · fecha às 2ª de dez a fev',
      paragraphs: [
        'O canal era a **estrada do arroz**: os barcos de fundo chato desciam carregados dos armazéns até o rio e o Mar Interior. Os armazéns brancos, com as paredes de telha preta em losango e reboco branco (o *namako-kabe*, "parede de pepino-do-mar", pelo relevo), guardavam arroz, algodão e óleo — a riqueza de um bairro que não pagava a nenhum daimyō.',
        'O passeio de barco de 20 minutos, com barqueiro de chapéu de palha, é a maneira mais preguiçosa de ver tudo e a melhor foto. Compra-se o bilhete no posto de turismo ao lado da ponte Nakabashi; de manhã cedo não tem fila.',
      ],
    },
    {
      id: 'nakabashi',
      photoCaption: 'A ponte de pedra Nakabashi e o antigo posto da polícia.',
      n: 6, x: 170, y: 410, kind: 'stone', label: 'Nakabashi', side: 'right', walk: '3 min',
      coords: { lat: 34.5948, lng: 133.7718 },
      title: 'Nakabashi — a ponte de uma pedra',
      jp: '中橋',
      facts: 'De **1877** · duas lajes de granito arqueadas · o prédio ao lado é de 1917',
      paragraphs: [
        'A ponte de pedra do meio do canal, feita de duas lajes de granito de uma peça só, curvadas para deixar os barcos passarem por baixo. É o centro do bairro: de um lado o Kurashiki-kan, o prédio europeu branco de **1917** que foi a prefeitura e hoje é o posto de turismo; do outro, a fileira de armazéns mais fotografada.',
        'Aqui os barcos param para embarcar. Ao lado, o **Museu de Arqueologia** num armazém, e as lojas de denim e de artesanato *Kurashiki-hanpu* (lona de algodão, herdeira da fiação).',
      ],
    },
    {
      id: 'ivy',
      photoCaption: 'Ivy Square, a fiação de 1889 coberta de hera.',
      n: 7, x: 285, y: 510, kind: 'sight', label: 'Ivy Square', side: 'left', walk: '5 min',
      coords: { lat: 34.5940, lng: 133.7728 },
      title: 'Ivy Square — a fiação de tijolo',
      jp: '倉敷アイビースクエア',
      facts: 'Fábrica da **Kurabō, 1889** · hoje hotel, restaurantes e ateliês · pátio grátis',
      paragraphs: [
        'A fábrica de fiação de algodão que fez a fortuna dos Ōhara, em tijolo vermelho inglês, coberta de hera desde os anos 1920 (para refrescar os galpões no verão). Fechou em 1973 e virou um complexo com hotel, restaurante e um museu da própria fábrica; no pátio central, com as chaminés e a hera, quase não há gente.',
        'A hera fica **vermelha em novembro**. É o lugar do café da manhã tardio ou de um chá antes de voltar; dali à estação são 15 minutos pela rua principal.',
      ],
    },
    {
      id: 'honmachi',
      photoCaption: 'A rua Honmachi, a antiga estrada de casas de mercadores.',
      n: 8, x: 244, y: 460, kind: 'sight', label: 'Rua Honmachi', side: 'right', walk: '4 min',
      coords: { lat: 34.5957, lng: 133.7731 },
      title: 'Honmachi e Higashimachi — a rua dos mercadores',
      jp: '本町 · 東町',
      facts: 'A rua paralela ao canal, a leste · casas de 200 anos, hoje lojas e cafés',
      paragraphs: [
        'A rua por onde passava a estrada antes do canal, com casas de mercador de dois andares, grades de madeira e o telhado baixo do período Edo. Está a um quarteirão do canal e tem um décimo das pessoas: é onde ficam a cervejaria local, a loja de doces de 1856 e os cafés em casas antigas.',
        'Percorram-na de volta, do Ivy Square para o norte, em vez de refazer o canal: fecha o circuito sem repetir nada.',
      ],
    },
  ],
  legend: 'Azul = o canal (verde caindo = salgueiros) · caixas brancas = armazéns · colunas = o museu Ōhara · vermelho = a fiação de tijolo · faixa cinza = o percurso',
};

const shibuya: PlaceMap = {
  id: 'shibuya',
  coverHotspotId: 'cruzamento',
  stopId: 'd22-shibuya-sky',
  dayId: 'd2026-11-22',
  title: 'Shibuya à noite',
  jp: '渋谷の夜',
  subtitle: 'Do rooftop ao cruzamento, e depois às ruelas, quando a cidade acende',
  intro: [
    'Shibuya é um vale: a estação fica no fundo e as ruas sobem em todas as direções. O plano é ver a cidade **de cima, ao pôr do sol** (Shibuya Sky, reserva das 15h30), descer para o cruzamento já com os letreiros acesos, e terminar nas ruelas de bar de dois metros de largura ao lado dos trilhos.',
    'Tudo aqui é a 5 minutos a pé de tudo. Toquem nos pontos para saber o que é cada coisa; a legenda de neon é do próprio lugar.',
  ],
  viewBox: '0 0 360 620',
  scenery: [
    { d: 'M20 40 L340 40 L340 610 L20 610 Z', fill: MAP_COLORS.ink, opacity: 0.06 },
    // trilhos da JR Yamanote, cortando de norte a sul
    { d: 'M230 40 L220 200 L200 400 L190 610', stroke: MAP_COLORS.water, width: 4, dash: '12 6', opacity: 0.45 },
    // ruas principais em Y a partir do cruzamento
    { d: 'M130 320 L40 260 M130 320 L110 200 M130 320 L60 420 M130 320 L200 320', stroke: MAP_COLORS.muted, width: 12, opacity: 0.22, round: true },
    // Meiji-dōri e a rua até Miyashita
    { d: 'M200 320 L240 240 L300 150', stroke: MAP_COLORS.muted, width: 10, opacity: 0.22, round: true },
    // o cruzamento em diagonal (as faixas de pedestre)
    { d: 'M110 300 L150 340 M110 340 L150 300 M100 320 L160 320 M130 290 L130 350', stroke: MAP_COLORS.paper, width: 6, opacity: 0.9, round: true },
    { d: 'M110 300 L150 340 M110 340 L150 300 M100 320 L160 320 M130 290 L130 350', stroke: MAP_COLORS.ink, width: 1.5, dash: '4 4', opacity: 0.5, round: true },
    // a estação (bloco) e o Scramble Square (torre)
    { d: 'M150 380 L230 380 L230 440 L150 440 Z', fill: MAP_COLORS.paper, stroke: MAP_COLORS.ink, width: 1.5, opacity: 0.85 },
    { d: 'M205 440 L245 440 L245 520 L205 520 Z', fill: MAP_COLORS.gold, opacity: 0.55, stroke: MAP_COLORS.ink, width: 1.5 },
    { d: 'M212 452 L238 452 M212 466 L238 466 M212 480 L238 480 M212 494 L238 494 M212 508 L238 508', stroke: MAP_COLORS.ink, width: 1, opacity: 0.35 },
    // prédios com telões: retângulos vermelhos ao redor do cruzamento
    { d: 'M78 256 L118 256 L118 292 L78 292 Z', fill: MAP_COLORS.vermilion, opacity: 0.35 },
    { d: 'M150 250 L200 250 L200 296 L150 296 Z', fill: MAP_COLORS.vermilion, opacity: 0.25 },
    { d: 'M40 290 L74 290 L74 340 L40 340 Z', fill: MAP_COLORS.vermilion, opacity: 0.3 },
    // Miyashita Park: laje verde comprida ao longo dos trilhos
    { d: 'M250 60 L300 60 L300 170 L250 170 Z', fill: MAP_COLORS.forest, opacity: 0.3 },
    // Nonbei Yokochō: fileira de barzinhos rente ao trilho
    { d: 'M236 200 L256 200 L256 250 L236 250 Z M240 206 L252 206 M240 214 L252 214 M240 222 L252 222 M240 230 L252 230 M240 238 L252 238', stroke: MAP_COLORS.gold, width: 1.5, opacity: 0.8, fill: 'none' },
    // Center-gai, a rua de pedestre subindo
    { d: 'M110 200 L96 100', stroke: MAP_COLORS.gold, width: 8, dash: '6 5', opacity: 0.5, round: true },
  ],
  hotspots: [
    {
      id: 'sky',
      photoCaption: 'O rooftop do Shibuya Sky, a 230 m, sem vidro.',
      n: 1, x: 225, y: 480, kind: 'view', label: 'Shibuya Sky', side: 'left',
      coords: { lat: 35.6584, lng: 139.7022 },
      title: 'Shibuya Sky — o rooftop sem vidro',
      jp: '渋谷スカイ',
      facts: '**10:00–22:30** · ¥2.500 (reservado) · 46º andar, **229 m** · entrada pelo 14º do Scramble Square',
      paragraphs: [
        'O topo da torre construída em cima da estação (2019): um rooftop aberto, sem vidro, só com uma parede transparente baixa e a cidade em volta a 360°. Vê-se o cruzamento lá embaixo como um formigueiro, a Tokyo Tower, a Skytree, o Shinjuku de arranha-céus, e, com o ar seco de novembro, o **Fuji** no horizonte a oeste, exatamente onde o sol se põe.',
        'A entrada das 15h30 pega tudo: cidade de dia, o sol descendo atrás do Fuji (~16h28), o azul e depois os letreiros acendendo. Fiquem os 60–90 minutos. Casaco: lá em cima venta. Bolsas vão para o armário (obrigatório), celular preso na mão.',
        'A saída passa por um andar fechado, o Sky Gallery, com vista para o norte e um bar. Não tem pressa: o cruzamento não vai a lugar nenhum.',
      ],
    },
    {
      id: 'estacao',
      photoCaption: 'A saída Hachikō da estação de Shibuya.',
      n: 2, x: 190, y: 410, kind: 'station', label: 'Estação · saída Hachikō', side: 'left', walk: '5 min',
      coords: { lat: 35.6590, lng: 139.7010 },
      title: 'Estação de Shibuya — saída Hachikō',
      jp: '渋谷駅 ハチ公口',
      facts: '**3,3 milhões** de passageiros por dia · 9 linhas · procurem sempre "Hachikō Exit"',
      paragraphs: [
        'Uma das estações mais confusas do mundo, em obra permanente desde 2012. A regra: **saída Hachikō**, sempre, para tudo que vocês querem. As placas em inglês são boas; sigam-nas e ignorem o resto.',
        'Do Scramble Square, dá para descer pelo próprio prédio até o andar da rua e sair na praça do Hachikō em 5 minutos.',
      ],
    },
    {
      id: 'hachiko',
      photoCaption: 'A estátua do Hachikō, o ponto de encontro de Tóquio.',
      n: 3, x: 150, y: 358, kind: 'stone', label: 'Hachikō', side: 'right', walk: '1 min',
      coords: { lat: 35.6590, lng: 139.7006 },
      title: 'Hachikō — o cão que esperou',
      jp: 'ハチ公像',
      facts: 'Estátua de **1948** (a original de 1934 virou munição na guerra) · ponto de encontro da cidade',
      paragraphs: [
        'O akita que esperou o dono nesta saída todo dia, por nove anos e nove meses, depois de o professor Ueno morrer no trabalho em 1925. Um jornal contou a história em 1932, o país inteiro adotou o cachorro, e a estátua foi inaugurada em 1934 **com o próprio Hachikō presente**. Ele morreu em 1935, e está empalhado no Museu Nacional de Ciência, em Ueno.',
        'A estátua original foi derretida em 1944 para fazer munição; esta é de 1948, do filho do escultor. É *o* ponto de encontro de Tóquio: "no Hachikō" basta. Há sempre fila para a foto e, ao lado, um bonde verde antigo virado posto de turismo.',
      ],
    },
    {
      id: 'cruzamento',
      photoCaption: 'O cruzamento de Shibuya, com os telões acesos.',
      n: 4, x: 130, y: 320, kind: 'view', label: 'O cruzamento', side: 'right', walk: '1 min',
      coords: { lat: 35.6595, lng: 139.7004 },
      title: 'O cruzamento — 3.000 pessoas por sinal',
      jp: 'スクランブル交差点',
      facts: 'Sinal fecha para os carros **a cada 2 min**, todas as direções ao mesmo tempo · até 3.000 pessoas por vez',
      paragraphs: [
        'O cruzamento "scramble" mais movimentado do mundo: quando o sinal abre, todas as faixas abrem juntas, inclusive as diagonais, e a praça inteira atravessa em todas as direções, durante 47 segundos, sem esbarrar em ninguém. É um balé involuntário e o motivo de metade das cenas de Tóquio no cinema (*Lost in Translation*, *Velozes e Furiosos*).',
        'O jeito: **atravessem duas ou três vezes**, em diagonal, filmando, e depois subam para ver de cima. Os lugares de cima: a passarela da estação (grátis, para o lado do Hachikō), o **Starbucks do Tsutaya** (na esquina, o mais famoso, comprem um café e fiquem na janela do 2º andar), e o mirante gratuito no 8º do prédio Mag\'s Park, no Magnet by Shibuya 109.',
        'Os cinco telões gigantes tocam propaganda em sincronia. À noite, com a chuva fina refletindo tudo no chão, é ainda melhor.',
      ],
    },
    {
      id: 'cento-e-nove',
      photoCaption: 'O prédio cilíndrico do Shibuya 109, o marco da esquina.',
      n: 5, x: 66, y: 262, kind: 'sight', label: 'Shibuya 109', side: 'right', walk: '2 min',
      coords: { lat: 35.6596, lng: 139.6987 },
      title: 'Shibuya 109 — o cilindro prateado',
      jp: '渋谷109',
      facts: 'De **1979** · 10 andares de lojas de moda jovem · o nome é um trocadilho: tō (10) + kyū (9) = Tōkyū',
      paragraphs: [
        'O prédio cilíndrico de alumínio na bifurcação das duas avenidas, o marco visual do cruzamento e o quartel-general da moda *gyaru* dos anos 1990–2000: bronzeado artificial, cabelo descolorido, salto de 15 cm. Hoje é mais comportado, mas ainda são 10 andares de lojinhas de roupa para meninas de 17 anos, e a fachada é a mais fotografada de Shibuya depois do cruzamento.',
        'O nome vem da dona, a ferrovia **Tōkyū**: 10 (tō) e 9 (kyū). Também abre até 21h, se alguém quiser ver.',
      ],
    },
    {
      id: 'centergai',
      photoCaption: 'A Center-gai, a rua de pedestres que sobe do cruzamento.',
      n: 6, x: 104, y: 150, kind: 'food', label: 'Center-gai', side: 'right', walk: '3 min',
      coords: { lat: 35.6605, lng: 139.6995 },
      title: 'Center-gai — a rua de neon',
      jp: 'センター街',
      facts: 'Rua de pedestres de 400 m · lojas, karaokê, ramen, izakaya · lotada até a meia-noite',
      paragraphs: [
        'A rua que sai do cruzamento para o norte, entre o 109 e o Tsutaya, fechada para carros: é o **corredor de neon** que aparece nas fotos, com letreiros até o quinto andar, som de karaokê e lojas de tudo. Foi o centro da cultura jovem de Tóquio dos anos 80 até hoje; oficialmente se chama "Basketball Street" desde 2011, mas ninguém usa.',
        'Para comer: nas travessas há ramen (o Ichiran de Shibuya fica aqui perto, 24 h), izakaya de cadeia e a rua de restaurantes que sobe pela esquerda, a Dōgenzaka. É mais barulho que gastronomia: entrem por um bloco, depois virem à direita para a Nonbei.',
      ],
    },
    {
      id: 'nonbei',
      photoCaption: 'Nonbei Yokochō, a viela de bares de 1950 rente aos trilhos.',
      n: 7, x: 246, y: 225, kind: 'food', label: 'Nonbei Yokochō', side: 'left', walk: '5 min',
      coords: { lat: 35.6600, lng: 139.7032 },
      title: 'Nonbei Yokochō — o beco dos bêbados',
      jp: 'のんべい横丁',
      facts: 'Desde **1950** · ~40 bares de 5 a 8 lugares · a partir das 18h · alguns cobram *otōshi* (couvert, ¥500)',
      paragraphs: [
        'Duas vielas de dois metros de largura, espremidas entre os trilhos da Yamanote e a avenida, com uns 40 bares de madeira de dois andares onde cabem 6 pessoas no balcão e a escada é uma escada de mão. É o que sobrou do mercado negro do pós-guerra: os barracos viraram bares em 1950 e nunca mudaram de tamanho. Fica a 5 minutos do cruzamento e é outro planeta.',
        'A regra: entrem no que tiver lugar e cara simpática; peçam um *highball* ou um *nihonshu* e o que a dona sugerir. Alguns bares só aceitam clientes habituais, e a placa "members only" é para levar a sério. Dá para jantar aqui de petisco em petisco, ou beber um e ir para o jantar de verdade.',
      ],
    },
    {
      id: 'miyashita',
      photoCaption: 'Miyashita Park: o parque na cobertura, ao longo dos trilhos.',
      n: 8, x: 275, y: 115, kind: 'view', label: 'Miyashita Park', side: 'left', walk: '4 min',
      coords: { lat: 35.6615, lng: 139.7026 },
      title: 'Miyashita Park — o parque no telhado',
      jp: '宮下パーク',
      facts: 'Parque de **330 m** na cobertura de um shopping (2020) · grátis · até 23h · Shibuya Yokochō no térreo',
      paragraphs: [
        'Um parque de 330 metros de comprimento **no telhado** de um shopping de quatro andares, rente aos trilhos: gramado, skatepark, parede de escalada, e a vista dos trens da Yamanote passando ao lado. À noite vira um lugar de gente sentada na grama com cerveja de konbini olhando os prédios.',
        'No térreo, o **Shibuya Yokochō**, uma rua coberta de barraquinhas de comida regional (um balcão por província, de Hokkaidō a Okinawa), aberta até tarde e barulhenta como um festival. Se a Nonbei estiver cheia, é o plano B do jantar, e o mais fácil para ficar sentado.',
      ],
    },
  ],
  legend: 'Vermelho = prédios com telão · dourado = a torre do Sky, a Center-gai e a Nonbei · tracejado azul = os trilhos da Yamanote · verde = o parque no telhado · faixa cinza = as ruas',
};

export const PLACE_MAPS: PlaceMap[] = [kamakura, meijiJingu, parqueDaPaz, himeji, fushimiInari, higashiyama, arashiyama, nara, sensoji, miyajima, tofukuji, kinkakuji, sumiyoshi, casteloOsaka, kurashiki, shibuya];

export const placeMapById = (id: string): PlaceMap | undefined =>
  PLACE_MAPS.find((m) => m.id === id);

/** miniatura quadrada gerada por scripts/optimize-photos.mjs */
export const thumbOf = (photo: PlacePhoto) => photo.src.replace(/\.jpg$/, '.thumb.jpg');

/** chave da foto no arquivo gerado: '<mapa>/<ponto>' */
export const photoKey = (mapId: string, hotspotId: string) => `${mapId}/${hotspotId}`;

export const placeMapByStopId = (stopId: string): PlaceMap | undefined =>
  PLACE_MAPS.find((m) => m.stopId === stopId);

/**
 * Caça ao tesouro de konbini — os itens que só existem por lá,
 * espalhados em várias paradas ao longo da viagem.
 */

export interface KonbiniItem {
  /** id também usado na checklist sincronizada */
  id: string;
  title: string;
  jp: string;
  romaji: string;
  price: string;
  /** onde procurar dentro da loja */
  where: string;
  paragraphs: string[];
  tip?: string;
}

export interface KonbiniStop {
  /** dia do roteiro (dd/mm) */
  day: string;
  label: string;
  /** ids de KONBINI_ITEMS */
  itemIds: string[];
}

export const KONBINI_INTRO = [
  'O 7-Eleven japonês não é o 7-Eleven que vocês conhecem: metade da loja é comida fresca entregue **três vezes por dia**, feita por fábricas dedicadas à rede. Tem mais de 21.000 lojas no país — em Shinjuku, Ginza ou Kyoto vocês vão passar por uma a cada duas quadras sem procurar.',
  'Como a lista é grande e quase tudo é perecível, **não tentem fazer tudo numa visita só**. O plano abaixo espalha os oito itens por quatro paradas do roteiro, cada uma no momento em que ela já faz sentido — chegada, antes do Shinkansen, madrugada de Arashiyama e a repescagem final.',
  '**Regras da casa:** comer andando é malvisto — comam ali na loja (as maiores têm balcão) ou no hotel. O lixo do que vocês compram ali pode ser deixado ali. E o **caixa eletrônico do 7-Eleven aceita cartão brasileiro**, o que não é verdade em muitos bancos japoneses — é o plano B de dinheiro em qualquer bairro, 24h.',
];

export const KONBINI_ITEMS: KonbiniItem[] = [
  {
    id: 'konbini-onigiri',
    title: 'Onigiri',
    jp: 'おにぎり',
    romaji: 'onigiri',
    price: '¥130–260',
    where: 'prateleira refrigerada da entrada, junto com os bentôs',
    paragraphs: [
      'O bolinho de arroz triangular com recheio. O clássico absoluto do 7-Eleven é o **atum com maionese** (ツナマヨ, *tsuna-mayo*); os outros que valem são **salmão** (鮭, *shake*), **ume** (ameixa salgada, ácida e salgadíssima — o gosto mais japonês da lista) e **kombu**.',
      'A embalagem tem um truque: os números **1, 2, 3** impressos são um sistema que mantém a alga separada do arroz até a hora de abrir. Puxem a fita do 1 e depois as abas 2 e 3 pelos lados — a alga se enrola sozinha, sequinha. Se abrirem errado, ainda é gostoso, só que murcho.',
    ],
    tip: 'Os que têm o preço em promoção no fim da noite não têm nada de errado: a rede desconta tudo que vence no dia seguinte.',
  },
  {
    id: 'konbini-tamago-sando',
    title: 'Sanduíche de ovo',
    jp: 'たまごサンド',
    romaji: 'tamago sando',
    price: '¥250–320',
    where: 'geladeira de sanduíches, ao lado dos onigiri',
    paragraphs: [
      'O item que ficou famoso no mundo inteiro depois que Anthony Bourdain declarou, em rede nacional, que os sanduíches de ovo do 7-Eleven eram "estranhamente bons" e voltava neles todo dia.',
      'O segredo é o pão: **shokupan**, o pão de leite japonês, sem casca, com miolo denso e úmido. E a maionese **Kewpie**, feita só com gemas e com vinagre de arroz, muito mais rica que a nossa. Recheio de ovo picado em maionese, nada mais.',
    ],
    tip: 'A versão *mix sando* traz ovo + presunto + frutas na mesma caixa, se quiserem provar três de uma vez.',
  },
  {
    id: 'konbini-pudding',
    title: 'Pudding',
    jp: 'プリン',
    romaji: 'purin',
    price: '¥150–250',
    where: 'geladeira de sobremesas, no fundo da loja',
    paragraphs: [
      'O *purin* é o pudim de leite que chegou ao Japão no século XIX e virou outra coisa: mais firme que o nosso flan, com calda de caramelo amarga no fundo. A linha própria da rede, **7 Premium**, tem o *nameraka purin* ("pudim liso") — e existe uma escala inteira do supermercado ao *purin* de fabricante, que custa três vezes mais e vale.',
      'Na mesma geladeira ficam os concorrentes que valem a pena: **warabimochi**, **anmitsu** e o suflê de queijo. Comprem dois diferentes e disputem.',
    ],
  },
  {
    id: 'konbini-seven-cafe',
    title: 'Café da máquina (compra o copo)',
    jp: 'セブンカフェ',
    romaji: 'Seven Café',
    price: '¥120–200',
    where: 'copo no caixa; máquina fica ao lado do balcão',
    paragraphs: [
      'Funciona ao contrário do Brasil: vocês **pegam o copo vazio, pagam no caixa** e só então vão até a máquina fazer o café. É um dos melhores cafés baratos do Japão — grão moído na hora, a rede vende mais de um bilhão de copos por ano.',
      '**Quente** (ホット, *hotto*): o copo é de papel, fica empilhado no caixa. **Gelado** (アイス, *aisu*): o copo já vem **com gelo, lacrado, na geladeira/freezer** — vocês pegam sozinhos, pagam, e aí colocam na máquina. Os botões são R (regular) e L (grande); a máquina tem ícone e cor — vermelho quente, azul gelado.',
    ],
    tip: 'Se travar, é só apontar o copo para o atendente e dizer *onegaishimasu*. Eles apertam por vocês sem drama.',
  },
  {
    id: 'konbini-ichigo-sando',
    title: 'Sanduíche de morango com creme',
    jp: 'いちごサンド',
    romaji: 'ichigo sando',
    price: '¥300–450',
    where: 'geladeira de sanduíches e sobremesas',
    paragraphs: [
      'O *fruits sando*: o mesmo shokupan sem casca, recheado de **chantilly e morango inteiro**, cortado na diagonal para o morango aparecer no corte. Parece sobremesa e é vendido como sanduíche, na mesma prateleira do de ovo.',
      'Vocês pegam a estação certa: o morango japonês (Amaou, Tochiotome) **começa exatamente em novembro-dezembro** e é o auge do produto no país. Fora da estação, vira sanduíche de uva, kiwi ou pêssego — todos bons, mas o de morango é o que vocês querem.',
    ],
    tip: 'A versão de padaria de estação, na **Sun Etoile** ou nos *depachika*, é ainda melhor — mas essa vale por ser ¥350 num 7-Eleven de esquina.',
  },
  {
    id: 'konbini-melon-pan',
    title: 'Melon bread',
    jp: 'メロンパン',
    romaji: 'meron pan',
    price: '¥130–200',
    where: 'prateleira de pães, temperatura ambiente',
    paragraphs: [
      'Pão doce macio com uma casca de biscoito por cima, riscada em quadriculado. **Não leva melão**: o nome vem do desenho, que lembra a casca da fruta. É doce de café da manhã e existe desde os anos 1930.',
      'A versão do konbini é ótima e custa ¥150. Mas se quiserem a versão definitiva, ela já está no roteiro: a **Kagetsudō de Asakusa** (dia 19) faz o melon pan mais famoso do Japão, saído do forno, ¥250 — e o de sorvete de baunilha no meio no verão.',
    ],
  },
  {
    id: 'konbini-mochi-ice',
    title: 'Sorvete de mochi',
    jp: '雪見だいふく',
    romaji: 'Yukimi Daifuku',
    price: '¥160–220',
    where: 'freezer de sorvetes',
    paragraphs: [
      'Duas bolinhas de sorvete de baunilha embrulhadas em **mochi macio**, da Lotte, desde 1981. O nome quer dizer "daifuku de ver a neve" e não é acaso: ele foi lançado como **sorvete de inverno**, para comer aquecido por dentro olhando a neve cair. Vocês vão comer em novembro, que é exatamente o ponto.',
      'Vem com um garfinho de plástico na tampa, porque a ideia é não encostar a mão no mochi. No mesmo freezer procurem também o **azuki bar** (duríssimo, feito só de feijão doce e açúcar — é um clássico nacional) e os sorvetes de matcha da linha própria da rede.',
    ],
  },
  {
    id: 'konbini-smoothie',
    title: 'Smoothie de fruta congelada',
    jp: 'スムージー',
    romaji: 'sumūjī',
    price: '¥298–398',
    where: 'freezer perto do caixa + máquina dedicada',
    paragraphs: [
      'A ideia é ótima: no freezer tem **copos lacrados com fruta congelada picada** (morango, banana, mix de frutas vermelhas, verde com espinafre). Vocês escolhem o copo, pagam, tiram o lacre e **encaixam na máquina de smoothie** ao lado do caixa. Ela bate na hora, em uns 40 segundos, e devolve o copo pronto.',
      '**Nem toda loja tem a máquina** — foi sendo instalada desde 2023 e está mais nas lojas grandes de bairro movimentado do que nas mínimas de estação. Procurem uma máquina branca alta, do tamanho de um freezer pequeno, com foto de fruta. Se não tiver, é só ir na próxima.',
    ],
    tip: 'Este é o item mais provável de sobrar para a repescagem. Sem drama: em Shinjuku e Ginza a chance de achar a máquina é alta.',
  },
];

export const KONBINI_PLAN: KonbiniStop[] = [
  {
    day: '18/11',
    label: 'Noite da chegada, Shinjuku — o trio básico',
    itemIds: ['konbini-onigiri', 'konbini-tamago-sando', 'konbini-pudding'],
  },
  {
    day: '23/11',
    label: 'Antes do Shinkansen, na estação — comida de trem',
    itemIds: ['konbini-melon-pan', 'konbini-ichigo-sando'],
  },
  {
    day: '29/11',
    label: 'Madrugada de Arashiyama — café antes do bambuzal',
    itemIds: ['konbini-seven-cafe', 'konbini-smoothie'],
  },
  {
    day: '02/12',
    label: 'Último dia em Tóquio — sobremesa e repescagem',
    itemIds: ['konbini-mochi-ice'],
  },
];

export const KONBINI_ITEM_BY_ID = Object.fromEntries(
  KONBINI_ITEMS.map((i) => [i.id, i]),
) as Record<string, KonbiniItem>;

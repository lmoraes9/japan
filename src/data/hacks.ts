/**
 * Hacks de konbini e farmácia — o que se compra numa prateleira japonesa e
 * resolve um problema de viagem. Cada item tem foto porque, sem ela, não dá
 * para achar o produto na loja: o rótulo é em japonês e as embalagens são
 * parecidas.
 *
 * Fotos: as marcadas com `foto` são recortes dos prints que o Leonardo mandou;
 * as outras vêm do pipeline de fotos (`npm run fotos`, chave `hacks/<id>`).
 */
import type { PlacePhoto } from './placeMaps';

export type HackCategoria = 'combo' | 'bebida' | 'farmacia';

export interface HackItem {
  id: string;
  categoria: HackCategoria;
  title: string;
  jp: string;
  romaji: string;
  /** o problema que resolve, em três palavras */
  para: string;
  /** konbini, farmácia, ou os dois */
  onde: string;
  preco: string;
  paragraphs: string[];
  /** como usar / dose */
  como?: string;
  /** o que não fazer */
  aviso?: string;
  /** foto própria (recorte de print) — quando não há, usa PLACE_PHOTOS['hacks/<id>'] */
  foto?: PlacePhoto;
  /** o Leonardo pediu este por nome */
  pedido?: boolean;
}

export const HACKS_INTRO = [
  'Duas prateleiras resolvem quase tudo numa viagem de 15 dias: **a geladeira do konbini** (7-Eleven, FamilyMart, Lawson — 24h, em toda esquina) e **a farmácia de rede** (Matsumoto Kiyoshi, Sun Drug, Welcia, Kokumin, Daikoku — até 22h, tax-free acima de ¥5.000). O que está aqui é o que vale a pena conhecer **antes** de precisar.',
  'Remédio no Japão tem uma etiqueta de classe na caixa: **第1類** só com farmacêutico (ele pergunta e libera), **第2類** e **第3類** é pegar na prateleira. Nada disso exige receita. Konbini vende só o que não é remédio — água, bebida, curativo, máscara.',
  'Regra de bom senso que vale para tudo abaixo: **o que é "funcional" (機能性表示食品) é alimento com uma alegação registrada pela própria empresa**, não remédio, e o efeito, quando existe, é pequeno. O que é 医薬品 é remédio de verdade. A página diz qual é qual.',
];

export const HACKS: HackItem[] = [
  // ── combos virais ──
  {
    id: 'coolish-cafe',
    categoria: 'combo',
    title: 'Café preto + Coolish — o "frappé" de ¥300',
    jp: 'セブンカフェ アイスコーヒー × クーリッシュ',
    romaji: 'Sebun Kafe aisu kōhī × Kūrisshu',
    para: 'o café com creme viral',
    onde: '7-Eleven · copo de gelo no freezer (pagar no caixa) + Coolish no freezer de sorvetes',
    preco: '~¥300–330 · café gelado R ~¥140 + Coolish ~¥180',
    paragraphs: [
      'O hack que mais roda no TikTok de quem vai ao Japão. O **Coolish** (クーリッシュ, Lotte) é um sorvete de baunilha que vem numa **bolsinha de apertar**, feito para beber — por isso ele se mistura no café sem virar pedra. Vocês pegam o copo de café gelado do Seven Café (o que já vem com gelo, lacrado, no freezer), pagam os dois no caixa, tiram o café na máquina e espremem o Coolish por cima. Sai um café com creme meio frappé, meio affogato, pelo preço de um cappuccino no Brasil.',
      'Variação sem máquina: **Boss Black** (a garrafa preta da Suntory) + Coolish num copo de gelo, uns ¥380. E a variação que o japonês faz: **café latte** em vez de preto, com um copinho de **gelatina de café** (コーヒーゼリー, da geladeira de sobremesas) no fundo.',
    ],
    como: 'Tirar o café, dar um gole para abrir espaço, espremer metade do Coolish, mexer com o canudo. O resto vai no final, por cima. **Não** ponham o Coolish antes do café: a máquina não enche direito.',
    aviso: 'O copo de gelo vai ao caixa **antes** da máquina. Usar a máquina sem pagar é o erro clássico de turista.',
    pedido: true,
  },
  {
    id: 'matcha-coolish',
    categoria: 'combo',
    title: 'Matcha latte + Coolish — o matcha frappé',
    jp: '抹茶ラテ × クーリッシュ',
    romaji: 'Matcha rate × Kūrisshu',
    para: 'o primo verde do anterior',
    onde: '7-Eleven · matcha latte na geladeira de copos; copo de gelo e Coolish no freezer',
    preco: '~¥450–500',
    paragraphs: [
      'Mesma lógica: o **matcha latte gelado** de copo derramado sobre um copo de gelo com Coolish de baunilha espremido no fundo. Fica mais doce e mais cremoso que o latte sozinho, e sai por menos da metade de um matcha frappé de café de Kyoto.',
      'É o combo que vira foto. O matcha de verdade fica para Kyoto — este é o de ¥450 da esquina.',
    ],
    como: 'Coolish no fundo do copo de gelo, matcha por cima, mexer. Canudo se pede no caixa: *sutorō kudasai*.',
  },
  {
    id: 'oyako-sando',
    categoria: 'combo',
    title: 'Famichiki dentro do sanduíche de ovo — o "oyako sando"',
    jp: 'ファミチキ × たまごサンド',
    romaji: 'Famichiki × tamago sando',
    para: 'o almoço de ¥550',
    onde: 'FamilyMart · Famichiki na estufa do caixa (pedir pelo nome) + たまごサンド na geladeira de sanduíches',
    preco: '~¥520–560 · Famichiki ~¥230 + tamago sando ~¥298',
    paragraphs: [
      'O frango frito sem osso da FamilyMart, o **Famichiki**, enfiado entre as fatias do sanduíche de ovo da mesma loja. O nome é piada com o *oyakodon* — "tigela de pai e filho", frango e ovo —, e é o combo que os próprios japoneses mais postam: a crosta quente e crocante contra o creme de ovo gelado e o shokupan macio.',
      'O sanduíche de ovo da FamilyMart aparece em várias listas japonesas como o melhor dos três konbini — o que faz dela uma boa loja para o item do Bourdain também.',
    ],
    como: 'Separar as fatias de um dos triângulos, meter o Famichiki (ou metade em cada). Comer ali, no balcão da loja.',
  },
  {
    id: 'pizzaman-chicken',
    categoria: 'combo',
    title: 'Dois pizza-man + frango frito — a parmegiana de konbini',
    jp: 'ピザまん × からあげ',
    romaji: 'Piza-man × karaage',
    para: 'a noite fria de novembro',
    onde: 'qualquer konbini · estufa de vapor ao lado do caixa (中華まん) + frango na estufa quente',
    preco: '~¥550–600',
    paragraphs: [
      'O *pizza-man* é o pão cozido no vapor (o mesmo do *nikuman*) recheado de **molho de tomate e queijo derretido**. Dois deles viram o pão de um hambúrguer, e um pedaço de frango frito do caixa (Famichiki na FamilyMart, Nanachiki no 7-Eleven, Karaage-kun na Lawson) vira o recheio: sai algo muito perto de um sanduíche de frango à parmegiana.',
      'Por que está aqui: a estufa de *chūka-man* é coisa de **outono e inverno**, e em novembro está em todas as lojas, com nikuman, anman (feijão doce) e pizza-man. Se quiserem só um, o **nikuman** puro é o clássico.',
    ],
    como: 'Pedir apontando para a estufa: *piza-man futatsu* (dois pizza-man). Abrir cada um ao meio como pão de hambúrguer e montar.',
  },
  {
    id: 'yukimi-curry',
    categoria: 'combo',
    title: 'Cup Noodle de curry + Yukimi Daifuku — o esquisito',
    jp: 'カップヌードル カレー × 雪見だいふく',
    romaji: 'Kappu Nūdoru karē × Yukimi Daifuku',
    para: 'para contar que provou',
    onde: 'qualquer konbini · lámen instantâneo na prateleira, sorvete no freezer; água quente no dispensador perto do micro-ondas',
    preco: '~¥420 · Cup Noodle ~¥250 + Yukimi ~¥180 (duas bolinhas)',
    paragraphs: [
      'O viral que parece erro: uma bolinha do **Yukimi Daifuku** (o sorvete de baunilha embrulhado em mochi) jogada dentro do **Cup Noodle de curry** pronto. O sorvete derrete e deixa o caldo cremoso e mais suave, como curry japonês com leite; o mochi amolece e fica puxa-puxa. Quem prova costuma dizer que é melhor do que devia.',
      'O Yukimi é **sorvete de inverno** — sai das lojas na primavera e volta no outono —, então novembro é a estação. A outra bolinha fica para a sobremesa, que era a ideia original.',
    ],
    como: 'Encher o Cup Noodle com a água quente do konbini, esperar 3 min, pôr **uma** bolinha, mexer até derreter.',
    aviso: 'Não é para todo mundo. Uma bolinha para o experimento; a outra para quem desistir.',
  },
  {
    id: 'onigiri-misoshiru',
    categoria: 'combo',
    title: 'Onigiri + missoshiru de copo — o café da manhã de ¥300',
    jp: 'おにぎり × カップ味噌汁',
    romaji: 'onigiri × kappu misoshiru',
    para: 'a manhã antes do trem',
    onde: 'qualquer konbini · sopa de copo na prateleira de instantâneos; água quente no dispensador',
    preco: '~¥280–350',
    paragraphs: [
      'Não é viral de TikTok, é o hack de quem mora lá: o café da manhã japonês mínimo, arroz e sopa, por menos de ¥350. O **missoshiru de copo** (カップ味噌汁 — com tofu, cebolinha, alga) se enche com a **água quente do próprio konbini**, um dispensador que fica perto do micro-ondas ou atrás do balcão.',
      'Resolve as manhãs de trem cedo — a saída para Kōyasan, o Shinkansen do dia 23 — sem depender do café do hotel. Com um onigiri de salmão e outro de ume, dá e sobra.',
    ],
    como: 'Pagar, abrir o copo, encher até a linha, tampar e esperar 1 min. Se a água quente não estiver à vista: *oyu arimasu ka?* ("tem água quente?").',
  },
  {
    id: 'ice-cup',
    categoria: 'combo',
    title: 'O copo de gelo — o bar do quarto de hotel',
    jp: 'ロックアイス カップ',
    romaji: 'rokku aisu kappu',
    para: 'a highball do fim do dia',
    onde: 'qualquer konbini · freezer, junto do gelo em saco',
    preco: '~¥100–150 o copo',
    paragraphs: [
      'O copo de gelo lacrado é vendido sozinho — e o japonês usa como copo de bar. Pega-se um **highball de lata** (ハイボール, uísque com soda — o Kaku da Suntory é o clássico), um **chūhai** de limão, ou um **Calpis** para quem não bebe, e serve no gelo, no quarto. No freezer do 7-Eleven também há **fruta congelada** para jogar dentro.',
      'É o fim de noite mais barato e mais japonês da viagem: uns ¥350 por uma highball gelada de verdade depois de um dia de 25.000 passos, sem sair do hotel.',
    ],
    como: 'Um copo por pessoa, bebida por cima, canudo do caixa.',
    aviso: 'As latas **Strong Zero** e parecidas têm 9% de álcool e gosto de refrigerante: uma vale quase três cervejas. Uma basta.',
  },

  // ── bebidas ──
  {
    id: 'tokusui',
    categoria: 'bebida',
    title: 'Tokusui — a "água da gordura visceral"',
    jp: 'サントリー 特水',
    romaji: 'Tokusui',
    para: 'a água viral',
    onde: 'konbini (7-Eleven, FamilyMart, Lawson) e farmácia · geladeira das águas',
    preco: '¥150–190 · 600 ml',
    paragraphs: [
      'É a garrafa azul da Suntory que virou vídeo: **água mole (軟水) com um composto chamado HMPA**, registrada como **alimento funcional** (機能性表示食品) com a alegação de "ajudar a reduzir gordura visceral em quem tem IMC alto". O número de registro está no rótulo, e é isso que o vídeo não mostra: **é alimento, não remédio**, a alegação é da empresa, e o estudo que a sustenta é sobre semanas de uso, não sobre uma viagem.',
      'Vale beber? Como água, é boa — mole, leve, sem gosto. Como hack, é o mais inofensivo da lista: o pior que acontece é vocês pagarem ¥170 numa água de ¥110. Provem, tirem a foto, e depois voltem para a água normal.',
    ],
    como: 'Igual a qualquer água. A "dose" do registro é uma garrafa por dia.',
    foto: { src: '/lugares/hacks/tokusui.jpg', credit: 'print de @towanderwithpaul', license: 'Instagram', source: 'https://www.instagram.com/towanderwithpaul/', title: 'Tokusui' },
    pedido: true,
  },
  {
    id: 'pocari',
    categoria: 'bebida',
    title: 'Pocari Sweat — o isotônico de 25.000 passos',
    jp: 'ポカリスエット',
    romaji: 'Pokari Suetto',
    para: 'dia de andar demais',
    onde: 'qualquer konbini, máquina de venda, farmácia',
    preco: '¥150–170 · 500 ml',
    paragraphs: [
      'O isotônico que o Japão inteiro toma quando está gripado, de ressaca ou depois de suar. Menos doce e menos ácido que o Gatorade, com sódio na medida — foi desenhado por uma farmacêutica (Otsuka) a partir de soro de hospital. Em dia de 25.000 passos com bolsa nas costas, uma garrafa à tarde evita a dor de cabeça da noite.',
      'Se alguém passar mal de verdade — enjoo, tontura, diarreia — a versão de farmácia é o **OS-1** (オーエスワン), que é soro de reidratação oral de fato. Custa o dobro e é o que o médico japonês manda tomar.',
    ],
    como: 'Uma garrafa por dia de caminhada longa. Gelada é melhor, mas a de temperatura ambiente da prateleira também serve.',
  },
  {
    id: 'ukon',
    categoria: 'bebida',
    title: 'Ukon no Chikara — o ritual de antes de beber',
    jp: 'ウコンの力',
    romaji: 'Ukon no Chikara',
    para: 'antes do saquê',
    onde: 'konbini — geladeira pequena ao lado do caixa',
    preco: '¥200–250 · 100 ml',
    paragraphs: [
      'A garrafinha laranja de **cúrcuma** (ukon) que o japonês toma **antes** de uma noite de izakaya. É o ritual mais difundido do país: o vendedor do konbini de sexta à noite vende dezenas. A ciência por trás é fraca — cúrcuma tem pouca absorção e os estudos são pequenos —, mas o ritual em si tem valor: quem toma um Ukon geralmente bebe um copo de água junto e come alguma coisa antes.',
      'Entra aqui porque a noite do dia 27 é **saquê em Fushimi** e o dia 22 tem o Golden Gai. Tomem se quiserem fazer parte da liturgia. Não esperem milagre.',
    ],
    como: 'Uma garrafinha 30 min antes de começar a beber. Sabor de laranja com fundo de terra.',
  },
  {
    id: 'hepalyse',
    categoria: 'bebida',
    title: 'Hepalyse W — o outro ritual',
    jp: 'ヘパリーゼW',
    romaji: 'Heparīze',
    para: 'antes ou depois de beber',
    onde: 'konbini (mesma geladeira do Ukon) e farmácia',
    preco: '¥300–400 · 50 ml',
    paragraphs: [
      'O concorrente do Ukon, à base de **extrato de fígado** (hepa-). A versão de konbini é a W, que é "bebida"; a de farmácia, marcada 医薬品, é a que tem status de remédio para "fadiga e apetite". Mesma história: mais ritual que ciência, mas é o que o salaryman ao lado de vocês no balcão está tomando.',
      'Se forem provar um dos dois, provem este: o gosto é menos estranho.',
    ],
    como: 'Antes de beber ou na manhã seguinte. Um frasco só.',
  },
  {
    id: 'lipovitan',
    categoria: 'bebida',
    title: 'Lipovitan D — o energético original',
    jp: 'リポビタンD',
    romaji: 'Ripobitan Dī',
    para: 'a tarde que não acaba',
    onde: 'konbini e farmácia, na prateleira de garrafinhas marrons',
    preco: '¥150–200 · 100 ml',
    paragraphs: [
      'A garrafinha marrom de 1962 que inventou a categoria "bebida energética" — décadas antes do Red Bull. **Taurina e 50 mg de cafeína** (meio café), gosto de xarope de laranja. É remédio de classe 指定医薬部外品: pode em qualquer loja. O bordão da propaganda, *"Faito! Ippatsu!"*, é conhecido por todo japonês vivo.',
      'Serve para o buraco das 16h no dia de Kōyasan ou na maratona de Higashiyama. Não tomem depois das 18h se quiserem dormir. O **Oronamin C**, a garrafinha com tampa de metal ao lado, é a versão refrigerante, sem a cafeína toda.',
    ],
    como: 'Um por dia, de manhã ou no meio da tarde. Não é para misturar com álcool.',
  },
  {
    id: 'yakult1000',
    categoria: 'bebida',
    title: 'Yakult 1000 — o que dorme melhor',
    jp: 'ヤクルト1000 / Y1000',
    romaji: 'Yakuruto sen',
    para: 'o jet lag da primeira semana',
    onde: 'konbini, geladeira de laticínios — o de konbini chama Y1000',
    preco: '¥150–180 · 100 ml',
    paragraphs: [
      'O Yakult com **1.000 bilhões** de lactobacilos casei Shirota, registrado como funcional para "qualidade do sono e estresse". Virou fenômeno em 2022, esgotou por meses, e a Yakult ainda raciona: o de konbini é a versão **Y1000** (garrafa azul-escura), o de entregador é o 1000. Diferença nenhuma que importe.',
      'Vale para o jet lag? A alegação é sobre uso contínuo, mas é probiótico, é barato, e uma semana de Y1000 antes de dormir não faz mal a ninguém. Se estiver esgotado — acontece —, é sinal de que o bairro é bom.',
    ],
    como: 'Um por dia, de preferência à noite, todos os dias que der.',
  },

  // ── farmácia ──
  {
    id: 'seirogan',
    categoria: 'farmacia',
    title: 'Seirogan — o clássico da diarreia',
    jp: '正露丸',
    romaji: 'Seirogan',
    para: 'estômago desarrumado',
    onde: 'farmácia (第2類医薬品) — caixa laranja com a corneta, impossível errar',
    preco: '~¥1.000 · 100 comprimidos',
    paragraphs: [
      'Bolinhas pretas de **creosoto de madeira** que o Japão toma para diarreia e "estômago desarrumado" desde a guerra russo-japonesa (o nome original era 征露丸, "vencer a Rússia"). Cheiro forte de madeira queimada que atravessa a caixa — quem já usou reconhece de longe, e o hotel também: guardem em saquinho fechado.',
      'Funciona para a diarreia comum de viagem (comida diferente, água diferente, gelo demais). Existe a versão **Quick C** (正露丸クイックC), cápsula sem cheiro, um pouco mais cara: para a mala, é a melhor.',
    ],
    como: 'Adulto: 3 bolinhas, até 3 vezes ao dia, depois de comer, com água. Sem mastigar.',
    aviso: 'Diarreia com febre ou com sangue não é caso de Seirogan — é caso de médico (lista em Emergência). E não é para "prevenir": só quando há sintoma.',
    foto: { src: '/lugares/hacks/seirogan.jpg', credit: 'print de @coisasdojapao', license: 'Instagram', source: 'https://www.instagram.com/coisasdojapao/', title: 'Seirogan' },
    pedido: true,
  },
  {
    id: 'cabagin',
    categoria: 'farmacia',
    title: 'Eki-Kyabe (Cabagin líquido) — o estômago depois do excesso',
    jp: '液キャベコーワA',
    romaji: 'Eki-Kyabe Kōwa',
    para: 'ramen demais, sushi demais, saquê demais',
    onde: 'farmácia (第2類医薬品), geladeira ou prateleira de garrafinhas; alguns konbini têm o comprimido Cabagin α',
    preco: '¥300–400 · 50 ml',
    paragraphs: [
      'A garrafinha verde e preta da Kowa: **8 extratos de ervas mais MMSC**, o "vitamina U" derivado do repolho (daí *kyabe*, de *cabbage*) que dá nome à linha Cabagin. É antiácido e protetor de mucosa em forma de shot amargo, feito exatamente para o rótulo diz: **二日酔いのむかつき・食べすぎに** — "enjoo de ressaca e comilança".',
      'É o que resolve o dia depois do jantar de despedida, ou a tarde depois de Tsukiji às 7 da manhã. A versão em comprimido (Cabagin Kōwa α, caixa verde) faz o mesmo mais devagar e cabe no bolso.',
    ],
    como: 'Um frasco, antes ou depois da refeição pesada. Não mais que um por dia.',
    foto: { src: '/lugares/hacks/cabagin.jpg', credit: 'print de @JapanShoppingGuide_OsakaKyoto', license: 'TikTok', source: 'https://www.tiktok.com/@japanshoppingguide_osakakyoto', title: 'Eki-Kyabe' },
    pedido: true,
  },
  {
    id: 'ryukakusan',
    categoria: 'farmacia',
    title: 'Ryukakusan — a garganta do ar-condicionado',
    jp: '龍角散',
    romaji: 'Ryūkakusan',
    para: 'garganta seca, tosse de hotel',
    onde: 'a lata azul é de farmácia (第3類医薬品); as balas (龍角散ののどすっきり飴) estão em qualquer konbini',
    preco: 'lata ~¥800–1.000 · balas ¥200',
    paragraphs: [
      'Um pó fino de ervas com fórmula de **mais de 200 anos** (a casa é de 1871, a receita vem do clã Satake, de Akita), que se põe na língua e derrete **sem água**. Para pigarro, tosse seca e voz cansada — o que acontece depois de 15 dias de hotel com ar-condicionado, Shinkansen e conversa em pé o dia inteiro.',
      'A lata azul com o brasão é o original e o mais forte. As **balas** e os sticks *Ryukakusan Direct* (龍角散ダイレクト), que vêm em sachê, são o formato fácil: konbini, bolso, sem cheiro. Para viagem, comecem pelas balas.',
    ],
    como: 'Pó: uma colherzinha (vem na lata) na língua, deixar derreter, até 6 vezes ao dia. Bala: à vontade.',
    foto: { src: '/lugares/hacks/ryukakusan.jpg', credit: 'print de @coisasdojapao', license: 'Instagram', source: 'https://www.instagram.com/coisasdojapao/', title: 'Ryukakusan' },
    pedido: true,
  },
  {
    id: 'kizupower',
    categoria: 'farmacia',
    title: 'Kizu Power Pad — a bolha no pé',
    jp: 'バンドエイド キズパワーパッド',
    romaji: 'Kizu Pawā Paddo',
    para: 'o segundo dia de quem andou demais',
    onde: 'farmácia e konbini grande, na prateleira de curativos · caixa azul-petróleo da Band-Aid',
    preco: '¥600–900 · 3 a 6 unidades',
    paragraphs: [
      'Curativo de **hidrocoloide**: gruda na bolha, absorve o líquido, vira uma almofada gelatinosa e **tira a dor na hora**. Fica colado no banho e dura até 5 dias — é para pôr uma vez e esquecer, não para trocar todo dia. A embalagem escreve 貼る、ほっとく、治る: "cola, deixa quieto, sara".',
      'Vem em tamanhos: **ジャンボ** (jumbo) para calcanhar, **普通** (normal) para dedo. Levem uma caixa de cada na mochila desde o dia 19 — a bolha nunca aparece no hotel.',
    ],
    como: 'Pele limpa e seca, sem pomada nenhuma por baixo. Aquecer o curativo na mão antes de colar. Deixar até soltar sozinho.',
    aviso: 'Não é para bolha estourada e suja, nem para ferida com pus: aí é lavar, secar e usar curativo comum.',
    foto: { src: '/lugares/hacks/kizupower.jpg', credit: 'print de @coisasdojapao', license: 'Instagram', source: 'https://www.instagram.com/coisasdojapao/', title: 'Kizu Power Pad' },
    pedido: true,
  },
  {
    id: 'salonpas',
    categoria: 'farmacia',
    title: 'Salonpas — o adesivo das pernas',
    jp: 'サロンパス',
    romaji: 'Saronpasu',
    para: 'panturrilha e lombar depois de Fushimi Inari',
    onde: 'farmácia e alguns konbini · caixa branca e verde da Hisamitsu',
    preco: '¥600–1.200 · 40 a 140 folhas',
    paragraphs: [
      'O adesivo analgésico que o Japão inventou em 1934 e usa como se fosse band-aid: **salicilato de metila e mentol** num emplastro fino, que esfria e alivia dor muscular. Panturrilha depois dos 4 km de escadaria do Fushimi Inari, lombar depois de dormir no futon do Kōyasan — é para isso.',
      'A caixa grande é barata e rende a viagem inteira. A versão **Salonpas Hot** (vermelha) esquenta em vez de esfriar; para dor de andar, a normal é melhor.',
    ],
    como: 'Pele seca, colar sobre o músculo dolorido, trocar a cada 8–12 h. Lavar as mãos depois: mentol no olho arde.',
    aviso: 'Não em pele machucada, e não junto com o Kizu Power Pad no mesmo lugar.',
  },
  {
    id: 'eve',
    categoria: 'farmacia',
    title: 'EVE A — a dor de cabeça',
    jp: 'イブA錠',
    romaji: 'Ibu Ē',
    para: 'dor de cabeça, cólica, dente',
    onde: 'farmácia (指定第2類医薬品) · caixa branca e rosa',
    preco: '¥700–1.000 · 24 a 60 comprimidos',
    paragraphs: [
      'O analgésico mais vendido do Japão: **ibuprofeno 150 mg** por dose com um ansiolítico leve e cafeína. É o equivalente do Advil, com dose menor. Serve para dor de cabeça de jet lag, cólica e dente. A versão **EVE Quick** dissolve mais rápido; a **EVE A EX** é mais forte.',
      'Se precisarem de algo mais forte, o **Loxonin S** (ロキソニンS, loxoprofeno) é 第1類: o farmacêutico faz duas perguntas e entrega. É o que o japonês toma para dor de verdade.',
    ],
    como: '2 comprimidos, até 3 vezes ao dia, com intervalo de 4 h, sempre depois de comer algo.',
    aviso: 'Não com álcool, não de estômago vazio, e não para quem tem alergia a anti-inflamatório.',
  },
  {
    id: 'megrhythm',
    categoria: 'farmacia',
    title: 'MegRhythm — a máscara de vapor',
    jp: 'めぐりズム 蒸気でホットアイマスク',
    romaji: 'Megurizumu',
    para: 'o voo de 14 horas e a noite mal dormida',
    onde: 'konbini (avulsa, ao lado do caixa) e farmácia (caixa com 5 ou 12)',
    preco: '¥150–200 a unidade · ¥1.000 a caixa de 5',
    paragraphs: [
      'Uma máscara de olhos descartável que **esquenta sozinha** ao abrir o pacote e solta vapor morno por uns 20 minutos, a 40 °C. É o produto mais copiado da Kao e o mais levado de presente do Japão. Para o voo de volta de 11h40, para o Shinkansen, e para a noite em que o cérebro não desliga.',
      'Tem versões com aroma (lavanda, camomila, yuzu) e sem. A sem aroma é a que dá para usar no avião sem incomodar o vizinho.',
    ],
    como: 'Abrir, desdobrar, colocar. Não é reutilizável. Não dormir com ela mais de meia hora.',
  },
];

export const HACKS_CATEGORIA: Record<HackCategoria, { titulo: string; jp: string; resumo: string }> = {
  combo: {
    titulo: 'Combos virais',
    jp: 'コンビニアレンジ',
    resumo: 'Dois produtos da mesma loja que viram um terceiro: o café com Coolish de ¥300, o Famichiki no sanduíche de ovo, a parmegiana de pizza-man, o lámen com sorvete.',
  },
  bebida: {
    titulo: 'Geladeira do konbini',
    jp: 'コンビニ',
    resumo: 'O que se bebe: a água viral, o isotônico, os dois rituais da bebedeira, o energético original e o Yakult que dorme.',
  },
  farmacia: {
    titulo: 'Farmácia',
    jp: 'ドラッグストア',
    resumo: 'O que se toma ou se cola: barriga, garganta, bolha, perna, dor de cabeça e o vapor nos olhos.',
  },
};

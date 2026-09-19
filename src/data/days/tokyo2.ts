import type { Day } from '../types';

export const tokyo2Days: Day[] = [
  {
    id: 'd2026-12-02',
    date: '2026-12-02',
    stageId: 'tokyo2',
    title: 'Curry de Jimbōchō, Nihonbashi, Akihabara e jantar de despedida',
    subtitle: 'O último dia inteiro. Fechar tudo, separar os recibos, e as missões de Akihabara.',
    chips: ['curry', 'akihabara', 'compras', 'sushi'],
    notes: [
      {
        label: 'A manhã é opcional — decidam na hora',
        tone: 'info',
        text: 'O dia **começa de verdade no curry, às 11:20**. O que vem antes disso é um passeio curto de graça, para o caso de vocês acordarem com pique. Se não acordarem, durmam: é o décimo quinto dia de viagem, vocês têm mala para fechar e recibo para separar, e amanhã a manhã some no aeroporto por causa do reembolso do imposto. **Pular não custa nada ao roteiro.**',
      },
    ],
    stops: [
      {
        id: 'd02-kanda-myojin',
        time: '09:15',
        timeLabel: 'opcional',
        kind: 'temple',
        name: 'Kanda Myōjin — o santuário que abençoa computador',
        jp: '神田明神',
        facts: 'Pátio **24h · grátis** · 5 min a pé de Ochanomizu · amuleto de segurança da informação **¥1.000**',
        paragraphs: [
          'Santuário guardião de Edo desde **730**. Mas a graça está no que ele virou: como **Akihabara fica logo ali embaixo**, empresas de tecnologia sobem aqui para ter servidores e escritórios abençoados, e o santuário vende um amuleto chamado **IT情報安全守護** — "proteção da segurança da informação". São ¥1.000 por um cartão e dois adesivos para colar no computador, contra pane e vazamento de dados. É o souvenir mais engraçado que vocês vão achar no Japão, e ele é levado a sério.',
          'Olhem o mural de *ema*, as tabuinhas de madeira onde se escrevem pedidos: aqui elas estão **cobertas de desenhos de anime**. O bairro adotou o santuário e o santuário adotou o bairro de volta.',
        ],
        history: {
          paragraphs: [
            'Uma das três divindades consagradas aqui é **Taira no Masakado** — o samurai que, em 939, se rebelou contra a corte de Kyoto e se declarou **novo imperador**. Durou dois meses: foi morto em batalha e teve a cabeça exposta em Kyoto. A lenda diz que a cabeça se recusou a apodrecer, ficou meses com os olhos abertos e um dia **voou de volta para o leste**, caindo onde hoje é Ōtemachi — a dois passos do Palácio Imperial.',
            'O túmulo da cabeça, o *kubizuka*, continua lá, encravado entre torres de escritório do distrito financeiro. Toda tentativa de removê-lo terminou mal o bastante para que ninguém mais tente: o terreno, hoje dos mais caros do mundo, segue ocupado por um túmulo do século X. E quando o governo Meiji quis rebaixar Masakado — um rebelde contra o imperador não podia ser deus —, ele foi retirado da lista de divindades daqui em 1874 e **só foi devolvido em 1984**, depois de décadas de insistência do bairro.',
          ],
        },
        mapQuery: 'Kanda Myojin Shrine Tokyo',
      },
      {
        id: 'd02-yushima-seido',
        time: '10:15',
        timeLabel: 'opcional',
        kind: 'temple',
        name: 'Yushima Seidō e a ponte dos dois templos',
        jp: '湯島聖堂',
        facts: 'Pátio **09:30–16:00 no inverno · grátis** · o salão principal só abre sábado, domingo e feriado',
        paragraphs: [
          'Atravessando a rua do Kanda Myōjin está o oposto exato dele: um templo **confucionista** de laca preta, silencioso, quase sem ninguém. Aqui funcionou o **Shōheizaka Gakumonjo**, a academia oficial dos Tokugawa — e foi dessa escola que saíram, na era Meiji, a **primeira universidade e o primeiro museu do Japão**. O prédio atual é de 1935, reconstruído por **Itō Chūta**, o mesmo arquiteto do Tsukiji Hongan-ji.',
          'Na quarta o salão principal está fechado (só abre fim de semana, ¥200), mas o pátio, o portal e os telhados pretos — que é o que impressiona — estão abertos e de graça.',
          'Saiam pela **Hijiribashi**, a "ponte dos santos", que existe justamente para ligar este templo confucionista à **Nikolai-dō**, a catedral ortodoxa russa de 1891 do outro lado do vale. A catedral só recebe visita das 13:00 às 15:30, então hoje é só por fora — mas a cúpula bizantina no meio de Tóquio já vale a olhada da ponte. Dali é ladeira abaixo até o curry.',
        ],
        mapQuery: 'Yushima Seido Tokyo',
      },
      {
        id: 'd02-jimbocho',
        time: '11:20',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Curry em Jimbōchō — o bairro do curry',
        jp: '神保町',
        facts: '400+ casas de curry no bairro · **cheguem na abertura, 11:00**, para furar a fila · 14 min ladeira abaixo do Yushima Seidō, ou metrô direto de Ginza',
        paragraphs: [
          'Jimbōchō é o bairro dos sebos e livrarias — e virou, ninguém sabe bem por quê, a capital do curry de Tóquio. Saindo do Palácio pelo lado oeste, vocês chegam a pé. A jogada é almoçar **cedo**: às 12h30 as filas dobram.',
        ],
        eat: [
          {
            label: 'As duas lendas — escolham uma',
            items: [
              {
                name: 'Bondy (honten)',
                specialty: true,
                note: '11:00–22:00 · desde 1973, o original do "curry europeu" de Jimbōchō: molho escuro de técnica francesa, arroz na manteiga **coberto de queijo derretido** e batatas quentes com manteiga à parte. ~¥1.700. A entrada é escondida: atravessa-se a livraria Yagi até o fundo, 2º andar. Fila de ~45 min no pico.',
              },
              {
                name: 'Kyōeidō',
                specialty: true,
                note: '11:00–19:45, fecha dom (quarta está aberto) · desde 1924: curry "Sumatra" quase preto, 20+ especiarias torradas, sem farinha. No outono tem a famosa maçã assada de sobremesa — exatamente a época de vocês.',
              },
            ],
          },
        ],
        mapQuery: 'Bondy curry Jimbocho',
      },
      {
        id: 'd02-nihonbashi',
        time: '13:00',
        timeLabel: 'bairro',
        kind: 'sight',
        name: 'Nihonbashi',
        jp: '日本橋',
        facts: 'Ponte **24h** · Mitsukoshi **10:00–19:30**',
        paragraphs: [
          'A ponte é o **marco zero do Japão**: desde 1603, todas as distâncias rodoviárias do país são medidas a partir daqui, e ainda são — tem uma placa de bronze no meio dela marcando o ponto. Era o começo das cinco grandes estradas de Edo, incluindo a Tōkaidō, imortalizada nas gravuras de Hiroshige.',
          'A ponte atual é de 1911, em pedra. Uma via expressa elevada foi construída por cima em 1963, para as Olimpíadas — e cobre a vista há sessenta anos. Existe uma obra em andamento para **enterrar a via expressa** e devolver o céu à ponte, prevista para os anos 2030.',
        ],
        eat: [
          {
            label: 'Duas paradas aqui',
            items: [
              {
                name: 'Mitsukoshi Nihonbashi',
                note: 'a loja de departamentos mais antiga do Japão: começou em 1673 como loja de quimono *Echigoya*, e foi ela que inventou o preço fixo à vista, num tempo em que tudo era pechincha e fiado. O depachika é espetacular.',
              },
              {
                name: 'Nishikawa (roupa de cama)',
                note: '10:00–19:00 · fabricante de futon **desde 1566**. Se vocês quiserem roupa de cama de alto padrão além da Muji, é aqui.',
              },
            ],
          },
          {
            label: 'Se preferirem os clássicos de Edo ao curry',
            items: [
              {
                name: 'Nihonbashi Tamai',
                specialty: true,
                note: '11:00–22:00 · *anago* (enguia-do-mar), a versão de Tóquio. Mais leve que o unagi, e muito bom.',
              },
              {
                name: 'Taimeiken',
                specialty: true,
                note: '11:00–21:00 · *yōshoku*, a cozinha ocidental adaptada da era Meiji. O omurice daqui é o famoso do filme "Tampopo".',
              },
            ],
          },
        ],
        mapQuery: 'Nihonbashi Bridge Tokyo',
      },
      {
        id: 'd02-switch2',
        time: '14:30',
        timeLabel: 'compras',
        kind: 'shopping',
        name: 'Nintendo Switch 2 — a edição de 40 anos de Zelda',
        jp: 'ゼルダの伝説 40周年 アニバーサリーエディション',
        facts: 'Yodobashi-Akiba **09:30–22:00** · **¥62.980** com imposto · saiu **29/out**, edição limitada · **leiam o aviso antes de pagar**',
        paragraphs: [
          'Existem **dois Nintendo Switch 2 diferentes** no Japão, e a edição de Zelda só existe na versão que provavelmente não é a que vocês querem. Vale entender isso antes de entrar na loja, porque não tem volta depois.',
          'O que está nas prateleiras da Yodobashi, da Bic e de toda loja japonesa é o **Nintendo Switch 2 日本語・国内専用** — "japonês, só para uso doméstico". O idioma do sistema é **japonês e ponto**: não existe opção de trocar, nunca. Só dá para vincular conta Nintendo com país definido como **Japão**, então a eShop é a japonesa. A Nintendo pede que ele **não seja usado fora do Japão**, não dá garantia no exterior, e diz que **não garante** que cartuchos comprados fora funcionem nele (quem testou relata que funcionam, mas isso é relato, não promessa).',
          'A outra versão, o **multi-idioma** (¥69.980), essa sim faz tudo — e é vendida **só pela loja oficial da Nintendo**, não nas lojas de rua. Só que ela **não existe no desenho de Zelda**. Ou seja: no Japão não dá para ter as duas coisas.',
          'Fora do Japão a história é outra: lá a edição de 40 anos **é** o console normal, multi-idioma (US$ 519,99 nos EUA). Então a escolha é essa — **o desenho de Zelda aqui, com um console em japonês para sempre**, ou o mesmo desenho comprado lá fora, funcionando em português. Se o Switch 2 for para jogar em casa no dia a dia, comprem fora. Se for peça de coleção que vocês querem por ter vindo do Japão, aí o japonês faz sentido.',
          'Sobre achar: ela saiu em **29 de outubro** e as reservas já esgotavam em setembro. No dia 2 de dezembro isto é **caça, não compra** — confiram estoque no Yodobashi.com e no BicCamera.com **antes** de sair do hotel, e se aparecer em qualquer loja em qualquer dia da viagem, comprem na hora em vez de esperar chegar aqui.',
        ],
        history: {
          label: 'Por que 40 anos',
          paragraphs: [
            '**21 de fevereiro de 1986.** *The Legend of Zelda* saiu no Japão não em cartucho, mas em **disquete** — era um dos jogos de lançamento do **Famicom Disk System**, aquele periférico que encaixava embaixo do Famicom e usava disquetes magnéticos regraváveis.',
            'E o disquete é a razão de Zelda ser Zelda. Até ali, jogo de console não salvava: quando acabava, acabava, e no máximo te davam uma senha enorme para anotar num papel. O disquete **gravava o seu progresso**. Foi isso que permitiu um jogo que não se atravessa numa tarde — um mundo grande, para explorar aos poucos, voltando amanhã de onde parou. A ideia veio de Miyamoto lembrando da infância nos arredores de Kyoto, entrando em grutas e campos sem mapa, só para ver o que tinha lá dentro.',
            'O nome veio de **Zelda Fitzgerald**, mulher do escritor F. Scott Fitzgerald. Miyamoto achou o nome bonito e a pediu emprestada. Ela nunca soube.',
          ],
        },
        eat: [
          {
            label: 'Onde procurar, na ordem',
            items: [
              {
                name: 'Yodobashi-Akiba — 6º andar',
                note: '09:30–22:00, todo dia · colado na estação (saída Showa-dōri). O andar de games fica no **6º**. É o maior estoque de Tóquio e o primeiro lugar a tentar — e já é a primeira das missões seguintes, então vocês estão no prédio de qualquer jeito.',
              },
              {
                name: 'Bic Camera e Sofmap (Chūō-dōri)',
                note: 'Plano B a 5 min a pé. A Sofmap é do grupo Bic e tem loja dedicada a games em Akihabara. Vale perguntar por **抽選** (chūsen, sorteio): em edição limitada as lojas às vezes trocam a venda livre por sorteio do dia.',
              },
              {
                name: 'Os acessórios da mesma coleção',
                note: 'Saíram no mesmo dia e costumam sobrar depois que o console some: **Pro Controller** no desenho de Zelda **¥12.980** e **capa de transporte** com película **¥3.980**. O Pro Controller é multi-idioma por natureza — é só um controle — então ele funciona em qualquer Switch 2, inclusive num comprado no Brasil. Se o console não aparecer, esse é o consolo que presta.',
              },
              {
                name: 'Sobre o tax-free',
                note: 'O preço de ¥62.980 **já inclui** os 10%, então o reembolso seria de uns **¥5.700**. Confirmem no balcão de tax-free se eles fazem para este modelo — é um console que a própria Nintendo pede para não sair do Japão, e o tax-free é justamente a declaração de que ele vai sair. Não contem com o desconto ao fazer a conta.',
              },
            ],
          },
        ],
        mapQuery: 'Yodobashi Camera Akiba',
      },
      {
        id: 'd02-akihabara-missoes',
        time: '15:10',
        timeLabel: 'compras',
        kind: 'shopping',
        name: 'Akihabara — as três missões',
        jp: '秋葉原',
        facts: 'De Mitsukoshimae: JR/metrô **~5 min** · tudo num raio de 400 m da estação',
        paragraphs: [
          'A volta a Akihabara com lista na mão. Vocês já estão na Yodobashi por causa do Switch 2, então a primeira parada é subir os andares. As três cabem em ~1h — saiam até 16:10 para pegar a última vista no horário.',
        ],
        eat: [
          {
            label: 'A ordem das missões',
            items: [
              {
                name: 'Yodobashi-Akiba',
                note: '09:30–22:00, todo dia · colado na estação (saída Showa-dōri). 9 andares; se o robô aspirador ainda não foi fechado, é AQUI e AGORA — balcão tax-free, modelos de exportação. Também é o plano B para qualquer eletrônico que tenha ficado para trás.',
              },
              {
                name: 'Janpara (2ª loja — periféricos)',
                note: '~11:00–20:00 · a rede de usados de informática de Akihabara, com garantia em usados. É onde se acha **dock station Dell** usada por fração do preço — confiram modelo (WD19/WD22TB4 etc.) e a fonte. Várias filiais em Sotokanda; a 2ª loja é a de peças e periféricos.',
              },
              {
                name: 'Mandarake Complex',
                note: '12:00–20:00 · 8 andares de usados. Para action figures de anime usadas, é a única loja que vocês precisam: estado classificado na etiqueta, preços 30–60% abaixo do varejo, e o andar de toys é um museu que vende. Vão direto ao andar de figures para não se perderem nos outros sete.',
              },
            ],
          },
        ],
        mapQuery: 'Yodobashi Akiba',
      },
      {
        id: 'd02-ultima-vista',
        time: '16:30',
        timeLabel: 'vista',
        kind: 'view',
        name: 'Última vista da cidade',
        eat: [
          {
            label: 'Três opções, todas com pôr do sol às 16:28',
            items: [
              {
                name: 'Tokyo Skytree',
                note: '10:00–22:00 · ¥2.400 (Tembo Deck) · 634 m, o mais alto — e o mais perto de Akihabara (~15 min direto). A altura foi escolhida porque 6-3-4 se lê "mu-sa-shi", o nome antigo desta planície.',
              },
              {
                name: 'Tokyo Tower',
                note: '09:00–22:30 · ¥1.500 · de 1958, feita em parte com aço de tanques americanos da Guerra da Coreia. Mais bonita de ver do que de subir.',
              },
              {
                name: 'Prédio do Governo Metropolitano (Shinjuku)',
                note: '09:30–22:00 · **grátis** · projeto de Kenzo Tange, 202 m. Se o dia estiver seco, o Fuji aparece.',
              },
            ],
          },
        ],
      },
      {
        id: 'd02-compras-finais',
        time: '18:00',
        timeLabel: 'compras',
        kind: 'shopping',
        name: 'Última varredura em Ginza',
        facts: 'Ginza **11:00–21:00** · Bic Camera Yūrakuchō **10:00–22:00**',
        paragraphs: [
          'O que faltou de Muji e Uniqlo, presentes, doces do depachika — e o **missô artesanal**, se ficou para a última hora (balcões do depachika do Mitsukoshi). O **Bic Camera Yūrakuchō** fica a dois minutos de Ginza e tem os andares de eletrodoméstico com modelos de exportação, caso algo tenha escapado em Akihabara.',
        ],
        mapQuery: 'Bic Camera Yurakucho',
      },
      {
        id: 'd02-jantar-despedida',
        time: '19:30',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Jantar de despedida',
        eat: [
          {
            label: 'Sushi, do acessível ao especial',
            items: [
              {
                name: 'Umegaoka Sushi no Midori Ginza',
                specialty: true,
                note: '11:00–21:00 · o melhor custo-benefício de Ginza, ~¥3.000. Peguem senha cedo pelo painel eletrônico.',
              },
              {
                name: 'Kyūbey Ginza',
                note: '17:00–22:00, fecha dom · omakase de balcão desde 1935, ~¥20.000. Reserva.',
              },
              {
                name: 'Sushi Ginza Onodera',
                note: 'omakase Edomae de alto nível, reserva com bastante antecedência',
              },
              {
                name: 'Sushizanmai Honten (Tsukiji)',
                note: '24h · o plano B honesto que nunca falha',
              },
            ],
          },
        ],
        paragraphs: [
          '**Antes de dormir:** Juntem **todos os recibos** num envelope só, na ordem, e confiram que o registro no J-TaxRefund está completo. · Arrumem a mala deixando **MacBook, iPhone, robô e roupa de cama acessíveis** — a alfândega pode pedir para ver na inspeção. · **Facas vão na mala despachada**, nunca na de mão. · Confiram a etiqueta da bateria do robô: **até 100 Wh** pode ir despachado com o aparelho.',
        ],
        mapQuery: 'Umegaoka Sushi no Midori Ginza',
      },
      {
        id: 'd02-konbini',
        time: '22:30',
        timeLabel: 'konbini',
        kind: 'food',
        name: '7-Eleven da última noite — parada 4 de 4',
        facts: 'Ginza e Yūrakuchō têm lojas 24h · última chance dos itens perecíveis',
        paragraphs: [
          'Sobremesa da última noite e repescagem do que faltou: o **sorvete de mochi** (Yukimi Daifuku, no freezer — foi lançado como sorvete de inverno, e vocês estão no inverno) e qualquer item que ainda esteja desmarcado na checklist de **Mais → Konbini**.',
          'Nada disso vai para a mala — é perecível e a alfândega brasileira não quer saber. Doce industrializado lacrado (KitKat de matcha, Jagariko, Pocky regional) esse sim viaja bem, e é aqui que sai mais barato que no aeroporto.',
        ],
        mapQuery: '7-Eleven Ginza',
      },
    ],
  },
  {
    id: 'd2026-12-03',
    date: '2026-12-03',
    stageId: 'tokyo2',
    title: 'Manhã livre e Haneda',
    subtitle: 'Voo às 20:25. Estejam no aeroporto às 17:00 — o reembolso do imposto leva tempo.',
    chips: ['partida', 'tax refund', 'duty free'],
    stops: [
      {
        id: 'd03-ultima-manha',
        time: '08:00',
        timeLabel: 'livre',
        kind: 'food',
        name: 'Última manhã',
        eat: [
          {
            label: 'Três jeitos de gastar bem',
            items: [
              {
                name: 'Café da manhã em Tsukiji',
                note: '05:00–14:00 · se quiserem repetir. Quinta-feira o mercado está cheio e bom.',
              },
              {
                name: 'Mercado de Toyosu',
                note: '05:00–15:00, fecha dom · o mercado atacadista novo. Dá para ver os leilões de atum da galeria envidraçada se chegarem antes das 6h30 — e o sushi do prédio 6 é excelente.',
              },
              {
                name: 'Nada',
                note: 'arrumar mala com calma também é uma escolha legítima no décimo quinto dia',
              },
            ],
          },
        ],
        mapQuery: 'Tsukiji Outer Market',
      },
      {
        id: 'd03-sair-hotel',
        time: '15:30',
        timeLabel: 'hotel',
        kind: 'hotel',
        name: 'Sair do hotel',
        facts: 'Ginza → Haneda T3: **~35 min** de metrô/monotrilho, ou táxi ~¥7.000',
      },
      {
        id: 'd03-haneda',
        time: '17:00',
        timeLabel: 'aeroporto',
        kind: 'flight',
        name: 'Haneda, Terminal 3 — a ordem das coisas',
        facts: 'Voo JL7014 às **20:25** · deixem **3h20** de margem — com o sistema novo de reembolso, a fila pode ser bem maior que antes',
        paragraphs: [
          '1. **Reembolso do imposto primeiro**, antes do check-in de bagagem. Desde **1º de novembro de 2026** o Japão mudou de sistema: vocês pagaram o imposto em todas as lojas e recebem tudo de volta aqui. Escaneiem o passaporte no **terminal de autoatendimento na área pública** (antes do despacho). Verde: acabou. Vermelho: a alfândega quer ver as mercadorias — por isso elas não podem estar dentro da mala despachada.',
          '2. **Check-in e despacho** — só depois de liberadas as mercadorias inspecionadas.',
          '3. **Imigração e segurança.**',
          "4. **Última compra** na área livre de impostos — é aí que entra o Royce' Nama Chocolate, logo abaixo.",
        ],
        mapQuery: 'Haneda Airport Terminal 3',
      },
      {
        id: 'd03-duty-free',
        time: '18:30',
        timeLabel: 'duty free',
        kind: 'shopping',
        name: "Royce' — Nama Chocolate no duty free",
        facts: "Royce' fica na **área após a imigração** do T3 · caixa de 20 pedaços ~¥800–1.000 · sabores: Au Lait, Bitter, Matcha, Champagne",
        paragraphs: [
          'O nama chocolate ("chocolate cru") é uma ganache de chocolate e creme de leite fresco de Hokkaidō, cortada em cubos e coberta de cacau em pó. Derrete na boca porque tem **muito mais creme que chocolate** — e é exatamente por isso que ele não aguenta a volta.',
          '⚠️ **Façam a conta antes de comprar muito.** O saco térmico com gelo (保冷剤, *hoereizai*) que a loja dá segura cerca de **6 horas**. De Haneda até Guarulhos são 11h30 até Dallas + 2h15 de conexão + 10h até São Paulo: **umas 25 horas**. O nama chocolate chega derretido, e não tem jeito.',
          'O plano certo: **uma caixa para comer no avião**, que aí vale cada iene, e para trazer para casa as outras linhas do Royce\' — as **barras normais**, o chocolate com batata frita (*potatochip chocolate*), o *pure chocolate* e as amêndoas cobertas. Tudo isso viaja bem em temperatura ambiente e é igualmente difícil de achar no Brasil.',
          'O que for comprado **vai na bagagem de mão**, nunca na despachada, e chegando em casa vai direto para a geladeira.',
        ],
        mapQuery: "Royce' Haneda Airport Terminal 3 duty free",
      },
      {
        id: 'd03-voo',
        time: '20:25',
        timeLabel: 'voo',
        kind: 'flight',
        name: 'HND → DFW → GRU',
        facts: 'Conexão de **2h15** em Dallas · assentos na frente ajudam · ver a nota da seção de logística',
        paragraphs: ['Chegada em Guarulhos **4/12 às 08:30**.'],
        mapQuery: 'Haneda Airport Terminal 3',
      },
    ],
  },
];

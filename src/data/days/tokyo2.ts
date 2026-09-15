import type { Day } from '../types';

export const tokyo2Days: Day[] = [
  {
    id: 'd2026-12-02',
    date: '2026-12-02',
    stageId: 'tokyo2',
    title: 'Ginkgos no pico, bordos do Kōrakuen, curry de Jimbōchō, Akihabara e jantar de despedida',
    subtitle: 'O último dia inteiro. Uma manhã de folhas, fechar tudo, separar os recibos, e as missões de Akihabara.',
    chips: ['momiji', 'curry', 'akihabara', 'compras', 'sushi'],
    stops: [
      {
        id: 'd02-gaien-peak',
        time: '09:00',
        timeLabel: 'ginkgos',
        kind: 'sight',
        name: 'Alameda de ginkgos do Gaien — a passada no pico',
        jp: '神宮外苑いちょう並木',
        facts: '**24h · grátis** · Ginza Line de Ginza até Gaienmae, 12 min · saída 4a, 3 min · pico previsto **a partir de ~30/11**: hoje é o dia dourado',
        paragraphs: [
          'Vocês já passaram aqui no dia 22, ainda amarelando. A previsão de 2026 põe o pico dos ginkgos no começo de dezembro — então esta é a passada rápida no ouro de verdade: 300 metros de alameda, meia hora, e embora. Às 9h ainda está vazio.',
          'O prédio no fim da alameda, a Galeria Memorial, está em obra até 2027 e pode ter andaimes — a foto clássica fica pela metade, as árvores não.',
        ],
        mapQuery: 'Meiji Jingu Gaien Ginkgo Avenue',
      },
      {
        id: 'd02-korakuen',
        time: '10:00',
        timeLabel: 'jardim',
        kind: 'sight',
        name: 'Koishikawa Kōrakuen — o vale de bordos',
        jp: '小石川後楽園',
        facts: '**09:00–17:00** · ¥300 · portão leste a 6 min da saída 2 de Kōrakuen (Marunouchi) · pico **fim de novembro a começo de dezembro** · a 15 min a pé de Jimbōchō',
        paragraphs: [
          'O jardim mais antigo de Tóquio, começado em 1629 pelo ramo Mito dos Tokugawa, com cerca de 500 bordos concentrados num vale — a melhor mancha de vermelho do centro da cidade, ao lado do Tokyo Dome. Uma volta de 45 minutos basta; saiam pelo mesmo portão leste e desçam a pé até Jimbōchō pela Suidōbashi.',
          'Aviso: a ponte vermelha do vale, a **Tsūtenkyō**, está em obra de substituição desde 2025, com desvio por passarela provisória — o vale continua aberto, a foto da ponte não.',
        ],
        eat: [
          {
            label: 'Se preferirem outra manhã',
            items: [
              { name: 'Yasukuni → Chidorigafuchi → Kitanomaru', note: 'grátis e sem portão: a alameda de 200 ginkgos do santuário Yasukuni, o fosso de Chidorigafuchi e o bosque de bordos do parque Kitanomaru. Ginza Line até Nihombashi + Tōzai até Kudanshita, 16 min; Jimbōchō é a estação seguinte.' },
              { name: 'Kiyosumi Garden', note: '¥150, 09:00–17:00 · jardim de lago e pedras em Fukagawa, folhagem mais discreta. Da estação Kiyosumi-Shirakawa, a Hanzōmon leva direto a Jimbōchō em 11 min.' },
            ],
          },
        ],
        mapQuery: 'Koishikawa Korakuen Garden',
      },
      {
        id: 'd02-jimbocho',
        time: '11:20',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Curry em Jimbōchō — o bairro do curry',
        jp: '神保町',
        facts: '15 min a pé do Kōrakuen, descendo pela Suidōbashi · 400+ casas de curry no bairro · cheguem antes do meio-dia para furar a fila',
        paragraphs: [
          'Jimbōchō é o bairro dos sebos e livrarias — e virou, ninguém sabe bem por quê, a capital do curry de Tóquio. Do Kōrakuen vocês chegam a pé, pela Hakusan-dōri. A jogada é almoçar **cedo**: às 12h30 as filas dobram.',
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
        id: 'd02-akihabara-missoes',
        time: '14:30',
        timeLabel: 'compras',
        kind: 'shopping',
        name: 'Akihabara — as três missões',
        jp: '秋葉原',
        facts: 'De Mitsukoshimae: JR/metrô **~5 min** · tudo num raio de 400 m da estação',
        paragraphs: [
          'A volta a Akihabara com lista na mão. As três paradas abaixo, na ordem, cabem em ~1h30 — saiam até 16:10 para pegar a última vista no horário.',
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
        id: 'd02-tekki',
        time: '17:45',
        timeLabel: 'ferro',
        kind: 'shopping',
        name: 'Chaleira nambu tekki na Iwate Ginga Plaza',
        jp: '南部鉄器 · いわて銀河プラザ',
        facts: '**10:30–19:00** · Ginza 5-15-1, térreo do Nankai Tokyo Building, **na saída da Higashi-Ginza** · loja oficial da província de Iwate · tax-free',
        paragraphs: [
          'A melhor seleção de ferro de Nambu em Tóquio não está no Loft: está na **antena de Iwate**, a província de onde ele vem — peças da Iwachu e de oficinas menores de Morioka, com gente que sabe explicar. Comprar hoje, e não antes, é de propósito: a chaleira pesa de 1,4 a 2 kg e vai direto para a mala, que já está no hotel a seis minutos daqui.',
          'Se preferirem o bule colorido de catálogo, o **Loft Ginza** (Ginza 2-4-6, 11:00–21:00) fica a 8 min e vende o Iwachu 5型 (¥11.000), mas o estoque por filial não aparece online.',
        ],
        eat: [
          {
            label: 'O que é o quê',
            items: [
              { name: 'Tetsubin — a chaleira', specialty: true, note: 'ferro nu por dentro, vai ao fogo ou indução, solta um pouco de ferro na água. Precisa secar depois de cada uso, senão enferruja. ¥20.000–50.000+; 1 L ≈ 2 kg.' },
              { name: 'Tetsu kyūsu — o bule', note: 'esmaltado por dentro, colorido, com filtro de inox. Não enferruja e **não vai ao fogo**: só recebe água já fervida. É o da maioria das fotos. 0,25–0,65 L, ¥12.000–19.000.' },
              { name: 'Iwachu 5型, o híbrido', note: '¥11.000 · 0,65 L e 1,4 kg, sem esmalte, com filtro: ferve água e serve chá. O meio-termo honesto.' },
            ],
          },
        ],
        mapQuery: 'Iwate Ginga Plaza Ginza',
      },
      {
        id: 'd02-compras-finais',
        time: '18:15',
        timeLabel: 'compras',
        kind: 'shopping',
        name: 'Última varredura em Ginza — e o Oura Ring',
        facts: 'Ginza **11:00–21:00** · Bic Camera Yūrakuchō **10:00–22:00**',
        paragraphs: [
          'O que faltou de Muji e Uniqlo, presentes, doces do depachika — e o **missô artesanal**, se ficou para a última hora (balcões do depachika do Mitsukoshi). O **Bic Camera Yūrakuchō** fica a dois minutos de Ginza e tem os andares de eletrodoméstico com modelos de exportação, caso algo tenha escapado em Akihabara.',
          'É aqui que se compra o **Oura Ring**, com o número que o kit do dia 21 indicou: Ring 4 a ¥52.800 (prata, preto, stealth) ou ¥59.800 (dourado, rosé); Ring 5, lançado em junho, ¥65.800–81.800. Sai tax-free (restituição em Haneda amanhã). Antes de pagar, saibam o ponto fraco: o **Brasil não está na lista de países da assinatura** (¥999/mês, obrigatória para os dados), que exige cartão com endereço de cobrança num país suportado — há brasileiros usando com cartão internacional, mas não há garantia oficial, e a garantia do produto pode não valer fora dessas regiões. Em iene custa o mesmo que nos EUA; contra o Brasil, onde não há venda oficial, é bem mais barato.',
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
          '1. **Reembolso do imposto primeiro**, antes do check-in de bagagem. Desde **1º de novembro de 2026** o Japão mudou de sistema: vocês pagaram o imposto em todas as lojas e recebem tudo de volta aqui. O balcão de isenção fica no **3º andar, no saguão de partidas, em frente ao check-in K** — e a JAL fica nas ilhas F a K, ali mesmo. Escaneiem o passaporte: verde, acabou; vermelho, a alfândega quer ver as mercadorias — por isso elas não podem estar dentro da mala despachada.',
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

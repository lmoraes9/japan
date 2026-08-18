import type { Day } from '../types';

export const tokyo2Days: Day[] = [
  {
    id: 'd2026-12-02',
    date: '2026-12-02',
    stageId: 'tokyo2',
    title: 'Palácio Imperial, Nihonbashi, compras finais e jantar de despedida',
    subtitle: 'O último dia inteiro. Fechar tudo e separar os recibos.',
    chips: ['história', 'compras', 'sushi'],
    stops: [
      {
        id: 'd02-jardim-imperial',
        time: '09:00',
        timeLabel: 'jardim',
        kind: 'sight',
        name: 'Jardim Leste do Palácio Imperial',
        jp: '皇居東御苑',
        facts: '**09:00–16:00 · fecha segunda e sexta** · **grátis** · quarta está aberto',
        paragraphs: [
          'É aqui que o círculo se fecha. Esses jardins são o núcleo do **Castelo de Edo** — o castelo dos Tokugawa, o maior do mundo em sua época, com um perímetro de fossos de 16 km que ainda define o traçado do centro de Tóquio.',
        ],
        history: {
          paragraphs: [
            'Subam na base de pedra do **Tenshudai**, a fundação do torreão. O donjon de Edo tinha **cinco andares e cerca de 58 metros** — o mais alto que o Japão já construiu, mais alto que Himeji e Osaka. Ele durou dezenove anos: queimou no Grande Incêndio de Meireki, em 1657.',
            'E nunca foi reconstruído. A regência decidiu que o dinheiro deveria ir para reerguer a cidade e alimentar os desabrigados, e que um torreão era ornamento militar sem função numa era de paz. Ficou só a base de pedra, que está aí desde então. É, provavelmente, o monumento mais eloquente de Tóquio — e é uma pedra vazia.',
            'Vejam também os fundamentos do **Ōoku**, os aposentos femininos do castelo, onde viviam mais de mil mulheres e onde se decidia, na prática, boa parte da política sucessória do xogunato.',
          ],
        },
        mapQuery: 'Imperial Palace East Gardens Tokyo',
      },
      {
        id: 'd02-nihonbashi',
        time: '11:00',
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
        ],
        mapQuery: 'Nihonbashi Bridge Tokyo',
      },
      {
        id: 'd02-almoco-nihonbashi',
        time: '12:30',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Almoço em Nihonbashi',
        eat: [
          {
            label: 'Clássicos de Edo',
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
      },
      {
        id: 'd02-compras-finais',
        time: '14:00',
        timeLabel: 'compras',
        kind: 'shopping',
        name: 'Compras finais',
        facts: 'Ginza **11:00–21:00** · Bic Camera Yūrakuchō **10:00–22:00**',
        paragraphs: [
          'Última varredura: o que faltou de Muji e Uniqlo, o robô aspirador (se ainda não fecharam), presentes, doces do depachika. O **Bic Camera Yūrakuchō** fica a dois minutos de Ginza e tem os andares de eletrodoméstico com modelos de exportação.',
        ],
        mapQuery: 'Bic Camera Yurakucho',
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
                note: '10:00–22:00 · ¥2.400 (Tembo Deck) · 634 m, o mais alto. A altura foi escolhida porque 6-3-4 se lê "mu-sa-shi", o nome antigo desta planície.',
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
        id: 'd02-jantar-despedida',
        time: '19:00',
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
      },
    ],
  },
  {
    id: 'd2026-12-03',
    date: '2026-12-03',
    stageId: 'tokyo2',
    title: 'Manhã livre e Haneda',
    subtitle: 'Voo às 20:25. Estejam no aeroporto às 17:00 — o reembolso do imposto leva tempo.',
    chips: ['partida', 'tax refund'],
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
        facts: 'Voo JL7014 às **20:25** · deixem **3h20** de margem',
        paragraphs: [
          '1. **Reembolso do imposto primeiro**, antes do check-in — os quiosques ficam antes da imigração e a alfândega pode querer ver as mercadorias. Passaporte + recibos + produtos.',
          '2. **Check-in e despacho** — só depois de liberadas as mercadorias inspecionadas.',
          '3. **Imigração e segurança.**',
          '4. **Última compra** na área livre de impostos, se sobrar tempo e apetite.',
        ],
        mapQuery: 'Haneda Airport Terminal 3',
      },
      {
        id: 'd03-voo',
        time: '20:25',
        timeLabel: 'voo',
        kind: 'flight',
        name: 'HND → DFW → GRU',
        facts: 'Conexão de **2h15** em Dallas · assentos na frente ajudam · ver a nota da seção de logística',
        paragraphs: ['Chegada em Guarulhos **4/12 às 08:30**.'],
      },
    ],
  },
];

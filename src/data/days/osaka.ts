import type { Day } from '../types';

export const osakaDays: Day[] = [
  {
    id: 'd2026-11-25',
    lastReturn: [
      { label: 'Shinkansen Himeji → Shin-Osaka', time: '23:05', from: 'Estação Himeji', note: 'aprox. · Kodama/Sakura; JR Special Rapid comum até ~23h também' },
    ],
    date: '2026-11-25',
    stageId: 'osaka',
    title: 'Kurashiki + Castelo de Himeji, a caminho de Osaka',
    subtitle: 'Dia de trânsito transformado em dois destinos. O melhor castelo do Japão está no meio do caminho.',
    chips: ['história', 'unesco', 'castelo', 'kushikatsu'],
    notes: [
      {
        label: 'Kurashiki é uma sugestão minha — e é opcional',
        tone: 'ok',
        text: 'Se quiserem um dia mais leve, cortem Kurashiki e vão direto Hiroshima → Himeji → Osaka, chegando por volta das 14h. Mas ela cai exatamente no caminho, custa 40 minutos de desvio, e é uma das cidades mais bonitas do Japão que quase nenhum brasileiro conhece.',
      },
    ],
    stops: [
      {
        id: 'd25-trem-kurashiki',
        time: '08:20',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Hiroshima → Okayama → Kurashiki',
        facts: 'Sanyo Shinkansen **35 min** + JR local **17 min** · ~¥8.000 · guardem a mochila nos armários da estação',
        mapQuery: 'Hiroshima Station Shinkansen',
      },
      {
        id: 'd25-bikan',
        placeMapId: 'kurashiki',
        time: '09:45',
        timeLabel: 'cidade',
        kind: 'sight',
        name: 'Bairro histórico Bikan',
        jp: '倉敷美観地区',
        facts: '**24h · grátis** · 12 min a pé da estação',
        paragraphs: [
          'Um canal com salgueiros, ladeado de armazéns de parede branca e telha preta em xadrez, com barquinhos de fundo chato. Parece cenário e não é: é a coisa real, preservada porque a cidade escapou dos bombardeios.',
        ],
        history: {
          paragraphs: [
            '*Kura-shiki* significa "onde ficam os armazéns". No período Edo, Kurashiki era **território direto do xogunato** (*tenryō*), não de um daimyō — o que dava aos mercadores daqui uma autonomia rara. Os canais existiam para levar arroz e algodão do interior até o Mar Interior, e cada armazém branco desses guardava a riqueza de alguém.',
            'Quando o Japão industrializou, o algodão daqui virou a fiação Kurabō (1888) — e mais tarde, na cidade vizinha de Kojima, nasceu **o primeiro jeans fabricado no Japão**, em 1965. A região é hoje a capital mundial do denim artesanal; se isso interessar, a Jeans Street de Kojima fica a 30 min de trem.',
          ],
        },
        mapQuery: 'Kurashiki Bikan Historical Quarter',
      },
      {
        id: 'd25-ohara',
        time: '10:15',
        timeLabel: 'museu',
        kind: 'sight',
        name: 'Museu de Arte Ōhara',
        jp: '大原美術館',
        facts: '**09:00–17:00 · fecha segunda** · ¥2.000 · 1h basta',
        paragraphs: [
          'O **primeiro museu de arte ocidental do Japão**, aberto em 1930. O industrial Ōhara Magosaburō financiou um pintor amigo, Kojima Torajirō, para viajar pela Europa comprando quadros — e ele voltou com El Greco, Monet, Gauguin, Matisse. O prédio é um templo grego incongruente no meio do bairro Edo, o que só torna tudo mais divertido.',
        ],
        mapQuery: 'Ohara Museum of Art Kurashiki',
      },
      {
        id: 'd25-almoco-kurashiki',
        time: '11:30',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Almoço em Kurashiki',
        eat: [
          {
            label: 'Sabores do Mar Interior',
            items: [
              {
                name: 'Kamoi',
                specialty: true,
                note: '11:00–17:00 · sushi dentro de um armazém convertido, de frente para o canal. Peçam o *mamakari-zushi* — a sardinha local que, diz a lenda, é tão boa que você pede arroz emprestado ao vizinho.',
              },
              {
                name: 'Tsurugata',
                note: '11:00–14:00 · pousada de 1744, almoço em bandeja',
              },
            ],
          },
        ],
        mapQuery: 'Kamoi Kurashiki Bikan',
      },
      {
        id: 'd25-trem-himeji',
        time: '12:50',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Kurashiki → Okayama → Himeji',
        facts: 'Local **17 min** + Shinkansen **20 min** · ~¥3.900 · chegada ~13:45',
        mapQuery: 'Kurashiki Station',
      },
      {
        id: 'd25-himeji',
        placeMapId: 'himeji',
        time: '13:55',
        timeLabel: 'castelo',
        kind: 'sight',
        name: 'Castelo de Himeji',
        jp: '姫路城',
        facts: '**09:00–17:00 · última entrada 16:00** · ¥1.000 (¥1.050 com o jardim Kōko-en) · 15 min a pé em linha reta da estação · reservem **2h**',
        paragraphs: [
          'Vocês vão ver a avenida da estação e o castelo lá no fundo, exatamente no eixo. A subida até o torreão tem escadas de madeira muito íngremes e vocês vão descalçar o sapato — meias de novo.',
          '**Kōko-en**, ao lado (09:00–17:00, ¥310), são nove jardins reconstruídos sobre as fundações das antigas residências de samurai. Em novembro, o bordo está no auge e tem casa de chá. Se sobrar meia hora, vale.',
        ],
        history: {
          paragraphs: [
            'Começou como um forte em 1333 e virou castelo em 1346, mas a forma que vocês vão ver é de **1601–1609**, obra de Ikeda Terumasa, genro de Tokugawa Ieyasu, recompensado com este domínio depois da batalha de Sekigahara. São **83 edifícios**, quase todos de madeira, e um sistema de defesa em espiral: os caminhos entre os portões viram, sobem, voltam e se estreitam de propósito, para desorientar quem invade e expor o invasor a fogo cruzado por muito mais tempo.',
            'O apelido é **Shirasagi-jō**, "castelo da garça branca" — pelo reboco branco de cal, aplicado inclusive nas telhas, que além de bonito era à prova de fogo.',
            'E aqui está o fato que faz de Himeji o que ela é: **nunca foi destruída**. Não caiu em guerra, não caiu no terremoto de Kobe de 1995 (que fica a 40 km), e não caiu nos bombardeios de 1945 — ainda que a cidade ao redor tenha sido arrasada e uma bomba incendiária tenha atingido o torreão **sem explodir**. É o castelo japonês mais completo e mais original que existe. Patrimônio Mundial desde 1993, um dos dois primeiros do Japão.',
          ],
        },
        links: [
          {
            label: 'fotos',
            url: 'https://www.google.com/search?tbm=isch&q=Himeji+Castle+autumn',
          },
        ],
        mapQuery: 'Himeji Castle',
      },
      {
        id: 'd25-trem-osaka',
        time: '16:45',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Himeji → Osaka',
        facts: 'JR Special Rapid **60 min ¥1.520** (sem taxa de shinkansen) ou Shinkansen até Shin-Osaka **30 min**',
        mapQuery: 'Himeji Station',
      },
      {
        id: 'd25-dotonbori',
        time: '19:00',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Dōtonbori',
        jp: '道頓堀',
        facts: '**24h** · Namba Stn',
        eat: [
          {
            label: 'Comam de pé, em três lugares diferentes',
            items: [
              {
                name: 'Kushikatsu Daruma',
                specialty: true,
                note: '11:00–22:30 · espetinhos empanados. **Regra sagrada: não molhar duas vezes no molho comunitário.** A placa está em toda parede.',
              },
              {
                name: 'Takoyaki Wanaka ou Hanadako',
                specialty: true,
                note: '10:00–23:00 · bolinho de polvo. Deixem esfriar 30 segundos ou vocês queimam o céu da boca — todo mundo queima.',
              },
              {
                name: 'Okonomiyaki Mizuno',
                specialty: true,
                note: '11:00–22:00, fecha seg · Bib Gourmand do Michelin. Versão de Osaka, tudo misturado na massa. Fila.',
              },
              {
                name: 'Hōzenji Yokochō',
                note: 'viela de pedra a um quarteirão do neon, com um Buda coberto de musgo que os fiéis molham desde 1945. Silêncio total, a 40 m do caos.',
              },
            ],
          },
        ],
        history: {
          paragraphs: [
            'O canal foi escavado por conta própria por um mercador chamado Yasui Dōton, a partir de 1612, para ligar dois rios e valorizar as terras. Ele morreu em 1615 lutando no cerco de Osaka, antes de ver a obra pronta — os primos terminaram e deram o nome dele ao canal. Nos séculos seguintes as margens viraram o distrito de teatro kabuki e bunraku de Osaka; os letreiros gigantes de hoje são descendentes diretos dos painéis de teatro.',
          ],
        },
        mapQuery: 'Dotonbori Osaka',
      },
    ],
  },
];

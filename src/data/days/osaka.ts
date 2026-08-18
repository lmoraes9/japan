import type { Day } from '../types';

export const osakaDays: Day[] = [
  {
    id: 'd2026-11-25',
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
      },
      {
        id: 'd25-bikan',
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
                note: '11:00–17:00 · sushi dentro de um armazém convertido, de frente para o canal. Peçam o *mamakari-zushi* — a sardinha local que, diz a lenda, é tão boa que você pede arroz emprestado ao vizinho.',
              },
              {
                name: 'Tsurugata',
                note: '11:00–14:00 · pousada de 1744, almoço em bandeja',
              },
            ],
          },
        ],
      },
      {
        id: 'd25-trem-himeji',
        time: '12:50',
        timeLabel: 'trem',
        kind: 'transit',
        name: 'Kurashiki → Okayama → Himeji',
        facts: 'Local **17 min** + Shinkansen **20 min** · ~¥3.900 · chegada ~13:45',
      },
      {
        id: 'd25-himeji',
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
                note: '11:00–22:30 · espetinhos empanados. **Regra sagrada: não molhar duas vezes no molho comunitário.** A placa está em toda parede.',
              },
              {
                name: 'Takoyaki Wanaka ou Hanadako',
                note: '10:00–23:00 · bolinho de polvo. Deixem esfriar 30 segundos ou vocês queimam o céu da boca — todo mundo queima.',
              },
              {
                name: 'Okonomiyaki Mizuno',
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
  {
    id: 'd2026-11-26',
    date: '2026-11-26',
    stageId: 'osaka',
    title: 'Osaka: castelo, mercado, o templo mais antigo, Shinsekai',
    subtitle: 'Dia inteiro na cidade, terminando no pôr do sol do Umeda Sky.',
    chips: ['castelo', 'sushi', 'história', 'compras'],
    stops: [
      {
        id: 'd26-castelo-osaka',
        time: '08:45',
        timeLabel: 'castelo',
        kind: 'sight',
        name: 'Castelo de Osaka',
        jp: '大阪城',
        facts: '**09:00–17:00** (última entrada 16:30) · ¥600 · jardim Nishinomaru ¥200',
        paragraphs: [
          'Sejamos honestos: o torreão atual é de **1931**, de concreto, com elevador. Mas as muralhas e os fossos são originais do século XVII, e há pedras de **mais de 100 toneladas** na base do portão Sakuramon, arrastadas de ilhas do Mar Interior por corda e tronco. O jardim Nishinomaru dá a melhor vista, e em novembro está com bordo.',
        ],
        history: {
          paragraphs: [
            'Toyotomi Hideyoshi — o camponês que virou o homem mais poderoso do Japão — mandou construir em **1583** o maior castelo que o país já tinha visto, deliberadamente maior que qualquer coisa que os Oda tivessem feito. Ele morreu em 1598 deixando um filho de cinco anos.',
            'Tokugawa Ieyasu esperou. Em 1614 e 1615, nos **cercos de inverno e de verão de Osaka**, ele destruiu os Toyotomi. A parte mais famosa: no cerco de inverno, Ieyasu negociou uma trégua cuja condição era aterrar o fosso externo — e então mandou aterrar o interno também, alegando má interpretação. No verão seguinte, o castelo sem fossos caiu em dias. O herdeiro e a mãe se suicidaram. Começaram 250 anos de paz Tokugawa.',
            'Os Tokugawa reconstruíram tudo nos anos 1620, **por cima** das ruínas de Hideyoshi, com muralhas ainda mais altas — o que existe hoje é literalmente o castelo Tokugawa em cima do castelo Toyotomi. O torreão deles foi atingido por um raio em 1665 e queimou. Ficou sem torre por 266 anos, até 1931, quando a população de Osaka doou o dinheiro da reconstrução em seis meses.',
          ],
        },
        mapQuery: 'Osaka Castle',
      },
      {
        id: 'd26-kuromon',
        time: '11:15',
        timeLabel: 'mercado',
        kind: 'sight',
        name: 'Kuromon Ichiba',
        jp: '黒門市場',
        facts: 'Maioria **09:00–18:00** · 580 m de galeria coberta · Nippombashi Stn',
        paragraphs: [
          'Mercado de rua desde cerca de 1822, hoje bem turístico mas ainda excelente: atum cortado na hora, uni, vieira grelhada, espetinho de wagyu, caranguejo, fugu na temporada. Comam pouco em cada banca e sigam andando.',
        ],
        mapQuery: 'Kuromon Ichiba Market Osaka',
      },
      {
        id: 'd26-sushi',
        time: '12:45',
        timeLabel: 'almoço',
        kind: 'food',
        name: 'Sushi em Osaka',
        eat: [
          {
            label: 'Duas escolas, escolham uma',
            items: [
              {
                name: 'Harukoma Sushi (Tenjinbashisuji)',
                note: '11:00–21:30, fecha ter · custo-benefício quase absurdo: peças grandes, peixe muito bom, ¥150–400 o par. Fila de 30–60 min. É o preferido dos locais.',
              },
              {
                name: 'Endō Sushi (Mercado Central)',
                note: '05:00–14:00, fecha dom e feriados · desde 1907, dentro do mercado atacadista. Serve só cinco combinados de quatro peças. Café da manhã de sushi de verdade — se topar acordar, troque a ordem do dia.',
              },
            ],
          },
        ],
        paragraphs: [
          'Curiosidade: o sushi de Osaka **não** é o nigiri de Tóquio. O tradicional daqui é o *oshizushi*, prensado em caixa de madeira — o *battera* de cavala é o clássico. Vale provar um em qualquer depachika.',
        ],
      },
      {
        id: 'd26-shitennoji',
        time: '14:15',
        timeLabel: 'templo',
        kind: 'temple',
        name: 'Shitennō-ji',
        jp: '四天王寺',
        facts: 'Pátio **08:30–16:30** · área interna ¥300 · Shitennoji-mae Stn',
        history: {
          paragraphs: [
            '**O primeiro templo budista administrado pelo Estado no Japão**, fundado em **593** pelo Príncipe Shōtoku. O contexto é uma guerra civil: dois clãs disputavam se o Japão deveria adotar o budismo, e Shōtoku prometeu construir um templo aos Quatro Reis Celestiais se vencesse. Venceu.',
            'Os prédios foram queimados e reconstruídos oito vezes (o último em 1963, em concreto), mas a **planta baixa nunca mudou em 1.400 anos**: portão, pagode e salão principal em linha reta, num eixo norte-sul. Esse arranjo tem nome — *Shitennōji-shiki* — e é o layout de templo mais antigo do Japão. É por isso que vale vir mesmo sabendo que os prédios são novos: o que é antigo aqui é o desenho.',
            'Shōtoku também fundou junto uma casa de repouso e um dispensário para os pobres. A Kongō Gumi, a construtora que ele contratou em 578 para erguer o templo, operou de forma independente até 2006 — foi **a empresa mais antiga do mundo**, 1.428 anos.',
          ],
        },
        mapQuery: 'Shitennoji Temple Osaka',
      },
      {
        id: 'd26-shinsekai',
        time: '15:30',
        timeLabel: 'bairro',
        kind: 'sight',
        name: 'Shinsekai & Tsūtenkaku',
        jp: '新世界・通天閣',
        facts: 'Torre **10:00–20:00** · ¥1.000 · Ebisuchō Stn',
        paragraphs: [
          '"Novo Mundo": um bairro construído em 1912 com a metade sul inspirada em Coney Island e a metade norte em Paris — com uma torre que imitava a Eiffel. Deu errado, o bairro decaiu, e ficou congelado. Hoje é neon barato, lanterna de *fugu* gigante, salão de pachinko e a maior concentração de kushikatsu do Japão. É brega e é maravilhoso.',
          'A torre atual é de 1956 — a original foi desmontada em 1943 e o ferro virou munição. No topo tem o **Billiken**, um deus da sorte americano de 1908 que os japoneses adotaram e nunca mais largaram. Esfreguem o pé dele.',
        ],
        mapQuery: 'Shinsekai Osaka',
      },
      {
        id: 'd26-umeda',
        time: '17:00',
        timeLabel: 'vista + compras',
        kind: 'view',
        name: 'Umeda',
        jp: '梅田',
        facts: 'Umeda Sky Floating Garden **09:30–22:30** · ¥2.000 · pôr do sol ~16:50',
        paragraphs: [
          'O observatório é ao ar livre, num anel suspenso entre duas torres a 173 m, ligado por uma escada rolante que atravessa o vazio. Sobe antes do pôr do sol.',
        ],
        eat: [
          {
            label: 'Compras em Umeda, se faltou algo',
            items: [
              {
                name: 'Yodobashi Umeda',
                note: '09:30–22:00 · eletrônicos, ótimo lugar para fechar o robô aspirador se já decidiram o modelo',
              },
              {
                name: 'LUCUA / Grand Front',
                note: '10:00–21:00 · Uniqlo, Muji e o resto num prédio só',
              },
              {
                name: 'Hankyu Umeda depachika',
                note: '10:00–20:00 · provavelmente o melhor subsolo de comida do Japão',
              },
            ],
          },
        ],
        mapQuery: 'Umeda Sky Building',
      },
      {
        id: 'd26-jantar',
        time: '19:30',
        timeLabel: 'jantar',
        kind: 'food',
        name: 'Jantar',
        eat: [
          {
            label: 'Ramen de Osaka',
            items: [
              {
                name: 'Ramen Jinsei JET (Fukushima)',
                note: '11:30–14:30 / 18:00–21:00, fecha dom · caldo duplo de peixe e frango, um dos mais premiados do Japão. Casa minúscula.',
              },
              {
                name: 'Menya Joroku',
                note: '11:00–15:00 / 18:00–22:00 · shoyu clássico, elegante',
              },
              {
                name: 'Kani Dōraku Dōtonbori',
                note: '11:00–22:00 · se quiserem caranguejo, é a casa do caranguejo mecânico gigante. Turístico, mas o caranguejo é bom e a temporada é agora.',
              },
            ],
          },
        ],
        paragraphs: [
          '**Se sobrar energia:** Nipponbashi Den-Den Town, a Akihabara de Osaka — mais lojas de Magic (BIG MAGIC Nipponbashi) e de retrogame, com preços em geral melhores que Tóquio.',
        ],
      },
    ],
  },
];
